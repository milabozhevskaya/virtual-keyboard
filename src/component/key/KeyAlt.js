import { Key } from './Key';

class KeyAlt extends Key {
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

export { KeyAlt };
