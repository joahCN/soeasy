'use strict';
define(['require'], function(require){
    return function(){
        var module = require("appModule");
        module.directive("flatInvoke", function(){
            return {
                restrict: "A",
                priority: 0,
                link: function(scope, ele, attrs) {
                    var action = attrs["flatInvoke"];
                    ele[action]();
                    scope.$on("folderDropdwonListChange", function(){
                        ele[action]();
                    });
//                ele.radiocheck();
                }
            }
        });
    }
});