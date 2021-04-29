
import { convertPlainTextToSnakeCase, createElement } from '../util.js';

const createMenuTemplate = (filters) => {
  const isDefaultFilter = (filterName) => filterName.toLowerCase() === 'all';

  const getActiveStateClass = (active) => active ? 'main-navigation__item--active' : '';

  const createFilterTemplate = ({ name: filterName, count: filmsCount }) => {
    return `
      <a href="#${convertPlainTextToSnakeCase(filterName)}" class="main-navigation__item ${getActiveStateClass(isDefaultFilter(filterName))}">
        ${filterName} ${isDefaultFilter(filterName) ? 'movies' : ''} ${!isDefaultFilter(filterName) ? '<span class="main-navigation__item-count">' + filmsCount + '</span>' : ''}
      </a>`;
  };

  return `<nav class="main-navigation">
  <div class="main-navigation__items">
    ${filters.map((filter) => createFilterTemplate(filter)).join(' ')}
  </div>
  <a href="#stats" class="main-navigation__additional">Stats</a>
</nav>
`;
};

export default class SiteMenu {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createMenuTemplate(this._filters);
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
