# Gab Social Developer Setup

Developers wanting to work on [Gab Social](https://code.gab.com/gab/social/gab-social) source code and make changes to the system must configure a host for use with Gab Social's development environment.

The instructions in this file do not create a production-grade host that is secure and can scale. Instead, these instructions deliver a working environment tuned for making changes to Gab Social and for quickly iterating on those changes to get stuff done.

## Host OS

[Gab Social](https://code.gab.com/gab/social/gab-social) development has been tested on [Ubuntu 18.04LTS](https://www.ubuntu.com/download/desktop). As we continue to migrate further away from Gab Social's code, at least MacOS will be supported as a choice.

We are unlikely to support Windows as a host OS because no part of our software development infrastructure is based on Windows. We will, however, be happy to review and accept your pull requests adding Windows support for development and even production hosting if you think that's not too nutty.

## Superuser Host Access Rights Required

This document describes commands intended to be run in a terminal. It also describes changes needed in some components' configuration files. Some of these actions must be performed with the user account you will use for day-to-day development. And, some of the commands need to be performed as the superuser (root) or a user with equivalent administrative privileges.

When superuser permissions are required,

## Extend Ubuntu repositories when using Ubuntu 18.04.1LTS or later

Starting with Ubuntu 18.04.1 LTS, Canonical removed the multiverse and restricted repositories from the sources.list in `/etc/apt/`. It is now necessary to add those repositories manually , otherwise the installation of the following dependencies will fail.

```sh
sudo add-apt-repository multiverse
sudo add-apt-repository restricted
sudo apt update
```

## System Dependencies

The following software components and libraries are required by [Gab Social](https://code.gab.com/gab/social/gab-social).

- *ImageMagick* - Gab Social uses imagemagick for image related operations
- *FFMPEG* - Gab Social uses ffmpeg for conversion of GIFs to MP4s
- *libprotobuf-dev* and *protobuf-compiler* - Gab Social uses these for language detection
- *nginx* - nginx is our frontend web server
- *Redis* - Gab Social uses redis for its in-memory data structure store
- *postgresql* - Gab Social uses PostgreSQL as its SQL database
- *Node.js* - Node is used for Gab Social's streaming API and other platform services
- *Yarn* - Yarn is a Node.js package manager
- *gcc, g++, etc.* - these are needed for the compilation of Ruby using ruby-build and to build Node.js extensions

## Dependency Installation

All dependencies should be installed as the system superuser (root). Either use the `sudo` command as required, or by first switching to the superuser using the following command:

```sh
sudo -i
```

If you become root, please be sure to switch back to your regular user account when instructed to do so later.

### Install system components

```sh
apt-get install -y imagemagick ffmpeg libpq-dev libxml2-dev libxslt1-dev file git git-flow g++ libprotobuf-dev protobuf-compiler pkg-config gcc autoconf bison build-essential libssl-dev libyaml-dev libreadline6-dev zlib1g-dev libncurses5-dev libffi-dev libgdbm5 libgdbm-dev nginx redis-server redis-tools postgresql postgresql-contrib certbot libidn11-dev libicu-dev
```

### Install Node.js 10.15.3 LTS

Node.js is required for running the [Gab Social](https://code.gab.com/gab/social/gab-social) Streaming API server and for other system management tasks related to the Gab Platform.

```bash
# Install nvm to manage Node.js versions
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash

# Install the Node.js runtime
nvm install --lts 10.16

# Install Yarn
npm install -g yarn
```

## Create User Account

Gab Social requires a standard non-root user account for day-to-day operations and work. This can be your own account or (if following this document for the first time) the `gabsocial` user.

Creating a `gabsocial` user is simple and can make following the rest of this guide very simple.

```
adduser --disabled-password --quiet gabsocial
```

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

### Switch back to your account

If you became the root user to install system dependencies, please relinquish superuser privileges and return to your user account.

```sh
exit
```

### Configure your working environment

The public-facing Web service `gabsocial-web` is currently built using Ruby On Rails. A developer workstation user account, therefore, must configure [`rbenv`](https://github.com/rbenv/rbenv) and [`ruby-build`](https://github.com/rbenv/ruby-build) as follows:

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
rbenv install 2.6.1
rbenv global 2.6.1
```

This will take some time. Go stretch for a bit and drink some water while the commands run.

### node.js And Ruby Dependencies

Now that [Ruby](https://www.ruby-lang.org/en/) is enabled, we will clone the [Git Social git repository](https://code.gab.com/gab/social/gab-social) and install the [Ruby](https://www.ruby-lang.org/en/) and [node.js](https://nodejs.org/en/) dependancies.

Run the following to clone and install:

```sh
# By convention at Gab, we work in ~/projects
mkdir -p ~/projects
cd ~/projects

# Clone the Gab Social repository into ~/projects
git clone https://code.gab.com/gab/social/gab-social gab-social

# Hop into the project directory (all are welcome!)
cd ~/projects/gab-social

# Install bundler
gem install bundler

# Use bundler to install the rest of the Ruby dependencies
bundle install

# Use yarn to install node.js dependencies
yarn install --pure-lockfile

# To setup the `gabsocial_development` database, run:
bundle exec rails db:setup

# Use foreman to start things up
gem install foreman
foreman start
```

At this point, you should be able to open `http://localhost:3000` in your browser and log in using the default credentials `admin@localhost:3000` and password `administrator`.

Some additional useful commands:

```sh
# pre-compile the front-end assets and fun stuff
bin/rails assets:precompile

# manually start the webpack dev server
./bin/webpack-dev-server

# You can then run Gab Social with:
bundle exec rails server
```

## Managing your development environment

It is assumed that development hosts are not publicly accessible. For best security, there should be no route from a public network to your Gab Social development workstation.

By default, your development environment will have an admin account created for you to use - the email address will be `admin@YOURDOMAIN` (e.g. admin@localhost:3000) and the password will be `administrator`.

You can run tests with:

    rspec

You can check localization status with:

    i18n-tasks health

And update localization files after adding new strings with:

    yarn manage:translations

You can check code quality with:

    rubocop

## Federation development tips

Federation absolutely requires your Gab Social instance to have a domain name. If you want to operate a permanently-federated development server (Gab does), set up a [Gab Social](https://code.gab.com/gab/social/gab-social) instance with a domain, and update it against your development fork/branch while doing that development on your local workstation or as a team.

To test federation on a *local* developer workstation, localhost =&gt; world tunneling can be made possible yourself on a domain you manage or by using services like [ngrok](https://ngrok.com).

Ngrok and similar services give you a random domain on each start up and iteration of your development build. This is good enough to test how the code you're working on handles real-world situations. But, your instance domain name is unique every time you run it.

For managing a production server, a service like Ngrok is the definition of Doing It Wrong&trade;.

### Federation tips

Generally, federation is tricky to work on because it's hard to test. When you are testing with a disposable instance, you are polluting the database of the real server(s) you are testing against.

It is possible to use Ngrok for one session, record the exchanges from its web interface, and use that data to create fixtures and build test suites. From then on, the developer can continue working against the tests instead of live servers.

Study the code and RFCs before implementing federation features or changes.

### Remote Development

If the development environment is running remotely, setting the `REMOTE_DEV` environment variable will instruct your instance to use "letter opener web"

Letter Opener launches a local browser. Letter Opener Web collects emails and displays them at /letter_opener.