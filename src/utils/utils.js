function removeIndentation(str) {
  return str.replace(/^\s+/g, '');
}

function removeNumberAndDot(str) {
  return str.replace(/^\s*\d+\.\s*/, '');
}

function removeFirstHyphen(str) {
  return str.replace(/-/, '');
}

function removeGreaterThan(str) {
  return str.trim().replace(/^>+/, "").trim();
}

function wholeDivision(a, b) {
  return Math.floor(a / b);
};

function countIndentation(str) {
  const firstNonSpaceIndex = str.split('').findIndex(char => char !== ' ');
  return firstNonSpaceIndex === -1 ? str.length : firstNonSpaceIndex;
}

function countGreaterThan(str) {
  const firstNonGreaterThanIndex = str.split('').findIndex(char => char !== '>');
  return firstNonGreaterThanIndex === -1 ? str.length : firstNonGreaterThanIndex;
}


module.exports = {
    removeNumberAndDot,
    removeIndentation,
    wholeDivision,
    countIndentation,
    removeFirstHyphen,
    countGreaterThan,
    removeGreaterThan
}