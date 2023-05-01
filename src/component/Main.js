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
    this.container = new Element({
      parent: this.node,
      className: `main__container container`,
  });
    this.textarea = new Textarea({
        parent: this.container.node,
        className,
        controller: controller.textareaHandler,
    });
    this.board = new Board({
        parent: this.container.node,
        className,
        lang: 'en',
        controller: this.controller.boardHandler,
    });
    // this.node.onmousedown = (event) => {
    //   this.textarea.node.focus();
    // };
    // this.node.onmouseup = (event) => {
    //   this.textarea.node.focus();
    // }
  }
  
  setFocusOnTextarea = () => this.textarea.node.focus();
  
  init = (keys) => {
    this.board.init(keys);
  };
  
  onChangeLang = (lang) => {
    this.board.onChangeLang(lang);
  }
  
  onChangeTextareaContent = (content) => {
    this.textarea.setContent(content);
  };
  
  onChangeCursorPosition = ({ start, end }) => {
    this.textarea.node.setSelectionRange(start, end);
  };
  
  onInitState = ({ keys, lang }) => {
    this.board.init({ keys, lang });
  }
}

export { Main };
