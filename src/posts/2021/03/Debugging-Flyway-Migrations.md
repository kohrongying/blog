---
title: "Debugging Flyway Migrations"
date: "2021-03-24"
tags:
- sql
- docker
---

The lessons I learnt in debugging. 
<!-- excerpt -->

## Story begins with a task
I had a task one day. It was to update a table column given a lookup table of old values to new values. 

I decided to use the `UPDATE FROM` statement from the [postgres documentation](https://www.postgresql.org/docs/8.2/sql-values.html).

```sql
UPDATE beans SET abbrev = v.new
FROM (VALUES('ABC', 'AB'), ('XYZ', 'XY')) AS v (old, new)
WHERE beans.abbrev = v.old;
```
I validated it locally:
- I ran it in my psql test database. It works well against simple test cases.
- I ran the java application that is using flyway. The migration with the new psql statement ran successfully. There was no issue.

However when pushing it to the CI/CD pipeline, the migration failed with a Flyway Syntax Error.

```sql
--- ERROR ---
UPDATE BEANS SET ABBREV = V.NEW
FROM[*] (VALUES('ABC', 'AB'), ('XYZ', 'XY')) AS V(OLD, NEW)
WHERE BEANS.ABBREV = V.OLD;
```

## Debugging #1: Pinpoint offending line

Similar to debugging applications, where we can print out the stack trace of the error and pinpoint which exact line threw the error, I did the same here.

So the first thing to know is:
-  [*] is an indicator to tell you where the error occured. What a simple, underlooked feature. (There were moments where I doubted the spelling of FROM, ngl).


## Debugging #2: Replicate error
So, armed with the knowledge of the `FROM` that was causing the syntax error, I tried to replicate this locally, so it is easier for me to debug. 

First thing I did was to go back and re-run this statement on my psql test database. It did not fail. Ok, I expected that since I already tested it before I committed.

Second thing, I wanted to check my syntax (double double confirm since I kiasu). I downloaded [pgsanity](https://github.com/markdrago/pgsanity) which was a cool CLI tool to check for psql errors. There were no errors.

```bash
$ pgsanity migration.sql
$ echo $?
0
```

Okay... So as of now, what it proves was that, my psql statement was correct. If the problem is not in the psql, the problem could be flyway, or the engine it is using to run these statements.

## Debugging #3: Deep dive into the tool
Next, I went to read up on flyway. I noticed they have a command line as well as API and Maven/Gradle implementation. Interestingly, as I was about to hit a login-to-download wall at their [downloads page](https://flywaydb.org/documentation/usage/commandline/), I saw that they have docker images!

The docker images could be used to test migrations. What a useful and highly appropriate usecase for me!
```bash
docker pull flyway/flyway

docker run --rm -v /path/to/migration/:/flyway/sql \
flyway/flyway \
-url=jdbc:h2:mem:test \
-user=sa migrate 
```

```sql
--- ERROR ---
UPDATE BEANS SET ABBREV = V.NEW
FROM[*] (VALUES('ABC', 'AB'), ('XYZ', 'XY')) AS V(OLD, NEW)
WHERE BEANS.ABBREV = V.OLD;
```

And finally! I managed to replicate the error locally!

## Debugging #4: Understanding why
The error returned from running the migrations in the flyway docker image using a H2 database was the same as that on my CI. It was the hint of a different database that led me to the realisation that this statement was psql-syntatically correct. But was it sql-compliant? 

And indeed, the problem was the `UPDATE XX FROM XX` syntax is not sql compliant!

Having this AHA moment, implementing a sql-compliant statement as the solution became the clear-cut goal.

```sql
UPDATE BEANS SET ABBREV = COALESCE((SELECT A.NAME 
  FROM (VALUES('ABC', 'AB'), ('XYZ', 'XY')) AS V(OLD, NEW) 
  WHERE BEANS.ABBREV = V.OLD)), ABBREV);
```

I tested this with flyway docker, with psql database, and running it locally. Everything works! I push to my CI and this time, the build turned green.

Yay! 

## Lessons Learnt
I _could_ and _should_ have known that the `UPDATE FROM` syntax belongs to PSQL and not entirely supported by other SQL engines **before** I chose to use it.

But, it was not an uncommon mistake. In hindsight, I'm happy it happened the way it did as it gave me the chance to learn and debug firsthand. Finding out about flyway images in the process is also definitely a bonus. I can see myself using that tool to validate my future sql statements.

I think that being able to replicate the issue locally on your own is _the_ most important step. It plays a part in helping you understand how the error came about and even provide hints on why it happened.

## On making mistakes

So, duh, making mistakes is okay. As long as you gained a takeaway from it. (Like writing a blog post haha.)

Understanding the why something happened is important. Critical to finding an appropriate solution and also, critical to contributing to your understanding of how this tech works.

Do you ever feel that when you think you know something about a certain tool or program, something happens that make you question if you really know it as well as you do? 

Sometimes when I code, it just seems all like a blackbox to me. But slowly, with time, this black box becomes grayer and I can start to peel back some layers. It is a slow, painful process, but that is the same for all work across all industries. 

I want to shout at myself to EMBRACE THE PROCESS but yeah, it makes me feel like a sadist haha. 

It is most definitely an uphill battle but what other option is there but to continue climbing up?
