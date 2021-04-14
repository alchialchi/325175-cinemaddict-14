import { EMOJIS, generateComment, createFilm, getUserRank, getWatchedFilms, getFilmsSortedByComments, getFilmsSortedByRating } from './data';

import {
  createMenuTemlpate,
  createPopupTemplate,
  createUserRatingTemplate,
  createShowMoreTemplate,
  createFilmsListExtraTemplate,
  createFilmsListTemplate,
  createFilterTemplate,
  createFooterTemplate,
  createFilmCardTemplate,
  createStatsTemplate,
  createMostCommentedFilmsTemplate
} from './view';

const FILMS_COUNT = 20;
const FILMS_PER_STEP = 5;

const COMMENTS_COUNT = 50;
const EXTRA_FILMS_COUNT = 2;

const films = new Array(FILMS_COUNT).fill().map(() => createFilm());
const comments = new Array(COMMENTS_COUNT).fill().map(() => generateComment());
const userRank = getUserRank(getWatchedFilms(films).length);

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const renderNode = (container, template, position = 'beforeend') => {
  container.insertAdjacentHTML(position, template);
};

renderNode(headerElement, createUserRatingTemplate(userRank));

renderNode(mainElement, createMenuTemlpate());
renderNode(mainElement, createFilterTemplate());
renderNode(mainElement, createStatsTemplate());
renderNode(mainElement, createFilmsListTemplate());

const allFilms = mainElement.querySelector('.films');
const filmsListNode = mainElement.querySelector('.films-list');
const filmsListContainerNode = filmsListNode.querySelector('.films-list__container');

for (let i = 0; i < Math.min(films.length, FILMS_PER_STEP); i++) {
  renderNode(filmsListContainerNode, createFilmCardTemplate(films[i]));
}

if (films.length > FILMS_PER_STEP) {
  let shownFilmsCount = FILMS_PER_STEP;

  renderNode(filmsListNode, createShowMoreTemplate());

  const showMoreButton = filmsListNode.querySelector('.films-list__show-more');

  const onShowMoreButtonClick = (evt) => {
    evt.preventDefault();

    films
      .slice(shownFilmsCount, shownFilmsCount + FILMS_PER_STEP)
      .forEach((film) => renderNode(filmsListContainerNode, createFilmCardTemplate(film)));

    shownFilmsCount += FILMS_PER_STEP;

    if (shownFilmsCount >= films.length) {
      showMoreButton.remove();
    }
  };

  showMoreButton.addEventListener('click', onShowMoreButtonClick);
}

renderNode(allFilms, createFilmsListExtraTemplate());

const topFilms = allFilms.querySelector('.films-list--top');
const topFilmsContainer = topFilms.querySelector('.films-list__container');

renderNode(allFilms, createMostCommentedFilmsTemplate());

const mostCommentedFilms = allFilms.querySelector('.films-list--popular');
const mostCommentedFilmsContainer = mostCommentedFilms.querySelector('.films-list__container');

for (let i = 0; i < Math.min(EXTRA_FILMS_COUNT); i++) {
  renderNode(topFilmsContainer, createFilmCardTemplate(getFilmsSortedByRating(films)[i]));
  renderNode(mostCommentedFilmsContainer, createFilmCardTemplate(getFilmsSortedByComments(films)[i]));
}

renderNode(footerElement, createFooterTemplate());

renderNode(document.body, createPopupTemplate(films[0], comments, EMOJIS));
