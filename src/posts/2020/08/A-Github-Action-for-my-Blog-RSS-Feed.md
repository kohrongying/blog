---
title: README-the-RSS
date: 2020-08-11
tags:
- Github Actions
---

Last week, I configured my profile README on github. I wanted to have an action to pull my latest blog posts. Of course there were many in the marketplace, but I still created my own Github Action!
<!-- excerpt --> My github action is called [readme-the-rss](https://github.com/marketplace/actions/readme-the-rss). 

## File Structure of the action
```yml
dist
  |- index.js 
action.yml
index.js
package.json
```
[Full version here](https://github.com/kohrongying/readme-the-rss)

### The configuration
The `action.yml` file is the configuration for the action itself. You have to include the name, inputs and outputs there, as well as extra stuff like branding icon and color. You also tell it what image to run on and what file to run.

### Building the index.js
We have two options when it comes to build files. We can use the main `index.js` file and all the `node_modules` or use a build tool like `@zeit/ncc`, run `ncc build index.js` and set `dist/index.js` in your `action.yml`. I chose the latter.


## The Workflow
1. Parse your blog's RSS feed
2. Convert the items into markdown format with `[title](link)`
3. Read the existing README file
4. Splice the content between the `<!--BLOGPOST:START-->` and `<!--BLOGPOST:END-->` tags then replace it with the markdown from (2)
5. Write new content to the README file
6. Git add and commit
7. Git push to repository

The parsing of RSS feed was easy as I used a **rss-parser** library. I used TDD (yay tdd) to test the markdown formatting as well as splicing.

My action stops at step 5 and I used other actions to help me complete step 6 and 7. 

## My mistakes and learnings
### Async and await
My first mistake was not wrapping the main function in a **async**, so it caused the action to not return the rss feed, as the promise was still pending.

Building on that, the reading and writing of files have to be awaited on too. The reading and writing of files was done with `fs.readFileSync` and `fs.writeFileSync`.

### Git add and commit
I initially wrote my own bash commands to run the commit process. 
```yml
- name: Commit file changes
  run: |
      git config --global user.name 'YOUR_USERNAME'
      git config --global user.email 'YOUR_GMAIL'
      git add .
      git commit -m "Update README"
```
However, I encountered build errors in the subsequent actions because **there were no changes to commit**. In the outcome where the readme file is not changed, the stage will be clean and the commit will result in an error.

The solution is simple but tricky to implement (I googled and saw how other actions did it). So instead of running `git commit`, let's do;
```yml
git diff --quiet --cached || git commit -m "Update README"
```

`git diff --quiet` implies an exit code which will return 0 if there are no changes and 1 if there are changes that are staged. 

* No changes: 0 || git commit --> **NO COMMIT**
* Changes: 1 || git commit --> **COMMIT**

It was pretty cool to me as I have not dealt with exit codes before.

## Concluding Thoughts
Yeah, so I did learn some things from this simple github action of mine! Next step is thinking how to integrate the commit and push into the actual action itself.