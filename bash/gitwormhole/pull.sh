
# run form main directory like:
#     /bin/bash bash/gitwormhole/run.sh pull
# pwd will point to root directory - NOT this 'bash/gitwormhole' directory


THISFILE=${BASH_SOURCE[0]}
DIR="$( cd "$( dirname "${THISFILE}" )" && pwd -P )"

source "$DIR/../libs/colours.sh"

if [ $# -lt 1 ] ; then

    { red "give git repository name to push latest scripts like:"; } 2>&3
    { red "\n    /bin/bash $0 git@github.com:user/name.git\n\n"; } 2>&3

    exit 1;
fi

#exit 0;

{ yellow "\ngitwormhole pull:\n"; } 2>&3

LIST=(
    "."
    ".gitignore"
);
#    ".git"
#    "react/servers"
#    "react/servers/index.js"
#    "public/dist"
#    "public/dist/admin.bundle.js"

for i in "${LIST[@]}"
do
    { green "testing read & write access: $i"; } 2>&3

    if [ ! -w "$i" ] || [ ! -r "$i" ]; then  # not exist (fnode, directory, socket, etc.)
        { red "'$i' is not writtable | readable"; } 2>&3
        exit 1
    fi
done

echo ""

set -e
set -x

# tmp git dir vvv
    TMPGITDIR="____tmpgitdir";

    if [ -e "$TMPGITDIR" ]; then

        rm -rf "$TMPGITDIR";
    fi

    if [ -e "$TMPGITDIR" ]; then

        { red "can't delete directory $TMPGITDIR"; } 2>&3
        exit 1
    fi

    mkdir $TMPGITDIR;

    if [ ! -e "$TMPGITDIR" ]; then

        { red "can't create directory $TMPGITDIR"; } 2>&3
        exit 1
    fi
# tmp git dir ^^^

(cd "$TMPGITDIR" && git clone $1 .);

rsync -aP --exclude .git "$TMPGITDIR/" ./

rm -rf "$TMPGITDIR"

{ green "gitwormhole pull : all good, finished"; } 2>&3






