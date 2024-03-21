const { countIndentation, removeIndentation, removeNumberAndDot } = require('./utils/utils');

function isHeader(line){
    if(line[0] !== "#") return false;
    for (let i = 0; i < line.length; i++) {
        if(line[i] === " ") return true;
        if(line[i] != "#") return false;
    }
    return false;
  }

function handleHeader(line){
  let hashtagCount = 1;
  for (hashtagCount; hashtagCount < line.length; hashtagCount++) {
      if(line[hashtagCount] != "#") break;
  }
  return `<h${hashtagCount}> ${line.substring(hashtagCount, line.length+1)} </h${hashtagCount}>`
}

function isEnumerate(line){
    const filteredLine = removeIndentation(line)
    return /^\d+\.\s/.test(filteredLine);
  }

function handleEnumerate(previousLine, currentLine){
  let result = "";
  if (countIndentation(previousLine) === countIndentation(currentLine)) {
      if (!isEnumerate(previousLine)) result += "<ol> \n "
  } else if (countIndentation(previousLine) < countIndentation(currentLine)) 
    result += "<ol> \n ";

  return result + `<li> ${removeNumberAndDot(currentLine)} </li>`;
}

function isParagraph(line){
    const regex = /\S/;
    return regex.test(line);
}

function handleParagraph(line){
  return `<p> ${line} </p>`
}

module.exports = {
    isHeader,
    handleHeader,
    isEnumerate,
    handleEnumerate,
    isParagraph,
    handleParagraph
}