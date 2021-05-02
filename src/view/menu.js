
import { convertPlainTextToSnakeCase } from '../utils/common';
import AbstractView from './abstract.js';

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

export default class SiteMenu extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createMenuTemplate(this._filters);
  }
}
