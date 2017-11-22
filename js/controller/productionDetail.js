function Certification(){
    var ACCESS_TOKEN = getLocalStorage(LOGIN_SESSION_TOKEN);
    if(ACCESS_TOKEN==undefined||ACCESS_TOKEN==null||ACCESS_TOKEN==""){
        tokenFlag = false;
        alert("认证过期，请重新登录");
        location.href="login.html";
    }
}
Certification();
$(document).ready(function (){
	var ACCESS_TOKEN = getLocalStorage(LOGIN_SESSION_TOKEN);
	if(ACCESS_TOKEN==undefined||ACCESS_TOKEN==null||ACCESS_TOKEN==""){
		document.location.href="login.html";
	}
	var orderNo = GetQueryString("orderNo");
	var subgraphId = GetQueryString("generalDrawingId");
	var componentNum = GetQueryString("totalNum");
	statistics();
	
	
	function statistics(){
		var GET_PROCEDURE_INFO_BY_ORDERNO = "/getProductionNum";
		$.ajax({
			type:"POST",
			url:TARCK_MEMBER_SERVER_BASE_URI+GET_PROCEDURE_INFO_BY_ORDERNO,
			headers: {
				"token": ACCESS_TOKEN
			},
			contentType: "application/json; charset=utf-8",
			data:JSON.stringify({
				"orderNo":orderNo,
				"subgraphId":subgraphId
			}),
			success:function(data){
                if(data.token){
                    var token = data.token
                    setStorage(LOGIN_SESSION_TOKEN,token);
                }
				if(data.code == 401){
					alert('身份认证过期，请重新登录！')
					window.location.href='./login.html'
				}
        
        if(data.code == 200 || data.code == 201){
          if(data.data){
            var response = data.data;
            var order_ratio = ((response.produceNum*100)/response.totalNum).toFixed(2);
            if(order_ratio == 'NaN'){
              order_ratio = ' '
            }
            $("#device_part_ed").html(response.produceNum);
            $("#device_part_count").html(response.totalNum);
            $("#device_part_ratio").html(order_ratio);
            $("#device_part_time").html(response.hour);
          
            if(response.procedureInfo){
              var res = response.procedureInfo
            }else{
              var res = response
            }
            
          var productStr = "";
          for(i in res){
            var endProductionTime = res[i].endProductionTime;
            var date = new Date(parseInt(res[i].createdTime));
            var dateStr = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
            var status = "已完成";
            var classStr = " blue";
            if(! ( typeof(endProductionTime) == "undefined" || endProductionTime == "")){
              status = "正在进行";
              classStr = " green";
            }
            productStr += "<div class='box-list'>"+
              "<div class='time'><i class='circle"+classStr+"'></i>"+dateStr+"</div>"+
              "<div class='cont'>"+
              "<dl>"+
              "<dt>"+
              "<span class='fl'>零件编号：<span class='val'>"+res[i].subgraphId+"</span></span>"+
              "<span class='fr green'>"+status+"</span>"+
              "</dt>"+
              "<dd>零件件数：<span class='val'>"+componentNum+"件</span></dd>"+
              "<dd>生产责任人：<span class='val'>"+res[i].userName+"</span></dd>"+
              "<dd>生产机床编号：<span class='val'>"+res[i].deviceNo+"</span></dd>"+
              "</dl>"+
              "</div>"+
              "</div>";
          }
          $("#product_Container").html(productStr);
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				if(XMLHttpRequest.code == 401){
          alert("身份认证过期，请重新登录！")
					window.location.href='login.html'
				}
			}
		});
	}
});
