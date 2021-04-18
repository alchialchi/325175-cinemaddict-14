import { addPluralEnding } from './../util.js';

export const createFooterTemplate = (films) => {
  return `<section class="footer__logo logo logo--smaller">Cinemaddict</section>
  <section class="footer__statistics">
    <p>${films.length} movie${addPluralEnding(films)} inside</p>
  </section>`;
};
