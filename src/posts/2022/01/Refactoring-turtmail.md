---
title: "Refactoring turtmail"
date: "2022-01-30"
tags:
- python
- refactor
---

Recently bought Uncle Rob's Clean Code and instinctively went to relook at my old python code that I've been using but not maintaining.<!-- excerpt -->

## What is Turtmail
It is a python program I wrote that takes in a very specific excel document that contains payslips, parses it, exports each payslip as pdf and then sends an email to the recipient with the payslip as an attachment. 

I wrote this in 2019 and run the python program monthly. However, it is not maintained. At all. 

So, I took the opportunity to hone my refactoring skills. 

Tldr; I managed to clean the code through re-writing the classes, domain modelling and including test cases. The details in the [PR](https://github.com/kohrongying/turtmail/pull/1/files).

## Why the old code was so bad
All of the code was encompassed within two files:
```
|- main.py
|- ses.py
```
As you can tell, the ses file holds the logic for the boto python library that calls AWS SES for email sending, and the rest of the parsing, exporting is done in main.

We can summarize why that is sooooo bad:
1. Everything in one single huge function - violating Single Responsiblity Principle
2. No Test Cases - hard to refactor
3. Not clear to maintainers what objects or models and what the business value is 

## The Refactoring
### 1. Domain Modelling
Model the problem statement to understand the models and objects. This helps with overall understanding of what are the important objects that the code handles.


Here are some changes I implemented:
```
- src 
    |- services
        |- excel_service
        |- email_service
```

Created services like excel and email to handle the third party libraries like boto3 or pywin which is a python wrapper on the windows system. 

```
- src 
    |- models
        |- payslip_date
        |- payslip_recipient
```
Created models like date and recipient are dataclasses, to represent some of the business ideas and values.

```
- src 
    |- payslip_mailer
    |- payslip_wb_service
    |- payslip_ws_service
```
Created the workbook service and worksheet service handles most of the payslip parsing, chopping and exporting, while the mailer is the model that contains the logic for tying the payslip with the mail service.

### 2. Refactoring Code smells
After modelling, it was important to look at the old code and refactor them into functions that could be tested easily. The _Clean Code_ book also emphasized strongly on having **small functions** and **readable function names** that also served as documentation. 

While refactoring I had several of these thoughts:
- How can I make this code smaller
- What is the key function of this method
- If this method serves two functions, can I extract these lines out
- How and under what circumstance will this code change
- Will other people understand what this function does by its name
- How can I name it to remove any ambiguity 

Another important thing to note during refactoring is that it is not a one day job. Actual valuable refactoring comes only after 2-3 rounds of looking at the code and making changes, because it is often so hard to get it right on the first go. 

I looked at my old code and just kept sighing to myself, trying to understand what I was trying to do.

With that said, the next point is really crucial.


### 3. Test cases
Refactoring is almost virtually not possible without automated tests. The benefits are simple:
- We can go fast
- Rollback changes and make edits over our edits without worrying about breaking anything
- Gives us level of confidence to merge our refactor

## Conclusion
The book really inspired me to relook into some fundamentals of writing code and re-evaluate my own skills and thought process.  It was a great exercise and also valuable since I was using this program on a monthly basis.

If interested, you can check out the [PR](https://github.com/kohrongying/turtmail/pull/1/files) for the before and after changes. 