import { Key } from './Key';

class KeyMeta extends Key {
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

export { KeyMeta };
