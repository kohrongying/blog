---
title: "Refactoring Turtmail Part 2"
date: "2022-12-31"
published: false
---

Refactoring is not just a way of life, it is __the__ way of life.

## Part 1
Read Part 1 [here](https://blog.rongying.co/posts/2022/01/refactoring-turtmail/)

## tldr;
1. Added GUI using Gooey to facilitate interaction 
2. Operated it as a Windows Script

## Gooey
[Gooey](https://github.com/chriskiehl/Gooey) is a python library that turns your command line program into a full GUI application.

For example:
```python
python main.py xxx.xlxs --send-email yes
```

After Gooey-fying it:
<insert IMG>

## Organise
Initially I wanted to package my application into a python wheel (executable).
Move all services/classes into a python module (remove any src folder). Leave tests outside of that module.

## Keep code clean
My choice of libraries to use to keep the code well formatted and coherent.

- Linting - Ruff
- Formatting - Black
- Test - Pytest and pytest-mocker

