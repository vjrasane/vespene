import Element from "./element";
import { Maybe } from "./types";
import { compact, isEventHandler } from "./utils";

export default class ActualElement<
	P extends object = {}> extends Element<P, string, HTMLElement> {

	private bindAttributes = (): void => {
		Object.entries(this.props ?? {}).filter(
			([key, value]) => !isEventHandler(key, value)
		).forEach(
			([key, value]) => {
				this.element?.setAttribute(key, value);
			}
		);
	}

	private bindEventListeners = (): void => {
		Object.entries(this.props ?? {}).filter(
			([key, handler]) => isEventHandler(key, handler)
		).forEach(
			([key, handler]) => {
				const event = key.substring(2).toLowerCase();
				this.element?.addEventListener(event, handler);
			}
		);
	}

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
		this.bindAttributes();
		this.bindEventListeners();
		return this.element;
	}
}