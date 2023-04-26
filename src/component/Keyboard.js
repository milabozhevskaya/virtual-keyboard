import { View } from './View';

const Keyboard = (parent) => {
  const view = new View({
    parent,
  });
  view.init();
};

export { Keyboard };
