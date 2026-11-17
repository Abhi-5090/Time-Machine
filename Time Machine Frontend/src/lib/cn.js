/** Joins class names, dropping anything falsy. */
export function cn(...values) {
  return values.filter(Boolean).join(' ');
}
