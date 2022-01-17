


import { compact, DeepArray, flatten, Maybe } from "./utils";


namespace Vespene {
	export type Hooks = {};

	export type FunctionComponent<
		P extends object = {},
		> = (props: PropsWithChildren<P>, hooks: Hooks) => Element | null;

	type Text = string | number;
	type Child = Element | Text;
	type Fragment = {} | Array<Node>;
	export type Node = Child | Fragment | boolean | null | undefined;

	export type HTMLElementTag = keyof HTMLElementTagNameMap;

	type PropsWithChildren<P> = P & { children?: Node | undefined };

	export abstract class Element<
		P extends object = {},
		C extends Node = Node,
		E = unknown,
		> {
		protected element: Maybe<E>;
		protected children: Array<Node>;
		protected parent: Maybe<Element>;

		props: P;

		protected cleanupHandlers: Array<() => void> = [];

		constructor(props: P, children: Array<C>) {
			this.children = children;
			this.props = props;
		}

		abstract render: (parent: Maybe<Element>, force?: boolean) => Maybe<HTMLElement>;
		abstract getElement: () => Maybe<HTMLElement>;

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
			const rendered = node instanceof Element ? node?.render(this, false) : node;
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
			const rendered = node instanceof Element ? node?.render(this, false) : node;
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
			const rendered = this.render(parent, false);
			if (!rendered) return this;
			element.append(rendered);
			return this;
		}
	}

	class ActualElement<
		C extends Node = Node,
		P extends object = {}> extends Element<P, C, HTMLElement> {
		private tag: string;

		constructor(tag: string, props: P, children: Array<C>) {
			super(props, children);
			this.tag = tag;
			this.props = props;
		}

		getElement = (): Maybe<HTMLElement> => {
			return this.element;
		};

		protected clearElement = (): void => {
			this.element = undefined;
		}

		render = (parent: Maybe<Element>, force = true): Maybe<HTMLElement> => {
			this.parent = parent;
			if (this.element && !force) return this.element;
			this.element = document.createElement(this.tag);
			const children = compact(this.children.map(
				child => child instanceof Element
					? child?.render(this, force)
					: child
			));
			this.element?.append(...(children as Array<string | HTMLElement>));
			return this.element;
		}
	}

	class FunctionElement<
		C extends Node = Node,
		P extends object = {}
		> extends Element<P, C, Element> {

		private func: FunctionComponent<P>;

		constructor(func: FunctionComponent<P>, props: P, children: Array<C>) {
			super(props, children)
			this.func = func;
		}

		getElement = (): Maybe<HTMLElement> => {
			return this.element?.getElement();
		};

		render = (parent: Maybe<Element>, force = true): Maybe<HTMLElement> => {
			this.parent = parent;
			if (this.element && !force) return this.getElement();
			const props: PropsWithChildren<P> = { ...this.props, children: this.children };
			this.element = this.func(props, {});
			return this.element?.render(this, force);
		};
	}
	export const createElement = <P extends object, C extends Node>(
		component: FunctionComponent<P> | string,
		props: P,
		...children: DeepArray<C>
	): Element => {
		return typeof component === "string"
			? new ActualElement(component, props, flatten(children))
			: new FunctionElement(component, props, flatten(children))
	}

	export const render = (root: HTMLElement, element: Vespene.Element) => {
		const rendered = element.render(undefined);
		if (!rendered) return;
		root.append(rendered);
	};
}

export default Vespene