手机版触摸事件插件
===========

>**调用方法**：

> - node.addEventListener([event], [handler]);            //  绑定事件
> - node.live([event], [selector], [handler])             //  事件委托

>**参数详解：**

> - @event {String} tap                // 轻触事件
> - @event {String} longTap            // 长按事件
> - @event {String} swipe              // 滑屏事件（持续触发）
> - @event {String} swipeEnd           // 滑屏结束事件
> - @event {String} swipeLeft          // 向左滑屏
> - @event {String} swipeRight         // 向右滑屏
> - @event {String} swipeUp            // 向上滑屏
> - @event {String} swipeDown          // 向下滑屏
> - @selector {String}                 // css 选择器
> - @handler {function}                // 事件回调函数

>**e.data 对象属性：**

> - target: null,                     // 事件触发 DOM 节点
> - startStamp: 0,                    // 事件开始时间戳
> - endStamp: 0,                      // 事件结束时间戳
> - startX: {},                       // 开始触摸 X 坐标点 [point1,point2...]
> - startY: {},                       // 开始触摸 Y 坐标点 [point1,point2...]
> - endX: {},                         // 结束触摸 X 坐标点 [point1,point2...]
> - endY: {},                         // 结束触摸 Y 坐标点 [point1,point2...]
> - diffX: {},                        // 触摸 X 坐标偏移量 [point1,point2...]
> - diffY: {},                        // 触摸 Y 坐标偏移量 [point1,point2...]
> - startApart: 0,                    // 多点触摸开始触摸间距值
> - endApart: 0,                      // 多点触摸结束触摸间距值
> - startAngle: 0,                    // 多点触摸开始触摸角度值
> - endAngle: 0                       // 多点触摸结束触摸角度值