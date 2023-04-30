import { Command } from './Command.js';

class Add extends Command {
  constructor(controller, editor) {
    super(controller, editor, () => {
      this.saveBackup();
      editor.addSymbol(controller.newSymbol);
      return true;
    });
  }
}

export { Add };
