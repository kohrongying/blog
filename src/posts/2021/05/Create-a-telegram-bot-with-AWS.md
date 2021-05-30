---
title: "Create a telegram bot with AWS"
date: "2021-05-26"
tags:
- aws
---

Over the last month, I created a telegram bot that will query the PSI levels in Singapore.<!-- excerpt -->

{% asset_img 'hazy-bot.png' 'bot' %}

This is what I built with AWS using the [data.gov.sg](https://data.gov.sg/developer) api.

## The architecture
{% asset_img 'hazy-bot-arch.png' 'architecture' %}

It is a basic AWS *Serverless* model - API gateway with a proxy to lambda functions. In my case, I have one lambda for returning the telegram respone and one lambda to return the map image. 

In order to have a test environment and production environment, I set up two different *stages* in api gateway (dev and v1). I also created two versions and aliases in the lambda function (dev and prod).

The integration method will point to a specific version of the lambda function which will be deteremined by a stage variable called *lambdaAlias* defined in each stage.

For example: 
```
execute-api.amazonaws.com/dev/haze -> sg-hazy-bot:dev
execute-api.amazonaws.com/v1/haze -> sg-hazy-bot:prod
```

It is a pretty simple set up but I think it adds an immense amount of value to allow for continuous development and integration.

I also used this project as another chance to practice my IaC, by using basic terraform to provision the resources. I try not to use modules, and let everything be as barebones as possible. 

I faced some issues with the lambda permission for api gateway but it seemed to be a false positive. For example, it will say that

> The API doesn’t include a resource with path /haze/* having an integration on the ANY method.

But in actual fact, it is still able to work.

## Telegram Bot
I used Telegram's Botfather to create a test and production bot. Setting up the response endpoint was as simple as sending a post request to the telegram webhook api. 

## Image as a service
I was fascinated by placeholder images where the query string of the url could determine the image height, width, color etc of the desired image. I wanted to recreate something like this: 

```
https://via.placeholder.com/728x90.png?text=Hello+World
```

For this, I used Python's PIL library to add white rectangles and dynamic text.

### Some pitfalls
#### API Gateway configuration
In order for API gateway to display an image in the browser, the Binary Media Types has to be set to `*/*`. This is because the browser sends a request that Accepts `*/*`. 

Of course we can specify `image/*` as the binary media but your api call will have to add that in the request header.

One side effect is that the request that is proxied will be base64 encoded. As I am using the same API gateway for both lambda functions (same money la bro), I have to base64 decode the telegram request body.

#### Deploying PIL as a lambda layer
Another pitfall was trying to deploy PIL package as a lambda layer. I ran into this error: 

```
Unable to import module 'lambda_function': 
cannot import name '_imaging' from 'PIL'
```

The main problem is that it is missing all the support files needed for PIL to run and compile.

I blogged about the solution [here](https://todayrylearn.netlify.app/posts/deploying-PIL-to-lambda) in my TIL blog.

## The Conclusion
It was a fun project, practicing IaC as well as writing microservices. While writing the microservices, I also carved out the CI/CD pipeline, using Github Actions to deploy my lambda function. 

## Links
- [Github repo](https://github.com/kohrongying/sg-hazy-bot) for sg-hazy-bot
- [Github repo](https://github.com/kohrongying/turtmap) for image-as-a-service
- [Telegram bot](https://telegram.me/SgHazyBot)