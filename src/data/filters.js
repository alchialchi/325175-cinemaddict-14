export const getWatchedFilms = (films) => films.filter((film) => film.userMeta.isWatched);

const getFilmsOnWatchlist = (films) => films.filter((film) => film.userMeta.isOnWatchlist);

const getFavoriteFilms = (films) => films.filter((film) => film.userMeta.isFavorite);

const filmsFilters = new Map([
  ['All', (films) => films],
  ['Watchlist', getFilmsOnWatchlist],
  ['History', getWatchedFilms],
  ['Favorites', getFavoriteFilms],
]);

export const generateFilters = (films) => {
  const filters = [];

  for (const [filterName, filter] of filmsFilters.entries()) {
    filters.push ({
      name: filterName,
      count: filter(films).length,
      filter: filter(films),
    });
  }

  return filters;
};
