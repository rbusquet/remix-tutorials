---
title: Visualizing React hooks' lazy initial state
date: "2020-11-13"
categories:
  - react
  - javascript
credits: <span>Photo by <a href="https://unsplash.com/@proozenburg">Presley Roozenburg</a> on <a href="https://unsplash.com/photos/gklfv5avr4c">Unsplash</a></span>
coverImage: visualizing-lazy-initial-state.jpg
---

Most examples of React hook's [lazy initial state](https://reactjs.org/docs/hooks-reference.html#lazy-initial-state) uses inline arrow functions to showcase the usage:

```js
function App() {
  const [state, setState] = React.useState(() => expensiveComputation());
  // ...
}
```

Paired with the idea that whatever you pass to `React.useState` is the initial value of the state, it can be hard to grasp the difference from the example below:

```js
function App() {
  const [state, setState] = React.useState(expensiveComputation());
  // ...
}
```

For me, it helps to visualize the difference if you assign what’s inside the parentheses to a constant.

```js
function App() {
  const initialState = 0;
  const [state, setState] = React.useState(initialState);
  // ...
}
```

Everytime `App` re-renders, the function `App` will re-run completely. This means `0` is set to `initialState` in every render. Now let's do the same with the expensive computation example:

```js
function App() {
  const initialState = expensiveComputation();
  const [state, setState] = React.useState(initialState);
  // ...
}
```

It's pretty clear now that the expensive function _is called every time the component renders_. `React.useState` is just **ignoring** its result in subsequent renders. And that's what you want to avoid when passing a function to the hook.

`React.useState` implementation detects if you're passing a function and makes sure to call it once for the component's lifetime.

The tradeoff now is that you're creating a new function for every render. That's acceptable if the computation takes longer or is more complex than instantiating an inline function. If that's not the case (for example, when setting a constant like `0` in the first example), go with passing the value directly to `React.useState`.
