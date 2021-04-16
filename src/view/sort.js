export const createSortFilterTemplate = (sortMethods) => {
  const getActiveStateClass = (active) => active ? 'sort__button--active' : '';

  const createSortMethodTemplate = (sortMethodName) => {
    return `<li><a href="#${sortMethodName}" class="sort__button ${getActiveStateClass(sortMethodName === 'default')}">Sort by ${sortMethodName}</a></li>`;
  };

  return `<ul class="sort">
    ${sortMethods.map(({ name: sortMethodName }) => createSortMethodTemplate(sortMethodName)).join(' ')}
  </ul>`;
};

