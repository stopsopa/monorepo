
# heroku <%= JSON.stringify(data) %> vvvv

# git checkout -b usertracker remotes/usertracker/master
# usertracker

/bin/bash "$DIR/bash/git/change-branch-to.sh" "<%= data.localbranch %>"

/bin/bash "$DIR/bash/git/merge.sh" master

/bin/bash "$DIR/bash/helpers/headtail.sh" 55 10 /bin/bash bash/git/pull-and-push-branch.sh "<%= data.remote %>" "<%= data.localbranch %>" "<%= data.remotebranch %>" --nopush

# heroku <%= JSON.stringify(data) %> ^^^^

