import { Element } from './helper/element';
import { Key } from './key/Key';
import { KeyAlt } from './key/KeyAlt';
import { KeyArrow } from './key/KeyArrow';
import { KeyCapsLook } from './key/KeyCapsLook';
import { KeyControl } from './key/KeyControl';
import { KeyMeta } from './key/KeyMeta';
import { KeyShift } from './key/KeyShift';

const KeyMap = {
  'ShiftLeft': KeyShift,
  'ShiftRight': KeyShift,
  'ControlLeft': KeyControl,
  'ControlRight': KeyControl,
  'MetaLeft': KeyMeta,
  'AltLeft': KeyAlt,
  'AltRight': KeyAlt,
  'ArrowLeft': KeyArrow,
  'ArrowRight': KeyArrow,
  'CapsLook': KeyCapsLook,
}

class Board extends Element {
  constructor({ parent, className, lang, controller }) {
    super({ 
        parent, 
        className: `${className}__board board` ,
    });
    this.lang = lang;
    this.controller = controller;
    this.rows = {};
    this.keys = {};
    this.btns = {};
    for (let i = 0; i < 5; i += 1) {
      this.rows[i] = new Element({
        parent: this.node,
        className: `board__row row`,
      });
      // this.rows.push(new Element({
      //   parent: this.node,
      //   className: `board__row row`,
      // }));
    }
  }
  
  onChangeLang = (lang) => {
    this.lang = lang;
    Object.keys(this.btns).forEach((code, index) => {
      this.btns[code].update(this.keys[code][`${this.lang}`].name);
    });
  }
  
  init = ({ keys, lang }) => {
    this.lang = lang;
    this.keys = keys;
    Object.keys(this.keys).forEach((key, index) => {
      const keyData = this.keys[key];
      const { row, code } = keyData;
      const KeyConstructor = KeyMap[code] || Key;
      this.btns[code] = new KeyConstructor({
        parent: this.rows[row - 1].node,
        className: `board`,
        code,
        content: keyData[`${this.lang}`].name,
        controller: this.controller.keyHandler,
      });
      // this.btns.push(new Button({
      //   parent: this.rows[row - 1].node,
      //   className: `board`,
      //   lang: this.lang,
      //   data: btn,
      // }));
    });
  }
}

export { Board };
