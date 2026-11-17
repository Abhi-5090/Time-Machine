/**
 * Lottie animation data, built in code.
 *
 * Every animation here is driven purely by transform, opacity and colour
 * keyframes on simple shapes (ellipse, rect, polystar, polygon path). That is
 * the subset of the Lottie format that renders identically everywhere, which
 * matters more than exotic features when the icons are load-bearing UI.
 *
 * Colours are resolved at render time from the active theme, so the same icon
 * is brass on the past timeline and signal-cyan in 2050 without a second file.
 */

const VERSION = '5.9.0';
const FRAME_RATE = 60;

/* ── Colour ─────────────────────────────────────────────────────────────── */

/** Lottie stores colour as normalised RGB. Accepts #rgb, #rrggbb or rgb(). */
export function toLottieColor(input, fallback = [1, 1, 1, 1]) {
  if (!input) return fallback;
  const value = String(input).trim();

  const hex = value.replace('#', '');
  if (/^[0-9a-f]{3}$/i.test(hex)) {
    const [r, g, b] = hex.split('').map((c) => parseInt(c + c, 16) / 255);
    return [r, g, b, 1];
  }
  if (/^[0-9a-f]{6}$/i.test(hex)) {
    return [
      parseInt(hex.slice(0, 2), 16) / 255,
      parseInt(hex.slice(2, 4), 16) / 255,
      parseInt(hex.slice(4, 6), 16) / 255,
      1,
    ];
  }

  const rgb = value.match(/rgba?\(([^)]+)\)/i);
  if (rgb) {
    const parts = rgb[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    if (parts.length >= 3) {
      return [parts[0] / 255, parts[1] / 255, parts[2] / 255, parts[3] ?? 1];
    }
  }

  return fallback;
}

/* ── Property builders ──────────────────────────────────────────────────── */

/** A static property. */
const fixed = (value) => ({ a: 0, k: value });

/**
 * An animated property.
 * `stops` is [[frame, value], …]; values may be numbers or arrays.
 * The easing defaults to a strong ease-out so motion departs immediately.
 */
function animated(stops, ease = [0.4, 0, 0.2, 1]) {
  const [ox, oy, ix, iy] = ease;
  const keyframes = stops.map(([t, value], index) => {
    const frame = { t, s: Array.isArray(value) ? value : [value] };
    if (index < stops.length - 1) {
      const dims = frame.s.length;
      frame.i = { x: Array(dims).fill(ix), y: Array(dims).fill(iy) };
      frame.o = { x: Array(dims).fill(ox), y: Array(dims).fill(oy) };
    }
    return frame;
  });
  return { a: 1, k: keyframes };
}

const LINEAR = [0, 0, 1, 1];

/* ── Shape builders ─────────────────────────────────────────────────────── */

const ellipse = (size, position = [0, 0]) => ({
  ty: 'el',
  d: 1,
  s: fixed(Array.isArray(size) ? size : [size, size]),
  p: fixed(position),
  nm: 'ellipse',
});

const rect = (width, height, radius = 0, position = [0, 0]) => ({
  ty: 'rc',
  d: 1,
  s: fixed([width, height]),
  p: fixed(position),
  r: fixed(radius),
  nm: 'rect',
});

const star = ({ points = 5, outer = 20, inner = 9, rotation = 0 }) => ({
  ty: 'sr',
  sy: 1,
  d: 1,
  pt: fixed(points),
  p: fixed([0, 0]),
  r: fixed(rotation),
  ir: fixed(inner),
  is: fixed(0),
  or: fixed(outer),
  os: fixed(0),
  nm: 'star',
});

/** Straight-edged polygon from [[x, y], …]. Zero tangents keep the edges hard. */
const polygon = (vertices, closed = true) => ({
  ty: 'sh',
  d: 1,
  ks: fixed({
    i: vertices.map(() => [0, 0]),
    o: vertices.map(() => [0, 0]),
    v: vertices,
    c: closed,
  }),
  nm: 'polygon',
});

/** Group transform. Must always be the last item in a group. */
const groupTransform = ({ position = [0, 0], anchor = [0, 0], scale = [100, 100], rotation = 0, opacity = 100 } = {}) => ({
  ty: 'tr',
  p: typeof position?.a === 'number' ? position : fixed(position),
  a: fixed(anchor),
  s: typeof scale?.a === 'number' ? scale : fixed(scale),
  r: typeof rotation?.a === 'number' ? rotation : fixed(rotation),
  o: typeof opacity?.a === 'number' ? opacity : fixed(opacity),
  sk: fixed(0),
  sa: fixed(0),
  nm: 'transform',
});

const stroke = (color, width, opacity = 100) => ({
  ty: 'st',
  c: fixed(color),
  o: typeof opacity === 'number' ? fixed(opacity) : opacity,
  w: typeof width === 'number' ? fixed(width) : width,
  lc: 2,
  lj: 2,
  bm: 0,
  nm: 'stroke',
});

const fill = (color, opacity = 100) => ({
  ty: 'fl',
  c: fixed(color),
  o: typeof opacity === 'number' ? fixed(opacity) : opacity,
  r: 1,
  bm: 0,
  nm: 'fill',
});

/**
 * A shape group.
 *
 * Every group must end with a `tr` item; one is appended automatically when the
 * caller did not supply its own, because a group without a transform is skipped
 * by the renderer rather than reported as an error.
 */
const group = (items, name = 'group') => {
  const contents = items.at(-1)?.ty === 'tr' ? items : [...items, groupTransform()];
  return { ty: 'gr', nm: name, np: contents.length, it: contents, bm: 0, hd: false };
};

/* ── Layer / document builders ──────────────────────────────────────────── */

/**
 * A shape layer. `outPoint` may be omitted, in which case `document()` fills it
 * in with the composition's duration — lottie-web treats a layer without an out
 * point as zero-length and silently renders nothing.
 */
function shapeLayer({ index, name, shapes, transform = {}, inPoint = 0, outPoint }) {
  return {
    ddd: 0,
    ind: index,
    ty: 4,
    nm: name,
    sr: 1,
    ks: {
      o: transform.opacity ?? fixed(100),
      r: transform.rotation ?? fixed(0),
      p: transform.position ?? fixed([32, 32, 0]),
      a: transform.anchor ?? fixed([0, 0, 0]),
      s: transform.scale ?? fixed([100, 100, 100]),
    },
    ao: 0,
    shapes,
    ip: inPoint,
    op: outPoint,
    st: 0,
    bm: 0,
  };
}

function document_({ name, duration, layers, size = 64 }) {
  return {
    v: VERSION,
    fr: FRAME_RATE,
    ip: 0,
    op: duration,
    w: size,
    h: size,
    nm: name,
    ddd: 0,
    assets: [],
    layers: layers.map((layer) => (layer.op === undefined ? { ...layer, op: duration } : layer)),
  };
}

export const lottie = {
  fixed,
  animated,
  LINEAR,
  ellipse,
  rect,
  star,
  polygon,
  stroke,
  fill,
  group,
  groupTransform,
  shapeLayer,
  document: document_,
};
