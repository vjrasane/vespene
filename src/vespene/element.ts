
import { FunctionComponent } from ".";
import { Hooks, Maybe, Node, PropsWithChildren } from "./types";
import { compact, isEventHandler, toCssStyle } from "./utils";

export default class Element<P extends object = any> {
	protected element: Maybe<Element | HTMLElement>;
	protected children: Array<Node>;
	protected parent: Maybe<Element>;

	private _type: string | FunctionComponent<P>;
	private _props: P;

	protected cleanupHandlers: Array<() => void> = [];

	constructor(
		type: string | FunctionComponent<P>,
		props: P,
		children: Array<Node>) {
		this._props = props;
		this._type = type;
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

	get props(): Readonly<P> {
		return this._props;
	}

	get type(): string | FunctionComponent<P> {
		return this._type;
	}

	private isParent = (child: Element): boolean => {
		if (child === this) return true;
		if (!child.parent) return false;
		return this.isParent(child.parent);
	}

	private bindAttribute = (key: string, value: unknown) => {
		switch (key) {
			case "style":
				this.setStyle(value as Record<string, string | number>);
				break;
			default:
				this.setAttribute(key, value as string | number);
				break;
		}
	}

	private bindAttributes = (): void => {
		Object.entries(this.props).filter(
			([key, value]) => !isEventHandler(key, value)
		).forEach(([key, value]) => this.bindAttribute(key, value));
	}

	private bindEventListeners = (element: HTMLElement): void => {
		Object.entries(this.props).filter(
			([key, handler]) => isEventHandler(key, handler)
		).forEach(
			([key, handler]) => {
				const event = key.substring(2).toLowerCase();
				element.addEventListener(event, handler as EventListener);
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
		this.bindAttributes();
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

	private runCleanup = (): void => {
		this.cleanupHandlers.forEach((handler) => handler());
		this.cleanupHandlers = [];
		this.element = undefined;
		this.children.forEach(
			(child) =>
				child instanceof Element && child.runCleanup()
		)
	}

	private unmount = (): void => {
		const element = this.getElement();
		if (!element) return;
		element.remove();
		this.runCleanup();
	}

	setStyle = (style: Record<string, string | number>) => {
		this.setAttribute("style", toCssStyle(style))
	}

	setAttribute = (key: string, value: string | number) => {
		this.getElement()?.setAttribute(key, `${value}`);
	}

	cleanup = (handler: () => void): void => {
		this.cleanupHandlers.push(handler);
	};

	remove = (): void => {
		this.parent?.removeChild(this);
		this.parent = undefined;
		this.unmount();
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
		if (node instanceof Element) {
			if (node.isParent(this))
				throw new Error("The operation would yield an incorrect node tree.");
			node.parent?.removeChild(node);
			node.parent = this;
		}
		this.children.push(node);
		const element = this.getElement();
		if (!element) {
			if (node instanceof Element) node.unmount();
			return node
		};
		const rendered = node instanceof Element ? node?.render(false) : node;
		if (!rendered) return node;
		element?.append(rendered as string | HTMLElement);
		return node;
	}

	appendTo = (parent: Element): Element => {
		return parent.append(this);
		// this.parent?.removeChild(this);
		// this.parent = parent;
		// this.parent.addChild(this);
		// const element = this.parent.getElement();
		// if (!element) return this;
		// const rendered = this.render(false);
		// if (!rendered) return this;
		// element.append(rendered);
		// return this;
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
