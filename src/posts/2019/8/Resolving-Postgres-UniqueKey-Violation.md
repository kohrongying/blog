---
title: Resolving Postgres UniqueKey Violation
date: 2019-08-29 17:55:16
tags:
- rails
- sql
---

I encountered a weird postgres error in my rails application yesterday.<!-- excerpt --> It was a `PG: Unique Violation` Error on my pkey which basically means the database is unable to create a new record in that table because there is already a record with that id (the primary key). I found that quite puzzling because primary key was always incremented in postgres side. 

## The How
After some googling and memory recollection, I remembered I had imported data into the table which probably led to some discrepancies in the primary key.

So assuming I have a bubble tea database with a sales table. Originally, pkey of sales is 1. I imported a csv[1] of past sales into the table (with 100 records). pkey should be at 101 now. But pkey remains at 1 because postgres doesnt increment the id.

The fix is simple, I just had to set the value of the pkey to the last index + 1 

## The Solution
```
$ psql

# Connect to your database
$ \c bbt_development

# See details about sales table
$ \d sales

# Get last record's id (or the pkey)
$ SELECT MAX(id) FROM sales;

# See what is the next value in the sequence
# If this value+1 != MAX(id), there is a mismatch!
$ SELECT nextval('sales_id_seq');

# Solution
$ SELECT setval('sales_id_seq', 1422);

# Or, programmatically, 
$ SELECT setval('sales_id_seq',
 (SELECT MAX(id) FROM sales)+1);
```

## In Hindsight
I should have changed the next value in the pkey sequence after importing the data. Lesson learnt!

-- 

###### Foonotes
###### [1] Importing CSV into Postgres
With Header
COPY sales FROM '/path/to/export.csv' DELIMITER ',' CSV HEADER;

Without Header
COPY sales FROM '/path/to/export.csv' DELIMITER ',' CSV;

