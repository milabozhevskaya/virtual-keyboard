import { Element } from './helper/element';
import { Button } from './Button';

class Board extends Element {
  constructor({ parent, className, lang }) {
    super({ 
        parent, 
        className: `${className}__board board` ,
    });
    this.lang = lang;
    this.rows = [];
    this.btns = [];
    for (let i = 0; i < 5; i += 1) {
      this.rows.push(new Element({
        parent: this.node,
        className: `board__row row`,
      }));
    }
  }
  
  init = (data) => {
    data.forEach((btn, index) => {
      const { row } = btn;
      this.btns.push(new Button({
        parent: this.rows[row - 1].node,
        className: `board`,
        lang: this.lang,
        data: btn,
      }));
    });
  }
}

export { Board };
