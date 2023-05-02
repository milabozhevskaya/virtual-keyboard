class History {
  constructor(initialData) {
    this.history = [initialData];
    this.activeCommandIndex = 0;
  }

  save(command) {
    this.activeCommandIndex += 1;
    if (this.history.length > this.activeCommandIndex) {
      this.history = this.history.slice(0, this.activeCommandIndex);
    }
    this.history[this.activeCommandIndex] = command;
  }

  back() {
    if (this.activeCommandIndex === 0) return false;
    this.activeCommandIndex -= 1;
    return this.history[this.activeCommandIndex];
  }

  next() {
    if (this.activeCommandIndex + 1 === this.history.length) return false;
    this.activeCommandIndex += 1;
    return this.history[this.activeCommandIndex];
  }
}

export { History };
