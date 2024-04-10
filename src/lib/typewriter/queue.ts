export class Queue {

	isRunning = false;
	queue: (() => Promise<unknown>)[];

	constructor() {
		this.queue = [];
	}

	add(item: () => Promise<unknown>){
		this.queue.push(item);
	}

	get(): () => Promise<unknown>{
		return this.queue.shift() ?? (() => Promise.resolve());
	}

	isEmpty() {
		return this.queue.length === 0;
	}

	async next() {
		if (this.isEmpty()) {
			this.isRunning = false;
			return;
		}
		this.isRunning = true;
		await this.get()();
		await this.next();
	}

	async run() {
		await this.next();
	}

}