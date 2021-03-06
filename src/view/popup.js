import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import SmartView from './abstract.js';

import { getFormattedDuration, addPluralEnding } from '../utils/common';
import { createElement, render, RenderPosition } from '../utils/render';

dayjs.extend(relativeTime);

const createEmojiTemplate = (emoji) => {
  return `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
    <label class="film-details__emoji-label" for="emoji-${emoji}">
      <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
    </label>`;
};

const createGenreTemplate = (genre) => {
  return `<span class="film-details__genre">${genre}</span>`;
};

const createCommentTemplate = (id, comments) => {
  const currentComment = comments.find((comment) => comment.id === id);

  const {
    text,
    emoji,
    author,
    date,
  } = currentComment;

  const humanizedCommentDate = dayjs().to(date);

  return `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${humanizedCommentDate}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`;
};

const createPopupTemplate = (film, comments, emojis) => {
  const {
    comments: commentsIds,
    info: {
      poster,
      title,
      originalTitle,
      rating,
      director,
      screenwriters,
      actors,
      releaseDate,
      duration,
      releaseCountry,
      genres,
      description,
      ageRating,
    },
    userMeta: {
      isWatched,
      isFavorite,
      isOnWatchlist,
    },
  } = film;

  const humanizedReleaseDate = dayjs(releaseDate).format('D MMMM YYYY');
  const getCurrentStateButton = (active) => active ? 'checked' : '';

  return `
  <section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${ageRating}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">${originalTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${screenwriters.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${humanizedReleaseDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${getFormattedDuration(duration)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genre${addPluralEnding(genres)}</td>
              <td class="film-details__cell">${genres.map((genre) => createGenreTemplate(genre)).join(' ')}</td>
            </tr>
          </table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${getCurrentStateButton(isOnWatchlist)}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${getCurrentStateButton(isWatched)}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${getCurrentStateButton(isFavorite)}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comment${addPluralEnding(commentsIds)} <span class="film-details__comments-count">${commentsIds.length}</span></h3>

        <ul class="film-details__comments-list">
          ${commentsIds.map((commentId) => createCommentTemplate(commentId, comments)).join(' ')}
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            ${emojis.map((emoji) => createEmojiTemplate(emoji)).join(' ')}
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`;
};

export default class Popup extends SmartView {
  constructor(film, comments, emojis) {
    super();
    this._film = film;
    this._comments = comments;
    this._emojis = emojis;
    this._closeButtonClickHandler = this._closeButtonClickHandler.bind(this);
    this._watchListClickHandler = this._watchListClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._emojiClickHandler = this._emojiClickHandler.bind(this);
  }

  getTemplate() {
    return createPopupTemplate(this._film, this._comments, this._emojis);
  }

  _emojiClickHandler(evt) {
    evt.preventDefault();
    const container = this.getElement().querySelector('.film-details__add-emoji-label');

    if (container.querySelector('img')) {
      const emojiImage = this.getElement().querySelector('.film-details__add-emoji-label img');
      emojiImage.src = `images/emoji/${evt.target.value}.png`;
      emojiImage.alt = `emoji-${evt.target.value}`;
    } else {
      const element = createElement(`<img src="images/emoji/${evt.target.value}.png" width="55" height="55" alt="emoji-${evt.target.value}">`);
      render(container, element, RenderPosition.BEFOREEND);
    }
  }

  setEmojiClickHandler() {
    this.getElement().querySelector('.film-details__emoji-list').addEventListener('input', this._emojiClickHandler);
  }

  restoreHandlers() {
    this.setCloseButtonClickHandler(this._callback.closeButtonClick);
    this.setWatchListClickHandler(this._callback.watchListClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
  }

  _closeButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeButtonClick();
  }

  setCloseButtonClickHandler(callback) {
    this._callback.closeButtonClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closeButtonClickHandler);
  }

  _watchListClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchListClick();
  }

  setWatchListClickHandler(callback) {
    this._callback.watchListClick = callback;
    this.getElement().querySelector('#watchlist').addEventListener('change', this._watchListClickHandler);
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector('#watched').addEventListener('change', this._watchedClickHandler);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('#favorite').addEventListener('change', this._favoriteClickHandler);
  }
}
