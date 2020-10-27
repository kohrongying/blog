---
title: My First Bash Script
date: 2020-10-23
tags:
- linux
- bash
---

Recently, I took up the linuxupskillchallenge hosted by lovely folks, on reddit.<!-- excerpt --> Having the need to access servers and run commands, I had only the bare minimum knowledge (think `ssh root@ip` and `cat hello.txt`). 

## linuxupskillchallenge
It was a very beginner friendly [course.](https://www.reddit.com/r/linuxupskillchallenge/) It covers topics from creating your server, to accessing it (SSH), to navigating it, running commands on it (search / create / change permissions) to more complex ones like networking and scripting.

After the challenge, I coincidentally came across this very [beautiful interactive exhibition](http://species-in-pieces.com). 

{% asset_img 'bash_animal.png' 'animal' %}

It documents endangered animals and engages the visitor through the use of interactive elements on the site. I found the images really cute and wanted to use them as my Desktop wallpaper.

However, there were 30 separate images to download, and it took 4 clicks for each download. (cue groans) I noticed how the image download link was consistent so I decided to put my newly minted linux skills to the test!

## The Script (not the band :p)
1. Create the script.
```bash
vi download.sh
```

2. Define an array and loop through the array. (I had to google how to write a for loop in bash) and download the image using curl, output to a predefined name in the folder.

```bash
#!/bin/bash

animals=(frog owl iguana seahorse armadillo sloth kakapo echidna penguin damselfly bear parrotfish camel butterfly ostrich panda tapir sifaka lynx rhino peccary okapi loris hirola drill)

for i in "${animals[@]}";
  do echo "$i.png"
  curl "http://species-in-pieces.com/img/assets/wallpapers/1366x768/1366x768_$i.png" -o "$i.png"
done
```

3. Make the script executable by changing its permissions. I learnt that there are many ways to do so. I remember being so confused with the octal mode but I finally got it (lol). We can even run `ls -l` before and after to check how the permissions change.
```bash
chmod u+x download.sh
chmod u=x download.sh
chmod 755 download.sh
```

The Binary map
```bash
Binary	Becomes
--- 000	0
--x 001	1
-w- 010	2
-wx 011	3
r-- 100	4
r-x 101	5
rw- 110	6
rwx 111	7
```
You know when cartoon characters have that aha lightbulb moment? I had mine when I finally understood what `chmod 400 ~/.ssh/rsa` does whenever ssh complains my [permissions are too open](https://stackoverflow.com/questions/9270734/ssh-permissions-are-too-open-error). (Hint: 400 - user read only)

## Thoughts
curl and wget are really your best friends for anything web related on linux. They are so fundamental, extensible and hence crucial.

I also think the course was helpful in reinforcing knowledge of essential commands
- Search (find / locate / which / grep)
- Navigation (ls / cd / history)
- Install (apt install / packaging - tar / make)
- System Management (cron, permissions, log)
- Network (nslookup / host / ports - netstat)

(Ok I realise as I write this that it just keep getting larger lol. So I shall stop.)

I also think that bash scripting is a really good way to run things consistently. I used to write long READMEs on how to deploy this or migrate that. It was best that such commands be in the form of a bash script to enforce consistently and prevent error.


## A LOL moment
I used to naiively put spaces in between the variable and its assignment, cos I'd thought it looked nicer.

```bash
some_var=a
some_var = a
```

Nothing worked after that 😂. I couldn't understand what difference a `<space>` made. I guess this is probably due to me coming from a developer perspective rather than a sysadmin. 

Bash is another language I hope I can learn and conquer one day!
