var SoeasyModule = function($){
    var self = this;
    var domain = "http://wx.xcjx.org";
    var wrapperContainerId = "soeasy-favTool-container";
    var collectContainerId = "soeasy-favTool-container-content-collect";
    var loginContainerId = "soeasy-favTool-container-content-login";
    var userFolder = [];
    var siteData = {}, loginData = {};
    var userInfo;
    var isAddNewFolder;
    var itemSize = {
        width: 100,
        height: 30
    };
    var container;
    self.loadData = function(){
        checkLogin();
    };

    function getUserFolders(){
        $.ajax({
            url: domain + '/getFoldersForTool/001',
//            data: {
//                userId: "001"
//            },
            dataType: "jsonp",
            jsonp: 'getUserFolders',
            timeout: 20000
        }).
            then(
            function(data){
                userFolder = data;
                self.initFolders();
            }
        )
    }

    function checkLogin(){
        $.ajax({
            url: domain + '/checkLoginForTool',
            data: siteData,
            dataType: "jsonp",
            jsonp: 'isLogin',
            timeout: 20000
        }).
            then(
            function(data){
                loginCallback(data);
                $("#soeasy_login").on("click", function(){
                    loginData.name = encodeData($("#soeasy_name").val());
                    loginData.password = encodeData($("#soeasy_password").val());
                    userLogin();
                });
//                if(data.success === false){
//
//                }
            }
        )
    }

    function userLogin(){
        $.ajax({
            url: domain + '/loginForTool',
            data: loginData,
            dataType: "jsonp",
            jsonp: 'login',
            timeout: 20000
        }).
            then(
            function(data){
                loginCallback(data, true);
            }
        )
    }

    function loginCallback(data, isSubmitLogin){
        if(data.success === false){
            $("#" + collectContainerId).addClass("soeasy-favTool-hide");
            $("#" + loginContainerId).removeClass("soeasy-favTool-hide");
            isSubmitLogin && $("#soeasy-favTool-login-tip").removeClass("soeasy-favTool-hide");
        } else {
            userInfo = data.user;
            userFolder = data.folders;
            self.initFolders();
            $("#" + collectContainerId).removeClass("soeasy-favTool-hide");
            $("#" + loginContainerId).addClass("soeasy-favTool-hide");
        }
    }

    self.initFolders = function(){
      container = $("#soeasy_category");
      $("#selectFolders").on("mouseover", function(){
          if(container.children().length == 0){
              showFolders("", {top: 9});
          } else {
              container.empty();
          }
      });
        $("#soeasy_category").on("mousemove", function(event){
            var target = event.target;
            if(container.find(target).length == 0){
                container.empty();
            }
        });

        $("#soeasy_title").val(document.title);

        $("#soeasy-collect").on("click", function(){
            var title = $.trim($("#soeasy_title").val()),
                label = $.trim($("#soeasy_label").val()),
                folderName = $.trim($("#soeasy_forderName").val());
                link = window.location.href;
            if(isEmpty(title)){
                $("#soeasy_title").addClass("soeasy_input_warning");
                return;
            }
            if(isEmpty(label)){
                $("#soeasy_label").addClass("soeasy_input_warning");
                return;
            }
            if(!siteData.fid && !isAddNewFolder){
                $("#selectFolders").addClass("soeasy_bg_warning");
                return;
            }
            if(isAddNewFolder){
                if(isEmpty(folderName)){
                    $("#soeasy_forderName").addClass("soeasy_bg_warning");
                    return;
                } else {
                    siteData.folderName = encodeData(folderName);
                }
            }

            siteData.title = encodeData(title);
            siteData.label = encodeData(label);
            siteData.link = encodeData(link);
            saveSiteData();
        });
        $("#soeasy-addNewFolder").on("click", function(){
            $("#soeasy-favTool-newFolder").show();
            $("#soeasy-cancelNewFolder").show();
            $(this).hide();
            isAddNewFolder = true;
            $("#selectFolders").text("请选择父分类");
            userFolder.unshift({
                name: '根目录',
                id : ''
            });
        });
        $("#soeasy-cancelNewFolder").on("click", function(){
            $("#soeasy-favTool-newFolder").hide();
            $("#soeasy-addNewFolder").show();
            $(this).hide();
            isAddNewFolder = false;
            $("#selectFolders").text("请选择分类");
            userFolder.shift();
        });
    };

    function isEmpty(value){
        return !!(value == null || value == "");
    }

    function showFolders(id, position){
        var folders = filterFolder(id);
        folders && folders.length> 0 && createNode(folders, position);
    }

    function createNode(folders, position){
        var nodes = [];
        var ul = document.createElement("ul");
        var gap = 9;
//        nodes.push("<ul>");

        folders.forEach(function(folder){
            var li = document.createElement("li");
            li.innerText = folder.name;
            $(li).data("folder", folder);
            $(li).on("click", function(){
                var folder = $(this).data("folder");
                $("#selectFolders").text(folder.name);
                siteData.fid = folder.id;
                siteData.category = folder.category;
                container.empty();
            });
            ul.appendChild(li);
//            nodes.push("<li>"+folder.name+"</li>");
        });
        $(ul).on("mouseover", function(event){
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
//            position.left += $(target).width();
            id && showFolders(id, position);
        });
        $(ul).on("mouseout", function(event){
            var target = event.target;
//            if(container.find(target).length == 0){
//                container.empty();
//            }
        });
//        nodes.push("</ul>");
        container.append(ul);
        var ulPos = $(ul).position();
        var ulNodeWidth = $(ul).width();
        $(ul).css({
            width: ulNodeWidth+1, //fixed IE bug
            height: itemSize.height*folders.length
        });
        if(position){
            $(ul).css({
                left: position.left,
                top: position.top
            });
//            $(ul).css("top",position.top-ulPos.top);
        }

    }
    function filterFolder(parentId){
        return userFolder.filter(function(folder){
            return parentId ? folder.parentId == parentId : !folder.parentId;
        });
    }

    function saveSiteData(){
        $.ajax({
            url: domain + '/collectSite',
            data: siteData,
            dataType: "jsonp",
            jsonp: 'saveSite',
            timeout: 20000
        }).
            then(
            function(data){
                $("#soeasy-collect-result").removeClass("soeasy-favTool-hide");
                setTimeout(closeCollectPanel,1500);

                function closeCollectPanel(){
                    $("#"+wrapperContainerId).remove();
                }

            }
        )
    }

    function encodeData(data){
        return encodeURI((data));
    }

    return self;
};

