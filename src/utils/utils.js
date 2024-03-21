function removeIndentation(str) {
  return str.replace(/^\s+/g, '');
}

function removeNumberAndDot(str) {
  return str.replace(/^\s*\d+\.\s*/, '');
}

function wholeDivision(a, b) {
  return Math.floor(a / b);
};

function countIndentation(str) {
  const firstNonSpaceIndex = str.split('').findIndex(char => char !== ' ');
  return firstNonSpaceIndex === -1 ? str.length : firstNonSpaceIndex;
}

module.exports = {
    removeNumberAndDot,
    removeIndentation,
    wholeDivision,
    countIndentation
}