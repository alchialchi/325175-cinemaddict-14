import {
  getRandomItem,
  generateRandomText,
  getRandomDateFromPast,
  createUniqueIdGenerator
} from '../util.js';

const MAX_COMMENT_DAYS_AGO = 300;

const COMMENTS_AUTHORS = [
  'Leeroy Jenkins',
  'Viltautas Gadhavi',
  'Kiran Capello',
  'Adam Berger',
  'Thisbe Hicks',
  'Raibeart Martins',
  'Curt Owston',
  'Sparrow Cotterill',
  'Jerred Munson',
  'Chloe Lukeson',
];

export const EMOJIS = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];

const MIN_SENTENCES_IN_COMMENT = 1;
const MAX_SENTENCES_IN_COMMENT = 3;

const getCommentId = createUniqueIdGenerator();

export const generateComment = () => {
  return {
    id: getCommentId(),
    text: generateRandomText(MIN_SENTENCES_IN_COMMENT, MAX_SENTENCES_IN_COMMENT),
    emoji: getRandomItem(EMOJIS),
    author: getRandomItem(COMMENTS_AUTHORS),
    date: getRandomDateFromPast(MAX_COMMENT_DAYS_AGO),
  };
};
