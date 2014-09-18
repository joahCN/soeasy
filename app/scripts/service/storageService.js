'use strict';

define(['require','jquery.cookie'], function(require){
    return function(){
        var module = require("appModule");
        module.factory("storageService", function(){
            var storageConfig = {
                localStorage: {
                    addItem: function(name, value){
                        window.localStorage.setItem(name, JSON.stringify(value));
                    },
                    getItem: function(name){
                        return JSON.parse(window.localStorage.getItem(name)) ;
                    },
                    removeItem: function(name){
                        window.localStorage.removeItem(name);
                    }
                },
                cookieStorage: {
                    addItem: function(name, value, expire){
                        $.cookie(name, JSON.stringify(value),{expires: expire || 7});
                    },
                    getItem: function(name){
                        return JSON.parse($.cookie(name));
                    },
                    removeItem: function(name){
                        $.removeCookie(name);
                    }
                }
            };
            var storage = window.localStorage ? storageConfig.localStorage : storageConfig.cookieStorage;
            return {
                addItem: function(name, value, expire){
                    storage.addItem(name,value,expire);
                },
                getItem: function(name){
                    return storage.getItem(name);
                },
                removeItem: function(name){
                    return storage.removeItem(name);
                }
            }
        });
    }

});
