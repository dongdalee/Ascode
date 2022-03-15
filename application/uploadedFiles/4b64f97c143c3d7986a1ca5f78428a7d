var express = require('express');
var router = express.Router();
var User = require('../models/User');
var util = require('../util');
//var sdk = require('../sdk')
var sdk = require('../sdk/sdk')
//var obj = JSON.parse(json);

// New
router.get('/new', function(req, res){
  var user = req.flash('user')[0] || {}; // create route에서 생성된 flash로부터 값을 받아온다. 값이 없을경우 {}사용해서 빈 오브젝트를 넣어 user/new 페이지 생성
  var errors = req.flash('errors')[0] || {};
  res.render('users/new', { user:user, errors:errors });
});

// create
router.post('/', function(req, res){
  User.create(req.body, function(err, user){
    if(err){ //user생성시에 오류가 있다면 user, error flash를 만들고 new 페이지로 redirect한다
      req.flash('user', req.body);
      req.flash('errors', util.parseError(err)); // error type: userSchema에 설정해둔 validation을 통과하지 못한경우, mongoDB에서 오류가 발생한 경우
      return res.redirect('/users/new');
    }

    var user_ID = req.body.username
    args= [user_ID]

    sdk.send(true, 'setWallet', args)

    res.redirect('/');
  });
});


// show
router.get('/:username', util.isLoggedin, checkPermission, function(req, res){
  //console.log(req.user._id)
  User.findOne({username:req.params.username}, async function(err, user){
    if(err) return res.json(err);
    args=[req.params.username.toString()]

    result = await sdk.send(false, 'getWallet', args)
    result = JSON.parse(result)

    var coin = result["coin"]

    res.render('users/show', {user:user, coin:coin});
  });
});

// edit
router.get('/:username/edit', util.isLoggedin, checkPermission, function(req, res){
  var user = req.flash('user')[0]; //처음 접속할때 DB에서 값을 가져와 form에 기본 값 생성, update에서 오류가 발생할 경우 기존에 입력했던 값으로 form 값으로 생성 따라서 {} 사용안함
  var errors = req.flash('errors')[0] || {};
  if(!user){
    User.findOne({username:req.params.username}, function(err, user){
      if(err) return res.json(err);
      res.render('users/edit', { username:req.params.username, user:user, errors:errors }); //user flash에서 값을 받을 경우 username이 달라질수 있기때문에 주소에서 값을 가져온다
    });
  }
  else {
    res.render('users/edit', { username:req.params.username, user:user, errors:errors });
  }
});

// update
router.put('/:username', util.isLoggedin, checkPermission, function(req, res, next){
  User.findOne({username:req.params.username}) // findOne함수로 값을 찾은 후 값을 수정후 user.save -> 단순히 값을 바꾸는 것이 아니라 user.passwor 조건을 맞춰야하기 때문
    .select('password')
    .exec(function(err, user){
      if(err) return res.json(err);

      // update user object
      user.originalPassword = user.password;
      user.password = req.body.newPassword? req.body.newPassword : user.password; //user의 update는 password를 업데이트 하는 경우와 password를 업데이트 하지 않는 겨우로 나눌수 있다.
      for(var p in req.body){ //user는 DB에서 읽어온 data, req.body는 form에서 입력된 값, form에서 입력된 값을 덮어 쓴다.
        user[p] = req.body[p];
      }

      // save updated user
      user.save(function(err, user){
        if(err){
          req.flash('user', req.body);
          req.flash('errors', util.parseError(err));
          return res.redirect('/users/'+req.params.username+'/edit');
        }
        res.redirect('/users/'+user.username);
      });
  });
});

//check my IPFS hash
router.get('/myIPFS', util.isLoggedin, checkPermission, function(req, res) {
  
})

module.exports = router;

// private functions
function checkPermission(req, res, next){
  User.findOne({username:req.params.username}, function(err, user){
    if(err) return res.json(err);
    if(user.id != req.user.id) return util.noPermission(req, res);

    next();
  });
}
