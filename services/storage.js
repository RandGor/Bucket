const fs = require('fs');
const path = require('path');

function createStorage(uploadsDir) {
    const uploadsRoot = path.resolve(uploadsDir);

    function ensureUploadsDir() {
        if (!fs.existsSync(uploadsRoot)) {
            fs.mkdirSync(uploadsRoot);
        }
    }

    function decodeFileName(fileName) {
        return Buffer.from(fileName, 'latin1').toString('utf8');
    }

    function isSafeFileName(fileName) {
        return fileName
            && fileName !== '.'
            && fileName !== '..'
            && !fileName.includes('/')
            && !fileName.includes('\\');
    }

    function getFilePath(fileName) {
        if (!isSafeFileName(fileName)) {
            const err = new Error('Invalid file name');
            err.code = 'INVALID_FILE_NAME';
            throw err;
        }

        const filePath = path.resolve(uploadsRoot, fileName);
        const relativePath = path.relative(uploadsRoot, filePath);

        if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
            const err = new Error('File path is outside uploads directory');
            err.code = 'INVALID_FILE_PATH';
            throw err;
        }

        return filePath;
    }

    function listFiles(callback) {
        ensureUploadsDir();
        fs.readdir(uploadsRoot, callback);
    }

    function saveFile(fileName, buffer, callback) {
        ensureUploadsDir();

        let filePath;

        try {
            filePath = getFilePath(fileName);
        } catch (err) {
            callback(err);
            return;
        }

        fs.writeFile(filePath, buffer, callback);
    }

    function canReadFile(fileName, callback) {
        let filePath;

        try {
            filePath = getFilePath(fileName);
        } catch (err) {
            callback(err);
            return;
        }

        fs.access(filePath, fs.constants.R_OK, callback);
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
