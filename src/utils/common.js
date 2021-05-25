export const bodyElement = document.querySelector('body');
export const mainElement = bodyElement.querySelector('.main');

const MINUTES_IN_ONE_HOUR = 60;

export const generateRuntime = (time) => {
  if (time < MINUTES_IN_ONE_HOUR) {
    return `${time}m`;
  }

  const h = parseInt(time / MINUTES_IN_ONE_HOUR);

  return `${h}h ${time - (h * MINUTES_IN_ONE_HOUR)}m`;
};
