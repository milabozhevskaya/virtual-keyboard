import { Command } from './Command';

class Add extends Command {
  constructor(controller, editor) {
    super(controller, editor, () => {
      editor.addSymbol(controller.newSymbol);
      this.saveBackup();
      return true;
    });
  }
}

export { Add };
