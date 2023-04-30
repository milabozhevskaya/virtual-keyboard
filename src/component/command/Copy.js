import { Command } from './Command.js';

class Copy extends Command {
  constructor(controller, editor) {
    super(controller, editor, () => {
      this.controller = controller;
      this.controller.select = editor.getSelect();
      return false;
    });
    this.ex = this.execute();
  }
}

export { Copy };
