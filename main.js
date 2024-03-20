const importFile = require('./importFile.js');
const fs = require('fs');

function isNumeric(str) {
    return !isNaN(parseFloat(str)) && isFinite(str);
}

function removeIndentation(str) {
    return str.replace(/^\s+/g, '');
}

function isLineEnumerate(line){
    const filteredLine = removeIndentation(line)
    if(isNumeric(filteredLine[0]) && filteredLine.substring(1, 3) === ". ") return true;
    return false;
}

function isLineHeader(line){
    if(line[0] !== "#") return false;
    for (let i = 0; i < line.length; i++) {
        if(line[i] === " ") return true;
        if(line[i] != "#") return false;
    }
    return false;
}

function handleLineHeader(line){
    let hashtagCount = 1;
    for (hashtagCount; hashtagCount < line.length; hashtagCount++) {
        if(line[hashtagCount] != "#") break;
    }
    return `<h${hashtagCount}> ${line.substring(hashtagCount, line.length+1)} </h${hashtagCount}>`
}

function handleParagraphLine(line){
    return `<p> ${line} </p>`
}

function countIndentation(str) {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === ' ') {
            count++;
        } else {
            break;
        }
    }
    return count;
}

function handleLineEnumerate(lines, linePosition){
    let result = "";
    const previusLine = lines[linePosition-1] || "";
    const currentLine = lines[linePosition];
    if(countIndentation(previusLine)===countIndentation(currentLine)){
        if(!isLineEnumerate(previusLine)) result += "<ol> \n "   
    }
    else if(countIndentation(previusLine) < countIndentation(currentLine)) 
        result += "<ol> \n ";
    return result + `<li> ${currentLine} </li>`;
    
}

function handleFinishPreviusLine(lines, linePosition){
    if (linePosition==0) return "";
    const previusLine = lines[linePosition-1];
    const currentLine = lines[linePosition];
    if(countIndentation(previusLine)<countIndentation(currentLine)) return "";
    if (isLineEnumerate(previusLine)&& !isLineEnumerate(currentLine)) return "</ol>\n";
    if (isLineEnumerate(previusLine)){
        let result = ""
        for(let i=countIndentation(previusLine)-countIndentation(currentLine); i>0; i--) result +="</ol>\n";
        return result;
    }
    return "";
}

function handleReadNextLine(lines, linePosition){
    const currentLine = lines[linePosition];
    result = "";
    result += handleFinishPreviusLine(lines, linePosition);
    if(isLineEnumerate(currentLine)) result += handleLineEnumerate(lines, linePosition);
    else if(isLineHeader(currentLine)) result += (handleLineHeader(currentLine));
    else result += handleParagraphLine(currentLine);
    return result;

}

function handleReadFile(lines){
    let result = "";
    for(let linePosition = 0; linePosition < lines.length; linePosition++){
        result += handleReadNextLine(lines, linePosition)
        result += "\n";
    }
    fs.writeFile('result.html', result, (err) => {
        if (err) throw err;
        console.log('El archivo ha sido guardado correctamente.');
    });
}

function writeNewLabel(text, identacion, label){

    
}

function main(){
    const filePath = './test2.md';
    const lines = importFile(filePath);
    handleReadFile(lines);
}

main()