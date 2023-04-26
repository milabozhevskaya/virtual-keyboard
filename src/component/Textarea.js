import { Element } from './helper/element';

class Textarea extends Element {
  constructor({
    parent,
    className,
  }) {
    super({
      parent,
      tagName: 'textarea',
      className: `${className}__textarea textarea`,
    });
    this.node.focus();
  }
}

export { Textarea };
