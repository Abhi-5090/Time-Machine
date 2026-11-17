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

/** Renders a DOM node to a PNG. */
export async function exportNodeAsImage(node, name) {
  if (!node) throw new Error('Nothing to export.');
  const { toPng } = await import('html-to-image');

  const dataUrl = await toPng(node, {
    pixelRatio: 2,
    cacheBust: true,
    // html-to-image inlines computed styles; reading the page background keeps
    // the exported image on the right timeline rather than transparent.
    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#ffffff',
  });

  triggerDownload(dataUrl, `${slugify(name)}.png`);
}

/** Renders a DOM node into a single-page PDF sized to the capture. */
export async function exportNodeAsPdf(node, name) {
  if (!node) throw new Error('Nothing to export.');

  const [{ toPng }, { jsPDF }] = await Promise.all([import('html-to-image'), import('jspdf')]);

  const background = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#ffffff';
  const dataUrl = await toPng(node, { pixelRatio: 2, cacheBust: true, backgroundColor: background });

  const image = new Image();
  image.src = dataUrl;
  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = () => reject(new Error('The export could not be rendered.'));
  });

  const orientation = image.width > image.height ? 'landscape' : 'portrait';
  const pdf = new jsPDF({ orientation, unit: 'px', format: [image.width, image.height] });
  pdf.addImage(dataUrl, 'PNG', 0, 0, image.width, image.height);
  pdf.save(`${slugify(name)}.pdf`);
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
