#!/bin/sh
OLD="bin\/perl"
NEW="local\/bin\/perl"
FILES="*.cgi"
TGDIR="./distrib/freebsd"
rm -rf $TGDIR
mkdir -p $TGDIR
cp -R images $TGDIR
cp -R lang $TGDIR
cp -R lib $TGDIR
cp -R unauthenticated $TGDIR

cp acl_security.pl $TGDIR
cp CHANGELOG $TGDIR
cp defaultacl $TGDIR
cp filemin-lib.pl $TGDIR
cp install_check.pl $TGDIR
cp LICENCE $TGDIR
cp module.info $TGDIR
cp README.md $TGDIR

for f in $FILES
do
  if [ -f $f -a -r $f ]; then
   sed "s/$OLD/$NEW/g" "$f" > "$TGDIR/$f"
  else
   echo "Error: Cannot read $f"
  fi
done
