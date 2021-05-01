import AbstractView from './abstract.js';

const createSortFilterTemplate = (sortMethods) => {
  const getActiveStateClass = (active) => active ? 'sort__button--active' : '';

  const createSortMethodTemplate = (sortMethodName) => {
    return `<li><a href="#${sortMethodName}" class="sort__button ${getActiveStateClass(sortMethodName === 'default')}">Sort by ${sortMethodName}</a></li>`;
  };

  return `<ul class="sort">
    ${sortMethods.map(({ name: sortMethodName }) => createSortMethodTemplate(sortMethodName)).join(' ')}
  </ul>`;
};

export default class SortFilter extends AbstractView {
  constructor(sortMethods) {
    super();
    this._sortMethods = sortMethods;
  }

  getTemplate() {
    return createSortFilterTemplate(this._sortMethods);
  }
}
