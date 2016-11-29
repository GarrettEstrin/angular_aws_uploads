// Minimal setup for file uploads to AWS Buckets

const
  // Looks for PORT variable in environment variables if available and defaults to 3000 if environment variables are not available
  PORT = process.env.PORT || 3000

  // dependencies
  express = require('express'),
  app = express(),
  // Allows use of local .env file to load environment variables from
  path = require('path'),
  dotenv = require('dotenv').load({silent: true}),
  // Required to connect to AWS
  aws = require('aws-sdk')


  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'))
  })

app.use(express.static(path.join(__dirname, 'public')));

// AWS S3
const S3_BUCKET = process.env.S3_BUCKET;
/*
 * Respond to GET requests to /sign-s3.
 * Upon request, return JSON containing the temporarily-signed S3 request and
 * the anticipated URL of the image.
 */
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

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
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


// Command to listen on specified port for requests
app.listen(PORT, function() {
  console.log("Listening for requests on port:", PORT)
})
