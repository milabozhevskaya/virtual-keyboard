import { Element } from './helper/element.js';

class Header extends Element {
  constructor({ parent, className, lang }) {
    super({ 
        parent, 
        tagName: 'header', 
        className: `${className}__header header` ,
    });
    this.container = new Element({
      parent: this.node,
      className: `header__container container`,
    });
    this.lang = new Element({
        parent: this.container.node,
        className: `header__lang lang`,
        content: lang,
    });
    this.description = new Element({
        parent: this.container.node,
        className: `header__description description`,
        content: `
        <span>Virtual Keyboard реализована для Window OS</span>
        <span>Для зажатия контрольной кнопки используйте двойной клик</span>
      `,
    })
  }
}

export { Header };
