import { Header } from './Header';
import { Element } from './helper/element';
import { Main } from './Main';
import { DataApi } from './helper/data-api';

class View extends Element {
  constructor({ parent, controller, store }) {
    super({ parent, className: 'keyboard' });
    this.controller = controller;
    this.store = store;
    this.data = [];
    this.keys = [];
    this.header = new Header({
        parent: this.node,
        className: 'keyboard',
        lang: 'en',
        controller,
    });
    this.main = new Main({
        parent: this.node,
        className: 'keyboard',
        controller: this.controller,
    });
    document.addEventListener('keydown', (event) => this.controller.keyDown(event.code), true);
    document.addEventListener('keyup', (event) => this.controller.keyUp(event.code), true);
    this.store.onChangeTextareaContent.add((content) => this.main.onChangeTextareaContent(content));
    this.store.onChangeLang.add((lang) => this.header.onChangeLang(lang));
    this.store.onInitKeys.add((keys) => this.main.onInitKeys(keys));
  }
  
  init = () => {
    const data = new DataApi();
    data.getKeysData().then((loaded) => {
      this.data = loaded;
      this.controller.initKeyboard(this.data);
    });
      // .then(() => {
      //   this.main.init(this.data);
      // });
  }
}

export { View };
