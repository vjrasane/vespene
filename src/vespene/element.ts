
import { Maybe, Node } from "./types";

export default abstract class Element<
	P extends object = {},
	T = unknown,
	E = unknown,
	> {
	protected element: Maybe<E>;
	protected children: Array<Node>;
	protected parent: Maybe<Element>;

	readonly props: P;
	readonly type: T;

	protected cleanupHandlers: Array<() => void> = [];

	constructor(type: T, props: P, children: Array<Node>) {
		this.props = props;
		this.type = type;
		this.children = children;
		this.children.forEach((child) => {
			if (!(child instanceof Element)) return;
			child.parent = this;
		});
	}

	abstract render: (force?: boolean) => Maybe<HTMLElement>;
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
}