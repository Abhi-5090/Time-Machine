/**
 * Download and export helpers.
 *
 * Both heavy libraries (html-to-image, jspdf) are imported dynamically so the
 * ~400 KB they weigh is only fetched when a reader actually asks for a file,
 * rather than on every page view.
 */

function triggerDownload(href, filename) {
  const link = document.createElement('a');
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function slugify(value, fallback = 'time-machine') {
  const slug = String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return slug || fallback;
}

/** Saves the generated portrait, preserving whatever type the server served. */
export async function downloadPortrait(portraitUrl, name) {
  const response = await fetch(portraitUrl);
  if (!response.ok) throw new Error('The portrait could not be downloaded.');

  const blob = await response.blob();
  const extension = blob.type.includes('svg') ? 'svg' : blob.type.includes('jpeg') ? 'jpg' : 'png';
  const objectUrl = URL.createObjectURL(blob);

  triggerDownload(objectUrl, `${slugify(name)}-portrait.${extension}`);
  // Revoked on the next tick so the click has already been handled.
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

/**
 * Shares a link, preferring the native share sheet and falling back to the
 * clipboard. Returns which one was used so the caller can word the confirmation
 * correctly — telling someone "copied" when a share sheet opened is the kind of
 * small lie that makes an interface feel careless.
 */
export async function shareLink(url, { title, text } = {}) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return 'shared';
    } catch (error) {
      // A cancelled share sheet is not a failure; fall through to the clipboard.
      if (error?.name === 'AbortError') return 'cancelled';
    }
  }

  await navigator.clipboard.writeText(url);
  return 'copied';
}

/* ── The report card ───────────────────────────────────────────────────────
   The card is laid out at a fixed 794 x 1123 (A4 at 96dpi) and then scaled
   down with a transform to fit the screen. Exporting it means undoing that
   scale on the clone: without it, a reader on a phone would download a sheet
   rendered at a third of the size, letterboxed inside the right-shaped box.

   `style` is applied to the clone only, so the page on screen never flickers
   back to full size mid-export.                                            */

const SHEET_WIDTH = 794;
const SHEET_HEIGHT = 1123;
/* 2x gives a 1588 x 2246 PNG — about 190dpi at A4, which prints cleanly and
   still looks sharp zoomed in on a phone. */
const SHEET_PIXEL_RATIO = 2;

function sheetOptions() {
  return {
    width: SHEET_WIDTH,
    height: SHEET_HEIGHT,
    pixelRatio: SHEET_PIXEL_RATIO,
    cacheBust: true,
    style: { transform: 'none', transformOrigin: 'top left', margin: '0' },
    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#ffffff',
  };
}

/** Downloads the report card as a PNG at full A4 resolution. */
export async function exportSheetAsImage(node, name) {
  if (!node) throw new Error('The card is not ready yet.');
  const { toPng } = await import('html-to-image');

  const dataUrl = await toPng(node, sheetOptions());
  triggerDownload(dataUrl, `${slugify(name)}-card.png`);
}

/** The same card, placed on a real A4 PDF page rather than a page cut to fit. */
export async function exportSheetAsPdf(node, name) {
  if (!node) throw new Error('The card is not ready yet.');

  const [{ toPng }, { jsPDF }] = await Promise.all([import('html-to-image'), import('jspdf')]);
  const dataUrl = await toPng(node, sheetOptions());

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  // 210 x 297mm exactly: the capture already has A4's proportions, so it lands
  // edge to edge with no letterboxing and nothing cropped.
  pdf.addImage(dataUrl, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
  pdf.save(`${slugify(name)}-card.pdf`);
}

/* ── The QR code ───────────────────────────────────────────────────────────
   A card is readable by anyone who has its address: the owner token is only
   required to delete one or to redo its picture (see the API's auth
   middleware). That is what makes this work at a stall — the code can carry
   the plain address, a stranger's phone opens the card read-only, and nothing
   that could destroy it travels in a QR code pointed at a crowd.           */

/** The address of a finished card, as a phone should open it. */
export function cardUrl(readingId, origin) {
  const base = (origin || window.location.origin).replace(/\/+$/, '');
  return `${base}/reading/${readingId}`;
}

/**
 * Renders a URL as a QR code, returned as a PNG data URL.
 *
 * Black on white, always, rather than the timeline's ink on its paper. A
 * scanner needs contrast between the modules and the quiet zone far more than
 * this needs to match the page, and sienna-on-cream is exactly the kind of
 * tasteful choice that fails under the bad lighting of a venue. The white
 * tile it sits on is doing the matching instead.
 *
 * Rendered at 960px even though it displays at about 180: the same image is
 * what gets saved, and a QR screenshotted off a phone and reprinted wants the
 * resolution.
 */
export async function renderQrCode(url, { width = 960, margin = 2 } = {}) {
  const module = await import('qrcode');
  const toDataURL = module.toDataURL || module.default?.toDataURL;
  if (!toDataURL) throw new Error('The QR code library could not be loaded.');

  return toDataURL(url, {
    width,
    margin,
    // 'M' recovers from ~15% damage, which covers a thumb-print on a phone
    // screen without making the modules too fine to read at this size.
    errorCorrectionLevel: 'M',
    color: { dark: '#101010', light: '#ffffff' },
  });
}

/** Saves the QR code itself, for printing or for keeping. */
export function downloadQrCode(dataUrl, name) {
  if (!dataUrl) throw new Error('The QR code is not ready yet.');
  triggerDownload(dataUrl, `${slugify(name)}-scan-me.png`);
}
