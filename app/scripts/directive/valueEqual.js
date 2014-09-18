"use strict";

define(["appModule",'service/indexService'], function(module){
    module.register.directive("valueEqual", function(){
        return {
            scope: {
                user: "="
            },
            require: 'ngModel',
            link: function(scope, ele, attrs, c){
                var user = scope.user;
//                scope.$watch('user', function(newValue){
//                    user = newValue;
//                });
                $(ele).on('blur', function(){
                    scope.$apply(function(){
                        c.$setValidity('notEqual', user.password === user.password1);
                    })
                });
                $(ele).on('input', function(){
                    scope.$apply(function(){
                        c.$setValidity('notEqual', user.password === $(ele).val());
                    })
                });
            }
        };
    });
});
