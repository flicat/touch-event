触摸事件插件
===========
##### 安装与使用：
```bash
npm i custom-touch-event -S
```
```javascript
// 初始化事件委托
import initTouchEvent from 'custom-touch-event'
initTouchEvent()
```


##### 调用方法：
```javascript
// 绑定事件
const handler = e => {
  console.log(e.data.points)
}
node.addEventListener('swipe', handler)         //  绑定事件
node.removeEventListener('swipe', handler)      //  取消事件
```

##### event 可用的事件列表
- tap                // 轻触事件
- longTap            // 长按事件
- swipe              // 滑屏事件（持续触发）
- swipeEnd           // 滑屏结束事件
- swipeLeft          // 向左滑屏
- swipeRight         // 向右滑屏
- swipeUp            // 向上滑屏
- swipeDown          // 向下滑屏

##### e.data.points
```javascript
{
  target: HTMLElement,   // 事件触发 DOM 节点
  startStamp: 0,         // 事件开始时间戳
  endStamp: 0,           // 事件结束时间戳
  startApart: 0,         // 两点触摸，开始触摸间距值
  endApart: 0,           // 两点触摸，结束触摸间距值
  startAngle: 0,         // 两点触摸，开始触摸角度值
  endAngle: 0            // 两点触摸，结束触摸角度值
  startX: {},            // Point对象，开始触摸 X 坐标点
  startY: {},            // Point对象，开始触摸 Y 坐标点
  endX: {},              // Point对象，结束触摸 X 坐标点
  endY: {},              // Point对象，结束触摸 Y 坐标点
  diffX: {},             // Point对象，触摸 X 坐标偏移量
  diffY: {}              // Point对象，触摸 Y 坐标偏移量
}
```

##### Point 对象
```javascript
{
  length: 1,           // 触摸点数量
  keys: Function       // 获取触摸点
}
```

##### 在vue中使用
```html
<template>
  <h2>scale and rotate image</h2>
  <img class="image" src="image/img.jpg" @touchstart="handler" @swipe="handler" />
</template>
<script setup>
let scaleFlag = 1
let rotateFlag = 0
let scale = 1
let rotate = 0

const handler = e => {
  if (e.type === 'touchstart') {
    rotateFlag = rotate
    scaleFlag = scale
  } else if (e.type === 'swipe') {
    const points = e.data.points
    const pointLen = points.endX.length

    if (pointLen > 1) {
      const diff = points.endApart - points.startApart

      if (diff > 0) {
        scale = scaleFlag + diff / 100
      } else if (diff < 0) {
        scale = scaleFlag - Math.abs(diff) / 100
      }

      if (scale < 0.2) {
        scale = 0.2
      }

      rotate = (rotateFlag + points.startAngle - points.endAngle) % 360

      img.style.transform = `scale(${scale}) rotate(${rotate}deg)`
    }
  }
}
</script>
```

##### Demo
[图片旋转 Demo](https://flicat.github.io/touch-event/demo/)
