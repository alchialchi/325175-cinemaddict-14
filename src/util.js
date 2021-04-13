import dayjs from 'dayjs';
import dayjsDuration from 'dayjs/plugin/duration';

dayjs.extend(dayjsDuration);

const RANDOM_SENTENCES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const MINUTES_IN_ONE_DAY = 1440;

export const DAYS_IN_ONE_YEAR = 365;

export const getRandomInteger = (min = 0, max = 1) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getRandomFloating = (min, max, floatingPoint) => {
  const randomNumber = (Math.random() * (max - min + 1)) + min;

  return randomNumber.toFixed(floatingPoint);
};

export const shuffleArray = (array) => {
  let index = -1;

  while (++index < array.length) {
    const randomNumber = getRandomInteger(index, array.length - 1);
    [array[randomNumber], array[index]] = [array[index], array[randomNumber]];
  }

  return array;
};

export const getRandomItem = (array) => array[getRandomInteger(0, array.length - 1)];

export const getRandomItems = (items, min = 1, max = items.length) => {
  const randomItems = [];

  while (randomItems.length < min) {
    for (const item of items) {
      if (randomItems.length < max) {
        randomItems.push(item);
      }
    }
  }

  return shuffleArray(randomItems);
};

export const generateRandomText = (minSentences = 1, maxSentences = RANDOM_SENTENCES.length) => getRandomItems(RANDOM_SENTENCES, minSentences, maxSentences).join(' ');

export const getRandomDateFromPast = (maxDaysAgo) => dayjs()
  .subtract(getRandomInteger(0, maxDaysAgo - 1), 'day')
  .subtract(getRandomInteger(0, MINUTES_IN_ONE_DAY), 'minute').toISOString();

export const convertPlainTextToSnakeCase = (text) => text.toLowerCase().replace(/[\s]+/g, '-');

export const getFormattedDuration = (durationInMinutes) => {
  const duration = dayjs.duration(durationInMinutes, 'minute');

  return `${duration.hours() ? duration.hours() + 'h ' : ''}${duration.minutes()}m`;
};

export const addPluralEnding = (array) => array.length !== 1 ? 's' : '';
