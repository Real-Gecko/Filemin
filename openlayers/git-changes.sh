BASEDIR=$(dirname $0)
echo "Changes since $2";
echo "<ul>";
git log $2..$3 --pretty=format:"<li> <a href='http://drupalcode.org/project/$1.git/commit/%H'>view commit &bull;</a> %s</li> " --reverse | grep -v Merge
echo "</ul>";
