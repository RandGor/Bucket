# Simple Bucket backend to store sent files.

### Install:
`npm i`

### Run:
`npm start`

### Use web interface:
Use / page to list or upload files

### Use CURL:
`curl -X POST -F file=@"filepath.txt" "127.0.0.1:2131/post"`

When you run it locally

### Obtain the specifig file:
Use /uploads/$FILENAME to get specific file

### Collision resolution:
It can override file if there is one more pushed with the same name