class Controller {
  constructor(store) {
    this.store = store;
    this.activeBtns = {};
    this.lastControl = { id: null, time: null };
    this.activeControls = {};
    this.lastKey = null;

  }
  
  controlCombinations = [
    ['Control', 'Delete'],
    ['Control', 'Backspace'],
    ['Control', 'KeyX'],
    ['Control', 'KeyC'],
    ['Control', 'KeyV'],
    ['Control', 'KeyZ'],
    ['Control', 'KeyS'],
    ['Control', 'KeyA'],
    ['Control', 'KeyB'],
    ['Control', 'KeyI'],
    ['Control', 'KeyU'],
    ['Control', 'BracketLeft'],
    ['Control', 'BracketRight'],
    ['Control', 'KeyL'],
    ['Control', 'KeyE'],
    ['Control', 'KeyR'],
    ['Control', 'KeyY'],
    ['Control', 'Shift'],
  ];
  
  excludeKey = ['F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12']
  
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
    
    this.addTextareaContent(symbol);
  };
  
  delete = (code, { value }) => {
    // this.deleteDirection = code === 'Backspace' ? 'prev' : 'next';
    // this.editor.text = this.state.get();
    // this.editor.textRow = this.state.getTextRow();
    // this.editor.cursor = this.state.getCursor();
    // this.executeCommand(new DeleteCommand(this, this.editor));
    // this.state.set(this.editor.text);
    // this.state.setCursor(this.editor.cursor);
    // this.state.setTextRow(this.editor.textRow);
  };

  space = (code, { value }) => {
    this.addTextareaContent(value);
  };
  
  capsLock = (code, { value }) => {
    const caps = this.store.capsLock;
    this.store.capsLock = !caps;
  };

  move = (code, { value }) => {};

  addTextareaContent = (symbol) => {
    // this.addSymbol = symbol;
    // this.editor.text = this.state.get();
    // this.editor.textRow = this.state.getTextRow();
    // this.editor.cursor = this.state.getCursor();
    // this.executeCommand(new AddCommand(this, this.editor));
    // this.state.set(this.editor.text);
    // this.state.setCursor(this.editor.cursor);
    // this.state.setTextRow(this.editor.textRow);
    // this.addSymbol = '';
    const textareaContent = this.store.textareaContent + symbol;
    this.store.textareaContent = textareaContent;

  };

  mouseDown = (code, time) => {
    const lang = this.store.lang;
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
    const lang = this.store.lang;
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
        console.log(activeControlsKeys);
        if (this.controlCombinations[i].join('') === 'ControlShift') {
          // const lang = this.state.getLang() === 'en' ? 'ru' : 'en';
          // this.state.setLang(lang);
          // localStorage.setItem('key_lang', lang);
        }
        if (this.controlCombinations[i].join('') === 'ControlKeyZ') {
          // const backCommand = this.history.history.pop();
          // if (backCommand) {
          //   this.state.set(backCommand.backup);
          //   this.state.setCursor(backCommand.backCursor);
          //   this.state.setTextRow(backCommand.textRow);
          // }
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
    const lang = this.store.lang;
    const key = this.store.getKeyContent(code);
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
        if (type === 'meta' || !this.editMap[type]);
        else this.editMap[type](code, key[lang]);
          this.activeBtns[code] = 1;
      }
    } else {
      this.activeBtns[code] = 1;
      if (type === 'meta' || !this.editMap[type]);
      else this.editMap[type](code, key[lang]);
    }
    this.store.activeBtns = this.activeBtns;
  }

  
  keyUp = (code) => {
    if (this.excludeKey.includes(code)) return;
    
    const lang = this.store.lang;
    const key = this.store.getKeyContent(code);
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
  }
  
  editMap = {
    'symbol': this.symbol,
    'delete': this.delete,
    'move': this.move,
    'capslock': this.capsLock,
    'space': this.space,
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
    this.store.keys = keys;
  }

}

export { Controller };
