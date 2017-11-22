//头部公共部分图标
$(function () {
    var host = window.location.host;

    var html1 = '<img src="images/logo.png" alt="">'

    var html2 = '<img src="images/bandex.png" alt="">'

    if(host == "ziyun.bandexsoft.com"){
        $('.logo').html(html2)
    }else{
        $('.logo').html(html1)
    }
})

//token过期重新登录
function Certification() {
    var ACCESS_TOKEN = getLocalStorage(LOGIN_SESSION_TOKEN);
    if (ACCESS_TOKEN == undefined || ACCESS_TOKEN == null || ACCESS_TOKEN == "") {
        tokenFlag = false;
        alert("认证过期，请重新登录");
        location.href = "login.html";
    }
}


$(function () {
    $('.del-img').click(function () {
        $(this).parents('li').remove();
    })
})


$(function () {
    Certification();

    var pageNum = 1;
    var pageSize = 10;
    var startTime = moment(new Date()).format('YYYY-MM-DD') + " " + "00:00:01";
    var endTime = moment(new Date()).format('YYYY-MM-DD') + " " + "23:59:59";
    var orderNo = ' ';
    var status = 3;
    var page = 1;
    var total;
    var seacherFisrt = false;
    var flag = 0;

    requstFisrt(pageNum, pageSize, startTime, endTime, orderNo, status, "/seleteOrderInputByTimeAndStatus")
    // 使用插件前，获取数据并把分页所需参数传入showPage
    function requstFisrt(pageNum, pageSize, startTime, endTime, orderNo, status, SELECT_ORDER_BY_TIME) {
      var ACCESS_TOKEN = getLocalStorage(LOGIN_SESSION_TOKEN);
        $.ajax({
            url: TARCK_INTOPIECES_SERVER_BASE_URI + SELECT_ORDER_BY_TIME + "?pageNum=" + pageNum + "&pageSize=" + pageSize + "&startTime=" + startTime + "&endTime=" + endTime + "&status=" + status + "&orderNo=" + orderNo,
            type: "GET",
            headers: {
                "token": ACCESS_TOKEN
            },
            success: function (res) {
                if (res.token) {
                    var token = res.token
                    setStorage(LOGIN_SESSION_TOKEN, token);
                }
                if(res.code == 401){
                    alert('身份认证过期，请重新登录！')
                    window.location.href='./login.html'
                }
                if (res.data) {
                    var data = res.data.list
                  
                    if (res.code == 200 && data.length) {
                        var html = '';
                        var colorArr = [{color: 'orange', name: '未开始'}, {color: 'green', name: '进行中'}, {
                            color: 'blue',
                            name: '已完成'
                        }];

                        for (i in data) {
                            //订购时间
                            var orderTime = data[i].orderTime;
                            var orderUrl = escape(data[i].orderNo)
                            var totalNum = data[i].orderNum * data[i].drawingNum
                            var Time = moment(orderTime).format('YYYY-MM-DD HH:mm:ss');
                            html += '<tr><td class="orderNo">' + data[i].orderNo + '</td>';
                            html += '<td>' + data[i].productName + '</td>';
                            html += '<td>' + Time + '</td>';
                            html += '<td>' + data[i].orderCompany + '</td>';
                            html += '<td>' + data[i].orderNum + '</td>';
                            html += '<td><a href="product-detail.html?orderNo=' + data[i].orderNo + '&generalDrawingId=' + data[i].generalDrawingId + '&totalNum='+totalNum+'" class="btn ' + colorArr[data[i].status].color + '">' + colorArr[data[i].status].name + '<i class="iconfont icon-iconfontxiangxia1copy19"></i></a>'
                            if (data[i].batchNum) {
                                html += '<a href="javascript:void(0);" class="btn blue seenDetail" data-name="' + data[i].id + '">物料详情</a>';
                            } else {
                                html += '<a href="material-input.html?orderNo=' + orderUrl + '&id=' + data[i].id + '" class="btn orange">物料录入</a>';
                            }
                          html += '<a href="###" class="delete" data-name=' + data[i].id + '><i class="iconfont icon-shanchu"></i></a>';
                          html += '</td></tr>'
                        }
                        $('#tableBody').html(html)
                        deleItem();
                        seenDetail();
                        page = Math.ceil(res.data.total / 10);
                        total = res.data.total;
                        flag++;
                      showPage()
                    } else {
                        html = '<tr><td></td>';
                        html += '<td></td>';
                        html += '<td>暂无数据</td>';
                        html += '<td></td>';
                        html += '<td></td>';
                        html += '<td></td>';
                        html += '</td></tr>';
                        showPage(0);
                        $('#tableBody').html(html);
                    }
                } else {
                    html = '<tr><td></td>';
                    html += '<td></td>';
                    html += '<td>暂无数据</td>';
                    html += '<td></td>';
                    html += '<td></td>';
                    html += '<td></td>';
                    html += '</td></tr>';
                    showPage(0);
                    $('#tableBody').html(html);
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
            
            }
        });
    }


    var pagingInit;  //初始化插件
    function showPage(num) {
      if (pagingInit) {
            pagingInit = null;
        }
  
      if(num == 0){
        total = 1;
      }
      pagingInit = $('#page').pagination({
        jump: true,
        pageCount: Math.ceil(total/pageSize),
        showData: pageSize,
        current:pageNum,
        totalData:total,
        callback:function(api){
          pageNum = api.getCurrent()
          if(seacherFisrt){
            requstFisrt(pageNum, pageSize, startTime, endTime, orderNo, status, "/seleteOrderInputByTimeAndOrderNo")
          }else{
            requstFisrt(pageNum, pageSize, startTime, endTime, orderNo, status, "/seleteOrderInputByTimeAndStatus")
          }
        }
      });
    }
  

    //查看物料详情
    function seenDetail() {
        $('.seenDetail').click(function () {
            var currentOrderId = $(this).data('name')
            var QUERY_MATERIAL = '/selectMaterielId/' + currentOrderId
            $.ajax({
                url: TARCK_INTOPIECES_SERVER_BASE_URI + QUERY_MATERIAL,
                type: "GET",
                headers: {
                    "token": getLocalStorage(LOGIN_SESSION_TOKEN)
                },
                success: function (res) {
                    if (res.token) {
                        var token = res.token
                        setStorage(LOGIN_SESSION_TOKEN, token);
                    }
                    if(res.code == 401){
                        alert('身份认证过期，请重新登录！')
                        window.location.href='./login.html'
                    }
                    if (res.code == 200) {
                        var data = res.data;
                        var html = '<ul><li><em>物料详情</em><img src="images/close.png" class="materialDetailClose"></li>';
                        html += '<li><span>订单编号：</span><span style="margin-left:10px;" class="orderNoDetail">' + data.orderNo + '</span></li>';
                        html += '<li><span>采购数量：</span><input type="text" disabled="true" class="materielNoDetail" value="' + data.materielNo + '"><span class="purchaseAmount" style="width:150px;color:red;margin-left:10px;display:none;">采购数量不能为空</span></li>';
                        html += '<li><span>采购价格：</span><input type="text" disabled="true" class="materielPriceDetail" value="' + data.materielPrice + '"><span class="procurementPrice" style="width:250px;color:red;margin-left:10px;display:none;">最多输入10位，精确到小数点后2位</span></li>';
                        html += '<li><span>供应商：</span><input type="text" disabled="true" class="materialSupplieDetail" value="' + data.materialSupplie + '"><span class="supplier" style="width:150px;color:red;margin-left:10px;display:none;">供应商不能为空</span></li>';
                        html += '<div class="materialTip" style="color:red;padding:10px 20px;"></div>'
                        html += '<div style="text-align:center;"><span class="btn abtn materialDetailEdit">修改</span>'

                        html += '<span class="btn abtn updataDetail" data-name=' + data.id + '>提交</span></div>'
                        $('#materialDetail .conten').html(html);
                        $('#materialDetail').show();
                    }
                    $('.materialDetailClose').click(function () {
                        $('#materialDetail').hide();
                    })

                    // 修改
                    $('.materialDetailEdit').click(function () {
                        var arr = $('#materialDetail .conten').find('input');
                        for (var i = 0; i < arr.length; i++) {
                            $(arr[i]).attr("disabled", false);
                            $(arr[i]).addClass('current')
                        }
                    })
                    //失去焦点时判断
                    $('.materielNoDetail ').blur(function(){
                        var materielNoDetail = $('#materialDetail .materielNoDetail').val();
                        if (!materielNoDetail) {
                            $('.purchaseAmount').show();
                            return
                        }else{
                            $('.purchaseAmount').hide();
                        }
                    })

                    $('.materielPriceDetail ').blur(function(){
                        var materielPriceDetail = $('#materialDetail .materielPriceDetail').val();
                        var reg = /^(([1-9][0-9]{0,7})|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
                        if (!reg.test(materielPriceDetail)) {
                            $('.procurementPrice').show();
                            return
                        }else{
                            $('.procurementPrice').hide();
                        }
                    })

                    $('.materialSupplieDetail ').blur(function(){
                        var materialSupplieDetail = $('#materialDetail .materialSupplieDetail').val();
                        if (!materialSupplieDetail) {
                            $('.supplier').show();
                            return
                        }else{
                            $('.supplier').hide();
                        }
                    })

                    //提交时判断
                    $('.updataDetail').click(function () {
                        var id = $(this).data('name')
                        var orderNoDetail = $('#materialDetail .orderNoDetail').html();
                        var materielNoDetail = $('#materialDetail .materielNoDetail').val();
                        if (!materielNoDetail) {
                            $('.purchaseAmount').show();
                            return
                        }

                        var materielPriceDetail = $('#materialDetail .materielPriceDetail').val();
                        var reg = /^(([1-9][0-9]{0,7})|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
                        if (!reg.test(materielPriceDetail)) {
                            $('.procurementPrice').show();
                            return
                        }

                        var materialSupplieDetail = $('#materialDetail .materialSupplieDetail').val();
                        if (!materialSupplieDetail) {
                            $('.supplier').show();
                            return
                        }

                        var UPDATA_URL = '/updatematerielInput'
                        $.ajax({
                            url: TARCK_INTOPIECES_SERVER_BASE_URI + UPDATA_URL,
                            type: "POST",
                            headers: {
                                "token": getLocalStorage(LOGIN_SESSION_TOKEN)
                            },
                            contentType: 'application/json ',
                            dataType: "json",
                            data: JSON.stringify(
                                {
                                    "materielNo": materielNoDetail,
                                    "materialSupplie": materialSupplieDetail,
                                    "materielPrice": materielPriceDetail,
                                    "orderNo": orderNoDetail,
                                    "id": id
                                }),
                            success: function (res) {
                                if (res.token) {
                                    var token = res.token
                                    setStorage(LOGIN_SESSION_TOKEN, token);
                                }
                                if(res.code == 401){
                                    alert('身份认证过期，请重新登录！')
                                    window.location.href='./login.html'
                                }
                                if (res.code == 200) {
                                    var arr = $('#materialDetail .conten').find('input')
                                    for (var i = 0; i < arr.length; i++) {
                                        $(arr[i]).attr("disabled", true);
                                        $(arr[i]).removeClass('current')
                                        layer.msg('提交成功！');
                                    }
                                } else {
                                    $('.materialTip').html('服务器内部出现错误，修改失败！')
                                }
                            }
                        })
                    })

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("Error :" + textStatus);
                }
            })
            $('#materialDetail').show();
        })
        $('.materialDetailBg').click(function () {
            $('#materialDetail').hide();
        })
    }

    //日期插件
    $("#begin").jeDate({
        format: "YYYY-MM-DD hh:mm:ss",
        //isinitVal: true,
        isTime: true,
        minDate: "2014-09-19 00:00:00"
    });
    $("#over").jeDate({
        format: "YYYY-MM-DD hh:mm:ss",
        //isinitVal: true,
        isTime: true,
        minDate: "2014-09-19 00:00:00"
    });

    //搜素功能
    $("#search").click(function () {
        startTime = $("#begin").val();
        endTime = $("#over").val();
        orderNo = $("#equipment_1").val();
        pageNum = 1
        seacherFisrt = true
        status = $('.select-head .con').attr("data");
        // requstFisrt(pageNum,10,startTime,endTime,orderNo,status)

        var SELECT_ORDER_BY_TIME = "/seleteOrderInputByTimeAndOrderNo";
        if (endTime && startTime) {
            if ((Date.parse(new Date(endTime))) >= (Date.parse(new Date(startTime)))) {
                requstFisrt(pageNum, pageSize, startTime, endTime, orderNo, status, SELECT_ORDER_BY_TIME)
            } else {
                alert("你选择的时间段不合适，请检查并确认无误之后再做操作");
            }
        } else {
            requstFisrt(pageNum, pageSize, '', '', orderNo, status, SELECT_ORDER_BY_TIME)
        }
    });


    // 删除
    function deleItem() {
        $(".delete").click(function () {
            var msg = "您真的确定要删除吗？\n\n请确认！";
            var objItem = $(this).parent().parent();
            if (confirm(msg) == true) {
                var DELETE_ORDER_BY_ID = "/deleteOrderInput";
                var id = $(this).data('name')
                $.ajax({
                    url: TARCK_INTOPIECES_SERVER_BASE_URI + DELETE_ORDER_BY_ID + "?id=" + id,
                    type: "GET",
                    headers: {
                        "token": getLocalStorage(LOGIN_SESSION_TOKEN)
                    },
                    //beforeSend: function(request){
                    //    request.setRequestHeader("token",ACCESS_TOKEN);
                    //},
                    success: function (data) {
                        if (data.token) {
                            var token = data.token
                            setStorage(LOGIN_SESSION_TOKEN, token);
                        }
                        if (data.code == 200) {
                            objItem.remove()
                        }
                        if(data.code == 401){
                            window.location.href='./login.html'
                        }
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown,error) {
                        alert(error.message)
                        if(XMLHttpRequest.status == 401){
                            window.location.href='../../login.html'
                        }
                    }
                })
            } else {
                return false;
            }

        });
    }


})




	
	
	
	
	

