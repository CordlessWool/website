import { Queue } from "./queue.js";

export interface TypeWriterOptions {
  delay?: number;
  variety?: number;
}

export interface QueueData {
  html: string;
  position: number;
  length: number;
}

export class TypeWriter {
  queue: Queue<QueueData>;
  currentPosition: number;
  currentLetter: string;
  delay: number;
  variety: number;
  startTag = '<span class="typewriter-cursor">' as const;
  endTag = "</span>" as const;
  subscription: ((html: string) => void)[];
  isFocused = false;

  virtualContent = "";

  constructor(html: string, options: TypeWriterOptions = {}) {
    this.delay = options.delay ?? 300;
    this.variety = options.variety ?? 150;
    this.currentLetter = "";
    this.virtualContent = html;

    this.currentPosition = this._html.length;
    this.subscription = [];
    this.queue = new Queue();
  }

  subscribe(fu: (html: string) => void) {
    this.subscription.push(fu);

    fu(this._getCurrentHTML());
  }

  get _html(): string {
    return this.virtualContent;
  }

  set _html(value: string) {
    this.virtualContent = value;
  }

  _getCurrentHTML(
    html: string = this._html,
    position: number = this.currentPosition,
    length: number = this.currentLetter.length,
  ) {
    if (this.isFocused) {
      const before = html.substring(0, position);
      let at = html.substring(position, position + length);

      const after = html.substring(position + length);

      this._html = html;
      this.currentPosition = position;
      this.currentLetter = at;

      return `${before}${this.startTag}${at || "&nbsp;"}${this.endTag}${after}`;
    } else {
      return html;
    }
  }

  _notifySubscribers(html: string = this._getCurrentHTML()) {
    this.subscription.forEach((fn) => fn(html));
  }
  removeFocus() {
    this.isFocused = false;
    this._notifySubscribers();
    return this;
  }

  setFocus(
    position: number = this.currentPosition,
    length: number = this.currentLetter.length,
  ) {
    this.isFocused = true;
    const html = this._getCurrentHTML(this._html, position, length);
    this._notifySubscribers(html);
    return this;
  }

  get hasFocus() {
    return this.isFocused;
  }

  isCursorAtEnd() {
    return this._html.length === this.currentPosition;
  }

  _stepBackward() {
    const previous = this._html.at(this.currentPosition - 1);
    if (previous === ">") {
      this.currentPosition = this._html.lastIndexOf(
        "<",
        this.currentPosition - 1,
      );
      this._stepBackward();
      return;
    } else if (previous === ";") {
      const special = this._html
        .substring(this.currentPosition - 5, 5)
        .match(/&[a-z]+;/);
      if (special) {
        this.currentLetter = special[0];
        return;
      }
    } else {
      this.currentLetter = previous || "";
    }
    this.currentPosition--;
  }

  _stepForward() {
    const next = this._html.at(this.currentPosition + 1);
    if (next === "<") {
      this.currentPosition = this._html.indexOf(">", this.currentPosition + 1);
      this._stepForward();
      return;
    } else if (next === "&") {
      const special = this._html
        .substring(this.currentPosition, 5)
        .match(/&[a-z]+;/);
      if (special) {
        this.currentLetter = special[0];
        return;
      }
    } else {
      this.currentLetter = next || "";
    }

    this.currentPosition++;
  }

  _removeCurrentLetter() {
    const before = this._html.substring(0, this.currentPosition);
    const after = this._html.substring(
      this.currentPosition + this.currentLetter.length,
    );
    this._html = `${before}${after}`;
  }

  _addLetter(letter: string) {
    const before = this._html.substring(0, this.currentPosition);
    const after = this._html.substring(this.currentPosition);
    this._html = `${before}${letter}${after}`;
  }

  _addHtmlTag(tag: string) {
    const before = this._html.substring(0, this.currentPosition);
    const after = this._html.substring(this.currentPosition);
    this._html = `${before}${tag}${after}`;
  }

  _step(singes: number) {
    const direction = singes > 0 ? -1 : 1;
    if (direction === 1) {
      this._stepBackward();
    } else {
      this._stepForward();
    }
    return direction;
  }

  _isLoopEndReached(singes: number) {
    if (singes === 0) {
      return this;
    } else if (singes > 0 && this.isCursorAtEnd()) {
      return this;
    } else if (singes < 0 && this.currentPosition === 0) {
      return this;
    }
  }

  move(singes: number) {
    if (this._isLoopEndReached(singes)) {
      return this;
    }

    const direction = this._step(singes);
    this.queue.add({
      html: this.virtualContent,
      position: this.currentPosition,
      length: this.currentLetter.length,
    });

    this.move(singes + direction);

    return this;
  }

  delete(singes: number): this {
    if (this._isLoopEndReached(singes)) {
      return this;
    }

    const direction = singes > 0 ? -1 : 1;

    if (direction === 1) {
      this._stepBackward();
    }
    this._removeCurrentLetter();

    this.queue.add({
      html: this.virtualContent,
      position: this.currentPosition,
      length: this.currentLetter.length,
    });

    return this.delete(singes + direction);
  }

  deleteAll() {
    this.delete(this._html.length - this.currentPosition);
    this.delete(-this.currentPosition);
    return this;
  }

  write(text: string): this {
    const next = text.at(0);
    if (next === undefined) {
      return this;
    }

    this._addLetter(next);
    this._stepForward();

    this.queue.add({
      html: this.virtualContent,
      position: this.currentPosition,
      length: this.currentLetter.length,
    });

    return this.write(text.substring(1));
  }

  /**
   * TODO: rewrite it
   * Spezial method for recording for writing text later
   */
  removeWithSave(signs: number, cut: boolean = false): this {
    if (this._isLoopEndReached(signs)) {
      this.queue.reverse();
      return this;
    }

    const direction = signs > 0 ? -1 : 1;

    if (direction === 1) {
      this._stepBackward();
    }

    this.queue.add({
      html: this.virtualContent,
      position: this.currentPosition,
      length: this.currentLetter.length,
    });

    //delete Empty tags
    this._html = this._html.replace(/<\w*><\/\w*>/, "");

    this._removeCurrentLetter();
    return this.removeWithSave(signs + direction, cut);
  }

  async go() {
    this.setFocus();
    while (!this.queue.isLast()) {
      const { html, position, length } = this.queue.next();
      const rendered = this._getCurrentHTML(html, position, length);
      this._notifySubscribers(rendered);
      await new Promise((resolve) =>
        setTimeout(resolve, this.delay + Math.random() * this.variety),
      );
    }
  }
}
