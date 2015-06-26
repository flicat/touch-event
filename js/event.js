/*!
 * @author liyuelong1020@gmail.com
 * @date 15-5-11 下午4:23
 * @version 1.0.0
 * @description 自定义事件
 */

(function () {

    Object.prototype.getItem = function(i) {
        return this[Object.keys(this)[i]];
    };

    var isNumber = function(num) {
        return Object.prototype.toString.call(num) === '[object Number]';
    };

    var empty = function() {
        [].slice.call(arguments).forEach(function(obj) {
            for(var i in obj){
                if(obj.hasOwnProperty(i)){
                    delete obj[i];
                }
            }
        });
    };

    // 轻触，长按，滑屏，滑屏结束，左滑屏，右滑屏，上滑屏，下滑屏
    var EventList = ['tap', 'longTap', 'swipe', 'swipeEnd', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown'];

    // 计算旋转角度
    var getAngle = function(x, y) {
        var angle = Math.atan(Math.abs(y / x)) / Math.PI * 180;
        if(x <= 0 && y <= 0) {
            angle = 180 - angle;
        } else if(x <= 0 && y >= 0){
            angle += 180;
        } else if(x >= 0 && y >= 0) {
            angle = 360 - angle;
        }
        return angle;
    };

    // 定义滑屏事件
    var bindEvent = function(node) {
        node.__bind_custom_event = true;

        // 坐标点
        var point = {
            target: null,                     // 事件触发 DOM 节点
            startStamp: 0,                    // 事件开始时间戳
            endStamp: 0,                      // 事件结束时间戳
            startX: {},                       // 开始触摸 X 坐标点 [point1,point2...]
            startY: {},                       // 开始触摸 Y 坐标点 [point1,point2...]
            endX: {},                         // 结束触摸 X 坐标点 [point1,point2...]
            endY: {},                         // 结束触摸 Y 坐标点 [point1,point2...]
            diffX: {},                        // 触摸 X 坐标偏移量 [point1,point2...]
            diffY: {},                        // 触摸 Y 坐标偏移量 [point1,point2...]
            startApart: 0,                    // 多点触摸开始触摸间距值
            endApart: 0,                      // 多点触摸结束触摸间距值
            startAngle: 0,                    // 多点触摸开始触摸角度值
            endAngle: 0                       // 多点触摸结束触摸角度值
        };
        // 事件处理
        var handler = function(e) {
            // 事件触发 DOM 节点
//            point.target = e.target;

            switch(e.type) {
                case 'touchstart':
                    // 重置坐标点信息
                    empty(point.startX, point.startY, point.diffX, point.diffY);

                    // 保存开始坐标点
                    [].slice.call(e.touches).forEach(function(touche, index) {
                        var i = touche.identifier || index;
                        point.startX[i] = point.endX[i] = touche.clientX;
                        point.startY[i] = point.endY[i] = touche.clientY;
                    });

                    // 开始时间戳
                    point.startStamp = point.endStamp = Date.now();

                    // 如果是多点触摸则计算开始触摸间距
                    if(e.touches.length > 1){
                        var start_x = point.startX.getItem(1) - point.startX.getItem(0);
                        var start_y = point.startY.getItem(1) - point.startY.getItem(0);
                        point.startApart = Math.sqrt(start_x * start_x + start_y * start_y);
                        point.startAngle = getAngle(start_x, start_y);
                    }

                    break;
                case 'touchmove':

                    // 移动中的坐标点（结束坐标点）
                    [].slice.call(e.touches).forEach(function(touche, index) {
                        var i = touche.identifier || index;
                        point.endX[i] = touche.clientX;
                        point.endY[i] = touche.clientY;
                        isNumber(point.startX[i]) && (point.diffX[i] = point.endX[i] - point.startX[i]);
                        isNumber(point.startY[i]) && (point.diffY[i] = point.endY[i] - point.startY[i]);
                    });

                    // 如果是多点触摸则计算移动触摸间距
                    if(e.touches.length > 1){
                        var end_x = point.endX.getItem(1) - point.endX.getItem(0);
                        var end_y = point.endY.getItem(1) - point.endY.getItem(0);
                        point.endApart = Math.sqrt(end_x * end_x + end_y * end_y);
                        point.endAngle = getAngle(end_x, end_y);
                    }

                    // 触发滑屏事件
                    node.trigger('swipe', point, e);

                    break;
                case 'touchcancel':
                case 'touchend':

                    point.endStamp = Date.now();
                    empty(point.endX, point.endY);

                    // 结束坐标点
                    [].slice.call(e.changedTouches).forEach(function(touche, index) {
                        var i = touche.identifier || index;
                        if(Math.abs(point.diffX[i]) > 30 || Math.abs(point.diffY[i]) > 30){
                            // 触发滑屏事件
                            node.trigger('swipeEnd', point, e);

                            if(Math.abs(point.diffX[i]) < Math.abs(point.diffY[i]) && point.diffY[i] < 0){
                                // 上滑屏
                                node.trigger('swipeUp', point, e);
                            } else if(Math.abs(point.diffX[i]) < Math.abs(point.diffY[i]) && point.diffY[i] > 0) {
                                // 下滑屏
                                node.trigger('swipeDown', point, e);
                            } else if(Math.abs(point.diffX[i]) > Math.abs(point.diffY[i]) && point.diffX[i] < 0) {
                                // 左滑屏
                                node.trigger('swipeLeft', point, e);
                            } else if(Math.abs(point.diffX[i]) > Math.abs(point.diffY[i]) && point.diffX[i] > 0) {
                                // 右滑屏
                                node.trigger('swipeRight', point, e);
                            }
                        } else {
                            // 点击事件
                            node.trigger('tap', point, e);
                            if(point.endStamp - point.startStamp > 500){
                                // 长按事件
                                node.trigger('longTap', point, e);
                            }
                        }
                    });

                    break;
            }
        };

        node.addEventListener('touchstart', handler, false);
        node.addEventListener('touchmove', handler, false);
        node.addEventListener('touchend', handler, false);
        node.addEventListener('touchcancel', handler, false);
    };

    // 重写事件监听函数
    var oldEventListener = Element.prototype.addEventListener;
    Element.prototype.addEventListener = Element.prototype.on = function(eventName) {
        if(EventList.indexOf(eventName) > -1 && !this.__bind_custom_event){
            bindEvent(this);
        }
        oldEventListener.apply(this, arguments);
        return this;
    };

    // 事件触发
    Element.prototype.trigger = function (type, data, e) {
        var event = document.createEvent('HTMLEvents');
        event.initEvent(type, true, true);
        event.data = data || {};
        event.eventName = type;
        event.target = this;

        // 取消默认事件
        if(e && e instanceof Event){
            var oldPreventDefault = event.preventDefault;
            var oldStopPropagation = event.stopPropagation;
            event.preventDefault = function() {
                e.preventDefault();
                oldPreventDefault.apply(event, arguments);
            };
            event.stopPropagation = function() {
                e.stopPropagation();
                oldStopPropagation.apply(event, arguments);
            };
        }

        this.dispatchEvent(event);
        return this;
    };

    // 事件委托
    var matches = Element.prototype.matches ||
        Element.prototype.matchesSelector ||
        Element.prototype.webkitMatchesSelector;
    Element.prototype.live = function(event, selector, callback) {
        var node = this;
        var handler = function(e) {
            var target = e.target;
            // 如果是自定义事件则 target 为 e.data.target
            if(EventList.indexOf(event) > -1 && target === node && e.data && e.data.target){
                target = e.data.target;
            }
            // 匹配选中的子节点
            var selected = matches.call(target, selector);
            while(!selected && target.parentNode && target !== node){
                target = target.parentNode;
                selected = matches.call(target, selector);
            }
            if(selected){
                callback.call(target, e);
            }
        };

        node.addEventListener(event, handler, false);

        return node;
    };

})();
