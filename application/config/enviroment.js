//환경 설정 모듈

console.log("call : /config/environment.js");

module.exports = {
  PORT: 3000, //포트번호
  //DATABASE: "mongodb://localhost:27017/test", //Database 주소
  DATABASE: "mongodb+srv://admin:0000@jungjae.ypk4w.mongodb.net/Ascode", //Database 주소
  //DATABASE: "mongodb://admin:0000@jungjae.ypk4w.mongodb.net/Ascode", //Database 주소
  MONGO_SESSION_COLLECTION_NAME: "sessions",
  SESSION_SECRET: "your_secret", //세션 암호화에 사용할 값
};
