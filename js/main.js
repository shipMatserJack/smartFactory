

function zy_for1(e, cb){
	var checks= document.getElementsByTagName('input');
	var ch;
	if(e.currentTarget)
    	ch = e.currentTarget.previousElementSibling;
	else
		ch = e.previousElementSibling;
    if (ch.nodeName == "INPUT") {
        if (ch.type == "checkbox") {
	    	ch.checked = !ch.checked;
	    	if(ch.checked){//如果当前状态为选中状态
			 	for(var c=0;c<checks.length;c++){
					if(checks[c].id!=ch.id){
						checks[c].checked=false;
					}
				}
			}
        }
           
        
    }
    if (cb) 
        cb(e, ch.checked);
}


function zy_fold1(e, col){
    var a = e.currentTarget.nextElementSibling;
    var t=e.currentTarget.firstElementChild;
    if (a.nodeName == "DIV") {
        if (col) {
        	var checks= document.getElementsByName("col");
			for(var c=0;c<checks.length;c++){
				if(checks[c].id!=a.id){//当前的显示，则其他需要隐藏
					 var m = checks[c].previousElementSibling;
					 var n=m.firstElementChild;
					 checks[c].className += ' col-c';
					 m.className= m.className.replace("c-gra3e42", "");
          			 n.className= n.className.replace("c-yelfec6", "c-blu4653");
				}
			}
        	e.currentTarget.className += ' c-gra3e42';
        	t.className=t.className.replace("c-blu4653", "c-yelfec6");
            a.className = a.className.replace(/col-c/g, "");
        }
        else {
        	 a.className += ' col-c';
        	 e.currentTarget.className = e.currentTarget.className.replace("c-gra3e42", "");
        	 t.className=t.className.replace("c-yelfec6", "c-blu4653");
        }
           
    }
}
function setLocVal(key,value){
	window.localStorage[key] = value;
}
function getLocVal(key){
	if(window.localStorage[key])
		return window.localStorage[key];
	else
		return "";
}
function select_history(id) {
    var sl = document.getElementById(id);
    if (sl) {
        var sp = sl.parentElement; //<span>
        if (sp) {
            var ch = sp.getElementsByTagName("div")[0].firstElementChild;
            var t = sl.options[sl.selectedIndex].text;
            if (ch) {
                ch.innerHTML = t;
            }
        }
    }
}
function refreshPage(){
	var sessionStorage=window.sessionStorage;
	var index=location.href.lastIndexOf("/");
	if(index!=-1){
		var href=location.href.substring(index+1);
		sessionStorage.setItem("refreshPage",href);
	}
}