import Observer from '../utils/observer';
import { MenuItem } from '../const';

export default class Filter extends Observer {
  constructor() {
    super();
    this._activeFilter = MenuItem.ALL_MOVIES;
  }

  set(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  get() {
    return this._activeFilter;
  }
}
