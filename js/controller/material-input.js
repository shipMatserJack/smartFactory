function Certification() {
  var ACCESS_TOKEN = getLocalStorage(LOGIN_SESSION_TOKEN);
  if (ACCESS_TOKEN == undefined || ACCESS_TOKEN == null || ACCESS_TOKEN == "") {
    tokenFlag = false;
    alert("认证过期，请重新登录");
    location.href = "login.html";
  }
}
Certification();


$(document).ready(function () {
  //公共头部图标
  var host = window.location.host;
  console.log(host)
  var html1 = '<img src="images/logo.png" alt="">'

  var html2 = '<img src="images/bandex.png" alt="">'

  if (host == "ziyun.bandexsoft.com") {

    $('.logo').html(html2)
  } else {
    $('.logo').html(html1)
  }


  var permissions = getLocalStorage(PERMISSIONS)
  if (permissions == 'true') {
    $('.orderEntry').show();
  } else {
    $('.orderEntry').hide('500');
  }
  
  var orderNo = unescape(GetQueryString('orderNo'));
  $('#orderNo').html(orderNo)
  var orderId = GetQueryString('id');
  
  //if(ACCESS_TOKEN==undefined||ACCESS_TOKEN==null||ACCESS_TOKEN==""){
  //	document.location.href="login.html";
  //}
  $("#materielPrice").blur(function () {
    var materielPrice = $("#materielPrice").val();
    var reg = /^(([1-9][0-9]{0,7})|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
    if (!reg.test(materielPrice)) {
      $('.procurementPrice').show();
      return
    } else {
      $('.procurementPrice').hide();
    }
  })

  $('#mycommit').click(function () {
    Certification()
    var orderNo = $("#orderNo").html();
    var batchNum = $("#batchNum").val();
    var materielNo = $("#materielNo").val();
    var materielPrice = $("#materielPrice").val();
    var materialSupplie = $("#materialSupplie").val();
    // if (orderNo.length == 0) {
    //     alert("请输入“订单编号”");
    // }
    if (batchNum.length == 0) {
      alert("请输入“物料编号”");
      return
    }
    if (!isNaN(materielNo) && materielNo == "") {
      alert("请为“采购数量”输入合适的数字");
      return
    }
    if (!isNaN(materielPrice) && materielPrice == "") {
      alert("请为“采购价格”输入合适的数字");
      return
    }
    if (materialSupplie == 0) {
      alert("请输入“供应商名称”");
      return
    }

    var SAVE_MATERIEL_INFO = "/saveMaterielInfo"
    var ACCESS_TOKEN = getLocalStorage(LOGIN_SESSION_TOKEN);
    $.ajax({
      type: "post",
      url: TARCK_INTOPIECES_SERVER_BASE_URI + SAVE_MATERIEL_INFO,
      headers: {
        "token": ACCESS_TOKEN
      },
      //beforeSend:function(request){
      //	request.setRequestHeader("access_token",access_token),
      //	request.setRequestHeader("code","h5")
      //},

      contentType: "application/json; charset=utf-8",
      data: JSON.stringify({
        "orderNo": orderNo,
        "batchNum": batchNum,
        "materielNo": materielNo,
        "materielPrice": materielPrice,
        "materialSupplie": materialSupplie
      }),
      success: function (data) {
        if (data.token) {
          var token = data.token
          setStorage(LOGIN_SESSION_TOKEN, token);
        }
        if (data.code == 401) {
          alert('身份认证过期，请重新登录！')
          window.location.href = './login.html'
        }
        if (data.code == 200) {
          layer.msg("录入成功");
          $('#myreset').click();
          backId(data.data)
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        alert("Error :" + textStatus);
        if (XMLHttpRequest.status == 401) {
          window.location.href = '../../login.html'
        }

      }
    });
  });
  $('#myreset').click(function () {
    Certification();
    $("#batchNum").val("");
    $("#batchNumtype").val("");
    $("#materielNo").val(1);
    $("#materielPrice").val("");
    $("#materialSupplie").val("");
    // $("#orderNo").val("");
  });

  // 给后端返还生成的id值
  function backId(pams) {
    var SAVEID = '/updateMaterielId';
    var ACCESS_TOKEN = getLocalStorage(LOGIN_SESSION_TOKEN);
    $.ajax({
      type: "GET",
      url: TARCK_INTOPIECES_SERVER_BASE_URI + SAVEID + '?orderId=' + orderId + '&materielId=' + pams,
      headers: {
        "token": ACCESS_TOKEN
      },
      //beforeSend:function(request){
      //    request.setRequestHeader("access_token",access_token),
      //        request.setRequestHeader("code","h5")
      //},

      contentType: "application/json; charset=utf-8",
      success: function (res) {
        console.log(res)
        if (res.code == 401) {
          alert('身份认证过期，请重新登录！')
          window.location.href = './login.html'
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.code == 401) {
          alert("身份认证过期，请重新登录！")
          window.location.href = 'login.html'
        }
      }
    });
  }

});