import { Queue } from './lib/typewriter/queue.js';
import { TypeWriter } from './lib/typewriter/typewriter.js';


function typewriterDefault () {
	const elements = [...document.querySelectorAll(`.typewriter:not(.markdown)`)];

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
}

function createWriteButton (text: string): HTMLButtonElement {
	const button = document.createElement('button');
	button.classList.add('write-more');
	button.innerText = text;
	return button;
}

function typewriterMarkdown () {
	const elements = [...document.querySelectorAll(`.markdown.typewriter`)];

	elements.forEach(element => {
		const typewriter = new TypeWriter(element, {delay: 0, variety: 30});
		const signsToRemove = Number(element.getAttribute('data-typewriter-remove')) || 300;
		typewriter.removeWithSave(-signsToRemove, true)
		typewriter.removeFocus();
		const addButton = createWriteButton('write more');

		element.appendChild(addButton);
		addButton.addEventListener('click', async () => {
			typewriter.setFocus().go();
			typewriter.removeFocus();
		});

	});

}



document.addEventListener('DOMContentLoaded', () => {

	typewriterDefault();
	typewriterMarkdown();

});
