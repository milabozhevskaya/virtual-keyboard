class Command {
  constructor(controller, editor, onExecute) {
    this.controller = controller;
    this.editor = editor;
    this.backup = '';
    this.backCursor = { line: 0, pos: 0, number: 0 };
    this.textareaRow = [''];
    this.execute = () => onExecute();
  }

  saveBackup() {
    this.backup = this.editor.textareaContent;
    this.backCursor = this.editor.cursor;
    this.textareaRow = this.editor.textareaRow;
  }

  undo() {
    this.editor = this.backup;
  }
}

export { Command };
