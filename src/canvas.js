var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d')
var undo = document.getElementById('undo');
var historyDeta = [];
var lineWidth = 3
var strokeStyle = "black"

let colorsArr = ['AliceBlue', 'AntiqueWhite', 'Aqua', 'Bisque', 'Black', 'BlanchedAlmond', 'Blue', 'BlueViolet', 'Brown', 'Chocolate', 'DarkOliveGreen', 'DarkOrange', 'ForestGreen', 'Fuchsia', 'HoneyDew', 'Indigo', 'LemonChiffon', 'LightCyan', 'LightSalmon', 'Lime', 'Maroon', 'Moccasin', 'SandyBrown', 'Thistle', 'OrangeRed']
let colorUl = document.querySelector('.gridContainer')
let size = document.querySelector('.size')
let thickness = document.querySelector('input[type="range"]')
autoSetCanvasSize(canvas)
listenToUser(canvas)
createPalette()

thickness.onchange = () => {
  lineWidth = thickness.value
}

colorUl.onclick = (e) => {
  let id = e.target.id
  if (e.target.tagName === 'LI') {
    checkActive(colorsArr,id)
    e.target.classList.add('active')
    context.strokeStyle = e.target.id
  }
}

undo.onclick = function (a) {
  if (historyDeta.length < 1) return false;
  context.putImageData(historyDeta[historyDeta.length - 1], 0, 0);
  historyDeta.pop();
}

clear.onclick = function () {
  context.clearRect(0, 0, canvas.width, canvas.height)
}

//橡皮铅笔激活状态
var eraserEnabled = false
eraser.onclick = function () {
  eraserEnabled = true
  //添加类，删除类
  eraser.classList.add('active')
  brush.classList.remove('active')
}
brush.onclick = function () {
  eraserEnabled = false
  brush.classList.add('active')
  eraser.classList.remove('active')
}

download.onclick = function () {
  var url = canvas.toDataURL("image/png")
  var a = document.createElement('a')
  document.body.appendChild(a)
  a.href = url
  a.download = 'myjob.png'
  a.click() //调用a的click
}


//以下新内容，设置canvas宽高，获取页面宽高，设置canvas宽高和页面宽高一样


function createLine(x1, y1, x2, y2) {
  context.beginPath();
  context.lineCap = "round";
  context.lineJoin = "round";
  //context.strokeStyle = 'black'
  context.lineWidth = lineWidth
  context.moveTo(x1, y1)
  context.lineTo(x2, y2)
  context.stroke();
  context.closePath();
}

function createCircle(x, y, radius) {
  context.beginPath();
  //context.fillStyle = 'black'
  context.arc(x, y, radius, 0, Math.PI * 2)
  context.fill();
}

function autoSetCanvasSize(canvas) {
  window.onresize = function () {
    getWidthAndHeight()
  } 
  getWidthAndHeight() //获取宽高
  function getWidthAndHeight() {
    var pageWidth = document.documentElement.clientWidth
    var pageHeight = document.documentElement.clientHeight
    canvas.width = pageWidth
    canvas.height = pageHeight
  }
}




function listenToUser() {
  var using = false
  var lastPoint = {
    x: undefined,
    y: undefined
  }
  //特性检测，检测是支持什么的设备
  if (document.body.ontouchstart !== undefined) {
    //触屏设备
    canvas.ontouchstart = function (a) {
      this.firstDot = context.getImageData(0, 0, canvas.width, canvas.height);
      saveData(this.firstDot);
      var x = a.touches['0'].clientX
      var y = a.touches['0'].clientY
      using = true
      if (eraserEnabled) {
        context.clearRect(x - 5, y - 5, 10, 10) //因为清除是个正方形，为了保证中心
      } else {
        //createCircle(x,y,2)
        lastPoint = {
          'x': x,
          'y': y
        }
      }

    }
    canvas.ontouchmove = function (a) {
      var x = a.touches['0'].clientX
      var y = a.touches['0'].clientY

      if (!using) { //只有鼠标按下，using才是true
        return
      }
      if (eraserEnabled) {
        context.clearRect(x - 5, y - 5, 10, 10)
      } else {
        //createCircle(x,y,2)
        var newPoint = {
          'x': x,
          'y': y
        }
        createLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
        lastPoint = newPoint
      }
    }
    canvas.ontouchend = function () {
      console.log('endtouch')
      using = false
    }

  } else { //电脑页面
    canvas.onmousedown = function (a) {
      var x = a.clientX
      var y = a.clientY
      using = true
      this.firstDot = context.getImageData(0, 0, canvas.width, canvas.height); //在这里储存绘图表面
      saveData(this.firstDot);
      if (eraserEnabled) {
        context.clearRect(x - 5, y - 5, 10, 10) //因为清除是个正方形，为了保证中心
      } else {
        //createCircle(x,y,2)
        lastPoint = {
          'x': x,
          'y': y
        }
      }
    }

    canvas.onmousemove = function (a) {
      x = a.clientX
      y = a.clientY

      if (!using) { //只有鼠标按下，using才是true
        return
      }
      if (eraserEnabled) {
        context.clearRect(x - 10, y - 10, 20, 20)
      } else {
        //createCircle(x,y,2)
        var newPoint = {
          'x': x,
          'y': y
        }
        createLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
        lastPoint = newPoint
      }
    }

    canvas.onmouseup = function () {
      using = false
    }
  }
}

function createPalette() {
  colorsArr.forEach((item, index) => {
    let colorLi = document.createElement('li')
    colorLi.id = item
    colorLi.style.backgroundColor = item
    colorUl.append(colorLi)
  })
}

function saveData(data) {
  (historyDeta.length === 10) && (historyDeta.shift()); // 上限为储存10步，数组的第一个删除
  historyDeta.push(data);
}

// 选中颜色添加 active 类，其他项如果有 active 则移除
function checkActive(arr,id){
  arr.forEach(item => {
    // 检查其它项中是否有 active 类
    if (item !== id) {
      let otnerItem = document.querySelector(`#${item}`)
      if (otnerItem.classList.contains('active')) {
        otnerItem.classList.remove('active')
      }
    }
  })
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