#!/bin/sh
OLD="https:\/\/cdnjs.cloudflare.com\/ajax"
NEW="unauthenticated"
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
cp filemin-updater.tar.gz $TGDIR/unauthenticated

cp CHANGELOG.md $TGDIR
cp LICENCE $TGDIR
cp README.md $TGDIR
cp acl_security.pl $TGDIR
# cp postinstall.pl $TGDIR
# cp uninstall.pl $TGDIR
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

while IFS='=' read -r key value; do
    case $key in
        version)
            VERSION="$value"
            ;;
     esac
done < module.info

echo "Packing Linux version $VERSION"

cd distrib
tar -zcf filemin-$VERSION.linux.wbm.gz filemin
cd ../
perl makemoduledeb.pl --target-dir distrib distrib/filemin
rm -rf $TGDIR
