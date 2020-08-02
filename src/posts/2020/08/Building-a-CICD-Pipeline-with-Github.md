---
title: Deploy deno with Github Actions
date: 2020-08-02
tags:
- CI/CD
- deno
- Github Actions
---

I had an idea for a new project and wanted to try out deploying a Deno backend.<!-- excerpt -->

## The Architecture
![img](https://i.morioh.com/200520/c123d1ba.jpg)

The deno server will be run in a docker container that will be deployed on Digital Ocean servers. 

For **Continuous Integration and deployment**, Github Actions will define a workflow that will allow me to:
- build my image
- push to a docker registry
- remotely access my server to update the image

## My methodology

### Set up a barebones server
I set up a barebones API server with code I copied off the internet.

### Run it locally with docker
This means setting up a Dockerfile early and test running it locally. This allows debugging: be it the deno server itself or the dockerfile / docker commands.

```docker
FROM hayd/deno:latest
EXPOSE 8000
WORKDIR /app
ADD . /app
RUN deno cache server.ts
CMD ["run", "--allow-net", "server.ts"]
```

It is as simple as:
```
docker build . -t web
docker run -p 8000:8000 web:latest
```

### Use Terraform to set up the servers
Starting to appreciate Infrastructure-as-code! This allows us to create the digital ocean servers, with my SSH key and with an appriopriate server image (I chose one with docker preinstalled)

In order to pull the image to run in the server, we have to be logged into the github docker registry.

I used `user_data` in terraform to configure the server even more:
- Logging into the docker registry with your github token
- Adding the public key into `authorized_keys`. This key is the one where github actions will use to remote access

Here is a snippet of my terraform code:
```hcl
resource "digitalocean_droplet" "staging" {
  image  = "docker-18-04" // docker with ubuntu 18.04
  name   = "staging"
  region = "sgp1"
  size   = "s-1vcpu-1gb"
  ssh_keys = [var.ssh_key_id]
  user_data = <<-EOF
              #!/bin/bash
              echo ${var.public_key} >> ~/.ssh/authorized_keys
              docker login https://docker.pkg.github.com -u kohrongying -p ${var.github_token}
              EOF
}
```

### Creating the action
There are two main jobs:
1. **Push to registry**
- Checkout the repository
- Build the app using the `Dockerfile`
- Tag and push it

2. **Redeploy with updated image**
- Remote ssh into server
- Stop and delete the current container and image
- Pull latest image and restart it in background

I mainly used actions that were already predefined by the community and other actors. They are so useful! 


## Adding more Github Action Workflows
I was having fun with workflows that I decided to add more of them.

In the end I had 3 workflows:
1. **Staging workflow**
  - Triggered on push/PR to staging branch
  - Builds and push with version staging
  - Updates image in staging server with latest image tagged staging

2. **Production workflow**
  - Triggered on push/PR to master branch
  - Builds and push with version latest
  - Updates image in prod server with latest image

3. **Release workflow**
  - Triggered on new tag pushed or release published
  - Builds and push with version of the tag

## The code
You can check out the terraform code, the deno server and the workflows in this [branch](https://github.com/kohrongying/notes-backend/tree/template).

## Concluding Thoughts
In my previous job, I had the chance to set up a Rails deployment on CircleCI with images stored on DockerHub. Being able to have the CI in the same environment as the docker registry does seem more convenient as there's one less place to configure. I think it's fun to experiment with Github Actions and compare how different tools handle CI/CD.

Also, my next steps will probably be adding a test layer into my CI as well as integrating a database.