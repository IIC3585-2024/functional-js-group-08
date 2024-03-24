const fs = require('fs');

function importFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const lines = data.split('\n');
        return lines;
    } catch (err) {
        console.error('Error al cargar el archivo:', err);
        throw err;
    }
}

module.exports = importFile;