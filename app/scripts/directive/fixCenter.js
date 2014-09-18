'use strict';

define(['require'], function(require){
    return function(){
        var module = require("appModule");
        module.directive("loadingArea", function(){
            return function(scope, iElement, iAttrs){
                var dWidth = $(document).width();
                var dHeight = $(document).height();
                var eWidth = $(iElement).width();
                var eHeight = $(iElement).height();
                $(iElement).css({
                    top: (dHeight-eHeight)/2,
                    left: (dWidth-eWidth)/2
                });
//                scope.$digest();
            }
        });
    }
});
