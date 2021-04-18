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

const getFilmDate = (film) => film.info.releaseDate;

const compareFilmsByDate = (filmA, filmB) => {
  const dateA = getFilmDate(filmA);
  const dateB = getFilmDate(filmB);

  if (dayjs.max(dayjs(dateA), dayjs(dateB)).toISOString() === dateA) {
    return -1;
  }

  if (dayjs.max(dayjs(dateA),dayjs(dateB)).toISOString() === dateB) {
    return 1;
  }

  return 0;
};

export const getFilmsSortedByDate = (films) => {
  return films.slice().sort(compareFilmsByDate);
};

export const getFilmsSortedByComments = (films) => {
  return films.slice().sort(compareFilmsByComments);
};

export const getFilmsSortedByRating = (films) => {
  return films.slice().sort(compareFilmsByRating);
};

const filmsSortMethods = new Map([
  ['default', (films) => films],
  ['date', getFilmsSortedByDate],
  ['rating', getFilmsSortedByRating],
]);

export const generateSortMethods = (films) => {
  const sortMethods = [];

  for (const [sortMethodName, sort] of filmsSortMethods.entries()) {
    sortMethods.push ({
      name: sortMethodName,
      sort: sort(films),
    });
  }

  return sortMethods;
};
