import { TypeWriter } from './lib/typewriter/typewriter.js';




document.addEventListener('DOMContentLoaded', () => {
	const elements = [...document.querySelectorAll(`[data-typewriter="true"]`)];

	elements.forEach(async element => {
		const text = element.getAttribute('data-typewriter-text');
		const separator = element.getAttribute('data-typewriter-separator') || '';
		if(text) {
			const allText = text.split(separator);
			const delay: number = Number(element.getAttribute('data-typewriter-delay') ?? 10);
			const loop = element.getAttribute('data-typewriter-loop') || false;


			const typewriter = new TypeWriter(element, {delay: delay});

			for(let i = 0; i < allText.length; i++) {
				await typewriter.deleteAll().write(allText[i]).go();
				await new Promise(resolve => setTimeout(resolve, 1000));
			}

		}

	});
});
