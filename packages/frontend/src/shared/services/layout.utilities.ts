export function getHeaderHeight(document: Document): number {
  const heightString = getComputedStyle(document.documentElement).getPropertyValue(
    '--header-height',
  );
  return parseInt(heightString, 10);
}
