import { Element } from './helper/element';

class Textarea extends Element {
  constructor({
    parent,
    className,
    controller,
  }) {
    super({
      parent,
      tagName: 'textarea',
      className: `${className}__textarea textarea`,
    });
    this.controller = controller;
    this.node.addEventListener('keydown', (event) => { event.preventDefault(); });
    this.node.addEventListener('keyup', (event) => { event.preventDefault(); });

    this.node.focus();

    this.node.onmouseup = () => {
      if (this.node.selectionEnd === this.node.selectionStart) {
        this.controller.setCursorPosition(this.node.selectionEnd);
      } else {
        this.controller.selectTextRange(this.node.selectionStart, this.node.selectionEnd);
      }
    };
  }

  setContent = (content) => {
    this.node.textContent = content;
    this.node.focus();
  };
}

export { Textarea };
