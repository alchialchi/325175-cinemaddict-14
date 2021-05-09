import {
  createFilm,
  getUserRank,
  getWatchedFilms,
  generateFilters
} from './data';

import FooterView from './view/footer';
import UserRatingView from './view/user-rating';
import MoviePresenter from './presenter/MovieList';

import { render, RenderPosition } from './utils/render';

const FILMS_COUNT = 20;

const films = new Array(FILMS_COUNT).fill().map(() => createFilm());
const userRank = getUserRank(getWatchedFilms(films).length);
const filters = generateFilters(films);

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

render(headerElement, new UserRatingView(userRank), RenderPosition.BEFOREEND);
render(footerElement, new FooterView(films), RenderPosition.BEFOREEND);

const moviePresenter = new MoviePresenter(mainElement, filters);
moviePresenter.init(films);
