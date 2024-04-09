import { Queue } from './queue.js';

export class TypeWriter {

	queue: Queue;
	element: HTMLElement;
	currentPosition: number;
	currentLetter: string;
	startTag = '<span class="typewriter-cursor">' as const;
	endTag = '</span>' as const;

	constructor(element: HTMLElement) {
		this.element = element;

		this.currentPosition = this._html.length;
		this.currentLetter = '&nbsp;';

		this._setCursor();
		this.queue = new Queue();

	}

	get _html(): string {
		return this.element.innerHTML;
	}

	set _html(value: string) {
		this.element.innerHTML = value;
	}

	_removeCursor() {
		const before = this._html.substring(0, this.currentPosition);
		const after = this._html.substring(this.currentPosition+this.endTag.length+this.startTag.length+this.currentLetter.length	);
		this._html = `${before}${this.currentLetter === '&nbsp;' ? '' : this.currentLetter}${after}`;
	}

	_previous() {
		const previous = this._html.at(this.currentPosition - 1);
		if (previous === '>') {
			const startTag = this._html.lastIndexOf('<', this.currentPosition);
			this.currentPosition = startTag-1;
		} else {
			this.currentPosition--;
		}
	}

	_next() {
		const next = this._html.at(this.currentPosition +1);

		if (next === '<') {
			const endTag = this._html.indexOf('>', this.currentPosition);
			this.currentPosition = endTag+1;
		} else {
			this.currentPosition++;
		}
	}

	_setCursor() {
		const text = this._html;
		const before = text.substring(0, this.currentPosition);
		let at = text.at(this.currentPosition) ?? '&nbsp;';

		if(at === '&') {
			const special = text.substring(this.currentPosition).match(/&[a-z]+;/);
			if(special) {
				at = special[0];
			}
		}
		const after = text.substring(this.currentPosition+at.length);

		this._html = `${before}${this.startTag}${at}${this.endTag}${after}`;

		this.currentLetter = at;
	}

	_removeCurrentLetter() {
		const before = this._html.substring(0, this.currentPosition);
		const after = this._html.substring(this.currentPosition+1);
		this._html = `${before}${after}`;
	}
	addToQueue<T = unknown>(fn: (resolve: (value?: T) => void) => void, delay = 100 + (Math.random() * 100)) {
		this.queue.add(() => new Promise((resolve) => {
			setTimeout(() =>
			fn(resolve), delay);
		}));
	}

	move(singes: number) {
		if (singes === 0) {
			return this;
		}
		const direction = singes > 0 ? -1 : 1;
		this.addToQueue((resolve) => {
			this._removeCursor();
			if(singes > 0) {
				this._next();
			} else {
				this._previous();
			}
			this._setCursor();
			resolve();
		});


		this.move(singes + direction)

		return this;

	}

	clear(): this {
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
			return this.clear();
		} else {
			this.addToQueue((resolve) => {
				this._removeCursor();
				this._next()
				this._removeCurrentLetter();
				this._setCursor();
				resolve();
			});
			return this.clear();
		}
	}




}