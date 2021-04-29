import { createElement } from '../util.js';

const createMostCommentedFilmsTemplate = () => {
  return `<section class="films-list films-list--extra films-list--popular">
  <h2 class="films-list__title">Most commented</h2>
  <div class="films-list__container">
  </div>
</section>`;
};

export default class MostCommentedFilms {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createMostCommentedFilmsTemplate();
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
