# Simple Bucket backend to store sent files.

### Install:
`npm i`

### Run:
`npm start`

### Use:
`curl -X POST -F file=@sometext.txt "127.0.0.1:2131"`

When you run it locally

### Collision resolution:
It can override file if there is one more pushed with the same name
