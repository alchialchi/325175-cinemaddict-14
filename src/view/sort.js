import { createElement } from '../util.js';

const createSortFilterTemplate = (sortMethods) => {
  const getActiveStateClass = (active) => active ? 'sort__button--active' : '';

  const createSortMethodTemplate = (sortMethodName) => {
    return `<li><a href="#${sortMethodName}" class="sort__button ${getActiveStateClass(sortMethodName === 'default')}">Sort by ${sortMethodName}</a></li>`;
  };

  return `<ul class="sort">
    ${sortMethods.map(({ name: sortMethodName }) => createSortMethodTemplate(sortMethodName)).join(' ')}
  </ul>`;
};

export default class SortFilter {
  constructor(sortMethods) {
    this._sortMethods = sortMethods;
    this._element = null;
  }

  getTemplate() {
    return createSortFilterTemplate(this._sortMethods);
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
