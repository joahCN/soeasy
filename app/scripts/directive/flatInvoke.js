'use strict';
define(['require'], function(require){
    return function(){
        var module = require("appModule");
        module.directive("flatInvoke", function(){
            return {
                restrict: "A",
                link: function(scope, ele, attrs) {
                    var action = attrs["flatInvoke"];
                    ele[action]();
//                ele.radiocheck();
                }
            }
        });
    }
});