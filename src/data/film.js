import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import {
  getRandomItem,
  getRandomFloating,
  getRandomItems,
  getRandomDateFromPast,
  getRandomInteger,
  generateRandomText,
  DAYS_IN_ONE_YEAR
} from '../util.js';

const MAX_COMMENTS_PER_FILM = 15;

const MIN_SENTENCES_IN_DESCRIPTION = 1;
const MAX_SENTENCES_IN_DESCRIPTION = 5;

const MIN_RATING = 0;
const MAX_RATING = 10;

const MIN_MOVIE_DURATION_IN_MINUTES = 30;
const MAX_MOVIE_DURATION_IN_MINUTES = 4 * 60;

const FIRST_WATCHING_DAYS_AGO = 500;

const TITLES = [
  'The Shawshank Redemption',
  'The Godfather',
  'The Good, the Bad and the Ugly',
  'Pulp Fiction',
  'Fight Club',
  'Forrest Gump',
  'Psycho',
  'Alien',
  'Taxi Driver',
  'The Green Mile',
];

const DIRECTORS_NAMES = [
  'David Fincher',
  'Emir Kusturica',
  'Clint Eastwood',
  'Anthony Russo',
  'Luc Besson',
  'Martin Scorsese',
  'Ridley Scott',
  'Stanley Kubrick',
  'Tim Miller',
];

const SCREENWRITERS_NAMES = [
  'David Lynch',
  'Fernando Meirelles',
  'Rob Reine',
  'Lester James Peries',
  'Fernando Meirelles',
  'Karthik Subbaraj',
  'Joachim Ronning',
];

const ACTORS_NAMES = [
  'Angelina Jolie',
  'Ben Affleck',
  'Bruce Willis',
  'Chang Chen',
  'Daniel Craig',
  'Erza Miller',
  'Jared Leto',
  'Jason Momoa',
  'Tom Hardy',
];

const POSTERS_PATH = './images/posters';

const POSTERS_FILES = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];

const COUNTRIES = [
  'USA',
  'France',
  'Germany',
  'China',
  'Japan',
  'Sweden',
  'Denmark',
  'Norway',
  'Finland',
];

const GENRES = [
  'Drama',
  'Horror',
  'Action',
  'Comedy',
  'Western',
  'Detective',
  'Melodrama',
  'Fairy tale',
  'Thriller',
];

const AGE_RATINGS = ['G', 'PG', 'PG-13', 'R', 'NC-17'];

const getRandomRating = () => getRandomFloating(MIN_RATING, MAX_RATING, 1);

const getRandomCommentsList = () => {
  new Array(getRandomInteger(0, MAX_COMMENTS_PER_FILM)).fill().map(() => getRandomInteger(1, 50));
};

const getRandomReleaseDate = () => dayjs().subtract(getRandomInteger(0, 50 - 1), 'year').subtract(getRandomInteger(0, DAYS_IN_ONE_YEAR), 'day').toISOString();

const getRandomBoolean = () => Boolean(Math.random() < 0.5);

export const createFilm = () => {
  return {
    id: nanoid(),
    info: {
      poster: `${POSTERS_PATH}/${getRandomItem(POSTERS_FILES)}`,
      title: getRandomItem(TITLES),
      originalTitle: getRandomItem(TITLES),
      rating: getRandomRating(),
      director: getRandomItem(DIRECTORS_NAMES),
      screenwriters: getRandomItems(SCREENWRITERS_NAMES),
      actors: getRandomItems(ACTORS_NAMES),
      releaseDate: getRandomReleaseDate(),
      duration: getRandomInteger(MIN_MOVIE_DURATION_IN_MINUTES, MAX_MOVIE_DURATION_IN_MINUTES),
      releaseCountry: getRandomItem(COUNTRIES),
      genres: getRandomItems(GENRES),
      description: generateRandomText(MIN_SENTENCES_IN_DESCRIPTION, MAX_SENTENCES_IN_DESCRIPTION),
      ageRating: getRandomItem(AGE_RATINGS),
    },
    comments: getRandomCommentsList(),
    userMeta: {
      isWatched: getRandomBoolean(),
      isFavorite: getRandomBoolean(),
      isOnWhatchlist: getRandomBoolean(),
      watchingDate: getRandomDateFromPast(FIRST_WATCHING_DAYS_AGO),
    },
  };
};
