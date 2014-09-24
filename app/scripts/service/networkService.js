'use strict';

define(['require'], function(require){
    return function(){
        var module = require("appModule");
        module.factory('networkService', ['$resource','$cacheFactory','$rootScope','$cookieStore','$upload', function($resource,$cacheFactory, $rootScope, $cookieStore, $upload){
            var baseURL = "http://wx.xcjx.org/";//"/";
            var timeout = 5000;
            var cacheId = "networkData";
            var cache = $cacheFactory(cacheId);
            var requestCount = $rootScope.requestCount || 0;
            var REQUEST_QUEUE_FINISH = "REQUEST_QUEUE_FINISH";
            $rootScope.isRequestInProgress = false;

            function transformRequest(data){
                if(angular.isObject(data)){
                    return $.param(data);
                } else {
                    return data;
                }
            }

            function generateBaseUrl(url){
                var jsessionid = $cookieStore.get("jsessionid");
                var baseUrl = baseURL + url;
                if(jsessionid){
                    baseUrl += ";jsessionid="+jsessionid;
                }
                return baseUrl;
            }

            return {
                getData : function(options){
                    requestCount ++;
                    $rootScope.isRequestInProgress = true;
                    var url = generateBaseUrl(options.url);
                    var params = options.params;
                    var callback = options.callback;
                    var data = options.data;
                    if(data){
                        url = url+"?"+$.param(data);
                    }
                    var resource = $resource(url, null, {
                            get: {
                                method: 'get',
                                cache: cache,
                                timeout: timeout
                            },
                            save: {
                                method: 'post',
                                cache: cache,
                                timeout: timeout,
                                transformRequest: transformRequest
                            }
                        }
                    );
                    resource.get(params, responseCallback);
//                    if(data){
//                        resource.save(params,data,responseCallback);
//                    } else {
//                        resource.get(params, responseCallback);
//                    }

                    function responseCallback(result){
                        requestCount--;
                        if(requestCount <= 0){
                            $rootScope.$emit(REQUEST_QUEUE_FINISH);
                            $rootScope.isRequestInProgress = false;
                        }
                        callback(result);
                    }

                },
                uploadFile: function(options){
                    var file = options.file;
                    var name = options.name;
                    var progressCallback = options.progressCallback;
                    var successCallback = options.successCallback;
                    var url = generateBaseUrl(options.url);

                    $upload.upload({
                        url: url,
                        method: 'POST',
                        //headers: {'header-key': 'header-value'},
                        //withCredentials: true,
                        data: {name: name},
                        file: file // or list of files ($files) for html5 only

                    }).progress(progressCallback).success(successCallback);
                },
                invalidateCache: function(url, params){
                    var regex = /(:[a-zA-Z]+)/g;
                    var results = url.match(regex);
                    results.forEach(function(matcher){
                        var key = matcher.substring(1);
                        url.replace(matcher,params.key);
                    });
                    cache.remove(url);
                }
            }
        }]);
    }

});
