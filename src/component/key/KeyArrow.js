import { Key } from './Key';

class KeyArrow extends Key {
  constructor({
    parent,
    className,
    code,
    content,
    controller,
  }) {
    super({
      parent,
      className,
      code,
      content,
      controller,
    });
  }
}

export { KeyArrow };
