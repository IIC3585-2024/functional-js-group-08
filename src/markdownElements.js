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

function isHorizontalRule(previousLine, currentLine) {
  currentLine = currentLine.trim();
  return /^(?:-+|\*+|_+)\s*$/.test(currentLine) && !previousLine.trim();
}

function handlehorizontalRule(){
  return "<hr>";

}

function isOrderedList(line) {
  const filteredLine = removeIndentation(line);
  return /^\d+\.\s/.test(filteredLine);
}

function isUnorderedList(line) {
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

function handleUnorderedList(previousLine, currentLine) {
  return handleAnyList(previousLine, currentLine, isUnorderedList, "<ul>", removeFirstHyphen);
}

function handleOrderedList(previousLine, currentLine) {
  return handleAnyList(previousLine, currentLine, isOrderedList, "<ol>", removeNumberAndDot);
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

function handleFinishOrderedList(previousLine, currentLine) {
  return handlefinishAnyList(previousLine, currentLine, isOrderedList, "</ol>");
}

function handleFinishList(previousLine, currentLine) {
  return handlefinishAnyList(previousLine, currentLine, isUnorderedList, "</ul>");
}

function isParagraph(line) {
  const regex = /\S/;
  return regex.test(line);
}

function handleParagraph(line) {
  return `<p> ${line} </p>`;
}

function handleTextStyle(translation) {
  translation = translation.replace(/(\*\*|__)(.*?)\1/g, "<strong>$2</strong>");
  translation = translation.replace(/(\*|_)(.*?)\1/g, "<em>$2</em>");

  return translation;
}

function handleLinks(translation) {
  const regex = /!?\[([^\]]+)\]\(([^\)]+)\)/g;
  return translation.replace(regex, (match, altText, url) => {
      if (match.startsWith('!')) {
          return `<img src="${url}" alt="${altText}">`;
      }
      return `<a href="${url}">${altText}</a>`;
  });
}

module.exports = {
  isHeader,
  handleHeader,
  isOrderedList,
  handleOrderedList,
  isUnorderedList,
  handleUnorderedList,
  isParagraph,
  handleParagraph,
  handleTextStyle,
  handleFinishOrderedList,
  handleFinishList,
  isHorizontalRule,
  handlehorizontalRule,
  handleLinks,
};
