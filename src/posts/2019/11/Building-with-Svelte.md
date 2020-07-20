---
title: Building with Svelte
date: 2019-11-03 16:38:46
tags:
- javascript
- svelte
---

[Svelte](https://svelte.dev/) is a framework that surgically updates the DOM when the state of your app changes.<!-- excerpt -->

{% asset_img 'portfolio.png' 'portfolio' %}

This is the product built with Svelte.

I used a lot of React at work, but I always had to wait a couple of seconds to create a react-app, install and start the dev server. Coincidentally, I had wanted to update my portfolio so I used Svelte to build it. 

## Thoughts on Svelte

My first thought was that -- it's really blazing fast. The barrier to writing code is also low. It is component based like React / Vue. Everything can be written in pure html, css and js.

It builds super fast and everything is as minimal and necessary as it has to be. It is also easy to pick up and needs minimal configuration.

Eg. A for loop in Svelte
```
{#each repos as repo}
  <div class="card">
    <a class="site-link" href={repo.url}>
      {repo.name}
    </a>
    <span>{repo.desc}</span>
  </div>
{/each}
```

## Building my portfolio
I chose to build and style everything myself, instead of relying on a component library (also because there wasn't a very large community support one for Svelte out there). Well, it was kind of good practice as it is easy to become reliant on libraries like Material UI, Ant Design.

After styling the main pages, I started to build for responsiveness, using css media queries.

I also used `data-theme=dark` to style for dark mode, which is getting rather popular nowadays.

Here are the results. I am quite pleased with it. 

{% asset_img 'portfolio-small2.png' 'demo' %}
When viewed on mobile devices

{% asset_img 'portfolio-dark.png' 'demo' %}
| Dark mode enabled

## Random Bonus

This was also my first time using Github Actions! (Sign up for the beta before 13 Nov, after that it will be GA :p)

As I wanted this to be my user github page which deploys only from master, I chose to deploy the code to ghpages (or any other branch) and to push a deploy commit to master every time I push to the branch.

This was my `build.yml` file.

```yml
name: Build on push
on:
  push:
    branches:
      - gh-pages

jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@master
    - name: Build and Deploy
      uses: JamesIves/github-pages-deploy-action@master
      env:
        ACCESS_TOKEN: ${{ secrets.ACCESS_TOKEN }}
        BASE_BRANCH: gh-pages
        BRANCH: master
        FOLDER: docs
        BUILD_SCRIPT: npm install && npm run build
```

I used container from `JamesIves/github-pages-deploy-action@master` which handled the deploying. The only configuration done was to create a github secret token and save it to the repo. After that, the workflow was created and I was surprised everything went quite smoothly.

One issue was that the github user page somehow was not building properly. One solution is to create a `.nojekyll` file at the master branch root. I was unsuccessful in adding it in a step as part of the github actions, for some reason.


So that concludes my experiment with Svelte. I will sure use it another time! 