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
  
  get cursor() {
    return this._cursor;
  }

  set cursor(newPosition) {
    this._cursor = newPosition;
    this.onChangeCursorPosition.emit({
      start: this._cursor.number,
      end: this._cursor.number,
    });
  }

  get textareaRow() {
    return this._textareaRow;
  }

  set textareaRow(textareaRow) {
    this._textareaRow = textareaRow;
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
  }
  
  get keys() {
    return this._keys;
  }
  
  set keys(keysMap) {
    this._keys = keysMap;
    this.onInitKeys.emit(this._keys);
  }
  
  get langIndex() {
    return this._langIndex;
  }
  
  set langIndex(langIndex) {
    this._langIndex = langIndex;
    this.onChangeLang.emit(this._langMap[this._langIndex]);
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
  
  onChangeTextareaContent = new Signal();
  onChangeLang = new Signal();
  onChangeCursorPosition = new Signal();
  onInitKeys = new Signal();
}

export { Store };
