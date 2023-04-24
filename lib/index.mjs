/*!
 * @author liyuelong1020@gmail.com
 * @date 15-5-11 下午4:23
 * @version 1.0.0
 * @description 自定义事件
 */
function h() {
  const l = function(n) {
    return Object.prototype.toString.call(n) === "[object Number]";
  }, c = (n, t = {}) => {
    const { type: i, bubbles: s = !1, cancelable: a = !1, ...r } = t, e = document.createEvent("HTMLEvents");
    return e.initEvent(i, !0, !0), e.data = r || {}, e.eventName = i, n.dispatchEvent(e);
  }, p = function(n, t) {
    let i = Math.atan(Math.abs(t / n)) / Math.PI * 180;
    return n <= 0 && t <= 0 ? i = 180 - i : n <= 0 && t >= 0 ? i += 180 : n >= 0 && t >= 0 && (i = 360 - i), i;
  }, d = function() {
    return Object.defineProperties({}, {
      length: {
        get: function() {
          return Object.keys(this).length;
        },
        set: function() {
          return !1;
        },
        enumerable: !1
      },
      keys: {
        value: function(n) {
          return this[Object.keys(this)[n]];
        },
        writable: !1,
        enumerable: !1
      },
      empty: {
        value: function() {
          for (let n in this)
            Object.prototype.hasOwnProperty.call(this, n) && delete this[n];
        },
        writable: !1,
        enumerable: !1
      }
    });
  };
  (function(n) {
    const t = {
      target: null,
      // 事件触发 DOM 节点
      startStamp: 0,
      // 事件开始时间戳
      endStamp: 0,
      // 事件结束时间戳
      startApart: 0,
      // 多点触摸开始触摸间距值
      endApart: 0,
      // 多点触摸结束触摸间距值
      startAngle: 0,
      // 多点触摸开始触摸角度值
      endAngle: 0,
      // 多点触摸结束触摸角度值
      startX: d(),
      // 开始触摸 X 坐标点
      startY: d(),
      // 开始触摸 Y 坐标点
      endX: d(),
      // 结束触摸 X 坐标点
      endY: d(),
      // 结束触摸 Y 坐标点
      diffX: d(),
      // 触摸 X 坐标偏移量
      diffY: d()
      // 触摸 Y 坐标偏移量
    }, i = function(s) {
      switch (t.target = s.target, s.type) {
        case "touchstart":
          if (t.startX.empty(), t.startY.empty(), t.diffX.empty(), t.diffY.empty(), Array.from(s.touches).forEach(function(a, r) {
            const e = a.identifier || r;
            t.startX[e] = t.endX[e] = a.clientX, t.startY[e] = t.endY[e] = a.clientY;
          }), t.startStamp = t.endStamp = Date.now(), s.touches.length > 1) {
            const a = t.startX.keys(1) - t.startX.keys(0), r = t.startY.keys(1) - t.startY.keys(0);
            t.startApart = Math.sqrt(a * a + r * r), t.startAngle = p(a, r);
          }
          break;
        case "touchmove":
          if (Array.from(s.touches).forEach(function(a, r) {
            const e = a.identifier || r;
            t.endX[e] = a.clientX, t.endY[e] = a.clientY, l(t.startX[e]) && (t.diffX[e] = t.endX[e] - t.startX[e]), l(t.startY[e]) && (t.diffY[e] = t.endY[e] - t.startY[e]);
          }), s.touches.length > 1) {
            const a = t.endX.keys(1) - t.endX.keys(0), r = t.endY.keys(1) - t.endY.keys(0);
            t.endApart = Math.sqrt(a * a + r * r), t.endAngle = p(a, r);
          }
          c(s.target, { type: "swipe", points: t });
          break;
        case "touchcancel":
        case "touchend":
          t.endStamp = Date.now(), t.endX.empty(), t.endY.empty(), Array.from(s.changedTouches).forEach(function(a, r) {
            const e = a.identifier || r, f = t.diffX[e], o = t.diffY[e];
            Math.abs(f) > 0 || Math.abs(o) > 0 ? (Math.abs(f) < Math.abs(o) && o < 0 ? c(s.target, { type: "swipeUp", points: t }) : Math.abs(f) < Math.abs(o) && o > 0 ? c(s.target, { type: "swipeDown", points: t }) : Math.abs(f) > Math.abs(o) && f < 0 ? c(s.target, { type: "swipeLeft", points: t }) : Math.abs(f) > Math.abs(o) && f > 0 && c(s.target, { type: "swipeRight", points: t }), c(s.target, { type: "swipeEnd", points: t })) : (c(s.target, { type: "tap", points: t }), t.endStamp - t.startStamp > 500 && c(s.target, { type: "longTap", points: t }));
          });
          break;
      }
    };
    n.addEventListener("touchstart", i, !0), n.addEventListener("touchmove", i, !0), n.addEventListener("touchend", i, !0), n.addEventListener("touchcancel", i, !0);
  })(window);
}
export {
  h as default
};
