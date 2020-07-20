---
title: Swiping in React Native
date: 2019-04-23 16:20:27
tags:
- react-native
- scroll-view
- horizontal
- swipe
---

We had always wanted to have  a swipe function to <!-- excerpt -->hide and how certain components in our React Native app. 

## What we thought would work
- [React Native Gesture Responder System](https://facebook.github.io/react-native/docs/gesture-responder-system.html) 
- Other gesture libraries

But often they would take up much time and had configuration issues or bugs (didn't scroll properly, depends on how much you swipe). So we had put this off for quite a long time.

Until currently, where we found real value for this swiping action.

## The Solution - ScrollView

Horizontal Scrolling as a Swipe
```js
<ScrollView 
  horizontal={true} 
  pagingEnabled={true} 
  showsHorizontalScrollIndicator={false}
>
  <Component1 />
  <Component2 />
</ScrollView>
```

Ensure that component 1 and 2 have the same width and we're good to go!

#### Additional Props
Taken from the [RN site](https://facebook.github.io/react-native/docs/scrollview.html)
1. `pagingEnabled`: When true, the scroll view stops on multiples of the scroll view's size when scrolling. This can be used for horizontal pagination. The default value is false.

The rest is quite self-explanatory.

## It's a wrap!

So that's how we used a scrollview to circumvent swiping libraries! :)

Short solution that made my day!