
//封装常用功能
//浏览器检测
//利用三目运算符的扩展来替代if语句；利用匿名函数()()的形式自己调用
(function(){
	window.sys = {};   //给window添加属性,让外部可以访问
	var ua = navigator.userAgent.toLowerCase();   //存放浏览器版本信息字符串
	var s;    //存放浏览器名+版本号的数组
	(s = ua.match(/msie ([\d.]+)/)) ? sys.ie = s[1] :
	(s = ua.match(/firefox\/([\d.]+)/)) ? sys.firefox = s[1] :
	(s = ua.match(/chrome\/([\d.]+)/)) ? sys.chrome = s[1] :
	(s = ua.match(/opera\/.*version\/([\d.]+)/)) ? sys.opera = s[1] :
	(s = ua.match(/version\/([\d.]+).*safari/)) ? sys.safari = s[1] : 0;
})();

//DOM加载
//由于一些图片音频，外部问价等加载时间长，需要先加载DOM
function addDomLoaded(fn){
	if(document.addEventListener){   //W3C   DOMContentLoaded可以加载DOM
		addEvent(document,"DOMContentLoaded",function(){
			fn();
			removeEvent(document,"DOMContentLoaded",arguments.callee);   //匿名函数可以通过arguments.callee获取
		});
	}
	else{     //IE    通过doScroll的状态来判断DOM是否加载完毕，当DOM加载完毕就支持滚动条
		var timer;		//设置定时器定时调用doScroll来判断
		timer = setInterval(function(){
			try{
				document.documentElement.doScroll("left");
				fn();
			}catch(ex){
				
			}
		});
	}
}


//跨浏览器获取视口大小
function getInner(){
	if(typeof window.innerWidth != "undefined"){ //非IE
		return{
			width : window.innerWidth,
			height:window.innerHeight
		}
	}else{ //IE
		return{ 
			width:document.documentElement.clientWidth,
			height:document.documentElement.clientHeight
		}
	}
}

//跨浏览器获取滚动条位置
function getScroll(){
	return{
		top:document.documentElement.scrollTop || document.body.scrollTop,  //chrome用的是body.scrollTop
		left:document.documentElement.scrollLeft || document.body.scrollLeft
	}
}

//跨浏览器添加事件
function addEvent(obj,type,fn){
	if(obj.addEventListener){
		obj.addEventListener(type,fn,false);
	}else if(obj.attachEvent){
		obj.attachEvent("on"+type, fn);
	}else{
		obj["on" + type] = fn;
	}
}

//跨浏览器删除事件
function removeEvent(obj,type,fn){
	if(obj.removeEventListener){
		obj.removeEventListener(type,fn,false);
	}else if(obj.datechEvent){
		obj.datechEvent("on"+type, fn);
	}else{
		obj["on" + type] = null;
	}
}

//跨浏览器获取style
function getStyle(element,attr){
	var value;
	if(typeof window.getComputedStyle != 'undefined'){   //W3C
		value = window.getComputedStyle(element, null)[attr];
	}else if(typeof element.currentStyle != 'undefined'){  //IE
		value = element.currentStyle[attr];
	}
	return value;
}

//跨浏览器获取innerText
function getInnerText(element){    
	return (typeof element.textContent == 'string') ? element.textContent : element.innerText;
}

//跨浏览器设置innerText
function setInnerText(element,text){
	if(typeof element.textContent == 'string'){
		element.textContent = text;
	}else{
		element.innerText = text;
	}
}

//取消事件的默认行为
function preventDefault(e){
	var e = event || window.event;
	if(e.preventDefault)
	{
		e.preventDefault();
	}else{
		e.returnValue = false; //IE
	}
}

//阻止事件冒泡
function stopPropagation(e){
	var e = event || window.event;
	if(e.stopPropagation)
	{
		e.stopPropagation();
	}else{
		e.cancelBubble = ture;
	}
}

//删除左右空格
function trim(str){
	return str.replace(/(^\s*)|(\s*$)/g,"")
}

//滚动条清零
function scrollTop(){
	document.documentElement.screenTop = 0;
	document.body.screenTop = 0;
}