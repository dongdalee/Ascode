var mongoose = require('mongoose');

// schema
var commentSchema = mongoose.Schema({
  post:{type:mongoose.Schema.Types.ObjectId, ref:'post', required:true}, // 댓글을 달 게시물
  author:{type:mongoose.Schema.Types.ObjectId, ref:'user', required:true}, // 댓글 작성자
  parentComment:{type:mongoose.Schema.Types.ObjectId, ref:'comment'}, //대댓글을 달경우 -> self referencing relationship을 형성하기 위해 사용
  text:{type:String, required:[true,'text is required!']},
  isDeleted:{type:Boolean}, //대댓글의 경우 상위 댓글이 삭제되었을때 해당 요소가 DB에서 완전이 지워지면 고아가 된다. 따라서 boolean값으로만 댓글 삭제여부 확인
  createdAt:{type:Date, default:Date.now},
  updatedAt:{type:Date},
},{
  toObject:{virtuals:true}
});

// DB상에서 대댓글의 부모정보만 저장하지만, 웹사이트에 사용할 때는 부모로부터 자식들을 찾아 내려가는 것이 더 편리하기 때문에 자식 댓글들의 정보를 가지는 항목을 추가
commentSchema.virtual('childComments')
  .get(function(){ return this._childComments; })
  .set(function(value){ this._childComments=value; });

// model & export
var Comment = mongoose.model('comment',commentSchema);
module.exports = Comment;
