var mongoose = require('mongoose');
var bcrypt = require('bcryptjs'); // 암호화를 위해 사용

// schema // 1
var userSchema = mongoose.Schema({
  username:{
    type:String,
    required:[true,'Username is required!'], //에러 메세지
    match:[/^.{4,12}$/,'Should be 4-12 characters!'], //4~12 사이의 문자열
    trim:true, //문자열 앞의 빈칸 제거
    unique:true
  },
  password:{
    type:String,
    required:[true,'Password is required!'],
    select:false // DB에서 해당 모델을 읽어 올때 해당 항목값을 읽어오지 않는다.
  },
  name:{
    type:String,
    required:[true,'Name is required!'],
    match:[/^.{4,12}$/,'Should be 4-12 characters!'],
    trim:true
  },
  email:{
    type:String,
    match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,'Should be a vaild email address!'], //8~16자리 문자열 중에 숫자랑 영문자가 반드시 하나 이상 존재
    trim:true
  }
},{
  toObject:{virtuals:true}
});

// virtuals // 2 // 회원가입, 회원 정보 수정 // DB에 필요없기 때문에 virtual 사용
userSchema.virtual('passwordConfirmation')
  .get(function(){ return this._passwordConfirmation; })
  .set(function(value){ this._passwordConfirmation=value; });

userSchema.virtual('originalPassword')
  .get(function(){ return this._originalPassword; })
  .set(function(value){ this._originalPassword=value; });

userSchema.virtual('currentPassword')
  .get(function(){ return this._currentPassword; })
  .set(function(value){ this._currentPassword=value; });

userSchema.virtual('newPassword')
  .get(function(){ return this._newPassword; })
  .set(function(value){ this._newPassword=value; });

// password validation // DB에 생성하기전에 값이 유효한지 확인
var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
var passwordRegexErrorMessage = 'Should be minimum 8 characters of alphabet and number combination!';
userSchema.path('password').validate(function(v) { 
  var user = this; // validation callback 함수 속에서 this는 user model -> 헷갈리지 않도록 user 변수 사용

  // create user // 3-3
  if(user.isNew){ // 해당 모델이 생성될경우 true, 아닐경우 false이다. 현재 password validation이 회원가입 단계인지 회원 정보 수정 단계인지 확인
    if(!user.passwordConfirmation){ // passwordConfirmation값이 있을경우
      user.invalidate('passwordConfirmation', 'Password Confirmation is required.'); //model.invalidate 함수 첫번째 인자는 항목이름, 두번째 인자는 에러메세지
    }

    if(!passwordRegex.test(user.password)){ // 문자열에 정규표현식을 통과하는 부분이 있다면 true
      user.invalidate('password', passwordRegexErrorMessage); // false가 반환되는 경우 model.invalidate 함수 실행
    }
    else if(user.password !== user.passwordConfirmation) { //password값이 passwordConfirmation값과 다른 경우 invalidate 처리
      user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
    }
  }

  // update user //
  if(!user.isNew){
    if(!user.currentPassword){ //current password값이 없는 경우
      user.invalidate('currentPassword', 'Current Password is required!');
    }
    //bcrypt.compareSync 함수를 사용하여 저장된 hash와 입력받은 password의 hash가 일치하는지 확인
    //user.currentPassword:입력받은 text값 | user.originalPassword: user의 password의 hash값
    else if(!bcrypt.compareSync(user.currentPassword, user.originalPassword)){ //current password값이 original password값과 다른경우
      user.invalidate('currentPassword', 'Current Password is invalid!');
    }

    if(user.newPassword && !passwordRegex.test(user.newPassword)){
      user.invalidate("newPassword", passwordRegexErrorMessage);
    }
    else if(user.newPassword !== user.passwordConfirmation) { //new password값과 password confirmation값과 다른 경우
      user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
    }
  }
});

// hash password 첫번째 파라미터로 설정된 event가 일어나기 전에 먼저 callback 함수를 실행시킨다.
// save event: model.create, model.save 함수 실행시 발생하는 이벤트 -> user를 생성하거나 user를 수정한뒤 save함수를 실행할때
userSchema.pre('save', function (next){
  var user = this;
  // isModified: 함수에 해당 값이 db에 기록된 값과 비교해서 변경된 경우 true
  // user.password의 변경이 없는경우 이미 해당 위치에 hash가 저자오디어 있으므로 다시 hash를 만들지 않는다.
  if(!user.isModified('password')){ 
    return next();
  }
  else {
    user.password = bcrypt.hashSync(user.password); //user 수정시 user.password의 변경이 있는경우 bcrypt.hashSync함수로 password를 hash값으로 바꿔준다.
    return next();
  }
});

// model methods // user model의 password hash와 입력받은 password text를 비교
userSchema.methods.authenticate = function (password) {
  var user = this;
  return bcrypt.compareSync(password,user.password);
};

// model & export
var User = mongoose.model('user',userSchema);
module.exports = User;
