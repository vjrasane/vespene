import Element from "./element"
import { Fragment, Node, Child, FunctionComponent, Maybe } from "./types"
import { flatten } from "./utils";

export const createElement = <P extends object>(
	component: string | typeof Fragment | FunctionComponent<P>,
	props: Maybe<P | null>,
	...children: Array<Node>
): Element => {
	return new Element(component, props ?? {} as P, 
		children.length > 1 ? children : children[0]);
}