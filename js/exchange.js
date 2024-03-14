(function($){
	$.Url = function(sn_code){
		var reg = new RegExp("(^|&)" + sn_code + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r != null){
			return unescape(r[2]);
		}else{
			return null;
		}
	}
})(jQuery);

var sn = $.Url("sn");

$(function(){
	StoreGetInfo();
});

function StoreGetInfo(){
	var request_get = $.ajax({
		url:'func.php',
		type:'POST',
		data:{func:'StoreGetInfo', sn:sn},
		dataType:'json'
	});
	request_get.done(function(data){
		if(data.OK == 0){
			if(data.status == 1){
				alert("兌換資料不完整, 無法進行兌換");
				window.location = "https://www.shiseido-event.com/2018maquillage/";
			}
			if(data.status == 2){
				alert("查無此人");
				window.location = "https://www.shiseido-event.com/2018maquillage/";
			}
			if(data.status == 3 || data.status == 5){
				alert("已兌換");
				window.location = "https://www.shiseido-event.com/2018maquillage/";
			}
			if(data.status == 4){	//過期
				window.location = "https://www.shiseido-event.com/2018maquillage/expired.html"
			}
		}
			if(data.OK == 1){
			$('.name').append(data.info.name);
			$('.phone').append(data.info.mobile);
			$('.mail').append(data.info.mobile);
			$('.shop').append(data.info.city + '&nbsp;&nbsp;' + data.info.store+'</br>');
		}
	});
}

$('.exper').click(function(){
	StoreSubmit();
});

$('.resend').click(function(){
	GEvent('重新申請');
	window.open('index.html','_self');
});

function StoreSubmit(){
	var request_store = $.ajax({
		url:'func.php',
		type:'POST',
		data:{func:'StoreSubmit', sn:sn},
		dataType:'json'
	});
	request_store.done(function(data){
		if(toNumber(data.OK) == 0){
			if(data.status == 1){
				alert("兌換資料不完整, 無法進行兌換");
				window.location = "https://www.shiseido-event.com/2018maquillage/";
			}
			if(data.status == 2){
				alert("查無此人");
				window.location = "https://www.shiseido-event.com/2018maquillage/";
			}
			if(data.status == 3 || data.status == 5){
				alert("已兌換過!");
				window.location = "https://www.shiseido-event.com/2018maquillage/";
			}
			if(data.status == 4){	//過期
				window.location = "https://www.shiseido-event.com/2018maquillage/expired.html"
			}
		}
		if(data.OK == 1){
			alert("兌換成功!");
			$('.exper').hide();
			$('.done').show();
			GEvent('兌換成功');
		}
	});
}


function toNumber(strNumber) {
   return +strNumber;
}

function GEvent(action) {   
	var tmpStr = action ;
	console.log(tmpStr);
	gtag('event', 'event_name', {
	   'event_label': action,
	   'event_action': action
	});
  }