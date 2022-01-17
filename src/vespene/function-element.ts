import Element from "./element";
import { FunctionComponent, Hooks, Maybe, PropsWithChildren } from "./types";


export default class FunctionElement<
	P extends object = {}
	> extends Element<P, FunctionComponent<P>, Element> {

	get hooks(): Hooks {
		return {
			replace: this.replace
		}
	}

	getElement = (): Maybe<HTMLElement> => {
		return this.element?.getElement();
	};

	render = (force = true): Maybe<HTMLElement> => {
		if (this.element && !force) return this.getElement();
		const props: PropsWithChildren<P> = { ...this.props, children: this.children };
		this.element = this.type(props, this.hooks);
		return this.element?.render(force);
	};
}