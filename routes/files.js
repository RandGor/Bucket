const express = require('express');

function createFilesRouter(options) {
    const router = express.Router();

    router.post('/post', function (req, res) {
        options.upload.single(options.uploadFieldName)(req, res, function (uploadErr) {
            if (uploadErr) {
                if (uploadErr.code === 'LIMIT_FILE_SIZE') {
                    res.status(413).send('File is too large');
                    return;
                }

                console.error('Error processing upload:', uploadErr);
                res.status(400).send('Invalid upload request');
                return;
            }

            handleUpload(req, res, options);
        });
    });

    function handleUpload(req, res, options) {
        if (!req.file) {
            console.log('No file uploaded.');
            res.send({});
            return;
        }

        const fileName = options.storage.decodeFileName(req.file.originalname);

        options.storage.saveFile(fileName, req.file.buffer, function (err) {
            if (err) {
                console.error('Error saving file:', err);
                res.status(500).send('Error uploading file');
                return;
            }

        console.log('File ' + fileName + ' saved successfully');
        res.send({ message: 'File uploaded successfully' });
    });
    }

    router.get('/', function (req, res) {
        options.storage.listFiles(function (err, files) {
            if (err) {
                console.error('Error reading uploads directory:', err);
                res.sendStatus(500);
                return;
            }

            res.status(200).send(options.renderFilesPage(files));
        });
    });

    router.get('/uploads/:filename', function (req, res) {
        const fileName = req.params.filename;
        let filePath;

        try {
            filePath = options.storage.getFilePath(fileName);
        } catch (err) {
            console.error('Invalid download file name:', err);
            res.status(404).send('File not found');
            return;
        }

        console.log('Wanna get file:', filePath);

        options.storage.canReadFile(fileName, function (err) {
            if (err) {
                console.error('Error accessing file:', err);
                res.status(404).send('File not found');
                return;
            }

            res.download(filePath, function (downloadErr) {
                if (downloadErr && !res.headersSent) {
                    console.error('Error downloading file:', downloadErr);
                    res.status(500).send('Error downloading file');
                }
            });
        });
    });

    return router;
}

module.exports = createFilesRouter;
