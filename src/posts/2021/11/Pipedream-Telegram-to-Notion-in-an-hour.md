---
title: "Pipedream Telegram to Notion in an hour"
date: "2021-11-16"
tags:
- pipedream
---

Last time I blogged about setting up a telegram bot with AWS. That took a few days of effort to write the lambda webhook as well as the IaC for AWS resources. This time with Pipedream, I took an hour.
<!-- excerpt -->

## The Need
Do you ever come across interesting articles or text and wished you can bookmark it somehow? I wanted to use a telegram bot to save such information somewhere. 

## The Tools - Pipedream
I came across this SaaS called [Pipedream](https://pipedream.com/). It creates the underlying microservices, APIs, integrations for us so that developers don't have to sweat on it. 

Let me know you what I managed to do in an hour:

### 1. Set up Telegram bot as Event Source on Pipedream
- Create bot through BotFather on Telegram
- In Pipedream, Create New Source > Telegram Bot > Message Updates (Instant) 
- Input telegram bot token 
- Pipedream sets up the webhook automatically to the telegram bot

### 2. Set up workflow with Notion Integration
- In Pipedream, Create New Workflow
- Select Trigger > Telegram Bot > Choose the source created in previous step
- Click Add Integration > Choose Notion > Connect your Notion account
{% asset_img 'pipedream.png' 'pipedream' %}

### 3. Share your Notion page with Pipedream
- Go to your Notion page
- Find the Share button > Click on Add people, emails, groups, integrations
- Select the Pipedream integraiton 

### 4. Write some very simple code
Most of it is using [Notion's API](https://developers.notion.com/docs/getting-started#step-3-add-an-item-to-a-database).
```js
async(event, steps, auths) => {
    const NOTION_DATABASE_ID = "todo";
    const text = event.message.text; // event from Telegram Bot

    return await require("@pipedreamhq/platform").axios(this, {
        url: `https://api.notion.com/v1/pages`,
        method: 'POST',
        headers: {
            Authorization: `Bearer ${auths.notion.oauth_access_token}`,
            "Notion-Version": `2021-08-16`,
            "Content-Type": "application/json"
        },
        data: {
            "parent": {
                "database_id": NOTION_DATABASE_ID
            },
            "properties": {
                "title": {
                    "title": [
                        {
                            "text": { "content": text }
                        }
                    ]
                }
            }
        }
    })
}
```
Remember to trigger the "Listening for new events" for your trigger and test it!

## Thoughts on Pipedream
What I like:
- Very fast and fuss free set up
- Works with out of the box integration with popular services
- Able to see logged events and use them as test scenarios
- Able to use js libraries 

Some things that I would consider more if I were to use it for production:
- CI/CD Deployment of code
- IaC
- Support for multiple environments
- Only js support

## Pricing

Pipedream is free for developers with unlimited workflows and sources/events. That is superrrr generous, and great for small developers like myself.