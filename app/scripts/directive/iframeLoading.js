'use strict'

define(['appModule'], function(module){
   module.register.directive("iframeLoading", ["$rootScope", function($rootScope){
       return {
           restrict: 'A',
           scope: {
             loadUrl: '='
           },
           link: function(scope, element){
               var oldDoc;
               element.on("load", function(){
                   scope.$apply(function(){
//                       if(oldDoc == element.document){
//                           console.log("doc changed");
//                       }
                       $rootScope.isRequestInProgress = false;
                   });
               });
               element.onreadystatechange = function(){
                   if(!this.readyState||this.readyState=='loaded'||this.readyState=='complete'){
                       scope.$apply(function(){
                           $rootScope.isRequestInProgress = false;
                       });
                   }
               };

               scope.$watch("loadUrl",function(newValue, oldValue){
//                   oldDoc = element.document;
                   if(newValue !== oldValue){
                       $(element).empty();
                       $rootScope.isRequestInProgress = true;
                   }
               });
           }
       }
   }]);
});