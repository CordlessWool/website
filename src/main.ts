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

			const typewriter = new TypeWriter(element, {delay: delay});

			while(queue.isLast() === false) {
				await typewriter.deleteAll().write(queue.next()).go();
				await new Promise(resolve => setTimeout(resolve, Math.random() * 1500 + 3000));
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
		const signsToRemove = Number(element.getAttribute('data-typewriter-remove'));
		if(signsToRemove && signsToRemove > 0) {
			const typewriter = new TypeWriter(element, {delay: 0, variety: 30});
			typewriter.removeWithSave(-signsToRemove, true)
			typewriter.removeFocus();
			const addButton = createWriteButton('write more');

			element.appendChild(addButton);
			addButton.addEventListener('click', async () => {
				typewriter.setFocus().go();
				typewriter.removeFocus();
			});
		}

	});

}

function darkLightMode () {
	// On page load or when changing themes, best to add inline in `head` to avoid FOUC
	if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
		document.documentElement.classList.add('dark')
	} else {
		document.documentElement.classList.remove('dark')
	}

	const themeToggleButton = document.getElementById('toggle-color-theme')
	if(themeToggleButton) {
		themeToggleButton.addEventListener('click', () => {
			document.documentElement.classList.toggle('dark')
			localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
		});
	}



}

function toggleLanguage () {
	const languageButton = document.getElementById('toggle-language-button');
	if(languageButton) {
		const url = new URL(window.location.href);
		const language = url.pathname.split('/')[1];
		languageButton.addEventListener('click', () => {
			const newLanguage = language === 'en' ? 'de' : 'en';
			url.pathname = url.pathname.replace(language, newLanguage);
			window.location.href = url.href;
		});
	}
}

function toggleMenu () {
	const menuButton = document.getElementById('menu-button');
	if(menuButton) {
		menuButton.addEventListener('click', () => {
			menuButton.classList.toggle('open');
		});
	}
}


document.addEventListener('DOMContentLoaded', () => {
	toggleMenu();
	typewriterDefault();
	typewriterMarkdown();


});

toggleLanguage();
darkLightMode();
