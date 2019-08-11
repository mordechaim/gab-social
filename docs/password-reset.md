# Manually Resetting a User's Password

Open a shell in your instance's environment and start an interactive Ruby
interpreter:

```sh
cd ~/live
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