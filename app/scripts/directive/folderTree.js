'use strict'

define(['appModule'], function(module){
    module.register.directive("folderTree", [function(){
        return {
            restrict: 'A',
            scope: {
                folders: "=",
                selectedFolder: '='
            },
            template: '<div class="myFolderTree-foldersPanel"><span id="selectedFolderArea" class="glyphicon glyphicon-folder-close selectFolderBtn"><span style="padding-left: 5px;">请选择收藏夹</span></span><span class="label label-primary" style="margin-left: 10px;">{{selectedFolder.name}}</span><div id="myFolders" class="myFolderTree"></div></div>',
            link: function(scope, element, attr, ctrl){
                var userFolders = scope.folders;
                scope.$watch("folders", function(){
                    userFolders = scope.folders;
                });
//                scope.selectedFolder = {};

                var container = $("#myFolders");
                var itemSize = {
                    width: 100,
                    height: 30
                };

                $("#selectedFolderArea").on("mouseover", function(){
                    if(container.children().length == 0){
                        showFolders("", {top: 9});
                    } else {
                        container.empty();
                    }
                });

                function showFolders(id, position){
                    var folders = filterFolder(id);
                    folders && folders.length> 0 && createNode(folders, position);
                }

                function createNode(folders, position){
                    var ul = document.createElement("ul");
                    var gap = 9;

                    folders.forEach(function(folder){
                        var li = document.createElement("li");
                        li.innerText = folder.name;
                        $(li).data("folder", folder);
                        $(li).on("click", function(){
                            var folder = $(this).data("folder");
                            scope.$apply(function(){
                                scope.selectedFolder = folder;
                            });
//                            $("#selectFolders").text(folder.name);
//                            siteData.fid = folder.id;
                            container.empty();
                        });
                        ul.appendChild(li);
                    });
                    $(ul).on("mouseover", function(event){
                        event.preventDefault();
                        event.stopPropagation();
                        var target = event.target;
                        var id = $(target).data("folder").id;
                        var parent = target.parentNode;
                        $(parent).nextAll().remove();

                        var targetPosition = $(target).position();
                        var parentPosition = $(parent).position();
                        var position = {
                            top: targetPosition.top + parentPosition.top,
                            left: targetPosition.left + parentPosition.left + $(parent).width() + gap
                        };
                        id && showFolders(id, position);
                    });
                    container.append(ul);
                    var ulPos = $(ul).position();
                    var ulNodeWidth = $(ul).width();
//                    $(ul).css({
//                        width: ulNodeWidth,
//                        height: itemSize.height*folders.length
//                    });
                    if(position){
                        $(ul).css({
                            left: position.left,
                            top: position.top
                        });
                    }


                }
                function filterFolder(parentId){
                    return userFolders.filter(function(folder){
                        return parentId ? folder.parentId == parentId : !folder.parentId;
                    });
                }
            }
        }
    }]);
});
