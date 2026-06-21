const fs = require('fs');
const path = require('path');

function createStorage(uploadsDir) {
    function ensureUploadsDir() {
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir);
        }
    }

    function decodeFileName(fileName) {
        return Buffer.from(fileName, 'latin1').toString('utf8');
    }

    function getFilePath(fileName) {
        return path.join(uploadsDir, fileName);
    }

    function listFiles(callback) {
        ensureUploadsDir();
        fs.readdir(uploadsDir, callback);
    }

    function saveFile(fileName, buffer, callback) {
        ensureUploadsDir();
        fs.writeFile(getFilePath(fileName), buffer, callback);
    }

    function canReadFile(fileName, callback) {
        fs.access(getFilePath(fileName), fs.constants.R_OK, callback);
    }

    return {
        decodeFileName,
        getFilePath,
        listFiles,
        saveFile,
        canReadFile,
    };
}

module.exports = createStorage;
