/*!
 * @author liyuelong1020@gmail.com
 * @date 15-5-11 下午4:23
 * @version 1.0.0
 * @description 自定义事件
 */

(function () {
    var isNumber = function(num) {
        return Object.prototype.toString.call(num) === '[object Number]';
    };
    // 滑屏，左滑屏，右滑屏，上滑屏，下滑屏，长按
    var EventList = ['tap', 'longTap', 'swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown'];

    // 定义滑屏事件
    var bindEvent = function(node) {
        node.__bind_custom_event = true;

        // 坐标点
        var point = {
            target: null,
            startStamp: 0,
            endStamp: 0,
            startX: [],
            startY: [],
            endX: [],
            endY: [],
            diffX: [],
            diffY: []
        };
        // 事件处理
        var handler = function(e) {
            point.target = e.target;

            switch(e.type) {
                case 'touchstart':
                    [].slice.call(e.touches).forEach(function(touche, i) {
                        point.startX[i] = point.endX[i] = touche.clientX;
                        point.startY[i] = point.endY[i] = touche.clientY;
                    });
                    point.startStamp = point.endStamp = Date.now();

                    break;
                case 'touchmove':
                    [].slice.call(e.touches).forEach(function(touche, i) {
                        point.endX[i] = touche.clientX;
                        point.endY[i] = touche.clientY;
                        isNumber(point.endX[i]) && isNumber(point.startX[i]) && (point.diffX[i] = point.endX[i] - point.startX[i]);
                        isNumber(point.endY[i]) && isNumber(point.startY[i]) && (point.diffY[i] = point.endY[i] - point.startY[i]);
                    });

                    // 触发滑屏事件
                    node.trigger('swipe', point, e);

                    break;
                case 'touchcancel':
                case 'touchend':
                    [].slice.call(e.changedTouches).forEach(function(touche, i) {
                        point.endX[i] = touche.clientX;
                        point.endY[i] = touche.clientY;
                        isNumber(point.endX[i]) && isNumber(point.startX[i]) && (point.diffX[i] = point.endX[i] - point.startX[i]);
                        isNumber(point.endY[i]) && isNumber(point.startY[i]) && (point.diffY[i] = point.endY[i] - point.startY[i]);
                    });
                    point.endStamp = Date.now();

                    if(Math.abs(point.diffX[0]) > 30 || Math.abs(point.diffY[0]) > 30){
                        // 滑屏事件
                        node.trigger('swipe', point, e);

                        if(Math.abs(point.diffX[0]) < Math.abs(point.diffY[0]) && point.diffY[0] < 0){
                            // 上滑屏
                            node.trigger('swipeUp', point, e);
                        } else if(Math.abs(point.diffX[0]) < Math.abs(point.diffY[0]) && point.diffY[0] > 0) {
                            // 下滑屏
                            node.trigger('swipeDown', point, e);
                        } else if(Math.abs(point.diffX[0]) > Math.abs(point.diffY[0]) && point.diffX[0] < 0) {
                            // 左滑屏
                            node.trigger('swipeLeft', point, e);
                        } else if(Math.abs(point.diffX[0]) > Math.abs(point.diffY[0]) && point.diffX[0] > 0) {
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
