import { lottie, toLottieColor } from './factory';

const {
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
  document: doc,
} = lottie;

const CENTRE = fixed([32, 32, 0]);

/**
 * The icon library.
 *
 * Each entry is a builder taking the resolved theme colours and returning
 * Lottie animation data. Keeping them as functions (rather than frozen JSON)
 * is what lets one icon render in brass on the past timeline and in cyan in
 * 2050 without shipping two files.
 *
 * Builder signature: ({ primary, secondary }) => LottieAnimationData
 * where `primary` / `secondary` are CSS colour strings.
 */
export const LOTTIE_ICONS = {
  /** Past: an hourglass that turns itself over. */
  hourglass: ({ primary, secondary }) => {
    const main = toLottieColor(primary);
    const sand = toLottieColor(secondary);

    return doc({
      name: 'hourglass',
      duration: 180,
      layers: [
        // The grain, falling through the waist and resetting with the turn.
        shapeLayer({
          index: 1,
          name: 'grain',
          shapes: [group([ellipse(3.6), fill(sand)], 'grain')],
          transform: {
            position: animated(
              [
                [0, [32, 28, 0]],
                [120, [32, 44, 0]],
                [121, [32, 28, 0]],
                [180, [32, 44, 0]],
              ],
              [0.3, 0, 0.7, 1]
            ),
            opacity: animated(
              [
                [0, 0],
                [16, 100],
                [104, 100],
                [120, 0],
                [136, 0],
                [152, 100],
                [180, 100],
              ],
              LINEAR
            ),
          },
        }),
        // The glass. Rotates a half-turn at the end of each cycle.
        shapeLayer({
          index: 2,
          name: 'glass',
          shapes: [
            group([polygon([[-15, -21], [15, -21], [0, -1]]), fill(main, 78)], 'bulb-top'),
            group([polygon([[-15, 21], [15, 21], [0, 1]]), fill(main, 42)], 'bulb-bottom'),
            group([rect(36, 3, 1.5, [0, -21]), fill(main)], 'cap-top'),
            group([rect(36, 3, 1.5, [0, 21]), fill(main)], 'cap-bottom'),
          ],
          transform: {
            position: CENTRE,
            rotation: animated(
              [
                [0, 0],
                [120, 0],
                [160, 180],
                [180, 180],
              ],
              [0.65, 0, 0.35, 1]
            ),
          },
        }),
      ],
    });
  },

  /** Past: a compass needle settling, never quite still. */
  compass: ({ primary, secondary }) => {
    const main = toLottieColor(primary);
    const needle = toLottieColor(secondary);

    return doc({
      name: 'compass',
      duration: 240,
      layers: [
        shapeLayer({
          index: 1,
          name: 'needle',
          shapes: [
            group([polygon([[0, -18], [5, 0], [0, 5], [-5, 0]]), fill(needle)], 'north'),
            group([polygon([[0, 18], [5, 0], [0, -5], [-5, 0]]), fill(main, 45)], 'south'),
            group([ellipse(5), fill(main)], 'pivot'),
          ],
          transform: {
            position: CENTRE,
            rotation: animated(
              [
                [0, -24],
                [70, 18],
                [130, -8],
                [180, 6],
                [240, -24],
              ],
              [0.45, 0, 0.3, 1]
            ),
          },
        }),
        shapeLayer({
          index: 2,
          name: 'bezel',
          shapes: [
            group([ellipse(54), stroke(main, 2.4, 72)], 'ring'),
            group([rect(2, 6, 1, [0, -25]), fill(main, 85)], 'tick-n'),
            group([rect(2, 6, 1, [0, 25]), fill(main, 45)], 'tick-s'),
            group([rect(6, 2, 1, [25, 0]), fill(main, 45)], 'tick-e'),
            group([rect(6, 2, 1, [-25, 0]), fill(main, 45)], 'tick-w'),
          ],
          transform: { position: CENTRE },
        }),
      ],
    });
  },

  /** Past: a slow bloom opening. Used for completion moments. */
  bloom: ({ primary, secondary }) => {
    const main = toLottieColor(primary);
    const core = toLottieColor(secondary);
    const petalCount = 6;

    return doc({
      name: 'bloom',
      duration: 200,
      layers: [
        shapeLayer({
          index: 1,
          name: 'core',
          shapes: [group([ellipse(11), fill(core)], 'core')],
          transform: {
            position: CENTRE,
            scale: animated(
              [
                [0, [40, 40, 100]],
                [60, [112, 112, 100]],
                [110, [96, 96, 100]],
                [200, [40, 40, 100]],
              ],
              [0.2, 0, 0.2, 1]
            ),
          },
        }),
        ...Array.from({ length: petalCount }, (_, i) =>
          shapeLayer({
            index: i + 2,
            name: `petal-${i}`,
            shapes: [
              group(
                [ellipse([13, 24], [0, -15]), fill(main, 66), groupTransform({ rotation: (360 / petalCount) * i })],
                `petal-${i}`
              ),
            ],
            transform: {
              position: CENTRE,
              scale: animated(
                [
                  [0, [20, 20, 100]],
                  [10 + i * 7, [20, 20, 100]],
                  [60 + i * 7, [100, 100, 100]],
                  [150, [100, 100, 100]],
                  [200, [20, 20, 100]],
                ],
                [0.18, 0, 0.2, 1]
              ),
              opacity: animated(
                [
                  [0, 0],
                  [10 + i * 7, 0],
                  [50 + i * 7, 100],
                  [160, 100],
                  [200, 0],
                ],
                LINEAR
              ),
            },
          })
        ),
      ],
    });
  },

  /** Threshold: one body orbiting another. The portal's signature mark. */
  orbit: ({ primary, secondary }) => {
    const main = toLottieColor(primary);
    const satellite = toLottieColor(secondary);

    return doc({
      name: 'orbit',
      duration: 240,
      layers: [
        shapeLayer({
          index: 1,
          name: 'satellite',
          shapes: [group([ellipse(8, [0, -23]), fill(satellite)], 'satellite')],
          transform: {
            position: CENTRE,
            rotation: animated(
              [
                [0, 0],
                [240, 360],
              ],
              LINEAR
            ),
          },
        }),
        shapeLayer({
          index: 2,
          name: 'path',
          shapes: [group([ellipse(46), stroke(main, 1.4, 40)], 'path')],
          transform: { position: CENTRE },
        }),
        shapeLayer({
          index: 3,
          name: 'primary',
          shapes: [group([ellipse(14), fill(main)], 'primary')],
          transform: {
            position: CENTRE,
            scale: animated(
              [
                [0, [100, 100, 100]],
                [120, [112, 112, 100]],
                [240, [100, 100, 100]],
              ],
              [0.4, 0, 0.4, 1]
            ),
          },
        }),
      ],
    });
  },

  /** 2050: a signal propagating outward. */
  pulse: ({ primary, secondary }) => {
    const main = toLottieColor(primary);
    const core = toLottieColor(secondary);
    const rings = [0, 40, 80];

    return doc({
      name: 'pulse',
      duration: 120,
      layers: [
        shapeLayer({
          index: 1,
          name: 'core',
          shapes: [group([ellipse(12), fill(core)], 'core')],
          transform: {
            position: CENTRE,
            scale: animated(
              [
                [0, [100, 100, 100]],
                [12, [128, 128, 100]],
                [40, [100, 100, 100]],
                [52, [128, 128, 100]],
                [80, [100, 100, 100]],
                [92, [128, 128, 100]],
                [120, [100, 100, 100]],
              ],
              [0.2, 0, 0.3, 1]
            ),
          },
        }),
        ...rings.map((offset, i) =>
          shapeLayer({
            index: i + 2,
            name: `ring-${i}`,
            shapes: [group([ellipse(44), stroke(main, 3)], `ring-${i}`)],
            transform: {
              position: CENTRE,
              scale: animated(
                [
                  [offset, [26, 26, 100]],
                  [offset + 56, [128, 128, 100]],
                ],
                [0.1, 0.6, 0.3, 1]
              ),
              opacity: animated(
                [
                  [offset, 0],
                  [offset + 8, 90],
                  [offset + 56, 0],
                ],
                LINEAR
              ),
            },
            inPoint: offset,
            outPoint: offset + 56,
          })
        ),
      ],
    });
  },

  /** 2050: a radar sweep. Used while the system is searching. */
  radar: ({ primary, secondary }) => {
    const main = toLottieColor(primary);
    const sweep = toLottieColor(secondary);

    return doc({
      name: 'radar',
      duration: 150,
      layers: [
        shapeLayer({
          index: 1,
          name: 'sweep',
          shapes: [
            group(
              [polygon([[0, 0], [0, -27], [15, -23]]), fill(sweep, 80)],
              'wedge'
            ),
            group([rect(1.6, 27, 0.8, [0, -13.5]), fill(sweep)], 'line'),
          ],
          transform: {
            position: CENTRE,
            rotation: animated(
              [
                [0, 0],
                [150, 360],
              ],
              LINEAR
            ),
          },
        }),
        shapeLayer({
          index: 2,
          name: 'contact',
          shapes: [group([ellipse(6, [13, -17]), fill(sweep)], 'contact')],
          transform: {
            position: CENTRE,
            opacity: animated(
              [
                [0, 0],
                [18, 100],
                [70, 0],
                [150, 0],
              ],
              LINEAR
            ),
          },
        }),
        shapeLayer({
          index: 3,
          name: 'grid',
          shapes: [
            group([ellipse(56), stroke(main, 1.6, 60)], 'outer'),
            group([ellipse(34), stroke(main, 1.2, 36)], 'mid'),
            group([ellipse(14), stroke(main, 1.2, 36)], 'inner'),
            group([rect(56, 1, 0, [0, 0]), fill(main, 24)], 'axis-h'),
            group([rect(1, 56, 0, [0, 0]), fill(main, 24)], 'axis-v'),
          ],
          transform: { position: CENTRE },
        }),
      ],
    });
  },

  /** 2050: an aperture opening. Used for portrait reveal. */
  aperture: ({ primary, secondary }) => {
    const main = toLottieColor(primary);
    const glow = toLottieColor(secondary);
    const blades = 6;

    return doc({
      name: 'aperture',
      duration: 160,
      layers: [
        shapeLayer({
          index: 1,
          name: 'core',
          shapes: [group([ellipse(10), fill(glow)], 'core')],
          transform: {
            position: CENTRE,
            scale: animated(
              [
                [0, [0.1, 0.1, 100]],
                [70, [120, 120, 100]],
                [110, [120, 120, 100]],
                [160, [0.1, 0.1, 100]],
              ],
              [0.2, 0, 0.2, 1]
            ),
          },
        }),
        ...Array.from({ length: blades }, (_, i) =>
          shapeLayer({
            index: i + 2,
            name: `blade-${i}`,
            shapes: [
              group(
                [
                  polygon([[-9, -26], [9, -26], [3, -12], [-3, -12]]),
                  fill(main, 70),
                  groupTransform({ rotation: (360 / blades) * i }),
                ],
                `blade-${i}`
              ),
            ],
            transform: {
              position: CENTRE,
              rotation: animated(
                [
                  [0, 0],
                  [70, 42],
                  [110, 42],
                  [160, 0],
                ],
                [0.2, 0, 0.2, 1]
              ),
              scale: animated(
                [
                  [0, [100, 100, 100]],
                  [70, [118, 118, 100]],
                  [110, [118, 118, 100]],
                  [160, [100, 100, 100]],
                ],
                [0.2, 0, 0.2, 1]
              ),
            },
          })
        ),
      ],
    });
  },

  /** 2050: a scan line crossing a frame. Used while reading inputs. */
  scan: ({ primary, secondary }) => {
    const main = toLottieColor(primary);
    const beam = toLottieColor(secondary);

    return doc({
      name: 'scan',
      duration: 140,
      layers: [
        shapeLayer({
          index: 1,
          name: 'beam',
          shapes: [
            group([rect(42, 2.4, 1.2), fill(beam)], 'beam'),
            group([rect(42, 10, 5), fill(beam, 18)], 'bleed'),
          ],
          transform: {
            position: animated(
              [
                [0, [32, 12, 0]],
                [70, [32, 52, 0]],
                [140, [32, 12, 0]],
              ],
              [0.45, 0, 0.55, 1]
            ),
          },
        }),
        shapeLayer({
          index: 2,
          name: 'frame',
          shapes: [
            group([rect(10, 2, 0, [-16, -22]), fill(main)], 'c1'),
            group([rect(2, 10, 0, [-21, -17]), fill(main)], 'c2'),
            group([rect(10, 2, 0, [16, -22]), fill(main)], 'c3'),
            group([rect(2, 10, 0, [21, -17]), fill(main)], 'c4'),
            group([rect(10, 2, 0, [-16, 22]), fill(main)], 'c5'),
            group([rect(2, 10, 0, [-21, 17]), fill(main)], 'c6'),
            group([rect(10, 2, 0, [16, 22]), fill(main)], 'c7'),
            group([rect(2, 10, 0, [21, 17]), fill(main)], 'c8'),
          ],
          transform: { position: CENTRE },
        }),
      ],
    });
  },

  /** Threshold / 2050: a rocket holding a hover, flame flickering. */
  rocket: ({ primary, secondary }) => {
    const hull = toLottieColor(primary);
    const flame = toLottieColor(secondary);

    return doc({
      name: 'rocket',
      duration: 120,
      layers: [
        // Exhaust, flickering beneath the hull.
        shapeLayer({
          index: 1,
          name: 'flame',
          shapes: [
            group([polygon([[-6, 0], [6, 0], [0, 19]]), fill(flame, 85)], 'flame-outer'),
            group([polygon([[-3, 0], [3, 0], [0, 11]]), fill(flame)], 'flame-inner'),
          ],
          transform: {
            position: fixed([32, 46, 0]),
            scale: animated(
              [
                [0, [100, 70, 100]],
                [10, [100, 118, 100]],
                [22, [100, 84, 100]],
                [34, [100, 126, 100]],
                [48, [100, 78, 100]],
                [62, [100, 112, 100]],
                [80, [100, 88, 100]],
                [100, [100, 120, 100]],
                [120, [100, 70, 100]],
              ],
              [0.3, 0, 0.4, 1]
            ),
            opacity: animated(
              [
                [0, 70],
                [34, 100],
                [80, 75],
                [120, 70],
              ],
              LINEAR
            ),
          },
        }),
        // Hull, fins and window, bobbing as one.
        shapeLayer({
          index: 2,
          name: 'hull',
          shapes: [
            group([polygon([[-9, 5], [-17, 17], [-9, 15]]), fill(hull, 70)], 'fin-left'),
            group([polygon([[9, 5], [17, 17], [9, 15]]), fill(hull, 70)], 'fin-right'),
            group(
              [
                polygon([[0, -24], [9, -6], [9, 15], [-9, 15], [-9, -6]]),
                fill(hull),
              ],
              'body'
            ),
            group([ellipse(9, [0, -4]), fill([0.04, 0.06, 0.16, 1])], 'window'),
          ],
          transform: {
            position: animated(
              [
                [0, [32, 30, 0]],
                [60, [32, 26, 0]],
                [120, [32, 30, 0]],
              ],
              [0.4, 0, 0.4, 1]
            ),
          },
        }),
      ],
    });
  },

  /** Shared: a spark. Confirmation and celebration. */
  spark: ({ primary, secondary }) => {
    const main = toLottieColor(primary);
    const dust = toLottieColor(secondary);

    return doc({
      name: 'spark',
      duration: 140,
      layers: [
        shapeLayer({
          index: 1,
          name: 'star',
          shapes: [group([star({ points: 4, outer: 24, inner: 5 }), fill(main)], 'star')],
          transform: {
            position: CENTRE,
            rotation: animated(
              [
                [0, -24],
                [140, 20],
              ],
              [0.3, 0, 0.3, 1]
            ),
            scale: animated(
              [
                [0, [30, 30, 100]],
                [34, [112, 112, 100]],
                [60, [96, 96, 100]],
                [110, [100, 100, 100]],
                [140, [30, 30, 100]],
              ],
              [0.18, 0, 0.2, 1]
            ),
            opacity: animated(
              [
                [0, 0],
                [22, 100],
                [118, 100],
                [140, 0],
              ],
              LINEAR
            ),
          },
        }),
        ...[
          [-21, -15],
          [22, -11],
          [16, 20],
          [-18, 18],
        ].map(([x, y], i) =>
          shapeLayer({
            index: i + 2,
            name: `dust-${i}`,
            shapes: [group([ellipse(4.4), fill(dust)], `dust-${i}`)],
            transform: {
              position: animated(
                [
                  [0, [32, 32, 0]],
                  [70 + i * 5, [32 + x, 32 + y, 0]],
                  [140, [32, 32, 0]],
                ],
                [0.15, 0, 0.25, 1]
              ),
              opacity: animated(
                [
                  [0, 0],
                  [28 + i * 5, 90],
                  [96, 0],
                  [140, 0],
                ],
                LINEAR
              ),
              scale: fixed([100, 100, 100]),
            },
          })
        ),
      ],
    });
  },

  /** Shared: a three-dot loader. Deliberately quick — slow spinners feel slow. */
  loader: ({ primary }) => {
    const main = toLottieColor(primary);
    return doc({
      name: 'loader',
      duration: 72,
      layers: [-18, 0, 18].map((x, i) =>
        shapeLayer({
          index: i + 1,
          name: `dot-${i}`,
          shapes: [group([ellipse(11), fill(main)], `dot-${i}`)],
          transform: {
            position: fixed([32 + x, 32, 0]),
            scale: animated(
              [
                [0 + i * 9, [60, 60, 100]],
                [18 + i * 9, [112, 112, 100]],
                [40 + i * 9, [60, 60, 100]],
                [72, [60, 60, 100]],
              ],
              [0.3, 0, 0.3, 1]
            ),
            opacity: animated(
              [
                [0 + i * 9, 35],
                [18 + i * 9, 100],
                [40 + i * 9, 35],
                [72, 35],
              ],
              LINEAR
            ),
          },
        })
      ),
    });
  },
};

export const LOTTIE_ICON_NAMES = Object.keys(LOTTIE_ICONS);
