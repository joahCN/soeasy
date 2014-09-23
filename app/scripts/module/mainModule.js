define(['angular','angular-route', 'provider/routeResolver', 'angular-resource','angular-cookies', 'angular.fileUpload'], function(angular){
   var module = angular.module('mainModule', ['ngRoute', 'ngResource','routeResolverServices','ngCookies','angularFileUpload']);
    module.config(['$routeProvider', 'routeResolverProvider','$controllerProvider', '$compileProvider','$filterProvider','$provide','$sceProvider',
    function($routeProvider, routeResolverProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $sceProvider){
        module.register = {
            controller: $controllerProvider.register,
            directive: $compileProvider.directive,
            filter: $filterProvider.register,
            factory: $provide.factory,
            service: $provide.service,
            provider: $provide.provider
        };
        var route = routeResolverProvider.route;

        $sceProvider.enabled(false);

        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|javascript):/);

        $routeProvider.when('/', route.resolve('index'))
            .when('/detail',route.resolve('detail'))
            .when('/clipImg',route.resolve('clipImg'))
            .when('/pageView/:moduleId/:pageId',route.resolve('pageView'))
            .when('/userProfile/:userId',route.resolve('userProfile'))
            .when('/login', route.resolve('login'))
            .when('/installTool', route.resolve('installTool'))
            .when('/regist', route.resolve('regist'));

    }]).run(['loginService','$rootScope','$location',function(loginService, $rootScope, $location){
            loginService.isLogin(function(result){
                if(result.status.success){
                    $rootScope.loginUser = result.results;
                }
            });
            $rootScope.logout = function(){
                loginService.logout(function(){
                    $rootScope.loginUser = null;
                    $location.refresh();
                });
            };
            $rootScope.goto = function(path){
                $location.path(path);
            }
        }]);
    return module;
});
