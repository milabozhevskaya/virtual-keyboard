import { Command } from './Command.js';

class Paste extends Command {
  constructor(controller, editor) {
    super(controller, editor, () => {
      editor.addSymbol(controller.newSymbol);
      this.saveBackup();
      return true;
    });
  }
}

export { Paste };
