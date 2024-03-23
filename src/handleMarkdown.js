const fs = require("fs");
const {
  isHeader,
  handleHeader,
  isEnumerate,
  handleEnumerate,
  isParagraph,
  handleParagraph,
  handleTextStyle,
  isList,
  handleList,
  handleFinishEnumerate,
  handleFinishList,
} = require("./markdownElements");
const { countIndentation, wholeDivision } = require("./utils/utils");

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
  return translation;
}

function isHorizontalRule(previousLine, currentLine) {
  currentLine = currentLine.trim();
  return /^(?:-+|\*+|_+)\s*$/.test(currentLine) && !previousLine.trim();
}

function handlehorizontalRule(){
  return "<hr>";

}

function handleMarkdown(previousLine, currentLine) {
  let translation = "";
  translation += handleFinishPreviousLine(previousLine, currentLine);
  if (isEnumerate(currentLine)) {
    translation += handleEnumerate(previousLine, currentLine);
  } else if (isList(currentLine)) {
    translation += handleList(previousLine, currentLine);
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
  if (isEnumerate(previousLine)) return handleFinishEnumerate(previousLine, currentLine);
  if(isList(previousLine)) return handleFinishList(previousLine, currentLine);
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
