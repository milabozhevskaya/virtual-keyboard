import { Element } from './helper/element';

class Header extends Element {
  constructor({
    parent,
    className,
    lang,
    controller,
  }) {
    super({
      parent,
      tagName: 'header',
      className: `${className}__header header`,
    });
    this.controller = controller;
    this.activeLang = lang;
    this.container = new Element({
      parent: this.node,
      className: 'header__container container',
    });
    this.lang = new Element({
      parent: this.container.node,
      className: 'header__lang lang',
      content: this.activeLang,
    });
    this.description = new Element({
      parent: this.container.node,
      className: 'header__description description',
      content: `
        <span>Virtual Keyboard реализована для Window OS</span>
        <span>Для зажатия контрольной кнопки используйте двойной клик</span>
      `,
    });
  }

  onChangeLang = (lang) => {
    this.activeLang = lang;
    this.lang.node.textContent = this.activeLang;
  };
}

export { Header };
