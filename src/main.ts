import { Queue } from './lib/typewriter/queue.js';
import { TypeWriter } from './lib/typewriter/typewriter.js';




document.addEventListener('DOMContentLoaded', () => {
	const elements = [...document.querySelectorAll(`[data-typewriter="true"]`)];

	elements.forEach(async element => {
		const text = element.getAttribute('data-typewriter-text');
		const separator = element.getAttribute('data-typewriter-separator') || '';
		if(text) {
			const allText = text.split(separator);
			const queue = new Queue<string>(allText);
			const delay: number = Number(element.getAttribute('data-typewriter-delay') ?? 30);
			const loop = element.getAttribute('data-typewriter-loop') || false;


			const typewriter = new TypeWriter(element, {delay: delay});

			while(1) {
				await typewriter.deleteAll().write(queue.random()).go();
				await new Promise(resolve => setTimeout(resolve, 1000));
			};

		}

	});
});
