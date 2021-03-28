---
title: exposing other attributes as JSON in Rails Models
date: 2019-05-08 23:30:05
tags:
- rails
---

A simple post on exposing other attributes when returning a json representation of a model instance.<!-- excerpt -->

Sometimes when querying information, we also want to display associations' information - instead of knowing only the foreign key id. 

### Disclaimer
Of course there could be other time saving or more efficient way of querying, like using Graph API or storing constant data in some other storage. 

### An example

Lets say our Ruby on Rails project has a model called `Book.rb` and `Author.rb`.

Author has many books and book belongs to an Author, hence book will have an `author_id` attribute, which most of the time is just a bigint.

For my case, I chose to expose the author name as part of the model.

```ruby
# Book.rb
belongs_to :author

def author_name
  Author.find(author_id).name
end

def as_json(options = {})
  json = super(options)
  json[:author_name] = author_name
  json
end
```

#### Override the as_json method
1. Initialise json hash with current model 
2. Add `author_name` key, and value to hash
3. Return final json hash

Tada! Simple :) 
