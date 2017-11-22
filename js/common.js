//var SERVER_BASE_URI = "http://www.ziyun-cloud.com/api";//生产

//var SERVER_BASE_URI = "http://iot.ziyun-cloud.net";//QA
//var TARCK_INTOPIECES_SERVER_BASE_URI = "http://iot.ziyun-cloud.net/intopieces";
//var TARCK_MEMBER_SERVER_BASE_URI = "http://iot.ziyun-cloud.net/member";
var SERVER_BASE_URI = "http://localhost/ziyun";//本地
var TARCK_INTOPIECES_SERVER_BASE_URI = "http://localhost/ziyun/intopieces";
var TARCK_MEMBER_SERVER_BASE_URI = "http://localhost/ziyun/member";

var LOGIN_SESSION_TOKEN = "LOGIN_SESSION_TOKEN_CONSTANTS";
var USER_HIERARCHYCODE = "userHierarchyCode";
var PERMISSIONS = "PERMISSIONS"
var USER = "USER"

//获取URL参数
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

function getIoCload(){

	var str="<div class='dialog_loading' id='load'><div class='ball-clip-rotate'></div><span>正在加载</span></div>";
	$(".ico_loading").html(str);
}

window.alert = function(name){
	 var iframe = document.createElement("IFRAME");
	iframe.style.display="none";
	iframe.setAttribute("src", 'data:text/plain,');
	document.documentElement.appendChild(iframe);
	 window.frames[0].window.alert(name);
	iframe.parentNode.removeChild(iframe);
}


function setStorage(key,value){
  localStorage.setItem(key, value);
}


function getLocalStorage(key){
  if(localStorage.getItem(key))
    return localStorage.getItem(key);
  else
    return "";
}
/*function setCookie(name,value){
	
	var expiredays=30;
	var exdate=new Date()
	exdate.setDate(exdate.getDate()+expiredays)
	document.cookie=name+ "=" +escape(value)+
	((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
}

function getCookie(name){
		if (document.cookie.length>0)
		{
			c_start=document.cookie.indexOf(name + "=")
			if (c_start!=-1)
			{ 
				c_start=c_start + name.length+1 
				c_end=document.cookie.indexOf(";",c_start)
				if (c_end==-1) c_end=document.cookie.length
				return unescape(document.cookie.substring(c_start,c_end))
			} 
		}
	
	return "";
}*/

