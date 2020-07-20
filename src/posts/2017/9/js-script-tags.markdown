---
title: Javascript Script Tag ONCE AND FOR ALL
date: 2017-09-13
tags:
- javascript
---

So I'm still a javascript noob but for two so years<!-- excerpt -->, I've seen script tags put in the head or at the bottom of the page. If I'm lazy I write it in the html itself. What is the practice?? What difference does it make?? 

I think I should find out. LOL.

Places where I can include javascript:
- Script tag in <head>
- Inline with Body
- Script tag at the end of the HTML file

So a simle illustration done in powerpoint. I don't even know why I did it LOL. Hope it helps future me. 

{% asset_img 001.JPG demo image %}

Things I feel I should already know:
- Scripts are downloaded in parallel but executed sequentially
- `async` means to "execute this whenever", execute this after loading the whole page or after all script have been executed
- `defer` means to wait for the parser to finish to execute this. Equiavalent to using jQuery.ready, so the code runs when everything in the DOM is available. code with defer will run after HTML is fully parsed.
- `integrity` tag with a hash value, verifies that you're loading a script from a credible third party.

{% asset_img 002.JPG demo image %}

Recommendations/Lessons:
- Library scripts like jQuery in head
- Place normal scripts in head until it becomes a performance/page load issue 
- For use of canvas, put it at the end of the boy
- Avoid script in the markup like `<input onclick="myfunction()"/>`