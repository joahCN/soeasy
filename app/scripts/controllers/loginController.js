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
                    var searches = $location.search().redirectUrl;
                    var redirectUrl = searches ? searches.redirectUrl : "";
                    $location.search("redirectUrl");
                    console.log("redirect url: " + redirectUrl);
                    var url = redirectUrl ? decodeURIComponent(redirectUrl) : ("/userProfile/"+userProfile.id);
                    $location.path(url);
                } else {
                    $scope.isLoginError = true;
                }
            });
        };

    }])
});
