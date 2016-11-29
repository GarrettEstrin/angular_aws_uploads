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

```
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
S3_BUCKET=your-bucketname
```

Notice that lack of spaces around the "="s.

The project is now ready to upload files to your AWS bucket.  The view is designed to work with pictures (it shows the picture when it is uploaded) but can be used for any files.

### Code Explanation

In the view, three elements exist: an image tag, with an id of 'preview', that initially shows a default image, an input tag with an id of 'file-input' and a button that initiates a function when it is pressed `ng-click="auc.initUpload()"`

After a file is selected in the view and the upload file button is clicked, a function called "initUpload" is initiated:

```javascript
vm.initUpload = function(){
  var files = document.getElementById('file-input').files;
  file = files[0];
  if(file == null){
    return alert('No file selected.');
  }
  vm.getSignedRequest(file);
}
```
This function gets the file from the file input by selecting the files, which returns an array and then selects the first item in the array:
```javascript
file = files[0]
```
It then checks if a file was selected and gives an alert if no file was selected:
```javascript
if(file == null){
  return alert('No file selected.');
}
```
This function contacts the server to generate the signed request required by AWS to upload to the bucket.
```javascript
vm.getSignedRequest = function (file){
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
  xhr.onreadystatechange = function(){
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        const response = JSON.parse(xhr.responseText);
        // Log of response from Bucket
        console.log("response:");
        console.log(response);
        vm.uploadFile(file, response.signedRequest, response.url);
      }
      else{
        alert('Could not get signed URL.');
      }
    }
  };
  xhr.send();
}
```
A get request is sent to /sign-s and sends the file-name and file-type in the url as parameters:
```javascript
xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
```
These are required by AWS to generate the signed-request.  If information from the file does not match the request generated, the file will not be uploaded.

This is the /sign-s3 route that is called by getSignedRequest function.  This route is defined on the server and is what generates the sign-request.
```javascript
app.get('/sign-s3', function(req, res){
  console.log("sign-s3 hit");
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, function(err, data){
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});
  ```
The file-name and file-type are set and combined into a new aws object called s3Params to be used to generate the request.

```javascript
const s3 = new aws.S3();
const fileName = req.query['file-name'];
const fileType = req.query['file-type'];
const s3Params = {
  Bucket: S3_BUCKET,
  Key: fileName,
  Expires: 60,
  ContentType: fileType,
  ACL: 'public-read'
};
```
The getSignedUrl method is called and the s3Params object is passed.  The response from this method is the signed request and is passed back to the getSignedRequest function in the client.
```javascript
s3.getSignedUrl('putObject', s3Params, function(err, data){
  if(err){
    console.log(err);
    return res.end();
  }
  const returnData = {
    signedRequest: data,
    url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
  };
  res.write(JSON.stringify(returnData));
  res.end();
});
```
Back in the clinet,
```javascript
vm.uploadFile = function(file, signedRequest, url){
  const xhr = new XMLHttpRequest();
  xhr.open('PUT', signedRequest);
  xhr.onreadystatechange = function(){
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        document.getElementById('preview').src = url;
      }
      else{
        alert('Could not upload file.');
      }
    }
  };
  xhr.send(file);
}
```
