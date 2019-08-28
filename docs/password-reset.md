# Manually Setting a User's Password

There just isn't an Admin web interface for setting a user's password. You can reset a password and have the new one emailed to them by the system, but it's not possible to just directly set a user's login password using the Admin interface.

If you are operating in a production environment, you can attach to a running container and execute a Bash shell:

```sh
docker ps | grep live_web | awk '{ print $NF }'
```

This will output something like:

```sh
live_web_1
```

You can attach to that running container using:

```sh
docker exec -ti live_web_1 bash
```

## Set New User Password

Start an interactive Ruby interpreter:

```sh
bin/rails c
```


In the Ruby shell, you are going to load the account record, load the user
record for that account, change the password for the User object, and save the
User object.

```
account = Account.find_by(username: 'username')
user = User.find_by(account: account)
user.password = '[new password]'
user.save!
```

The `save!` call will email the user that their password has been changed, but
they won't know their new password. The new password will have to be
communicated to the user in some way.