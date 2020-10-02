[![npm version](https://badge.fury.io/js/gitmonorepo.svg)](https://badge.fury.io/js/gitmonorepo)
# homepage
    https://github.com/stopsopa/monorepo    

# Installation

Run in project main directory

```bash

npx gitmonorepo

```

then:

```bash

cp .git/monorepo/config-dist.yml .git/config.yml
          
```

then configure file .git/config.yml

# Using from parent repository

Executing automerge script

```bash

/bin/bash .git/monorepo/merge-generator.sh

```

# Mounting/unmounting git hooks

```bash

/bin/bash .git/monorepo/hooks.sh 
/bin/bash .git/monorepo/hooks.sh --off

# bring previous hooks, existing in .git dir, before npx install...
/bin/bash .git/monorepo/hooks.sh --revert 

```

... by default after installing this lib through npx hooks will be automatically mounted

# Add to parent repository Makefile

```makefile

merge:
	/bin/bash .git/monorepo/merge-generator.sh                           

```

# Adding single branch from existing remote

add remote

```bash
git remote add gca git@bitbucket.org:project/repository.git
```

checkout remote to local branch
```bash
git checkout -b branch remotes/repo_name/master
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

with repository https://github.com/stopsopa/gitstorage

# dev

To recreate testing repository run:

see *make dev-prepare* command

# todo

- [x] handle merge-with-diff in react
- [x] handle merge conflict during pull
- [x] npx installator 
