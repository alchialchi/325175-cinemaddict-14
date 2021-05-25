
export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rate',
};

export const UpdateType = {
  PATCH: 'Patch',
  MINOR: 'Minor',
  MAJOR: 'Major',
  INIT: 'Init',
};

export const MenuItem = {
  ALL_MOVIES: 'All movies',
  WATHCLIST: 'Watchlist',
  FAVOURITES: 'Favorites',
  HISTORY: 'History',
  STATISTICS: 'Statistics',
};

export const UserAction = {
  UPDATE_MOVIE: 'Update movie',
  UPDATE_COMMENTS: 'Update comments',
  ADD_COMMENT: 'Add comment',
  DELETE_COMMENT: 'Delete comment',
};

export const Rank = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff',
};

export const Mode = {
  DEFAULT: 'Default',
  POPUP: 'Popup',
};

export const State = {
  SAVING: 'Saving',
  DELETING: 'Deleting',
  ABORTING: 'Aborting',
};

export const filter = {
  [MenuItem.ALL_MOVIES]: (movies) => movies,
  [MenuItem.WATHCLIST]: (movies) => movies.filter((movie) => movie.userDetails.isWatchlist),
  [MenuItem.FAVOURITES]: (movies) => movies.filter((movie) => movie.userDetails.isFavorite),
  [MenuItem.HISTORY]: (movies) => movies.filter((movie) => movie.userDetails.isAlreadyWatched),
  [MenuItem.STATISTICS]: (movies) => movies,
};
