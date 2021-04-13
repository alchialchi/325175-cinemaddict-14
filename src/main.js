import { createFilm } from './data/film.js';
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

const FILMS_COUNT = 20;
const FILMS_PER_STEP = 5;

const films = new Array(FILMS_COUNT).fill().map(() => createFilm());

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

const allFilmsList = allFilms.querySelector('.films-list');
const allFilmsListContainer = allFilmsList.querySelector('.films-list__container');

//Check it later
const filmsListNode = mainElement.querySelector('.films-list');
const filmsListContainerNode = filmsListNode.querySelector('.films-list__container');

for (let i = 0; i < Math.min(films.length, FILMS_PER_STEP); i++) {
  insertElement(filmsListContainerNode, createFilmCardTemplate(films[i]), 'beforeend');
}

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
