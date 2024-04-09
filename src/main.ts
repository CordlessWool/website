import { TypeWriter } from './lib/typewriter/typewriter.js';




document.addEventListener('DOMContentLoaded', () => {
	const elements = [...document.querySelectorAll(`[data-typewriter="true"]`)];

	elements.forEach(async element => {
		const text = element.getAttribute('data-typewriter-text');
		const separator = element.getAttribute('data-typewriter-separator') || '';
		if(text) {
			const allText = text.split(separator);
			const delay = element.getAttribute('data-typewriter-delay') || 100;
			const loop = element.getAttribute('data-typewriter-loop') || false;


			const writer = new TypeWriter(element);

		}

	});
});
