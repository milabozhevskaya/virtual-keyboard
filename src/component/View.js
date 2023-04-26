import { Header } from './Header';
import { Element } from './helper/element';
import { Main } from './Main';
import { DataApi } from './helper/data-api';

class View extends Element {
  constructor({ parent }) {
    super({ parent, className: 'keyboard' });
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
    });
    document.addEventListener('keydown', () => {});
    document.addEventListener('keyup', () => {});
  }
  
  init = () => {
    const data = new DataApi();
    data.getKeysData().then((loaded) => {
      this.data = loaded;
    })
      .then(() => {
        this.main.init(this.data);
      });
  }
}

export { View };
