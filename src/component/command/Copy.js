import { Command } from './Command';

class Copy extends Command {
  constructor(controller, editor) {
    super(controller, editor, () => {
      editor.saveSelect(
        controller.selectedTextRange.start,
        controller.selectedTextRange.end,
      );
      return false;
    });
  }
}

export { Copy };
