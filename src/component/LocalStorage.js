class LocalStorageData {
  constructor({
    lang = 'en',
    textareaContent = '',
    textareaRow = [''],
    cursor = { number: 0, line: 0, pos: 0 },
  }) {
    this.lang = lang;
    this.textareaContent = textareaContent;
    this.textareaRow = textareaRow;
    this.cursor = cursor;
  }

  static toJson(data) {
    return JSON.stringify(data);
  }

  static instanceOfISourcesLStorage(object, key) {
    return key in object;
  }

  static fromJson(data) {
    const initData = {};

    if (data === null || typeof data !== 'object') {
      throw new Error('Not object in localstorage');
    }

    if (this.instanceOfISourcesLStorage(data, 'lang')) {
      initData.lang = data.lang;
    }

    if (this.instanceOfISourcesLStorage(data, 'textareaContent')) {
      initData.textareaContent = data.textareaContent;
    }

    if (this.instanceOfISourcesLStorage(data, 'textareaRow')) {
      initData.textareaRow = data.textareaRow;
    }

    if (this.instanceOfISourcesLStorage(data, 'cursor')) {
      initData.cursor = data.cursor;
    }

    return new LocalStorageData(initData);
  }
}

export { LocalStorageData };
