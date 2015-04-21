# filemin-lib.pl

BEGIN { push(@INC, ".."); };
use WebminCore;
use Cwd 'abs_path';

&init_config();

sub get_paths {
    local @uinfo = getpwnam($remote_user);
    $base = $uinfo[7] ? $uinfo[7] : "/";
    $path = $in{'path'} ? $in{'path'} : '';
    $cwd = abs_path($base.$path);
    if (index($cwd, $base) == -1)
    {
        $cwd = $base;
    }
}

1;
