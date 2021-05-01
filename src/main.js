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
const bodyElement = document.querySelector('body');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

renderElement(headerElement, new UserRatingView(userRank).getElement(), RenderPosition.BEFOREEND);
renderElement(mainElement, new SiteMenuView(filters).getElement(), RenderPosition.BEFOREEND);
renderElement(mainElement, new SortFilterView(generateSortMethods(films)).getElement(), RenderPosition.BEFOREEND);
renderElement(mainElement, new StatsView().getElement(), RenderPosition.BEFOREEND);
renderElement(mainElement, new FilmsView().getElement(), RenderPosition.BEFOREEND);

const allFilms = mainElement.querySelector('.films');
const filmsListNode = mainElement.querySelector('.films-list');
const filmsListContainerNode = filmsListNode.querySelector('.films-list__container');

if (films.length === 0) {
  renderElement(filmsListContainerNode, new NoFilmMessageView().getElement(), RenderPosition.BEFOREEND);
}

const renderFilm = (container, film) => {
  const filmComponent = new FilmCardView(film);

  renderElement(container, filmComponent.getElement(), RenderPosition.BEFOREEND);

  const filmPoster = filmComponent.getElement().querySelector('.film-card__poster');
  const filmComments = filmComponent.getElement().querySelector('.film-card__comments');
  const filmTitle = filmComponent.getElement().querySelector('.film-card__title');

  const onFilmCardClick = (evt) => {
    bodyElement.classList.add('hide-overflow');

    const filmId = evt.target.offsetParent.getAttribute('id');
    const filmPopup = films.filter((film) => film.id === Number(!filmId));

    const popup = new PopupView(filmPopup[0], comments, EMOJIS);
    renderElement(bodyElement, popup.getElement(), RenderPosition.BEFOREEND);

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

  renderElement(filmsListNode, showMoreButton.getElement(), RenderPosition.BEFOREEND);

  showMoreButton.setClickHandler(() => {
    films
      .slice(shownFilmsCount, shownFilmsCount + FILMS_PER_STEP)
      .forEach((film) => renderFilm(filmsListContainerNode, film));

    shownFilmsCount += FILMS_PER_STEP;

    if (shownFilmsCount >= films.length) {
      showMoreButton.getElement().remove();
    }
  });
}

renderElement(allFilms, new TopRatedFilmsView().getElement(), RenderPosition.BEFOREEND);

const topFilms = allFilms.querySelector('.films-list--top');
const topFilmsContainer = topFilms.querySelector('.films-list__container');

renderElement(allFilms, new MostCommentedFilmsView().getElement(), RenderPosition.BEFOREEND);

const mostCommentedFilms = allFilms.querySelector('.films-list--popular');
const mostCommentedFilmsContainer = mostCommentedFilms.querySelector('.films-list__container');

if (films.length > 0) {
  for (let i = 0; i < Math.min(EXTRA_FILMS_COUNT); i++) {
    renderElement(topFilmsContainer, new FilmCardView(getFilmsSortedByRating(films)[i]).getElement(), RenderPosition.BEFOREEND);
    renderElement(mostCommentedFilmsContainer, new FilmCardView(getFilmsSortedByComments(films)[i]).getElement(), RenderPosition.BEFOREEND);
  }
}

renderElement(footerElement, new FooterView(films).getElement(), RenderPosition.BEFOREEND);
