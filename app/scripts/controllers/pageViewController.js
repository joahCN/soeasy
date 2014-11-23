'use strict';

define(['appModule','service/indexService','service/userProfileService','directive/folderTree', 'directive/iframeLoading', 'directive/loginFilter', 'directive/triggerEvent'], function(module){
    module.register.controller('pageViewController', ['$scope','$routeParams','indexService','userProfileService','storageService',
        function($scope,$routeParams,indexService,userProfileService, storageService){
            var moduleId = $routeParams.moduleId;
            var pageId = $routeParams.pageId;
            var userId = storageService.getItem("userId");

//            var page = indexService.getPage(pageId);
            var folderItems, currentIndex;

            getSelectPage();
            function getSelectPage(){
                if(!folderItems){
                    userProfileService.getFolderItems(moduleId, function(results){
                        folderItems = results.results;
                        filterPage();
                    });
                } else {
                    filterPage();
                }

                function filterPage(){
                    folderItems.some(function(item){
                        if(item.id == pageId){
                            $scope.page = item;
                            initCollectModel(angular.copy(item));
                            currentIndex = folderItems.indexOf(item);
                            return true;
                        }
                        return false;
                    });
                }
            }

            getFolderInfo();
            function getFolderInfo(){
                userProfileService.getUserFolder(moduleId, function(results){
                    $scope.folder = results.results;
                })
            }

//            $scope.page = page;
            $scope.showNext = function(){
                var nextIndex = (currentIndex+1 == folderItems.length) ? 0 : currentIndex +1;
                $scope.page = folderItems[nextIndex];
                currentIndex = nextIndex;
            };
            $scope.showPre = function(){
                var preIndex = (currentIndex-1) ? currentIndex-1 : (folderItems.length-1);
                $scope.page = folderItems[preIndex];
                currentIndex = preIndex;
            };

            renderCollectPanel();
            function renderCollectPanel(){

//                initCollectModel();
                loadUserFolders();
                submitCollect();

                function loadUserFolders(){
                    userProfileService.getUserFolders(userId, function(result){
                        $scope.userFolders = result.results.folders;
                    });
                }

                function submitCollect(){
                    $scope.submitCollection = function(){
                        if(!$scope.collectModel.folder.id){
                            $scope.isCollectFolderEmpty = true;
                            return false;
                        }
                        var collectItem = {
                            fid: $scope.collectModel.folder.id,
                            title: encodeURI($scope.collectModel.item.title),
                            label: encodeURI($scope.collectModel.item.label),
                            link: encodeURI($scope.collectModel.item.link)
                        };
                        userProfileService.collectUserSite(collectItem, function(){
                            $scope.showSelectedPanel("opResult");
                        })
                    }
                }


            }
            function initCollectModel(item){
                $scope.collectModel = {};
                $scope.collectModel.folder = {};
                $scope.collectModel.item = item;
                $scope.isCollectFolderEmpty = false;
            }

            $scope.panelStatus = {
                content : true,
                collect : false,
                opResult: false
            };
            $scope.showSelectedPanel = function(panel){
                for(var status in $scope.panelStatus){
                    if($scope.panelStatus.hasOwnProperty(status)){
                        $scope.panelStatus[status] = false;
                    }
                }
                $scope.panelStatus[panel] = true;
            };
            $scope.isCollectionFoldersShow = false;
            $scope.collectFocus = function(){
                $scope.collectionFolders = indexService.getCollectionFolder();
                $scope.isCollectionFoldersShow = true;
            };
            $scope.isFocusOnFolders = false;
            $scope.collectBlur = function(){
                $scope.isCollectionFoldersShow = $scope.isFocusOnFolders ||false;
            };
            $scope.selectFolder = function(folder){
                $scope.selectedFolder = folder;
                $scope.isCollectionFoldersShow = false;
            };
            $scope.setFocusOnFolder = function(isFocus){
                $scope.isFocusOnFolders = isFocus;
            };
            $scope.setOperatorContainerShow = function(isShow){
                $scope.isOperatorContainerShow = isShow;
            };
            $scope.likeSite = function(site){
                if(site.isLiked){
                    return;
                }
                userProfileService.likeSite(site.id, function(){

                });
                site.likeAmount ++;
                site.isLiked = true;
            };

            $scope.registerEvents = {
                'loadPending': 'mouseover',
                'loadComplete': 'mouseout'
            };

    }])
});
