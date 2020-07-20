---
title: Hello Sentry
date: 2019-08-30 10:18:34
tags:
- sentry
- error-tracking
---

[Sentry](https://sentry.io) is an error tracking tool, to log and visualize errors that are popping up from your system.<!-- excerpt --> It comes with multiple platform/framework integrations, including popular frameworks like React, Ruby, Django etc.

I've utilised it in my own React project, as well as helped to set it up in my company's front and backend services that is running on both React and Ruby on Rails respectively. 

## 👍 Sentry
For the free tier, it keeps errors up to 30 days, sends out email notifications, groups error according to type. Each error is tracked with more than sufficient information to know where the error existed.

Each error is also populated with IP address, browser type and version, OS version, the url, the specific line of code. To me, someone who has not used an error tracking before and had to resort to ssh-ing into the server to check the logs, which is not friendly or fun at all, SENTRY IS LIFE CHANGING.

Furthermore, it is super simple to set up. In React, it was just a package and an additional new line. 

I also set up [user context](https://docs.sentry.io/enriching-error-data/context/?platform=javascript#capturing-the-user), meaning able to add more information about _who_ caused the issue (name and shame baby. Of course its the developers fault). Just have to add in 3 lines of code at the part where you initialized or identified the user.

## 👎 Sentry
The free tier consists of one member per team only - but okay they need to survive. For small teams like ourselves and hobbyists, it is a super great tool.

## Error vs Logging

In my inexperienced little head of mine, I had equated error tracking with logging. I had assumed what I did with Sentry was logging.

Error Tracking != Logging

Logging like what Rails.logger does, logs the output of certain functions, be it warning or info. If the log status is an error, it will then probably be tracked by Sentry, an error tracking tool. 

Right now, I am still looking for a logging PaaS that has a good enough free tier. But Sentry has made me really happy! Not that I'm happy to receive errors (lol to be clear). 

Sad thing is that, as developers, we should probably aim for not having to use Sentry much. But we all know mistakes happen :) Important thing is to catch them and learn from them! 

![ILOVEIT](https://media.giphy.com/media/3onX0m9HTiFduxX90M/giphy.gif)