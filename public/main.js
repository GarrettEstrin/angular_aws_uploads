var uploadApp = angular.module('uploadApp', [])
  .controller('awsUploadsController', awsUploadsController)
// awsUploadsController.$inject = []

function awsUploadsController(){
  console.log('awsUploadsController instantiated');
}
