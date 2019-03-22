var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d')
document.onclick = function(){
context.fillStyle = 'pink'
context.fillRect(0,0,canvas.width,canvas.height)
}
autoSetCanvasSize(canvas)
listenToUser(canvas)

var lineWidth = 3
var strokeStyle = "black"
light.onclick =function(){
 lineWidth = 3
}
bold.onclick = function(){
 lineWidth = 6
}
bolder.onclick = function(){
 lineWidth = 8
}
clear.onclick =function(){
  context.clearRect(0,0,canvas.width,canvas.height)
}

//橡皮铅笔激活状态
var eraserEnabled = false
eraser.onclick = function(){
  eraserEnabled = true
  //添加类，删除类
  eraser.classList.add('active')
  brush.classList.remove('active')
}
brush.onclick = function(){
  eraserEnabled = false
  brush.classList.add('active')
  eraser.classList.remove('active')
}

//调色器激活状态

red.onclick = function(){
  red.classList.add('active')
  blue.classList.remove('active')
  green.classList.remove('active')
  context.strokeStyle = "red"
}
blue.onclick = function(){
  blue.classList.add('active')
  red.classList.remove('active')
  green.classList.remove('active')
  context.strokeStyle = "blue"
}
green.onclick = function(){
  green.classList.add('active')
  blue.classList.remove('active')
  red.classList.remove('active')
  context.strokeStyle = "green"
}

download.onclick = function(){
  var url = canvas.toDataURL("image/png")
  var a = document.createElement('a')
  document.body.appendChild(a)
  a.href = url
  a.download = 'myjob.png'
  a.click()//调用a的click
}


//以下新内容，设置canvas宽高，获取页面宽高，设置canvas宽高和页面宽高一样


function createLine(x1,y1,x2,y2){
context.beginPath();
//context.strokeStyle = 'black'
context.lineWidth = lineWidth
context.moveTo(x1,y1)
context.lineTo(x2,y2)
context.stroke();
}

function createCircle(x,y,radius){
context.beginPath();
//context.fillStyle = 'black'
context.arc(x,y,radius,0,Math.PI*2)
context.fill();
}

function autoSetCanvasSize(canvas){
  window.onresize = function(){
  getWidthAndHeight()
    }//全局变量,不需要传入
  getWidthAndHeight()//获取宽高
  function getWidthAndHeight(){
  var pageWidth = document.documentElement.clientWidth
  var pageHeight = document.documentElement.clientHeight
  canvas.width = pageWidth
  canvas.height = pageHeight
}
}

function listenToUser(){
  var using = false
  var lastPoint = {x: undefined, y: undefined}
  //特性检测，检测是支持什么的设备
  if(document.body.ontouchstart !== undefined){
  //触屏设备
  canvas.ontouchstart = function(a){
   var x = a.touches['0'].clientX
   var y = a.touches['0'].clientY
   console.log(a)
   using = true
    if(eraserEnabled){
      context.clearRect(x-5,y-5,10,10)//因为清除是个正方形，为了保证中心
    }else{
      //createCircle(x,y,2)
      lastPoint = {'x': x, 'y': y}
  }

  }
  canvas.ontouchmove = function(a){
    var x = a.touches['0'].clientX
    var y = a.touches['0'].clientY
   
     if(!using){//只有鼠标按下，using才是true
     return}
   if(eraserEnabled){
    context.clearRect(x-5,y-5,10,10) 
    }else{
   //createCircle(x,y,2)
   var newPoint = {'x': x, 'y': y}
   createLine(lastPoint.x,lastPoint.y,newPoint.x,newPoint.y)
   lastPoint = newPoint
   }
  }
  canvas.ontouchend = function(){
    console.log('endtouch')
  }
    
}else{//电脑页面
canvas.onmousedown = function(a){
  var x = a.clientX
  var y = a.clientY
  using = true
  if(eraserEnabled){
    context.clearRect(x-5,y-5,10,10)//因为清除是个正方形，为了保证中心
  }else{
    //createCircle(x,y,2)
    lastPoint = {'x': x, 'y': y}
  }
}
  
canvas.onmousemove = function(a){
   x = a.clientX
   y = a.clientY
  
    if(!using){//只有鼠标按下，using才是true
    return}
  if(eraserEnabled){
   context.clearRect(x-5,y-5,10,10) 
   }else{
  //createCircle(x,y,2)
  var newPoint = {'x': x, 'y': y}
  createLine(lastPoint.x,lastPoint.y,newPoint.x,newPoint.y)
  lastPoint = newPoint
  }
 }

canvas.onmouseup = function(){
  using = false
}
}
}





















































/*var div = document.getElementById('canvas')
var painting = false
div.onmousedown = function(a){
  painting = true
  x = a.clientX
  y = a.clientY
  var divA = document.createElement('div')
  divA.style="width: 6px; height: 6px; "+
    "background:black; border-radius:3px;"+
    "position:absolute; left: "+(x-3)+"px;" +
    "top: "+(y-3)+"px;"
  div.appendChild(divA) 
}

div.onmousemove = function(a){
  if(painting){
  x = a.clientX
  y = a.clientY
  var divA = document.createElement('div')
  divA.style="width: 6px; height: 6px; "+
    "background:black; border-radius:3px;"+
    "position:absolute; left: "+(x-3)+"px;" +
    "top: "+(y-3)+"px;"
  div.appendChild(divA)
  }else{
    
  }
}
div.onmouseup = function(z){
  painting = false
}*/