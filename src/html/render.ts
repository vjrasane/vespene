export const render = (root: HTMLElement, element: Vespene.Element) => {
  if (!element.element) return;
  root.append(...element.element.get());
};
