
# homepage
    https://github.com/stopsopa/monorepo    

# Installation

Run in project main directory

```bash

npx gitmonorepo

```

# Mounting/unmounting git hooks

```bash

/bin/bash .git/monorepo/hooks.sh 
/bin/bash .git/monorepo/hooks.sh --off

# bring previous hooks, existing in .git dir, before npx install...
/bin/bash .git/monorepo/hooks.sh --revert 

```

... by default after installing this lib through npx hooks will be automatically mounted

# Using from parent repository

Execute merge script

```bash
/bin/bash .git/monorepo/merge-generator.sh
```

# Add to parent repository Makefile

```makefile

roderic-merge:
	/bin/bash .git/monorepo/merge-generator.sh                           

```

# Adding single branch from existing remote

add remote

```bash
git remote add gca git@bitbucket.org:project/repository.git
```

checkout remote to local branch
```bash
git checkout -b repo_name remotes/repo_name/master
```

If there is no master branch on remote (new repository) then

```bash
git push repo_name master
```

# fixing pushing wrong tags

```bash

git ls-remote --tags --refs origin | cut -d '/' -f3 > tag.sh 

cat tag.sh | while read line; do echo "git push origin --delete  $line"; done > tag2.sh


```

# some weird problems with pushing with --follow-tags

https://stackoverflow.com/a/56546026
https://git-scm.com/docs/git-push#Documentation/git-push.txt---follow-tags

# suggestion

I strongly suggest saving files:

```bash
#!/bin/bash
GITSTORAGESOURCE="git@github.com:xxx/repository.git"
GITSTORAGELIST=(
    '.git/config::xxx/.git_config'
    '.git/config.yml::xxx/.git_config.yml'
    'gitstorage-config.sh::xxx/gitstorage-config.sh'
)

```

with repositiry https://github.com/stopsopa/gitstorage

# dev

To recreate testing repository run:

see *make dev-prepare* command

# todo

- [x] handle merge-with-diff in react
- [x] handle merge conflict during pull
- [ ] npx installator 
