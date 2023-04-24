/*!
 * @author liyuelong1020@gmail.com
 * @date 15-5-11 下午4:23
 * @version 1.0.0
 * @description 自定义事件
 */

export default function () {

  // 轻触，长按，滑屏，滑屏结束，左滑屏，右滑屏，上滑屏，下滑屏
  // tap', 'longTap', 'swipe', 'swipeEnd', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown'

  // 判断类型是否为数字
  const isNumber = function (num) {
    return Object.prototype.toString.call(num) === '[object Number]';
  };

  // 节点事件触发器
  const dispatchEvent = (el, payload = {}) => {
    const { type, bubbles = false, cancelable = false, ...data } = payload

    const event = document.createEvent('HTMLEvents');
    event.initEvent(type, true, true);
    event.data = data || {};
    event.eventName = type;

    return el.dispatchEvent(event)
  }

  // 计算旋转角度
  const getAngle = function (x, y) {
    let angle = Math.atan(Math.abs(y / x)) / Math.PI * 180;
    if (x <= 0 && y <= 0) {
      angle = 180 - angle;
    } else if (x <= 0 && y >= 0) {
      angle += 180;
    } else if (x >= 0 && y >= 0) {
      angle = 360 - angle;
    }
    return angle;
  };

  // 创建一个触摸点对象
  const createPoint = function () {
    return Object.defineProperties({}, {
      length: {
        get: function () {
          return Object.keys(this).length;
        },
        set: function () {
          return false;
        },
        enumerable: false
      },
      keys: {
        value: function (i) {
          return this[Object.keys(this)[i]];
        },
        writable: false,
        enumerable: false
      },
      empty: {
        value: function () {
          for (let i in this) {
            if (Object.prototype.hasOwnProperty.call(this, i)) {
              delete this[i];
            }
          }
        },
        writable: false,
        enumerable: false
      }
    });
  };

  // 定义滑屏事件
  const bindEvent = function (node) {
    // node.__bind_custom_event__ = true;

    // 坐标点
    const points = {
      target: null,                     // 事件触发 DOM 节点
      startStamp: 0,                    // 事件开始时间戳
      endStamp: 0,                      // 事件结束时间戳
      startApart: 0,                    // 多点触摸开始触摸间距值
      endApart: 0,                      // 多点触摸结束触摸间距值
      startAngle: 0,                    // 多点触摸开始触摸角度值
      endAngle: 0,                      // 多点触摸结束触摸角度值
      startX: createPoint(),            // 开始触摸 X 坐标点
      startY: createPoint(),            // 开始触摸 Y 坐标点
      endX: createPoint(),              // 结束触摸 X 坐标点
      endY: createPoint(),              // 结束触摸 Y 坐标点
      diffX: createPoint(),             // 触摸 X 坐标偏移量
      diffY: createPoint()              // 触摸 Y 坐标偏移量
    };

    // 事件处理
    const handler = function (e) {
      // 事件触发 DOM 节点
      points.target = e.target;

      switch (e.type) {
        case 'touchstart':
          // 重置坐标点信息
          points.startX.empty();
          points.startY.empty();
          points.diffX.empty();
          points.diffY.empty();

          // 保存开始坐标点
          Array.from(e.touches).forEach(function (touche, index) {
            const i = touche.identifier || index;
            points.startX[i] = points.endX[i] = touche.clientX;
            points.startY[i] = points.endY[i] = touche.clientY;
          });

          // 开始时间戳
          points.startStamp = points.endStamp = Date.now();

          // 如果是多点触摸则计算开始触摸间距
          if (e.touches.length > 1) {
            const start_x = points.startX.keys(1) - points.startX.keys(0);
            const start_y = points.startY.keys(1) - points.startY.keys(0);
            points.startApart = Math.sqrt(start_x * start_x + start_y * start_y);
            points.startAngle = getAngle(start_x, start_y);
          }

          break;
        case 'touchmove':

          // 移动中的坐标点（结束坐标点）
          Array.from(e.touches).forEach(function (touche, index) {
            const i = touche.identifier || index;
            points.endX[i] = touche.clientX;
            points.endY[i] = touche.clientY;
            isNumber(points.startX[i]) && (points.diffX[i] = points.endX[i] - points.startX[i]);
            isNumber(points.startY[i]) && (points.diffY[i] = points.endY[i] - points.startY[i]);
          });

          // 如果是多点触摸则计算移动触摸间距
          if (e.touches.length > 1) {
            const end_x = points.endX.keys(1) - points.endX.keys(0);
            const end_y = points.endY.keys(1) - points.endY.keys(0);
            points.endApart = Math.sqrt(end_x * end_x + end_y * end_y);
            points.endAngle = getAngle(end_x, end_y);
          }

          // 触发滑屏事件
          dispatchEvent(e.target, { type: 'swipe', points });

          break;
        case 'touchcancel':
        case 'touchend':

          points.endStamp = Date.now();
          points.endX.empty();
          points.endY.empty();

          // 结束坐标点
          Array.from(e.changedTouches).forEach(function (touche, index) {
            const i = touche.identifier || index;
            const diffX = points.diffX[i];
            const diffY = points.diffY[i];

            if (Math.abs(diffX) > 0 || Math.abs(diffY) > 0) {
              if (Math.abs(diffX) < Math.abs(diffY) && diffY < 0) {
                // 上滑屏
                dispatchEvent(e.target, { type: 'swipeUp', points });
              } else if (Math.abs(diffX) < Math.abs(diffY) && diffY > 0) {
                // 下滑屏
                dispatchEvent(e.target, { type: 'swipeDown', points });
              } else if (Math.abs(diffX) > Math.abs(diffY) && diffX < 0) {
                // 左滑屏
                dispatchEvent(e.target, { type: 'swipeLeft', points });
              } else if (Math.abs(diffX) > Math.abs(diffY) && diffX > 0) {
                // 右滑屏
                dispatchEvent(e.target, { type: 'swipeRight', points });
              }

              // 滑屏结束事件
              dispatchEvent(e.target, { type: 'swipeEnd', points });
            } else {
              // 点击事件
              dispatchEvent(e.target, { type: 'tap', points });
              if (points.endStamp - points.startStamp > 500) {
                // 长按事件
                dispatchEvent(e.target, { type: 'longTap', points });
              }
            }
          });

          break;
      }
    };

    node.addEventListener('touchstart', handler, true);
    node.addEventListener('touchmove', handler, true);
    node.addEventListener('touchend', handler, true);
    node.addEventListener('touchcancel', handler, true);
  };

  // 将事件委托到 window
  bindEvent(window);

  // 事件触发
  // Element.prototype.trigger = function (type, data, e) {
  //   const event = document.createEvent('HTMLEvents');
  //   event.initEvent(type, true, true);
  //   event.data = data || {};
  //   event.eventName = type;
  //   event.target = this;

  //   // 取消默认事件
  //   if (e && e instanceof Event) {
  //     const oldPreventDefault = event.preventDefault;
  //     const oldStopPropagation = event.stopPropagation;
  //     event.preventDefault = function () {
  //       e.preventDefault();
  //       oldPreventDefault.apply(event, arguments);
  //     };
  //     event.stopPropagation = function () {
  //       e.stopPropagation();
  //       oldStopPropagation.apply(event, arguments);
  //     };
  //   }

  //   this.dispatchEvent(event);
  //   return this;
  // };

  // 重写事件监听函数
  // const oldEventListener = Element.prototype.addEventListener;

  // 事件委托
  // const matches = Element.prototype.matches ||
  //   Element.prototype.matchesSelector ||
  //   Element.prototype.webkitMatchesSelector;
  // Element.prototype.addEventListener = Element.prototype.on = function (event) {
  //   const node = this;
  //   const args = Array.from(arguments);
  //   const selector, callback;

  //   const eventArr = String(event).split('.');
  //   const eventNameSpace = eventArr[1] || 'all';
  //   event = eventArr[0];

  //   if (({}).toString.call(args[1]) === '[object String]') {
  //     selector = args[1];
  //   }

  //   if (selector && ({}).toString.call(args[2]) === '[object Function]') {
  //     callback = args[2];
  //   } else if (({}).toString.call(args[1]) === '[object Function]') {
  //     callback = args[1];
  //   } else {
  //     callback = function () { };
  //   }

  //   if (EventList.indexOf(event) > -1 && !this.__bind_custom_event__) {
  //     bindEvent(node);
  //   }

  //   // 记录委托的事件
  //   if (!node.__custom_event_live__) {
  //     node.__custom_event_live__ = {};
  //   }
  //   if (!node.__custom_event_live__[eventNameSpace]) {
  //     node.__custom_event_live__[eventNameSpace] = {};
  //   }
  //   if (!node.__custom_event_live__[eventNameSpace][event]) {
  //     node.__custom_event_live__[eventNameSpace][event] = [];
  //   }

  //   if (selector) {
  //     // 事件委托回调函数
  //     const handler = function (e) {
  //       const target = e.target;
  //       // 如果是自定义事件则 target 为 e.data.target
  //       if (EventList.indexOf(event) > -1 && target === node && e.data && e.data.target) {
  //         target = e.data.target;
  //       }
  //       // 匹配选中的子节点
  //       const selected = matches.call(target, selector);
  //       while (!selected && target.parentNode && target !== node) {
  //         target = target.parentNode;
  //         selected = matches.call(target, selector);
  //       }
  //       if (selected) {
  //         callback.call(target, e);
  //       }
  //     };

  //     node.__custom_event_live__[eventNameSpace][event].push(handler);
  //     oldEventListener.call(node, event, handler, false);
  //   } else {
  //     node.__custom_event_live__[eventNameSpace][event].push(callback);
  //     oldEventListener.call(node, event, callback, false);
  //   }

  //   return node;
  // };
  // Element.prototype.off = function (event, handler) {
  //   const node = this;

  //   const eventArr = String(event).split('.');
  //   const eventNameSpace = eventArr[1] || 'all';
  //   event = eventArr[0];

  //   if (({}).toString.call(handler) === '[object Function]') {
  //     node.removeEventListener(event, handler, false);
  //   } else if (node.__custom_event_live__ &&
  //     node.__custom_event_live__[eventNameSpace] &&
  //     node.__custom_event_live__[eventNameSpace][event] &&
  //     node.__custom_event_live__[eventNameSpace][event].length) {
  //     node.__custom_event_live__[eventNameSpace][event].forEach(function (handler) {
  //       node.removeEventListener(event, handler, false);
  //     });
  //   }
  //   return node;
  // };

  // 只触发一次的事件
  // Element.prototype.one = function (event, callback) {
  //   const node = this;
  //   const one = function (e) {
  //     node.removeEventListener(event, one, false);
  //     callback.call(this, e);
  //   };
  //   node.addEventListener(event, one, false);
  //   return node;
  // };
}
