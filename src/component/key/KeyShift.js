import { Key } from "./Key";

class KeyShift extends Key {
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

export { KeyShift };
