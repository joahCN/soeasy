'use strict';

define(['appModule','service/loginService'], function(module){
    module.register.controller('loginController', ['$scope', 'loginService', '$location', '$rootScope','$cookieStore',function($scope, loginService, $location, $rootScope, $cookieStore){
        $scope.loginInfo = {};
        $scope.isLoginError = false;
        $scope.login = function(userInfo){
            loginService.userLogin(userInfo, function(results){
                if(results.status.success){
                    var userProfile = results.results;
                    $rootScope.loginUser = userProfile;
                    $location.path("/userProfile/"+userProfile.id);
                } else {
                    $scope.isLoginError = true;
                }
            });
        };

    }])
});
