export const classListContains = function (event, className) {
  if (event.target.classList.contains(String(className))) return true;
  return false;
};
