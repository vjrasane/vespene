import Element from "./element";
import { Maybe } from "./types";
import { compact } from "./utils";

export default class ActualElement<
	P extends object = {}> extends Element<P, string, HTMLElement> {

	getElement = (): Maybe<HTMLElement> => {
		return this.element;
	};

	render = (force = true): Maybe<HTMLElement> => {
		if (this.element && !force) return this.element;
		this.element = document.createElement(this.type);
		const children = compact(this.children.map(
			child => child instanceof Element
				? child?.render(force)
				: child
		));
		this.element?.append(...(children as Array<string | HTMLElement>));
		return this.element;
	}
}