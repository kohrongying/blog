---
title: avatars
date: 2019-05-06 23:32:27
tags:
- python
- random-generator
---

So it was a random idea to do a random project about a random number
<!-- excerpt --> generator that is at the core of a random avatar generator.

[Avatar-generator](https://github.com/kohrongying/avatar-generator) is a project written in Python and it uses Pillow (a python imaging library) to draw and save the images.

{% asset_img 'avatars.png' 'demo' %}

What I found interesting (after doing up the logic) was customizing the code through the use of ArgumentParser. The way we can add arguments through flags, and set boolean values using `action='store_true'`. It was truly eye-opening. And I created more arguments that I would have actually needed. 

Next step was to build an api. 

In my mind there are alternatives to how to do this:
1. Flask App with an endpoint
2. Cloud function

Will return soon to write about this!
