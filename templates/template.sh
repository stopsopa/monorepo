
THISFILE=${BASH_SOURCE[0]}
DIR="$( cd "$( dirname "${THISFILE}" )" && pwd -P )"


function cleanup {

    set +e
    set -x

cat << EOF

Script crashed:

    Check what's happened and go back to master branch and execute again:

    /bin/bash .git/generated.sh

EOF
}
trap cleanup EXIT

set -e
set -x

<% for ( let i = 0 , l = data.list.length ; i < l ; i += 1 ) { %>

    <% if (data.list[i].type === 'template') { %>
        <%= data.list[i].template %>
    <% } %>

    <% if (data.list[i].type === 'merge') { %>

# merge <%= data.list[i].remotebranch %> to <%= data.list[i].localbranch %>

/bin/bash "$DIR/bash/git/change-branch-to.sh" "<%= data.list[i].localbranch %>"

/bin/bash "$DIR/bash/git/is-commited.sh"

<% if (data.list[i].nodiff) { %>
/bin/bash "$DIR/bash/git/merge.sh" "<%= data.list[i].remotebranch %>" merge-no-diff
<% } else { %>
/bin/bash "$DIR/bash/git/merge.sh" "<%= data.list[i].remotebranch %>"
<% } %>

    <% } %>

    <% if (data.list[i].type === 'pullpush') { %>

# pullpush local:<%= data.list[i].localbranch %> to <%= data.list[i].remote %>:<%= data.list[i].remotebranch %>

/bin/bash "$DIR/bash/git/change-branch-to.sh" "<%= data.list[i].localbranch %>"

/bin/bash "$DIR/bash/git/is-commited.sh"

/bin/bash "$DIR/bash/git/pull-and-push-branch.sh" "<%= data.list[i].remote %>" "<%= data.list[i].localbranch %>" "<%= data.list[i].remotebranch %>"

    <% } %>

<% } %>

# back to master
/bin/bash "$DIR/bash/git/change-branch-to.sh" master

trap - EXIT









