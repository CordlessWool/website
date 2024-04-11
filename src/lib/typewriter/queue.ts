export interface QueueData {
	html: string;
	position: number;
	length: number;
}

export class Queue {

	isRunning = false;
	queue: QueueData[] = [];
	current: number = 0;

	constructor() {
		this.queue = [];
	}

	reset() {
		this.current = 0;
	}

	add(item: QueueData){
		this.queue.push(item);
	}

	next(): QueueData {
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

	random(): QueueData | undefined {
		const random = Math.floor(Math.random() * this.queue.length);
		if(random === this.current) {
			return this.random();
		}
		return this.queue[random];
	}


}