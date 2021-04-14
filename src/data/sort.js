import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';

dayjs.extend(minMax);

const getFilmCommentsCount = (film) => film.comments.length;

const getFilmRating = (film) => film.info.rating;

const compareFilmsByComments = (filmA, filmB) => {
  const commentsCountA = getFilmCommentsCount(filmA);
  const commentsCountB = getFilmCommentsCount(filmB);

  return commentsCountB - commentsCountA;
};

const compareFilmsByRating = (filmA, filmB) => {
  const ratingA = getFilmRating(filmA);
  const ratingB = getFilmRating(filmB);

  return ratingB - ratingA;
};

export const getFilmsSortedByComments = (films) => {
  return films.slice().sort(compareFilmsByComments);
};

export const getFilmsSortedByRating = (films) => {
  return films.slice().sort(compareFilmsByRating);
};
