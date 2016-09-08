
$( function () {
	//个人中心
	$('#header .member').hover(function () {
		$(this).css('background', 'url(images/arrow2.png) no-repeat right center');
		$('#header .member_ul').show().animate({
			t : 30,
			step : 10,
			mul : {
				o : 100,
				h : 120
			}
		});
	}, function () {
		$(this).css('background', 'url(images/arrow.png) no-repeat right center');
		$('#header .member_ul').animate({
			t : 30,
			step : 10,
			mul : {
				o : 0,
				h : 0
			},
			fn : function(){
				$('#header .member_ul').hide();
			}
		});
	});
	
	//遮罩画布
	var screen = $('#screen');
	
	//登录框
	var login = $('#login');	
	login.center(350, 250).resize(function () {
		if (login.css('display') == 'block') {
			screen.lock();
		}
	});
	$('#header .login').click(function () {
		login.center(350, 250).css('display', 'block');
		screen.lock().animate({
			attr : 'o',
			target : 30,
			t : 50,
			step : 10
		});
	});
	$('#login .close').click(function () {
		login.css('display', 'none');
		screen.animate({
			attr : 'o',
			target : 0,
			t : 50,
			step : 10,
			fn : function(){
				screen.unlock();
			}
		});
	});
	
	//注册框
	var reg = $('#reg');
	var screen = $('#screen');
	reg.center(600, 550).resize(function () {
		if (reg.css('display') == 'block') {
			screen.lock();
		}
	});
	$('#header .reg').click(function () {
		reg.center(600, 550).css('display', 'block');
		screen.lock().animate({
			attr : 'o',
			target : 30,
			t : 50,
			step : 10
		});
	});
	$('#reg .close').click(function () {
		reg.css('display', 'none');
		screen.animate({
			attr : 'o',
			target : 0,
			t : 50,
			step : 10,
			fn : function(){
				screen.unlock();
			}
		});
	});
	
	//拖拽
	drag($().getId("login"));
	drag($().getId("reg"));
	
	//侧边栏位置初始化，始终在屏幕中间
	$('#share').css('top',getScroll().top + (getInner().height - 315)/2 + 'px');
	
	addEvent(window,'scroll', function(){
		$('#share').animate({
			attr : 'y',
			target : getScroll().top + (getInner().height - 315)/2
		});
	});
	
	//侧边栏缩放动画效果
	$('#share').hover(function(){
		$(this).animate({
			attr : 'x',
			target : 0
		});
	},function(){
		$(this).animate({
			attr : 'x',
			target : -211
		});
	});
	
	//滑动导航
	$('#nav .about li').hover(function(){
		var target = $(this).first().offsetLeft;
		$('#nav .nav_bg').animate({
			attr : 'x',
			target : target + 20,
			t : 30,
			step : 10,
			fn : function(){
				$('#nav .white').animate({
					attr : 'x',
					target : -target
				});
			}
		});
	},function(){
		$('#nav .nav_bg').animate({
			attr : 'x',
			target : 20,
			t : 30,
			step : 10,
			fn : function(){
				$('#nav .white').animate({
					attr : 'x',
					target : 0
				});
			}
		});
	});
	
	//左侧文章列表菜单
	$('#sidebar h2').toggle(function(){
		$(this).next().hide();
	},function(){
		$(this).next().show();
	});
	
	//表单验证

	//初始化表单
	$('form').first().reset();
	
	//验证用户名
	$('form').form('user').bind('focus',function(){    //光标点进输入框
		$('#reg .info_user').css('display','block');
		$('#reg .error_user').css('display','none');
		$('#reg .succ_user').css('display','none');
	}).bind('blur',function(){							//光标移出输入框
		if(trim($(this).value()) == ''){				//没有填写信息
		$('#reg .info_user').css('display','none');
		$('#reg .error_user').css('display','none');
		$('#reg .succ_user').css('display','none');
	}else if(!check_user()){   //信息不符合要求
		$('#reg .info_user').css('display','none');
		$('#reg .error_user').css('display','block');
		$('#reg .succ_user').css('display','none');
	}else{															//信息符合要求
		$('#reg .info_user').css('display','none');
		$('#reg .error_user').css('display','none');
		$('#reg .succ_user').css('display','block');
	}
	});
	
	function check_user(){
		if(/[\w]{2,20}/.test(trim($('form').form('user').value()))) return true;
	}
	

	//密码验证
	$('form').form('pass').bind('focus',function(){    //光标点进输入框
		$('#reg .info_pass').css('display','block');
		$('#reg .error_pass').css('display','none');
		$('#reg .succ_pass').css('display','none');
	}).bind('blur',function(){							//光标移出输入框
		if(trim($(this).value()) == ''){				//没有填写信息
		$('#reg .info_pass').css('display','none');
	}else{
		if(check_pass()){                                      //验证成功
			$('#reg .info_pass').css('display','none');
			$('#reg .error_pass').css('display','none');
			$('#reg .succ_pass').css('display','block');
		}else{                                            //验证失败
			$('#reg .info_pass').css('display','none');
			$('#reg .error_pass').css('display','block');
			$('#reg .succ_pass').css('display','none');
		}
	}
	});
	
	//密码强度验证
	$('form').form('pass').bind('keyup',function(){
		check_pass();
	});
	
	//密码验证函数
	function check_pass(){
	var value = trim($('form').form('pass').value()); 
	var code_type = 0;
	var value_length = value.length;
		
	//判断密码合法性
	if(value_length >= 6 && value_length <= 20){
		$('#reg .info_pass .q1').html('●').css('color','green');
	}else{
		$('#reg .info_pass .q1').html('○').css('color', '#666');
	}
		
	if(value_length > 0 && !/\s/.test(value)){   //长度大于0且不等于空字符
		$('#reg .info_pass .q2').html('●').css('color','green');
	}else{
		$('#reg .info_pass .q2').html('○').css('color', '#666');
	}
		
	if(/[0-9]/.test(value)){
		code_type++;
	}
	if(/[a-z]/.test(value)){
		code_type++;
	}
	if(/[A-Z]/.test(value)){
		code_type++;
	}
	if(/[^a-zA-Z0-9]/.test(value)){    //非空字符
		code_type++;
	}
		
	if(code_type >= 2){
		$('#reg .info_pass .q3').html('●').css('color','green');
	}else{
		$('#reg .info_pass .q3').html('○').css('color', '#666');
	}
		
	//判断密码安全强度
	if(value_length >= 10 && code_type >= 3){
		$('#reg .info_pass .s1').css('color','green');
		$('#reg .info_pass .s2').css('color','green');
		$('#reg .info_pass .s3').css('color','green');
		$('#reg .info_pass .s4').html('高').css('color','green');
	}else if(value_length >= 8 && code_type >= 2){
		$('#reg .info_pass .s1').css('color','#f60');
		$('#reg .info_pass .s2').css('color','#f60');
		$('#reg .info_pass .s3').css('color','#ccc');
		$('#reg .info_pass .s4').html('高').css('color','#f60');
	}else if(value_length >= 1){
		$('#reg .info_pass .s1').css('color','maroon');
		$('#reg .info_pass .s2').css('color','#ccc');
		$('#reg .info_pass .s3').css('color','#ccc');
		$('#reg .info_pass .s4').html('低').css('color','marooon');
	}else{
		$('#reg .info_pass .s1').css('color', '#ccc');
		$('#reg .info_pass .s2').css('color', '#ccc');
		$('#reg .info_pass .s3').css('color', '#ccc');
		$('#reg .info_pass .s4').html(' ').css('color', '#ccc');
	}
		
	if(value_length >= 6 && value_length <= 20 && !/\s/.test(value) && code_type >= 2){
		return true;
	}else{
		return false;
	}
}

	//再次输入密码
	$('form').form('notpass').bind('focus',function(){    //光标点进输入框
		$('#reg .info_notpass').css('display','block');
		$('#reg .error_notpass').css('display','none');
		$('#reg .succ_notpass').css('display','none');
	}).bind('blur',function(){							//光标移出输入框
		if(trim($(this).value()) == ''){				//没有填写信息
		$('#reg .info_notpass').css('display','none');
	}else{
		if(check_notpass()){        //验证成功
			$('#reg .info_notpass').css('display','none');
			$('#reg .error_notpass').css('display','none');
			$('#reg .succ_notpass').css('display','block');
		}else{                                            //验证失败
			$('#reg .info_notpass').css('display','none');
			$('#reg .error_notpass').css('display','block');
			$('#reg .succ_notpass').css('display','none');
		}
	}
	});
	
	function check_notpass(){
		if(trim($('form').form('pass').value()) == trim($('form').form('notpass').value()))  return true;
	}
	
	//验证提问选择
	$('form').form('ques').bind('change',function(){
		if(check_ques())   $('#reg .error_ques').css('display','none');
		
	});
	
	function check_ques(){
		if($('form').form('ques').value() != 0) return true;
	}
	
	//验证回答答案
		$('form').form('ans').bind('focus',function(){    //光标点进输入框
		$('#reg .info_ans').css('display','block');
		$('#reg .error_ans').css('display','none');
		$('#reg .succ_ans').css('display','none');
	}).bind('blur',function(){							//光标移出输入框
		if(check_ans()){				
		$('#reg .info_ans').css('display','none');
		$('#reg .error_ans').css('display','none');
		$('#reg .succ_ans').css('display','block');
	}else{
		$('#reg .info_ans').css('display','none');
	}
	});
	
	function check_ans(){
		if(trim($('form').form('ans').value()) != '') return true;
	}
	
	//验证电子邮箱
	$('form').form('email').bind('focus',function(){    //光标点进输入框
		if($(this).value().indexOf('@') == -1){
			$('#reg .all_email').css('display','block');
		}
		$('#reg .info_email').css('display','block');
		$('#reg .error_email').css('display','none');
		$('#reg .succ_email').css('display','none');
	}).bind('blur',function(){							//光标移出输入框
		$('#reg .all_email').css('display','none');
		if(trim($(this).value()) == ''){				//没有填写信息
		$('#reg .info_email').css('display','none');
	}else{
		if(check_email()){       //验证成功
			$('#reg .info_email').css('display','none');
			$('#reg .error_email').css('display','none');
			$('#reg .succ_email').css('display','block');
		}else{                                            //验证失败
			$('#reg .info_email').css('display','none');
			$('#reg .error_email').css('display','block');
			$('#reg .succ_email').css('display','none');
		}
	}
	});
	
	function check_email(){
		if(/^[\w\-\.]+@[\w\-]+(\.[a-zA-Z]{2,4}){1,2}$/.test(trim($('form').form('email').value())))  return true;
	}
	
	//电子邮箱扩展
	//鼠标移入移出
	$('#reg .all_email li').hover(function(){
		$(this).css('background','#e5edf2');	
	},function(){
		$(this).css('background','none');
	});
	
	//鼠标点击
	$('#reg .all_email li').bind('mousedown',function(){
		$('form').form('email').value($(this).text());
	});
	
	//输入内容
	$('form').form('email').bind('keyup',function(){
		if($(this).value().indexOf('@') == -1){
			$('#reg .all_email').css('display','block');
			$('#reg .all_email li span').html($(this).value());
		}else{
			$('#reg .all_email').css('display','none');
		}
		
		$('#reg .all_email li').css('background','none');
		
		//向下键
		if(event.keyCode == 40){
			if(this.index == undefined || this.index >= $('#reg .all_email li').length() - 1){
				this.index = 0;
			}else{
				this.index++;
			}
			$('#reg .all_email li').getElement(this.index).css('background','#e5edf2');
		}
		
		//向上键
		if(event.keyCode == 38){
			if(this.index == undefined || this.index <= 0){
				this.index = $('#reg .all_email li').length() - 1;
			}else{
				this.index--;
			}
			$('#reg .all_email li').getElement(this.index).css('background','#e5edf2');
		}
		
		//回车键
		if(event.keyCode == 13){
			$(this).value($('#reg .all_email li').getElement(this.index).text());
			$('#reg .all_email').css('display','none');
			this.index = undefined;
		}
		
	});
	
	
	//生日选择
	var year = $('form').form('year');
	var month = $('form').form('month');
	var day = $('form').form('day');
	
	var day30 = [4,6,9,11];
	var day31 = [1,3,5,7,8,10,12];
	
	//年
	for(var i = 1950; i <= 2016; i++){
		year.first().add(new Option(i,i), undefined);    //option(显示的文字，实际值value)
	}
	
	//月
	for(var i = 1; i <= 12; i++){
		month.first().add(new Option(i,i), undefined);    //option(显示的文字，实际值value)
	}
	
	//年、月必须有值才能选择日期
	year.bind('change',selectDay);
	month.bind('change',selectDay);
	day.bind('change',function(){
		if(check_birthday())  $('#reg .error_birthday').css('display','none');
	});
	
	function check_birthday(){
		if(year.value() != 0 && month.value() != 0 && day.value() != 0)  return true;
	}
	
	//日
	function selectDay(){
		if(year.value() != 0 && month.value()!= 0){
			//清除缓存
			day.first().options.length = 1;
			
			var cur_day = 0; //不确定的天数
			
			if(inArray(day31, parseInt(month.value()))){
				cur_day = 31;
			}else if(inArray(day30, parseInt(month.value()))){
				cur_day = 30;
			}else{
				if((parseInt(year.value()) % 4 == 0 && parseInt(year.value()) % 100 != 0) || parseInt((year.value()) % 400 == 0)){
					cur_day = 29;
				}else{
					cur_day = 28;
				}
			}
			
			for(var i = 1; i <= cur_day; i++){
				day.first().add(new Option(i, i), undefined);
			}
		}else{
			day.first().options.length = 1;
		}
	}
	
	//备注框
	$('form').form('ps').bind('keyup',check_ps).bind('paste',function(){  //粘贴行为
		setTimeout(check_ps,50);
	});
	
	function check_ps(){
		var num = 200 - $('form').form('ps').value().length;
		if(num > 0){
			$('#reg .ps').getElement(0).css('display','block');
			$('#reg .ps .num').getElement(0).html(num);
			$('#reg .ps').getElement(1).css('display','none');
			return true;
		}else{
			$('#reg .ps').getElement(0).css('display','none');
			$('#reg .ps').getElement(1).css('display','block');
			return false;
		}
	}
	
	//提交检测
	$('form').form('sub').click(function(){
		var flag = true;
		
		if(!check_user()){
			$('#reg .error_user').css('display','block');
			flag = false;
		}
		
		if(!check_pass()){
			$('#reg .error_pass').css('display','block');
			flag = false;
		}
		
		if(!check_ques()){
			$('#reg .error_ques').css('display','block');
			flag = false;
		}
		
		if(!check_ans()){
			$('#reg .error_ans').css('display','block');
			flag = false;
		}
		
		if(!check_email()){
			$('#reg .error_email').css('display','block');
			flag = false;
		}
		
		if(!check_birthday()){
			$('#reg .error_birthday').css('display','block');
			flag = false;
		}
		
		if(!check_ps()){
			flag = false;
		}
		
		if(flag){
			$('form').first().submit();
		}
	});
});

