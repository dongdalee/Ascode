var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http');
const ipfsAPI = require('ipfs-api');  
var fs = require('fs');
var mongoose = require('mongoose');
var path =require('path');
var util = require('util');
var os = require('os');
const { dirname } = require('path');


var multer = require('multer')
var upload = multer({dest: 'uploads/'})

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('views', './views');
app.set('view engine', 'jade');

require('./controller.js')(app);
//var connection= mongoose.connect('mongodb+srv://testuser:yhw1408@cluster0.ywkaq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
var connection= mongoose.connect('mongodb+srv://admin:0000@jungjae.ypk4w.mongodb.net/test', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB connected...'))
.catch(error => console.log(error))
app.use("/",express.static(path.join(__dirname, '../client')));

var port = process.env.PORT || 8000;

const ipfs = ipfsAPI('127.0.0.1', '5001', {protocol: 'http'})

app.get('/upload', function(req, res){
    res.render('upload')
});

app.post('/upload/upload', upload.single('userfile'), function(req, res){
    console.log(req.file)
    //read file
    let testFile = fs.readFileSync('./uploads/'+req.file.filename, 'utf8')
    
    //input buffer
    let testBuffer = Buffer.from(testFile); //new Buffer -> Buffer.from

    //upload file to ipfs
    ipfs.files.add(testBuffer, (err,file)=>{
        if(err) {
            console.log(err);
        }
        console.log(file)
        console.log("payload:"+file[0].hash)
        res.send(`IPFS Hash: ${file[0].hash}`)
    })
});

app.get('/download', function(req, res){
    res.render('download')
})

app.post('/download', function(req, res){
    ipfs_hash = req.body.hash
    
    let downloadFile;

    ipfs.files.get(ipfs_hash, (err,files)=>{
        files.forEach((file) =>{
        console.log(file.path);
        console.log(file.content.toString('utf8'))
        downloadFile = file.content.toString('utf8')

        //download file save
        fs.writeFileSync('downloads/'+ipfs_hash, downloadFile, 'utf8', (err)=>{
            if(err) {
                console.log(err);
            }       
            console.log('write end');
        })
        res.redirect(`download/${ipfs_hash}`)
        })
    })       
})

app.get('/download/:ipfs_hash', (req, res, next) => {
    __dirname="./downloads"
    fileName = req.params.ipfs_hash
    const file = `${__dirname}/${fileName}`;
    res.download(file); // Set disposition and send it.
})

app.listen(port,function(){
    console.log("Live in port: " + port);
});


