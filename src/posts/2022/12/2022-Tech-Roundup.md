---
title: "My Tech Roundup for 2022"
date: "2022-12-30"
tags:
- tools
---

A simple 2022 roundup.
<!-- excerpt -->

## Software and Tools
### Productivity
1. Alfred Powerpack v5
    - __Clipboard History__ - Bring up your clipboard history (includes text and images!!) of up to 30 days. I essentially use it to as a database to store Frequently Accessed Items. It also drastically cuts down the amount of screen alternating, alt-tabs, and I generally feel like I can respond faster
    - __Custom Workflows__ - Create your own processes from inputs. I used the "jira <card number>" and "jira <board>" to open tickets and project boards instantly

### Python Libraries
- Testing - pytest & pytest-mocker
- Formatter - Black
- GUI - [Gooey](https://github.com/chriskiehl/Gooey)
- Linter - Ruff (it is fast! And though new, features are being developed quickly)

### IAC
- Terraform - still the de-facto for infrastruture provision.
- Terragrunt - a terraform wrapper that keeps configuration as DRY as possible

### Bash Commands
- awk
- history | grep "search term"

### Misc
- xbar - monitoring

## What I learnt
### Azure Infra
Terraform provider pages and Microsoft documentation are your best friends. AWS and Azure IaaS differs quite some bit. In AWS, you're given very barebone things - here's your VNET and subnets, oh if you want internet, you have to create and deploy your Internet gateways. In Azure, there's alot of helpful options to configure things (eg. add security rule to open RDP port automatically) and I come in realising that alot of ground work that was initially necessary was not anymore.

There are pros and cons to this. Pros is that - the Azure Portal can be quite easy to maneuveur once you are used to it, and it may bring the developer or administrator convenience. Cons - generally losing out in the fundamentals of building bricks. I remember googling for hours on why I am unable to ssh into my AWS EC2 instance and why I can't ping google on it. Having the underlying networking knowledge made me appreciate the Azure infrastructure more.

### Azure Databricks
A lot of 2022 was spent on learning Azure Databricks for work. Learning about the infra-security setup, data exfiltration, Databricks notebooks and jobs, and pouring over their API and airflow package.

We sat for workshops and I even got certified Associate Data Engineer! 

### Azure Purview
My first exposure of what a data catalogue is and what it entails. I know now that it displays metadata on table details, columns (names, data types), classifications, glossary terms to help increase data visibility within the technial and non-technical teams. Make it easily navigatable for non-technical users and thus encourage adoption of the data!

### Airflow
Learning about Airflow dags and scheduling. I also picked up alot of python coding and testing from working on Airflow code

