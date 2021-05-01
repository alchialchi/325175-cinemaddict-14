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

import StatsView from './view/stats';
import FooterView from './view/footer';
import UserRatingView from './view/user-rating';
import MostCommentedFilmsView from './view/film-list-most-commented';
import TopRatedFilmsView from './view/films-list-extra';
import FilmsView from './view/films-list';
import PopupView from './view/popup';
import SiteMenuView from './view/menu';
import SortFilterView from './view/sort';
import FilmCardView from './view/film-card';
import ShowMoreButtonView from './view/show-more';
import NoFilmMessageView from './view/no-film-message';

import { render, RenderPosition, remove } from './utils/render';

const FILMS_COUNT = 20;
const FILMS_PER_STEP = 5;

const COMMENTS_COUNT = 50;
const EXTRA_FILMS_COUNT = 2;

const films = new Array(FILMS_COUNT).fill().map(() => createFilm());
const comments = new Array(COMMENTS_COUNT).fill().map(() => generateComment());
const userRank = getUserRank(getWatchedFilms(films).length);
const filters = generateFilters(films);

const headerElement = document.querySelector('.header');
const bodyElement = document.querySelector('body');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

render(headerElement, new UserRatingView(userRank), RenderPosition.BEFOREEND);
render(mainElement, new SiteMenuView(filters), RenderPosition.BEFOREEND);
render(mainElement, new SortFilterView(generateSortMethods(films)), RenderPosition.BEFOREEND);
render(mainElement, new StatsView(), RenderPosition.BEFOREEND);
render(mainElement, new FilmsView(), RenderPosition.BEFOREEND);

const allFilms = mainElement.querySelector('.films');
const filmsListNode = mainElement.querySelector('.films-list');
const filmsListContainerNode = filmsListNode.querySelector('.films-list__container');

if (films.length === 0) {
  render(filmsListContainerNode, new NoFilmMessageView(), RenderPosition.BEFOREEND);
}

const renderFilm = (container, film) => {
  const filmComponent = new FilmCardView(film);

  render(container, filmComponent, RenderPosition.BEFOREEND);

  const filmPoster = filmComponent.getElement().querySelector('.film-card__poster');
  const filmComments = filmComponent.getElement().querySelector('.film-card__comments');
  const filmTitle = filmComponent.getElement().querySelector('.film-card__title');

  const onFilmCardClick = (evt) => {
    bodyElement.classList.add('hide-overflow');

    const filmId = evt.target.offsetParent.getAttribute('id');
    const filmPopup = films.filter((film) => film.id === Number(!filmId));

    const popup = new PopupView(filmPopup[0], comments, EMOJIS);
    render(bodyElement, popup, RenderPosition.BEFOREEND);

    const popupCloseButton = popup.getElement().querySelector('.film-details__close-btn');

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        bodyElement.removeChild(popup.getElement());
        bodyElement.classList.remove('hide-overflow');
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    const onPopupClose = () => {
      bodyElement.removeChild(popup.getElement());
      bodyElement.classList.remove('hide-overflow');
    };

    popupCloseButton.addEventListener('click', onPopupClose);
    document.addEventListener('keydown', onEscKeyDown);
  };

  filmPoster.addEventListener('click', onFilmCardClick);
  filmComments.addEventListener('click', onFilmCardClick);
  filmTitle.addEventListener('click', onFilmCardClick);
};

for (let i = 0; i < Math.min(films.length, FILMS_PER_STEP); i++) {
  renderFilm(filmsListContainerNode, films[i]);
}

if (films.length > FILMS_PER_STEP) {
  let shownFilmsCount = FILMS_PER_STEP;

  const showMoreButton = new ShowMoreButtonView();

  render(filmsListNode, showMoreButton, RenderPosition.BEFOREEND);

  showMoreButton.setClickHandler(() => {
    films
      .slice(shownFilmsCount, shownFilmsCount + FILMS_PER_STEP)
      .forEach((film) => renderFilm(filmsListContainerNode, film));

    shownFilmsCount += FILMS_PER_STEP;

    if (shownFilmsCount >= films.length) {
      remove(showMoreButton);
    }
  });
}

render(allFilms, new TopRatedFilmsView(), RenderPosition.BEFOREEND);

const topFilms = allFilms.querySelector('.films-list--top');
const topFilmsContainer = topFilms.querySelector('.films-list__container');

render(allFilms, new MostCommentedFilmsView(), RenderPosition.BEFOREEND);

const mostCommentedFilms = allFilms.querySelector('.films-list--popular');
const mostCommentedFilmsContainer = mostCommentedFilms.querySelector('.films-list__container');

if (films.length > 0) {
  for (let i = 0; i < Math.min(EXTRA_FILMS_COUNT); i++) {
    render(topFilmsContainer, new FilmCardView(getFilmsSortedByRating(films)[i]), RenderPosition.BEFOREEND);
    render(mostCommentedFilmsContainer, new FilmCardView(getFilmsSortedByComments(films)[i]), RenderPosition.BEFOREEND);
  }
}

render(footerElement, new FooterView(films), RenderPosition.BEFOREEND);
