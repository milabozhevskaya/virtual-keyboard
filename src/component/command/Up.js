import { Command } from './Command.js';

class Up extends Command {
  constructor(controller, cursor) {
    super(controller, cursor, () => {
      this.cursor = cursor;
      this.controller = controller;
      cursor.addSymbol(this.controller.cursorPoint);
      return false;
    });
  }
}

export { Up };
