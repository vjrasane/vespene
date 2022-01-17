import Element from "./element";

export const render = (root: HTMLElement, element: Element) => {
	const rendered = element.render(undefined);
	if (!rendered) return;
	root.append(rendered);
};
