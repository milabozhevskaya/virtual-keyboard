import { Command } from './Command.js';

class Undo extends Command {
  constructor(controller, editor) {
    super(controller, editor, () => {
      controller.undo();
      return false;
    });
  }
}

export { Undo };
