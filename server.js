var express = require('express');
var app = express();
app.listen(2131);
var multer = require('multer');
const fs = require('fs');
const path = require('path');
const _uploadsDir = path.join(__dirname, 'uploads')

multer.memoryStorage({})
const upload = multer();

app.post("/", upload.single('file'), async function (req, res) {
    if (!req.file) {
        console.log('No file uploaded.');
        res.send({});
        return;
    }

    const filePath = path.join(_uploadsDir, req.file.originalname);

    if (!fs.existsSync(_uploadsDir)) {
        fs.mkdirSync(_uploadsDir, (err) => { });
    }

    fs.writeFile(filePath, req.file.buffer, function (err) {
        if (err) {
            console.error('Error saving file:', err);
            res.status(500).send('Error uploading file');
        } else {
            console.log('File ' + req.file.originalname + ' saved successfully');
            res.send({ message: 'File uploaded successfully' });
        }
    });

});
