import { describe, test, expect } from "vitest";
import { TypeWriter } from "./typewriter";

const promiseSubscribe = (typewriter: TypeWriter) => {
  return new Promise((resolve) => {
    typewriter.subscribe((html) => {
      resolve(html);
    });
  });
};

describe("Typewriter", () => {
  test("defined", () => {
    const typewriter = new TypeWriter("Hello, World!");

    expect(typewriter).toBeDefined();
  });

  test("has cursor", async () => {
    const typewriter = new TypeWriter("Hello World!");

    typewriter.setFocus();

    const content = await promiseSubscribe(typewriter);

    expect(typewriter._html).toBe("Hello World!");
    expect(content).toBe(
      'Hello World!<span class="typewriter-cursor">&nbsp;</span>',
    );
  });

  test("removeCursor", async () => {
    const typewriter = new TypeWriter("Hello World!");

    typewriter.removeFocus();

    const content = await promiseSubscribe(typewriter);

    expect(content).toBe("Hello World!");
  });

  test("previous", async () => {
    const typewriter = new TypeWriter("Hello World!");

    typewriter.currentPosition = 6;
    typewriter._stepBackward();

    expect(typewriter.currentPosition).toBe(5);
  });

  test("previous with tag", () => {
    const typewriter = new TypeWriter("Hello <strong>World</strong>!");

    typewriter.currentPosition = 14;
    expect(typewriter._html.at(14)).toBe("W");
    typewriter._stepBackward();

    expect(typewriter.currentPosition).toBe(5);
    expect(typewriter._html.at(typewriter.currentPosition)).toBe(" ");
  });

  test("next", () => {
    const typewriter = new TypeWriter("Hello World!");

    typewriter.currentPosition = 6;
    typewriter._stepForward();

    expect(typewriter.currentPosition).toBe(7);
  });

  test("next with tag", () => {
    const typewriter = new TypeWriter("Hello <strong>World</strong>!");

    typewriter.currentPosition = 5;
    expect(typewriter._html.at(5)).toBe(" ");
    typewriter._stepForward();

    expect(typewriter.currentPosition).toBe(14);
    expect(typewriter._html.at(typewriter.currentPosition)).toBe("W");
  });

  test("setCursor", async () => {
    const typewriter = new TypeWriter("Hello World!");
    typewriter.setFocus(6, 1);
    const content = await promiseSubscribe(typewriter);
    expect(content).toBe('Hello <span class="typewriter-cursor">W</span>orld!');
  });

  test("step forward", () => {
    const typewriter = new TypeWriter("Hello World!");
    typewriter.currentPosition = 4;
    typewriter.currentLetter = "l";
    expect(typewriter.currentLetter).toBe("l");
    expect(typewriter.currentPosition).toBe(4);
    typewriter._stepForward();
    expect(typewriter.currentLetter).toBe(" ");
    expect(typewriter.currentPosition).toBe(5);
    typewriter._stepForward();

    expect(typewriter.currentLetter).toBe("W");
    expect(typewriter.currentPosition).toBe(6);
    typewriter._stepForward();
    expect(typewriter.currentLetter).toBe("o");
    expect(typewriter.currentPosition).toBe(7);
    typewriter._stepForward();
    expect(typewriter.currentLetter).toBe("r");
    expect(typewriter.currentPosition).toBe(8);
  });

  test("step backward", () => {
    const typewriter = new TypeWriter("Hello World!");
    typewriter.currentPosition = 7;
    typewriter._stepBackward();

    expect(typewriter.currentLetter).toBe("W");
    expect(typewriter.currentPosition).toBe(6);
    typewriter._stepBackward();
    expect(typewriter.currentLetter).toBe(" ");
    expect(typewriter.currentPosition).toBe(5);
    typewriter._stepBackward();
    expect(typewriter.currentLetter).toBe("o");
    expect(typewriter.currentPosition).toBe(4);
  });

  test("move cursor to end", async () => {
    const typewriter = new TypeWriter("Hello World!", { delay: 0, variety: 1 });
    typewriter.currentPosition = 2;
    await typewriter.move(100).go();
    const content = await promiseSubscribe(typewriter);
    expect(content).toBe(
      'Hello World!<span class="typewriter-cursor">&nbsp;</span>',
    );
  });

  test("move cursor to start", async () => {
    const typewriter = new TypeWriter("Hello World!", { delay: 0, variety: 1 });
    typewriter.currentPosition = 12;
    await typewriter.move(-100).go();
    const content = await promiseSubscribe(typewriter);
    expect(content).toBe('<span class="typewriter-cursor">H</span>ello World!');
  });

  test("move over tags forward", async () => {
    const typewriter = new TypeWriter(
      "Hello <strong><em>World</em></strong>!",
      { delay: 0, variety: 1 },
    );
    typewriter.currentPosition = 2;
    await typewriter.move(100).go();
    const content = await promiseSubscribe(typewriter);
    expect(content).toBe(
      'Hello <strong><em>World</em></strong>!<span class="typewriter-cursor">&nbsp;</span>',
    );
  });

  test("move over tags backward", async () => {
    const typewriter = new TypeWriter(
      "Hello <strong><em>World</em></strong>!",
      { delay: 0, variety: 1 },
    );
    typewriter.currentPosition = 12;
    await typewriter.move(-100).go();
    const content = await promiseSubscribe(typewriter);
    expect(content).toBe(
      '<span class="typewriter-cursor">H</span>ello <strong><em>World</em></strong>!',
    );
  });

  test("delete", async () => {
    const typewriter = new TypeWriter("Some other random text!", {
      delay: 0,
      variety: 1,
    });
    await typewriter.delete(-7).go();
    typewriter.removeFocus();
    const content = await promiseSubscribe(typewriter);
    expect(content).toBe("Some other rando");
  });

  test("write", async () => {
    const typewriter = new TypeWriter("Some other random text!", {
      delay: 0,
      variety: 1,
    });
    await typewriter.write("m").go();
    typewriter.removeFocus();
    const content = await promiseSubscribe(typewriter);
    expect(content).toBe("Some other random text!m");
  });

  test("write long text", async () => {
    const typewriter = new TypeWriter("Some other random text!", {
      delay: 0,
      variety: 1,
    });
    await typewriter.write(" Hello World!").go();
    typewriter.removeFocus();
    const content = await promiseSubscribe(typewriter);
    expect(content).toBe("Some other random text! Hello World!");
  });

  test("write with tag", async () => {
    const typewriter = new TypeWriter("Some other random text!", {
      delay: 0,
      variety: 1,
    });
    await typewriter.write("<strong>Hello World!</strong>").go();
    typewriter.removeFocus();
    const content = await promiseSubscribe(typewriter);
    expect(content).toBe(
      "Some other random text!<strong>Hello World!</strong>",
    );
  });

  test("write with existing tag", async () => {
    const typewriter = new TypeWriter(
      "Some <strong>other</strong> random text!",
      { delay: 0, variety: 1 },
    );
    await typewriter.write("Hello World!").go();
    typewriter.removeFocus();
    const content = await promiseSubscribe(typewriter);
    expect(content).toBe(
      "Some <strong>other</strong> random text!Hello World!",
    );
  });

  test("delete with tag", async () => {
    const typewriter = new TypeWriter(
      "Some other <strong>random</strong> text!",
      { delay: 0, variety: 1 },
    );
    await typewriter.delete(-7).go();
    typewriter.removeFocus();
    const content = await promiseSubscribe(typewriter);
    expect(content).toBe("Some other <strong>rando</strong>");
  });

  test("delete all", async () => {
    const typewriter = new TypeWriter("Some other random text!", {
      delay: 0,
      variety: 1,
    });
    await typewriter.deleteAll().go();
    typewriter.removeFocus();
    const content = await promiseSubscribe(typewriter);
    expect(content).toBe("");
  });
});
