#!/bin/sh
OLD="bin\/perl"
NEW="local\/bin\/perl"
FILES="*.cgi"
TGDIR="./distrib/filemin"
DISTR="./distrib"
mkdir -p $TGDIR
mkdir -p $TGDIR/unauthenticated
mkdir -p $TGDIR/unauthenticated/js
mkdir -p $TGDIR/unauthenticated/css
mkdir -p $TGDIR/unauthenticated/templates
cp -R images $TGDIR
cp -R lang $TGDIR
cp -R lib $TGDIR
cp -R unauthenticated/libs $TGDIR/unauthenticated
cp -R unauthenticated/css/*.min.css $TGDIR/unauthenticated/css

cp CHANGELOG.md $TGDIR
cp LICENCE $TGDIR
cp README.md $TGDIR
cp acl_security.pl $TGDIR
cp config $TGDIR
cp config.info $TGDIR
cp defaultacl $TGDIR
cp filemin-lib.pl $TGDIR
cp module.info $TGDIR

for f in $FILES
do
  if [ -f $f -a -r $f ]; then
   sed "s/$OLD/$NEW/g" "$f" > "$TGDIR/$f"
  else
   echo "Error: Cannot read $f"
  fi
done

OLD="https:\/\/cdnjs.cloudflare.com\/ajax"
NEW="unauthenticated"

FILES="unauthenticated/templates/*.html"

for f in $FILES
do
  if [ -f $f -a -r $f ]; then
   sed -e "s/$OLD/$NEW/g" -e "s/filemin\./filemin\.min\./g" -e "s/chmod-calculator\./chmod-calculator\.min\./g" -e "s/spec-ops\./spec-ops\.min\./g" "$f" > "$TGDIR/$f"
  else
   echo "Error: Cannot read $f"
  fi
done

FILES="unauthenticated/js/*.min.js"

for f in $FILES
do
  if [ -f $f -a -r $f ]; then
   sed "s/$OLD/$NEW/g" "$f" > "$TGDIR/$f"
  else
   echo "Error: Cannot read $f"
  fi
done

cd distrib
tar -zcf filemin-1.1.0.freebsd.wbm.gz filemin
cd ../
rm -rf $TGDIR
