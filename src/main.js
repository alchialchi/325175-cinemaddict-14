import Api from './api';

import ProfilePresenter from './presenter/Profile';
import MoviePresenter from './presenter/MovieList';
import FooterStatisticsPresenter from './presenter/Footer';

import MoviesModel from './model/films';
import FilterModel from './model/filter';

import { UpdateType } from './const';

const AUTHORIZATION = 'Basic ZXCASDqwe123';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';

const api = new Api(END_POINT, AUTHORIZATION);

const moviesModel = new MoviesModel();
const filterModel = new FilterModel();

const headerElement = document.querySelector('.header');
const bodyElement = document.querySelector('body');
const mainElement = bodyElement.querySelector('.main');
const footerElement = document.querySelector('.footer');

const profilePresenter = new ProfilePresenter(headerElement, moviesModel);
const movieListPresenter = new MoviePresenter(mainElement, moviesModel, filterModel, api);
const footerStatisticsPresenter = new FooterStatisticsPresenter(footerElement, moviesModel);

movieListPresenter.init();

api.getMovies()
  .then((movies) => {
    moviesModel.set(UpdateType.INIT, movies);

    profilePresenter.init();
    footerStatisticsPresenter.init();
  })
  .catch(() => {
    moviesModel.set(UpdateType.INIT, []);

    profilePresenter.init();
    footerStatisticsPresenter.init();
  });


