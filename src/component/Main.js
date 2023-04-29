import { Element } from './helper/element';
import { Textarea } from './Textarea';
import { Board } from './Board';

class Main extends Element {
  constructor({ parent, className, controller }) {
    super({ 
      parent, 
      tagName: 'main', 
      className: `${className}__main main` ,
    });
    this.controller = controller;
    console.log(this.controller.boardHandler);
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
        lang: 'en',
        controller: this.controller.boardHandler,
    });
  }
  
  init = (keys) => {
    this.board.init(keys);
  }
  
  onChangeTextareaContent = (content) => {
    this.textarea.setContent(content);
  };
  
  onInitKeys = (keys) => {
    this.board.init(keys);
  }
}

export { Main };
