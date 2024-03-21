const importFile = require('./utils/importFile');
const { handleFirstLine, handleReadFile, writeTranslationInHTML } = require('./handleMarkdown');

function main() {
    const filePath = '../tests/easyTest.md';
    const lines = importFile(filePath);
    let translation = handleFirstLine(lines);
    translation = handleReadFile(lines, translation);
    writeTranslationInHTML(translation);
}

main()