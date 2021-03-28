---
title:  Circle CI Workflow with Ruby on Rails and Docker
date:   2019-01-14 12:09:02
tags: 
- docker
- CI/CD
- rails
---

## tldr;

- Dockerize RoR with Nginx
- Circle CI 
<!-- excerpt -->

## Dockerize Rails

The first step is to create your rails app using the Rails CLI: `rails new myapp`. 

Our way of dockerizing is simple - since our database will be on a managed instance on GCP, we will have our rails app as one container service and a reverse proxy (nginx) as our other container service.

```
# Dockerfile
FROM ruby:2.5.3
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
RUN apt-get update 
RUN apt-get install -y nodejs postgresql-client build-essential
COPY Gemfile /usr/src/app/
RUN bundle install
COPY . /usr/src/app
EXPOSE 3000
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
```

```
# Dockerfile-nginx
FROM nginx
RUN apt-get update -qq && apt-get -y install apache2-utils
ENV RAILS_ROOT /usr/src/app
WORKDIR $RAILS_ROOT
RUN mkdir log
COPY public public/
COPY config/nginx.conf /tmp/docker_example.nginx
RUN envsubst '$RAILS_ROOT' < /tmp/docker_example.nginx > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]
```
Add an [nginx file](https://codepany.com/blog/rails-5-and-docker-puma-nginx/#crayon-5c3c29a8a6e6f239458221) under `config/nginx.conf`.

We would build both files individually, but our CI will handle the building of the rails app for us. So, we just have to build the nginx service ourselves and once. 
```
docker build -t <repo>/rails-nginx -f Dockerfile-nginx .
docker push <repo>/rails-nginx
```

## Circle CI 
Yay new territory marked as we forage into this unknown land. What we envision our CI to do is:
1. On every git push, run tests
2. Build container image
3. Migrate Staging/Production DB
4. Deploy to Staging/Production environments

We would define one workflow, with four jobs, as the structure for our circle ci config file. 

{% asset_img 'dockerize-rails-1.png' 'workflow' %}

Each job is run in a Circle CI Build Environment - determined by the [executor](https://circleci.com/docs/2.0/configuration-reference/#docker--machine--macosexecutor) (docker/machine)
- `docker` allows you to choose the image you want
- `machine:true` is a classic set of images (mainly Ubuntu)
  - good for simple commands like building images like what we're going to do 
- `macos` mainly for building, testing appls for macOS, iOS and tvOS (wa so nice)

Won't be sharing the `config.yml` file here as its very long but just some important points to take note!

### Running Tests
- Use a docker image (ruby)
- `checkout` the repo
- bundle install 
- set up test environment 
  - Very important that you specify a `DATABASE_URL` field in either your config.yml or database.yml file 

### Building Image
- Use `machine: true` will do
- `checkout`
- Remember to `run docker login -u $DOCKER_USER -p $DOCKER_PASSWORD`if your repo is private.
  - Set your `$DOCKER_USER` and `$DOCKER_PASSWORD` as environment variables under Project Settings > Build Settings
- `docker build -t <repo>/<name> -f Dockerfile .`
- `docker push <repo>/<name>`

### Database Migration 
As our db instance is a managed instance on GCP, we can specify a `DATABASE_URL` to our job. The DB will take a format of: 
```
postgres://<user>:<password>@<host-ip>:5432/<db-name>
```

However since we want the password to be a secret, the trick is to save the entire database url as a project environment variable (Project Settings > Build Settings > Environment Variables). 

We have to cat it into the Bash env that the job is running in. 

```
- run: 
  name: define env variables at run time
  command: |
    echo 'export DATABASE_URL=$STAGING_DB_URL' >> $BASH_ENV
    source $BASH_ENV
- run: RAILS_ENV=staging bundle exec rake db:migrate
```

This seems to be the only way it will work, by forcefully overwriting the DATABASE_URL that the job will require in order to connect to the psql instance. We tried all forms of string interpolation but that didn't work either.

### Deploy to Staging or Production
There are two options to be considered: 

#### 1. Run as Containers
Initial Set Up
- Add db secrets to  `/root/.env`
- Pull Nginx and Rails app image
```
docker run -d --name app -e RAILS_ENV=staging --env-file=/root/.env <repo>/<name>
docker run -d -p 80:80 --name web --link app:app <repo>/rails-nginx
```

Update Image
- SSH into staging vm
- Pull latest image
- Stop and remove container
- Start container running new image
  - Remember to set `-e RAILS_ENV=staging|production` when running new image 

#### 2. Run as Docker Swarm
Initial Set Up
- Set up a docker swarm on a vm (see previous post)
  - docker-compose file has to include db secrets

Update Image
- Update service 
```
docker service update --force <svc-name>
```

## End of Post
It was a long and painful journey. Good things come to those who put themselves through bad times to get good things. (if that made any sense)


![Yay](https://media.giphy.com/media/3ohc1a0nE5CcRTLdeg/giphy.gif)
