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

export const toKebabCase = (str: string): string => {
	const matches = str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) as RegExpMatchArray;
	return matches.map(x => x.toLowerCase()).join('-');
}

export const toCssStyle = (style: Record<string, string | number>): string => {
	return Object.entries(style).map(
		([key, value]) => `${toKebabCase(key)}: ${value}`
	).join("; ")
}