"use strict";

define(["appModule"], function(module){
    module.register.directive("ensureUnique", ["networkService", function(networkService){

        return {
            require: 'ngModel',
            link: function(scope, ele, attrs, c){
                $(ele).on("blur", function(){
                    if(!attrs.ensureUnique){
                        c.$setValidity('unique', true);
                        return;
                    }
                    networkService.getData({
                        url: 'isUserNameExist',
                        params: {
                            name: attrs.ensureUnique
                        },
                        callback: function(result){
                            c.$setValidity('unique', !result.results);
                        }
                    });
                });
//                scope.$watch(attrs.ngModel, function(){
//
//                });
            }
        }

    }]);
});
