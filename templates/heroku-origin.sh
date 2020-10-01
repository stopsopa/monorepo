


# heroku <%= JSON.stringify(data) %> vvvv

    # git checkout -b usertracker remotes/usertracker/master
    # usertracker

    /bin/bash "$DIR/bash/git/change-branch-to.sh" "<%= data.localbranch %>"

    /bin/bash "$DIR/bash/git/merge.sh" master

        yarn

# to avoid error
#remote: -----> Build failed
#remote:
#remote:  !     Outdated Yarn lockfile
#remote:
#remote:        Your application contains a Yarn lockfile (yarn.lock) which does not
#remote:        match the dependencies in package.json. This can happen if you use npm
#remote:        to install or update a dependency instead of Yarn.
#remote:
#remote:        Please run the following command in your application directory and check
#remote:        in the new yarn.lock file:
#remote:
#remote:        $ yarn install
#remote:        $ git add yarn.lock
#remote:        $ git commit -m "Updated Yarn lockfile"
#remote:        $ git push heroku master
#remote:
#remote:        https://kb.heroku.com/why-is-my-node-js-build-failing-because-of-an-outdated-yarn-lockfile
#remote:
#remote:  !     Push rejected, failed to compile Node.js app.
#remote:
#remote:  !     Push failed


        git status

        git add yarn.lock

        git commit --amend --no-edit



#        cp .env.heroku .env

            /bin/bash "$DIR/bash/gitwormhole/push.sh" "<%= data.wormhole %>"

#        rm -rf .env

        /bin/bash "$DIR/bash/git/pull-and-push-branch.sh" "<%= data.remote %>" "<%= data.localbranch %>" "<%= data.remotebranch %>" --nopush

        heroku domains

        printf "\n\n    or run:        heroku open\n\n";

# heroku <%= JSON.stringify(data) %> ^^^^






