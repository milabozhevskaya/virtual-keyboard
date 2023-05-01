import { Editor } from "./Editor";
import { Add } from './command/Add';
import { Delete } from './command/Delete';
import { History } from "./EditHistory";
import { Copy } from "./command/Copy";
import { Replace } from "./command/Replace";
import { Cut } from "./command/Cut";
import { Paste } from "./command/Paste";
import { LocalStorageData } from "./LocalStorage";

class Controller {
  constructor(store) {
    this.store = store;
    this.editor = new Editor();
    this.history = new History({
      backupTextareaContent: '',
      backupCursor: { line: 0, pos: 0, number: 0 },
      backupTextareaRow: [''],
    });
    this.localStorageData = this.getLocalStorageData();
    this.activeBtns = {};
    this.lastControl = { id: null, time: null };
    this.activeControls = {};
    this.lastKey = null;
    this.newSymbol = null;
    this.selectedTextRange = null;
    
    this.store.onChangeLocalStorageData.add((data) => this.toLocalStorageData(data));

  }

  controlCombinations = [
    // ['Control', 'Delete'],
    // ['Control', 'Backspace'],
    ['Control', 'KeyX'],
    ['Control', 'KeyC'],
    ['Control', 'KeyV'],
    ['Control', 'KeyZ'],
    // ['Control', 'KeyS'],
    // ['Control', 'KeyA'],
    // ['Control', 'KeyB'],
    // ['Control', 'KeyI'],
    // ['Control', 'KeyU'],
    // ['Control', 'BracketLeft'],
    // ['Control', 'BracketRight'],
    // ['Control', 'KeyL'],
    // ['Control', 'KeyE'],
    // ['Control', 'KeyR'],
    ['Control', 'KeyY'],
    ['Control', 'Shift'],
  ];

  excludeKey = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];
  
  toLocalStorageData = (dataFromLocalSorage) => {
    localStorage.setItem('virtual_keyboard_by_Mi', LocalStorageData.toJson(dataFromLocalSorage));
  }

  
  getLocalStorageData = () => {
    try {
      const data = LocalStorageData.fromJson(JSON.parse(localStorage.getItem('virtual_keyboard_by_Mi') || ''));
      return data;
    } catch (e) {
      return new LocalStorageData({ lang: 'en', textareaContent: '', textareaRow: [''], cursor: { number: 0, line: 0, pos: 0 }});
    }
  }


  hasActiveShift = () => {
    const activeKeys = Object.keys(this.activeControls)
      .filter((i) => this.activeControls[i] !== 0);
    return activeKeys.length === 1 && (activeKeys.includes('ShiftLeft') || activeKeys.includes('ShiftRight'));
  };

  symbol = (code, { value, value_shift: shiftValue }) => {
    let symbol = '';
    if (code.includes('Key')) {
      symbol = (
        (this.hasActiveShift() && !this.store.capsLock) || (!this.hasActiveShift() && this.store.capsLock)
      ) ? shiftValue : value;
    }
    else symbol = this.hasActiveShift() ? shiftValue : value;

    this.add(symbol);
  };

  delete = (code, { value }) => {
    this.deleteDirection = code === 'Backspace' ? 'prev' : 'next';
    this.editor.textareaContent = this.store.textareaContent;
    this.editor.textareaRow = this.store.textareaRow;
    this.editor.cursor = this.store.cursor;
    this.executeCommand(new Delete(this, this.editor));
    this.store.textareaContent = this.editor.textareaContent;
    this.store.textareaRow = this.editor.textareaRow;
    this.store.cursor = this.editor.cursor;
    this.deleteDirection = null;
  };

  space = (code, { value }) => {
    this.add(value);
  };

  capsLock = (code, { value }) => {
    const caps = this.store.capsLock;
    this.store.capsLock = !caps;
  };

  moveCursor = (code) => {
    const direction = code.slice(5).toLowerCase();
    if (this.isSelectedText) {
      
      const start = Math.min(this.selectedTextRange.start, this.selectedTextRange.end);
      const end = Math.max(this.selectedTextRange.start, this.selectedTextRange.end);
      
      this.editor.textareaContent = this.store.textareaContent;
      this.editor.textareaRow = this.store.textareaRow;
      this.editor.cursor = this.store.cursor;
      this.editor.setCursorPosition(
        (direction === 'left' || direction === 'up')
          ? start : end
      );
      this.store.cursor = this.editor.cursor;
      this.isSelectedText = false;
      this.isCopiedText = false;
      this.selectedTextRange = null;
      if (direction === 'left' || direction === 'right') return true;;
    }

    this.cursorHandler[direction]();
    return true;
  }

  add = (symbol) => {
    this.newSymbol = symbol;

    if (this.isSelectedText) {
      
      this.editor.textareaContent = this.store.textareaContent;
      this.editor.textareaRow = this.store.textareaRow;
      this.editor.cursor = this.store.cursor;
      this.executeCommand(new Replace(this, this.editor));
      this.store.textareaContent = this.editor.textareaContent;
      this.store.textareaRow = this.editor.textareaRow;
      this.store.cursor = this.editor.cursor;
      this.isSelectedText = false;
      this.isCopiedText = false;
      this.selectedTextRange = null;
      this.newSymbol = '';
      return;
    }

    this.editor.textareaContent = this.store.textareaContent;
    this.editor.textareaRow = this.store.textareaRow;
    this.editor.cursor = this.store.cursor;
    this.executeCommand(new Add(this, this.editor));
    this.store.textareaContent = this.editor.textareaContent;
    this.store.textareaRow = this.editor.textareaRow;
    this.store.cursor = this.editor.cursor;
    this.newSymbol = '';
    // const textareaContent = this.store.textareaContent + symbol;
    // this.store.textareaContent = textareaContent;

  };

  mouseDown = (code, time) => {
    const lang = this.store.lang[this.store.langIndex];
    const key = this.store.getKeyContent(code);
    const { type } = key;
    // this.activeBtns = this.store.activeBtns;
    // this.lastControl = this.store.lastControl;
    // this.activeControls = this.store.activeControls;
    // this.lastKey = this.store.lastKey;

    if (type === 'control') {
      if ((this.lastControl.id && this.lastControl.id === code)
        && (this.lastControl.time && ((time - this.lastControl.time) < 300))) {
        // если последняя контольная есть и совпадает с пришедшей 
        // и отличие во времени меньше 300 мсек
        // то добавляем в активные контролы
        this.activeControls[code] = 1;
        // возможно можно убрать - это активные бтны сохраняются
        // также по коду
        this.activeBtns[code] = 1;
        // также заменяем последнюю кнопку на пришедшую
        this.lastKey = code;
      } else {
        if (!this.hasControls()) {
          // если контрольных точек до этого еще не выбрано
          // то просто записывает в последнюю контрльную
          this.lastControl = { id: code, time };
          this.activeBtns[code] = 1;
          this.lastKey = code;
        } else {
          if (this.activeControls[code]) {
            this.activeControls[code] = 0;
            this.activeBtns[code] = 1;
            this.lastKey = code;
            this.lastControl = { id: null, time: null };
          } else if (!this.hasControlCombination(code)) {
            this.activeControls[code] = 0;
            this.activeBtns[code] = 1;
            this.lastKey = code;
            this.lastControl = { id: code, time };
            // здесь надо еще проверка на колво акт.контролов
            // чтоб не превышала цепочка в 4 контрола, иначе сброс
          } else {
            this.resetControls();
            this.lastControl = { id: null, time: null };
            this.activeBtns[code] = 1;
            this.lastKey = code;
          }
        }
      }
    } else if (this.hasControls()) {
      if (this.hasControlCombination(code)) {
        this.resetControls();
        this.lastControl = { id: null, time: null };
        this.lastKey = code;
        this.activeBtns[code] = 1;
      } else {
        // if (type === 'capsLock') this.state.changeCapsLock();
        // else if (type === 'move') this.moveCursor(code);
        // else if (type === 'delete') this.delete(code);
        // else 
        if (type === 'meta' || !this.editMap[type]);
        else this.editMap[type](code, key[lang]);
        this.resetControls();
        this.lastControl = { id: null, time: null };
        this.lastKey = code;
        this.activeBtns[code] = 1;
      }
    } else {
      // если нет выбранных контрольных
      this.lastControl = { id: null, time: null };
      this.lastKey = code;
      this.activeBtns[code] = 1;
      if (type === 'meta' || !this.editMap[type]);
      else this.editMap[type](code, key[lang]);
    }
    this.store.activeBtns = this.activeBtns;
  }

  mouseUp = (code, time) => {
    // console.log(code);
    const lang = this.store.lang[this.store.langIndex];
    const key = this.store.getKeyContent(code);
    const { type } = key;

    this.activeBtns = this.store.activeBtns;
    if (this.lastKey === code) {
      if (this.hasControls()) {
        if (this.activeControls[code] === 0) this.activeBtns[code] = 0;
        this.lastKey = null;
      } else {
        const arr = Object.keys(this.activeBtns);
        for (let i = 0; i < arr.length; i += 1) {
          this.activeBtns[arr[i]] = 0;
        }
      }
    } else if (this.lastKey !== null) {
      if (this.hasControls()) {
        if (this.activeControls[this.lastKey] === 0) this.activeBtns[this.lastKey] = 0;
        this.lastKey = null;
      } else {
        const arr = Object.keys(this.activeBtns);
        for (let i = 0; i < arr.length; i += 1) {
          this.activeBtns[arr[i]] = 0;
        }
      }
    }
    this.store.activeBtns = this.activeBtns;
    
    if (!(type === 'control' || type === 'capslock' || type === 'meta') && this.isSelectedText && !this.isCopiedText) {
      // this.selectedTextRange = null;
      this.isSelectedText = false;
    }
  }

  resetControls = () => { this.activeControls = {}; };

  hasControlCombination(code) {
    const controlsKeys = Object.keys(this.activeControls)
      .filter((i) => (this.activeControls[i] !== 0));
    controlsKeys.push(code);
    const activeControlsKeys = controlsKeys
      .map((i) => {
        if (i === 'ShiftLeft' || i === 'ShiftRight') return 'Shift';
        if (i === 'AltLeft' || i === 'AltRight') return 'Alt';
        if (i === 'ControlLeft' || i === 'ControlRight') return 'Control';
        return i;
      });
    for (let i = 0; i < this.controlCombinations.length; i += 1) {
      if (this.controlCombinations[i].every((l) => (activeControlsKeys.includes(l)))) {
        if (this.controlCombinations[i].join('') === 'ControlShift') {
          const langIndex = this.store.langIndex;
          this.store.langIndex = (langIndex + 1) % this.store.lang.length;
          // localStorage.setItem('key_lang', lang);
        }
        if (this.controlCombinations[i].join('') === 'ControlKeyZ') {
          if (this.isSelectedText) {
            this.isSelectedText = false;
            this.isCopiedText = false;
            this.selectedTextRange = null;
          }
      
          const backCommand = this.history.back();
          if (backCommand) {
            this.store.textareaContent = backCommand.backupTextareaContent;
            this.store.cursor = backCommand.backupCursor;
            this.store.textareaRow = backCommand.textareaRow;
          }
        }
        if (this.controlCombinations[i].join('') === 'ControlKeyY') {
          if (this.isSelectedText) {
            this.isSelectedText = false;
            this.isCopiedText = false;
            this.selectedTextRange = null;
          }

          const backCommand = this.history.next();
          if (backCommand) {
            this.store.textareaContent = backCommand.backupTextareaContent;
            this.store.cursor = backCommand.backupCursor;
            this.store.textareaRow = backCommand.textareaRow;
          }
        }
        if (this.controlCombinations[i].join('') === 'ControlKeyX' && this.isSelectedText) {
          this.editor.textareaContent = this.store.textareaContent;
          this.editor.selectPosition = this.selectedTextRange;
          this.executeCommand(new Cut(this, this.editor));
          this.store.textareaContent = this.editor.textareaContent;
          this.store.textareaRow = this.editor.textareaRow;
          this.store.cursor = this.editor.cursor;
      
          this.isSelectedText = false;
          this.isCopiedText = false;
          this.selectedTextRange = null;
        }
        if (this.controlCombinations[i].join('') === 'ControlKeyV') {
          this.newSymbol = this.editor.buffer.getLast();
          this.editor.textareaContent = this.store.textareaContent;
          this.editor.textareaRow = this.store.textareaRow;
          this.editor.cursor = this.store.cursor;
          
          if (this.isSelectedText) {
            
            this.executeCommand(new Replace(this, this.editor));
            this.store.textareaContent = this.editor.textareaContent;
            this.store.textareaRow = this.editor.textareaRow;
            this.store.cursor = this.editor.cursor;
            this.isSelectedText = false;
            this.isCopiedText = false;
            this.selectedTextRange = null;
            return;
          }
      
          this.executeCommand(new Paste(this, this.editor));
          this.store.textareaContent = this.editor.textareaContent;
          this.store.textareaRow = this.editor.textareaRow;
          this.store.cursor = this.editor.cursor;
      
          this.isSelectedText = false;
          this.isCopiedText = false;
          this.selectedTextRange = null;
          this.newSymbol = '';
        }
        if (this.controlCombinations[i].join('') === 'ControlKeyC' && this.isSelectedText) {
          this.editor.textareaContent = this.store.textareaContent;
          this.executeCommand(new Copy(this, this.editor));
          this.isCopiedText = true;
        }
        return this.controlCombinations[i];
      }
    }
    return null;
  }

  hasControls = () => Object.keys(this.activeControls)
    .filter((i) => this.activeControls[i] !== 0).length !== 0;

  keyDown = (code) => {
    if (this.excludeKey.includes(code)) return;
    const lang = this.store.lang[this.store.langIndex];
    const key = this.store.getKeyContent(code);
    if (!key) {
      if (this.isSelectedText) {
        this.isSelectedText = false;
        this.isCopiedText = false;
        this.setCursorFromTextarea(this.selectedTextRange.end);
        this.store.cursor = this.editor.cursor;
        this.selectedTextRange = null;
        this.isSelectedText = false;
        this.isCopiedText = false;
      }
      return;
    }
    const { type } = key;

    this.activeBtns = this.store.activeBtns;
    if (type === 'control') {
      if (!this.hasControls()) {
        this.activeControls[code] = 1;
        this.activeBtns[code] = 1;
      }
      if (this.hasControls()) {
        if (this.activeControls[code]) {
          this.activeBtns[code] = 1;
        } else if (!this.hasControlCombination(code)) {
          this.activeControls[code] = 1;
          this.activeBtns[code] = 1;
        } else {
          this.activeBtns[code] = 1;
        }
      }
    } else if (this.hasControls()) {
      if (this.hasControlCombination(code)) {
        this.activeBtns[code] = 1;
      } else {
        if (type === 'meta' || !this.editMap[type]) {
          if (this.isSelectedText) {
            this.isSelectedText = false;
            this.isCopiedText = false;
            this.setCursorFromTextarea(this.selectedTextRange.end);
            this.store.cursor = this.editor.cursor;
            this.selectedTextRange = null;
            this.isSelectedText = false;
            this.isCopiedText = false;
          }
        }
        else this.editMap[type](code, key[lang]);
        this.activeBtns[code] = 1;
      }
    } else {
      this.activeBtns[code] = 1;
      if (type === 'meta' || !this.editMap[type]) {
        if (this.isSelectedText) {
          this.isSelectedText = false;
          this.isCopiedText = false;
          this.setCursorFromTextarea(this.selectedTextRange.end);
          this.store.cursor = this.editor.cursor;
          this.selectedTextRange = null;
          this.isSelectedText = false;
          this.isCopiedText = false;
        }
      }
      else this.editMap[type](code, key[lang]);
    }
    this.store.activeBtns = this.activeBtns;
  }


  keyUp = (code) => {
    if (this.excludeKey.includes(code)) return;

    const lang = this.store.lang[this.store.langIndex];
    const key = this.store.getKeyContent(code);
    if (!key) {
      if (this.isSelectedText) {
        this.isSelectedText = false;
        this.isCopiedText = false;
        this.setCursorFromTextarea(this.selectedTextRange.end);
        this.store.cursor = this.editor.cursor;
        this.selectedTextRange = null;
        this.isSelectedText = false;
        this.isCopiedText = false;
      }
      return;
    }

    const { type } = key;

    this.activeBtns = this.store.activeBtns;
    if (this.hasControls()) {
      this.activeBtns[code] = 0;
      if (this.activeControls[code] === 1) {
        this.activeControls[code] = 0;
      }
    } else {
      if (this.activeControls[code] === 1) this.activeControls[code] = 0;
      const arr = Object.keys(this.activeBtns);
      for (let i = 0; i < arr.length; i += 1) {
        this.activeBtns[arr[i]] = 0;
      }
    }
    this.store.activeBtns = this.activeBtns;
    
    if (!(type === 'control' || type === 'capslock' || type === 'meta') && this.isSelectedText && !this.isCopiedText) {
      // this.selectedTextRange = null;
      this.isSelectedText = false;
    }
  }

  upCursor = () => {
    const { line, pos, number } = this.store.cursor;
    const textareaRow = this.store.textareaRow;
    if (line !== 0) {
      const newLine = line - 1;
      let newNumber = 0;

      if (newLine > 0) {
        for (let i = 0; i < newLine; i++) {
          newNumber += textareaRow[i].length;
        }
      }

      if (textareaRow[newLine].length > pos) {
        newNumber += pos;
        this.store.cursor = {
          number: newNumber,
          line: newLine,
          pos,
        };
      } else {
        newNumber += textareaRow[newLine].length - 1;
        this.store.cursor = {
          number: newNumber,
          line: newLine,
          pos: textareaRow[newLine].length - 1,
        };
      }

    }

  };

  downCursor = () => {
    const { line, pos, number } = this.store.cursor;
    const textareaRow = this.store.textareaRow;

    if (line !== textareaRow.length - 1) {
      const newLine = line + 1;
      let newNumber = 0;
      for (let i = 0; i < newLine; i++) {
        newNumber += textareaRow[i].length;
      }
      if (textareaRow[newLine].length > pos) {
        newNumber += pos;
        this.store.cursor = {
          number: newNumber,
          line: newLine,
          pos,
        };
      } else {
        newNumber += textareaRow[newLine].length - 1;
        let newPos = textareaRow[newLine].length - 1;
        // if (newLine !== textareaRow.length - 1) {
        //   // newNumber -= 1;
        //   // newPos -= 1;
        // }
        this.store.cursor = {
          number: newNumber,
          line: newLine,
          pos: newPos,
        };
      }
    }

  };

  leftCursor = () => {
    const { line, pos, number } = this.store.cursor;
    const textareaRow = this.store.textareaRow;
    if (pos === 0 && line === 0) return;
    if (pos - 1 === 0) {
      let newNumber = 0;
      if (line !== 0) {
        for (let i = 0; i < line; i++) {
          newNumber += textareaRow[i].length;
        }
      }
      this.store.cursor = {
        number: newNumber,
        line,
        pos: 0,
      };
    } else if (pos === 0) {
      let newNumber = 0;
      const newLine = line - 1;
      for (let i = 0; i < line; i++) {
        newNumber += textareaRow[i].length;
      }
      this.store.cursor = {
        number: newNumber - 1,
        line: newLine,
        pos: textareaRow[newLine].length - 1,
      };
    } else {
      const newNumber = number - 1;
      const newPos = pos - 1;
      this.store.cursor = {
        number: newNumber,
        line,
        pos: newPos,
      };
    }

  };

  rightCursor = () => {
    const { line, pos, number } = this.store.cursor;
    const textareaRow = this.store.textareaRow;

    if (number === this.store.textareaContent.length) return;
    if (pos + 1 === textareaRow[line].length) {
      this.store.cursor = {
        number: number + 1,
        line: line + 1,
        pos: 0,
      };
    } else {
      this.store.cursor = {
        number: number + 1,
        line,
        pos: pos + 1,
      };

    }
  };
  
  setCursorFromTextarea = (number) => {
    this.editor.textareaContent = this.store.textareaContent;
    this.editor.textareaRow = this.store.textareaRow;
    this.editor.cursor = this.store.cursor;
    this.editor.setCursorPosition(number)
    this.store.cursor = this.editor.cursor;
    if (this.isSelectedText) {
      this.selectedTextRange = null;
      this.isSelectedText = false;
      this.isCopiedText = false; 
    }
  };
  
  selectTextRange = (start, end) => {
    if (this.selectedTextRange) this.selectedTextRange = null;
    this.selectedTextRange =  { start, end };
    this.isSelectedText = true;
  }

  editMap = {
    'symbol': this.symbol,
    'delete': this.delete,
    'move': this.moveCursor,
    'capslock': this.capsLock,
    'space': this.space,
  };
  
  textareaHandler = {
    setCursorPosition:  this.setCursorFromTextarea,
    selectTextRange: this.selectTextRange,
  }

  cursorHandler = {
    'up': this.upCursor,
    'down': this.downCursor,
    'left': this.leftCursor,
    'right': this.rightCursor,
  }

  keyHandler = {
    mouseDown: this.mouseDown,
    mouseUp: this.mouseUp,
  };

  boardHandler = {
    keyHandler: this.keyHandler,
  };

  initKeyboard = (data) => {
    const keys = {};
    data.forEach((key) => {
      keys[`${key.code}`] = {
        ...key,
      }
    });
    this.store.setInitState({ keys, langIndex: this.store.lang.indexOf(this.localStorageData.lang) });
  };

  executeCommand(command) {
    if (command.execute()) {
      this.history.save(command);
    }
  }

}

export { Controller };
