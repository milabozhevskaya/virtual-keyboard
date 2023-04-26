import { Element } from './helper/element';
import { Textarea } from './Textarea';
import { Board } from './Board';

class Main extends Element {
  constructor({ parent, className }) {
    super({ 
        parent, 
        tagName: 'main', 
        className: `${className}__main main` ,
    });
    this.container = new Element({
      parent: this.node,
      className: `main__container container`,
  });
    this.textarea = new Textarea({
        parent: this.container.node,
        className,
    });
    this.board = new Board({
        parent: this.container.node,
        className,
        lang: 'en'
    });
  }
  
  init = (data) => {
    this.board.init(data);
  }
}

export { Main };
