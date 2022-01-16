export type Maybe<T> = T | undefined | null;

export type DeepArray<T> = (T | DeepArray<T>)[];

export const flatten = <T>(arr: DeepArray<T>): Array<T> => {
	return arr.flatMap(
		(elem) => Array.isArray(elem) ? flatten(elem) : elem
	)
}

export const compact = <T>(arr: Array<Maybe<T>>): Array<T> => {
	return arr.filter((elem): elem is T => elem != null);
}
