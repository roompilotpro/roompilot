/**
 * Utility function to merge CSS class names
 * Filters out falsy values and joins with spaces
 *
 * @param {...(string|boolean|null|undefined)} classes - Class names to merge
 * @returns {string} Merged class names
 *
 * @example
 * classNames('button', 'button--primary', isLarge && 'button--lg')
 * // => 'button button--primary button--lg' (if isLarge is true)
 */
export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default classNames
