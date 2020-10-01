
#
#
#
# run this script using:
#   source dev-prepare.sh
# to preserve alias "ex"
#
#
#
#


#mkdir runtime
#cd runtime
#git clone git@github.com:stopsopa/monorepo.git .
#cd ../..
#
## If you already cloned then start from here

npm link
alias ex="cd \"$(pwd)\""
cd ..

rm -rf test

mkdir -p test/bare_a
cd test/bare_a
git init --bare
cd ../..

mkdir -p test/bare_a
cd test/bare_a
git init --bare
cd ../..

mkdir -p test/bare_b
cd test/bare_b
git init --bare
cd ../..

mkdir -p test/bare_c
cd test/bare_c
git init --bare
cd ../..

mkdir -p test/bare_d
cd test/bare_d
git init --bare
cd ../..

mkdir -p test/bare_master
cd test/bare_master
git init --bare
cd ../..

mkdir -p test/repo-master
cd test/repo-master
git init
git remote add bare_a ../bare_a
git remote add bare_b ../bare_b
git remote add bare_c ../bare_c
git remote add bare_d ../bare_d
git remote add origin ../bare_master

cat <<EOF > package.json
{
    "name": "testrepo"
}
EOF

cat <<EOF > .gitignore
node_modules
EOF

npm link \@stopsopa/monorepo

node node_modules/\@stopsopa/monorepo/install.js

cp node_modules/\@stopsopa/monorepo/config-dist.yml .git/config.yml

git add .

git commit -m first_commit

git push origin master

git checkout -b bare_a
git push bare_a master

git checkout -b bare_b
git push bare_b master

git checkout -b bare_c
git push bare_c master

git checkout -b bare_d
git push bare_d master

git checkout bare_b

git checkout -b bare_b_1
git push bare_b bare_b_1

git checkout -b bare_b_2
git push bare_b bare_b_2

git checkout -b bare_b_3
git push bare_b bare_b_3

git checkout -b bare_b_4
git push bare_b bare_b_4


cd ../..

# second developer emulation vvv
mkdir -p test/dev2_bare_master
cd test/dev2_bare_master
git clone ../bare_master .
cd ../..

mkdir -p test/dev2_bare_a
cd test/dev2_bare_a
git clone ../bare_a .
cd ../..

mkdir -p test/dev2_bare_b
cd test/dev2_bare_b
git clone ../bare_b .
cd ../..

mkdir -p test/dev2_bare_c
cd test/dev2_bare_c
git clone ../bare_c .
cd ../..

mkdir -p test/dev2_bare_d
cd test/dev2_bare_d
git clone ../bare_d .
cd ../..
# second developer emulation ^^^


unlink git

ln -s test/repo-master/.git git

cd test/repo-master

git checkout master

echo "

  Now just run

    ex

  to return to library directory,

  or run:

    ex && source dev-prepare.sh

  to rebuild everything again

"
