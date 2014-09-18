'use strict';

define(['appModule','directive/valueEqual','directive/ensureUnique','service/loginService'], function(module){
    module.register.controller("registController", ['$scope','loginService','$location','$upload',function($scope, loginService, $location, $upload){

        initUserModel();
        registUserAction();

        var registUser;

        function initUserModel(){
            $scope.user = {};
            $scope.isFirstStep = true;
            $scope.isSecondStep = false;
        }

        function registUserAction(){
            $scope.registUser = function(){
                loginService.registUser($scope.user, function(result){
                    $scope.isFirstStep = false;
                    $scope.isSecondStep = true;
                    registUser = result.results;
//                    var uid = result.results.id;
//                    $location.path("/userProfile/"+uid);
                });
            };

            $scope.onFileSelect = function($files) {
                    //$files: an array of files selected, each file has name, size, and type.
                loginService.uploadFile({
                    file: $files[0],
                    name: 'newGuy',
                    progressCallback: function(evt){
                        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                    },
                    successCallback: function(data, status, headers, config){
                        console.log(data);
                        if(data.status.success){
                            $location.path("/userProfile/"+registUser.id);
                        } else {
                            $scope.uploadError = true;
                        }

                    }
                });
            }
        }

    }]);
});
