define(['appModule'], function(module){
   module.register.directive('triggerEvent', [function(){
       return {
           scope: {
             registerEvents: '='
           },
           link: function(scope, element, attrs){
               var events = scope.registerEvents;
               for(var event in events) {
                   if(events.hasOwnProperty(event)){
                       scope.$on(event, (function(_event){
                           return function(){
                               $(element).triggerHandler(_event);
                           };
                       })(events[event]));
                   }
               }
           }
       }
   }]);
});
