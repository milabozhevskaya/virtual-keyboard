import { View } from './View';

import '../assets/css/style.scss';

const Keyboard = (parent) => {
  const view = new View({
    parent,
  });
  view.init();
};

export { Keyboard };
