$(function() {
  CityStoreListByEvent();
});

var guilty_scroll;
var winH = $(window).height();

$(window).load(function(){
  $('body').fadeIn(400,function(){
    AOS.init({
        duration: 500,
        easing: 'ease-in',
    });
    guilty_scroll = $('.guilty .title').offset().top - winH/3*1;
  });
  
})

$(document).ready(function(){
    
    getSize();
    updateRWDImg();

    
        
        //console.log(guilty_scroll);

    $(window).scroll(function(){
        var Wscroll = $(window).scrollTop();

        if(Wscroll > 100){
            $('.menu').addClass('scroll');
        }else{
            $('.menu').removeClass('scroll');
        }

        if(Wscroll > guilty_scroll){
            $('.s1').addClass('active');
            $('.s2').addClass('active');
            /*
            $('.g2 .s1').addClass('active');
            $('.g2 .s2').fadeIn(500);
            $('.g3 .s1').addClass('active');
            $('.g3 .s2').fadeIn(500);*/
        }
    });

    $(window).on('resize', function() {
		getSize();
        updateRWDImg();

    });

    $('.guilty_slider').slick({
        arrows: true,
        dots: false,
        infinite: true,
        nextArrow: '<i class="icon-right-open-big next"></i>',
        prevArrow: '<i class="icon-left-open-big prev"></i>',
    });

    $('.guilty_s2_slider').slick({
        arrows: true,
        dots: false,
        infinite: true,
        nextArrow: '<i class="icon-right-open-big next"></i>',
        prevArrow: '<i class="icon-left-open-big prev"></i>',
    });

    $('.btn').click(function(){
        $('.guilty_slider').addClass('active');
        $('.guilty_s2_slider').addClass('active');
        $('.s2_close').addClass('active');
        GEvent('手機版_探索證據');
    });

    $('.s2_close').click(function(){
        $('.guilty_slider').removeClass('active');
        $('.guilty_s2_slider').removeClass('active');
        $('.s2_close').removeClass('active');
    });

    $('.g_btn').mouseover(function(){
        n = $(this).attr('data');
        $('.show img').attr('src','img/guilty_dt_s3-'+n+'.png');
        $('.show').addClass('active');
        GEvent('桌機版_探索證據'+n);
    });

    $('.logo').click(function(){
      $('body,html').stop().animate({
        scrollTop: 0
      }, 1000, 'swing');
      GEvent('logo');
    });

    $('.ham').click(function(){
        $('.menu .inner').slideDown(500);
    });
    $('.menu_close').click(function(){
        $('.menu .inner').slideUp(500);
    });

    $('.menu .inner li').click(function(){
        toNav = $(this).attr('data');
        GEvent('menu_'+toNav);
        if(isMobile){
            $('.menu .inner').slideUp(500);
            $('html,body').animate({
                scrollTop: $('.'+toNav).offset().top
            }, 1000, 'swing');
        }else{
            $('html,body').animate({
                scrollTop: $('.'+toNav).offset().top -80
            }, 1000, 'swing');
        }


    });

    $('.show').mouseout(function(){
        $(this).removeClass('active');
        $('.show img').attr('src','');
    });

    $('.pre,.next').click(function(){
        n = $(this).attr('data');
        $(this).parents('.group').removeClass('active');
        $('.group[data="'+n+'"]').addClass('active');
        GEvent('prod_'+n);
    });
})

function CityStoreListByEvent() {
  var request_list = $.ajax({
    url: 'func.php',
    type: 'POST',
    data: {
      func: 'CityStoreListByEvent'
    },
    dataType: 'json'
  });
  request_list.done(function(data) {
    if (data.OK == 1) {
      for (var i = 0; i < data.cityRows.length; i++) {
        $('#city').append('<option value="' + data.cityRows[i].c_no + '">' + data.cityRows[i].c_name + '</option>');
      }
      for (var j = 0; j < data.storeRows.length; j++) {
        $('#shop').append('<option value="' + data.storeRows[j].s_no + '" class="' + data.storeRows[j].c_no + '" text="' + data.storeRows[j].s_name.replace(/br/ig, "<br />") + '">' + data.storeRows[j].s_name.replace(/br/ig, "") + '</option>');
      }

      $('div.form .form_btn').click(function() {
        checkData();
      });
      $('#shop').chained('#city');
    }

    //參加登記人數
    $('div.top div.count > span').empty().append(formatCurrency(data.total));
  });
}

function checkData() {
   if ($('div.form .form_btn').hasClass('disabled')) {
     alert('您的資料己送出, 請勿重覆點擊, 造成資料重覆!');
  } else {
     var check_format = 1;
     var alertMsg = "";
     t_name = $.trim($('#name').val());
     t_mobile = $.trim($('#phone').val());
     t_email = $.trim($('#email').val());
     c_no = $.trim($('#city').val());
     s_no = $.trim($('#shop').val());

     if (t_name.length == 0) {
       alertMsg = checkAlertMsg(alertMsg);
       alertMsg = alertMsg + "- 姓名";
       check_format = 0;
     } else {
       if (!ValidateName(t_name)) {
         if (t_name.length < 2) {
           alertMsg = checkAlertMsg(alertMsg);
           alertMsg = alertMsg + "- 姓名長度不符合";
           check_format = 0;
         }
         if (!isNaN(t_name)) {
           alertMsg = checkAlertMsg(alertMsg);
           alertMsg = alertMsg + "- 姓名不可含數字";
           check_format = 0;
         }
       }
     }

     var prefix_mobile = t_mobile.substr(0, 2);
     var mobile_format = /^[0-9]{2,3}\-[0-9]{5,8}$/;
     var email_format = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;

     if (t_mobile.length == 0) {
       alertMsg = checkAlertMsg(alertMsg);
       alertMsg = alertMsg + "- 手機";
       check_format = 0;
     } else {
       if (prefix_mobile != '09' || t_mobile.length != 10 || mobile_format.test(t_mobile)) {
         alertMsg = checkAlertMsg(alertMsg);
         alertMsg = alertMsg + "- 手機號碼有誤";
         check_format = 0;
       }
     }

     if (t_email.length == 0) {
       alertMsg = checkAlertMsg(alertMsg);
       alertMsg = alertMsg + "- 電子郵件";
       check_format = 0;
     } else {
       if (t_email.length <= 2 || !email_format.test(t_email)) {
         alertMsg = checkAlertMsg(alertMsg);
         alertMsg = alertMsg + "- 電子郵件有誤";
         check_format = 0;
       }
     }

     if (c_no == '' || s_no == '') {
       alertMsg = checkAlertMsg(alertMsg);
       alertMsg = alertMsg + "- 領取櫃點";
       check_format = 0;
     }

     if (!$('.agree input').is(":checked")) {
       alertMsg = checkAlertMsg(alertMsg);
       alertMsg = alertMsg + "- 請同意條款與注意事項";
       check_format = 0;
     }

     if (check_format == 1) { //不用再次確認
        $('div.form .form_btn').addClass('disabled');
        SubmitForm();
     } else {
       alert('請確認以下欄位:\r\n\r\n' + alertMsg + '\r\n\r\n');
       return false;
     }
  }
}

function SubmitForm() {
  var request_sub = $.ajax({
    url: 'func.php',
    type: 'POST',
    data: {
      func: 'SubmitForm',
      c_no: c_no,
      s_no: s_no,
      t_name: t_name,
      t_mobile: t_mobile,
      t_email: t_email
    },
    dataType: 'json'
  });
  request_sub.done(function(data) {
    var re_ok = parseInt(data.OK, 10);

    if (re_ok == 0) {
      if (data.status == 1) {
        alert("您的資料中有欄位未填, 請檢查您所填寫的資料!");
      }

      if (data.status == 2) {
        alert("您的資料中有欄位格式不符, 請檢查您所填寫的資料!");
      }

      if (data.status == 3) {
        alert("您的資料中所選擇的櫃點與所在縣市不符, 請檢查您所填寫的資料!");
      }

      if (data.status == 4) {
        alert("您的資料中所選擇的櫃點領取名額己額滿, 請選擇其他領取櫃點!");
      }

      if (data.status == 5) {
        alert("您的手機己參加兌換活動, 且仍在可兌換贈品的時間內, 所以無法重複申請!");
      }

      if (data.status == 6) {
        alert("您己完成己兌換, 所以無法重複申請!");
      }

      if (data.status == 7) { //Blocked Mobile
        alert("您己完成己兌換, 所以無法重複申請!");
      }

      if (data.status == 8) { //Email duplicate
        alert("您的Email己參加兌換活動, 且仍在可兌換贈品的時間內, 所以無法重複申請!");
      }

      if (data.status == 9) {
        alert("不明錯誤發生, 請重整網頁重新申請!");
      }
    }
    if (re_ok == 1) {
      t_no = data.t_no;
      t_sn_no = data.t_sn_no;
      token = data.token;
      GEvent('表單送出');
      window.location = "https://www.shiseido-event.com/2018maquillage/thank.html?c_no=" + c_no + "&s_no=" + s_no + "&t_no=" + t_no + "&t_sn_no=" + t_sn_no + '&token=' + token;
    }

  });
}

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
    isMobile = (windowWidth < 800) ? true : false;
    if(isMobile){
        $('.menu .inner').hide();
    }else{
        $('.menu .inner').show();
    }

}

function GEvent(action) {   
  var tmpStr = action ;
  console.log(tmpStr);
  gtag('event', 'event_name', {
     'event_label': action,
     'event_action': action
  });
}


//============== common Function
//貨幣格式化 (有,)
function formatCurrency(money) {
   return toNumber(money).toLocaleString('en');
}


function toNumber(strNumber) {
   return +strNumber;
}

function checkAlertMsg(msg) {
  if (msg.length > 0) {
    msg = msg + "\r\n";
  }
  return msg;
}

function ValidateName(num) {
  var reg = /^[\u4e00-\u9fa5a-zA-Z]{2,20}$/;
  if (reg.test(num)) {
    return (true);
  } else {
    return (false);
  }
}
