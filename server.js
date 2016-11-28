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

// Command to listen on specified port for requests
app.listen(PORT, function() {
  console.log("Listening for requests on port:", PORT)
})
