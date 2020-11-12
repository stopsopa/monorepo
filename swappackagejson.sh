
___ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"

__PO="$___ROOT/package.json" # original file
__PT="$___ROOT/package.tmp.json" # temp file

__P0MODE="npm" # this one will be always on
__P1MODE="webpack"

__P0="$___ROOT/package.$__P0MODE.json"
__P1="$___ROOT/package.$__P1MODE.json" # this file normally should exist all the time

# so for this configuration normally you will have files in main directory like this:
#ls -la
#
#total 5080
#drwxr-xr-x  31 sd  staff      992 29 Oct 23:07 .
#drwxr-xr-x  10 sd  staff      320  2 Oct 14:43 ..
#drwxr-xr-x  16 sd  staff      512 29 Oct 22:23 .git
#-rw-r--r--   1 sd  staff       63  2 Oct 00:26 .gitignore
#...
#-rw-r--r--   1 sd  staff     5226  2 Oct 00:43 package-lock.json
#-rw-r--r--   1 sd  staff      675  2 Oct 00:43 package.json
#-rw-r--r--   1 sd  staff      859  2 Oct 00:18 package.webpack.json
#...
#-rw-r--r--   1 sd  staff      441 29 Oct 23:07 swappackagejson.sh
#...
#-rw-r--r--   1 sd  staff   197621  1 Oct 23:11 yarn.lock
#...

