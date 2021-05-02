import { addPluralEnding } from '../utils/common';
import AbstractView from './abstract.js';

const createFooterTemplate = (films) => {
  return `<section class="footer__statistics">
    <p>${films.length} movie${addPluralEnding(films)} inside</p>
  </section>`;
};

export default class Footer extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createFooterTemplate(this._films);
  }
}
