define(['angular','angular-route', 'provider/routeResolver', 'angular-resource','angular-cookies', 'angular.fileUpload'], function(angular){
   var module = angular.module('mainModule', ['ngRoute', 'ngResource','routeResolverServices','ngCookies','angularFileUpload']);
    module.config(['$routeProvider', 'routeResolverProvider','$controllerProvider', '$compileProvider','$filterProvider','$provide','$sceProvider', '$locationProvider',
    function($routeProvider, routeResolverProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $sceProvider, $locationProvider){
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

//        $locationProvider.html5Mode(true);

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
            };
            $rootScope.requestCount = 0;
//            $rootScope.$on("routeChangeStart", function(){
//                $rootScope.requestCount = 0;
//                $rootScope.isRequestInProgress = false;
//            });
            var scrollFn = function(){};
            $rootScope.$on("scroll", function(event){
                scrollFn = event.targetScope.onScroll;
            });

            $(window).scroll(function(){
                var scrollTop = $(this).scrollTop();
                var scrollHeight = $(document).height();
                var windowHeight = $(this).height();
                if(scrollTop + windowHeight == scrollHeight){
                    $rootScope.$eval(scrollFn);
                }
            });

            $rootScope.$on("$locationChangeSuccess", function(){
                scrollFn = function(){};
                $rootScope.isFullContainer = false;
            });

            $rootScope.isFullContainer = false;


        }])
        .controller('mainController', function(){

        });
    return module;
});
