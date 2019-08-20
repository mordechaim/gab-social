## Gab Social: Running A Server

**Disclaimer:**

This guide was written for [Ubuntu Server 18.04](https://www.ubuntu.com/server). You may run into issues if you are using another operating system.

It is assumed that you have technical knowledge and skills sufficient to administer Linux servers and scale them, if necessary. Gab Social communities that succeed have *no upper limit* to the maximum amount of users, posts, attachments, and problems related to operating publicly-accessible online communities at scale. Fortunately, Gab Social does not require you to operate at scale. You can run this server in single-user mode, which guarantees users complete ownership of all their data while still participating in the Gab Platform.

This document describes how to prepare a host for development, test, and production service.

## What is this guide?

This guide is a walk through of the setup process of a [Gab Social](https://code.gab.com/gab/social/gab-social) instance.

We use example.com to represent a domain or sub-domain. Example.com should be replaced with your instance domain or sub-domain.

## Prerequisites

You will need the following for this guide:

- A server running [Ubuntu Server 18.04](https://www.ubuntu.com/server).
- Root access to the server.
- A domain or sub-domain to use for the instance.

## DNS

DNS records should be added before anything is done on the server.

The records added are:

-  A record (IPv4 address) for example.com
-  AAAA record (IPv6 address) for example.com

> ### A Helpful And Optional Note
>
> Using `tmux` when following through with this guide will be helpful.
>
>
> Not only will this help you not lose your place if you are disconnected, it will let you have multiple terminal windows open for switching contexts (root user versus the gabsocial user).
>
> You can install [tmux](https://github.com/tmux/tmux/wiki) from the package manager:
>
> ```sh
> apt -y install tmux
> ```

## Dependency Installation

All dependencies should be installed as root.

```sh
sudo -i
```

## Extend Ubuntu repositories when using Ubuntu 18.04.1 LTS

Starting with .1-release Ubuntu 18.04.1 LTS (not 18.04), Canonical has removed the multiverse, universe and restricted repository from the sources.list file in /etc/apt/. It is now necessary to add those repositories, otherwise the installation of the following dependencies will fail. Simply run the following commands:

```sh
add-apt-repository universe
add-apt-repository multiverse
add-apt-repository restricted
apt update
```

#### Explanation of the dependencies

- imagemagick - Gab Social uses imagemagick for image related operations
- ffmpeg - Gab Social uses ffmpeg for conversion of GIFs to MP4s
- libprotobuf-dev and protobuf-compiler - Gab Social uses these for language detection
- nginx - nginx is our frontend web server
- redis-* - Gab Social uses redis for its in-memory data structure store
- postgresql-* - Gab Social uses PostgreSQL as its SQL database
- nodejs - Node is used for Gab Social's streaming API and other platform services
- yarn - Yarn is a Node.js package manager
- Other -dev packages, g++ - these are needed for the compilation of Ruby using ruby-build.

```sh
apt -y install imagemagick ffmpeg libpq-dev libxml2-dev libxslt1-dev file git-core g++ libprotobuf-dev protobuf-compiler pkg-config gcc autoconf bison build-essential libssl-dev libyaml-dev libreadline6-dev zlib1g-dev libncurses5-dev libffi-dev libgdbm5 libgdbm-dev nginx redis-server redis-tools postgresql postgresql-contrib certbot libidn11-dev libicu-dev
```

### Dependencies That Need To Be Added As A Non-Root User

Let us create this user first:

```sh
adduser --disabled-password gabsocial
```

Log in as the `gabsocial` user:


```sh
sudo su - gabsocial
```

#### Node Version Manager, Node.js, and Yarn

[Node Version Manager](https://github.com/nvm-sh/nvm) is a tool used for managing Node.js deployments. By convention at Gab, we only use Node.js as a standard user. No part of Node.js is managed or executed with superuser privileges. Those responsibilities are handled by Nginx later in this document.

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
```

Refresh your user session to pick up the environment changes added by `nvm`. Then, let's install Node.js v10.15.3LTS, verify that it was installed correctly, and install Yarn:

```sh
# ask NVM to install 10.16.1LTS
nvm install --lts 10.16.1

# ask Node to print it's version number and exit.
node --version

# (should display)
v10.16.1

# Install Yarn, globally
npm install -g yarn forever
```

#### rbenv, Ruby, Rails, Rake

We will need to set up [`rbenv`](https://github.com/rbenv/rbenv) and [`ruby-build`](https://github.com/rbenv/ruby-build):

```sh
git clone https://github.com/rbenv/rbenv.git ~/.rbenv
cd ~/.rbenv && src/configure && make -C src
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc

# Restart shell
exec bash

# Check if rbenv is correctly installed
type rbenv

# Install ruby-build as rbenv plugin
git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
```

Now that [`rbenv`](https://github.com/rbenv/rbenv) and [`ruby-build`](https://github.com/rbenv/ruby-build) are installed, we will install the
[Ruby](https://www.ruby-lang.org/en/) version which [Gab Social](https://code.gab.com/gab/social/gab-social) uses. That version will also need to be enabled.

To enable [Ruby](https://www.ruby-lang.org/en/), run:

```sh
# We recommend watching videos on BitChute while this procedure
# ruins your whole machine forever.
rbenv install 2.6.1

# set the global RoR environment to version 2.6.1
rbenv global 2.6.1
```

### node.js And Ruby Dependencies

Now that [Ruby](https://www.ruby-lang.org/en/) is enabled, we will clone the [Gab Social git repository](https://code.gab.com/gab/social/gab-social) and install the [Ruby](https://www.ruby-lang.org/en/) and [node.js](https://nodejs.org/en/) dependancies.

Run the following to clone and install:

```sh
# Return to gabsocial user's home directory
cd ~

# Clone the gabsocial git repository into ~/live
git clone https://code.gab.com/gab/social/gab-social live

# Change directory to ~/live
cd ~/live

# Checkout to the latest stable branch
git checkout $(git tag -l | grep -v 'rc[0-9]*$' | sort -V | tail -n 1)

# Install bundler
gem install bundler

# Use bundler to install the rest of the Ruby dependencies
bundle install -j$(getconf _NPROCESSORS_ONLN) --deployment --without development test

# Use yarn to install node.js dependencies
yarn install --pure-lockfile
```

That is all we need to do for now with the `gabsocial` user, you can now `exit` back to root.

If you plan on deploying more than one front-end app server, you may want to consider using a host image once you are done setting up all dependencies. That `rbenv install 2.6.1` command only gets intensely worse on anemic shared cloud hosts, and the `bundle install` nonsense is just out of control.

The remainder of the setup procedure is quick (esp. when automated). If you want to leave the rest of your setup dynamic, now is really the right time to snapshot the host. You will save yourself a lot of deployment time in the days and months to come.

Eventually, the Ruby On Rails dependencies are going away. This is a stop-gap solution while we continue our migration to a Gab-native implementation of ActivityPub/GNU Social on HYDRA.

## PostgreSQL Database Creation

[Gab Social](https://code.gab.com/gab/social/gab-social) requires access to a [PostgreSQL](https://www.postgresql.org) instance.

Create a user for a [PostgreSQL](https://www.postgresql.org) instance:

```
# Launch psql as the postgres user
sudo -u postgres psql

# In the following prompt
CREATE USER gabsocial CREATEDB;
\q
```

**Note** that we do not set up a password of any kind, this is because we will be using ident authentication. This allows local users to access the database without a password.

## nginx Configuration

You need to configure [nginx](http://nginx.org) to serve your [Gab Social](https://code.gab.com/gab/social/gab-social) instance.

**Reminder: Replace all occurrences of example.com with your own instance's domain or sub-domain.**

`cd` to `/etc/nginx/sites-available` and open a new file:

`nano /etc/nginx/sites-available/example.com.conf`

Copy and paste the following and make edits as necessary:

```nginx
map $http_upgrade $connection_upgrade {
  default upgrade;
  ''      close;
}

server {
  listen 80;
  listen [::]:80;
  server_name example.com;
  root /home/gabsocial/live/public;
  # Useful for Let's Encrypt
  location /.well-known/acme-challenge/ { allow all; }
  location / { return 301 https://$host$request_uri; }
}

server {
  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  server_name example.com;

  ssl_protocols TLSv1.2;
  ssl_ciphers HIGH:!MEDIUM:!LOW:!aNULL:!NULL:!SHA;
  ssl_prefer_server_ciphers on;
  ssl_session_cache shared:SSL:10m;

  ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

  keepalive_timeout    70;
  sendfile             on;
  client_max_body_size 80m;

  root /home/gabsocial/live/public;

  gzip on;
  gzip_disable "msie6";
  gzip_vary on;
  gzip_proxied any;
  gzip_comp_level 6;
  gzip_buffers 16 8k;
  gzip_http_version 1.1;
  gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

  add_header Strict-Transport-Security "max-age=31536000";

  location / {
    try_files $uri @proxy;
  }

  location ~ ^/(emoji|packs|system/accounts/avatars|system/media_attachments/files) {
    add_header Cache-Control "public, max-age=31536000, immutable";
    try_files $uri @proxy;
  }

  location /sw.js {
    add_header Cache-Control "public, max-age=0";
    try_files $uri @proxy;
  }

  location @proxy {
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
    proxy_set_header Proxy "";
    proxy_pass_header Server;

    proxy_pass http://127.0.0.1:3000;
    proxy_buffering off;
    proxy_redirect off;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;

    tcp_nodelay on;
  }

  location /api/v1/streaming {
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
    proxy_set_header Proxy "";

    proxy_pass http://127.0.0.1:4000;
    proxy_buffering off;
    proxy_redirect off;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;

    tcp_nodelay on;
  }

  error_page 500 501 502 503 504 /500.html;
}
```

Activate the [nginx](http://nginx.org) configuration added:

```sh
cd /etc/nginx/sites-enabled
ln -s ../sites-available/example.com.conf
```

This configuration makes the assumption you are using [Let's Encrypt](https://letsencrypt.org) as your TLS certificate provider.

**If you are going to be using Let's Encrypt as your TLS certificate provider, see the
next sub-section. If not edit the `ssl_certificate` and `ssl_certificate_key` values
accordingly.**

## Let's Encrypt

This section is only relevant if you are using [Let's Encrypt](https://letsencrypt.org/)
as your TLS certificate provider.

### Generation Of The Certificate

We need to generate Let's Encrypt certificates.

**Make sure to replace any occurrence of 'example.com' with your Gab Social instance's domain.**

Make sure that [nginx](http://nginx.org) is stopped at this point:

```sh
systemctl stop nginx
```

We will be creating the certificate twice, once with TLS SNI validation in standalone mode and the second time we will be using the webroot method. This is required due to the way
[nginx](http://nginx.org) and the [Let's Encrypt](https://letsencrypt.org/) tool works.

```sh
certbot certonly --standalone -d example.com
```

After that successfully completes, we will use the webroot method. This requires [nginx](http://nginx.org) to be running:

```sh
systemctl start nginx
```

### Automated Renewal Of Let's Encrypt Certificate

[Let's Encrypt](https://letsencrypt.org/) certificates have a validity period of 90 days.

You need to renew your certificate before the expiration date. Not doing so will make users of your instance unable to access the instance and users of other instances unable to federate with yours.

We can create a cron job that runs daily to do this:

```sh
nano /etc/cron.daily/letsencrypt-renew
```

Copy and paste this script into that file:

```sh
#!/usr/bin/env bash
certbot renew
systemctl reload nginx
```

Save and exit the file.

Make the script executable and restart the cron daemon so that the script runs daily:

```sh
chmod +x /etc/cron.daily/letsencrypt-renew
systemctl restart cron
```

That is it. Your server will renew your [Let's Encrypt](https://letsencrypt.org/) certificate.

## Gab Social Application Configuration

We will configure the Gab Social application.

For this we will switch to the `gabsocial` system user:


```sh
sudo su - gabsocial
```

Change directory to `~/live` and run the [Gab Social](https://code.gab.com/gab/social/gab-social) setup wizard:

```sh
cd ~/live
RAILS_ENV=production bundle exec rake gabsocial:setup
```

If upgrading:

```sh
cd ~/live
RAILS_ENV=production rails assets:precompile
```

The interactive wizard will guide you through basic and necessary options, generate new app secrets, setup the database schema and precompile the assets.

**The assets precompilation takes a couple minutes, so this is a good time to take another break.**

## Gab Social systemd Service Files

We will need three [systemd](https://github.com/systemd/systemd) service files for each Gab Social service.

Now switch back to the root user.

For the [Gab Social](https://code.gab.com/gab/social/gab-social) web workers service place the following in `/etc/systemd/system/gabsocial-web.service`:

```
[Unit]
Description=gabsocial-web
After=network.target

[Service]
Type=simple
User=gabsocial
WorkingDirectory=/home/gabsocial/live
Environment="RAILS_ENV=production"
Environment="PORT=3000"
ExecStart=/home/gabsocial/.rbenv/shims/bundle exec puma -C config/puma.rb
ExecReload=/bin/kill -SIGUSR1 $MAINPID
TimeoutSec=15
Restart=always

[Install]
WantedBy=multi-user.target
```

For [Gab Social](https://code.gab.com/gab/social/gab-social) background queue service, place the following in `/etc/systemd/system/gabsocial-sidekiq.service`:

```
[Unit]
Description=gabsocial-sidekiq
After=network.target

[Service]
Type=simple
User=gabsocial
WorkingDirectory=/home/gabsocial/live
Environment="RAILS_ENV=production"
Environment="DB_POOL=5"
ExecStart=/home/gabsocial/.rbenv/shims/bundle exec sidekiq -c 5 -q default -q push -q mailers -q pull
TimeoutSec=15
Restart=always

[Install]
WantedBy=multi-user.target
```

For the [Gab Social](https://code.gab.com/gab/social/gab-social) streaming API service place the following in `/etc/systemd/system/gabsocial-streaming.service`:

```
[Unit]
Description=gabsocial-streaming
After=network.target

[Service]
Type=simple
User=gabsocial
WorkingDirectory=/home/gabsocial/live
Environment="NODE_ENV=production"
Environment="PORT=4000"
ExecStart=/usr/bin/npm run start
TimeoutSec=15
Restart=always

[Install]
WantedBy=multi-user.target
```

Now you need to enable all of these services:

```sh
systemctl enable /etc/systemd/system/gabsocial-*.service
```

Now start the services:

```sh
systemctl start gabsocial-*.service
```

Check that they are properly running:

```sh
systemctl status gabsocial-*.service
```

## Remote media attachment cache cleanup

Gab Social downloads media attachments from other instances and caches it locally for viewing. This cache can grow quite large if not cleaned up periodically and can cause issues such as low disk space or a bloated S3 bucket.

The recommended method to clean up the remote media cache is a cron job that runs daily like so (put this in the gabsocial system user's crontab with `crontab -e`.)

```sh
RAILS_ENV=production
@daily cd /home/gabsocial/live && /home/gabsocial/.rbenv/shims/bundle exec rake gabsocial:media:remove_remote
```

That rake task removes cached remote media attachments that are older than NUM_DAYS, NUM_DAYS defaults to 7 days (1 week) if not specified. NUM_DAYS is another environment variable so you can specify it like so:

```sh
RAILS_ENV=production
NUM_DAYS=14
@daily cd /home/gabsocial/live && /home/gabsocial/.rbenv/shims/bundle exec rake gabsocial:media:remove_remote
```

## Email Service

If you plan on receiving email notifications or running more than just a single-user instance, you likely will want to get set up with an email provider.

There are several free email providers out there- a couple of decent ones are Mailgun.com, which requires a credit card but gives 10,000 free emails, and Sparkpost.com, which gives 15,000 with no credit card but requires you not be on a .space tld.

It may be easier to use a subdomain to setup your email with a custom provider - in this case, when registering your domain with the email service, sign up as something like "mail.domain.com"

Once you create your account, follow the instructions each provider gives you for updating your DNS records.  Once you have all the information ready to go and the service validates your DNS configuration, edit your config file.  These records should already exist in the configuration, but here's a sample setup that uses Mailgun that you can replace with your own personal info:

```
SMTP_SERVER=smtp.mailgun.org
SMTP_PORT=587
SMTP_LOGIN=anAccountThatIsntPostmaster@gabsocial.domain.com
SMTP_PASSWORD=HolySnacksAPassword
SMTP_FROM_ADDRESS=Domain.com Gab Social Admin <notifications@gab.com>
```

Finally, to test this, spin up a Rails console (see [the administration guide](https://code.gab.com/gab/social/gab-social/blob/master/docs/server.md)) and run the following commands to test this out:

```ruby
m = UserMailer.new.mail to:'email@address.com', subject: 'test', body: 'awoo'
m.deliver
```

That is all! If everything was done correctly, a [Gab Social](https://code.gab.com/gab/social/gab-social) instance will appear when you visit `https://example.com` in a web browser.

Congratulations and welcome to Gab Social!