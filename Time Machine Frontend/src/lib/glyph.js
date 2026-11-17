/**
 * Forces text presentation for a symbol character.
 *
 * The zodiac signs (U+2648–U+2653) have an emoji presentation, and on macOS and
 * iOS the system picks it by default — which renders the twelve signs as purple
 * rounded-square emoji that belong to no part of this design. Appending
 * VARIATION SELECTOR-15 asks for the text glyph instead, so the sign inherits
 * the surrounding colour and weight like any other character.
 */
export function textGlyph(symbol) {
  return symbol ? `${symbol}︎` : '';
}
