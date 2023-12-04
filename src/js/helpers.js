export const classListContains = function (event, className) {
  if (event.target.closest(`.${className}`)) return true;
  return false;
};
