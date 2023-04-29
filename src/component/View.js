import { Header } from './Header';
import { Element } from './helper/element';
import { Main } from './Main';
import { DataApi } from './helper/data-api';

class View extends Element {
  constructor({ parent, controller, store }) {
    super({ parent, className: 'keyboard' });
    this.controller = controller;
    this.store = store;
    console.log(store)
    this.data = [];
    this.keys = [];
    this.header = new Header({
        parent: this.node,
        className: 'keyboard',
        lang: 'en',
    });
    this.main = new Main({
        parent: this.node,
        className: 'keyboard',
        controller: this.controller,
    });
    document.addEventListener('keydown', (e) => this.controller.keyDown(e));
    document.addEventListener('keyup', (e) => this.controller.keyUp(e));
    this.store.onChangeTextareaContent.add((content) => this.main.onChangeTextareaContent(content));
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
