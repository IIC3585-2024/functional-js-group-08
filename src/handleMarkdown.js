const fs = require('fs');
const {isHeader,
    handleHeader,
    isEnumerate,
    handleEnumerate,
    isParagraph,
    handleParagraph } = require('./markdownElements');
const { countIndentation, wholeDivision } = require('./utils/utils');

function handleFirstLine(lines){
    return handleMarkdown("", lines[0]);
}

function handleReadFile(lines, translation){
  const [previousLine, currentLine, ...rest] = lines;
  if (currentLine !== undefined){
      translation += handleMarkdown(previousLine, currentLine);
      translation = handleReadFile([currentLine, ...rest], translation);
  }
  return translation;
}

function handleMarkdown(previousLine, currentLine){
  let translation = "";
  translation += handleFinishPreviousLine(previousLine, currentLine)
  if (isEnumerate(currentLine)) {
      translation += handleEnumerate(previousLine, currentLine);
  }
  else if(isHeader(currentLine)) {
      translation += handleHeader(currentLine);
  }
  else if (isParagraph(currentLine)){
      translation += handleParagraph(currentLine);
  }
  // handleTextStyle by Vini
  translation += "\n";

  return translation;
}

function handleFinishPreviousLine(previousLine, currentLine){
  const previousIdentation = countIndentation(previousLine);
  const currentIdentation = countIndentation(currentLine);
  if(previousIdentation<currentIdentation) 
    return "";
  if(isEnumerate(previousLine)){
    if(!isEnumerate(currentLine)) return "</ol>\n";
    return "</ol>\n".repeat(wholeDivision(previousIdentation - currentIdentation, 4));
  }
  return "";
}

function writeTranslationInHTML(translation){
  fs.writeFile('result.html', translation, (err) => {
      if (err) throw err;
      console.log('El archivo ha sido guardado correctamente.');
  });
}

module.exports = {
  handleFirstLine,
  handleMarkdown,
  handleFinishPreviousLine,
  handleReadFile,
  writeTranslationInHTML
};
