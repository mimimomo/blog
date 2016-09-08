//封装库函数

//前台调用，避免重复new
var $ = function(args){
	return new Base(args);
}

//基础库
function Base(args){
	//创建一个数组来保存获取的节点和节点数组
	this.elements = [];
	
	if(typeof args == "string"){   
		if(args.indexOf(" ") != -1){        //css模拟
			var elements = args.split(" ");   //把节点拆开分别保存带数组里
			var childElements = [];			  //存放临时节点对象的数组，解决覆盖问题
			var node = [];					  //存放父节点
			for(var i = 0;i<elements.length;i++){
				if(node.length == 0){
					node.push(document);
				}
				switch(elements[i].charAt(0)){   
					case"#":
						childElements = [];    //清除临时节点，以便父节点无效，子节点有效
						childElements.push(this.getId(elements[i].substring(1)));
						node = childElements;   //保存到父节点
						break;
					case".":
						childElements = [];
						for(var j = 0;j<node.length;j++){
							var temps = this.getClass(elements[i].substring(1),node[j]);
							for(var k = 0;k<temps.length;k++){
								childElements.push(temps[k]);
							}
						}
						node = childElements;   //保存到父节点
						break;
					default:
						childElements = [];
						for(var j = 0;j<node.length;j++){
							var temps = this.getTagName(elements[i],node[j]);
							for(var k = 0;k<temps.length;k++){
								childElements.push(temps[k]);
							}
						}
						node = childElements;   //保存到父节点
				}
			}
			this.elements = childElements;
		}else{     //find模拟
			switch(args.charAt(0)){
				case"#":
					this.elements.push(this.getId(args.substring(1)));
					break;
				case".":
					this.elements.push(this.getClass(args.substring(1)));
					break;
				default:
					this.elements = this.getTagName(args);
			} 
		}
	}else if(typeof args == "object"){
		if(args != undefined){
			this.elements[0] = args;
		}
	}else if(typeof args == "function"){
		this.ready(args);
	}
}

//addDomLoaded   DOM加载
Base.prototype.ready = function(fn){
	addDomLoaded(fn);
};


//获取ID节点
Base.prototype.getId = function(id){
	return document.getElementById(id);
};
	
//获取元素节点
Base.prototype.getTagName = function(tag,parentNode){
	var node = null;
	var temps = [];
	if(parentNode != undefined){
		node = parentNode;
	}else{
		node = document;
	}
	var tags = node.getElementsByTagName(tag);
	for(var i = 0; i<tags.length;i++){
		temps.push(tags[i]);
	}
	return temps;
};

//获取当前节点的同级下一个元素节点
Base.prototype.next = function(){
	for(var i = 0; i<this.elements.length;i++){
		this.elements[i] = this.elements[i].nextSibling;
		if(this.elements[i] ==null){
			throw new Error("not found the next element");
		}
		if(this.elements[i].nodeType == 3){   //如果是空白符，递归调用
			this.next();
		}
	}
	return this;
};

//获取当前节点的同级上一个元素节点
Base.prototype.prev = function(){
	for(var i = 0; i<this.elements.length;i++){
		this.elements[i] = this.elements[i].previousSibling;
		if(this.elements[i] ==null){
			throw new Error("not found the previous element");
		}
		if(this.elements[i].nodeType == 3){   //如果是空白符，递归调用
			this.prev();
		}
	}
	return this;
};

//获取CLASS节点数组
Base.prototype.getClass = function(className,parentNode){
	var node = null;
	var temps = [];
	//如果参数有父节点，就先找到相应的父节点再找相应的class；如果没有，就先获取所有节点
	if(parentNode != undefined){
		node = parentNode;
	}
	else{
		node = document;
	}
	//先获取所有节点，然后再获取相应class的节点数组
	var all = node.getElementsByTagName("*");
	for(var i = 0; i < all.length; i++){
		if((new RegExp('(\\s|^)'+className+'(\\s|$)')).test(all[i].className)){
			temps.push(all[i]);
		}
	}
	return temps;
}

//设置css选择器子节点
Base.prototype.find = function(str){
	var childElements = [];
	for(var i = 0; i < this.elements.length; i++){
			switch(str.charAt(0)){
				case"#":
					childElements.push(this.getId(str.substring(1)));
					break;
				case".":
					var temps = this.getClass(str.substring(1),this.elements[i])
					for(var j = 0;j < temps.length; j++){
						childElements.push(temps[j]);
					}
					break;
				default:
					var temps = this.getTagName(str,this.elements[i]);
					for(var j = 0;j < node.length;j ++){
							childElements.push(temps[j]);
					}
			}
	}
	this.elements = childElements;
	return this;
};

//获取某个节点
Base.prototype.getElement = function(num){
	var element = this.elements[num];
	this.elements = [];
	this.elements[0] = element;
	return this;
};

//获取首节点，并返回节点对象
Base.prototype.first = function(){
	return this.elements[0];
};

//设置CSS样式
//如果arguments.length == 1，说明是get;否则就是set
Base.prototype.css = function(attr,value){    //(属性，属性值)
	for(var i = 0;i<this.elements.length;i++){
		//获取属性值
		if(arguments.length == 1){			//外部css需要通过计算转换
			return getStyle(this.elements[i], attr);
		}
		//设置属性值
		this.elements[i].style[attr] = value;  //
		}
	return this;

};

//添加class
Base.prototype.addClass = function(className){
	for(var i = 0;i<this.elements.length;i++){
		if(!this.elements[i].className.match(new RegExp('(\\s|^)' +className +'(\\s|$)'))){  //避免重复的class
			this.elements[i].className += ' '+className;
		}
	}
	return this;
}

//移除class
Base.prototype.removeClass = function(className){
	for(var i = 0;i<this.elements.length;i++){
		if(this.elements[i].className.match(new RegExp('(\\s|^)' +className +'(\\s|$)'))){
			this.elements[i].className = this.elements[i].className.replace(new RegExp('(\\s|^)' +className +'(\\s|$)'),' ');
		}
	}
	return this;
}

//设置innerHTML
Base.prototype.html = function(str){
	for(var i = 0; i<this.elements.length;i++){
		if(arguments.length == 0){
			return this.elements[i].innerHTML;   //获取innerHTNL
		}
		this.elements[i].innerHTML = str;
	}
	return this;
};

//设置表单字段元素
Base.prototype.form = function(name){
	for(var i = 0; i<this.elements.length;i++){
		this.elements[i] = this.elements[i][name];
	}
	return this;
};

//获取/设置表单字段内容
Base.prototype.value = function(str){
	for(var i = 0; i<this.elements.length;i++){
		if(arguments.length == 0){
			return this.elements[i].value;   //获取
		}
		this.elements[i].value = str;        //设置
	}
	return this;
};

//设置事件发生器（当某一元素发生某一行为时执行相应函数）
Base.prototype.bind = function(event,fn){
	for(var i = 0; i<this.elements.length;i++){
		addEvent(this.elements[i],event,fn);
	}
	return this;
};

//设置鼠标移入移出方法
Base.prototype.hover = function(over,out){
	for(var i = 0; i<this.elements.length;i++){
		//this.elements[i].onmouseover = over;
		//this.elements[i].onmouseout = out;
		addEvent(this.elements[i],"mouseover",over);
		addEvent(this.elements[i],"mouseout",out);
	}
	return this;
};

//设置显示
Base.prototype.show = function(){
	for(var i = 0; i<this.elements.length;i++){
		this.elements[i].style.display = "block";
	}
	return this;
};

//设置隐藏
Base.prototype.hide = function(){
	for(var i = 0; i<this.elements.length;i++){
		this.elements[i].style.display = "none";
	}
	return this;
};

//设置物体居中

Base.prototype.center = function(width,height){
	var top = (getInner().height - height)/2;
	var left = (getInner().width - width)/2;
	for(var i = 0; i<this.elements.length;i++){
		this.elements[i].style.top = top+"px";
		this.elements[i].style.left = left+"px";
	}
	return this;
};

//锁屏功能
Base.prototype.lock = function(){
	for(var i = 0; i<this.elements.length;i++){
		this.elements[i].style.width = getInner().width+"px";
		this.elements[i].style.height = getInner().height+"px";
		this.elements[i].style.display = "block";
		document.documentElement.style.overflow = "hidden";   //隐藏滚动条
		addEvent(window,"scroll",screenTop);
		//window.onscroll = screenTop;
	}
	return this;
};

//解除锁屏功能
Base.prototype.unlock = function(){
	for(var i = 0; i<this.elements.length;i++){
		this.elements[i].style.display = "none";  
		document.documentElement.style.overflow = "auto";   //关闭登录框之后滚动条状态恢复默认状态
		removeEvent(window,"scroll",screenTop);
	}
	return this;
};

//触发点击事件
Base.prototype.click = function(fn){
	for(var i = 0; i<this.elements.length;i++){
		addEvent(this.elements[i],"click",fn)
		//this.elements[i].onclick = fn;
	}
	return this;
};

//设置点击切换方法
Base.prototype.toggle = function(){
	for(var i = 0; i<this.elements.length;i++){
		//使用闭包简化函数，args表示传递的参数
		(function(element,args){
			var count = 0;   //计数器
			addEvent(element,'click',function(){
				args[count++ % args.length].call(this);  //让每个element都有独立的计数器，call(this)表示当前点击的元素
			});
		})(this.elements[i],arguments);     
	}
	return this;
};

//设置innerText
Base.prototype.text = function(str){
	for(var i = 0; i<this.elements.length;i++){
		if(arguments.length == 0){
			return getInnerText(this.elements[i]);
		}
		 setInnerText(this.elements[i],str);
	}
	return this;
};

//获取某组节点的数量
Base.prototype.length = function () {
	return this.elements.length;
};

//触发浏览器窗口事件,响应式变化，div永远在可视窗口
Base.prototype.resize = function (fn) {
	for (var i = 0; i < this.elements.length; i ++) {
		var element = this.elements[i];
		addEvent(window,"resize", function (){
			fn();
			if (element.offsetLeft > getInner().width - element.offsetWidth) {
				element.style.left = getInner().width - element.offsetWidth + 'px';
			}
			if (element.offsetTop > getInner().height - element.offsetHeight) {
				element.style.top = getInner().height - element.offsetHeight + 'px';
			}
		});
	}
	return this;
}

//获取末个节点，并返回这个节点对象
Base.prototype.last = function () {
	return this.elements[this.elements.length - 1];
};

//查找某个值是否在某一数组中
function inArray(array,value){
	for(var i in array){
		if(array[i] === value){
			return true;
		}else{
		return false;
		}
	}
}

//拖拽功能
//获取实时的位置，div不能超出可视窗口
function drag(elem){
	addEvent(elem,"mousedown",function(e){
		var e = event || window.event;
		//鼠标点击时鼠标与div边框的距离 = 点击时鼠标与窗口的距离 - 点击时div边框与窗口的距离
		var diffX = e.clientX - this.offsetLeft;   
		var diffY = e.clientY - this.offsetTop; 
		
		addEvent(document,"mousemove", move);
		//document.onmousemove = move;
		function move(e){
			var e = event || window.event;
			
			//鼠标移动时div边框与窗口的距离 = 移动时鼠标与窗口的距离 - 移动时鼠标与div边框的距离
			var left = e.clientX - diffX;
			var top = e.clientY - diffY;
			
			if(left < 0){
				left = 0;
			}else if(left > getInner().width - elem.offsetWidth){
				left = getInner().width - elem.offsetWidth;
			}
			
			if(top < 0){
				top = 0;
			}else if(top > getInner().height - elem.offsetHeight){
				top = getInner().height - elem.offsetHeight;
			}
			//鼠标移动时div边框与窗口的实时距离
			elem.style.left = left + "px";   
			elem.style.top = top + "px";
		}
		
		addEvent(document,"mouseup",up);
		//document.onmouseup = up;
		function up(){
			removeEvent(document,"mousemove",move);
			removeEvent(document,"mouseup",up);
			//this.onmousemove = null;
			//this.onmouseup = null;
		}
	});
}

//设置动画
Base.prototype.animate = function (obj) {
	
	for (var i = 0; i < this.elements.length; i ++) {
		
		var element = this.elements[i];
		var attr = obj['attr'] == 'x' ? 'left' :obj['attr'] == 'y' ? 'top' :        //选填（x轴/y轴/透明度）。如果没有传参，默认left（在x轴方向运动）
					obj['attr'] == 'o' ? 'opacity' : 'left';    
		var start = obj['start'] != undefined ? obj['start'] :                      //选填（起始位置）。如果没有传参，默认这个值为透明度动画
												attr == 'opacity' ? parseFloat(getStyle(element,attr)) * 100 :
																	parseInt(getStyle(element,attr));
		var t = obj['t'] != undefined ? obj['t'] : 10;                     //选填（定时调用时间间隔）。如果没有参数，默认值为10毫秒
		var step = obj['step'] != undefined ? obj['step'] : 20;                     //选填（每次运动的步长）。如果没有参数，默认参数为20px
	
		var alter = obj['alter'];                                                   //必填增量
		var target = obj['target'];                                                 //必填目标值
		var mul = obj['mul'];     													//同步动画
		
		var speed = obj['speed'] != undefined ? obj['speed'] : 6;                   //选填（运动速度）。如果没有传参，默认参数为6px/s
		var type = obj['type'] == 0 ? 'constant' : obj['type'] == 1 ? 'buffer' : 'buffer';  //选填（匀速运动/变速运动）。如果没有传参，默认值为变速
		
		if(alter != undefined && target != undefined){
			target = alter + start;
		}else if(alter == undefined && target == undefined && mul == undefined){
			throw new Error("alter / target  is undefined!");
		}
	
		if(start > target)   //如果起始值大于目标值，说明是向左运动
		{
			step = -step;
		}
		
		if(attr == 'opacity'){
			element.style.opacity = parseInt(start) / 100;
			element.style.filter = 'alpha(opacity='+parseInt(start)+')';
		}else{
			element.style[attr] = start +'px'; 
		}
		
		if(mul == undefined){   // 如果没有传mul，就把attr和target传到mul里进行处理
			mul = {};
			mul[attr] = target;
		}
		
		//element.timer表示只创建了一个定时器，所有动画都同用一个
		clearInterval(element.timer);
		element.timer = setInterval(function(){
			var flag = true;   //true表示所有的动画都执行完毕了
			for(var i in mul){
				attr = i =='x' ? 'left' : i == 'y' ? 'top' :
						i == 'w' ? 'width' : i == 'h' ? 'height' :
						i == 'o' ? 'opacity' : i != undefined ? i : 'left';
				target = mul[i];
			
			
				if(type == 'buffer'){
					step = attr == 'opacity' ? (target - parseFloat(getStyle(element,attr))*100) /speed :   //透明度
												(target - parseInt(getStyle(element,attr)))/speed;          //位移
					step = step > 0 ? Math.ceil(step) : Math.floor(step);
				}
				
				if(attr == 'opacity'){  //透明度
					//如果step等于0说明已经到达目标值
					//如果即将达到目标值但是差值比step小，就直接让他等于目标值
					if(step == 0){
						setOpacity();
					}
					else if(step > 0 && Math.abs(parseFloat(getStyle(element,attr))*100 - target) <= step){    
						setOpacity();
					}else if(step < 0 && (parseFloat(getStyle(element,attr))*100 - target) <= Math.abs(step)){
						setOpacity();
					}else{
						var temp = parseFloat(getStyle(element,attr)) * 100;
						element.style.opacity = parseInt(temp + step) / 100;
						element.style.filter = 'alpha(opacity('+ parseInt(temp + step) +')';
					}
					
					//如果当前值不等于目标值，flag=false
					if(parseInt(target) != parseInt(parseFloat(getStyle(element,attr))*100)){
						flag = false;
					}
					
				}else{     //位移
			
					if(step == 0){
						setTarget();
					}else if(step > 0 && Math.abs(parseInt(getStyle(element,attr)) - target) <= step){
						setTarget();
					}else if(step < 0 && (parseInt(getStyle(element,attr)) - target) <= Math.abs(step)){
						setTarget();
					}else{
						element.style[attr]= parseInt(getStyle(element,attr)) + step +'px';
					}
					if(parseInt(target) != parseInt(getStyle(element,attr))){
						flag = false;
					}
				}
			}
			//当有多个动画时，最后一个动画结束后再清理定时器（实现同步动画）
			if(flag){
				clearInterval(element.timer);
				if(obj.fn != undefined){
					obj.fn();
				}
			}
			
		},t);
		
		function setTarget(){
			element.style[attr] = target + 'px';
		}
		
		function setOpacity(){
			element.style.opacity = parseInt(target) / 100;
			element.style.filter = 'alpha(opacity='+ parseInt(target) +')';
		}
	}
	return this;
};


