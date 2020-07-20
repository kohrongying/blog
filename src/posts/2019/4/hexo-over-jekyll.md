---
title: hexo over jekyll?
date: 2019-04-04 22:01:33
tags: 
- jekyll
- gh-pages
---

Once upon a time, I had a blog built using jekyll. There were still <!-- excerpt --> many things to configure so I wanted something more barebones. Hexo seemed like a good choice after a quick duckduckgo of static site generators out there.

However, it took me 1.5 hr to deploy my first site to github pages... (；￣Д￣)

### Deploying to github

This part was simple. Just had to install the `hexo-deployer-git` package and set up the correct configuration. 

```
deploy:
  type: git
  repo: <repo-url>
  branch: gh-pages
  message: 
```

I was going to host my blog on github as a project page. Hence, my branch needed to be **`gh-pages`**

However, to my ( : ౦ ‸ ౦ : ), the styles were gone and everything looked like crap (css we love you please never go away), and I realise it is because the paths of the stylesheet and images were not rendered correctly.

### Config

Realised that you have to change the `_config.yml` file.

```
url: https://site.com/blog
root: /blog/
```

But then, ╮(￣ω￣;)╭, it didn't work. 

The key realization only came when I ran `hexo server` and realised that there was the error on my local server as well. I had thought it was a deployment issue!

I just needed to change `/styles/style.css` to `styles/style.css`, JUST THAT BLOODY SLASH.

Then after x rounds of googling (duckduckgo really don't shine in times like these...), I realise that...

It was the THEME that I downloaded that was screwing up the generated index file. 

The line `/styles/style.css` was hardcoded!!! Angry.

### Fixed

Yeah so after that, everything worked. I made sure to change the URLs for the image and styling using the root as a variable. 

Instead of `href="styles/site.css"`, I changed it to `href=config.root+"styles/site.css"` so that the other links like `/archive` will render the following styles. 

I guess lesson is: you can try to search for such erroneous files from the beginning. And do things more methodologically! And also that what you see when running hexo server is really what you get when you deploy. (WYSIWYG)

┐( ´ д ` )┌


Kaomoji for the win! 