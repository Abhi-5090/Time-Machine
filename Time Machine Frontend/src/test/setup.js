import '@testing-library/jest-dom';
import { vi } from 'vitest';

/*
 * jsdom implements neither the observers nor the canvas APIs the animation
 * layer relies on. Rather than guarding every call site for the benefit of the
 * test environment, the missing pieces are stubbed here.
 */

if (typeof window !== 'undefined') {
  window.matchMedia =
    window.matchMedia ||
    ((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }));

  window.scrollTo = window.scrollTo || (() => {});

  // Framer Motion's useInView and our own reveal helpers need this. The stub
  // reports elements as immediately visible so content under a scroll reveal is
  // assertable without faking scroll.
  class MockIntersectionObserver {
    constructor(callback) {
      this.callback = callback;
    }

    observe(target) {
      this.callback([{ isIntersecting: true, intersectionRatio: 1, target }], this);
    }

    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }

  window.IntersectionObserver = window.IntersectionObserver || MockIntersectionObserver;
  global.IntersectionObserver = window.IntersectionObserver;

  class MockResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  window.ResizeObserver = window.ResizeObserver || MockResizeObserver;
  global.ResizeObserver = window.ResizeObserver;

  // jsdom ships no canvas implementation. A null context is not enough here:
  // lottie-web probes for a 2D context the moment it is imported and throws if
  // it does not get one, which would take down any test that renders an icon.
  // This stub answers every call the renderers make and records nothing.
  const canvasGradient = { addColorStop: () => {} };
  const context2d = new Proxy(
    {
      canvas: null,
      createLinearGradient: () => canvasGradient,
      createRadialGradient: () => canvasGradient,
      createPattern: () => null,
      getImageData: () => ({ data: new Uint8ClampedArray(4), width: 1, height: 1 }),
      measureText: () => ({ width: 0 }),
      getContextAttributes: () => ({ alpha: true }),
    },
    {
      get(target, property) {
        if (property in target) return target[property];
        // Drawing state (fillStyle, lineWidth …) reads and writes freely;
        // everything else is treated as a no-op drawing command.
        return typeof property === 'string' ? () => {} : undefined;
      },
      set() {
        return true;
      },
    }
  );

  HTMLCanvasElement.prototype.getContext = function getContext(type) {
    return type === '2d' ? context2d : null;
  };

  window.requestAnimationFrame =
    window.requestAnimationFrame || ((callback) => setTimeout(() => callback(performance.now()), 16));
  window.cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;

  if (!window.URL.createObjectURL) {
    window.URL.createObjectURL = vi.fn(() => 'blob:mock');
    window.URL.revokeObjectURL = vi.fn();
  }
}
