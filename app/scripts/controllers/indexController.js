'use strict';

define(['appModule','service/indexService','service/constantService'], function(module){
    module.register.controller('indexController', ['$scope', 'indexService', '$location','constantService',function($scope, indexService, $location, constantService){

        var categoryObj = {
            category: "",
            page: 1,
            start: 0,
            isEnd: false
        };
        var DEFAULT_ITEMS_COUNT = 5;

        initScope();
        queryCategoryData();
        queryCategories();

        function initScope(){
            $scope.items = [];
            $scope.users = [];
            $scope.filterCategory = function(category){
                $scope.searchKey = "";
                $scope.searchCategory = category;
                categoryObj.category = category.id;
                categoryObj.isEnd = category.isEnd || false;
                var initCount = 0;
                categoryObj.start = 0;
                $scope.items.forEach(function(item){
                    if(item.category == category.id){
                        initCount ++;
                        categoryObj.start++;
                    }
                });
                if(initCount < DEFAULT_ITEMS_COUNT){
                    queryCategoryData();
                }
            };

            $scope.loadMoreItems = function(){
//                if(!categoryObj.category) {
//                    categoryObj.page ++;
//                } else {
//                    $scope.categories.some(function(cg){
//                        if(cg.id == categoryObj.category){
//                            cg.page = cg.page || 1;
//                            categoryObj.page = cg.page;
//                            cg.page ++;
//                            return true;
//                        }
//                    });
//                }
                categoryObj.start = 0;
                if(categoryObj.category){
                    $scope.items.forEach(function(item){
                        if(item.category == categoryObj.category){
                            categoryObj.start ++;
                        }
                    });
                } else {
                    categoryObj.start = $scope.items.length;
                }

                queryCategoryData();
            };

            $scope.isLoadMore = function(){
                return categoryObj.isEnd;
            };

            $scope.searchKey = null;

            $scope.loadKeyItems = function(isGlobal){
                categoryObj.searchKey = $scope.searchKey;
                categoryObj.category = (isGlobal || !$scope.searchCategory) ? "" : $scope.searchCategory.id;
                queryCategoryData();
            };

            $scope.getUserInfo = function(item, scope){
                var uid = item.userIds[0];
                var cuser;
                $scope.users.some(function(user){
                    if(user.id == uid){
                        cuser = user;
                        return true;
                    }
                });
                scope.user = cuser;
                return cuser;
            };

            $scope.getLabels = function(label){
                if(!label){
                    return null;
                }
                return label.split(/\s+/);
            };

            $scope.filterCategoryCss = function(cid){
                return constantService.categoryCss[cid];
            }

        }

        function queryCategoryData(){
            indexService.queryCategoryItems(categoryObj, function(result){
                var items = result.results.items;
                var users = result.results.users;
                $scope.users = $scope.users.concat(users);
                $scope.items = $scope.items.concat(items);
                if(items.length < DEFAULT_ITEMS_COUNT){
                    if(categoryObj.category){
                        $scope.categories.some(function(cg){
                            if(cg.id == categoryObj.category){
                                cg.isEnd = true;
                            }
                        });
                    }
                    categoryObj.isEnd = true;
                }
            })
        }

        function queryCategories(){
            indexService.queryCategory(function(result){
                $scope.categories = result.results;
            });
        }


    }])
});
