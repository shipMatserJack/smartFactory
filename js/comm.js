$(function(){

	var selectHead = $('.select-head');
	var selectList = $('.select-list');
	
	//Click window to close all select
	$('html,body').on('click',function(){
		//这里不能用定义好的变量选择
		//有的select 是动太增加的  预先定义好的选择器会无效
		$('.select-list').hide();
		$('.select-head').removeClass('curr');
	})

	//Simulated select
    $(document).on('click','.select-head',function(){
		if(!$(this).hasClass('curr')){
			selectHead.removeClass('curr');
			selectList.hide();
		}
		$(this).siblings('.select-list').toggle();
		$(this).toggleClass('curr');
		return false;
	})

	//Analog select assignment
    $(document).on('click','.select-list li',function(){
		var val = $(this).text();
		selectHead.removeClass('curr');
		var id = $(this).data('id');
	
		$(this).parents('.select-list').siblings('.select-head').find('.con').attr("data",id);
		
		$(this).parents('.select-list').siblings('.select-head').find('.con').html(val);
	})


	//base pop close 
	var popClose = $('.js-pop-close');
	var basePopup = $('.base-popup');
	popClose.click(function(){
		basePopup.delay(200).fadeOut(300);
		//css 控制公共弹窗显示与隐藏动画
		basePopup.removeClass('show');
		//js 控制公共弹窗显示与隐藏动画
		// basePopup.find('.popup-box').animate(
		// 	{
		// 		top: 0,
		// 		opacity: 0
		// 	}
		// 	,500,function(){
		// 	basePopup.fadeOut(300);
		// });
	})



})