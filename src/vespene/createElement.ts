import Element from "./element"
import { DeepArray, FunctionComponent, Maybe } from "./types"
import { flatten } from "./utils";

export const createElement = <P extends object, C extends Node>(
	component: string | FunctionComponent<P>,
	props: Maybe<P>,
	...children: DeepArray<C>
): Element => {
	return new Element(component, props ?? {} as P, flatten(children));
}