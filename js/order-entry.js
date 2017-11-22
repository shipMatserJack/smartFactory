$(function(){

  var host = window.location.host;
  console.log(host)

  var html1 = '<img src="images/logo.png" alt="">'

  var html2 = '<img src="images/bandex.png" alt="">'

  if(host == "ziyun.bandexsoft.com"){

    $('.logo').html(html2)
  }else{
    $('.logo').html(html1)
  }

})