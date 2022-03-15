var express  = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require("fs");
var upload = multer({ dest: 'userFiles/' });
var User = require('../models/User');
var File = require('../models/File');
var util = require('../util');
var ipfsAPI = require('ipfs-api');
var sdk = require('../sdk/sdk')

const ipfs = ipfsAPI('127.0.0.1', '5001', {protocol: 'http'})

router.get('/', util.isLoggedin, function(req, res){
    res.render('ipfs/show', {req_ipfs_hash:"", code_alias:"", uploader_ID:"", res_ipfs_hash:""});
});

router.post('/upload_file', upload.single('user_file'), async function(req, res){
    console.log('make ipfs called!')
    console.log(req.user.username)

   
    try{
        //var user_file = fs.readFileSync('./userFiles/'+req.file.filename, 'utf8')
        fs.readFileSync('./userFiles/'+req.file.filename, 'utf8')
        //console.log(user_file)
    }catch(error){
        console.log(error)
    }

    //ipfs importing
    
    var user_file = fs.readFileSync('./userFiles/'+req.file.filename, 'utf8')
    var file_buffer = Buffer.from(user_file); //new Buffer -> Buffer.from

    //upload file to ipfs
    ipfs.files.add(file_buffer, (err,file)=>{
        if(err) {
            console.log(err);
        }  
        
        var alias = req.body.file_alias
        var uploader_ID = req.user.username.toString()
        var ipfs_hash = file[0].hash.toString()
        var args = [alias, uploader_ID, ipfs_hash]

        sdk.send(true, 'setCode', args)

        //res.redirect('/posts'+res.locals.getPostQueryString(false, { page:1, searchText:'' }));
        var post = req.flash('post')[0] || {};
        var errors = req.flash('errors')[0] || {};

        console.log(post)
        console.log(ipfs_hash)

        res.send(ipfs_hash)
    })
});

/*
router.post("/download", async function(req, res){
    var ipfs_hash = req.body.hash
    args = [ipfs_hash]

    var result = await sdk.send(false, 'getCode', args)
    console.log(result)

    result = JSON.parse(result)
    
    var alias = result["alias"]
    var uploader = result["uploader"]
    var hash = result["hash"]
    
   //res.render('ipfs/show', {req_ipfs_hash:" ", code_alias:alias, uploader_ID:uploader, res_ipfs_hash:hash});
    res.render('ipfs/show', {req_ipfs_hash:"", code_alias:"", uploader_ID:"", res_ipfs_hash:""});
})
*/

router.post("/download", function(req, res){
    var ipfs_hash = req.body.hash

    var file_name
    var downloadFile;

    ipfs.files.get(ipfs_hash, (err,files)=>{
        files.forEach((file) =>{
        console.log(file.path);
        file_name= file.path.toString()

        //console.log(file.content.toString('utf8'))
        downloadFile = file.content.toString('utf8')

        //download file save
            fs.writeFileSync("userFiles/"+file_name, downloadFile, 'utf8', (err)=>{
                if(err) {
                    console.log(err);
                }       
                console.log('write end');
            });
            res.redirect(`/ipfs/download/${file_name}`)
        });
    }); 

})

router.get('/download/:ipfs_hash', (req, res, next) => {
    __dirname="./userFiles"
    fileName = req.params.ipfs_hash
    const file = `${__dirname}/${fileName}`;
    res.download(file); // Set disposition and send it.
})

router.get('/search_show', (req, res) => {

    var no_data = {"alias":[], "uploader":[], "hash":[]}

    res.render('ipfs/searchIPFS',{ipfs_data:no_data});
})

router.post('/search_code', async (req, res) => {
    console.log(req.body.search_keyword)

    var ipfs_data_array = []

    var keyword = req.body.search_keyword

    if (typeof keyword == "undefined"){
        keyword = "nodata"
    }

    var args = [keyword]

    result = await sdk.send(false, 'getCode', args)

    if (typeof result == "undefined"){

        var no_data = {"alias":[], "uploader":[], "hash":[]}

        res.render('ipfs/searchIPFS', {ipfs_data:no_data});
    } else {
        result = result.split('/')
        result.pop()

        for (var ipfs_info of result) {
            ipfs_info = JSON.parse(ipfs_info)
            ipfs_data_array.push(ipfs_info)
        }

        //console.log(ipfs_data_array)

        res.render('ipfs/searchIPFS', {ipfs_data:ipfs_data_array});
    }
})

router.post('/add_token', async(req, res) => {
    var user = req.body.user;
    var token = req.body.token;

    args = [user, token]

    result = await sdk.send(true, 'setToken', args)
    console.log(result) 
    res.redirect('/')
})


router.get('/test', (req, res)=>{
    res.render('test/index')
})

module.exports = router;