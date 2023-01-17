---
title: "Committing secrets into Github"
date: "2022-12-10"
tags:
---

Recently I committed a crime.

I had committed aws keys into Github! So I'm here to blog about some of my observations.
<!-- excerpt -->

## Leading up to my crime
So the context was: I know that secrets are not meant to be committed. I usually gitignore .env. But there are two main culprits:
1. The envVar.ps1 powershell script
Environment variables are exported differently in a powershell script as compared to a bash script in a unix environment
```bash
# unix
export VERY_SECRET_SECRET="i like cats"

# powershell
$env:VERY_IMPORTANT_SECRET="i also like dogs"
```
I initially committed a script with empty values. But then when I do my local dev, I made changes to this file and I knew that this need to always be an unstaged change.

2. My carelessness in bulk git adding
I was working on a rather major refactor of my code (turtmail), which involved organising code into packages/folders/modules, creating a lot of changes in my local. I naively checked all the default changelist (on PyCharm), including my envVars.ps1 which contained some secrets

## Immediate Feedback received
I was notified that I had committed a grave crime when I received emails from AWS as well as GitGuardian (like couple of minutes later). AWS took action to suspend my account (interesting there was a deny policy on the IAM user compromised), raised a ticket and had email correspondence with me. I felt that the action taken was very timely and secure.

I deleted the offending AWS IAM user credentials and that user was unsuspended. This took place within 5-10 minutes of my commit so the impact is not great. I was lucky that the offending IAM user permissions was limited, there was no Admin policy and I gave "*" permissions for SNS/SES services. The SES was in sandbox mode :P  

AWS even told me to check for suspicious activity for EC2 compute related resources in all regions.

## Learnings moving forward
- OK to check in templates - `envVars.template.ps1` with empty values but actual secrets should be managed in another local file eg. `envVars.local.ps1` and this needs to be added to .gitignore
- When doing refactoring, look at each change and commit regularly in smaller intervals
- Set strict and only necessary permissions for your IAM user. Try to avoid "*" on permissions and limit it to specific resource ARN in your account

I feel lucky that nothing went too wrong. Whew... Everybody makes mistakes.