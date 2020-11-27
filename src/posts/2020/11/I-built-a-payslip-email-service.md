---
title: I built a payslip email service
date: 2020-11-27
tags:
- aws
---

I came up with a a email service to solve a requirement of sending out payslips every month.<!-- excerpt --> Previously, they were printing out payslips and handing them out in hard copy (why? I have no idea. I was so shocked to hear this.)

## Early beginnings
Because the company has been using excel to format their payslips since the beginning of time, I decided it would be best to not change their workflow too much as the first step of digitalization. I don't want to introduce cloud to soon and digitalize their whole process and create the illusion that digitalization = more work.

This service has various components to it
1. Python code to read excel files and generate pdf from it
2. Terraform code to build email service


## Generating PDF

So with the constraint of working with excel sheets, I decided to use python due to the very helpful pywin32 library. I was developing on a Mac and wondering why I was stuck at the pip install pywin32 step.. 

### Lesson 1
Some libraries depend on your OS.

I guess I can only blame myself for not reading the README for [pywin32](https://pypi.org/project/pywin32/) - it literally says `Python extensions for Microsoft Windows Provides access to much of the Win32 API, the ability to create and use COM objects, and the Pythonwin environment.`

Ok this one is on me.

Luckily, I had my old Windows laptop from my uni days. I needed to have both the right OS as well as the application software installed (Excel in my case).

### Lesson 2
Finding the correct documentation is important. 

At first, I was googling pywin for how to manipulate an excel document. That is wrong, all pywin does is expose you to the Win32 API and allow you to use COM Object. The one I'm interested in is the Excel Application. What I should have been looking at was the Microsoft Office VBA API.

Some of the documentaion that was useful for my use case was the [Worksheet](https://docs.microsoft.com/en-us/office/vba/api/excel.worksheet) object and [Range](https://docs.microsoft.com/en-us/office/vba/api/excel.range(object)) Object. I used alot of its methods and properties, like [Worksheet.SaveAs method](https://docs.microsoft.com/en-us/office/vba/api/excel.worksheet.saveas) and UsedRange.

So the lesson here, is to read documentation!!

## Infra set up
The tool of the year for 2020 has definitely be Terraform. I've been using a lot of it (and Terragrunt) at work. After learning it for 6 months, I can see the value of Infrastructure as Code!

{% asset_img 'ses-architecture.png' 'architecture' %}

Goals for SES service
1. Visibility on what emails are delivered
2. Notification for emails that failed to sent

Goal 1 was merely to collect SES logs. My workaround was to have SNS trigger a lambda function that would print the triggered action into cloudwatch log group. 

Tada! All I had to do was terraform plan and apply. And now I can happily monitor my logs in aws :D

## Aside
I was using Sendgrid as my email provider previously. Everything was working well until go-live in which we realised emails were not sent to users of hotmail, outlook email addresses.

After some searching, it was said that Microsoft email providers have blocked sendgrid's mail server (for free tier), the problem will disappear magically once you subscribe to their paid service. Wow!

Another lesson to learn is the importance of QA. To test against different email addresses, different browsers, different configurations. I've been testing with one email address only - no wonder it was doomed to fail. 

I chose to pivot to AWS anyway and I think it was a great decision. Firstly, cost-savings - $0.10 per 1k emails and also second, the ability for me to customize the config set and integrate with notification services.

Ok thanks for reading till here! :)

## Source code
Check out my [souce code](https://github.com/kohrongying/turtmail) on github. It is called `turtmail` because I'm a turt fan!