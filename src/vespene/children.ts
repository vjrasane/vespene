
import { Node } from "./types";
import { flatten, compact } from "./utils";

export default {
	toArray: (children: Node | Node[]): Array<Exclude<Node, boolean | null | undefined>> => {
		return compact(flatten([children]));
	}
}