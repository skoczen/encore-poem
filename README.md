Artechetype (terrible pun) is a grab-and-go starter django+js I use when making new digital projects.  You're welcome to as well, and if you come across improvements, pull requests are welcome.

NOTE: I'm still working on it. Don't use it quite yet.

Grab it and go
==============

1. Set up your new repo, say `github.com:myusername/mynewproject.git`

2. Clone artechetype into a local directory.
	
	```bash
	git clone git@github.com:skoczen/artechetype.git mynewproject.git
	```


3. Set `PROJECT_NAME`, `GITHUB_REPO` and any other env settings you need in `fabfile.py`

4. Set up the your virtualenv and remotes manually, or by using the fab helper command.
	
	```bash
	fab initial_setup
	```

5. You're set. 
	
	```bash
	cd project
	./manage.py runserver
	```



Deploying to Heroku, with AWS for static media
==============================================

I love heroku. It's easy, it scales well, and it takes care of most of the stuff I don't want to think about.  Here's how to get artechetype running on it:

Preparing
---------


1. Install the gem, if you don't already have it

	```gem install heroku```

2. Authenticate

	```heroku login```

3. Create the app
	
	```bash
	heroku create --stack cedar mynewproject
	```

3. I use this set of addons in almost every project

	```bash
heroku addons:add custom_domains:basic
heroku addons:add zerigo_dns:basic
heroku addons:add memcache:5mb
heroku addons:upgrade logging:expanded
heroku addons:add redistogo:nano
	```

4. Set up your domains

	```bash
	heroku domains:add www.mydomain.com
	heroku domains:add mydomain.com
	```

5. Set your keys

	* If you have a private repo, you can use `keys_and_passwords.py`.
	* If you have a public repo, you're best off setting them as environment variables in your deployment environment.  For example:

	```bash
	heroku config:add AWS_ACCESS_KEY_ID=foo-bar-1
	```

	* Keys you're likely want to set:
		```bash
		heroku config:add AWS_ACCESS_KEY_ID=foo`
		heroku config:add AWS_SECRET_ACCESS_KEY=bar
		heroku config:add AWS_STORAGE_BUCKET_NAME=myproject
		heroku config:add DB_PASSWORD=pass1234
		```
	* You can also set analytics settings.

Deploying
---------

* `fab deploy`

Note: If you haven't created the AWS bucket, simply running `./manage.py sync_static` will do it for you.