//console.log("call : /models/User.js");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//암호화 모듈 참조
const crypto = require("crypto");

// ====== UserSchema 설정(4) ========//
const UserSchema = new Schema(
  {
    email: { type: String, default: "" },
    hashed_password: { type: String, default: "" },
    salt: { type: String, default: "" },
  },
  {
    timestamp: true,
  }
);
// ======== email Validation(5) =======//
// path() 메서드는 필드 값을 확인하는데 사용되는 메서드로, 확인하고자 하는 필드값을 전달하면됨
// path() 메서드로 필드값을 확인한 후, validate() 메서드를 호출하면 그 값이 유효한지를 체크함
UserSchema.path("email").validate(async (email) => {
  const User = mongoose.model("User");
  //등록된 email 객체(documents) 수를 반환
  const userCount = await User.countDocuments({ email: email }).exec();
  return userCount === 0;
}, "이미 존재하는 이메일주소입니다.");
UserSchema.path("email").validate((email) => {
  return email.length;
}, "이메일은 빈칸일 수 없습니다.");
UserSchema.path("hashed_password").validate((hashed_password) => {
  return hashed_password.length;
}, "비밀번호는 빈칸일 수 없습니다.");

//============= 비밀번호 대조메소드, 난수발생메소드, 암호화저장 메소드 선언(6) ======//
UserSchema.methods = {
  /** authenticate 메소드 - 유저로부터 비밀번호를 받아 대조 */
  authenticate: function (plainText) {
    const tempEncy = this.encryptPassword(plainText);
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  /** makeSalt 메소드 - 비밀번호 암호화를 위한 난수를 만듭니다. **/
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },

  /** 만들어진 난수와 입력받은 비밀번호를 통해 공개키 암호화를 한 후 저장합니다. **/
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

/* ==== Virtual 필드를 통해 패스워드를 저장하면 자동으로
        salt와 hashed_password로  변환하여 저장(7) ======//*/
UserSchema.virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

//모델 생성
mongoose.model("User", UserSchema);
