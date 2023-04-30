import { Signal } from "./helper/signal";

class Store {
  constructor() {
    this._lang = 'en';
    this._textareaContent = '';
    this._keys = {};
    this._activeBtns = {};
    this._lastControl = { id: null, time: null };
    this._activeControls = {};
    this._lastKey = null;
    this._capsLock = false;
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
  
  get lang() {
    return this._lang;
  }
  
  set lang(lang) {
    this._lang = lang;
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
  onInitKeys = new Signal();
}

export { Store };
