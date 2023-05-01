import { Header } from './Header';
import { Element } from './helper/element';
import { Main } from './Main';
import { DataApi } from './helper/data-api';

class View extends Element {
  constructor({ parent, controller, store }) {
    super({ parent, className: 'keyboard' });
    this.controller = controller;
    this.store = store;
    this.node.onresize = () => {
      const isFull = window.innerWidth >= 1080 ? 77 : false;
      const isDesctop = window.innerWidth >= 851 ? 60 : false;
      const isTablet = window.innerWidth >= 768 ? 52 : 30;
      const maxLengthOfTextarea = isFull || isDesctop || isTablet;
      this.controller.onResize(maxLengthOfTextarea);
      this.main.setFocusOnTextarea();
    };

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
    document.addEventListener('click', () => this.main.setFocusOnTextarea());

    this.store.onChangeTextareaContent.add((content) => this.main.onChangeTextareaContent(content));
    this.store.onChangeLang.add((lang) => {
      this.header.onChangeLang(lang);
      this.main.onChangeLang(lang);
    });
    this.store.onChangeActiveBtns.add(
      (activeBtnsMap) => this.main.onChangeActiveBtns(activeBtnsMap),
    );
    this.store.onChangeCursorPosition.add(
      (position) => this.main.onChangeCursorPosition(position),
    );
    this.store.onInitState.add(({ keys, lang }) => {
      this.header.onChangeLang(lang);
      this.main.onInitState({ keys, lang });
    });
  }

  init = () => {
    const data = new DataApi();
    data.getKeysData().then((loaded) => {
      this.data = loaded;
      this.controller.initKeyboard(this.data);
    });
  };
}

export { View };
