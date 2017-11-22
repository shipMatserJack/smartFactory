var orderNo = document.getElementById("orderNo");
var box = document.getElementById("box");
var datas_orderNumber = [];
$('#orderNo').keyup(function () {
  var content = $('#orderNo').val();
  //console.log(content)
  if(content == '' || content == 'undefined' || content == null){
    return;
  }else{
    $.ajax({
      url: TARCK_INTOPIECES_SERVER_BASE_URI + '/selectOrderByLike',
      type: 'GET',
      headers: {
        "token": getLocalStorage(LOGIN_SESSION_TOKEN)
      },
      contentType: 'application/json ',
      dataType: "json",
      data:{
        code:content
      },
      success: function (res) {
        if (res.token) {
          var token = res.token
          setStorage(LOGIN_SESSION_TOKEN, token);
        }
        if (res.code == 401) {
          alert('身份认证过期，请重新登录！')
          window.location.href = './login.html'
        }
        if (res.code == 200) {
          datas_orderNumber = res.data;
          search(orderNo, datas_orderNumber, box)
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

//模糊搜索
function search(Obj, data, box) {
  var arr = [];
  var content = Obj.value;
  if (!content || content.trim() == "") {
    Obj.style.border = '1px solid red';
  } else {
    Obj.style.border = '1px solid #ddd';
  }

  for (var i = 0; i < data.length; i++) {
    if (data[i].indexOf(content) != -1) {
      arr.push(data[i]);
    }
  }

  //每一次事件触发，都会创建div ul li
  //如果发现box中已经存在pop了，就删除它， 因为马上就要创建新的了。
  var pop = document.getElementById("pop");
  if (pop) {
    //存在
    $("#pop").remove();
  }

  //生成div的前提是 arr有长度
  if (arr.length == 0 || content == "") {
    return;
  }

  var div = document.createElement("div");
  div.id = "pop";
  box.appendChild(div);
  var ul = document.createElement("ul");
  div.appendChild(ul);

  for (var i = 0; i < arr.length; i++) {
    var li = document.createElement("li");
    ul.appendChild(li);
    li.innerHTML = arr[i];
  }

  $("#pop li").on("click", function () {
    Obj.value = this.innerText;
    request_DrawingNo($(this).html())
    $("#pop").remove();
  })
  $("body").click(function () {
    $("#pop").remove();
  })
}

//订单验证表单验证
function checkout(Obj) {
  Obj.onkeyup = function () {
    var content = Obj.value;
    if (!content || content.trim() == "") {
      Obj.style.border = '1px solid red';
    } else {
      Obj.style.border = '1px solid #ddd';
    }
  }
}

function request_DrawingNo(orderNo) {
  var ACCESS_TOKEN = getLocalStorage(LOGIN_SESSION_TOKEN);
  var content = $('#orderNo').val();
  $("#select_ul").html("");
  var GET_QRCODEURL_BY_ORDERNO = "/getqucodeUrlByOrderNo";
  if(content == '' || content == 'undefined' || content == null){
    return;
  }else{
    $.ajax({
      type: "GET",
      url: TARCK_INTOPIECES_SERVER_BASE_URI + GET_QRCODEURL_BY_ORDERNO,
      headers: {
        "token": ACCESS_TOKEN
      },
      data: {
        "orderNo": orderNo
      },
      success: function (data) {
        if (data.token) {
          var token = data.token
          setStorage(LOGIN_SESSION_TOKEN, token);
        }
        if (data.code == 200) {
          var response = data.data;
          var order_ratio_str = "";
          console.log(response)
          $("#select_div").val(response[0].generalDrawingId);
          var arr = [];
          for (var i = 0; i < response.length; i++) {
            arr.push(response[i].generalDrawingId)
          }
          var res = [];
          var json = {};
          for (var i = 0; i < arr.length; i++) {
            if (!json[arr[i]]) {
              res.push(arr[i]);
              json[arr[i]] = 1;
            }
          }
          for (i in res) {
            order_ratio_str += "<li>" + res[i] + "</li>";
          }
          $("#select_ul").html(order_ratio_str);
          $(".select-head").click();

        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        alert('数据请求失败')
        if (XMLHttpRequest.code == 401) {
          alert("身份认证过期，请重新登录！")
          window.location.href = 'login.html'
        }
      }
    });
  }
}




































