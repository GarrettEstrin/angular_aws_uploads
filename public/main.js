var uploadApp = angular.module('uploadApp', [])
  .controller('awsUploadsController', awsUploadsController)
// awsUploadsController.$inject = []

function awsUploadsController(){
  // log to insure controller is being loaded
  console.log('awsUploadsController instantiated');

  var vm = this


      // Function to carry out the actual PUT request to S3 using the signed request from the app.

   // If there is a file selected, then start upload procedure by asking for a signed request from the app.

      vm.initUpload = function(){
        var files = document.getElementById('file-input').files;
        file = files[0];
        if(file == null){
          return alert('No file selected.');
        }
        vm.getSignedRequest(file);
      }


        // Function to get the temporary signed request from the app.
        // If request successful, continue to upload the file using this signed request.

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


    vm.uploadFile = function (file, signedRequest, url){
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

}
