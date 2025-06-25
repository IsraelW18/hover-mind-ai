export const domManipulator = {
  modifyElement(element, properties) {
    if (!element) return;
    
    Object.entries(properties).forEach(([key, value]) => {
      switch (key) {
        case 'style':
          Object.assign(element.style, value);
          break;
        case 'text':
          element.textContent = value;
          break;
        case 'html':
          element.innerHTML = value;
          break;
        case 'class':
          if (Array.isArray(value)) {
            element.classList.add(...value);
          } else {
            element.classList.add(value);
          }
          break;
        default:
          element.setAttribute(key, value);
      }
    });
  },

  findElement(selector) {
    return document.querySelector(selector);
  },

  findElements(selector) {
    return Array.from(document.querySelectorAll(selector));
  },

  createElement(tag, properties = {}) {
    const element = document.createElement(tag);
    this.modifyElement(element, properties);
    return element;
  },

  removeElement(element) {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  },

  addEventListenerToElements(selector, event, handler) {
    const elements = this.findElements(selector);
    elements.forEach(element => {
      element.addEventListener(event, handler);
    });
    return elements;
  }
}; 