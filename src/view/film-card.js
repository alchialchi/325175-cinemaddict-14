import dayjs from 'dayjs';
import {
  getFormattedDuration,
  addPluralEnding,
  createElement
} from '../util.js';

const SHORT_DESCRIPTION_LENGTH = 140;

const createFilmCardTemplate = (film) => {
  const {
    comments: commentsIds,
    info: {
      poster,
      title,
      rating,
      releaseDate,
      duration,
      genres,
      description,
    },
    userMeta: {
      isWatched,
      isFavorite,
      isOnWatchlist,
    },
  } = film;

  const getButtonCurrentStateClass = (isActive) => isActive ? 'film-card__controls-item--active' : '';

  const getShortDescription = (description) => description.length > SHORT_DESCRIPTION_LENGTH ? `${description.slice(0, SHORT_DESCRIPTION_LENGTH - 1).trim()}...` : description;

  return `
  <article class="film-card">
  <h3 class="film-card__title">${title}</h3>
  <p class="film-card__rating">${rating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${dayjs(releaseDate).year()}</span>
    <span class="film-card__duration">${getFormattedDuration(duration)}</span>
    <span class="film-card__genre">${genres[0]}</span>
  </p>
  <img src="${poster}" alt="" class="film-card__poster">
  <p class="film-card__description">${getShortDescription(description)}</p>
  <a class="film-card__comments">${commentsIds.length} comment${addPluralEnding(commentsIds)}</a>
  <div class="film-card__controls">
    <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${getButtonCurrentStateClass(isOnWatchlist)}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${getButtonCurrentStateClass(isWatched)}" type="button">Mark as watched</button>
    <button class="film-card__controls-item button film-card__controls-item--favorite ${getButtonCurrentStateClass(isFavorite)}" type="button">Mark as favorite</button>
  </div>
</article>
`;
};

export default class FilmCard {
  constructor(film) {
    this._film = film;
    this._element = null;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
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
