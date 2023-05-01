import { DataBuffer } from './Buffer';

class Editor {
  constructor() {
    this.textareaContent = '';
    this.textareaRow = [];
    this.cursor = { line: 0, pos: 0, number: 0 };
    this.maxRowLength = 77;
    this.buffer = new DataBuffer();
    this.selectPosition = null;
  }

  prepareTextareaRow = (string) => {
    const splitText = string.split('\n').map((row) => `${row}\n`);
    const textArr = splitText.map((row) => {
      if (row.length <= this.maxRowLength) return row;
      const arr = [];
      let restString = row;
      while (restString.length > this.maxRowLength) {
        const isFull = this.maxRowLength === 77 ? restString.match(/.{1,77}/g) : false;
        const isDesctop = this.maxRowLength === 60 ? restString.match(/.{1,60}/g) : false;
        const isTablet = this.maxRowLength === 52 ? restString.match(/.{1,52}/g) : restString.match(/.{1,30}/g);
        const rows = isFull || isDesctop || isTablet;
        const lastSpaceIndex = rows[0].lastIndexOf(' ');
        if (lastSpaceIndex !== -1) {
          arr.push(restString.slice(0, lastSpaceIndex + 1));
          restString = string.slice(lastSpaceIndex + 1);
        } else {
          arr.push(rows[0].slice(0, -1));
          restString = string.slice(this.maxRowLength - 1);
        }
      }
      arr.push(restString);
      return arr;
    });
    return textArr.flat();
  };

  addSymbol(symbol) {
    const { number } = this.cursor;
    if (number === this.textareaContent.length) {
      const newTextareaContent = this.textareaContent + symbol;
      this.textareaContent = newTextareaContent;
      this.textareaRow = this.prepareTextareaRow(this.textareaContent);
      const cursorPosition = this.findCursorPosition(number + symbol.length);
      this.cursor = {
        number: number + symbol.length,
        ...cursorPosition,
      };
    } else {
      this.textareaContent = this.textareaContent.slice(0, number)
        + symbol + this.textareaContent.slice(number);
      this.textareaRow = this.prepareTextareaRow(this.textareaContent);
      const cursorPosition = this.findCursorPosition(number + symbol.length);
      this.cursor = {
        number: number + symbol.length,
        ...cursorPosition,
      };
    }
  }

  setCursorPosition = (number) => {
    this.cursor = {
      number,
      ...this.findCursorPosition(number),
    };
  };

  findCursorPosition = (number) => {
    let sumOfRowsLengths = 0;
    const position = {};
    for (let i = 0; i < this.textareaRow.length; i += 1) {
      if (number - sumOfRowsLengths < this.textareaRow[i].length) {
        position.line = i;
        position.pos = number - sumOfRowsLengths;
        break;
      }
      sumOfRowsLengths += this.textareaRow[i].length;
    }
    return position;
  };

  deleteSymbol = (direction) => {
    const { line, pos, number } = this.cursor;
    if (number === this.textareaContent.length) {
      if (direction === 'prev') {
        const newTextareaContent = this.textareaContent.slice(0, -1);
        this.textareaContent = newTextareaContent;
        this.textareaRow = this.prepareTextareaRow(this.textareaContent);
        this.cursor = {
          number: (this.textareaContent.length),
          line: (this.textareaRow.length - 1),
          pos: (this.textareaRow[this.textareaRow.length - 1].length),
        };
      }
    } else if (direction === 'prev') {
      if (number !== 0) {
        this.textareaContent = this.textareaContent.slice(0, number - 1)
          + this.textareaContent.slice(number);
        this.textareaRow = this.prepareTextareaRow(this.textareaContent);
        const cursorPosition = this.findCursorPosition(number - 1);
        this.cursor = {
          number: number - 1,
          ...cursorPosition,
        };
      }
    } else if (number < this.textareaContent.length) {
      this.textareaContent = this.textareaContent.slice(0, number)
        + this.textareaContent.slice(number + 1);
      this.textareaRow = this.prepareTextareaRow(this.textareaContent);
      this.cursor = {
        number,
        line,
        pos,
      };
    }
  };

  replaceSelect(startSelect, endSelect, part) {
    const start = Math.min(startSelect, endSelect);
    const end = Math.max(startSelect, endSelect);
    this.textareaContent = this.textareaContent.slice(0, start)
      + part + this.textareaContent.slice(end);
    this.textareaRow = this.prepareTextareaRow(this.textareaContent);

    const cursorPosition = this.findCursorPosition(start + part.length);
    this.cursor = {
      number: start + part.length,
      ...cursorPosition,
    };
  }

  saveSelect = (startSelect, endSelect) => {
    const start = Math.min(startSelect, endSelect);
    const end = Math.max(startSelect, endSelect);
    const copyText = this.textareaContent.slice(start, end);
    this.buffer.push(copyText);
  };

  cutSelect = (startSelect, endSelect) => {
    const start = Math.min(startSelect, endSelect);
    const end = Math.max(startSelect, endSelect);
    const cutText = this.textareaContent.slice(start, end);
    this.buffer.push(cutText);
    this.textareaContent = this.textareaContent.slice(0, start)
      + this.textareaContent.slice(end);
    this.textareaRow = this.prepareTextareaRow(this.textareaContent);

    const cursorPosition = this.findCursorPosition(start);
    this.cursor = {
      number: start,
      ...cursorPosition,
    };
  };
}

export { Editor };
