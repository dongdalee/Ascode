var util = {};

// 에러가 발생했을때 에러를 분석하고 일정한 형식으로 만든다
// mongoose와 mongoDB에서 내는 에러의 형태가 다르기 때문에 에러의 형태를 {항목이름: { message: "error message"}}로 통일시킨다.
util.parseError = function(errors){
  var parsed = {};
  if(errors.name == 'ValidationError'){
    for(var name in errors.errors){
      var validationError = errors.errors[name];
      parsed[name] = { message:validationError.message };
    }
  }
  else if(errors.code == '11000' && errors.errmsg.indexOf('username') > 0) {
    parsed.username = { message:'This username already exists!' };
  }
  else {
    parsed.unhandled = JSON.stringify(errors);
  }
  return parsed;
}

// 사용자의 로그인 여부를 확인 후, 로그인 되지 않을경우 에러 메시지와 로그인 페이지로 redirect
util.isLoggedin = function(req, res, next){
  if(req.isAuthenticated()){
    next();
  }
  else {
    req.flash('errors', {login:'Please login first'});
    res.redirect('/login');
  }
}

//route에 접근 권한이 없을 경우 로그인 페이지로 redirect
util.noPermission = function(req, res){
  req.flash('errors', {login:"You don't have permission"});
  req.logout();
  res.redirect('/login');
}

// req.locals에 getPostQueryString 함수를 추가하는 middleware
// req.query로 전달 받은 query에서 page, limit를 추출하여 다시 한줄의 문자열로 만들어 반환한다.
util.getPostQueryString = function(req, res, next){
  res.locals.getPostQueryString = function(isAppended=false, overwrites={}){
    var queryString = '';
    var queryArray = [];
    var page = overwrites.page?overwrites.page:(req.query.page?req.query.page:'');
    var limit = overwrites.limit?overwrites.limit:(req.query.limit?req.query.limit:'');
    var searchType = overwrites.searchType?overwrites.searchType:(req.query.searchType?req.query.searchType:'');
    var searchText = overwrites.searchText?overwrites.searchText:(req.query.searchText?req.query.searchText:'');

    if(page) queryArray.push('page='+page);
    if(limit) queryArray.push('limit='+limit);
    if(searchType) queryArray.push('searchType='+searchType);
    if(searchText) queryArray.push('searchText='+searchText);

    // 생성할 query string이 기존 query string에 추가되는 appended query인지 아닌지를 boolean으로 받는다.
    // 추가되는 query라면 &시작하고 아니면 ?로 시작한다.
    if(queryArray.length>0) queryString = (isAppended?'&':'?') + queryArray.join('&');

    return queryString;
  }
  next();
}

util.convertToTrees = function(array, idFieldName, parentIdFieldName, childrenFieldName){
  var cloned = array.slice();

  for(var i=cloned.length-1; i>-1; i--){
    var parentId = cloned[i][parentIdFieldName];

    if(parentId){
      var filtered = array.filter(function(elem){
        return elem[idFieldName].toString() == parentId.toString();
      });

      if(filtered.length){
        var parent = filtered[0];

        if(parent[childrenFieldName]){
          parent[childrenFieldName].unshift(cloned[i]);
        }
        else {
          parent[childrenFieldName] = [cloned[i]];
        }

      }
      cloned.splice(i,1);
    }
  }

  return cloned;
}

util.bytesToSize = function(bytes) {
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes == 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

module.exports = util;
