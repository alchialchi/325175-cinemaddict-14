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

const MAX_CARD_COUNT = 5;
const MIN_CARD_COUNT = 2;

const insertElement = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const insertAllFilms = (container, template, place, count) => {
  for (let i = 0; i < count; i++) {
    container.insertAdjacentHTML(place, template);
  }
};

const bodyElement = document.querySelector('body');
const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

insertElement(bodyElement, createPopupTemplate(), 'beforeend');
insertElement(headerElement, createUserRatingTemplate(), 'beforeend');
insertElement(mainElement, createMenuTemlpate(), 'beforeend');
insertElement(mainElement, createFilterTemplate(), 'beforeend');
insertElement(mainElement, createStatsTemplate(), 'beforeend');
insertElement(mainElement, createFilmsListTemplate(), 'beforeend');

const allFilms = mainElement.querySelector('.films');

insertElement(allFilms, createFilmsListTemplate(), 'beforeend');

const allFilmsList = allFilms.querySelector('.films-list');
const allFilmsListContainer = allFilmsList.querySelector('.films-list__container');

insertAllFilms(allFilmsListContainer, createFilmCardTemplate(), 'beforeend', MAX_CARD_COUNT);
insertElement(allFilmsList, createShowMoreTemplate(), 'beforeend');

insertElement(allFilms, createFilmsListExtraTemplate(), 'beforeend');

const topFilms = allFilms.querySelector('.films-list--top');
const topFilmsContainer = topFilms.querySelector('.films-list__container');

insertAllFilms(topFilmsContainer, createFilmCardTemplate(), 'beforeend', MIN_CARD_COUNT);
insertElement(allFilms, createMostCommentedFilmsTemplate(), 'beforeend');

const mostCommentedFilms = allFilms.querySelector('.films-list--popular');
const mostCommentedFilmsContainer = mostCommentedFilms.querySelector('.films-list__container');

insertAllFilms(mostCommentedFilmsContainer, createFilmCardTemplate(), 'beforeend', MIN_CARD_COUNT);

insertElement(footerElement, createFooterTemplate(), 'beforeend');
