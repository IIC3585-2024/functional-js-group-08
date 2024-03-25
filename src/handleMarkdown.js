const fs = require("fs");
const {
  isHeader,
  handleHeader,
  isOrderedList,
  handleOrderedList,
  isParagraph,
  handleParagraph,
  handleTextStyle,
  isUnorderedList,
  handleUnorderedList,
  handleFinishOrderedList,
  handleFinishList,
  isHorizontalRule,
  handlehorizontalRule,
  handleLinks,
  isBlockQuote,
  handleBlockQuote,
  handleFinishBlockQuotes,
  handleLineBreaks
} = require("./markdownElements");
const { countIndentation, removeGreaterThan, countGreaterThan } = require("./utils/utils");

function handleFirstLine(lines) {
  return addCss() + handleMarkdown("", lines[0]);
}

function addCss(){
  return `<link rel="stylesheet" href="style.css">\n`;
}

function handleReadFile(lines, translation) {
  const [previousLine, currentLine, ...rest] = lines;
  if (currentLine !== undefined) {
    translation += handleMarkdown(previousLine, currentLine);
    translation = handleReadFile([currentLine, ...rest], translation);
  }
  translation = handleTextStyle(translation);
  translation = handleLinks(translation);
  return translation;
}

function handleMarkdown(previousLine, currentLine) {
  let translation = "";
  translation += handleFinishPreviousLine(previousLine, currentLine);
  if (isBlockQuote(currentLine)){
    translation += handleBlockQuote(previousLine, currentLine);
    currentLine = removeGreaterThan(currentLine);
  }
  if (isBlockQuote(previousLine)){
    previousLine = removeGreaterThan(previousLine);
  }
  console.log(currentLine);
  if (isOrderedList(currentLine)) {
    translation += handleOrderedList(previousLine, currentLine);
  } else if (isUnorderedList(currentLine)) {
    translation += handleUnorderedList(previousLine, currentLine);
  } else if (isHeader(currentLine)) {
    translation += handleHeader(currentLine);
  } else if(isHorizontalRule(previousLine, currentLine)){
    translation += handlehorizontalRule();
  } else if (isParagraph(currentLine)) {
    translation += handleParagraph(currentLine);
  }
  translation = handleLineBreaks(translation, currentLine);
  translation += "\n";
  return translation;
}


function handleFinishPreviousLine(previousLine, currentLine) {
  let result = "";
  result += handleFinishList(removeGreaterThan(previousLine), removeGreaterThan(currentLine));
  result += handleFinishBlockQuotes(previousLine, currentLine);
  return result;
}


function writeTranslationInHTML(translation) {
  fs.writeFile("result.html", translation, (err) => {
    if (err) throw err;
    console.log("El archivo ha sido guardado correctamente.");
  });
}

module.exports = {
  handleFirstLine,
  handleMarkdown,
  handleFinishPreviousLine,
  handleReadFile,
  writeTranslationInHTML,
};
