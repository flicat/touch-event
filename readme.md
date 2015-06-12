手机版触摸事件插件
===========

**调用方法**：
node.addEventListener([event], [handler]);            //  绑定事件
-
node.live([event], [selector], [handler])             //  事件委托
-
> - @event {String} tap                // 轻触事件
> - @event {String} longTap            // 长按事件
> - @event {String} swipe              // 滑屏事件（持续触发）
> - @event {String} swipeLeft          // 向左滑屏
> - @event {String} swipeRight         // 向右滑屏
> - @event {String} swipeUp            // 向上滑屏
> - @event {String} swipeDown          // 向下滑屏
> - @selector {String}                 // css 选择器
> - @handler {function}                // 事件回调函数