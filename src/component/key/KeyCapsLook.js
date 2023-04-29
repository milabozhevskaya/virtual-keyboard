import { Key } from "./Key";

class KeyCapsLook extends Key {
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

export { KeyCapsLook };
