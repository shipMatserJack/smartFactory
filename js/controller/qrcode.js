
function Certification(){
    var ACCESS_TOKEN = getLocalStorage(LOGIN_SESSION_TOKEN);
    if(ACCESS_TOKEN==undefined||ACCESS_TOKEN==null||ACCESS_TOKEN==""){
        tokenFlag = false;
        alert("认证过期，请重新登录");
        location.href="login.html";
    }
}

window.onload = function(){
	//公共头部图标
	var host = window.location.host;
	var html1 = '<img src="images/logo.png" alt="">'

	var html2 = '<img src="images/bandex.png" alt="">'

	if(host == "ziyun.bandexsoft.com"){

		$('.logo').html(html2)
	}else{
		$('.logo').html(html1)
	}

    Certification()

	$('#orderNo').keydown(function(e){
		if(e.keyCode == 13){
			request_DrawingNo($("#orderNo").val());
		}
	});

	$("#orderNo").blur(function(){
		request_DrawingNo($("#orderNo").val());
	});


  var page = 1;
  var total;
  var pageNum = 1;
  var pageSize = 12;
  var val;
	
	
	function request_DrawingNo(orderNo){
    var ACCESS_TOKEN = getLocalStorage(LOGIN_SESSION_TOKEN);
		var content = $('#orderNo').val();
		$("#select_ul").html("");
		var GET_QRCODEURL_BY_ORDERNO = "/getqucodeUrlByOrderNo";
		if(content == '' || content == 'undefined' || content == null){
			return;
		}else{
			$.ajax({
				type:"GET",
				url:TARCK_INTOPIECES_SERVER_BASE_URI+GET_QRCODEURL_BY_ORDERNO,
				headers: {
					"token":ACCESS_TOKEN
				},
				data:{
					"orderNo":orderNo
				},
				success:function(data){
					if(data.token){
						var token = data.token
						setStorage(LOGIN_SESSION_TOKEN,token);
					}
					if(data.code == 200){
						var response = data.data;
						var order_ratio_str = "";
						$("#select_div").val(response[0].generalDrawingId);
						var arr = [];
						for(var i = 0; i < response.length; i++){
							arr.push(response[i].generalDrawingId)
						}
						var res = [];
						var json = {};
						for(var i = 0; i < arr.length; i++){
							if(!json[arr[i]]){
								res.push(arr[i]);
								json[arr[i]] = 1;
							}
						}
						for(i in res){
							order_ratio_str += "<li>"+res[i]+"</li>";
						}
						$("#select_ul").html(order_ratio_str);
						$(".select-head").click();
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					alert('数据请求失败')
					if(XMLHttpRequest.code == 401){
						alert("身份认证过期，请重新登录！")
						window.location.href='login.html'
					}
				}
			});

		}
	}

	var selectHead = $('.select-head');
 
	$(document).on('click','.select-list li',function(){
		val = $(this).text();
		selectHead.removeClass('curr');
		$(this).parents('.select-list').siblings('.select-head').find('.con').html(val);
		console.log(val)
		request_URL(val);
	})
	function request_URL(generalDrawingId){
		var GET_QUCODEURL_BY_DRAWINGID = "/getqucodeUrlByDrawingId";
    var ACCESS_TOKEN = getLocalStorage(LOGIN_SESSION_TOKEN);
		$("#my_qrcode").html("");
		$.ajax({
			type:"GET",
			url:TARCK_INTOPIECES_SERVER_BASE_URI+GET_QUCODEURL_BY_DRAWINGID,
			headers: {
				"token":ACCESS_TOKEN
			},
			data:{
				"generalDrawingId":generalDrawingId,
				"pageNum": pageNum,
				"pageSize": pageSize
			},
			success:function(data){
				if(data.token){
						var token = data.token
						setStorage(LOGIN_SESSION_TOKEN,token);
				}
				if(data.code == 401){
					alert('身份认证过期，请重新登录！')
					window.location.href='./login.html'
				}
				if(data.code == 200){
					var response = data.data.list;
          
          // page = Math.ceil(data.data.total / 10);
          total = data.data.total;
          showPage()
					var order_ratio_str = "";
					for(var i=0;i<response.length;i++){
                        var str = response[i].qrcodeId;
                        // var str = "NU00001_03_01"
                        var arr = str.split("_");
                        var legnth = arr.length;
                        var num = arr[legnth - 1];
                        arr.pop();
                        var str2 = arr.join("_")
						order_ratio_str += "<div style='float: left;padding:8px;'>"+
										      	"<img src='"+response[i].sonCode+"'/>"+
												"<p style='text-align: center'>编号："+ str2 + "</p>"+
												"<p style='text-align: center'>第" +	 num + " 张</p>"+
										    "</div>";
					}
					$("#my_qrcode").html(order_ratio_str);
					
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				alert('数据请求失败')
				if(XMLHttpRequest.code == 401){
          alert("身份认证过期，请重新登录！")
					window.location.href='login.html'
				}
			}
		});
	}
  $("#print_button").click(function(){
    document.title = '物料二维码';
    $("#my_qrcode").print(/*options*/);
    document.title = '管理二维码';
  });
  
  // 分页
  var pagingInit;  //初始化插件
  function showPage(num) {
    if (pagingInit) {
      pagingInit = null;
    }
    
    console.log(Math.ceil(total/pageSize))
    console.log(total)
    
    pagingInit = $('#page').pagination({
      jump: true,
      pageCount: Math.ceil(total/pageSize),
      showData: pageSize,
      current:pageNum,
      totalData:total,
      callback:function(api){
        pageNum = api.getCurrent()
        request_URL(val)
      }
    });
  }
	
	
	


//	设备二维码b
  var deviceTotal;
  var devicePageNum = 1;
  var devicePageSize = 12;
  
  
  
  
  
  // 分页
  var devicePagingInit;  //初始化插件
  function deviceShowPage(num) {
    if (devicePagingInit) {
      devicePagingInit = null;
    }
  
  
  
    devicePagingInit = $('#devicePage').pagination({
      jump: true,
      pageCount: Math.ceil(deviceTotal/devicePageSize),
      showData: devicePageSize,
      current:devicePageNum,
      totalData:deviceTotal,
      callback:function(api){
        devicePageNum = api.getCurrent()
        second_URL()
      }
    });
  }
  second_URL();
  function second_URL(){
    var GET_QUCODEURL_BY_EQUIPMENT = "/deviceQrcode";
    var user = localStorage.getItem("USER")
    var taken = localStorage.getItem("LOGIN_SESSION_TOKEN_CONSTANTS")
    var ACCESS_TOKEN = getLocalStorage(LOGIN_SESSION_TOKEN);
    $.ajax({
      type:"GET",
      url:TARCK_INTOPIECES_SERVER_BASE_URI+GET_QUCODEURL_BY_EQUIPMENT,
      headers: {
        "token":ACCESS_TOKEN
      },
      data:{
        "ssoId":user,
        "accessToken":taken,
				"pageNum":devicePageNum,
				"pageSize":devicePageSize
      },
      success:function(data){
        if(data.token){
          var token = data.token
          setStorage(LOGIN_SESSION_TOKEN,token);
        }
        if(data.code == 401){
          alert('身份认证过期，请重新登录！')
          window.location.href='./login.html'
        }
        if(data.code == 200){
          var response = data.data.list;
          var order_ratio_str = "";
  
          deviceTotal = data.data.total
          deviceShowPage()
          for(var i=0;i<response.length;i++){
            order_ratio_str += "<div style='float: left;padding:8px;'>"+
              "<img  style='display: block;height:180px;width:auto;' src='"+response[i].url+"'/>"+
              "<p style='text-align: center'>设备："+  response[i].deviceNo + "</p>"+
              "</div>";
          }
          $("#equipment_qrcode").html(order_ratio_str);
         
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        if(XMLHttpRequest.code == 401){
          alert("身份认证过期，请重新登录！")
          window.location.href='login.html'
        }
        alert('数据请求失败')
      }
    });
  }
  
  //	打印设备二维码
  $("#equipment_print_button").click(function(){
    document.title = '设备二维码';
    $("#equipment_qrcode").print(/*options*/);
    document.title = '二维码管理';
  });
};
