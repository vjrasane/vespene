import { DeepArray, Maybe } from "./types";

export const flatten = <T>(arr: DeepArray<T>): Array<T> => {
	return arr.flatMap(
		(elem) => Array.isArray(elem) ? flatten(elem) : elem
	)
}

export const compact = <T>(arr: Array<Maybe<T>>): Array<Exclude<T, undefined | null>> => {
	return arr.filter((elem) => elem != null) as Array<Exclude<T, undefined | null>>;
}


export const isEventHandler = (prop: string, handler: any): handler is Function => {
	if (!prop.match(/on[A-Z]/)) return false;
	return typeof handler === "function";
}