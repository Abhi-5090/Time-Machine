import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from './api';
import { rememberReading } from './archive';

const POLL_INTERVAL = 1300;
const MAX_POLL_MS = 5 * 60 * 1000;

/**
 * Fetches a reading and, while it is still generating, keeps fetching.
 *
 * Polling stops the moment the reading completes or fails, gives up after five
 * minutes rather than hammering a stuck job forever, and pauses while the tab
 * is hidden — a reader who switches away mid-generation should not be paying
 * for requests nobody is looking at.
 */
export function useReading(readingId, { poll = true } = {}) {
  const [reading, setReading] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const timerRef = useRef(null);
  const startedRef = useRef(Date.now());
  const activeRef = useRef(true);

  const fetchOnce = useCallback(async () => {
    try {
      const response = await api.getReading(readingId);
      if (!activeRef.current) return null;

      const data = response.data;
      setReading(data);
      setError(null);
      setLoading(false);

      // Keep the local archive in step so the Archive page reflects reality
      // without a second round trip.
      rememberReading({
        readingId: data.readingId,
        timeline: data.timeline,
        status: data.status,
        title: data.title,
        portraitUrl: data.portraitUrl,
        archetype: data.archetype?.name,
        name:
          data.timeline === 'future'
            ? data.futureProfile?.personaName
            : data.characterProfile?.characterName,
      });

      return data;
    } catch (fetchError) {
      if (!activeRef.current) return null;
      setError(fetchError);
      setLoading(false);
      return null;
    }
  }, [readingId]);

  useEffect(() => {
    activeRef.current = true;
    startedRef.current = Date.now();

    const schedule = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(run, POLL_INTERVAL);
    };

    const run = async () => {
      if (!activeRef.current) return;
      if (document.hidden) {
        schedule();
        return;
      }

      const data = await fetchOnce();
      if (!activeRef.current) return;

      const settled = data?.status === 'completed' || data?.status === 'failed';
      const expired = Date.now() - startedRef.current > MAX_POLL_MS;

      if (poll && !settled && !expired) schedule();
    };

    run();

    return () => {
      activeRef.current = false;
      clearTimeout(timerRef.current);
    };
  }, [readingId, poll, fetchOnce]);

  return { reading, error, loading, refetch: fetchOnce };
}
