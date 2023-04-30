import { Command } from './Command.js';

class Delete extends Command {
  constructor(controller, editor) {
    super(controller, editor, () => {
      this.saveBackup();
      editor.deleteSymbol(controller.deleteDirection);
      return true;
    });
  }
}

export { Delete };
