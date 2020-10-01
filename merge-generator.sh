
THISFILE=${BASH_SOURCE[0]}
DIR="$( cd "$( dirname "${THISFILE}" )" && pwd -P )"

node "$DIR/merge.js" "$DIR/../config.yml" "$DIR/generated.sh"

EX=$?

set -e

if [ "$EX" = "10" ]; then

    /bin/bash "$DIR/generated.sh"
fi




