'use strict'

define(['appModule'], function(module){
   module.register.directive("iframeLoading", ["$rootScope","$timeout", function($rootScope, $timeout){
       var EVENTS = {
           LOAD_PENDING: 'loadPending',
           LOAD_COMPLETE: 'loadComplete'
       };
       return {
           restrict: 'A',
           scope: {
             loadUrl: '='
           },
           link: function(scope, element){

               var windowH = $(window).height();
               var computedH = parseInt(windowH) - 117;
               var orgH =  $(element).css('height');
               $(element).css('height',parseInt(orgH) > computedH ? orgH : computedH);

               var oldDoc;
               element.on("load, DOMContentLoaded", function(){
                   scope.$apply(function(){
                       $rootScope.isRequestInProgress = false;
                       $rootScope.$broadcast(EVENTS.LOAD_COMPLETE);
                   });
               });
               element.onreadystatechange = function(){
                   if(!this.readyState||this.readyState=='loaded'||this.readyState=='complete'){
                       scope.$apply(function(){
                           $rootScope.isRequestInProgress = false;
                           $rootScope.$broadcast(EVENTS.LOAD_COMPLETE);
                       });
                   }
               };

               scope.$watch("loadUrl",function(newValue, oldValue){
//                   oldDoc = element.document;
                   if(newValue !== oldValue){
                       $(element).empty();
                       $rootScope.isRequestInProgress = true;
                       $timeout(function(){
                           $rootScope.isRequestInProgress = false;
                           $rootScope.$broadcast(EVENTS.LOAD_PENDING);
                       }, 4000);
                   }
               });
           }
       }
   }]);
});