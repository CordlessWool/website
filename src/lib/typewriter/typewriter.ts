import { Queue } from './queue.js';

export interface TypeWriterOptions {
	delay?: number;
	variety?: number;
}

export class TypeWriter {

	queue: Queue;
	element: HTMLElement;
	currentPosition: number;
	currentLetter: string;
	delay: number;
	variety: number;
	startTag = '<span class="typewriter-cursor">' as const;
	endTag = '</span>' as const;

	virtualContent = '';

	constructor(element: HTMLElement, options: TypeWriterOptions = {}) {
		this.element = element;
		this.delay = options.delay ?? 100;
		this.variety = options.variety ?? 100;
		this.currentLetter = '';
		this.virtualContent = this.element.innerHTML;

		this.currentPosition = this._html.length;



		this._writeToElement();
		this.queue = new Queue();

	}

	get _html(): string {
		return this.virtualContent
	}

	set _html(value: string) {
		this.virtualContent = value;
	}

	_writeToElement(html: string = this._html, position: number = this.currentPosition, length: number = this.currentLetter.length) {;
		const before = html.substring(0, position);
		let at = html.substring(position, position + length);

		const after = html.substring(position + length);

		this.element.innerHTML = `${before}${this.startTag}${at || '&nbsp;'}${this.endTag}${after}`;
	}


	removeFocus() {
		this.element.innerHTML = this._html;
	}

	setFocus() {
		this._writeToElement();
	}

	isCursorAtEnd() {
		return this._html.length === this.currentPosition;
	}

	_previous() {
		const previous = this._html.at(this.currentPosition - 1);
		if (previous === '>') {
			this.currentPosition = this._html.lastIndexOf('<', this.currentPosition);
			this._previous();
			return;
		} else if (previous === ';') {
			const special = this._html.substring(this.currentPosition - 5, 5).match(/&[a-z]+;/);
			if (special) {
				this.currentLetter = special[0];
				return;
			}
		} else {
			this.currentLetter = previous || '';
		}
		this.currentPosition--;
	}

	_next() {
		const next = this._html.at(this.currentPosition + 1);
		if (next === '<') {
			this.currentPosition = this._html.indexOf('>', this.currentPosition);
			this._next();
			return;
		} else if (next === '&') {
			const special = this._html.substring(this.currentPosition, 5).match(/&[a-z]+;/);
			if (special) {
				this.currentLetter = special[0];
				return;
			}
		} else {
			this.currentLetter = next || '';
		}

		 this.currentPosition++;

	}

	_removeCurrentLetter() {
		const before = this._html.substring(0, this.currentPosition);
		const after = this._html.substring(this.currentPosition+1);
		this._html = `${before}${after}`;
	}

	_stepForward() {
		this._next();
	}

	_stepBackward() {
		this._previous();
	}

	_step(singes: number) {
		const direction = singes > 0 ? -1 : 1;
		if(direction === 1) {
			this._stepBackward();
		} else {
			this._stepForward();
		}
		return direction;
	}


	addToQueue<T = unknown>(fn: (resolve: (value?: T) => void) => void, delay = this.delay + (Math.random() * this.variety)) {
		this.queue.add(() => new Promise((resolve) => {
			setTimeout(() =>
			fn(resolve), delay);
		}));
	}

	_isLoopEndReached(singes: number) {
		if (singes === 0) {
			return this;
		} else if (singes > 0 && this.isCursorAtEnd()) {
			return this;
		} else if (singes < 0 && this.currentPosition === 0) {
			return this;
		}
	}


	move(singes: number) {
		if(this._isLoopEndReached(singes)) {
			return this;
		}

		const direction = this._step(singes);
		this.addToQueue((resolve) => {
			const next = this.virtualContent;
			const pos = this.currentPosition;
			const length = this.currentLetter.length;
			this._writeToElement(next, pos, length);
			resolve();
		});


		this.move(singes + direction)

		return this;

	}

	clean(singes: number): this {
		if(this._isLoopEndReached(singes)) {
			return this;
		}
		const direction = this._step(singes);
		this.addToQueue((resolve) => {

			this._removeCurrentLetter();

			resolve();
		});
		return this.clear(amount-1);
	}

	cleanAll(): this {
		if(this._html === '&nbsp;') {
			return this;
		} else if(this.currentLetter === '&nbsp;') {
			this.addToQueue((resolve) => {
				this._removeCursor();
				this._previous();
				this._removeCurrentLetter();
				this._setCursor();
				resolve();
			});
			return this.clearAll();
		} else {
			this.addToQueue((resolve) => {
				this._removeCursor();
				this._next()
				this._removeCurrentLetter();
				this._setCursor();
				resolve();
			});
			return this.clearAll();
		}
	}

	async go(){
		await this.queue.run();
	}

	removeCursor() {
		this._removeCursor();
		this.addToQueue((resolve) => {
			this._writeToElement(this._html);
			resolve();
		});

		return this;
	}





}