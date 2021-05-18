import { render, remove, RenderPosition } from '../utils/render';
import { updateItem } from '../utils/common';
import SiteMenuView from '../view/menu';
import FilmsListView from '../view/films-list';
import FilmsView from '../view/films';
import SortFilterView from '../view/sort';
import MostCommentedFilmsView from '../view/film-list-most-commented';
import TopRatedFilmsView from '../view/films-list-extra';
import NoFilmMessageView from '../view/no-film-message';
import ShowMoreButtonView from '../view/show-more';
import MoviePresenter from '../presenter/Movie';
import { SortType } from '../const';

import { getFilmsSortedByDate, getFilmsSortedByRating } from '../data/sort';

const FILMS_PER_STEP = 5;
const EXTRA_FILMS_COUNT = 2;

export default class MovieList {
  constructor(mainContainer, movieFilters, films) {
    this._mainContainer = mainContainer;
    this._movieFilters = movieFilters;
    this._renderedFilmCount = FILMS_PER_STEP;
    this._moviePresenter = {};
    this._moviePresenterTopRated = {};
    this._moviePresenterMostCommented = {};

    this._films = films;

    this._siteMenuComponent = new SiteMenuView(this._movieFilters);
    this._filmsComponent = new FilmsView();
    this._filmsListComponent = new FilmsListView();
    this._sortComponent = new SortFilterView();
    this._topRatedFilmListComponent = new TopRatedFilmsView();
    this._mostCommentedFilmListComponent = new MostCommentedFilmsView();
    this._noFilmComponent = new NoFilmMessageView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(films) {
    this._films = films.slice();
    this._sourcedFilms = films.slice();
    render(this._mainContainer, this._filmsComponent, RenderPosition.BEFOREEND);
    render(this._filmsComponent, this._filmsListComponent, RenderPosition.BEFOREEND);

    this._renderMovieList();
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    this._sourcedFilms = updateItem(this._sourcedFilms, updatedFilm);
    this._moviePresenter[updatedFilm.id].init(updatedFilm);
    this._moviePresenterTopRated[updatedFilm.id].init(updatedFilm);
    this._moviePresenterMostCommented[updatedFilm.id].init(updatedFilm);
  }

  _renderSiteMenu() {
    render(this._mainContainer, this._siteMenuComponent, RenderPosition.AFTERBEGIN);
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._films = getFilmsSortedByDate(this._films);
        break;
      case SortType.RATING:
        this._films = getFilmsSortedByRating(this._films);
        break;
      default:
        this._films = this._sourcedFilms.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {

    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearFilmList();
    this._renderFilmList();
  }

  _renderSort() {
    render(this._filmsComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderFilm(film, container = this._filmsListComponent) {
    const moviePresenter = new MoviePresenter(container, this._handleFilmChange);
    moviePresenter.init(film);

    if (container === this._filmsListComponent) {
      this._moviePresenter[film.id] = moviePresenter;
    }

    if (container === this._topRatedFilmListComponent) {
      this._moviePresenterTopRated[film.id] = moviePresenter;
    }

    if (container === this._mostCommentedFilmListComponent) {
      this._moviePresenterMostCommented[film.id] = moviePresenter;
    }
  }

  _destroyFilm() {
    remove(this._filmCardComponent);
    remove(this._popupComponent);
  }

  _renderFilms(from, to, container) {
    this._films.slice(from, to).forEach((film) => this._renderFilm(film, container));
  }

  _renderNoFilm() {
    render(this._filmsComponent, this._noFilmComponent, RenderPosition.AFTERBEGIN);
  }

  _handleShowMoreButtonClick() {
    this._renderFilms(this._renderedFilmCount, this._renderedFilmCount + FILMS_PER_STEP);
    this._renderedFilmCount += FILMS_PER_STEP;

    if (this._renderedFilmCount >= this._films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._filmsListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _clearFilmList() {
    Object
      .values(this._moviePresenter)
      .forEach((presenter) => presenter.destroy());
    this._moviePresenter = {};
    this._renderedFilmCount = FILMS_PER_STEP;
    remove(this._showMoreButtonComponent);
  }

  _renderFilmList() {
    this._renderFilms(0, Math.min(this._films.length, FILMS_PER_STEP));

    if (this._films.length > FILMS_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderFilmListExtra() {
    render(this._filmsComponent, this._topRatedFilmListComponent, RenderPosition.BEFOREEND);
    render(this._filmsComponent, this._mostCommentedFilmListComponent, RenderPosition.BEFOREEND);

    this._renderFilms(0, EXTRA_FILMS_COUNT, this._topRatedFilmListComponent);
    this._renderFilms(0, EXTRA_FILMS_COUNT, this._mostCommentedFilmListComponent);
  }

  _renderMovieList() {
    this._renderSort();
    this._renderSiteMenu();

    if (this._films.length === 0) {
      this._renderNoFilm();
      return;
    }

    this._renderFilmList();
    this._renderFilmListExtra();
  }
}
