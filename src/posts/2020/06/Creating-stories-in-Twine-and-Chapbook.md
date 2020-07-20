---
title: Creating stories in Twine and Chapbook
date: 2020-06-17 16:31:52
tags:
- twine
- javascript
---

[Twine](http://twinery.org/) is an open source tool to create non-linear stories. <!-- excerpt -->If you've read The Hardy Boys Adventures (lol this is how old I am :P), you may be familiar with non-linear adventures or story telling. Basically, a choose your ending kind of adventure. And Twine is a tool to help you tell that story in a very easy manner. No coding required!

## Twine

Check out the Twine landing page [here](http://twinery.org/). Don't let the landing page fool you as it is a super cool, super interesting and super easy tool to set up. I have only personally used the Web online version even though Twine comes as a downloadable executable for both Windows and Mac.

### Story Format

{% asset_img 'story_formats.png' 'story_formats' %}

The default is Harlowe. I do enjoy the simplicity and dark theme of Harlowe but I also love the form and functionality of Chapbook. 

One limitation of Harlowe is that they don't allow for textfields. The only alternative is to use their alerts. But from a UX perspective, it was not ideal, hence I shifted to Chapbook.

Chapbook documentation can be found [here](https://klembot.github.io/chapbook/guide/)

### Writing the Story

{% asset_img 'flow.png' 'story_flow' %}

As you can see, the very premise of writing stories is the flow from passage to passage. This is enabled by the simple syntax
```
[[Next->Next Page]]
```
where `Next Page` is the title of the next passage while 'Next' is the link text.

Chapbook comes with other forms of customizations like [text input](https://klembot.github.io/chapbook/guide/player-input/text-input.html), [dropdown menu](https://klembot.github.io/chapbook/guide/player-input/dropdown-menus-cycling-links.html), embedding passages, variables and conditional variables. They even support [image embed](https://klembot.github.io/chapbook/guide/multimedia/images.html) from [Unsplash](https://unsplash.com/) and [Flickr](https://www.flickr.com/)

### Variables

They use a simple yaml-like syntax for the declaration of variables. Variables are key-value pairs, separated by a colon and separated from the actual body of the passage by two dashes. 

They also support conditionals but only simple integer computation based or boolean based conditions. I would say it is hard to check for substrings in strings or anything else too complex. 

It is important to remember the `[cont]` as it acts like an `end-if` since this 'language' is neither indent-based like Python or has the use of curly brace like Javascript.

```
numMarbles: 0
--

[if numMarbles > 0]
You get {numMarbles} shots
[else]
You ran out of marbles
[cont]
```

If you require the use of more complex conidtionals, you can consider writing custom Javascript.

### Javascript
Chapbook allows for the use of [JavaScript in passages](https://klembot.github.io/chapbook/guide/advanced/using-javascript-in-passages.html). In my use case, I wanted to make a post request to my server to save responses from the story. 

I made use of Fetch api which is shipped with Javascript.

```js
fetch(yourURL, {
	method: 'POST',
	headers: {
      'Content-Type': 'text/plain'
    },
	body: JSON.stringify({ 
		name: engine.state.get('myName')
	})
})
```

I was quite mindblown that this was possible. It is definitely not the best way and I believe it is susceptible to attack as well but we'll get there when we get there.

## My deployment pipeline

After designing my story online, I chose the `Publish to File` option which will generate a html file. I saved that html in a folder, initialized a git repo in it.

I renamed the html to `index.html`, added a favicon in the folder and linked it in the html.
```html
<link rel="icon" type="image/png" href="favicon.png">
```

I committed the index and pushed it to the repo, setting up a Netlify build on push pipeline. The netlify static site will thus be build.

Continuous Deployment hurrah. Not entirely integration as there's still some manual steps required to download and rename the html file. 

Alternatively, scripts can be written to automate that.

## Summary
Twine is fun! And Chapbook is cool! Check them out and create your own stories. And share them with the world.

Thanks for reading till here!