// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/canvas.js":[function(require,module,exports) {
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var undo = document.getElementById('undo');
var historyDeta = [];
var lineWidth = 3;
var strokeStyle = "black";
var colorsArr = ['AliceBlue', 'AntiqueWhite', 'Aqua', 'Bisque', 'Black', 'BlanchedAlmond', 'Blue', 'BlueViolet', 'Brown', 'Chocolate', 'DarkOliveGreen', 'DarkOrange', 'ForestGreen', 'Fuchsia', 'HoneyDew', 'Indigo', 'LemonChiffon', 'LightCyan', 'LightSalmon', 'Lime', 'Maroon', 'Moccasin', 'SandyBrown', 'Thistle', 'OrangeRed'];
var colorUl = document.querySelector('.gridContainer');
var size = document.querySelector('.size');
var thickness = document.querySelector('input[type="range"]');
autoSetCanvasSize(canvas);
listenToUser(canvas);
createPalette();

thickness.onchange = function () {
  lineWidth = thickness.value;
};

colorUl.onclick = function (e) {
  var id = e.target.id;

  if (e.target.tagName === 'LI') {
    checkActive(colorsArr, id);
    e.target.classList.add('active');
    context.strokeStyle = e.target.id;
  }
};

undo.onclick = function (a) {
  if (historyDeta.length < 1) return false;
  context.putImageData(historyDeta[historyDeta.length - 1], 0, 0);
  historyDeta.pop();
};

clear.onclick = function () {
  context.clearRect(0, 0, canvas.width, canvas.height);
}; //橡皮铅笔激活状态


var eraserEnabled = false;

eraser.onclick = function () {
  eraserEnabled = true; //添加类，删除类

  eraser.classList.add('active');
  brush.classList.remove('active');
};

brush.onclick = function () {
  eraserEnabled = false;
  brush.classList.add('active');
  eraser.classList.remove('active');
};

download.onclick = function () {
  var url = canvas.toDataURL("image/png");
  var a = document.createElement('a');
  document.body.appendChild(a);
  a.href = url;
  a.download = 'myjob.png';
  a.click(); //调用a的click
}; //以下新内容，设置canvas宽高，获取页面宽高，设置canvas宽高和页面宽高一样


function createLine(x1, y1, x2, y2) {
  context.beginPath();
  context.lineCap = "round";
  context.lineJoin = "round"; //context.strokeStyle = 'black'

  context.lineWidth = lineWidth;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
}

function createCircle(x, y, radius) {
  context.beginPath(); //context.fillStyle = 'black'

  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
}

function autoSetCanvasSize(canvas) {
  window.onresize = function () {
    getWidthAndHeight();
  };

  getWidthAndHeight(); //获取宽高

  function getWidthAndHeight() {
    var pageWidth = document.documentElement.clientWidth;
    var pageHeight = document.documentElement.clientHeight;
    canvas.width = pageWidth;
    canvas.height = pageHeight;
  }
}

function listenToUser() {
  var using = false;
  var lastPoint = {
    x: undefined,
    y: undefined //特性检测，检测是支持什么的设备

  };

  if (document.body.ontouchstart !== undefined) {
    //触屏设备
    canvas.ontouchstart = function (a) {
      this.firstDot = context.getImageData(0, 0, canvas.width, canvas.height);
      saveData(this.firstDot);
      var x = a.touches['0'].clientX;
      var y = a.touches['0'].clientY;
      using = true;

      if (eraserEnabled) {
        context.clearRect(x - 5, y - 5, 10, 10); //因为清除是个正方形，为了保证中心
      } else {
        //createCircle(x,y,2)
        lastPoint = {
          'x': x,
          'y': y
        };
      }
    };

    canvas.ontouchmove = function (a) {
      var x = a.touches['0'].clientX;
      var y = a.touches['0'].clientY;

      if (!using) {
        //只有鼠标按下，using才是true
        return;
      }

      if (eraserEnabled) {
        context.clearRect(x - 5, y - 5, 10, 10);
      } else {
        //createCircle(x,y,2)
        var newPoint = {
          'x': x,
          'y': y
        };
        createLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
        lastPoint = newPoint;
      }
    };

    canvas.ontouchend = function () {
      console.log('endtouch');
      using = false;
    };
  } else {
    //电脑页面
    canvas.onmousedown = function (a) {
      var x = a.clientX;
      var y = a.clientY;
      using = true;
      this.firstDot = context.getImageData(0, 0, canvas.width, canvas.height); //在这里储存绘图表面

      saveData(this.firstDot);

      if (eraserEnabled) {
        context.clearRect(x - 5, y - 5, 10, 10); //因为清除是个正方形，为了保证中心
      } else {
        //createCircle(x,y,2)
        lastPoint = {
          'x': x,
          'y': y
        };
      }
    };

    canvas.onmousemove = function (a) {
      x = a.clientX;
      y = a.clientY;

      if (!using) {
        //只有鼠标按下，using才是true
        return;
      }

      if (eraserEnabled) {
        context.clearRect(x - 10, y - 10, 20, 20);
      } else {
        //createCircle(x,y,2)
        var newPoint = {
          'x': x,
          'y': y
        };
        createLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
        lastPoint = newPoint;
      }
    };

    canvas.onmouseup = function () {
      using = false;
    };
  }
}

function createPalette() {
  colorsArr.forEach(function (item, index) {
    var colorLi = document.createElement('li');
    colorLi.id = item;
    colorLi.style.backgroundColor = item;
    colorUl.append(colorLi);
  });
}

function saveData(data) {
  historyDeta.length === 10 && historyDeta.shift(); // 上限为储存10步，数组的第一个删除

  historyDeta.push(data);
} // 选中颜色添加 active 类，其他项如果有 active 则移除


function checkActive(arr, id) {
  arr.forEach(function (item) {
    // 检查其它项中是否有 active 类
    if (item !== id) {
      var otnerItem = document.querySelector("#".concat(item));

      if (otnerItem.classList.contains('active')) {
        otnerItem.classList.remove('active');
      }
    }
  });
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
},{}],"../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "60777" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/canvas.js"], null)
//# sourceMappingURL=/canvas.340782d3.js.map