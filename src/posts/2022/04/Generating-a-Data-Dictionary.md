---
title: "Generating a Data Dictionary"
date: "2022-04-03"
tags:
- bash
- pdfmake
- flyway
---

Data dictionaries are particulary important in understand the database schema of an application. How do developers create and update this data dictionary? I created a very very simplified automated tool to generate a dd using flyway scripts.
<!-- excerpt -->

## tldr;
Skip to [Rong Ying's dd generator](https://github.com/kohrongying/data-dictionary-generator) to check out my repo

## The motivation
I challenged myself to come up with solutions before I tried to scour the net for a readily available tool. To me, there are two solutions:
1. Create and update the dd manually 
2. Automate it

Probably it seems like a redflag as a developer if we're not automating 100% of what we do. Hear me out, even though manual seems like a very troublesome way to do things, but I cannot simply rule it out as it does have its merits.

Obviously automation is the defacto solution especially when I have multiple databases with many tables and each table has many columns. However, I need to acknowledge that it cannot be 100% automated, depending on the level of customization of your dd as well.

## What a data dictionary consists of
Information about the database:
- Schema
- Table name, description
- Column name, type, nullable, description
- Primary key, Foreign key, indexes


## Solutioning
- Output: a pdf copy of the data dictionary of my database.
- Application: a Java Spring Boot application, utilising Flyway for DB migrations
- Database: a Postgresql database

With what I have on hand, I decided that my input be the flyway migration scripts to determine the Postgres schema. 

[Flyway](https://flywaydb.org/documentation/) is a tool to manage database changes, by writing sql scripts to manipulate (create/update) the database. It serves as a changelog to what changes are made to the database. 

In my case, I'm not concerned about the changes but the final state of the database, after running all the migration scripts.

### Flow
{% asset_img 'dd-flyway.jpg' 'solutionarchitect' %}

1. Run the Flyway migration scripts
2. Get a snapshot of the postgresql database after migration complete
3. Output that snapshot into a pretty pdf table

### Dockerizing the flyway
I utilised docker-compose to run the flyway container and a postgres container. 
This is what the `docker-compose.yml` file looks like
```yml
version: '3'
services:
  flyway:
    image: flyway/flyway:7.1.1
    command: -url=jdbc:postgresql://db:5432/postgres -user=postgres -password=P@ssw0rd -connectRetries=60 migrate
    volumes:
      - "${MIGRATION_ABS_PATH}:/flyway/sql"
    depends_on:
      - db

  db:
    image: postgres
    environment:
      - POSTGRES_PASSWORD=P@ssw0rd
      - POSTGRES_USER=postgres
      - PGDATA=/data/postgres
    volumes:
      - ./scripts:/tmp
    ports:
      - 5432:5432
```

### Bash scripts
I used bash scripts to run basic sql commands on the postgres container to get basic information:
1. Get schemas and table names
2. Get columns and their information
This was done through psql commands. No magic here.

```sql
# Getting Tables from public schema
SELECT 
    TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA='public';

# Getting Columns
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE,
    TABLE_SCHEMA,
    TABLE_CATALOG,
    CHARACTER_MAXIMUM_LENGTH 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA='public' AND TABLE_NAME='$TABLE_NAME';

```

After some bash script manipulation, and I saved each table as a temporary json output.

### pdfmake
I chose pdfmake, a Node package, to generate the pdf as I like its declarative nature. It is also highly starred on github and has many active users and support.

Tada, with that I created a 42 paged pdf of a very simple data dictionary.

### Caveats
My very primitive solution currently is only able to cover table name, column name, type, nullable. Keys and indexes seem doable and is part of the feature list.

## Final thoughts
It was a really quick exercise and validated some of my ways of thinking. Be that as it may, I know that it is not a perfect solution.
For example, the psql statements could be lacking or insufficient to make a complete analysis, some manual intervention for documentation is always required.
My bash scripting can be further improved, it is way too hacky. Still, it was a fun brain exercise for me! *cracks fingers*

## Resources
[Rong Ying's dd generator](https://github.com/kohrongying/data-dictionary-generator)


