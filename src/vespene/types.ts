
import Element from "./element";

export type Maybe<T> = T | undefined | null;

export type DeepArray<T> = (T | DeepArray<T>)[];


export type PropsWithChildren<P> = P & { children?: Node | undefined };
export type Text = string | number | boolean;
export type Child = Element | Text;
export type Node = Maybe<{} | Child | Array<Node>>;

export type Hooks = {
	replace: <N extends Node>(node: N) => N;
};

export type FunctionComponent<P extends object = {}> = (
	props: PropsWithChildren<P>, hooks: Hooks
) => Element | null;
