import { Element } from '../helper/element.js';

class Key extends Element {
  constructor({ 
    parent, 
    className, 
    code,
    content,
    controller,
   }) {
    super({ 
        parent,
        tagName: 'button',
        className: `${className}__btn btn ${code}` ,
    });
    this.code = code;
    this.content = content;
    this.controller = controller;
    this.node.tabIndex = '-1';
    this.beforeContent = new Element({
      parent: this.node,
      tagName: 'span',
      className: 'btn__content btn__content--before',
    });
    this.mainContent = new Element({
      parent: this.node,
      tagName: 'span',
      className: 'btn__content btn__content--main',
    });
    this.update(this.content);
    this.node.onmousedown = (event) => {
      event.preventDefault();
      this.controller.mouseDown(this.code, event.timeStamp);
      this.node.onmouseover = (event) => this.node.onmouseup(event);
    };
    // this.node.onmousedown = (event) => { onClick('mouseDown', event.timeStamp); this.node.onmouseover = () => this.node.onmouseup(); };
    this.node.onmouseup = (event) => {
      this.controller.mouseUp(this.code, event.timeStamp);
      this.node.onmouseover = null;
    };

  }
  
  update = (content) => {
    if (this.content !== content) this.content = content;
    this.mainContent.node.textContent = this.content[0];
    this.beforeContent.node.textContent = `${this.content.length === 2 ? this.content[1] : ''}`;
  };
  
  
}

export { Key };
