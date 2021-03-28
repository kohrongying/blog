---
title: metabase
date: 2019-04-18 10:20:38
tags:
- sql
---

Have been trying to add my Google Cloud PostgreSQL database to metabase..<!-- excerpt -->

### Installing Metabase
There are currently at least 2-3 different methods of installing mb. I downloaded the `.jar` file. 

Running it on my localhost, port 3000:
```
java -jar metabase.jar
```

The UI is so pretty! Create an account and log in!

## Adding database

I ran into many issues:
- Because my db instance was configured with SSL on, sslmode=verify-ca, I needed 3 `.pem` files to connect to the db
- As a result, I kept getting authentication errors

Some of my workarounds I had was, 
1. Try to add the filepaths of the `.pem` files as additional JDBC connection string options [x]
2. Attempted to add the `.pem` files as a keystore [It was too complicated for my simple tiny brain]
3. Cri

So in the end, I found [this site](https://discourse.metabase.com/t/how-to-connect-via-ssl-pem-files-to-mysql-google-cloud/2867/2) which thankfully pointed me in the right direction!

### Google SQL Proxy

So the idea is that the cloud SQL Proxy would provide secure access to your db instances without having to whitelist IP or configure SSL! 

Follow the instructions for [sql](https://cloud.google.com/sql/docs/mysql/sql-proxy) or [postgres](https://cloud.google.com/sql/docs/postgres/connect-admin-proxy).

After setting up, run in one terminal:
```
./cloud_sql_proxy -instances=<instance-name>=tcp:5432
```
Make sure you stop your own postgres server on your local machine (I'm using MacOS)
```
brew services stop postgres
```

Run in another terminal: 
```
java -jar metabase.jar
```

When you add database, use `localhost` for the hostname. Key in the username, password and all and the db will be added!!! 

### Metabase for Production

- Do the same thing on a separate VM
- Use a compute engine VM in the same project as the Google Cloud SQL instance 

Ok back to work. hehe.