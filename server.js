var express = require('express');
var app = express();
app.listen(2131);
var multer = require('multer');
const fs = require('fs');
const path = require('path');
const _uploadsDirName = 'uploads'
const _uploadsDir = path.join(__dirname, _uploadsDirName)

multer.memoryStorage({})
const upload = multer();

// curl -X POST -F file=@/Users/eydemidovich/Music/Music/Media.localized/Music/Kevin\ MacLeod.zip  "127.0.0.1:2131/post"
app.post("/post", upload.single('file'), async function (req, res) {
    if (!req.file) {
        console.log('No file uploaded.');
        res.send({});
        return;
    }

    const fileName = Buffer.from(req.file.originalname, 'latin1').toString('utf8');

    const filePath = path.join(_uploadsDir, fileName);
    console.log("sending:")

    if (!fs.existsSync(_uploadsDir)) {
        fs.mkdirSync(_uploadsDir, (err) => { });
    }

    fs.writeFile(filePath, req.file.buffer, function (err) {
        if (err) {
            console.error('Error saving file:', err);
            res.status(500).send('Error uploading file');
        } else {
            console.log('File ' + fileName + ' saved successfully');
            res.send({ message: 'File uploaded successfully' });
        }
    });

});

// Route to list of files
app.get('/', (req, res) => {
    let out = `
    <html>
    <head>
        <title>File Upload</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 40px;
                background-color: #f4f4f4;
            }
            h1 {
                color: #333;
            }
            form {
                margin-bottom: 20px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            th, td {
                padding: 10px;
                border: 1px solid #ccc;
                text-align: left;
            }
            th {
                background-color: #eee;
            }
            a {
                color: #007BFF;
                text-decoration: none;
            }
            a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <h1>File Upload</h1>
        <form action="/post" method="post" enctype="multipart/form-data">
            <input type="file" name="file" />
            <button type="submit">Upload</button>
        </form>
        <table>
            <thead>
                <tr>
                    <th>File Name</th>
                    <th>Download</th>
                </tr>
            </thead>
            <tbody>
    `;

    if (!fs.existsSync(_uploadsDir)) {
        fs.mkdirSync(_uploadsDir, (err) => { });
    }

    fs.readdir(_uploadsDir, (err, files) => {
        if (err != null) {
            res.sendStatus(500);
            return;
        }
        if (files.length === 0) {
            out += `<tr><td colspan="2">No files</td></tr>`;
        } else {
            files.forEach(file => {
                let row = `<tr><td>${file}</td><td><a href="./uploads/${file}">Download</a></td></tr>`;
                out += row;
            });
        }
        out += `
            </tbody>
        </table>
    </body>
    </html>
        `;
        res.status(200).send(out);
    });
});

// Route to get a file
app.get('/uploads/:filename', (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join(_uploadsDir, fileName);

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
