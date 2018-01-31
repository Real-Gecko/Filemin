rm upload/*
cp unauthenticated/js/filemin.js unauthenticated/js/filemin.min.js
cp unauthenticated/js/spec-ops.js unauthenticated/js/spec-ops.min.js
cp unauthenticated/css/filemin.css unauthenticated/css/filemin.min.css
./linux.sh
./linux.cdn.sh
./freebsd.sh
./linux.builtin.sh
