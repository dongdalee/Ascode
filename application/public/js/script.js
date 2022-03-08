//client의 브라우저에서 사용하는 js 코드
//head.ejs 에서 script.js를 불러온다
$(function(){
  function get2digits (num){
    return ('0' + num).slice(-2);
  }

  function getDate(dateObj){
    if(dateObj instanceof Date)
      return dateObj.getFullYear() + '-' + get2digits(dateObj.getMonth()+1)+ '-' + get2digits(dateObj.getDate());
  }

  function getTime(dateObj){
    if(dateObj instanceof Date)
      return get2digits(dateObj.getHours()) + ':' + get2digits(dateObj.getMinutes())+ ':' + get2digits(dateObj.getSeconds());
  }

  //html element중 "data-data"를 탐색하여 data-data에 날짜가 있을경우 해당 데이터를 년-월-일 형태로 변환해서 element의 텍스트에 넣는다.
  function convertDate(){
    $('[data-date]').each(function(index,element){
      //console.log(element)
      var dateString = $(element).data('date');
      if(dateString){
        var date = new Date(dateString);
        $(element).html(getDate(date));
      }
    });
  }

  function convertDateTime(){
    $('[data-date-time]').each(function(index,element){
      var dateString = $(element).data('date-time');
      if(dateString){
        var date = new Date(dateString);
        $(element).html(getDate(date)+' '+getTime(date));
      }
    });
  }

  convertDate();
  convertDateTime();
});

$(function(){
  var search = window.location.search;
  var params = {};

  if(search){
    $.each(search.slice(1).split('&'),function(index,param){
      var index = param.indexOf('=');
      if(index>0){
        var key = param.slice(0,index);
        var value = param.slice(index+1);

        if(!params[key]) params[key] = value;
      }
    });
  }

  if(params.searchText && params.searchText.length>=3){
    $('[data-search-highlight]').each(function(index,element){
      var $element = $(element);
      var searchHighlight = $element.data('search-highlight');
      var index = params.searchType.indexOf(searchHighlight);

      if(index>=0){
        var decodedSearchText = params.searchText.replace(/\+/g, ' ');
        decodedSearchText = decodeURI(decodedSearchText);

        var regex = new RegExp(`(${decodedSearchText})`,'ig');
        $element.html($element.html().replace(regex,'<span class="highlighted">$1</span>'));
      }
    });
  }
});

$(function(){
  function resetTitleEllipsisWidth(){
    $('.board-table .title-text').each(function(i,e){
      var $text = $(e);
      var $ellipsis = $(e).closest('.title-ellipsis');
      var $comment = $(e).closest('.title-container').find('.title-comments');

      if($comment.length == 0) return;

      var textWidth = $text.width();
      var ellipsisWidth = $ellipsis.outerWidth();
      var commentWidth = $comment.outerWidth();
      var padding = 1;

      if(ellipsisWidth <= (textWidth+commentWidth+padding)){
        $ellipsis.width(ellipsisWidth-(commentWidth+padding));
      }
      else {
        $ellipsis.width(textWidth+padding);
      }
    });
  }
  $(window).resize(function(){
    $('.board-table .title-ellipsis').css('width','');
    resetTitleEllipsisWidth();
  });
  resetTitleEllipsisWidth();
});
