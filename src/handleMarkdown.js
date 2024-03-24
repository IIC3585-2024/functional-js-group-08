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
} = require("./markdownElements");
const { countIndentation } = require("./utils/utils");

function handleFirstLine(lines) {
  return handleMarkdown("", lines[0]);
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
  translation += "\n";

  return translation;
}

function handleFinishPreviousLine(previousLine, currentLine) {
  const previousIdentation = countIndentation(previousLine);
  const currentIdentation = countIndentation(currentLine);
  if (previousIdentation < currentIdentation) return "";
  if (isOrderedList(previousLine)) return handleFinishOrderedList(previousLine, currentLine);
  if(isUnorderedList(previousLine)) return handleFinishList(previousLine, currentLine);
  return "";
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
