import {
  EMOJIS,
  generateComment,
  createFilm,
  getUserRank,
  getWatchedFilms,
  getFilmsSortedByComments,
  getFilmsSortedByRating,
  generateFilters,
  generateSortMethods
} from './data';

import {
  createMenuTemplate,
  createPopupTemplate,
  createShowMoreTemplate,
  createSortFilterTemplate,
  createFilmCardTemplate
} from './view';

import StatsView from './view/stats.js';
import FooterView from './view/footer.js';
import UserRatingView from './view/user-rating.js';
import MostCommentedFilmsView from './view/film-list-most-commented.js';
import TopRatedFilmsView from './view/films-list-extra.js';
import FilmsView from './view/films-list.js';
import FilmCardView from './view/film-card.js';
// import PopupView from './view/popup.js';

import { renderElement, RenderPosition } from './util.js';


const FILMS_COUNT = 20;
const FILMS_PER_STEP = 5;

const COMMENTS_COUNT = 50;
const EXTRA_FILMS_COUNT = 2;

const films = new Array(FILMS_COUNT).fill().map(() => createFilm());
const comments = new Array(COMMENTS_COUNT).fill().map(() => generateComment());
const userRank = getUserRank(getWatchedFilms(films).length);
const filters = generateFilters(films);

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const renderNode = (container, template, position = 'beforeend') => {
  container.insertAdjacentHTML(position, template);
};

renderElement(headerElement, new UserRatingView(userRank).getElement(), RenderPosition.BEFOREEND);

renderNode(mainElement, createMenuTemplate(filters));
renderNode(mainElement, createSortFilterTemplate(generateSortMethods(films)));

renderElement(mainElement, new StatsView().getElement(), RenderPosition.BEFOREEND);
renderElement(mainElement, new FilmsView().getElement(), RenderPosition.BEFOREEND);

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
      .forEach((film) => renderElement(filmsListContainerNode, new FilmCardView(film).getElement(), RenderPosition.BEFOREEND));

    shownFilmsCount += FILMS_PER_STEP;

    if (shownFilmsCount >= films.length) {
      showMoreButton.remove();
    }
  };

  showMoreButton.addEventListener('click', onShowMoreButtonClick);
}

renderElement(allFilms, new TopRatedFilmsView().getElement(), RenderPosition.BEFOREEND);

const topFilms = allFilms.querySelector('.films-list--top');
const topFilmsContainer = topFilms.querySelector('.films-list__container');

renderElement(allFilms, new MostCommentedFilmsView().getElement(), RenderPosition.BEFOREEND);

const mostCommentedFilms = allFilms.querySelector('.films-list--popular');
const mostCommentedFilmsContainer = mostCommentedFilms.querySelector('.films-list__container');

for (let i = 0; i < Math.min(EXTRA_FILMS_COUNT); i++) {
  renderNode(topFilmsContainer, createFilmCardTemplate(getFilmsSortedByRating(films)[i]));
  renderNode(mostCommentedFilmsContainer, createFilmCardTemplate(getFilmsSortedByComments(films)[i]));
}

renderElement(footerElement, new FooterView(films).getElement(), RenderPosition.BEFOREEND);

renderNode(document.body, createPopupTemplate(films[0], comments, EMOJIS));
