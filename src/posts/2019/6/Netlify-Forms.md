---
title: Netlify Forms
date: 2019-06-30 00:02:11
tags:
- netlify
---

Netlify magic helped to migrate a rails app to a JAM stack, saving us the monthly cost of a digital ocean droplet as well. <!-- excerpt -->

## The project
A simple landing page website with a contact form

### The old
- Rails backend
- Bootstrap, CSS, JS libraries
- Controller for posting contact form 
- Mailer to mail out response to in charge


### The upgrade
- Copied the styles, js and fonts out into a js project
- Copied the html out 
- Used a gulp framework for minifying code, hot reload, copying src files into public
- Used Netlify Forms for the contact form
  - Added `netlify` attribute to form


### The new
- View form responses on netlify portal or use Netlify custom notifications to send email upon form submission
- Spam filtering
  - Added honey-pot field
  - Added hidden field
- JAM Stack - no need for backend nor any cloud function
- ZERO cost

![AMAHZING](https://media.giphy.com/media/3o6Ztasg35PqqxzeJG/giphy.gif)