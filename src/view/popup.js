import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { getFormattedDuration, addPluralEnding } from '../util.js';

dayjs.extend(relativeTime);

export const createPopupTemplate = (film, comments, emojis) => {
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

  const createGenreTemplate = (genre) => {
    return `<span class="film-details__genre">${genre}</span>`;
  };

  const createCommentTemplate = (id) => {
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

  const createEmojiTemplate = (emojiName) => {
    return `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emojiName}" value="${emojiName}">
      <label class="film-details__emoji-label" for="emoji-${emojiName}">
        <img src="./images/emoji/${emojiName}.png" width="30" height="30" alt="emoji">
      </label>`;
  };

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
          ${commentsIds.map((commentId) => createCommentTemplate(commentId)).join(' ')}
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            ${emojis.map((emojiName) => createEmojiTemplate(emojiName)).join(' ')}
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`;
};
