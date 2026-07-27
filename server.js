const express = require('express');
const multer = require('multer');
const path = require('path');
const createFilesRouter = require('./routes/files');
const createStorage = require('./services/storage');
const createFilesPageRenderer = require('./views/filesPage');

const PORT = 2131;
const UPLOAD_FIELD_NAME = 'file';
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;
const UPLOADS_DIR_NAME = 'uploads';
const UPLOADS_DIR = path.join(__dirname, UPLOADS_DIR_NAME);
const INDEX_TEMPLATE_PATH = path.join(__dirname, 'views', 'index.html');

const app = express();
const upload = multer({
    limits: {
        fileSize: MAX_FILE_SIZE_BYTES,
    },
});
const storage = createStorage(UPLOADS_DIR);
const renderFilesPage = createFilesPageRenderer({
    templatePath: INDEX_TEMPLATE_PATH,
    uploadFieldName: UPLOAD_FIELD_NAME,
});


app.use(createFilesRouter({
    upload,
    uploadFieldName: UPLOAD_FIELD_NAME,
    storage,
    renderFilesPage,
}));

app.listen(PORT, function () {
    console.log('Server listening on port ' + PORT);
});
