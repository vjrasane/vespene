import Element from "./element";

export const render = (root: HTMLElement, element: Element) => {
	root.innerHTML = "";
	element.appendTo(root);
};
