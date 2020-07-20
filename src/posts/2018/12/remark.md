---
title:  Remark JS
date:   2018-12-01 15:19:02
tags: 
- remarkjs
- staticrypt
- javascript
---


## tldr;

- [Remark.js](https://github.com/gnab/remark) for converting markdown to presentation slides in html<!-- excerpt -->
- [StatiCrypt](https://github.com/robinmoisson/staticrypt) to protect a static page with a password using encryption
- Change your hidden file extension to `index?.html` to hide it from being rendered while having it checked into your version control.

## Hello. 

The funny thing was that this post, or rather this blog, would not have been created if not for a presentation that we created using markdown and javascript and needed to be hosted somewhere. Our company utilises bitbucket for their endless supply of private/public repositories that fit our nice small team of 3. Since all of our repositories are there, we explored using bitbucket pages to host our static presentation page.

So more about the presentation! We were one week away from our retreat and we all sat down and thought about what to present. One of us had opened up Google Slides initially (Google can sponsor? Haha no.) but somehow we decided to go against the tides and do something unconventional. We wanted to write in markdown.

In comes [RemarkJs](https://github.com/gnab/remark). 

## RemarkJs

It is a simple, in-browser slideshow tool, that converts your markdown into slides. 

```
class: center, middle

# Hello

---
<script src="https://remarkjs.com/downloads/remark-latest.min.js">
</script>
<script>
    var slideshow = remark.create();
</script>
```

This would have transformed it into a slide on the browser. Awesome. You could also configure it to give you different slide dimensions, set templates, set a layout for all slides to follow, add background images.

Another cool thing was the presentation mode:
- Type `c` to duplicate the screen
- Type `p` for presenter mode (you have notes!)

### The painful

Of course it wasn't always rainbows and butterflies. There was a slide where we needed a 1 x 3 layout and we had to revert to html to write it. But luckily we were able to write html within the markdown. 

So it doesn't come as a surprise when you should only use such tools when your presentation is minimal and not image fancy. 

So, we deployed our index.html file to bitbucket. (Quick Tip: Rename your repo to be your team name. eg. xx.bitbucket.io) and head to https://xx.bitbucket.io and you would see your slides there.


![Sian](https://media.giphy.com/media/3o7TKsxv7GtONck2VG/giphy.gif)

Yay! But wait.

We are kiasu Singaporeans. And we wanted our slides to remain confidential. Bitbucket's website writes that: `[even] if your Bitbucket repository is private, users can still visit and view the static website.`

## StatiCrypt

We considered some options:

1. A server-side authentication using password
 - Pro: Simple Logic
 - Con: Server side meant moving away from static sites and having to provision an endpoint, which is more work. 
2. A client-side authentication with password
 - Con: Defeats the purpose as plain-text password stored in the static js files can be displayed easily

[StatiCrypt](https://github.com/robinmoisson/staticrypt) solves our use case quite wonderfully. 

## (Almost) as fast as a hare

```
npm install -g staticrypt
staticrypt index.html mysecretpassword
```

{% asset_img 'static-site-1.png' 'static-crypt' %}

The `index_encrypted.html` file created will have its contents encrypted using AES-256. When you open `index_encrypted.html` locally, you'll be prompted to enter a passphrase. Upon correct entry, you'll be granted access to the index.html file! 

Remember to rename the encrypted file to `index.html` so that the encrypted file will be the one rendered on bitbucket. Now the question is, what do we do / rename the original, unencrypted `index.html` file to?

If we rename it to any other name like `whyareindexfilescalledindex.html` or `whynothome.html`, we realised that we would be able to still navigate to that html. Which is not encrypted! Which means we encrypted it for nothing!! 

Even if we changed the file extension to `index.abc`, but we could still see our unencrypted contents! 

![Security](https://media.giphy.com/media/11V3dAPYzVNP8s/giphy.gif)

## Changing file extensions 

We came up with the idea of changing the file name to `index?.html`. And it worked! Going to `/index?.html` gave us a `File not found` error message. Our guess is that the question mark is used as a separator before the query parameter. Yay. Simple hack. 

Of course, if we didn't want it rendered, we could have just removed it from version control (added it to `.gitignore`. But how are we going to share the file? Email? `.env`? We were really clueless here haha.) So that was what gave birth to that hack.

Okay. So that's it. It was a fun Friday. Till next time.