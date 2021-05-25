import FilmsListView from '../view/films-list';
import FilmsView from '../view/films';
import ExtraFilmsListView from '../view/films-list-extra';
import NoFilmMessageView from '../view/no-film-message';
import ShowMoreButtonView from '../view/show-more-button';
import LoadingView from '../view/loading';
import SortingView from '../view/sort';
import SiteMenuView from '../view/menu';

import MoviePresenter from '../presenter/Movie';

import { UpdateType, Mode, SortType, UserAction, filter } from '../const';
import { mainElement } from '../utils/common';
import { render, remove } from '../utils/render';
import { sortMovieByDate, sortMovieByRating } from '../utils/sorting';

const FILMS_PER_STEP = 5;
const EXTRA_FILMS_COUNT = 2;
const MOST_COMMENTED_TITLE = 'Most commented';
export default class MovieList {
  constructor(container, moviesModel, filterModel, api) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._filterModel = filterModel;
    this._api = api;

    this._filmsContainerComponent = new FilmsView();
    this._filmsListComponent = new FilmsListView();
    this._noMovieComponent = new NoFilmMessageView();
    this._extraFilmsListComponent = new ExtraFilmsListView();
    this._loadingComponent = new LoadingView();
    this._siteMenuComponent = new SiteMenuView();

    this._filmsListContainer = null;
    this._extraMostCommentedFilmsListComponent = null;
    this._topRatedListContainer = null;
    this._mostCommentedContainer = null;
    this._showMoreButtonComponent = null;
    this._sortingComponent = null;
    this._isLoading = true;
    this._currentSortType = SortType.DEFAULT;

    this._filmCardPresenter = {};
    this._topRatedFilmCardPresenter = {};
    this._mostCommentedFilmCardPresenter = {};

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._moviesModel.addObserver(this._handleModelEvent);
    this._renderedFilmCount = FILMS_PER_STEP;
  }

  init() {
    this._renderGeneralMoviesList();
  }

  _getMovies() {
    const filterType = this._filterModel.get();
    const movies = this._moviesModel.get().slice();
    const filtredMovies = filter[filterType](movies);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filtredMovies.sort(sortMovieByDate);
      case SortType.RATING:
        return filtredMovies.sort(sortMovieByRating);
    }

    return filtredMovies;
  }

  _renderLoading() {
    render(mainElement, this._loadingComponent);
  }

  _renderSiteMenu() {
    render(mainElement, this._siteMenuComponent);
  }

  _renderSort() {
    if (this._sortingComponent !== null) {
      this._sortingComponent = null;
    }

    this._sortingComponent = new SortingView(this._currentSortType);
    render(mainElement, this._sortingComponent);
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderMovie(container, id) {
    const moviePresenter = new MoviePresenter(container, this._handleViewAction, id, this._moviesModel, this._api);
    moviePresenter.init();

    return moviePresenter;
  }

  _renderRegularMovieList() {
    const movieCount = this._getMovies().length;
    const movies = this._getMovies().slice(0, Math.min(movieCount, this._renderedFilmCount));

    movies.forEach((movie) => {
      const presenter = this._renderMovie(this._filmsListContainer, movie.id);
      this._filmCardPresenter[movie.id] = presenter;
    });

    if (movieCount > this._renderedFilmCount) {
      this._renderShowMoreButton();
    }
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    render(this._filmsListComponent, this._showMoreButtonComponent);

    this._showMoreButtonComponent.setShowMoreButtonClicHandler(this._handleShowMoreButtonClick);
  }

  _renderTopRatedList() {
    const movies = this._moviesModel.get().slice();
    const moviesWithRating = movies.filter((movie) => movie.filmInfo.totalRating > 0);

    if (!moviesWithRating.length) {
      return;
    }

    render(this._filmsContainerComponent, this._extraFilmsListComponent);
    this._topRatedListContainer = this._extraFilmsListComponent.getFilmsListContainer();

    moviesWithRating
      .filter((movie) => movie.filmInfo.totalRating)
      .sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating)
      .slice(0, EXTRA_FILMS_COUNT)
      .forEach((movie) => {
        const presenter = this._renderMovie(this._topRatedListContainer, movie.id);
        this._topRatedFilmCardPresenter[movie.id] = presenter;
      });
  }

  _renderMostCommentedList() {
    const movies = this._moviesModel.get().slice();
    const moviesWithComments = movies.filter((movie) => movie.comments.length > 0);

    if (!moviesWithComments.length) {
      return;
    }

    this._extraMostCommentedFilmsListComponent = new ExtraFilmsListView(MOST_COMMENTED_TITLE);
    render(this._filmsContainerComponent, this._extraMostCommentedFilmsListComponent);

    this._mostCommentedContainer = this._extraMostCommentedFilmsListComponent.getFilmsListContainer();

    moviesWithComments
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, EXTRA_FILMS_COUNT)
      .forEach((movie) => {
        const presenter = this._renderMovie(this._mostCommentedContainer, movie.id);
        this._mostCommentedFilmCardPresenter[movie.id] = presenter;
      });
  }

  _renderNoMovies() {
    render(mainElement, this._noMovieComponent);
  }

  _renderGeneralMoviesList() {
    if (this._isLoading) {
      this._renderLoading();

      return;
    }

    const moviesCount = this._getMovies().length;

    if (moviesCount === 0) {
      this._renderNoMovies();

      return;
    }

    this._renderSiteMenu();
    this._renderSort();

    render(mainElement, this._filmsContainerComponent);
    render(this._filmsContainerComponent, this._filmsListComponent);

    this._filmsListContainer = this._filmsListComponent.getFilmsListContainer();

    this._renderRegularMovieList();
    this._renderTopRatedList();
    this._renderMostCommentedList();
  }

  _handleModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.MINOR:
        this._clearMovieList();
        this._renderGeneralMoviesList();
        break;
      case UpdateType.MAJOR:
        this._clearMovieList({ resetRenderedMovieCount: true, resetSortType: true });
        this._renderGeneralMoviesList();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderGeneralMoviesList();
        break;
    }
  }

  _clearMovieList({ resetRenderedMovieCount = false, resetSortType = false} = {}) {
    const movieCount = this._getMovies().length;

    const presenters = [
      ...Object.values(this._filmCardPresenter),
      ...Object.values(this._topRatedFilmCardPresenter),
      ...Object.values(this._mostCommentedFilmCardPresenter),
    ];

    presenters.forEach((presenter) => presenter.destroyFilmCard());

    this._filmCardPresenter = {};
    this._topRatedFilmCardPresenter = {};
    this._mostCommentedFilmCardPresenter = {};

    remove(this._showMoreButtonComponent);
    remove(this._filmsContainerComponent);
    remove(this._filmsListComponent);
    remove(this._extraFilmsListComponent);
    remove(this._extraMostCommentedFilmsListComponent);
    remove(this._noMovieComponent);
    remove(this._sortingComponent);
    remove(this._loadingComponent);
    remove(this._siteMenuComponent);

    if (resetRenderedMovieCount) {
      this._renderedFilmCount = FILMS_PER_STEP;
    } else {
      this._renderedFilmCount = Math.min(movieCount, this._renderedFilmCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _handleShowMoreButtonClick() {
    const currentMode = this._moviesModel.getMode();

    if (currentMode === Mode.POPUP) {
      return;
    }

    const movieCount = this._getMovies().length;
    const newRenderedMovieCount = Math.min(movieCount, this._renderedFilmCount + FILMS_PER_STEP);
    const movies = this._getMovies().slice(this._renderedFilmCount, newRenderedMovieCount);

    movies
      .forEach((movie) => {
        const presenter = this._renderMovie(this._filmsListContainer, movie.id);
        this._filmCardPresenter[movie.id] = presenter;
      });

    this._renderedFilmCount = newRenderedMovieCount;

    if (this._renderedFilmCount >= movieCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearMovieList({ resetRenderedMovieCount: true });
    this._renderGeneralMoviesList();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this._api.updateMovie(update)
          .then((response) => {
            this._moviesModel.update(updateType, response, { isNewComment: false });
          })
          .catch(() => {
            if (this._topRatedFilmCardPresenter[update.id]) {
              this._topRatedFilmCardPresenter[update.id].setAborting();
            }
            if (this._mostCommentedFilmCardPresenter[update.id]) {
              this._mostCommentedFilmCardPresenter[update.id].setAborting();
            }
            if (this._filmCardPresenter[update.id]) {
              this._filmCardPresenter[update.id].setAborting();
            }
          });
        break;
      case UserAction.ADD_COMMENT:
        this._api.updateMovie(update)
          .then((response) => {
            this._moviesModel.update(updateType, response, { isNewComment: true });
          });
        break;
    }
  }
}
