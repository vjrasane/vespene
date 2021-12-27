export const render = (root: HTMLElement, element: JSX.Element) => {
  root.append(...element.element.get());
};
