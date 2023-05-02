class DataApi {
  constructor() {
    this.data = [];
  }

  getKeysData() {
    return fetch('./data/keys.json').then((res) => res.json()).then((data) => {
      if (!Array.isArray(data)) {
        throw new Error('Data load error');
      }
      this.data = data;
      return this.data;
    });
  }
}

export { DataApi };
