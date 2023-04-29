import { Key } from "./Key";

class KeyControl extends Key {
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

export { KeyControl };
