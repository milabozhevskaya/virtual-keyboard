class Command {
  constructor(controller, editor, onExecute) {
    this.controller = controller;
    this.editor = editor;
    this.backupTextareaContent = '';
    this.backupCursor = { line: 0, pos: 0, number: 0 };
    this.textareaRow = [''];
    this.execute = () => onExecute();
  }

  saveBackup() {
    this.backupTextareaContent = this.editor.textareaContent;
    this.backupCursor = this.editor.cursor;
    this.textareaRow = this.editor.textareaRow;
  }

  undo() {
    this.editor = this.backupTextareaContent;
  }
}

export { Command };
