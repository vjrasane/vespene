import { Context } from "./context";
import { Fragment, Node, Child, Text, Maybe, PropsWithChildren, FunctionComponent } from "./types";
import { compact, flatten, isEventHandler, removeBy, toCssStyle } from "./utils";

// const renderSuccessors = (successors: HTMLElement | Array<Child>, parent: Element): Array<HTMLElement | Text> => {
// 	return Array.isArray(successors) 
// 	? successors.flatMap(
// 		successor => successor instanceof Element ? successor.render(parent) : successor) 
// 	: [successors];
// }

export default class Element<P = any, 
	T extends string | typeof Fragment | FunctionComponent<P> = string | typeof Fragment | FunctionComponent<P>> {
	private readonly instructions: {
		readonly type: T;
		readonly props: P;
		readonly children: Node;
	};

	// protected elements: Maybe<Array<Element | Text | HTMLElement>>;
	protected parent: Maybe<Element | HTMLElement>;

	protected cleanupHandlers: Array<() => void> = [];

	// protected element: Maybe<Element | Text | HTMLElement | null>;

	// protected successors: Maybe<HTMLElement | Element | Array<Child> | null>;

	protected context: Record<symbol, any> = {};

	protected element: Maybe<HTMLElement | null>;

	protected children: Maybe<Array<Child>>;

	constructor(
		type: T,
		props: P,
		children: Node) {
			this.instructions = {
				type, 
				props,
				children
			};
	}

	get type() {
		return this.instructions.type;
	}

	get props(): Readonly<P> {
		return this.instructions.props;
	}

	// private getContainer = (parent: Maybe<Element | HTMLElement>): Maybe<HTMLElement> => {
	// 	if (!parent) return;
	// 	if (parent instanceof HTMLElement) return parent;
	// 	if (parent.element instanceof HTMLElement) return parent.element;
	// 	return this.getContainer(parent.parent);
	// }

	private isParent = (child: Element): boolean => {
		if (child === this) return true;
		if (!child.parent) return false;
		if (!(child.parent instanceof Element)) return false;
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

	private renderChildren = (children: Array<Child>): Array<HTMLElement | string> => {
		children.forEach((child) => { 
			if(!(child instanceof Element )) return; 
			child.parent = this;
		 });
		return compact(children.flatMap(
			(child): Array<HTMLElement | Text | null> => child instanceof Element 
				? child?.render(this.context) : [child]
		)).map(child => child instanceof HTMLElement ? child : String(child));
	}

	private renderActual = (tag: string): HTMLElement => {
		this.element = document.createElement(tag);
		this.children = flatten([this.instructions.children]) as Array<Child>;
		this.element.append(...this.renderChildren(this.children));
		this.bindAttributes();
		this.bindEventListeners(this.element);
		return this.element;
	}

	private renderFunction = (func: FunctionComponent<P>): Array<HTMLElement | string> => {
		const props: PropsWithChildren<P> = { ...this.props, children: this.instructions.children };
		const elements = func(props, this);
		this.children = Array.isArray(elements) ? elements : compact([elements]);
		return this.renderChildren(this.children);
	}

	protected getSuccessor = (): Maybe<HTMLElement | Element> => {
		if (this.element instanceof HTMLElement) return this.element;
		if (this.element === null) return;
		if (!this.children) return;
		if (this.children.length !== 1) return;
		const [element] = this.children;
		if (element instanceof Element) return element;
	}

	protected getElement = (): Maybe<HTMLElement> => {
		const successor = this.getSuccessor();
		if (successor instanceof HTMLElement) return successor;
		if (successor instanceof Element) return successor.getElement();
	}

	protected removeChild = (node: Element): void => {
		if (!this.children) return;
		this.children = removeBy(
			(child) => child instanceof Element && child === node,
			this.children
		);
	};

	protected replaceChild = (node: Element, replacer: Child): void => {
		if (!this.children) return;
		const index = this.children.findIndex(
			(child) => child instanceof Element && child === node
		);
		if (index < 0) return;
		this.children.splice(index, 1, replacer);
	};

	protected addChild = (node: Child): void => {
		if (!this.children) return;
		const index = this.children.findIndex(
			(child) => child instanceof Element && child === node);
		if (index >= 0) return;
		this.children.push(node);
	}

	private runCleanup = (): void => {
		this.cleanupHandlers.forEach((handler) => handler());
		this.cleanupHandlers = [];
		this.element = null;
		this.children?.forEach(
			child => child instanceof Element && child.runCleanup());
		this.children = [];
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
		const element = this.getElement();
		if (!element) return;
		if (this.parent instanceof Element) this.parent.removeChild(this);
		this.parent = undefined;
		this.runCleanup();
	};

	private replaceWithElement = (replacer: Element): void => {
		this.element = replacer.element;
		this.children = replacer.children;
		this.cleanupHandlers = replacer.cleanupHandlers;
	}

	replace = (node: Element): void => {
		const element = this.getElement();
		if (!element) return;
		const replaceable = node.render(this.context);
		if (!replaceable) return this.remove();
		element.replaceWith(...replaceable);
		this.runCleanup();
		this.replaceWithElement(node);
	};

	protected moveToParent = (parent: Element): void => {
		if (parent === this) return;
		if (this.parent instanceof Element) this.parent?.removeChild(this);
		parent.addChild(this);
		this.parent = parent;
	}

	append = (node: Child): void => {
		const successor = this.getSuccessor();
		if (!successor) return;
		if (successor instanceof Element) return successor.append(node);
		const appendable = node instanceof Element ? node.render(this.context) : String(node);
		if (appendable)	successor.append(...appendable);
		if (node instanceof Element) node.moveToParent(this);
	}

	appendTo = (parent: Element | HTMLElement): void => {
		if (parent instanceof Element) return parent.append(this);
		const appendable = this.render(this.context);
		if (appendable) parent.append(...appendable);
		this.parent = parent;
	}

	setContext = <T>(context: Context<T>, value: T): void => {
		this.context = { ...this.context, [context.id]: value };
	}

	getContext = <T>(context: Context<T>): T => {
		if (!this.context || !(context.id in this.context)) return context.defaultValue;
		return this.context[context.id];
	}

	private render = (context: Record<symbol, any>): Array<HTMLElement | string> => {
		switch (this.children) {
			case undefined: {
				this.context = { ...context };
				switch (typeof this.type) {
					case "string":
						return [this.renderActual(this.type)];
					case "function":
						return this.renderFunction(this.type);
					case "symbol":
						this.children = flatten([this.instructions.children]) as Array<Child>;
						return this.renderChildren(this.children);
				}
			}
			default:
				switch (this.element) {
					case undefined:
						return this.renderChildren(this.children);
					case null:
						return [];
					default:
						return [this.element];
				}
		}	
	};
}
