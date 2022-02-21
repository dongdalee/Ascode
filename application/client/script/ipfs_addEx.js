const ipfsAPI = require('ipfs-api');                                                                             
const fs = require('fs');

//ipfs importing
const ipfs = ipfsAPI('127.0.0.1', '5001', {protocol: 'http'})

function uploadFile(file){
    let testFile = fs.readFileSync(file, 'utf8')

    //input buffer
    let testBuffer = Buffer.from(testFile); //new Buffer -> Buffer.from

    //upload file to ipfs
    ipfs.files.add(testBuffer, (err,file)=>{
        if(err) {
            console.log(err);
        }   
        console.log(file)
    })
}

