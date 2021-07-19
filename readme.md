## Git aliases
```git
[alias]
	s = !git status -s
	c = !git add . && git commit -m
	am = !git add . && git commit --am --no-edit
	l = !git log --pretty=format:'%C(blue)%h%C(red)%d %C(white)%s %C(cyan)[%cn] %C(green)%cr'
```