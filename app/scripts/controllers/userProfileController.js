'use strict';

define(['appModule','service/userProfileService'], function(module){
    module.register.controller('userProfileController', ['$scope','$routeParams','userProfileService','$q','$rootScope',
        function($scope,$routeParams,userProfileService, $q, $rootScope){
            var userId = $routeParams.userId;
            var events = {
                FOLDER_CHANGE: 'folderChange',
                SHOW_ITEMS: 'showItems',
                SHOW_ADD_FOLDER: 'showAddFolder'
            };
            var rootFolder = {
                name: '根目录',
                id : ''
            };
            var openedFolder, userFolders;

            initScopeVarible();

            loadUserFolders();

            getUserLatestItem();

            function initScopeVarible(){
                $scope.isAddFolderShow = false;
                $scope.isFolderItemsShow = true;
                $scope.isSubFolder = false;
                $scope.navFolder = {
                    name: '最新收藏'
                };
                $scope.openFolder = {
                    name: '最新收藏'
                };
                $scope.parentFolder = rootFolder;
            }

            function loadUserFolders(){
                userProfileService.getUserFolders(userId, function(results){
                    userFolders = results.results.folders;
                    $scope.user = results.results.user;
                    $scope.folders = userFolders.filter(function(item){
                        return !item.parentId;
                    });
                    $scope.folderDropdownList = angular.copy($scope.folders);
                    $scope.folderDropdownList.unshift(rootFolder);
                });
            }

            function getUserLatestItem(){
                userProfileService.getUserLatestItems(userId, function(results){
                    $scope.folderItems = results.results;
                    $scope.folderRootLinksCount = $scope.folderItems.length;
                });
            }

            $scope.isLogin = function(){
                return !!$rootScope.loginUser;
            };

            $scope.getLabels = function(label){
                if(!label){
                    return null;
                }
                return label.split(/\s+/);
            };

            $scope.getParentFolderItems = function(){
                getFolderItems($scope.parentFolder);
                $scope.navFolder = null;
                openedFolder && (openedFolder.isOpen = false);
                $scope.$emit(events.FOLDER_CHANGE, false);
            };

            $scope.openFolder = function(folder, isBack){
//                folder && ($scope.navFolder = folder);

                var getFolderItemsCallback = null;

                if(!folder || folder.subCount){
                    $scope.parentFolder = folder || rootFolder;
                    $scope.navFolder = null;
                    if(isBack){
                        $scope.inLeftAnimate = true;
                    } else {
                        $scope.outLeftAnimate = true;
                    }
//                    $("#folderPanel").on("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function(){
//                        $scope.$apply(showSubFolder);
//                    });
//                    $scope.folders = null;
                    $scope.subFolders = userFolders.filter(function(item){
                        return folder ? item.parentId == folder.id : !item.parentId;
                    });
                    showSubFolder();
                    getFolderItemsCallback = function(){
                        $scope.folderRootLinksCount = $scope.folderItems ? $scope.folderItems.length : 0;
                    }
                } else {
                    openedFolder && (openedFolder.isOpen = false);
                    folder.isOpen = true;
                    openedFolder = folder;
                    $scope.navFolder = folder
                }
                $scope.$emit(events.FOLDER_CHANGE, false);
                getFolderItems(folder, getFolderItemsCallback);

                function showSubFolder(){
                    $scope.folders = $scope.subFolders;
//                    $scope.folders.unshift($scope.parentFolder);
                    $scope.isSubFolder = folder && !!folder.subCount;
                    if(isBack){
                        $scope.inLeftAnimate = false;
                    } else {
                        $scope.outLeftAnimate = false;
                    }
                }

            };

            function getFolderItems(folder, callback){
                if(folder && folder.id){
                    var defer = $q.defer();
                    var promise = defer.promise;
                    userProfileService.getFolderItems(folder.id, function(results){
                        if(results.results && results.results.length > 0){
                            defer.resolve(results.results);
                        } else {
                            defer.reject();
                        }
                    });
                    promise.then(
                        function(items){
                            $scope.folderItems = items;
                        },
                        function(){
                            defer = $q.defer();
                            promise = defer.promise;
                            userProfileService.getFolderLatestItems(folder.id, function(results){
                                if(results.results && results.results.length > 0){
                                    $scope.folderItems = results.results;
                                } else {
                                    $scope.folderItems = null;
                                }
                                defer.resolve($scope.folderItems);
                            });
                            return promise;
                        }
                    ).finally(function(){
                            angular.isFunction(callback) && callback();
                        });
                } else {
                    userProfileService.getUserLatestItems(userId, function(results){
                        $scope.folderItems = results.results;
                        angular.isFunction(callback) && callback();
                    })
                }
            }

            $scope.backToParentFolder = function(){
                var parentId =  $scope.parentFolder.parentId;
                var backFolder;
                userFolders.some(function(item){
                    if(item.id == parentId){
                        backFolder = item;
                        return true;
                    }
                });
                $scope.openFolder(backFolder, true);
            };

            $scope.addFolder = function(){
                initNewFolder();
                $scope.folderDropdownList = angular.copy($scope.folders);
                $scope.folderDropdownList.unshift($scope.parentFolder);
                $scope.newFolder.parentId = $scope.parentFolder.id;
                $scope.$emit(events.FOLDER_CHANGE, true);
            };

            $scope.$on(events.FOLDER_CHANGE, function(event,type){
                $scope.isAddFolderShow = type;
                $scope.isFolderItemsShow = !type;
//                openedFolder && (openedFolder.isOpen = !type);
                event.preventDefault();
            });

            $scope.modifyFolder = function(folder){
                $scope.newFolder = folder;
                $scope.newFolder.headerText = "修改收藏夹";
                $scope.newFolder.actionText = "保 存";
                $scope.newFolder.isModify = true;
                $scope.$emit(events.FOLDER_CHANGE, true);
            };



            renderFolderOps();

            function renderFolderOps(){

                initNewFolder();
                queryCategory();

                $scope.checkFolderName = function(folderName, form){
                    var plainName = $.trim(folderName);
                    form.folderName.$error.duplicate = $scope.folders.some(function(folder){
                        return folder.name == plainName;
                    });
                };

                $scope.submitAddFolder = function(folder){
//                folder.parentId = $scope.parentFolder.id;
                    folder.uid = userId;
//                    $scope.newFolder.category = $scope.newFolder.category.join(",");
                    userProfileService.saveFolder(folder, function(result){
                        $scope.$emit(events.FOLDER_CHANGE, false);
//                    $scope.folders.push(result.results);
                        userFolders && userFolders.push(result.results);
                        var addParentFolder;
                        if(folder.parentId){
                            userFolders.forEach(function(ufolder){
                                if(ufolder.id == folder.parentId){
                                    ufolder.subCount ++;
                                    addParentFolder = ufolder;
                                }
                            });
                        } else {
                            $scope.folders.push(result.results);
                        }
                        addParentFolder && $scope.openFolder(addParentFolder);
                        initNewFolder();
                    })
                };



                function queryCategory(){
                    userProfileService.queryCategory(function(result){
                        $scope.categoryList = result.results;
//                        renderRadiocheck();
                    });
                }
                $scope.checkCategory = function (category, ele){
                    if($(ele).attr("checked")){
                        $scope.newFolder.category.push(category.id);
                    } else {
                        var index = $scope.newFolder.category.indexOf(category.id);
                        $scope.newFolder.category.splice(index,1);
                    }
                    $scope.selectedCategory = $scope.newFolder.category.length ? $scope.newFolder.category.join(",") : "";
                }

            }

            function initNewFolder(){
                $scope.newFolder = {};
                $scope.newFolder.security = 0;
                $scope.newFolder.category = "";
                $scope.newFolder.isModify = false;
                $scope.newFolder.headerText = "添加收藏夹";
                $scope.newFolder.actionText = "添 加";
                $scope.newFolder.parentId = "";
            }

            renderRadiocheck();
            function renderRadiocheck(){
                $('[data-toggle="radio"]').radiocheck();
            }






        }
    ]);
});
