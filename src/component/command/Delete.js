import { Command } from './Command';

class Delete extends Command {
  constructor(controller, editor) {
    super(controller, editor, () => {
      editor.deleteSymbol(controller.deleteDirection);
      this.saveBackup();
      return true;
    });
  }
}

export { Delete };
