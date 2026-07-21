export type Success<T> = { data: T; error: null };
export type Failure<E> = {
	data: null;
	error: E;
};
export type Result<T, E> = Success<T> | Failure<E>;
