#!/bin/sh
FILES="*.cgi"
TGDIR="./distrib/filemin"
DISTR="./distrib"
mkdir -p $TGDIR
mkdir -p $TGDIR/unauthenticated
cp -R images $TGDIR
cp -R lang $TGDIR
cp -R lib $TGDIR
cp -R unauthenticated/css $TGDIR/unauthenticated
cp -R unauthenticated/js $TGDIR/unauthenticated
cp -R unauthenticated/templates $TGDIR/unauthenticated

cp CHANGELOG $TGDIR
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
   cp $f "$TGDIR/$f"
  else
   echo "Error: Cannot read $f"
  fi
done

cd distrib
tar -zcf filemin-1.0.0.cdn.linux.wbm.gz filemin
cd ../
rm -rf $TGDIR
