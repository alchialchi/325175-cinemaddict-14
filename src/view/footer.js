import { addPluralEnding, createElement } from '../util.js';

const createFooterTemplate = (films) => {
  return `<section class="footer__statistics">
    <p>${films.length} movie${addPluralEnding(films)} inside</p>
  </section>`;
};

export default class Footer {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    return createFooterTemplate(this._films);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
