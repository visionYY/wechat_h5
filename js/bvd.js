(function ($) {
  window.onunload = function () {
    window.localStorage.setItem('mytest', 11111)
  }
  var bvd = function (dom) {
    var that = this;
    $.ready(function () {
      //获取视频元素
      that.video = document.querySelector(dom || "video");
      //获取视频父元素
      that.vRoom = that.video.parentNode;
      //元素初始化
      that.initEm();
      //事件初始化
      that.initEvent();
      //记录信息
      that.initInfo();
      //当前播放模式 false 为 mini播放
      that.isMax = false;
    });
  };

  var pro = bvd.prototype;

  //记录信息
  pro.initInfo = function () {
    var that = this;
    //在onload状态下，offsetHeight才会获取到正确的值
    window.onload = function () {
      that.miniInfo = {
        //mini状态时的样式
        width: that.video.offsetWidth + "px",
        height: that.video.offsetHeight + "px",
        position: that.vRoom.style.position,
        transform: "translate(0,0) rotate(0deg)"
      };

      var info = [
          document.documentElement.clientWidth || document.body.clientWidth,
          document.documentElement.clientHeight || document.body.clientHeigth
        ],
        w = info[0],
        h = info[1],
        cha = Math.abs(h - w) / 2;

      that.maxInfo = {
        //max状态时的样式
        zIndex: 99,
        width: h + "px",
        height: w + "px",
        position: "fixed",
        transform: "translate(-" + cha + "px," + cha + "px) rotate(90deg)"
      };
    };
  };

  pro.initEm = function () {
    //先添加播放按钮
    this.vtop = document.createElement("img");
    this.vtop.src = "../images/icon_zuojin@2x.png";
    this.vtop.className = "vtop";
    this.vRoom.appendChild(this.vtop);

    // 暂停中间按钮
    this.simg = document.createElement("img");
    this.simg.src = "../images/pause.png";
    this.simg.className = "pause";
    this.vRoom.appendChild(this.simg);

    //先添加播放按钮
    this.vbelow = document.createElement("img");
    this.vbelow.src = "../images/icon_youjin@2x.png";
    this.vbelow.className = "vbelow";
    this.vRoom.appendChild(this.vbelow);

    //先添加播放按钮
    this.vaudio = document.createElement("img");
    this.vaudio.src = "../images/icon_yinpin@2x.png";
    this.vaudio.className = "vaudio";
    this.vRoom.appendChild(this.vaudio);

    //先添加播放按钮
    this.vcollect = document.createElement("img");
    this.vcollect.src = "../images/icon_vshoucang.png";
    this.vcollect.className = "vcollect";
    this.vRoom.appendChild(this.vcollect);

    //先添加播放按钮
    this.vimg = document.createElement("img");
    this.vimg.src = "../images/play2.png";
    this.vimg.className = "vplay";
    this.vRoom.appendChild(this.vimg);

    //添加控制条
    this.vC = document.createElement("div");
    this.vC.classList.add("controls");
    this.vC.innerHTML =
      '<div><div class="progressBar"><span id="cricle"></span><div class="timeBar"></div></div></div><div><span class="current">00:00</span><span class="duration">00:00</span></div><div><img class="fill" src="' +
      "../images/icon_quanping@2x.png" +
      '" alt=""></div>';
    this.vRoom.appendChild(this.vC);
  };
  var nowPage = "small";

  pro.initEvent = function () {
    var that = this;
    var isScroll = false;

    //给播放按钮图片添加事件
    this.vimg.addEventListener("tap", function () {
      isScroll = false;
      that.video.play();
    });

    //获取到元数据
    this.video.addEventListener("loadedmetadata", function () {
      that.vDuration = this.duration;
      that.vC.querySelector(".duration").innerHTML = stom(that.vDuration);
    });

    var allEvents = {};
    //视频播放事件
    this.video.addEventListener("play", function () {
      if (!isScroll) {
        that.vimg.style.display = "none";
        that.simg.style.display = "block";
        setTimeout(function () {
          that.simg.style.display = "none";
          that.vtop.style.display = "none";
          that.vbelow.style.display = "none";
          that.vaudio.style.display = "none";
          that.vcollect.style.display = "none";
          that.vC.classList.add("vhidden");
          that.vC.style.visibility = "hidden";
        });
      }

      var isThat = this;
      if (nowPage == "small") {
        // 拖动开始的X轴距离
        var startX = 0;
        // 距离左边的距离
        var leftAll = 0;
        // 进度条元素总长度
        var allW = parseFloat(
          getComputedStyle(that.vC.querySelector(".progressBar"), null)["width"]
        );
        var btnLeft = 0;

        function smallStart(e) {
          allEvents.touchstart = 1;
          isThat.pause();
          startX = e.touches[0].clientX;
          btnLeft = getComputedStyle(that.vC.querySelector("#cricle"), null)[
            "left"
          ];
        }

        function smallEnd(e) {
          allEvents.touchend = 1;
          var overTime = stom((leftAll / allW) * isThat.duration);
          that.vC.querySelector(".current").innerHTML = overTime;
          var nowTime =
            Math.round((leftAll / allW) * isThat.duration) - isThat.currentTime;
          that.setCurrentTime(nowTime);
          that.vimg.style.display = "none";
          that.simg.style.display = "block";
          isScroll = true;
          that.video.play();
        }

        function smallMove(e) {
          allEvents.touchmove = 1;
          var endFlo = e.touches[0].clientX - startX + parseFloat(btnLeft);
          if (endFlo > allW) {
            endFlo = allW;
          } else if (endFlo < 0) {
            endFlo = 0;
          }
          leftAll = endFlo;
          that.vC.querySelector(".timeBar").style.width = endFlo + "px";
          that.vC.querySelector("#cricle").style.left = endFlo + "px";
        }

        // 滚动条圆点拖动开始
        that.vC
          .querySelector("#cricle")
          .addEventListener("touchstart", smallStart, false);
        // 滚动条圆点拖动时
        that.vC
          .querySelector("#cricle")
          .addEventListener("touchmove", smallMove, false);
        // 滚动条圆点拖动结束
        that.vC
          .querySelector("#cricle")
          .addEventListener("touchend", smallEnd, false);
      } else {
        // 拖动开始的X轴距离
        var startY = 0;
        // 距离左边的距离
        var leftAll = 0;
        // 进度条元素总长度
        var allW = parseFloat(
          getComputedStyle(that.vC.querySelector(".progressBar"), null)["width"]
        );
        var btnLeft = 0;

        // 滚动条圆点拖动开始
        that.vC
          .querySelector("#cricle")
          .addEventListener("touchstart", function (e) {
            isThat.pause();
            startY = e.touches[0].clientY;
            btnLeft = getComputedStyle(that.vC.querySelector("#cricle"), null)[
              "left"
            ];
          });
        // 滚动条圆点拖动时
        that.vC
          .querySelector("#cricle")
          .addEventListener("touchmove", function (e) {
            var endFlo = e.touches[0].clientY - startY + parseFloat(btnLeft);
            if (endFlo > allW) {
              endFlo = allW;
            } else if (endFlo < 0) {
              endFlo = 0;
            }
            leftAll = endFlo;
            that.vC.querySelector(".timeBar").style.width = endFlo + "px";
            that.vC.querySelector("#cricle").style.left = endFlo + "px";
          });
        // 滚动条圆点拖动结束
        that.vC
          .querySelector("#cricle")
          .addEventListener("touchend", function (e) {
            var overTime = stom((leftAll / allW) * isThat.duration);
            that.vC.querySelector(".current").innerHTML = overTime;
            var nowTime =
              Math.round((leftAll / allW) * isThat.duration) -
              isThat.currentTime;
            that.setCurrentTime(nowTime);
            that.vimg.style.display = "none";
            that.simg.style.display = "block";
            isScroll = true;
            that.video.play();
          });
      }
    });

    //视频播放中事件
    this.video.addEventListener("timeupdate", function () {
      var currentPos = this.currentTime; //获取当前播放的位置
      //更新进度条
      var percentage = (100 * currentPos) / that.vDuration;
      that.vC.querySelector("#cricle").style.left = percentage + "%";
      that.vC.querySelector(".timeBar").style.width = percentage + "%";

      //更新当前播放时间
      that.vC.querySelector(".current").innerHTML = stom(currentPos);
    });

    //视频点击暂停或播放事件
    this.video.addEventListener("tap", function () {
      if (this.paused || this.ended) {
        //暂停时点击就播放
        if (this.ended) {
          //如果播放完毕，就重头开始播放
          this.currentTime = 0;
        }
        isScroll = false;
        this.play();
      } else {
        //播放时点击就暂停
        // this.pause();
        var olthat = this;
        that.simg.addEventListener("tap", function () {
          that.vimg.style.display = "block";
          that.simg.style.display = "none";
          olthat.pause();
        });
        if (that.vtop.style.display == "none") {
          that.simg.style.display = "block";
          that.vtop.style.display = "block";
          that.vbelow.style.display = "block";
          that.vaudio.style.display = "block";
          that.vcollect.style.display = "block";
          that.vC.classList.remove("vhidden");
          that.vC.style.visibility = "visible";
        } else {
          that.simg.style.display = "none";
          that.vtop.style.display = "none";
          that.vbelow.style.display = "none";
          that.vaudio.style.display = "none";
          that.vcollect.style.display = "none";
          that.vC.classList.add("vhidden");
          that.vC.style.visibility = "hidden";
        }
      }
    });

    //暂停or停止
    this.video.addEventListener("pause", function () {
      that.simg.style.display = "none";
      that.vimg.style.display = "block";
      that.vtop.style.display = "block";
      that.vbelow.style.display = "block";
      that.vaudio.style.display = "block";
      that.vcollect.style.display = "block";
      that.vC.classList.remove("vhidden");
      that.vC.style.visibility = "visible";
      that.vCt && clearTimeout(that.vCt);
    });

    //转换音频
    this.vaudio.click(function () {});

    //视频手势右滑动事件
    this.eve("swiperight", function () {
      if (that.isMax) {
        return that.setVolume(0.2);
      }
      that.setCurrentTime(10);
    });

    //视频手势左滑动事件
    this.eve("swipeleft", function () {
      if (that.isMax) {
        return that.setVolume(-0.2);
      }
      that.setCurrentTime(-10);
    });

    //视频手势上滑动事件
    this.eve("swipeup", function () {
      if (that.isMax) {
        return that.setCurrentTime(-5);
      }
      that.setVolume(0.2);
    });

    //视频手势下滑动事件
    this.eve("swipedown", function () {
      if (that.isMax) {
        return that.setCurrentTime(5);
      }
      that.setVolume(-0.2);
    });

    this.vC.querySelector(".fill").addEventListener("tap", function () {
      //that.nativeMax();
      that.switch();
      if (nowPage == "small") {
        nowPage = "lage";
      } else {
        nowPage = "small";
      }
    });
  };

  //全屏 mini 两种模式切换
  pro.switch = function () {
    if (nowPage == 'small') {
      document.getElementsByClassName('controls')[0].getElementsByTagName('div')[0].style.width = "80%"
      document.getElementsByClassName('controls')[0].getElementsByTagName('div')[3].style.flex = 15
    } else {
      document.getElementsByClassName('controls')[0].getElementsByTagName('div')[0].style.width = "64%"
    }
    var vR = this.vRoom;
    //获取需要转换的样式信息
    var info = this.isMax ? this.miniInfo : this.maxInfo;
    for (var i in info) {
      vR.style[i] = info[i];
    }
    this.isMax = !this.isMax;
  };

  //使用原生支持的方式播放
  pro.nativeMax = function () {
    if (!window.plus) {
      //非html5+环境
      return;
    }
    if ($.os.ios) {
      console.log("ios");
      this.video.removeAttribute("webkit-playsinline");
    } else if ($.os.android) {
      console.log("android");
      var url = this.video.querySelector("source").src;
      var Intent = plus.android.importClass("android.content.Intent");
      var Uri = plus.android.importClass("android.net.Uri");
      var main = plus.android.runtimeMainActivity();
      var intent = new Intent(Intent.ACTION_VIEW);
      var uri = Uri.parse(url);
      intent.setDataAndType(uri, "video/*");
      main.startActivity(intent);
    }
  };

  //跳转视频进度 单位 秒
  pro.setCurrentTime = function (t) {
    this.video.currentTime += t;
  };
  //设置音量大小 单位 百分比 如 0.1
  pro.setVolume = function (v) {
    this.video.volume += v;
  };
  //切换播放地址
  pro.setUrl = function (nUrl) {
    var v = this.video;
    var source = v.querySelector("source");
    source.src = v.src = nUrl;
    source.type = "video/" + nUrl.split(".").pop();
    isScroll = false;
    v.play();
  };

  var events = {};

  //增加 或者删除事件    isBack 是否返回  这次添加事件时 被删除 的上一个 事件
  pro.eve = function (ename, callback, isBack) {
    var fn;
    if (callback && typeof callback == "function") {
      isBack && (fn = arguments.callee(ename));
      events[ename] = callback;
      this.video.addEventListener(ename, events[ename]);
      console.log("添加事件：" + ename);
    } else {
      fn = events[ename];
      fn && this.video.removeEventListener(ename, fn);
      console.log("删除事件：" + ename);
    }

    return fn;
  };

  function stom(t) {
    var m = Math.floor(t / 60);
    m < 10 && (m = "0" + m);
    return m + ":" + ((t % 60) / 100).toFixed(2).slice(-2);
  }

  var nv = null;
  $.bvd = function (dom) {
    return nv || (nv = new bvd(dom));
  };
})(mui);