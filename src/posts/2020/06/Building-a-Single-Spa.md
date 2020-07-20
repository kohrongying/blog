---
title: Building a Single-Spa
date: 2020-06-30 14:45:15
tags:
- single-spa
- react
- svelte
- figma
---

I came across the single-spa project while looking for how to build microfrontends. I first heard of microfrontends from ThoughtWorks Tech Radar <!-- excerpt -->and I was intrigued by an [article](https://martinfowler.com/articles/micro-frontends.html) on Martin Fowler's website as well. So I wanted my hand at trying it out.

## Microfrontends
So I won't go into _why_ microfrontends, I believe there are many articles out there that write about it. I do believe in its value and that this value differs based on the scale and requirements of the project. 

So, [single-spa](https://single-spa.js.org/) is a framework that helps you build multiple frameworks (React/ Angular/ Vue/ Svelte etc) in one single project. Of course you can deploy each framework separately and achieve your microfrontend there.

## Project setup
For my set up, I decided to try a React x Svelte project. I mainly followed this [tutorial](https://dev.to/dabit3/building-micro-frontends-with-react-vue-and-single-spa-52op). The only hiccup I faced was integrating Svelte. 

Besides the Svelte single-spa package, I also had to install the [svelte-loader](https://github.com/sveltejs/svelte-loader) for webpack in order to compile the Svelte code. 

## Project Structure
My structure follows such:

```
|- single-spa.config.js
|- webpack.config.js
|- index.html
|- index.css
|- .babelrc
|- package.json
|- src
    |- react
        |- main.app.js
        |- root.component.js
    |- svelte
        |- main.app.js
        |- App.svelte
    |- shared
|- dist
```

The `single-spa.config.js` is surprisingly straightforward to read.
```js
import { registerApplication, start } from 'single-spa'

registerApplication(
  'svelte', 
  () => import('./src/svelte/main.app.js'),
  () => location.pathname === "/svelte"
);

registerApplication(
  'react',
  () => import('./src/react/main.app.js'),
  () => location.pathname === "/"
);

start();
```

Here, it tells you to render different files based on the url. And in each framework's `main.app.js` file, it is important to denote the rootComponent, domElementGetter (which is what you specify in the index.html) and also export the bootstrap, mount and unmount methods.

It is pretty cool.

## I also tried out Figma
Their free tier is good enough for a hobbyist with up to 2 collaborators and unlimited projects. I like that I don't have to download a package and everything is saved on the cloud. The controls are sleek and UX is pretty smooth.

I miss the Adobe XD copy and drag function, which I felt was lacking.. I had to copy and paste multple same elements, not sure if there is a shortcut for that? 

But in all, it is a pretty impressive tool! 

## The end.

You can find my code in my [repo](https://github.com/kohrongying/weather-spa) or try out the [WeatherSG SPA](https://weathersg.netlify.app/)