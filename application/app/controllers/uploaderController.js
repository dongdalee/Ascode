console.log("call : /controllers/uploaderController.js")
const fs = require("fs");

//var port = process.env.PORT || 8000;

//const ipfs = ipfsAPI('127.0.0.1', '5001', {protocol: 'http'})


module.exports.upload = async(req, res) => {
    console.log("upload 함수 호출");
    res.render("code/upload", {pageTitle: "업로드"});
}

module.exports.upload_ipfs = async(req, res) => {
    console.log(req.user_file)
    // let user_file = fs.readFileSync('./uploads/'+req.user_file.filename, 'utf8')
    // console.log(user_file)
    res.redirect("/")
}

/*
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
*/