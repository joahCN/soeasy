'use strict'

define(['appModule'], function(module){
   module.register.directive("loginFilter", ["storageService","$location", function(storageService, $location){
       return {
           restrict: "A",
           priority: 0,
           link: function(scope, element, attr){
               $(element).on("click", function(event){
                   var usrId = storageService.getItem("userId");
                   if(!usrId) {
                       event.preventDefault();
                       event.stopPropagation();
                       scope.$apply(function(){
                           $location.path("/login");
                       });
                   }
               });
               var handlers= $._data($(element)[0], 'events')['click'];
               var handler = handlers.pop();
               handlers.splice(0, 0, handler);

           }
       }
   }]);
});
