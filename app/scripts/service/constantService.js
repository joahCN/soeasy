'use strict';

define(['appModule'], function(module){
   module.register.factory("constantService", function(){
       return {
           categoryCss: {
               1: "youxi",
               2: "yinle",
               3: "xinwen",
               4: "yule",
               5: "tiyu",
               6: "keji",
               7: "qian",
               8: "junshi",
               9: "zhishi"
           }
       }
   })
});
