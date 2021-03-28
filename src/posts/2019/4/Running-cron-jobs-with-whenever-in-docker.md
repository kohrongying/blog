---
title: Running cron jobs with whenever in docker
date: 2019-04-05 15:50:58
tags:
- docker
- rails
- cron
---

For the past 3 days, I've been thinking of ways to handle cron jobs in Docker. <!-- excerpt -->

These are the work constraints / requirements:
- One docker image running ruby and rails
- Same image used for production and staging VMs
- Using whenever gem 

Few ideas to go about tackling the issue:
1. Expose jobs as an API endpt, then have another container to hit them periodically
2. Copy and paste the crontab into the digitalocean droplet, and execute the cron job through docker exec
3. Use whenever gem in existing container

I decided to go with #3 because #1 requires another layer of security which is troublesome and #2 needs manual action to copy and paste upon changes made to the crontab.

### First things first
Install cron and get cron to start working on the container.

```
...
RUN touch /usr/src/app/log/cron.log /usr/src/app/log/error.log
RUN apt-get update && apt-get -y install cron
RUN bundle exec whenever -w

CMD service cron start && bundle exec puma -C config/puma.rb
```

This was simple enough - only that I faced troubles at first when I ran the `service cron start` in a  RUN rather than as the CMD.

I also added timezone :) 

```
ENV TZ=Asia/Singapore
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
```

### Second things second
The second issue surfaced fast - I realised that I was running it in the wrong environment. Whenever gem documentation states that default environment is production. But I was testing it in staging and my production db wasn't set up hence giving me error. (It was good also, because I didnt want any test crons to run on prod db **horror**)

I tried many ways like trying to run the container with env variable but I realised it needs to be a build variable but I can't have two different build variables for one image.

So I found a simpler method which was to just add an additional line in my CI tool, to execute an additional line of code after updating the image on my droplet.

```bash
docker exec \
$(docker ps -q -f name=myapp_app) \
whenever -w --set environment=staging
```

This line is quite cool - I'm telling docker to execute a command (line 3) on the container who's id is (line 2 - targets the id of the docker container)

I swear code is like magic.

![IAMWITCH](https://media.giphy.com/media/zIwIWQx12YNEI/giphy.gif)

### Third things last
I found out yet again my cron jobs didn't run because of a PG:ConnectionBad error! Then when I checked and ran `rails c` and checked my models in my rails console, I got the same error!

Omo!

SO MY STAGING DB WASN'T CONNECTED AT ALL?

I immediately switched to using url in my `database.yml` file, instead of specifying host, username and password separately. And it worked.

```ruby
staging:
  <<: *default
  database: staging-db
  url: <%= ENV['STAGING_DB_URL'] %>
```

And set your environment variable

```
STAGING_DB_URL: "postgres://<username>:<pw>@<host>:5432/<dbname>"
```
I don't know why. Heh.

### Wrapping up
I feel like I went through multiple betrayals this week. 


I really hope my cron jobs run :( 

So that's my week!