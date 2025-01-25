//MODULES
// require('dotenv').config()
const fs = require('fs');
const express = require('express')
const app = express()
const http = require('http');
const server = http.createServer(app)
// const { ExpressPeerServer } = require('peer')


//VARIABLES
const port = process.env.PORT || 1350;
const path = require('path')
const cors = require('cors')
const multer = require('multer')


//-MULTER SETUPp
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        console.log(req.body)
        cb(null, req.body.name ? req.body.name : file.originalname)
    }
})

const upload = multer({ storage: storage }).single('file')

//-EXPRESS SETUP
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: false }))


//upload file route
app.post('/', (req, res) => {
    console.log(req.body)
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            res.status(400).send()
            log('File upload error occurred' + err)
        } else if (err) {
            // An unknown error occurred when uploading.
            res.status(400).send()
            log('File upload error occurred 2' + err)
        }

        // Everything went fine.
        log('File uploaded: ')
        log(req.file)
        res.status(200).json({ name: path.basename(req.file.path) })
    })
})

//get uploaded file route
app.get('/', (req, res) => {
    try {
        console.log(req.query, "query")
        if (!req.query.name)
            throw Error("File does not exist")

        //return any file
        console.log(req.query.name + ' requested')
        if (fs.existsSync(path.join(__dirname, 'uploads/' + req.query.name)))
            res.sendFile(path.join(__dirname, 'uploads/' + req.query.name))
        else {
            console.log('default image sent as image does not exist')
            res.sendFile(path.join(__dirname, 'uploads/defaultimage.jpeg'))
        }
    } catch (error) {
        res.status(400).json(error)
    }

})


//run server
server.listen(port, "0.0.0.0", () => {
    console.log(`Listening to port: ${port}...`)
})

//UTILITY FUNCTIONS

function log(msg) {
    console.log(msg)
}