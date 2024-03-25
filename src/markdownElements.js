const {
  countIndentation,
  removeIndentation,
  removeNumberAndDot,
  removeFirstHyphen,
  wholeDivision,
  countGreaterThan,
  countHashtag
} = require("./utils/utils");

function isHeader(line) {
  return line.trim()[0] === "#";
}

function handleHeader(line) {
  const hashtagCount = countHashtag(line);
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

function handleAnyList(previousLine, currentLine, isSameListType, markdownText, formattingFunction) {
  let result = "";
  if (countIndentation(previousLine) === countIndentation(currentLine)) {
    if (!isSameListType(previousLine)) result += `${markdownText}\n`;
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

function handleFinishList(previousLine, currentLine){
  const previousIdentation = countIndentation(previousLine);
  const currentIdentation = countIndentation(currentLine);
  if (previousIdentation < currentIdentation) return "";
  if (isOrderedList(previousLine)) return handleFinishOrderedList(previousLine, currentLine);
  if(isUnorderedList(previousLine)) return handleFinishUnorderdList(previousLine, currentLine);
  return "";
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

function handleFinishUnorderdList(previousLine, currentLine) {
  return handlefinishAnyList(previousLine, currentLine, isUnorderedList, "</ul>");
}

function isBlockQuote(line) {
  return line.trim()[0] === ">";
}

function handleFinishBlockQuotes(previousLine, currentLine){
  if (countGreaterThan(previousLine) <= countGreaterThan(currentLine)) return "";
  else{
    return "</blockquote>\n".repeat(countGreaterThan(previousLine) - countGreaterThan(currentLine));
  }
}

function handleBlockQuote(previousLine, currentLine){
  let result = "";
  if (countGreaterThan(previousLine) < countGreaterThan(currentLine)){
    result += "<blockquote>\n".repeat(countGreaterThan(currentLine) - countGreaterThan(previousLine));
  }

  return result;
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
  translation = translation.replace(/`([^`]+)`/g, "<code>$1</code>");
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

function handleLineBreaks(translation, currentLine){
  // console.log(currentLine);
  if (/\s{2}$/.test(currentLine)){
    console.log("akel");
    translation += "<br>";
  }
  return translation;
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
  isBlockQuote,
  handleBlockQuote,
  handleFinishBlockQuotes,
  handleLineBreaks
};
