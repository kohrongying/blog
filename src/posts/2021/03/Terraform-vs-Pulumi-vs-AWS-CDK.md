---
title: "Terraform vs Pulumi vs AWS CDK"
date: "2021-03-09"
tags:
- iac
---

IaC is a powerful tool. The blog post no one asked for.

<!-- excerpt -->

## 3 different IaC
I recently got to know Pulumi and AWS CDK from Thoughtwork's TechRadar. 

I've been using Terraform and Terragrunt extensively at work, and I was having a good experience with it. 

Thus, I set out to find out about different IaC tools and getting to know their pros and cons.


## tldr
|                              | Terraform                                 | Pulumi                                    | AWS CDK           |
|------------------------------|-------------------------------------------|-------------------------------------------|-------------------|
| Cloud Providers              | Supports major cloud providers and others | Supports major cloud providers and others | Supports only AWS |
| Release Year                 | 2014                                      | 2019                                      | 2019              |
| Github Stars (9Mar2021) | >25k                                      | 7.9k                                      | 6.4k              |
| Backend                      | S3                                                                      | Pulumi Cloud or self managed                                            | Cloudformation                                                      |
| CLI commands                 | ``` terraform init / plan / apply / destroy ``` | ``` pulumi new / up / destroy ``` | ``` cdk init / bootstrap / ls / synth / diff / deploy ``` |
| Language     | HashiCorp Configuration Language  (HCL)                                 | python / go / node /...                                                      | python / go / node /...                                                  |

I saved my results in my Github Repo - [battle of the IaC.](https://github.com/kohrongying/battle-of-the-iac)


## The Project Architecture
I came up with was a simple serverless architecture on AWS: 
- Lambda function to serve as webhook
- API Gateway integration

## The Verdict
For simple straightforward apps on _AWS_:
> AWS CDK

For complex and custom apps:
> Terraform


Let me go in depth about what I like and dislike into each of the tools:

## Terraform
### Pros
- Declarative IaC
- Level of customization is high
- Modules can save your time
- Variables: being able to share these variables across different files in the same folder without having to import them
- [IAM policy document](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document): I really like this so much of terraform. IAM statements in JSON are good, but the data statement is _AMAZING_.
```hcl
data "aws_iam_policy_document" "resource_policies" {
  statement {
    sid = "AllowAll"

    actions = ["execute-api:Invoke"]

    principals {
      identifiers = ["*"]
      type = "*"
    }

    resources = ["*"]
  }
}

```


### Cons
- Need to learn new language syntax (HCL)
- Unable to get historical applys unless there is a pipeline
- Integration with pipeline: less clear
- Most time consuming & most number of moving parts: have to declare everything (from integration request to lambda permission to lambda iam role). This requires certain level of cloud provider knowledge.

## Pulumi
### Pros
- Similar to Terraform (lifecycle changes -> resourceOpts). Built upon terraform providers.
- Code in your preferred language: python, go, node
- Integrates well with CI / CD
- Secrets mangement
- Pulumi Cloud: able to view historical changes

{% asset_img 'pulumi.png' 'pulumi console' %}

### Cons
- Initial setup: need to create account and login
- Time consuming: have to declare everything (from integration request to lambda permission to lambda iam role)
- Hard to use variables. I was searching for a way to declare global variables. I ended up creating a variables file (akin to a constants file) and have to import from there
- Documentation is lacking

### Pitfalls
I faced two pitfalls, during the development, thus making it the IAC tool that made me spend the most time on.

### Import paths
I had difficulty importing some objects like
- `ResourceOptions`
- `RestApiEndpointConfigurationArgs`

After much googling and reading into source codes of both `pulumi` and `pulumi-aws`, I finally found out that:
- `pulumi.ResourceOptions`
- `pulumi_aws.apigateway.RestApiEndpointConfigurationArgs`

### Invalid ARN

```python
# __main__.py
lambda_permission = lambda_.Permission(
  ...
  source_arn=f'{rest_api.execution_arn}/*/*/*',
)
```
This particular line invoked an invalid arn error:
```
error: aws:lambda/permission:Permission resource
'apigateway_invoke_lambda_permission' has a problem: 
"source_arn" (<pulumi.output.Output object at 0x1136f43d0>/*/*/*)
is an invalid ARN: arn: invalid prefix
```

This was mainly because of the output. The fix was to use the built in `apply` method. From their [documentation](https://www.pulumi.com/docs/intro/concepts/inputs-outputs/#apply):
> To access the raw value of an output and transform that value into a new value, use apply. This method accepts a callback that will be invoked with the raw value, once that value is available.

```python
# __main__.py
lambda_permission = lambda_.Permission(
  "apigateway_invoke_lambda_permission",
  action="lambda:InvokeFunction",
  principal="apigateway.amazonaws.com",
  source_arn=rest_api.execution_arn.apply(
    lambda execution_arn: execution_arn + "/*/*/*"
  ),
  function=lambda_fn.arn
)
```

Could this have been solved with some lifecycle changes? I'm not sure but it was not obvious from the get-go.

## AWS CDK
### Pros
- Code in your preferred language: python, go, node
- Cloudformation Stack: able to view historical changes
- Security-related: shows you IAM policy and statement changes which serves as a checks and balance
- Constructs can be very powerful and elegant (similar to Terraform modules)

Just by adding one line
```python
api = apigateway.LambdaRestApi(self, 
  f"{SERVICE_NAME}-api",
  handler=lambda_fn
)
```
It provisioned 10 resources needed - from the api gateway rest api, methods, integrations, stage (default to prod), deployment to lambda permission. I set it up through Terraform the hard way so this was a breeze to set up.

### Cons
- Only for AWS
- Personally, dont like my resource namings to contain so many random suffixes and hashes (completely personal opinion)
- Initial project structure was confusing
```
app.py
cdk.json
setup.py
service
  |- service_stack.py
service.out
```

- Constructs being too powerful. 

Akin to Terraform modules or a one click set up, what would have taken 1-2 hours of Terraform declaration could be done with one or two lines, with the help of certain Constructs. The time savings allow you to spend more time developing the actual application.

However a downside with this is that, you don't get direct visibility to the Construct. You have to look into the source code of the Construct if you want to tweak something or come up with a custom solution.

Furthermore, for a aws newbie, I wouldn't recommend this path as it is too short of a short-cut. Without learning about lambda permissions, api resource policy, lambda iam roles, it is hard to form an appreciation of the aws resources and come to understand how various AWS services are integrated with each other. It is easy to miss out things like having to grant apigw the lambda permission in order to invoke it, or creating an integratin request with a 200 status code for an api-gateway `MOCK` integration type.

For learning purposes, I think that using the basic building blocks like iam role, policy is _so_ _so_ _so_ important. The basic building blocks can present as a hurdle in front of beginners but once you slowly get over it, you will find yourself leaping through like a circus dog. (lol)

I recall (not so fondly) of the first time I touched AWS. I was getting frustrated to why I was unable to ssh into my ec2 server. I later found out that I had to open port 22 on the security group through adding an ingress rule.

Well, I guess that's what it means to learn new things. You face a big wall and you decide whether you want to continue climbing or search for other toys to play with.

## Summary

Eh, I kinda digressed at the back. But my digression helped me realise how much I like Terraform! 

Pulumi has a great cloud interface but I think the documentation needs to help lower the barriers of entry into choosing it. However the CI/CD part does seem like an edge over the rest.

AWS CDK construct library is big and ever-growing. I think I will use it for small quick personal projects to allow fast turn over.

Thanks for staying till here! Also, I tweeted about it: 
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">First blogpost of 2021: Blogged about 3 different IaC tools <br>Terraform vs Pulumi vs AWS CDK<a href="https://t.co/XLfUkLoN6W">https://t.co/XLfUkLoN6W</a> <a href="https://t.co/LxjJ6rCRw7">pic.twitter.com/LxjJ6rCRw7</a></p>&mdash; Rong Ying (@RongRunBuild) <a href="https://twitter.com/RongRunBuild/status/1369318748667084800?ref_src=twsrc%5Etfw">March 9, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## Resources
- [My Github Repo](https://github.com/kohrongying/battle-of-the-iac)
- [Terraform](https://learn.hashicorp.com/collections/terraform/aws-get-started)
- [Pulumi](https://www.pulumi.com/docs/get-started/aws/)
- [CDKWorkshop](https://cdkworkshop.com/30-python/20-create-project.html)

