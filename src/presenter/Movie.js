
import FilmCardView from '../view/film-card';
import PopupView from '../view/popup';
import { comments } from '../data';
import { render, remove, replace, RenderPosition } from '../utils/render';

export default class Movie {
  constructor(filmListComponent, changeData) {
    this._filmListComponent = filmListComponent;
    this._filmListContainer = filmListComponent.getElement().querySelector('.films-list__container');
    this._comments = comments;
    this._changeData = changeData;

    this._filmCardComponent = null;
    this._popupComponent = null;

    this._showPopup = this._showPopup.bind(this);
    this._hidePopup = this._hidePopup.bind(this);

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleWatchListClick = this._handleWatchListClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmCardComponent = this._filmCardComponent;
    const prevPopupComponent = this._popupComponent;

    this._filmCardComponent = new FilmCardView(film);
    this._popupComponent = new PopupView(film, this._comments);

    this._setFilmCardClickHandlers();
    this._setPopupClickHandlers();

    if (prevFilmCardComponent === null || prevPopupComponent === null) {
      render(this._filmListContainer, this._filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._filmListComponent.getElement().contains(prevFilmCardComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    if (document.body.contains(prevPopupComponent.getElement())) {
      replace(this._popupComponent, prevPopupComponent);
    }

    remove(prevFilmCardComponent);
    remove(prevPopupComponent);
  }

  _setFilmCardClickHandlers() {
    this._filmCardComponent.setFilmCardClickHandler(this._showPopup);
    this._filmCardComponent.setWatchListClickHandler(this._handleWatchListClick);
    this._filmCardComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
  }

  _setPopupClickHandlers() {
    this._popupComponent.setWatchListClickHandler(this._handleWatchListClick);
    this._popupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._popupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._popupComponent.setCloseButtonClickHandler(this._hidePopup);
    this._popupComponent.setEmojiClickHandler();
  }

  _handleWatchListClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          userMeta: {
            ...this._film.userMeta,
            isOnWatchlist: !this._film.userMeta.isOnWatchlist,
          },
        },
      ),
    );
  }

  _handleWatchedClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          userMeta: {
            ...this._film.userMeta,
            isWatched: !this._film.userMeta.isWatched,
          },
        },
      ),
    );
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          userMeta: {
            ...this._film.userMeta,
            isFavorite: !this._film.userMeta.isFavorite,
          },
        },
      ),
    );
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._popupComponent);
  }

  _showPopup() {
    render(document.body, this._popupComponent, RenderPosition.BEFOREEND);
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this._onEscKeyDown);
    this._setPopupClickHandlers();
  }

  _hidePopup() {
    remove(this._popupComponent);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._hidePopup();
    }
  }
}
