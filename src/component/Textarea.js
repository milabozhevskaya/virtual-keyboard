import { Element } from './helper/element';

class Textarea extends Element {
  constructor({
    parent,
    className,
  }) {
    super({
      parent,
      tagName: 'textarea',
      className: `${className}__textarea textarea`,
    });
    this.node.addEventListener('keydown', (event) => {event.preventDefault();});
    this.node.addEventListener('keyup', (event) => {event.preventDefault();});
    // this.node.onkeydown = (event) => {console.log(event.code); event.preventDefault();}
    // this.node.onkeyup = (event) => event.preventDefault();
    this.node.focus();
    // this.node.onmousedown = (event) => {
    //   event.preventDefault();
    // };
    // this.node.onmouseup = (event) => {
    //   event.preventDefault();
    // };

  }
  
  setContent = (content) => {
    this.node.textContent = content;
    this.node.focus();
  }
}

export { Textarea };
