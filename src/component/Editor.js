import { Buffer } from './Buffer';
class Editor {
  constructor() {
    this.textareaContent = '';
    this.textareaRow = [];
    this.cursor = { line: 0, pos: 0, number: 0 };
    this.maxRowLength = 77;
    this.buffer = new Buffer();
    this.selectPosition = null;
  }
  prepareTextareaRow = (string) => {
    const splitText = string.split('\n').map((row) => `${row}\n`);
    // if (splitText.length === 1) splitText[0] = splitText[0].slice(0, splitText[0].length - 1);
    const textArr = splitText.map((row) => {
      if (row.length <= this.maxRowLength) return row;
      const arr = [];
      let restString = row;
      while(restString.length > 77) {
        const rows = restString.match(/.{1,77}/g);
        const lastSpaceIndex = rows[0].lastIndexOf(' ');
        if (lastSpaceIndex !== -1) {
          arr.push(restString.slice(0, lastSpaceIndex + 1));
          restString = string.slice(lastSpaceIndex + 1);
        }

      }
      arr.push(restString);
      return arr;
    });
    return textArr.flat();
  }
  
  // overloadLastRow = (string) => {
  //   const lastSpaceIndex = string.lastIndexOf(' ');
  //   if (lastSpaceIndex !== -1) {
  //     const row = string.slice(0, lastSpaceIndex) + '\n';
  //     const lastRow = string.slice(lastSpaceIndex + 1);
  //     return [ row, lastRow ];
  //   }
  // }
  addSymbol(symbol) {
    const { line, pos, number } = this.cursor;
    if (number === this.textareaContent.length) {
      const newTextareaContent = this.textareaContent + symbol;
      this.textareaContent = newTextareaContent;
      this.textareaRow = this.prepareTextareaRow(this.textareaContent);
      const cursorPosition = this.findCursorPosition(number + symbol.length);
      this.cursor = {
        number: number + symbol.length,
        ...cursorPosition,
      }

      // if (symbol === '\n') {
      //   this.textareaRow[line] += symbol;
      //   this.textareaRow.push('');
      //   this.cursor = { line: (line + 1), pos: 0, number: (number + 1) };
      // } else if (this.textareaRow[line].length === this.maxRowLength) {
      //   if (symbol === ' ') {
      //     this.textareaRow[line] += `\n`;
      //     this.textareaRow.push('');
      //     this.cursor = { line: (line + 1), pos: 0, number: (number + 1) };
      //   } else if (symbol === '    ') {
      //     this.textareaRow[line] += `\n`;
      //     this.textareaRow.push('   ');
      //     this.cursor = { line: (line + 1), pos: 3, number: (number + 4) };
      //   } else {
      //     const lastTwoRows = this.overloadLastRow(this.textareaRow[line] + symbol);
      //     this.textareaRow.pop();
      //     this.textareaRow.push(...lastTwoRows);
      //     this.cursor = { line: (line + 1), pos: lastTwoRows[1].length, number: (number + 1) };
      //   }
      // } else {
      //   this.textareaRow[line] += symbol;
      //   this.cursor = { line, pos: (pos + 1), number: (number + 1) };
      // }
    } else {
      // если курсор внутри текста
      this.textareaContent = this.textareaContent.slice(0, number) + symbol + this.textareaContent.slice(number);
      this.textareaRow = this.prepareTextareaRow(this.textareaContent);
      const cursorPosition = this.findCursorPosition(number + symbol.length);
      this.cursor = {
        number: number + symbol.length,
        ...cursorPosition,
      }
      // if (symbol === '\n') {
      //   this.cursor = {
      //     line: (line + 1),
      //     pos: 0,
      //     number: (number + 1),
      //   };
      // } else {
      //   this.cursor = {
      //     line,
      //     pos: (pos + 1),
      //     number: (number + 1),
      //   };
      // }
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
    for (let i = 0; i < this.textareaRow.length; i++) {
      if (number - sumOfRowsLengths < this.textareaRow[i].length) {
        position.line = i;
        position.pos = number - sumOfRowsLengths;
        break;
      }
      sumOfRowsLengths += this.textareaRow[i].length;
    }
    return position;
  }

  deleteSymbol(direction) {
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
        this.textareaContent = this.textareaContent.slice(0, number - 1) + this.textareaContent.slice(number);
        this.textareaRow = this.prepareTextareaRow(this.textareaContent);
        const cursorPosition = this.findCursorPosition(number - 1);
        this.cursor = {
          number: number - 1,
          ...cursorPosition,
        }
      }
    } else {
      if (number < this.textareaContent.length) {
        this.textareaContent = this.textareaContent.slice(0, number) + this.textareaContent.slice(number + 1);
        this.textareaRow = this.prepareTextareaRow(this.textareaContent);
        this.cursor = {
          number,
          line,
          pos,
        };
      }
    }
    
  };

  replaceSelect(startSelect, endSelect, part) {
    const start = Math.min(startSelect, endSelect);
    const end = Math.max(startSelect, endSelect);
    this.textareaContent = this.textareaContent.slice(0, start) + part + this.textareaContent.slice(end);
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
  }

  cutSelect = (startSelect, endSelect) => {
    const start = Math.min(startSelect, endSelect);
    const end = Math.max(startSelect, endSelect);
    const cutText = this.textareaContent.slice(start, end);
    this.buffer.push(cutText);
    this.textareaContent = this.textareaContent.slice(0, start) + this.textareaContent.slice(end);
    this.textareaRow = this.prepareTextareaRow(this.textareaContent);

    const cursorPosition = this.findCursorPosition(start);
    this.cursor = {
      number: start,
      ...cursorPosition,
    };
  }

  // replaceSelect(selectText) {
  //   this.selectText = selectText;
  // }

  // changeTextareaRow() {
  //   const splitText = this.textareaContent.split('\n').map((row) => `${row}\n`);
  //   if (splitText.length === 1) splitText[0] = splitText[0].slice(0, splitText[0].length - 1);
  //   const textArr = splitText.map((row) => {
  //     if (row.length <= this.maxRowLength) return row;
  //     return row.match(/.{1,77}/g);
  //   });
  //   return textArr.flat();
  // }
}

export { Editor };
