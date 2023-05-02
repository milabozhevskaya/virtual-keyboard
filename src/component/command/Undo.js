import { Command } from './Command';

class Undo extends Command {
  constructor(controller, editor) {
    super(controller, editor, () => {
      controller.undo();
      return false;
    });
  }
}

export { Undo };
