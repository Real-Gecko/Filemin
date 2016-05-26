#!/bin/sh
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
cp -R unauthenticated/js/*.min.js $TGDIR/unauthenticated/js
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
   sed -e "s/filemin\./filemin\.min\./g" -e "s/chmod-calculator\./chmod-calculator\.min\./g" -e "s/spec-ops\./spec-ops\.min\./g" "$f" > "$TGDIR/$f"
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

echo "Packing Linux CDN version $VERSION"

cd distrib
tar -zcf filemin-$VERSION.cdn.linux.wbm.gz filemin
cd ../
rm -rf $TGDIR
