package Data::Validate::URI;

use strict;
use vars qw($VERSION @ISA @EXPORT @EXPORT_OK %EXPORT_TAGS);

require Exporter;
use AutoLoader 'AUTOLOAD';

use Data::Validate::Domain;

@ISA = qw(Exporter);



# no functions are exported by default.  See EXPORT_OK
@EXPORT = qw();

@EXPORT_OK = qw(
		is_uri
		is_http_uri
		is_https_uri
		is_web_uri
);

%EXPORT_TAGS = ();

$VERSION = '0.01';


# No preloads

1;

=head1 NAME

Data::Validate::URI - common url validation methods

=head1 SYNOPSIS

  use Data::Validate::URI qw(is_uri);
  
  if(is_uri($suspect)){
  	print "Looks like an URI\n";
  } else {
  	print "Not a URI\n";
  }

  # or as an object
  my $v = Data::Validate::URI->new();
  
  die "not a URI" unless ($v->is_uri('foo'));

=head1 DESCRIPTION

This module collects common URI validation routines to make input validation,
and untainting easier and more readable. 

All functions return an untainted value if the test passes, and undef if
it fails.  This means that you should always check for a defined status explicitly.
Don't assume the return will be true.

The value to test is always the first (and often only) argument.

There are a number of other URI validation modules out there as well (see below.)
This one focuses on being fast, lightweight, and relatively 'real-world'.  i.e.
it's good if you want to check user input, and don't need to parse out the URI/URL
into chunks.

Right now the module focuses on HTTP URIs, since they're arguably the most common.
If you have a specialized scheme you'd like to have supported, let me know.

=head1 FUNCTIONS

=over 4

=cut

# -------------------------------------------------------------------------------

=pod

=item B<new> - constructor for OO usage

  new();

=over 4

=item I<Description>

Returns a Data::Validator::URI object.  This lets you access all the validator function
calls as methods without importing them into your namespace or using the clumsy
Data::Validate::URI::function_name() format.

=item I<Arguments>

None

=item I<Returns>

Returns a Data::Validate::URI object

=back

=cut

sub new{
	my $class = shift;
	
	return bless {}, $class;
}

# -------------------------------------------------------------------------------

=pod

=item B<is_uri> - is the value a well-formed uri?

  is_url($value);

=over 4

=item I<Description>

Returns the untainted URI if the test value appears to be well-formed.  Note that
you may really want one of the more practical methods like is_http_uri or is_https_uri,
since the URI standard (RFC 3986) allows a lot of things you probably don't want.

=item I<Arguments>

=over 4

=item $value

The potential URI to test.

=back

=item I<Returns>

Returns the untainted URI on success, undef on failure.

=item I<Notes, Exceptions, & Bugs>

This function does not make any attempt to check whether the URI is accessible
or 'makes sense' in any meaningful way.  It just checks that it is formatted
correctly.

=back

=cut

sub is_uri{
	my $self = shift if ref($_[0]); 
	my $value = shift;
	
	return unless defined($value);
	
	# check for illegal characters
	return if $value =~ /[^a-z0-9\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=\.\-\_\~]/i;
	
	# from RFC 3986
	my($scheme, $authority, $path, $query, $fragment) = _split_uri($value);
	
	# scheme and path are required, though the path can be empty
	return unless (defined($scheme) && length($scheme) && defined($path));
	
	# if authority is present, the path must be empty or begin with a /
	if(defined($authority) && length($authority)){
		return unless(length($path) == 0 || $path =~ m!^/!);
	
	} else {
		# if authority is not present, the path must not start with //
		return if $path =~ m!^//!;
	}
	
	# scheme must begin with a letter, then consist of letters, digits, +, ., or -
	return unless lc($scheme) =~ m!^[a-z][a-z0-9\+\-\.]*$!;
	
	# re-assemble the URL per section 5.3 in RFC 3986
	my $out = $scheme . ':';
	if(defined $authority && length($authority)){
		$out .= '//' . $authority;
	}
	$out .= $path;
	if(defined $query && length($query)){
		$out .= '?' . $query;
	}
	if(defined $fragment && length($fragment)){
		$out .= '#' . $fragment;
	}
	
	return $out;
	
}

# -------------------------------------------------------------------------------

=pod

=item B<is_http_uri> - is the value a well-formed HTTP uri?

  is_http_uri($value);

=over 4

=item I<Description>

Specialized version of is_uri() that only likes http:// urls.  As a result, it can
also do a much more thorough job validating.  Also, unlike is_uri() it is more
concerned with only allowing real-world URIs through.  Things like relative
hostnames are allowed by the standards, but probably aren't wise.  Conversely,
null paths aren't allowed per RFC 2616 (should be '/' instead), but are allowed
by this function.

This function only works for fully-qualified URIs.  /bob.html won't work.  
See RFC 3986 for the appropriate method to turn a relative URI into an absolute 
one given its context.

Returns the untainted URI if the test value appears to be well-formed.

Note that you probably want to either call this in combo with is_https_uri(). i.e.

print "Good" if(is_http_uri($uri) || is_https_uri($uri));

or use the convenience method is_web_uri which is equivalent.

=item I<Arguments>

=over 4

=item $value

The potential URI to test.

=back

=item I<Returns>

Returns the untainted URI on success, undef on failure.

=item I<Notes, Exceptions, & Bugs>

This function does not make any attempt to check whether the URI is accessible
or 'makes sense' in any meaningful way.  It just checks that it is formatted
correctly.

=back

=cut

sub is_http_uri{
	my $self = shift if ref($_[0]); 
	my $value = shift;
	my $allow_https = shift;
	
	return unless is_uri($value);
	
	my($scheme, $authority, $path, $query, $fragment) = _split_uri($value);
	
	return unless $scheme;
	
	if($allow_https){
		return unless lc($scheme) eq 'https';
	} else {
		return unless lc($scheme) eq 'http';
	}
	
	# fully-qualified URIs must have an authority section that is
	# a valid host
	return unless($authority);
	
	# allow a port component
	my($port) = $authority =~ /:(\d+)$/;
	$authority =~ s/:\d+$//;
	
	return unless Data::Validate::Domain::is_domain($authority);
	
	# re-assemble the URL per section 5.3 in RFC 3986
	my $out = $scheme . ':';
	$out .= '//' . $authority;
	
	$out .= ':' . $port if $port;
	
	$out .= $path;
	
	if(defined $query && length($query)){
		$out .= '?' . $query;
	}
	if(defined $fragment && length($fragment)){
		$out .= '#' . $fragment;
	}
	
	return $out;
	
}


# -------------------------------------------------------------------------------

=pod

=item B<is_https_uri> - is the value a well-formed HTTPS uri?

  is_https_uri($value);

=over 4

=item I<Description>

See is_http_uri() for details.  This version only likes the https URI scheme.
Otherwise it's identical to is_http_uri()

=item I<Arguments>

=over 4

=item $value

The potential URI to test.

=back

=item I<Returns>

Returns the untainted URI on success, undef on failure.

=item I<Notes, Exceptions, & Bugs>

This function does not make any attempt to check whether the URI is accessible
or 'makes sense' in any meaningful way.  It just checks that it is formatted
correctly.

=back

=cut

sub is_https_uri{
	my $self = shift if ref($_[0]); 
	my $value = shift;
	
	return is_http_uri($value, 1);
}


# -------------------------------------------------------------------------------

=pod

=item B<is_web_uri> - is the value a well-formed HTTP or HTTPS uri?

  is_web_uri($value);

=over 4

=item I<Description>

This is just a convinience method that combines is_http_uri and is_https_uri
to accept most common real-world URLs.

=item I<Arguments>

=over 4

=item $value

The potential URI to test.

=back

=item I<Returns>

Returns the untainted URI on success, undef on failure.

=item I<Notes, Exceptions, & Bugs>

This function does not make any attempt to check whether the URI is accessible
or 'makes sense' in any meaningful way.  It just checks that it is formatted
correctly.

=back

=cut

sub is_web_uri{
	my $self = shift if ref($_[0]); 
	my $value = shift;
	
	my $h = is_http_uri($value);
	return $h if defined $h;
	
	return is_https_uri($value);
}


# internal URI spitter method - direct from RFC 3986
sub _split_uri{
	my $value = shift;
	
	my @bits = $value =~ m|(?:([^:/?#]+):)?(?://([^/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?|;
	
	return @bits;
}
	

=pod

=back

=head1 SEE ALSO

L<URI>, RFC 3986

=head1 AUTHOR

Richard Sonnen <F<sonnen@richardsonnen.com>>.

=head1 COPYRIGHT

Copyright (c) 2005 Richard Sonnen. All rights reserved.

This program is free software; you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut
