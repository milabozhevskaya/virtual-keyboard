import { Store } from './Store';
import { Controller } from './Controller';
import { View } from './View';

import '../assets/css/style.scss';

const Keyboard = (parent) => {
  const store = new Store();
  const controller = new Controller(store);
  const view = new View({
    parent,
    controller,
    store,
  });
  view.init();
};

export { Keyboard };
