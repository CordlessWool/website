export class Queue<T> {

	isRunning = false;
	queue: T[] = [];
	current: number = 0;

	constructor(initial: T[] = []) {
		this.queue = initial;
	}

	reset() {
		this.current = 0;
	}

	add(...item: T[]){
		this.queue.push(...item);
	}

	next(): T {
		this.current++;
		if(this.current === this.queue.length) {
			this.reset();
		}
		return this.queue[this.current];
	}

	isFirst(): boolean {
		return this.current === 0;
	}

	isLast(): boolean {
		return this.queue.length-1 === this.current;
	}

	reverse(): void {
		this.queue.reverse();
	}

	random(): T {
		const index = Math.round(Math.random() * (this.queue.length-1));
		if(index === this.current) {
			return this.random();
		}
		this.current = index;
		return this.queue[this.current];
	}

}