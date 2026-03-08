export function getHeaderHeight(document: Document): number {
  if (!document.defaultView) {
    return 0;
  }
  const heightString = document.defaultView
    .getComputedStyle(document.documentElement)
    .getPropertyValue('--header-height');
  return parseInt(heightString, 10) || 0;
}
