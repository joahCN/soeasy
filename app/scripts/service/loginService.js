'use strict';

define(['require'], function(require){
    return function(){
        var module = require("appModule");
        module.factory('loginService', ['networkService','$rootScope','$cookieStore','storageService', function(networkService, $rootScope, $cookieStore, storageService){

            return {
                isLogin: function(callback){
                    var userId = storageService.getItem("userId");
                    networkService.getData({
                        url: 'isLogin',
                        params: {
                            userId: userId
                        },
                        callback: function(results){
                            if(results.status.success){
                                $cookieStore.put("jsessionid",results.jsessionid);
                                storageService.addItem("userId", results.results.id);
                            } else {
                                $cookieStore.remove("jsessionid");
                            }
                            callback(results);
                        }
                    });
                },
                userLogin: function(params, callback){
                    networkService.getData({
                        url: 'userLogin',
                        params: {
                            name: params.name,
                            password: params.password
                        },
                        callback: function(results){
                            if(results.status.success){
                                $cookieStore.put("jsessionid",results.jsessionid);
                                if(params.isCheck){
//                                    $cookieStore.put("userId",results.results.id);
                                    storageService.addItem("userId", results.results.id);
                                }
                            }
                            callback(results);
                        }
                    });
                },
                logout: function(callback){
                    networkService.getData({
                        url: 'logout',
                        callback: function(){
                            $cookieStore.remove("jsessionid");
                            $cookieStore.remove("userId");
                            storageService.removeItem("userId");
                            callback && callback();
                        }
                    });
                },
                registUser: function(params, callback){
                    networkService.getData({
                        url: 'registUser',
                        params: {
                            name: params.name,
                            password: params.password
                        },
                        callback: function(results){
                            if(results.status.success){
                                $cookieStore.put("jsessionid",results.jsessionid);
                                $rootScope.loginUser = results.results;
                                storageService.addItem("userId", results.results.id);
                            }
                            callback(results);
                        }
                    });
                },
                uploadFile: function(options){
                    networkService.uploadFile({
                        url: 'uploadFile',
                        name: options.name,
                        file: options.file,
                        progressCallback: options.progressCallback,
                        successCallback: options.successCallback
                    });
                }
            }
        }])
    }
});
