import { describe, it, expect } from 'vitest';
import { LOTTIE_ICONS, LOTTIE_ICON_NAMES } from '../lottie/library';
import { toLottieColor } from '../lottie/factory';

/**
 * The icons are generated rather than exported from After Effects, so nothing
 * else would catch a malformed document until it silently failed to render in
 * the browser. These assertions encode the parts of the Lottie format that
 * lottie-web actually requires.
 */

const COLORS = { primary: '#C9A227', secondary: '#5EF2FF' };

describe('toLottieColor', () => {
  it('normalises hex and rgb into 0–1 components', () => {
    expect(toLottieColor('#ffffff')).toEqual([1, 1, 1, 1]);
    expect(toLottieColor('#000')).toEqual([0, 0, 0, 1]);
    expect(toLottieColor('rgb(255, 0, 0)')).toEqual([1, 0, 0, 1]);
  });

  it('falls back rather than emitting an invalid colour', () => {
    expect(toLottieColor('')).toEqual([1, 1, 1, 1]);
    expect(toLottieColor('not-a-colour')).toEqual([1, 1, 1, 1]);
  });
});

describe('Lottie icon library', () => {
  it('exposes every icon the UI references', () => {
    for (const name of ['hourglass', 'compass', 'bloom', 'orbit', 'pulse', 'radar', 'aperture', 'scan', 'spark', 'loader']) {
      expect(LOTTIE_ICON_NAMES).toContain(name);
    }
  });

  it.each(LOTTIE_ICON_NAMES)('%s produces a valid Lottie document', (name) => {
    const data = LOTTIE_ICONS[name](COLORS);

    expect(data.v).toBeTruthy();
    expect(data.fr).toBeGreaterThan(0);
    expect(data.op).toBeGreaterThan(0);
    expect(data.w).toBe(64);
    expect(data.h).toBe(64);
    expect(data.layers.length).toBeGreaterThan(0);

    const indices = data.layers.map((layer) => layer.ind);
    expect(new Set(indices).size).toBe(indices.length);

    for (const layer of data.layers) {
      // Transform block must be complete or lottie-web throws on load.
      for (const key of ['o', 'r', 'p', 'a', 's']) {
        expect(layer.ks[key]).toBeDefined();
      }
      expect(layer.op).toBeGreaterThan(layer.ip);

      for (const shape of layer.shapes) {
        expect(shape.ty).toBe('gr');
        // A shape group's transform must be its final item.
        expect(shape.it.at(-1).ty).toBe('tr');
      }

      for (const property of Object.values(layer.ks)) {
        if (property.a !== 1) continue;
        let previousFrame = -Infinity;
        property.k.forEach((keyframe, index) => {
          expect(keyframe.t).toBeGreaterThanOrEqual(previousFrame);
          previousFrame = keyframe.t;
          expect(Array.isArray(keyframe.s)).toBe(true);
          // Every keyframe but the last needs both tangents.
          if (index < property.k.length - 1) {
            expect(keyframe.i).toBeDefined();
            expect(keyframe.o).toBeDefined();
            expect(keyframe.i.x.length).toBe(keyframe.s.length);
          }
        });
      }
    }
  });

  it('keeps each icon small enough to inline without a payload concern', () => {
    for (const name of LOTTIE_ICON_NAMES) {
      const bytes = JSON.stringify(LOTTIE_ICONS[name](COLORS)).length;
      expect(bytes).toBeLessThan(24_000);
    }
  });

  it('threads the theme colour through to the rendered shapes', () => {
    const data = LOTTIE_ICONS.orbit({ primary: '#ff0000', secondary: '#00ff00' });
    const serialised = JSON.stringify(data);
    expect(serialised).toContain('[1,0,0,1]');
    expect(serialised).toContain('[0,1,0,1]');
  });
});
