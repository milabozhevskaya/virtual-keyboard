class Controller {
  constructor(store) {
    this.store = store;
  }
  
  mouseDown = (code, time) => {
    const lang = this.store.lang;
    const key = this.store.getKeyContent(code)[lang].value;
    const textareaContent = this.store.textareaContent + key;
    this.store.textareaContent = textareaContent;
  };
  
  mouseUp = (code, time) => {
    const lang = this.store.lang;
    const key = this.store.getKeyContent(code)[lang].value;
    const textareaContent = this.store.textareaContent + key;
    this.store.textareaContent = textareaContent;
  };
  
  keyDown = (event) => {
    event.preventDefault();
    const lang = this.store.lang;
    const key = this.store.getKeyContent(event.code)[lang].value;
    const textareaContent = this.store.textareaContent + key;
    this.store.textareaContent = textareaContent;
  };
  
  keyUp = (event) => {
    event.preventDefault();
  };
  
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
