class DataBuffer {
  constructor() {
    this.buffer = [];
  }

  getLast = () => this.buffer[this.buffer.length - 1] || '';

  push = (string) => {
    this.buffer.push(string);
  };
}

export { DataBuffer };
