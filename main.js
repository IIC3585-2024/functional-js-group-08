const importFile = require('./importFile.js')

function handleReadNextLine(line){
    // switch(line){

    // }
}

function handleReadFile(lines){
    currentLine = lines.shift();
}

function main(){
    const filePath = './text.md';
    const lines = importFile(filePath);
    console.log(lines);
}

main()