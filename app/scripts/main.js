require.config({
    base: 'scripts',
    paths: {
        'angular': '/bower_components/angular/angular',
        'angular-route': '/bower_components/angular-route/angular-route',
        'angular-resource': '/bower_components/angular-resource/angular-resource',
        'angular-cookies': '/bower_components/angular-cookies/angular-cookies',
        'jquery' : '/bower_components/jquery/jquery.min',
        'appModule' : 'module/mainModule',
        'bootstrap' : '/bower_components/bootstrap/dist/js/bootstrap',
        'modernizr.custom':'/bower_components/jquery-plugins/jquery.gallery/js/modernizr.custom',
        'jquery.cookie' : '/bower_components/jquery.cookie/jquery.cookie',
        'angular.fileUpload': '/bower_components/ng-file-upload/angular-file-upload.min',
        'flat-ui': 'flat-ui'
    },
    shim: {
        'angular' : {
            exports: 'angular'
        },
        'angular-route': { deps: ['angular']},
        'angular-resource': {deps: ['angular']},
        'angular-cookies': {deps: ['angular']},
        'jquery.cookie' : {deps: ['jquery']},
        'angular.fileUpload': {deps: ['angular']},
        'flat-ui': {deps: ['jquery']}
    }
});

require(['jquery','angular','appModule', 'bootstrap','directive/fixCenter','service/networkService','service/loginService','service/storageService','flat-ui','directive/flatInvoke'], function($, angular, module, bootstrap, directive, service, loginService, storageService, flatUI, flatInvoke){
    $(function(){
        directive();
        flatInvoke();
        service();
        loginService();
        storageService();
        angular.bootstrap(document,['mainModule']);
    });
});