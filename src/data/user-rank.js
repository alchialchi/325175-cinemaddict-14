const userRanks = new Map([
  ['Novice', [1, 10]],
  ['Fan', [11, 20]],
  ['Movie Buff', [21, Infinity]],
]);

export const getUserRank = (watchedFilmsCount) => {
  for (const [title, range] of userRanks.entries()) {
    if (watchedFilmsCount >= range[0] && watchedFilmsCount <= range[1]) {
      return title;
    }
  }
  return '';
};
