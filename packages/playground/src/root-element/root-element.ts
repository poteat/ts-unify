/**
 * The element the app mounts on, the page's `#root`; a page without one
 * is the wrong page.
 *
 * @returns the element
 */
export function rootElement(): HTMLElement {
  const element = document.getElementById('root')

  if (element === null) throw new Error('no #root element to mount on')

  return element
}
