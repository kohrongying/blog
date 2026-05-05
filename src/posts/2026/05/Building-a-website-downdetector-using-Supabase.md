---
title: "Building a website downdetector using Supabase"
date: "2026-05-05"
tags:
- postgresql
- supabase
- telegram bot
---

My downdetector bot (@DownOrNotBot) is now live!<!-- excerpt -->

My motivations were simple. Few days ago, I created a new website. In addition to website traffic monitoring and SEO, I also wanted an alert system in case it was to go down without me knowing (failed deployment, not paying for my domain??). Regarding choice of infra - I've always wanted to try out [supabase](supabase.com). 

{% asset_img 'downdetector.png' 'downdetector-architecture' %}

## Efficient tooling

Architecture and design is really simple. Using a postgres server (base plan) from supabase and create two tables - one to store the websites we need to monitor and one to track the visit history. Nice thing about supabase is being able to install other postgres integrations. Running cron jobs had never been easier - simply enable `pg_cron` in the integrations section. I could create a new cron job, update the cron interval and even integrate with a Supabase edge function all through the web console. Even handles the auth portion nicely for you.

The edge functions have auth set up out of the box. Only catch I had was needing to disable `Verify JWT with legacy secret`. Supabase has its own client library for querying the tables, so I used that. While debugging I also tried using the python requests module to post and get from the postgres data api ([postgREST](https://docs.postgrest.org/en/v14/)). It was pretty cool. I would think that in enterprise solutions or bigger projects, being able to write your own SQL or having a ORM layer on top of your tables will bring about the most flexibility. However for my small projects like this, this set up was really fast and efficient. (I was lazy and just developed in the web console :p)

## Limitations

Not sure how well it works with aggregate functions like GROUP BY. I see avg, min, max, sum, count is supported but doubtful if it can meet all use cases for grouping and more complex aggregations. I see possibilities of work arounds with creating more views just to handle certain edge cases.

Another issue is database migrations an schema changes. [Migrations](https://supabase.com/docs/guides/deployment/database-migrations) on supabase are handled through sql, much like traditional db migrations as well. Only limitation is having to rely a lot on the supabase tooling. 


## ciao!
In all, a fun and quick experiment with supabase!