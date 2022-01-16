


import { compact, DeepArray, flatten, Maybe } from "./utils";


namespace Vespene {
	export type Hooks = {};

	export type FunctionComponent<
		P extends object = {},
		> = (props: WithChildren<P>, hooks: Hooks) => Element | null;

	export type Node = Element | string | null | undefined;

	export type HTMLElementTag = keyof HTMLElementTagNameMap;

	export type Children<C extends Node = Node> = C | DeepArray<C> | undefined

	export type WithChildren<P extends object, C extends Node = Node> = {
		children?: Children<C>
	} & P;

	export abstract class Element<
		C extends Node = Node
		> {
		protected children: Array<Node>;
		protected parent: Maybe<Element>;

		protected cleanupHandlers: Array<() => void> = [];

		constructor(children: Array<C>) {
			this.children = children;
		}

		abstract render: (parent: Maybe<Element>, force?: boolean) => Maybe<HTMLElement>;
		abstract getElement: () => Maybe<HTMLElement>;
		protected abstract clearElement: () => void;

		protected removeChild = (node: Element): void => {
			const index = this.children.findIndex((child) => child === node);
			if (index < 0) return;
			this.children.splice(index, 1);
		};

		protected replaceChild = (node: Element, replacer: Node): void => {
			const index = this.children.findIndex((child) => child === node);
			if (index < 0) return;
			this.children.splice(index, 1, replacer);
		};

		protected addChild = (node: Node): void => {
			const index = this.children.findIndex((child) => child === node);
			if (index >= 0) return;
			this.children.push(node);
		}

		protected runCleanup = (): void => {
			this.cleanupHandlers.forEach((handler) => handler());
			this.children.forEach(
				(child) =>
					child && typeof child !== "string" && child.runCleanup()
			)
			this.clearElement();
		}

		cleanup = (handler: () => void): void => {
			this.cleanupHandlers.push(handler);
		};

		remove = (): void => {
			this.parent?.removeChild(this);
			const element = this.getElement();
			if (!element) return;
			element.remove();
			this.runCleanup();
		};

		replace = <N extends Node>(node: N): N => {
			this.parent?.replaceChild(this, node);
			const element = this.getElement();
			if (!element) return node;
			const rendered = typeof node === "string"
				? node
				: node?.render(this, false);
			if (!rendered) {
				this.remove();
				return node;
			}
			element.replaceWith(rendered);
			this.runCleanup();
			return node;
		};

		append = <N extends Node>(node: N): N => {
			this.children.push(node);
			const element = this.getElement();
			if (!element) return node;
			const rendered = typeof node === "string"
				? node
				: node?.render(this, false);
			if (!rendered) return node;
			element?.append(rendered);
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
		P extends object = {}> extends Element<C> {
		private tag: string;
		private props: P;

		private element: Maybe<HTMLElement>;

		constructor(tag: string, props: P, children: Array<C>) {
			super(children);
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
				child => typeof child === "string"
					? child
					: child?.render(this, force)
			));
			this.element?.append(...children);
			return this.element;
		}
	}

	class FunctionElement<
		C extends Node = Node,
		P extends object = {}
		> extends Element<C> {

		private func: FunctionComponent<P>;
		private props: P;

		private element: Maybe<Element>;

		constructor(func: FunctionComponent<P>, props: P, children: Array<C>) {
			super(children)
			this.func = func;
			this.props = props;
		}

		protected clearElement = (): void => {
			this.element = undefined;
		}

		getElement = (): Maybe<HTMLElement> => {
			return this.element?.getElement();
		};

		render = (parent: Maybe<Element>, force = true): Maybe<HTMLElement> => {
			this.parent = parent;
			if (this.element && !force) return this.getElement();
			this.element = this.func(
				{ ...this.props, children: this.children }, {});
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