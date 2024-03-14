$(function(){
   c_no=getUrlParam('c_no');
   s_no=getUrlParam('s_no');
   t_no=getUrlParam('t_no');
   t_sn_no=getUrlParam('t_sn_no');
   token=getUrlParam('token');

   var request_sent = $.ajax({
      url:'func.php',
      type:'POST',
      data:{func:'getTotalTester', c_no:c_no, s_no:s_no, t_no:t_no, t_sn_no:t_sn_no, token:token},
      dataType:'json'
   });
   request_sent.done(function(data){
      var re_ok = parseInt(data.OK,10);
      var re_status = parseInt(data.status,10);
console.log(re_ok);
      if (re_ok===1) {
         $('div.main div.num').empty().append('NO.'+data.total);
      } else {
         alert('查無此人!');
         window.location.href="index.html";
      }
   });
});

$(document).ready(function(){
    getSize();
    updateRWDImg();

    $(window).on('resize', function() {
		getSize();
        updateRWDImg();
    });
})

function updateRWDImg() {

	$('img').each(function($index) {
		var arrImg=$(this).attr('src').replace('-dt.','.').split('.');
		if ($(this).attr('md')==1) {
			$(this).attr('src',arrImg[0]+'-dt.'+arrImg[1]);
			if (isMobile) {	//部份圖片在手機上須更換圖 (只要在 img 中加入 md="1")
				$(this).attr('src',arrImg[0]+'.'+arrImg[1]);
			} else {
				$(this).attr('src',arrImg[0]+'-dt.'+arrImg[1]);
			}
		}
		if ($(this).attr('md')==0) {
			if (isMobile) {	//部份圖片在手機上須hidden (只要在 img 中加入 md="0")
				$(this).hide();
			} else {
				$(this).show();
			}
		}
	});
}

function getSize() {
    windowWidth = $(window).width();
    windowHeight = $(window).height();
    documentHeight = $(document).height();
    isMobile = (windowWidth < 783) ? true : false;
}


function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r !== null) return unescape(r[2]);
    return null; //返回参数值
}

function GEvent(action) {   
    var tmpStr = action ;
    console.log(tmpStr);
    gtag('event', 'event_name', {
       'event_label': action,
       'event_action': action
    });
  }
