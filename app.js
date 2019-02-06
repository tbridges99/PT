const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const https = require('https');
const fs = require('fs');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodoverride = require('method-override');
const crypto = require('crypto');

const mongoconnect = mongoose.createConnection(config.database, { useNewUrlParser: true});
mongoose.connect(config.database, { useNewUrlParser: true});
mongoose.connection.on('connected', function() {
	console.log('Connected to database' +config.database);
});

//On error
mongoose.connection.on('error', function(err) {
	console.log('Database error: ' +err);
});

//Init gridfs-stream
let gfs;

mongoconnect.once('open', () => {
    //Init stream
    gfs = Grid(mongoconnect.db, mongoose.mongo);
    gfs.collection('uploads');
});

// Create storage engine
var storage = new GridFsStorage({
  url: config.database,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

const app = express();

const users = require('./routes/users');

//Port Number
const port = 3000;

//CORS Middleware
app.use(cors());

//Set static folder
app.use(express.static(path.join(__dirname, 'client')))
//Body Parser Middleware
app.use(bodyParser.json())

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);

//Index Route
app.get('/', function(req, res) {
	res.send('Invalid Endpoint');
});

//upload
//uploads file to database
app.post('/upload', upload.single('file'), (req, res) => {
    res.json({file: req.file});
})

//getfiles
app.get('/files', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        if(!files || files.length == 0) {
            return res.status(404).json({
            err: 'No files exist'
            });
        }
        return res.json(files);
    });
});

app.get('/files/:filename', (req, res) => {
    gfs.files.findOne({filename: req.params.filename}, (err, file) => {
        if(!file || file.length == 0) {
            return res.status(404).json({
                err: 'No files exist'
            });
        }
        return res.json(file);
    });
});

//Create create https server and start it
https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
}, app)
.listen(port, function() {
	console.log('Server started on port' + port);
});
/*app.listen(port, () => {
  console.log('Server started on port '+port);
});*/
