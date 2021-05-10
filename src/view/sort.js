import AbstractView from './abstract.js';
import { SortType } from '../const';

const createSortFilterTemplate = () => {
  return `<ul class="sort">
    <li><a href="#" data-sort-type="${SortType.DEFAULT}" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" data-sort-type="${SortType.DATE}" class="sort__button" >Sort by date</a></li>
    <li><a href="#" data-sort-type="${SortType.RATE}" class="sort__button">Sort by rating</a></li>
  </ul>`;
};

export default class SortFilter extends AbstractView {
  constructor() {
    super();

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortFilterTemplate();
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
    this._currentSortType = evt.target.dataset.sortType;
    this.getElement().querySelectorAll('.sort__button').forEach((item) => {item.classList.contains('sort__button--active') ? item.classList.remove('sort__button--active') : '';});
    evt.target.classList.add('sort__button--active');
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}
