import { Command } from './Command.js';

class Cut extends Command {
  constructor(controller, editor) {
    super(controller, editor, () => {
      this.saveBackup();
      this.controller = controller;
      this.controller.select = editor.getSelect();
      editor.deleteSelect();
      return true;
    });
  }
}

export { Cut };
