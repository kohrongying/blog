---
title: css-battle portfolio
date: 2019-04-23 00:10:02
tags:
- css
- lit-html
---

[CSS Battle](http://cssbattle.dev) is a playground <!-- excerpt -->where you are expected to recreate a target to the best of your abilities (with 100% precision) and with the least amount of code (100% efficiency). It's pretty fun! 

There are currently only 12 targets but they should be updating it soon.

### Weird tips / tricks
1. Minify your css!
2. Don't close your html tags ie. `<div><p><p></div>` (ok the pros don't use div)
3. Don't close your `<style>` tag
4. Don't need `px` for width and heights (I didnt know omo)

Find out the rest yourself!

So after doing about 10-11 targets, I wanted to display them as part of my "portfolio". So decided to host my code repo on github pages. 

I could have used html to render the entire thing but I wanted to use a template. I didn't want to use huge JS frameworks like React or Vue or Meteor.

## Polymer lit-html
I came across this rather out of the blu-ish but I figured it fulfilled my purpose. 

#### Install
```
npm instal lit-html
```

#### Code

```js
import { html, render } from './node_modules/lit-html/lit-html.js';

const header = html`<h1>CSS Battle</h1>`

const codes = [...]

const container = () => {
  return html`
    ${header}
    ${codes.map((item) => html`
      <div>
        <h2>Target ${item.id}</h2>
        <div>
          <img src="2019/target${item.id}.png" width=400 height=300>
          <div>${item.html}</div>
        </div>
      </div>
    `)}
`}

const el = document.body;
render(container(), el);
```

As you can see, the style is still pretty much js! But component based, in a way? Haha. 

One thing I found problematic was the styling. 

#### Development
lit-html required a server to run. I used `python3 -m http.server 8001` to open a localhost on port 8001.

## Deployment
#### Building
Had to download Polymer CLI to build it.
```
npm install -S polymer-cli
```

Create a `polymer.json` config file.
```json
{
  "entrypoint": "index.html",
  "shell": "index.js",
  "sources": [
    "src/**.js",
    "manifest/**",
    "package.json",
    "2019/*.png"
  ],
  "extraDependencies": [
    "node_modules/@webcomponents/webcomponentsjs/bundles/**"
  ],
  "builds": [
    {"preset": "es6-bundled"}
  ]
}
```
#### Pushing to Github pages
Because the file structure was build/es6-bundled.. I found in a google search to use something called git subtree!

It allows us to insert any repo as a sub-directory of another. In my way, I'm using it to push a certain sub-directory as a branch! 
```
git subtree push --prefix=build/es6-bundled/ origin gh-pages
```

## Yay
Check out my [css battles](https://kohrongying.github.io/css-battle/)