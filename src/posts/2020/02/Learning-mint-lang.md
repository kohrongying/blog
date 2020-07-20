---
title: Learning mint-lang
date: 2020-02-09 11:20:32
tags:
- mint-lang
---

I built [Jason Mendoza Says](https://kohrongying.github.io/jason-mendoza-says/), comprising of things that Jason Mendoza says from the show, The Good Place. If you do watch it, you'd understand why Jason deserves this.<!-- excerpt -->

{% asset_img 'tgp.png' 'tgp' %}

It was a pretty simple webapp hence, the best project for learning a new language and framework!

## Introducing Mint-Lang
[mint-lang](https://www.mint-lang.com/) is where Elm and ReactJS have a baby. I have not particularly used Elm, but I think this flavour of functional programming seems to be kicking up a storm. 

It came with all batteries included: 
- dev server
- code formatter
- test runner
- package manager
- documentation generator
- build tool
- routing built-in

## Introducing the generator
### Scraping quotes
I used [SimpleScraper](https://simplescraper.io/) to scrape Jason Mendoza quotes from [wikiquotes](https://en.wikiquote.org/wiki/The_Good_Place). I ran a python script to filter out only those said by Jason.

### Storing quotes
I stored each quote as an endpoint on [JSONBase](https://jsonbase.com/). (LOL JSON sounds like Jason)

### Main.mint
I followed [this guide](https://www.mint-lang.com/blog/handling-http-requests) to complete the http request to the endpoint. 

I added a random sampler as part of the sequence.
```
next { id = Array.sample(Array.range(1, max)) |> Maybe.withDefault(1) }
```

I had faced some trouble with getting the correct output from `Array.sample` as it returns a `Maybe` instead of a `Number`. The key was knowing to pipe the result through `Maybe.withDefault(1)` in order to fallback to a default value. 

Next, I just added a button that will load the store on every click. 

## Thoughts on mint-lang
There's still a lot of the language that I have to learn but I like the static-typing practice. It is also very humbling to learn a new language and adopting a different mindset when coding. This includes having to define the data structure first and setting up defaults. 

Very excited to continue to use this language!

Check out my github repo [here](https://github.com/kohrongying/jason-mendoza-says)

[Jason Mendoza Says](https://kohrongying.github.io/jason-mendoza-says/)
