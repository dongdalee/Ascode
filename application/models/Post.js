var mongoose = require('mongoose');
var Counter = require('./Counter');

// schema
var postSchema = mongoose.Schema({
  title:{type:String, required:[true,'Title is required!']}, //Title
  categories:{type:String, required:[true,'Categories is required!']}, //Categories
  submission:{type:String, required:[true,'First Submission is required!']}, //First Submission
  url:{type:String, required:[true,'Final Url is required!']}, //Final Url
  hash:{type:String}, //IPFS hash
  assessment:{type:String, required:[true,'assessment is required!']}, // Risk Assessment

  body:{type:String, required:[true,'Body is required!']},

  // ref:'user': 데이터가 user collection의 id와 연결됨을 mongoose에 알린다.
  author:{type:mongoose.Schema.Types.ObjectId, ref:'user', required:true},
  views:{type:Number, default:0},
  numId:{type:Number},
  attachment:{type:mongoose.Schema.Types.ObjectId, ref:'file'},
  createdAt:{type:Date, default:Date.now}, //기본값 지정, Date.now 현재시간 return
  updatedAt:{type:Date},
});

postSchema.pre('save', async function (next){
  var post = this;
  if(post.isNew){
    counter = await Counter.findOne({name:'posts'}).exec();
    if(!counter) counter = await Counter.create({name:'posts'});
    counter.count++;
    counter.save();
    post.numId = counter.count;
  }
  return next();
});

// model & export
var Post = mongoose.model('post', postSchema);
module.exports = Post;
