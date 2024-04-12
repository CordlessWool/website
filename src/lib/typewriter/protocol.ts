import { Queue }	from './queue';

export class Protocol {
		protected element: Element;
		protected queue: Queue;
		startTag = '<span class="typewriter-cursor">' as const;
		endTag = '</span>' as const;

		currentState: string = '';

		hasFocus: boolean = false;

		constructor(element: Element, queue: Queue) {
			this.element = element;
			this.queue = queue;
			this.hasFocus = true;
		}

		_writeToElement(html: string = this._html, position: number = this.currentPosition, length: number = this.currentLetter.length) {
			this.currentState = html;
			const before = html.substring(0, position);
			let at = html.substring(position, position + length);

			const after = html.substring(position + length);

			this.element.innerHTML = `${before}${this.startTag}${at || '&nbsp;'}${this.endTag}${after}`;
		}

		removeFocus() {
			this.hasFocus = false;
		}

		setFocus() {
			this.hasFocus = true;
		}

		async run() {
			await new Promise((resolve) => {
				let next = this.queue.get();
				const interval = setInterval(() => {
					if(next) {
						const {html, position, length} = next;
						this._writeToElement(html, position, length);
						next = this.queue.get();
					} else {
						clearInterval(interval);
						resolve('done');
					}
				}, this.delay + Math.random() * this.variety);
			})
		}

}