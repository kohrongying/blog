---
title:  Learning Docker [Part 2]
date:   2018-12-24 10:46:00
tags: 
- docker
- flask
---

## tldr;

Learning how to move your dockerized flask containers to a Digital Ocean Droplet.<!-- excerpt -->

Link to the dockerized flask app is [here](https://github.com/kohrongying/docker-flask)

## Aims

To deploy a container for a web application into the Internet, we need:

1) A docker host server to run the container (Host VM has to have docker installed)
2) A Docker Image (can be pulled from dockerhub or built from a Dockerfile)

We're going to host on Digital Ocean and create our host using `docker-machine`. 

## Deploying to Digital Ocean

### Generating DO Personal Access Token

Go to [here](https://cloud.digitalocean.com/account/api/tokens) to get yours now! [#notsponsored]

### docker-machine

Run below command to create a digital ocean droplet in your account with docker installation configured! Other configurations like adding ssh key fingerprints also exist. :)
```
docker-machine create --driver digitalocean 
--digitalocean-access-token <token> 
--digitalocean-region sgp1 
--digitalocean-size s-1vcpu-1gb 
docker-flask
```

### Configure your shell
```
$ eval $(docker-machine env docker-flask)
```
![Important!](https://media.giphy.com/media/555sbTLpqqwODaHIvc/giphy.gif)

This is the one key step (!!!) env returns a bunch of environment variables belonging to that docker-machine, evaluating it is akin to connecting to your remote machine (like you've ssh-ed in).

One method of understanding this command, is through the example of running a hello word instance

```
$ eval $(docker-machine env docker-flask)
$ docker run -d -p 8000:80 --name webserver kitematic/hello-world-nginx
```
Navigating to the `<droplet-ip>:8000` will show you a hello world instance, while `localhost:8000` will not be reached. This shows that you just ran that command in the host machine's terminal. It's magical! 

#### Unset Docker Variables

In order to return to your own machine, you have to:
```
$ eval "$(docker-machine env -u)"
```

### Run Docker commands on droplet
```

$ docker-machine ls

$ docker-machine ip docker-flask

178.128.116.60

$ docker-machine inspect docker-flask

$ docker-machine start docker-flask

$ docker-machine stop docker-flask
```

## Running Containers

So all that's left to do is to run the containers in the background! 

`docker-compose up -d`

Go to the live site and you should see it going strong! The initial load time is kinda slow. :/ 

## Tear Down
```
$ docker-machine kill docker-flask

$ docker-machine rm docker-flask
```
Remove will remove both the local and remote instance. Yay! No traces of evidence of tampering with our DO account ahaha (a few cents only I hope shhh)

![So easy?!](https://media.giphy.com/media/WJK2SABYwvEvm/giphy.gif)

Can't believed it worked! Yay, here we learnt how we moved all our containers to a hosted machine (hosted by DO) and all the commands were done through our own terminal and thanks to `docker-machine`. 


Docker Compose can deploy and scale containers running on a single machine, so what if we want to handle multi-container applications deployed across multiple droplets? 

## Docker Swarm

Docker Swarm is essentially like kubernetes, a container orchestration tool. But much simpler, and because we built our images with docker-compose, it is also much easier to use docker swarm to provision the multiple vms. 

### Push your images to registry

Go to [Docker Hub](), sign up for a new account and create a new repo. 

Remember to `docker login` with your credentials!

In order to push your image up, you have two ways of doing it. 

1. Build the image using the Dockerfile (Recommended)
```
$ docker build -t <username>/repo:latest .
```
2. Tag the image if it already exists

```
$ docker tag repo:latest <username>/repo
```

Last Step
```
$ docker push <username>/repo:latest 
```

### Create multiple droplets 

```
$ docker-machine create --driver digitalocean  
--digitalocean-access-token <token> 
--digitalocean-region sgp1 
--digitalocean-size s-1vcpu-1gb 
--digitalocean-ssh-key-fingerprint <fi:ng:er:pr:int> 
vm1

$ docker-machine create --driver digitalocean  
--digitalocean-access-token <token>
--digitalocean-region sgp1 
--digitalocean-size s-1vcpu-1gb 
--digitalocean-ssh-key-fingerprint <fi:ng:er:pr:int> 
vm2
```

### Docker Swarm Init
```
$ docker-machine ip vm1

$ docker-machine ssh vm1 "docker swarm init --advertise-addr <vm1-ip>"

$ docker-machine ssh vm2 "docker swarm join --token <token> <vm1-ip>:<port>"
```

### Deploying to the Swarm
```
$ eval $(docker-machine env vm1)

$ docker stack deploy --with-registry-auth -c docker-compose.yml myapp

$ docker stack ps myapp
```

And wala! Its all deployed to your cluster.

Some ways you can debug:
- `docker stack ls`
- `docker service ls`
- `docker stack rm myapp`
- `docker node|stack|service ps --no-trunc` 


### Scaling services

Another thing you can add to the `docker-compose.yml` file is the deploy attribute. 

```
deploy: 
  replicas: 5
  restart_policy:
    condition: on-failure 
```

Another method is through the docker cli.
```
$ docker service scale myapp_redis=2
```

Magically, you should see the Flask Dockerized on both VM IP addresses! Cool. Okay we had a hard time deploying it because the nginx image was not the correct one :( 

## End of Part 2

Here, we learnt `docker-machine` and `docker swarm`!

## Docker Services
```
$ docker services ls
$ docker service update --image <repo/name> <service name>
```