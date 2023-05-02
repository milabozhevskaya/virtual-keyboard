import { Command } from './Command';

class Replace extends Command {
  constructor(controller, editor) {
    super(controller, editor, () => {
      editor.replaceSelect(
        controller.selectedTextRange.start,
        controller.selectedTextRange.end,
        controller.newSymbol,
      );
      this.saveBackup();
      return true;
    });
  }
}

export { Replace };
