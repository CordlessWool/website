import { describe, test, expect, mock } from "bun:test";
import { TypeWriter } from "./typewriter";

function createHtmlElementMock(html: string) {
	return {
		innerHTML: html,
	} as HTMLElement;
}

describe("Typewriter", () => {

	test('defined', () => {
		const element = createHtmlElementMock("Hello, World!");
		const typewriter = new TypeWriter(element);

		expect(typewriter).toBeDefined();
	})

	test('removeCursor', () => {
		const element = createHtmlElementMock("Hello World!");
		new TypeWriter(element);

		expect(element.innerHTML).toBe('Hello World!<span class="typewriter-cursor">&nbsp;</span>');
	})

	test('removeCursor', () => {
		const element = createHtmlElementMock("Hello World!");
		const typewriter = new TypeWriter(element);

		typewriter._removeCursor();

		expect(element.innerHTML).toBe('Hello World!');
	});

	test('previous', () => {
		const element = createHtmlElementMock("Hello World!");
		const typewriter = new TypeWriter(element);

		typewriter.currentPosition = 6;
		typewriter._previous();

		expect(typewriter.currentPosition).toBe(5);
	});

	test('previous with tag', () => {
		const element = createHtmlElementMock("Hello <strong>World</strong>!");
		const typewriter = new TypeWriter(element);

		typewriter.currentPosition = 14;
		expect(typewriter._html.at(14)).toBe('W');
		typewriter._previous();

		expect(typewriter.currentPosition).toBe(5);
		expect(typewriter._html.at(typewriter.currentPosition)).toBe(' ');


	});

	test('next', () => {
		const element = createHtmlElementMock("Hello World!");
		const typewriter = new TypeWriter(element);

		typewriter.currentPosition = 6;
		typewriter._next();

		expect(typewriter.currentPosition).toBe(7);
	});

	test('next with tag', () => {
		const element = createHtmlElementMock("Hello <strong>World</strong>!");
		const typewriter = new TypeWriter(element);

		typewriter.currentPosition = 5;
		expect(typewriter._html.at(5)).toBe(' ');
		typewriter._next();

		expect(typewriter.currentPosition).toBe(14);
		expect(typewriter._html.at(typewriter.currentPosition)).toBe('W');
	});

	test('setCursor', () => {
		const element = createHtmlElementMock("Hello World!");
		const typewriter = new TypeWriter(element);
		typewriter._removeCursor();
		typewriter.currentPosition = 6;
		typewriter.currentLetter = 'X';
		typewriter._setCursor();

		expect(element.innerHTML).toBe('Hello <span class="typewriter-cursor">W</span>orld!');
	});

});