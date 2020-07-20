---
title: caddy - web browser
date: 2019-05-06 23:38:30
tags:
- rails
- docker 
- nginx
---

I encountered mixed content errors from my browser as Netlify enforces api requests to be made over https, while my backend did not have a domain. <!-- excerpt -->

## The Initial Solution: 
Set lets encrypt on my Nginx Docker Container

### Problems: 
- No straightforward solution to install lets encrypt on docker container
- Difficult to set up renewal process for the certs as well 

## The Final Solution:
[Caddy](https://caddyserver.com/) - reverse proxy from my localhost post to my domain with automatic HTTPS. Yes, automatic!! HTTPS!!

### 1. Get a domain

Yes you would still require a domain. Lets encrypt doesn't allow ip addresses to gain https certificates. So you have to get a domain or a subdomain.

### 2. Get domain to point to your droplet IP
In my case, the domain was managed by DO so we just had to create a new A record for the subdomain

### 3. Configure Caddy

Download [Caddy](https://caddyserver.com/download).
```
curl https://getcaddy.com | bash -s personal
```

Create a `Caddyfile` (in my case, is of a redirect)
```
domain.com {
  proxy / localhost:3000
}
```

### 4. Get Caddy to run in the background 

#### 4a. use `nohup`

#### 4b. use `tmux`

Tmux was a terminal multiplexer which served my needs sufficiently, hence I went with that.

Tada! Caddy to the rescue. No more nginx containers, no more renewal for lets encrypt. This is really a gem. Saved me time when trying to get my frontend and backend working together!