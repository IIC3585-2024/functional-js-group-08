const importFile = require('./importFile.js');
const fs = require('fs');

function isNumeric(str) {
    return !isNaN(parseFloat(str)) && isFinite(str);
}

function isLineEnumerate(line){
    if(isNumeric(line[0]) && line.substring(1, 3) === ". ") return true;
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


function handleLineEnumerate(line){
    //TODO
    return false
}


function handleReadNextLine(currentLine, ident){
    if(isLineEnumerate(currentLine)) return handleLineEnumerate(currentLine, ident);
    if(isLineHeader(currentLine)) return(handleLineHeader(currentLine));
    return handleParagraphLine(currentLine);

}

function handleReadFile(lines){
    let result = ""
    while(lines.length>0){
        currentLine = lines.shift();
        result += handleReadNextLine(currentLine, 0)
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
    const filePath = './headerText.md';
    const lines = importFile(filePath);
    handleReadFile(lines);
}

main()