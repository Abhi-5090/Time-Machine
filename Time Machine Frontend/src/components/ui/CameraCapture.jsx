import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from './Icon';
import { EASE_OUT, DURATION } from '../../motion/easings';

/** The longest side we keep. A webcam frame is plenty at this size, and it
 *  keeps the upload well inside the 5 MB ceiling without a visible loss. */
const MAX_EDGE = 1440;
const JPEG_QUALITY = 0.92;

/** True only where a camera can actually be opened: getUserMedia is absent on
 *  http origins other than localhost, and in jsdom. Checked before the button
 *  is offered rather than after it is pressed — a control that always fails is
 *  worse than one that is not there. */
export const cameraSupported = () =>
  typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia);

function messageFor(error) {
  switch (error?.name) {
    case 'NotAllowedError':
    case 'SecurityError':
      return 'The camera is blocked. Allow camera access for this site in your browser, then try again — or pick a file instead.';
    case 'NotFoundError':
    case 'OverconstrainedError':
      return 'We could not find a camera on this device. Pick a file instead.';
    case 'NotReadableError':
      return 'Another app is using the camera. Close it and try again.';
    default:
      return 'We could not open the camera. Pick a file instead.';
  }
}

/**
 * The camera card.
 *
 * It opens in place — where the chooser was, not over the page — so the reader
 * stays where they were and the wizard does not jump. Three states only:
 * live, reviewing the shot, or an error with a way out.
 *
 * Two things here are easy to get wrong and both matter:
 *
 *  · Every track is stopped on unmount and on retry. A stream left running
 *    keeps the camera light on after the card is gone, which people rightly
 *    read as being recorded.
 *  · The front camera is mirrored in the preview *and* in the captured file,
 *    and the preview's crop is reapplied when the frame is drawn to canvas.
 *    Framing a shot of yourself in a non-mirrored preview is disorienting, and
 *    confirming a picture that is flipped — or wider — than the one you just
 *    framed is worse. What you tick is exactly what you saw.
 */
export function CameraCapture({ onCapture, onCancel, busy = false }) {
  const videoRef = useRef(null);
  const stageRef = useRef(null);
  const streamRef = useRef(null);
  const shotRef = useRef(null);

  const [phase, setPhase] = useState('starting'); // starting | live | review | error
  const [error, setError] = useState(null);
  const [shot, setShot] = useState(null);
  const [facing, setFacing] = useState('user');
  const [canFlip, setCanFlip] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const mirrored = facing === 'user';

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    let cancelled = false;
    setPhase('starting');
    setError(null);

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 1280 } },
          audio: false,
        });

        // The card can unmount while the permission prompt is still open.
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setPhase('live');

        // Labels are only populated once permission is granted, which is why
        // this runs here rather than before the stream is opened.
        const devices = await navigator.mediaDevices.enumerateDevices().catch(() => []);
        if (!cancelled) setCanFlip(devices.filter((d) => d.kind === 'videoinput').length > 1);
      } catch (err) {
        if (cancelled) return;
        setError(messageFor(err));
        setPhase('error');
      }
    })();

    return () => {
      cancelled = true;
      stopStream();
    };
  }, [facing, attempt, stopStream]);

  // The object URL for a discarded shot is revoked, not left to the page.
  useEffect(
    () => () => {
      if (shotRef.current) URL.revokeObjectURL(shotRef.current);
    },
    []
  );

  const takeShot = () => {
    const video = videoRef.current;
    const stage = stageRef.current;
    if (!video?.videoWidth || !stage) return;

    // The preview fills its frame with `object-fit: cover`, so part of the
    // camera's view is off the sides or the top of what the reader can see.
    // The same crop is applied here. Saving the fuller frame instead would
    // hand back a picture nobody composed — the point of the review step is
    // that the file is the shot they just looked at.
    // If the frame has no measurable size — hidden, or an environment with no
    // layout — fall back to the whole camera frame rather than dividing by
    // zero and drawing an empty canvas.
    const { videoWidth: vw, videoHeight: vh } = video;
    const targetRatio = (stage.clientWidth || vw) / (stage.clientHeight || vh);

    const sourceWidth = vw / vh > targetRatio ? vh * targetRatio : vw;
    const sourceHeight = vw / vh > targetRatio ? vh : vw / targetRatio;
    const sourceX = (vw - sourceWidth) / 2;
    const sourceY = (vh - sourceHeight) / 2;

    const edge = Math.max(sourceWidth, sourceHeight);
    const scale = edge > MAX_EDGE ? MAX_EDGE / edge : 1;
    const width = Math.round(sourceWidth * scale);
    const height = Math.round(sourceHeight * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (mirrored) {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        if (shotRef.current) URL.revokeObjectURL(shotRef.current);
        const url = URL.createObjectURL(blob);
        shotRef.current = url;
        setShot({
          url,
          file: new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' }),
        });
        setPhase('review');
      },
      'image/jpeg',
      JPEG_QUALITY
    );
  };

  const retake = () => {
    if (shotRef.current) URL.revokeObjectURL(shotRef.current);
    shotRef.current = null;
    setShot(null);
    setPhase('live');
  };

  return (
    <motion.div
      className="camera-card"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.base, ease: EASE_OUT }}
    >
      <div className="camera-card__head">
        <p className="camera-card__title">
          <Icon name="capture" size={14} />
          {phase === 'review' ? 'Happy with this one?' : 'Camera'}
        </p>
        <button type="button" className="camera-card__dismiss" onClick={onCancel} aria-label="Close the camera">
          <Icon name="close" size={14} />
        </button>
      </div>

      <div className="camera-stage" data-phase={phase} ref={stageRef}>
        {/* The video element stays mounted across capture so retaking is
            instant — tearing the stream down and asking for it again puts a
            second of black between the reader and another try. */}
        <video
          ref={videoRef}
          className="camera-stage__video"
          data-mirrored={mirrored}
          data-hidden={phase === 'review' || undefined}
          playsInline
          muted
          autoPlay
        />

        {phase === 'review' && shot ? (
          <img src={shot.url} alt="The photo you just took" className="camera-stage__shot" />
        ) : null}

        {phase === 'starting' ? <p className="camera-stage__note">Opening the camera…</p> : null}

        {phase === 'error' ? (
          <div className="camera-stage__note camera-stage__note--error">
            <Icon name="warning" size={18} />
            <p>{error}</p>
          </div>
        ) : null}
      </div>

      <div className="camera-actions">
        {phase === 'review' ? (
          <>
            <button type="button" className="btn btn-secondary" onClick={retake} disabled={busy}>
              <Icon name="retry" size={14} />
              Take it again
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onCapture(shot.file)}
              disabled={busy}
            >
              <Icon name="check" size={14} />
              {busy ? 'Adding…' : 'Use this photo'}
            </button>
          </>
        ) : phase === 'error' ? (
          <>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Pick a file instead
            </button>
            <button type="button" className="btn btn-primary" onClick={() => setAttempt((n) => n + 1)}>
              <Icon name="retry" size={14} />
              Try again
            </button>
          </>
        ) : (
          <>
            {canFlip ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setFacing((f) => (f === 'user' ? 'environment' : 'user'))}
                disabled={phase !== 'live'}
              >
                <Icon name="retry" size={14} />
                Flip
              </button>
            ) : null}
            <button
              type="button"
              className="camera-shutter"
              onClick={takeShot}
              disabled={phase !== 'live'}
              aria-label="Take the photo"
            >
              <span className="camera-shutter__ring" />
              <span className="camera-shutter__dot" />
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
