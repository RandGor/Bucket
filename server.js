var express = require('express');
var app = express();
app.listen(2131);
var multer = require('multer');
const fs = require('fs');
const path = require('path');
const _uploadsDir = path.join(__dirname, 'uploads')

multer.memoryStorage({})
const upload = multer();

//curl -X POST -F file=@/Users/eydemidovich/Music/Music/Media.localized/Music/Kevin\ MacLeod.zip  "127.0.0.1:2131"
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


// Route to list of files
app.get('/uploads', (req, res) => {
    const filePath = path.join(__dirname, 'uploads');
    let out = "";

    fs.readdir(filePath, (err, files) => {
        files.forEach(file => {
            let row = `<a href="./uploads/${file}">${file}</a><br>`;
            out+=row;
        });
        res.status(200).send(out);
    });
});

// Route to get a file
app.get('/uploads/:filename', (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', fileName);

    console.log('Wanna get file:', filePath);

    fs.access(filePath, fs.constants.R_OK, (err) => {
        if (err) {
            console.error('Error accessing file:', err);
            if (!res.headersSent) // if doesn't sent yet
                return res.status(404).send('File not found');
        }

        res.download(filePath, (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                if (!res.headersSent) // if doesn't sent yet
                    return res.status(500).send('Error downloading file');
            }
        });
    });
});
