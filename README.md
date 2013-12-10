lbcollect_nodejs
================
Install Nodejs
	http://nodejs.org/
	
Install Express
	npm install -g express
	
Checkout project from git path:
	https://github.com/daitlq/lbcollection_nodejs.git
	
Install module for project
	npm install
	
Install nodemon
	npm install -g nodemon
	
Install MongoDB
	http://www.mongodb.org/downloads
	
Extract to folder
	C:\DevTools\

Create folder data in mongodb

Run command line with Administration and run
	C:\Windows\system32>c:\DevTools\mongodb\bin\mongod.exe --install --logpath c:\DevTools\mongodb\log.txt --dbpath c:\DevTools\mongodb\data
	
Start mongoDB
	C:\Windows\system32>net start mongodb
	
Run project
	nodemon app.js