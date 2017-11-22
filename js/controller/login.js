$(document).ready(function(){
  var host = window.location.host;
  if(host == "ziyun.bandexsoft.com"){
    $('.newZiYun-logo').css("background-image","url(css/images/bandeh.png)")
  }else {
    $('.newZiYun-logo').css("background-image", "url(css/images/ziyunlogo.png)")
  }
  
document.onkeyup = function (event) {
            var e = event || window.event;
            var keyCode = e.keyCode || e.which;
            switch (keyCode) {
                case 13:
                    $("#checkLogin").click();
                    break;
               
                default:
                    break;
            }
        }
	
	$("#uname").empty("");
	$("#pwd").empty("");
	createCode();
	function createCode(){
		var codeStr="";
	    code = "";
	    var codeLength = 4; //验证码的长度
	    var checkCode = $("#checkCode");
	    var codeChars = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
	    'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
	    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'); //所有候选组成验证码的字符，当然也可以用中文的
	    for (var i = 0; i < codeLength; i++){
	        var charNum = Math.floor(Math.random() * 52);
	        var rad = Math.round(Math.random()*50-15);
	        code += codeChars[charNum];
		    var r = randomNum(0,250);
		    var g = randomNum(0,250);
		    var b = randomNum(0,250);
	        codeStr+='<div class="ub-f1 tx-c" style= "color:rgb('+r+','+g+','+b+');transform:rotate('+rad+'deg)">'+codeChars[charNum]+'</div>';
	    }
	    //setLocVal("validateCode",code);
	    if (checkCode){
	    	checkCode.html(codeStr);
	    }
	}
	function randomNum(min,max){
	    return Math.floor( Math.random()*(max-min)+min);
	}
	
	$("#checkCode").bind("click",function(){
		createCode();
	})
	
	$("#checkLogin").bind("click",function(){
		var name=$(".uname").val();
		var password=$("#pwd").val()
		if(!name){
			alert("用户名不能为空！");
			return;
		}
		if(!password){
			alert("密码不能为空！");
			return;
		}
		//var codeStatus=getLocVal("validateCode");
	    var inputCode = $("#code").val();
	    if (inputCode.length <= 0){
	        alert("请输入验证码！");
	       return
	    }
	    else if (inputCode.toUpperCase() != code.toUpperCase()){
	        alert("验证码输入有误！");
	        createCode();
	         return
	    }
	    
		var LOGIN_API_URI = "/intopieces/user";
	    
		$.ajax({
			url: SERVER_BASE_URI + LOGIN_API_URI + "/" +  name,
			data:{"password":password},
			type:"POST",
			success:function(data){
				console.log(data)
        var statusCode = data.code;
        var userName = data.data.user.userName;
        var response = data.data;
        var permissions = data.data.contains
        if(statusCode==200) {
          var accessToken = response.accessToken;
          var hierarchyCode = response.userHierarchy.hierarchyCode;
          setStorage(LOGIN_SESSION_TOKEN, accessToken);
          setStorage(USER_HIERARCHYCODE, hierarchyCode);
          setStorage('USER', userName);
          setStorage(PERMISSIONS, permissions);
          window.location.href = "index.html";
        }else {
					alert("用户名或密码错误");
				}
				if(statusCode== 401){
					window.location.href='./login.html'
				}

			},
            error : function(XMLHttpRequest, textStatus, errorThrown) {

								if(XMLHttpRequest.status == 401){
									window.location.href='../../login.html'
								}

            }
		});
	})
});