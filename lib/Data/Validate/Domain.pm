package Data::Validate::Domain;

use strict;
use warnings;

use Net::Domain::TLD qw(tld_exists);

use Exporter qw( import );

## no critic (Modules::ProhibitAutomaticExportation)
our @EXPORT = qw(
    is_domain
    is_hostname
    is_domain_label
);

our $VERSION = '0.11';

sub new {
    my $class = shift;

    return bless {@_}, ref($class) || $class;
}

# -------------------------------------------------------------------------------

sub is_domain {
    my ( $value, $opt ) = _maybe_oo(@_);

    return unless defined($value);

    my $length = length($value);
    return unless ( $length > 0 && $length <= 255 );

    my @bits;
    foreach my $label ( split /\./, $value, -1 ) {
        my $bit = is_domain_label( $label, $opt );
        return unless defined $bit;
        push( @bits, $bit );
    }
    my $tld = $bits[-1];

    #domain_allow_single_label set to true disables this check
    unless ( defined $opt && $opt->{domain_allow_single_label} ) {

        #All domains have more then 1 label (neely.cx good, com not good)
        return unless ( @bits >= 2 );
    }

    #If the option to enable domain_private_tld is enabled
    #and a private domain is specified, then we return if that matches

    if (   defined $opt
        && exists $opt->{domain_private_tld}
        && ref( $opt->{domain_private_tld} ) ) {
        my $lc_tld = lc($tld);
        if ( ref( $opt->{domain_private_tld} ) eq 'HASH' ) {
            if ( exists $opt->{domain_private_tld}->{$lc_tld} ) {
                return join( '.', @bits );
            }
        }
        else {
            if ( $tld =~ $opt->{domain_private_tld} ) {
                return join( '.', @bits );
            }
        }
    }

    #Verify domain has a valid TLD
    return unless tld_exists($tld);

    return join( '.', @bits );
}

# -------------------------------------------------------------------------------

sub is_hostname {
    my ( $value, $opt ) = _maybe_oo(@_);

    return unless defined($value);

    my $length = length($value);
    return unless ( $length > 0 && $length <= 255 );

    #	return is_domain_label($value) unless $value =~ /\./;  #If just a simple hostname

    #Anything past here has multiple bits in it
    my @bits;
    foreach my $label ( split /\./, $value, -1 ) {
        my $bit = is_domain_label( $label, $opt );
        return unless defined $bit;
        push( @bits, $bit );
    }

    #We do not verify TLD for hostnames, as hostname.subhost is a valid hostname

    return join( '.', @bits );

}

sub is_domain_label {
    my ( $value, $opt ) = _maybe_oo(@_);

    return unless defined($value);

    #Fix Bug: 41033
    return if ( $value =~ /\n/ );

    # bail if we are dealing with more then just a hostname
    return if ( $value =~ /\./ );
    my $length = length($value);
    my $hostname;
    if ( $length == 1 ) {
        if ( defined $opt && $opt->{domain_allow_underscore} ) {
            ($hostname) = $value =~ /^([0-9A-Za-z\_])$/;
        }
        else {
            ($hostname) = $value =~ /^([0-9A-Za-z])$/;
        }
    }
    elsif ( $length > 1 && $length <= 63 ) {
        if ( defined $opt && $opt->{domain_allow_underscore} ) {
            ($hostname)
                = $value =~ /^([0-9A-Za-z\_][0-9A-Za-z\-\_]*[0-9A-Za-z])$/;
        }
        else {
            ($hostname)
                = $value =~ /^([0-9A-Za-z][0-9A-Za-z\-]*[0-9A-Za-z])$/;
        }
    }
    else {
        return;
    }
    return $hostname;
}

sub _maybe_oo {
    if ( ref $_[0] ) {
        return @_[ 1, 0 ];
    }
    else {
        return @_[ 0, 1 ];
    }
}

1;

# ABSTRACT: Domain and host name validation

__END__

=pod

=head1 NAME

Data::Validate::Domain - Domain and host name validation

=head1 VERSION

version 0.11

=head1 SYNOPSIS

  use Data::Validate::Domain qw(is_domain);

  # as a function
  my $test = is_domain($suspect);
  die "$test is not a domain" unless $test;

  # or

  die "$test is not a domain" unless is_domain($suspect, \%options);

  # or as an object
  my $v = Data::Validate::Domain->new(%options);

  die "$test is not a domain" unless $v->is_domain($suspect);

=head1 DESCRIPTION

This module offers a few subroutines for validating domain and host names.

=for test_synopsis my ($suspect, %options);

=head1 FUNCTIONS

All of the functions below are exported by default.

All of the functions return an untainted value on success and a false value
(C<undef> or an empty list) on failure. In scalar context, you should check
that the return value is defined, because something like
C<is_domain_label('0')> will return a defined but false value.

The value to test is always the first (and often only) argument.

Note that none of these functions test whether a domain or hostname is
actually resolvable or reachable.

=head2 Data::Validate::Domain->new()

This method constructs a validation object. It accepts the following arguments:

=over 4

=item * domain_allow_underscore

According to RFC underscores are forbidden in hostnames but not domain names.
By default C<is_domain()>, C<is_domain_label()>, and C<is_hostname()> will
fail if the value to be checked includes underscores. Setting this to a true
value with allow the use of underscores in all functions.

=item * domain_allow_single_label

By default C<is_domain()> will fail if you ask it to verify a domain that only
has a single label i.e. "neely.cx" is good, but "com" would fail. If you set
this option to a true value then C<is_domain()> will allow single label
domains through. This is most likely to be useful in combination with
the C<domain_private_tld> argument.

=item * domain_private_tld

By default C<is_domain()> requires all domains to have a valid public TLD
(i.e. com, net, org, uk, etc). This is verified using the L<Net::Domain::TLD>
module. This behavior can be extended in two different ways. You can provide
either a hash reference where additional TLDs are keys or you can supply a
regular expression.

NOTE: The TLD is normalized to the lower case form prior to the check being
done. This is done only for the TLD check, and does not alter the output in
any way.

Hashref example:

  domain_private_tld => {
      privatetld1 => 1,
      privatetld2 => 1,
  }

Regular expression example:

 domain_private_tld => qr /^(?:privatetld1|privatetld2)$/,

=back

=head2 is_domain($domain, \%options)

This can be called as either a subroutine or a method. If called as a sub, you
can pass any of the arguments accepted by the constructor as options. If
called as a method, any additional options are ignored.

This returns the untainted domain name if the given C<$domain> is a valid
domain.

A dotted quad (such as 127.0.0.1) is not considered a domain and will return false.
See L<Data::Validate::IP> for IP Validation.

This sub does not consider a value ending a period (i.e. "domain.com.") to be
a valid domain.

=over 4

=item I<From RFC 952>

   A "name" (Net, Host, Gateway, or Domain name) is a text string up
   to 24 characters drawn from the alphabet (A-Z), digits (0-9), minus
   sign (-), and period (.). Note that periods are only allowed when
   they serve to delimit components of "domain style names".

   No blank or space characters are permitted as part of a
   name. No distinction is made between upper and lower case. The first
   character must be an alpha character [Relaxed in RFC 1123] . The last
   character must not be a minus sign or period.

=item I<From RFC 1035>

    labels          63 octets or less
    names           255 octets or less

    [snip] limit the label to 63 octets or less.

    To simplify implementations, the total length of a domain name (i.e.,
    label octets and label length octets) is restricted to 255 octets or
    less.

=item I<From RFC 1123>

    One aspect of host name syntax is hereby changed: the
    restriction on the first character is relaxed to allow either a
    letter or a digit. Host software MUST support this more liberal
    syntax.

    Host software MUST handle host names of up to 63 characters and
    SHOULD handle host names of up to 255 characters.

=back

=head2 is_hostname($hostname, \%options)

This can be called as either a subroutine or a method. If called as a sub, you
can pass any of the arguments accepted by the constructor as options. If
called as a method, any additional options are ignored.

This returns the untainted hostname if the given C<$hostname> is a valid
hostname.

Hostnames are not required to end in a valid TLD.

=head2 is_domain_label($label, \%options)

This can be called as either a subroutine or a method. If called as a sub, you
can pass any of the arguments accepted by the constructor as options. If
called as a method, any additional options are ignored.

This returns the untainted label if the given C<$label> is a valid
label.

A domain label is simply a single piece of a domain or hostname. For example,
the "www.foo.com" hostname contains the labels "www", "foo", and "com".

=head1 SEE ALSO

B<[RFC 1034] [RFC 1035] [RFC 2181] [RFC 1123]>

=over 4

=item L<Data::Validate>

=item L<Data::Validate::IP>

=back

=head1 ACKNOWLEDGEMENTS

Thanks to Richard Sonnen <F<sonnen@richardsonnen.com>> for writing the Data::Validate module.

Thanks to Len Reed <F<lreed@levanta.com>> for helping develop the options mechanism for Data::Validate modules.

=head1 AUTHORS

=over 4

=item *

Neil Neely <neil@neely.cx>

=item *

Dave Rolsky <autarch@urth.org>

=back

=head1 CONTRIBUTOR

=for stopwords David Steinbrunner

David Steinbrunner <dsteinbrunner@pobox.com>

=head1 COPYRIGHT AND LICENSE

This software is copyright (c) 2015 by Neil Neely.

This is free software; you can redistribute it and/or modify it under
the same terms as the Perl 5 programming language system itself.

=cut
