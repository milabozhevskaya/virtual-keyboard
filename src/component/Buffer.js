class Buffer {
  constructor() {
    this.buffer = [];
  }
  
  getLast = () => {
    return this.buffer[this.buffer.length - 1] || '';
  };
  
  push = (string) => {
    this.buffer.push(string);
  }
}

export { Buffer };
