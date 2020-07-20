---
title: React JS Bindings
date: 2019-04-15 23:47:12
tags:
- react
- javascript
---

Today I've been stumped over a simple (I consider most things basic for a developer D:) error for a good period of time <!-- excerpt --> (I have no idea how long - it felt like hours but I'm sure it was not an hour)

I ran into a problem.

```
Cannot update during an existing state transition (such as within render)
```
I isolated the problem and the issue seemed to be the way I was passing my function from my parent component to the child component that was causing the function to fire almost immediately, leading to a re-rendering of state etc. 

So decided to do some research into function calls in javascript. 

## Background

### What binding means
Binding means to bind the function to the context. (it has to do with `this` and many complicated things.) 

#### Dynamic Binding in render()

Do not bind it in the method call ie. as onChange will generate a brand new handler every time the component re-renders.

```js
onChange={this.handleChange.bind(this)}
```

#### Bind in constructor

So its better to do so in the constructor class, ie. 

```js
constructor() {
  this.handleClick = this.handleClick.bind(this);
}

handleClick(event) {}
```
#### Bind with arrow!
If handleClick was an arrow function however, the arrow function will automatically bind the handleClick function to the correct context! 

```js
handleClick = (e) => {}
```
#### Long story short

Before ES2015, we had to do this
```javascript
constructor(props) {
  super(props);

  this.state = { text: '' };
  this.change = this.change.bind(this);
}
```

After class properties and the introduction of arrow functions, it gives the same equivalent.
```javascript
state = { text: '' };
change = ev => this.setState({text: ev.target.value});
```

The first line is an experimental feature known as class properties. It helps to avoid binding methods explicitly. It is a syntactic sugar for defining fields and functions within a constructor. 

Arrow functions always gets the context from where they have been defined! Cool yeah? 

### What about arrow functions in render()
```javascript
onChange={this.handleChange}
onClick={() => this.handleClick()}
```

handleChange is only executed when onChange is called.

onClick defines an anonymous function but does not call it. This anonymous function is defined on every render and hurts performance on large code bases or components that render often.

So that means that if handleClick is an arrow function, it would have been useless to call it with an arrow function in the render as it is already bound to the context and re-rendering it everytime will cause performance issues.

It is the same when passing functions as props to the child.

```js
handleClick = () => {}

render() {
  return (
    <Child onClick={this.handleClick} />
  )
}

// Child

render() {
  <button onClick={this.props.onClick} />
}
```

The above should work and is recommended as compared to using arrow functions in the rendering of components. 


##### Credits:
[React Kungfu]( 
https://reactkungfu.com/2015/07/why-and-how-to-bind-methods-in-your-react-component-classes/)