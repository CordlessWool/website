export class Stack<T = unknown> {

	stack: T[];

	constructor(initial: T[] = []) {
		this.stack = initial;
	}

	add(...item: T[]) {
		this.stack.unshift(...item);
	}

	remove(): T | undefined {
		return this.stack.shift();
	}

	hasItems(): boolean {
		return this.stack.length !== 0;
	}
}