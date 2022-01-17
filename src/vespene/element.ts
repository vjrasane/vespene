
import { FunctionComponent } from ".";
import { Hooks, Maybe, Node, PropsWithChildren } from "./types";
import { compact, isEventHandler } from "./utils";

export default class Element<P extends object = any> {
	protected element: Maybe<Element | HTMLElement>;
	protected children: Array<Node>;
	protected parent: Maybe<Element>;

	readonly type: string | FunctionComponent<P>;
	readonly props: P;

	protected cleanupHandlers: Array<() => void> = [];

	constructor(
		type: string | FunctionComponent<P>,
		props: P,
		children: Array<Node>) {
		this.props = props;
		this.type = type;
		this.children = children;
		this.children.forEach((child) => {
			if (!(child instanceof Element)) return;
			child.parent = this;
		});
	}

	get hooks(): Hooks {
		return {
			replace: this.replace
		}
	}

	private bindAttributes = (element: HTMLElement): void => {
		Object.entries(this.props).filter(
			([key, value]) => !isEventHandler(key, value)
		).forEach(([key, value]) => element.setAttribute(key, value));
	}

	private bindEventListeners = (element: HTMLElement): void => {
		Object.entries(this.props).filter(
			([key, handler]) => isEventHandler(key, handler)
		).forEach(
			([key, handler]) => {
				const event = key.substring(2).toLowerCase();
				element.addEventListener(event, handler);
			}
		);
	}

	private renderActual = (tag: string, force?: boolean): Maybe<HTMLElement> => {
		this.element = document.createElement(tag);
		const children = compact(this.children.map(
			child => child instanceof Element
				? child?.render(force)
				: child
		));
		this.element?.append(...(children as Array<string | HTMLElement>));
		this.bindAttributes(this.element);
		this.bindEventListeners(this.element);
		return this.element;
	}

	private renderFunction = (func: FunctionComponent<P>, force?: boolean): Maybe<HTMLElement> => {
		const props: PropsWithChildren<P> = { ...this.props, children: this.children };
		this.element = func(props, this.hooks);
		return this.element?.render(force);
	}

	protected getElement = (): Maybe<HTMLElement> => this.element instanceof Element
		? this.element.getElement()
		: this.element;

	protected removeChild = (node: Element): void => {
		const index = this.children.findIndex(
			(child) => child instanceof Element && child === node
		);
		if (index < 0) return;
		this.children.splice(index, 1);
	};

	protected replaceChild = (node: Element, replacer: Node): void => {
		const index = this.children.findIndex(
			(child) => child instanceof Element && child === node
		);
		if (index < 0) return;
		this.children.splice(index, 1, replacer);
	};

	protected addChild = (node: Node): void => {
		const index = this.children.findIndex(
			(child) => child instanceof Element && child === node);
		if (index >= 0) return;
		this.children.push(node);
	}

	protected runCleanup = (): void => {
		this.cleanupHandlers.forEach((handler) => handler());
		this.cleanupHandlers = [];
		this.children.forEach(
			(child) =>
				child instanceof Element && child.runCleanup()
		)
		this.element = undefined;
	}

	cleanup = (handler: () => void): void => {
		this.cleanupHandlers.push(handler);
	};

	on = (event: string, handler: () => void) => {
		this.getElement()?.addEventListener(event, handler);
	}

	remove = (): void => {
		this.parent?.removeChild(this);
		this.parent = undefined;
		const element = this.getElement();
		if (!element) return;
		element.remove();
		this.runCleanup();
	};

	replace = <N extends Node>(node: N): N => {
		this.parent?.replaceChild(this, node);
		this.parent = undefined;
		const element = this.getElement();
		if (!element) return node;
		const rendered = node instanceof Element ? node?.render(false) : node;
		if (!rendered) {
			this.remove();
			return node;
		}
		element.replaceWith(rendered as string | HTMLElement);
		this.runCleanup();
		return node;
	};

	append = <N extends Node>(node: N): N => {
		this.children.push(node);
		if (node instanceof Element) {
			node.parent = this;
		}
		const element = this.getElement();
		if (!element) return node;
		const rendered = node instanceof Element ? node?.render(false) : node;
		if (!rendered) return node;
		element?.append(rendered as string | HTMLElement);
		return node;
	}

	appendTo = (parent: Element): Element => {
		this.parent?.removeChild(this);
		this.parent = parent;
		this.parent.addChild(this);
		const element = this.parent.getElement();
		if (!element) return this;
		const rendered = this.render(false);
		if (!rendered) return this;
		element.append(rendered);
		return this;
	}

	render = (force?: boolean): Maybe<HTMLElement> => {
		if (this.element && !force) return this.getElement();
		switch (typeof this.type) {
			case "string":
				return this.renderActual(this.type, force);
			case "function":
				return this.renderFunction(this.type, force);
			default:
				return null;
		}
	};
}
