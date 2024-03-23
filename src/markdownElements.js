const {
  countIndentation,
  removeIndentation,
  removeNumberAndDot,
  removeFirstHyphen,
  wholeDivision,
} = require("./utils/utils");

function isHeader(line) {
  if (line[0] !== "#") return false;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === " ") return true;
    if (line[i] != "#") return false;
  }
  return false;
}

function handleHeader(line) {
  let hashtagCount = 1;
  for (hashtagCount; hashtagCount < line.length; hashtagCount++) {
    if (line[hashtagCount] != "#") break;
  }
  return `<h${hashtagCount}> ${line.substring(
    hashtagCount,
    line.length + 1
  )} </h${hashtagCount}>`;
}

function isEnumerate(line) {
  const filteredLine = removeIndentation(line);
  return /^\d+\.\s/.test(filteredLine);
}

function isList(line) {
  const filteredLine = removeIndentation(line);
  return /^-\s/.test(filteredLine);
}

function handleAnyList(previousLine, currentLine, isFunction, markdownText, formattingFunction) {
  let result = "";
  if (countIndentation(previousLine) === countIndentation(currentLine)) {
    if (!isFunction(previousLine)) result += `${markdownText}\n`;
  } else if (countIndentation(previousLine) < countIndentation(currentLine))
    result += `${markdownText}\n`;
  return result + `<li> ${formattingFunction(currentLine)} </li>`;
}

function handleList(previousLine, currentLine) {
  return handleAnyList(previousLine, currentLine, isList, "<ul>", removeFirstHyphen);
}

function handleEnumerate(previousLine, currentLine) {
  return handleAnyList(previousLine, currentLine, isEnumerate, "<ol>", removeNumberAndDot);
}

function handlefinishAnyList(previousLine, currentLine, isFunction, markdownText) {
  if (isFunction(previousLine)) {
    if (!isFunction(currentLine)) return `${markdownText}\n`;
    return `${markdownText}\n`.repeat(
      wholeDivision(countIndentation(previousLine) - countIndentation(currentLine), 4)
    );
  }
  return "";
}

function handleFinishEnumerate(previousLine, currentLine) {
  return handlefinishAnyList(previousLine, currentLine, isEnumerate, "</ol>");
}

function handleFinishList(previousLine, currentLine) {
  return handlefinishAnyList(previousLine, currentLine, isList, "</ul>");
}

function isParagraph(line) {
  const regex = /\S/;
  return regex.test(line);
}

function handleParagraph(line) {
  return `<p> ${line} </p>`;
}

function handleTextStyle(text) {
  text = text.replace(/(\*\*|__)(.*?)\1/g, "<strong>$2</strong>");
  text = text.replace(/(\*|_)(.*?)\1/g, "<em>$2</em>");

  return text;
}

module.exports = {
  isHeader,
  handleHeader,
  isEnumerate,
  handleEnumerate,
  isList,
  handleList,
  isParagraph,
  handleParagraph,
  handleTextStyle,
  handleFinishEnumerate,
  handleFinishList,

};
