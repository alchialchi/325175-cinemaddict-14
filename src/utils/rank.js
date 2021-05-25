const Rank = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff',
};

const userRank = {
  [Rank.NOVICE]: (count) => count <= 10,
  [Rank.FAN]: (count) => count <= 20 && count > 10,
  [Rank.MOVIE_BUFF]: (count) => count > 20,
};

export const getUserRank = (movies) => {
  const alreadyWatchedMovies = movies.filter((movie) => movie.userDetails.isAlreadyWatched);
  const watchedMoviesAmount = alreadyWatchedMovies.length;
  const [rankName] = Object.entries(userRank)
    .filter(([, rankCount]) => rankCount(watchedMoviesAmount))
    .flat();

  return rankName;
};
