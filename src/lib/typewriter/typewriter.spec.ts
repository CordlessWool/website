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

	test('has cursor', () => {
		const element = createHtmlElementMock("Hello World!");
		const typewriter = new TypeWriter(element);

		typewriter._writeToElement(typewriter._html, typewriter.currentPosition, typewriter.currentLetter.length);

		expect(typewriter._html).toBe('Hello World!');
		expect(element.innerHTML).toBe('Hello World!<span class="typewriter-cursor">&nbsp;</span>');
	})

	test('removeCursor', () => {
		const element = createHtmlElementMock("Hello World!");
		const typewriter = new TypeWriter(element);

		typewriter.removeFocus();

		expect(element.innerHTML).toBe('Hello World!');
	});

	test('previous', () => {
		const element = createHtmlElementMock("Hello World!");
		const typewriter = new TypeWriter(element);

		typewriter.currentPosition = 6;
		typewriter._stepBackward();

		expect(typewriter.currentPosition).toBe(5);
	});

	test('previous with tag', () => {
		const element = createHtmlElementMock("Hello <strong>World</strong>!");
		const typewriter = new TypeWriter(element);

		typewriter.currentPosition = 14;
		expect(typewriter._html.at(14)).toBe('W');
		typewriter._stepBackward();

		expect(typewriter.currentPosition).toBe(5);
		expect(typewriter._html.at(typewriter.currentPosition)).toBe(' ');


	});

	test('next', () => {
		const element = createHtmlElementMock("Hello World!");
		const typewriter = new TypeWriter(element);

		typewriter.currentPosition = 6;
		typewriter._stepForward();

		expect(typewriter.currentPosition).toBe(7);
	});

	test('next with tag', () => {
		const element = createHtmlElementMock("Hello <strong>World</strong>!");
		const typewriter = new TypeWriter(element);

		typewriter.currentPosition = 5;
		expect(typewriter._html.at(5)).toBe(' ');
		typewriter._stepForward();

		expect(typewriter.currentPosition).toBe(14);
		expect(typewriter._html.at(typewriter.currentPosition)).toBe('W');
	});

	test('setCursor', () => {
		const element = createHtmlElementMock("Hello World!");
		const typewriter = new TypeWriter(element);
		typewriter._writeToElement(typewriter._html, 6, 1);

		expect(element.innerHTML).toBe('Hello <span class="typewriter-cursor">W</span>orld!');
	});

	test('step forward', () => {
		const element = createHtmlElementMock("Hello World!");
		const typewriter = new TypeWriter(element);
		typewriter.currentPosition = 4;
		typewriter.currentLetter = 'l';
		expect(typewriter.currentLetter).toBe('l');
		expect(typewriter.currentPosition).toBe(4);
		typewriter._stepForward();
		expect(typewriter.currentLetter).toBe(' ');
		expect(typewriter.currentPosition).toBe(5);
		typewriter._stepForward();


		expect(typewriter.currentLetter).toBe('W');
		expect(typewriter.currentPosition).toBe(6);
		typewriter._stepForward();
		expect(typewriter.currentLetter).toBe('o');
		expect(typewriter.currentPosition).toBe(7);
		typewriter._stepForward();
		expect(typewriter.currentLetter).toBe('r');
		expect(typewriter.currentPosition).toBe(8);
	})

	test('step backward', () => {
		const element = createHtmlElementMock("Hello World!");
		const typewriter = new TypeWriter(element);
		typewriter.currentPosition = 7;
		typewriter._stepBackward();

		expect(typewriter.currentLetter).toBe('W');
		expect(typewriter.currentPosition).toBe(6);
		typewriter._stepBackward();
		expect(typewriter.currentLetter).toBe(' ');
		expect(typewriter.currentPosition).toBe(5);
		typewriter._stepBackward();
		expect(typewriter.currentLetter).toBe('o');
		expect(typewriter.currentPosition).toBe(4);
	});


	test('move cursor to end', async () => {
		const element = createHtmlElementMock("Hello World!");
		const typewriter = new TypeWriter(element, {delay: 0, variety: 1});
		typewriter.currentPosition = 2;
		await typewriter.move(100).go();

		expect(element.innerHTML).toBe('Hello World!<span class="typewriter-cursor">&nbsp;</span>');
	});

	test('move cursor to start', async () => {
		const element = createHtmlElementMock("Hello World!");
		const typewriter = new TypeWriter(element, {delay: 0, variety: 1});
		typewriter.currentPosition = 12;
		await typewriter.move(-100).go();

		expect(element.innerHTML).toBe('<span class="typewriter-cursor">H</span>ello World!');
	});

	test('move over tags forward', async () => {
		const element = createHtmlElementMock("Hello <strong><em>World</em></strong>!");
		const typewriter = new TypeWriter(element, {delay: 0, variety: 1});
		typewriter.currentPosition = 2;
		await typewriter.move(100).go();

		expect(element.innerHTML).toBe('Hello <strong><em>World</em></strong>!<span class="typewriter-cursor">&nbsp;</span>');
	});

	test('move over tags backward', async () => {
		const element = createHtmlElementMock("Hello <strong><em>World</em></strong>!");
		const typewriter = new TypeWriter(element, {delay: 0, variety: 1});
		typewriter.currentPosition = 12;
		await typewriter.move(-100).go();

		expect(element.innerHTML).toBe('<span class="typewriter-cursor">H</span>ello <strong><em>World</em></strong>!');
	});

	test('delete', async () => {
		const element = createHtmlElementMock("Some other random text!");
		const typewriter = new TypeWriter(element, {delay: 0, variety: 1});
		await typewriter.delete(-7).go();
		typewriter.removeFocus();
		expect(element.innerHTML).toBe('Some other rando');
	});

	test('write', async () => {
		const element = createHtmlElementMock("Some other random text!");
		const typewriter = new TypeWriter(element, {delay: 0, variety: 1});
		await typewriter.write('m').go();
		typewriter.removeFocus();
		expect(element.innerHTML).toBe('Some other random text!m');
	});

	test('write long text', async () => {
		const element = createHtmlElementMock("Some other random text!");
		const typewriter = new TypeWriter(element, {delay: 0, variety: 1});
		await typewriter.write(' Hello World!').go();
		typewriter.removeFocus();
		expect(element.innerHTML).toBe('Some other random text! Hello World!');
	});

	test('write with tag', async () => {
		const element = createHtmlElementMock("Some other random text!");
		const typewriter = new TypeWriter(element, {delay: 0, variety: 1});
		await typewriter.write('<strong>Hello World!</strong>').go();
		typewriter.removeFocus();
		expect(element.innerHTML).toBe('Some other random text!<strong>Hello World!</strong>');
	});

	test('write with existing tag', async () => {
		const element = createHtmlElementMock("Some <strong>other</strong> random text!");
		const typewriter = new TypeWriter(element, {delay: 0, variety: 1});
		await typewriter.write('Hello World!').go();
		typewriter.removeFocus();
		expect(element.innerHTML).toBe('Some <strong>other</strong> random text!Hello World!');
	});

	test('delete with tag', async () => {
		const element = createHtmlElementMock("Some other <strong>random</strong> text!");
		const typewriter = new TypeWriter(element, {delay: 0, variety: 1});
		await typewriter.delete(-7).go();
		typewriter.removeFocus();
		expect(element.innerHTML).toBe('Some other <strong>rando</strong>');
	});

	test.skip('delete empty tags', async () => {
		const element = createHtmlElementMock("Some other <strong>random</strong> text!");
		const typewriter = new TypeWriter(element, {delay: 0, variety: 1});
		await typewriter.delete(-13).go();
		typewriter.removeFocus();
		expect(element.innerHTML).toBe('Some other');
	});

	test('delete all', async () => {
		const element = createHtmlElementMock("Some other random text!");
		const typewriter = new TypeWriter(element, {delay: 0, variety: 1});
		await typewriter.deleteAll().go();
		typewriter.removeFocus();
		expect(element.innerHTML).toBe('');
	})

});