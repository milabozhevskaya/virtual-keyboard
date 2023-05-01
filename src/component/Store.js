import { Signal } from "./helper/signal";

class Store {
  constructor() {
    this._langIndex = 0;
    this._langMap = ['en', 'ru'];
    this._textareaContent = '';
    this._textareaRow = [''];
    this._cursor = { line: 0, pos: 0, number: 0 };
    this._keys = {};
    this._activeBtns = {};
    this._lastControl = { id: null, time: null };
    this._activeControls = {};
    this._lastKey = null;
    this._capsLock = false;
    
  }
  
  setInitState({ keys, langIndex }) {
    console.log(this._langMap[langIndex])
    this._langIndex = langIndex;
    this._keys = keys;
    this.onInitState.emit({
      keys,
      lang: this._langMap[langIndex],
    });
  }
  
  get cursor() {
    return this._cursor;
  }

  set cursor(newPosition) {
    this._cursor = newPosition;
    this.onChangeCursorPosition.emit({
      start: this._cursor.number,
      end: this._cursor.number,
    });
    // this.onChangeLocalStorageData.emit({
    //   lang: this.langMap[this.langIndex],
    //   textareaContent: this.textareaContent,
    //   textareaRow: this.textareaRow,
    //   cursor: this.cursor,
    // });
  }

  get textareaRow() {
    return this._textareaRow;
  }

  set textareaRow(textareaRow) {
    this._textareaRow = textareaRow;
    // this.onChangeLocalStorageData.emit({
    //   lang: this.langMap[this.langIndex],
    //   textareaContent: this.textareaContent,
    //   textareaRow: this.textareaRow,
    //   cursor: this.cursor,
    // });
  }

  get() {
    return this;
  }
  
  get textareaContent() {
    return this._textareaContent;
  }
  
  set textareaContent(content) {
    this._textareaContent = content;
    this.onChangeTextareaContent.emit(this._textareaContent);
    // this.onChangeLocalStorageData.emit({
    //   lang: this.langMap[this.langIndex],
    //   textareaContent: this.textareaContent,
    //   textareaRow: this.textareaRow,
    //   cursor: this.cursor,
    // });

  }
  
  get keys() {
    return this._keys;
  }
  
  set keys(keysMap) {
    this._keys = keysMap;
  }
  
  get langIndex() {
    return this._langIndex;
  }
  
  set langIndex(langIndex) {
    this._langIndex = langIndex;
    console.log(langIndex)
    this.onChangeLang.emit(this._langMap[this._langIndex]);
    this.onChangeLocalStorageData.emit({
      lang: this._langMap[this.langIndex],
      textareaContent: this.textareaContent,
      textareaRow: this.textareaRow,
      cursor: this.cursor,
    });
  }
  
  get lang() {
    return this._langMap;
  }
  
  set lang(langMap) {
    this._langMap = langMap;
  }
  
  getKeyContent(code) {
    return this._keys[code];
  }
  
  get activeBtns() {
    return this._activeBtns;
  }
  
  set activeBtns(btnsMap) {
    this._activeBtns = btnsMap;
  }
  
  get lastControl() {
    return this._lastControl;
  }
  
  set lastControl(newLastControl) {
    this._lastControl = newLastControl;
  }
  
  get activeControls() {
    return this._activeControls;
  }
  
  set activeControls(newActiveControls) {
    this._activeControls = newActiveControls;
  }
  
  get lastKey() {
    return this._lastKey;
  }
  
  set lastKey(newLastKey) {
    this._lastKey = newLastKey;
  }
  
  get capsLock() {
    return this._capsLock;
  }
  
  set capsLock(flag) {
    this._capsLock = flag;
  }
  
  onChangeLocalStorageData = new Signal();
  onChangeTextareaContent = new Signal();
  onChangeLang = new Signal();
  onChangeCursorPosition = new Signal();
  onInitState = new Signal();
}

export { Store };
