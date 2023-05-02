import { Command } from './Command';

class Cut extends Command {
  constructor(controller, editor) {
    super(controller, editor, () => {
      editor.cutSelect(
        controller.selectedTextRange.start,
        controller.selectedTextRange.end,
      );
      this.saveBackup();
      return true;
    });
  }
}

export { Cut };
