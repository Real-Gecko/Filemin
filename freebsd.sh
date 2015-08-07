#!/bin/sh
OLD="bin\/perl"
NEW="local\/bin\/perl"
FILES="*.cgi"
TGDIR="./distrib/filemin"
DISTR="./distrib"
mkdir -p $TGDIR
cp -R images $TGDIR
cp -R lang $TGDIR
cp -R lib $TGDIR
cp -R unauthenticated $TGDIR

cp acl_security.pl $TGDIR
cp CHANGELOG $TGDIR
cp defaultacl $TGDIR
cp defaultuconf $TGDIR
cp filemin-lib.pl $TGDIR
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

cd distrib
tar -zcf filemin-0.9.5.freebsd.wbm.gz filemin
cd ../
rm -rf $TGDIR
