export const getWatchedFilms = (films) => films.filter((film) => film.userMeta.isWatched);
