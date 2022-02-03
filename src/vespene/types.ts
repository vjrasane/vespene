
import Element from "./element";

export const Fragment: unique symbol = Symbol();

export type Maybe<T> = T | undefined;

export type DeepArray<T> = (T | DeepArray<T>)[];

interface NodeArray extends Array<Node> {};
export type Text = string | number;
export type Child = Element | Text;
export type Node = Maybe<{} | NodeArray | Child | Array<Node>>;
export type PropsWithChildren<P> = P & { children?: Node | undefined };


export type JSXElementConstructor<P> = ((props: P) => Element<any, any> | null)

export interface FunctionComponent<P = {}> {
	(props: PropsWithChildren<P>, elem: Element): Element | null;
}