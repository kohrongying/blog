---
title: "Vibecoding my everything-tracker"
date: "2026-04-05"
tags:
- ai
- llm
- vibecode
---

Ever since the birth of LLM and AI coding agents, vibe coding is pretty much a thing for all software engineers, including me.
<!-- excerpt --> 

I've vibecoded at work, and doing so again outside work for my own personal project and I'm here to blog a little about it. 

Firstly, disclaimer that I'm stingy af so I did not pay for a subscription plan. I've been using AI coding agents on a free plan - namely, [Copilot](https://github.com/features/copilot/plans)'s 50 free agent chats a month and Amazon Q. I've wanted to try out Claude Code but sadly its not free.

So, my idea is to generate a everything tracker app, building upon my [expense tracker](https://github.com/kohrongying/expenses-tracker) app which was written by me in 2018 (omg the days you had to code everything yourself or copy in chunks from stackoverflow). I wanted to zhng it to include a meal tracking as well as focus time tracking functionality plus update the UI to something more modern.

## The Frontend
With a markdown prompt, I was able to get the frontend up and deployed in 2 hours. I requested for SvelteKit as my framework with typescript, and daisyui + tailwindcss. 

## The Backend

My backend (Lambda and Fast API) was up and deployed in 2 hours as well. However, deployment is always tricker than having it work locally. Here's some sharings or thoughts about what went on:

1) Copilot correctly generated the CDK package and the lambda, with code asset but failed to add bundling step. Had to add this [commit](https://github.com/kohrongying/everything-tracker/commit/6c015ab2b9e3617a98d53df21db1fec640abec1b) to add that code bundling. Even after prompting, it used pip to bundle while my project was using uv, giving rise to bundling errors.

2) Deploying to AWS API Gateway mandates a stage variable as part of the url which FastAPI is unaware of, resulting in missing links. For example, FastAPI internally will expect pages to be routed to apigw.com/pathName, but in actual fact, the url is apigw.com/stageName/pathName. It was easy for me to catch because I'm familiar with API Gateway behavior so it was a matter of [updating the root path for FastAPI.](https://github.com/kohrongying/everything-tracker/commit/5f23fc0b45f7e59be1b2c12f9339d6ebb9471879)

3) CI/CD through Github actions is kind of a hit and miss. There are many ways to deploy code to cloud (Using role assumption with secrets, OIDC). In times like this, I'd rather copy and paste from my own repositories, choosing to use OIDC for a working example.

4) Logging: I prompted Copilot to add logging to my backend. Copilot wrote its own Cloudwatch Formatter. After deploying [that](https://github.com/kohrongying/everything-tracker/commit/f11397b5e1940516064c99c00e6b69ea01d56adc), I realized (very randomly on Google) about the existence of [aws lambda powertools](https://docs.aws.amazon.com/powertools/python/latest/), which is a developer toolkit with best practices for logging/tracing etc. Can't say AI was wrong because its own Formatter did definitely still work. So I prompted it again to use this library (which I think made the code cleaner), actively choosing to have this dependency built as a lambda layer instead of bundling. In this case, I think its always good to have experienced reviewers/engineers to recognise some standards to use/follow

Despite that, I still had a good experience vibe coding it, having a UI and a backend + infra up in a weekend, without much hiccups is a winnn. I even had magic link generation and verification complete, which wass amaze amaze amaze because I've not done anything close to that before and it saved me hours of research and writing code.

My github monorepo: https://github.com/kohrongying/everything-tracker