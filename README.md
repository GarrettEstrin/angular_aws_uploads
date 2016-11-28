# AWS Photo Uploads Tutorial

## This tutorial shows you how to set up simple photo (file) uploads to Amazon Web Services Buckets using Node.JS and Angular.JS

### What you need to have set up before beginning:

* Node.JS installed on your system.  If you do not have it installed, install it here [Install Node.JS ](https://nodejs.org/en/ ) so that NPM will be installed with it.

* AWS bucket with your bucket name, AWS Access Key and AWS Secret Access Key readily available.

### installation

Download directory zip.

In the project directory, from the command line, execute the following code to install the required Node modules:

`npm install`

Create a file called ".env" (without the quotes).  If you are going to upload this project to GitHub, make sure that you add this file to the .gitignore file so that it does not get uploaded. It will contain the information for access to your AWS Bucket.

In the ".env" file, add the following information exactly as shown:

`AWS_ACCESS_KEY_ID=your-aws-access-key`

`AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key`

`S3_BUCKET=your-bucketname`

Notice that lack of spaces around the "="s.
