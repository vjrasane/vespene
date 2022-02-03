import { createElement, Fragment, Element, FunctionComponent } from ".";
import { PropsWithChildren } from "./types";


type ProviderProps<T> = {
	value: T;
  };

type ConsumerProps<T> = {
	children: (value: T) => Element
}

const createContextProvider = function<T>(context: Context<T>): FunctionComponent<ProviderProps<T>> {
	return ({ value, children }, { setContext }) => {
		setContext(context, value);
		return createElement(Fragment, null, children);
	}
}

const createContextConsumer = function<T>(context: Context<T>): FunctionComponent<ConsumerProps<T>> {
	return ({ children }, { getContext }) => children(getContext(context))
}

export class Context<T> {
	readonly id: symbol = Symbol();
	readonly defaultValue: T;

	readonly Provider: FunctionComponent<ProviderProps<T>>;
	readonly Consumer: FunctionComponent<ConsumerProps<T>>;

	constructor(defaultValue: T) {
		this.defaultValue = defaultValue;
		this.Provider = createContextProvider(this);
		this.Consumer = createContextConsumer(this);
	}
}
