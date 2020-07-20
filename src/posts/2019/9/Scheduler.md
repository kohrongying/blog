---
title: Google Cloud Functions + Scheduler
date: 2019-09-16 15:23:45
tags:
- gcp
- python
---

This week at work I had a new task and got to try out Google Cloud Functions and Scheduler (Cron Job).<!-- excerpt -->

## Task
1. Scrape website
2. Use Sheets API to update cells in Google Sheet
3. Repeat step 1 - 2 once a week

## Python Web Scraping
For this task, I used requests and Beautiful Soup to parse the html. 

However, one setback I faced was that the website was behind Cloudflare's service provider so it prevented me from using requests to read the contents of the html file. 

Luckily there was another package, [Cloudflare Scrape](https://github.com/Anorov/cloudflare-scrape), that allowed us to bypass cloudflare bots.

## Google Sheets API
I installed the python client for GCP's API and various other libraries in order to get it to work.

First, enable the Google Sheets API.

Second, the `quickstart.py` code from Google would read a `token.pickle` file (if any, else create one from the credentials file - you have to download it from GCP) to authenticate the user. 

The tip from Google was to do batch updates and batch gets from Sheets API. My data was spread over 8-10 different sheets in one Google Sheet file. Hence, using batch get and update was going to help performance wise (not that I tested it)

## Google Cloud Functions
With the increasing focus on breaking up monoliths, microservices and serverless, I decided to go with Google Cloud Function, having used alot of Firebase Functions during work as well. 

In order to deploy a function, create a `main.py` file and add a function in there with a request argument if you would require the arguments or body of the incoming request. Add packages you used into `requirements.txt` file (the python environment in the Cloud will install these before configuring your function). (Tip: If you're in a virtual environment, use `pip freeze > requirements.txt` to save all the dependencies into the text file)

```python
# requirements.txt
beautifulsoup4==4.8.0
bs4==0.0.1
cfscrape==2.0.8
google-api-python-client==1.7.11
.
.

# main.py

def hello_get():
  return ('Hello World', 200)
```

To deploy, run:
```
gcloud functions deploy hello_get \
      --runtime python37 --trigger-http
```

So, I refactored some code and made sure one main function called the scraping function and the subsequent batch get and update functions. 

I ran into issues with the Google Sheets API. It is complaining that it couldn't read `credentials.json` file anymore. So I had to use another way to authenticate the function to allow it to read and write to the Google Sheet.

### Autheticating for Google Sheets

In the GCP Project, create a new service account. Share the google sheet with the email address of the new service account created. 

And that's all! In my code, I don't have to use any other keys or creds because the function belonging to the GCP has permissions to the google sheet already. 

### Securing the endpoint

I read in an article somewhere to secure the endpoint in the most basic way. I did not want anyone to just hit the endpoint easily. Two ways:

1) Append random alphanumeric characters to the function
People won't be able to guess the endpoint now.

2) Send a hardcoded token in the query param of the endpoint
Check that `request.args.get('token', '') == hardcoded_token`, then proceed to run the rest of the function

Get random number
```
openssl rand -base64 48 | tr -d /=+ | cut -c -32
```

## Cron Job
To deploy the cron job: 
```
gcloud beta scheduler jobs create http <cronjobName> \
       --schedule="0 7 * * 1" \
       --uri=<uri>
       --time-zone="Asia/Singapore"
```

Otherwise, you can use GCP Portal to configure the cronjob too!

That ends this post. Chill out peeps.

![AMAHZING](https://media.giphy.com/media/3o7btYRcGPDrQ0YTy8/giphy.gif)