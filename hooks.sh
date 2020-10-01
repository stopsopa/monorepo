
MODE="on"
FORCE="0"
while (( "$#" )); do
  case "$1" in
    --off)
      MODE="off"
      shift;
      ;;
    --revert)
      MODE="revert"
      shift;
      ;;
    --force)
      FORCE="1"
      shift;
      ;;
    -*|--*=) # unsupported flags
      echo "$0 Error: Unsupported flag $1" >&2
      exit 1;
      ;;
    *) # preserve positional arguments
      shift;
      ;;
  esac
done

MONOREPODIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"

#echo "MONOREPODIR: $MONOREPODIR"

PROJECT="$(dirname "$(dirname "$MONOREPODIR")")"

#echo "PROJECT: $PROJECT"

source "$MONOREPODIR/bash/libs/colours.sh";

GIT="$PROJECT/.git"

if ! [ -d "$GIT" ]; then

  { red "$0 error: git directory ($GIT) doesn't exist"; } 2>&3

  exit 1;
fi

cd "$GIT"

set -e

if [ "$MODE" = "revert" ]; then

  if [ -d "$GIT/hooks_backup" ]; then

    rm -rf "$GIT/hooks"

    mv "$GIT/hooks_backup" "$GIT/hooks"

    ls -la "$GIT/hooks/"

    { green "\n    old hooks reverted\n"; } 2>&3

  else

    { red "there is not '$GIT/hooks_backup' directory - nothing to revert"; } 2>&3
  fi

  exit 0;
fi

if [ -d "$GIT/hooks" ] && ! [ -f "$GIT/hooks/.monorepo-hooks" ] && ! [ -d "$GIT/hooks_backup" ]; then

  mv "$GIT/hooks" "$GIT/hooks_backup"

  { green "copying existing git hooks to backup directory '$GIT/hooks_backup'\n"; } 2>&3
fi

if [ "$MODE" = "on" ]; then

  if ! [ -e "hooks" ] || [ "$FORCE" = "1" ]; then

    rm -rf "$GIT/hooks"

    cp -R "$MONOREPODIR/hooks" "$GIT/hooks"

    chmod a+x "$GIT/hooks"

    chmod a-x "$GIT/hooks/.monorepo-hooks" || true

    (cd "$GIT/monorepo/" && npm install)

    ls -la "$GIT/hooks/"

    { green "\n    hooks mounted\n"; } 2>&3

  else

    { red "

      $0 error: hooks directory ($GIT/hooks) already exist
      If you want to reset existing hooks add param --force

    "
    } 2>&3

    exit 1;
  fi

else # MODE=off

  rm -rf "$GIT/hooks"

  { green "\n    hooks unmounted\n"; } 2>&3

fi



