---
title: "Refactoring Turtmail Part 2"
date: "2022-12-31"
tags:
- refactor
---

Refactoring is not just a way of life, it is __the__ way of life.

## tldr;
1. Added GUI using Gooey to facilitate user interaction 
2. Operated it as a Windows Batch Script

Read Part 1 [here](https://blog.rongying.co/posts/2022/01/refactoring-turtmail/)

## Gooey
[Gooey](https://github.com/chriskiehl/Gooey) is a python library that turns your command line program into a full GUI application.

For example:
```python
python main.py xxx.xlxs --send-email yes
```

After Gooey-fying it:
{% asset_img 'turtmail-gooey-1.PNG' 'gooey1' %}
{% asset_img 'turtmail-gooey-2.PNG' 'gooey2' %}

User without technical know-how of what a command line will be able to interact with it now. Click browse to select file(s) from the file system, radio buttons for single choice questions, or free text fields. I was really mind-blown by this!

## Windows Batch File
The Windows Batch file was the user's entry point into the system.

1. Create a batch file (payslips.bat)
```sh
// payslips.bat
"C:\Users\xxx\venv\Scripts\python.exe" "path/to/payslips-mailer-runner.py"
```
*TIP*: Use `where python` to get the path of python executable

```
2. Create entry-point for python 
```python
# payslips-mailer-runner.py
#!/usr/bin/env python
# -*- coding: utf-8 -*-

from payslip_mailer.payslip_mailer import main
import sys

if __name__ == '__main__':
    sys.exit(main())
```

3. Double click on the bat file, it'll run the script and open up the Gooey interface


## Organise
Initially I wanted to package my application into a python wheel (executable), so I followed some best practices for that, including:

1. Moving all services/classes into a python module (remove the src folder).
2. Leave tests outside of that module
3. Use setup-tools package to 

## Keep code clean
My choice of libraries to use to keep the code well formatted and coherent.

- Linting - Ruff
- Formatting - Black
- Test - Pytest and pytest-mocker

## Conclusion
1. Always good to have formatting and linting in place. 
2. Add more test coverage
3. Refactoring more and frequently