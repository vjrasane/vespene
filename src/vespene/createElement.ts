import Element from "./element"
import ActualElement from "./actual-element"
import FunctionElement from "./function-element"
import { DeepArray, FunctionComponent, Maybe } from "./types"
import { flatten } from "./utils"

export const createElement = <P extends object, C extends Node>(
	component: FunctionComponent<P> | string,
	props: Maybe<P>,
	...children: DeepArray<C>
): Element => {
	return typeof component === "string"
		? new ActualElement(component, props ?? {}, flatten(children))
		: new FunctionElement(component, props ?? {} as P, flatten(children))
}