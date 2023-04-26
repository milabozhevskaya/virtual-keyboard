import { Element } from './helper/element.js';

class Button extends Element {
  constructor({ parent, className, lang, data }) {
    super({ 
        parent,
        tagName: 'button',
        className: `${className}__btn btn ${data.code}` ,
    });
    this.lang = lang;
    this.data = data;
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
    this.update(lang);
  }
  
  update = (lang) => {
    if (this.lang !== lang) this.lang = lang;
    const content = this.data[`${this.lang}`].name;
    this.mainContent.node.textContent = content[0];
    this.beforeContent.node.textContent = `${content.length === 2 ? content[1] : ''}`;
  };
}

export { Button };
