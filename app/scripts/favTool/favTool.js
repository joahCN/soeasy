var SoeasyModule = function($){
    var self = this;
    var domain = "http://wx.xcjx.org";
    var wrapperContainerId = "soeasy-favTool-container";
    var collectContainerId = "soeasy-favTool-container-content-collect";
    var loginContainerId = "soeasy-favTool-container-content-login";
    var userFolder = [
        {
            id: 1,
            name: '秋天的云'
        },
        {
            id: 2,
            name: '冬天的雪'
        },
        {
            id: 3,
            name: '夏天的凉风'
        },
        {
            id: 4,
            parentId: 1,
            name: '秋天的云1'
        },
        {
            id: 5,
            parentId: 1,
            name: '秋天的云2'
        },
        {
            id: 6,
            parentId: 1,
            name: '秋天的云3'
        },
        {
            id: 7,
            parentId: 2,
            name: '冬天的雪1'
        },
        {
            id: 8,
            parentId: 3,
            name: '夏天的凉风1'
        },
        {
            id: 9,
            parentId: 8,
            name: '夏天的凉风1'
        },
        {
            id: 10,
            parentId: 8,
            name: '夏天的凉风1'
        },
        {
            id: 11,
            parentId: 10,
            name: '夏天的凉风11'
        },
        {
            id: 12,
            parentId: 10,
            name: '夏天的凉风11'
        }

    ];
    var siteData = {}, loginData = {};
    var userInfo;
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
              showFolders();
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
                link = window.location.href;
            if(isEmpty(title)){
                $("#soeasy_title").addClass("soeasy_input_warning");
                return;
            }
            if(isEmpty(label)){
                $("#soeasy_label").addClass("soeasy_input_warning");
                return;
            }
            if(!siteData.fid){
                $("#selectFolders").addClass("soeasy_bg_warning");
                return;
            }

            siteData.title = encodeData(title);
            siteData.label = encodeData(label);
            siteData.link = encodeData(link);
            saveSiteData();
        });
    };

    function isEmpty(value){
        return !!(value == null || value == "");
    }

    function showFolders(id, position){
        var folders = filterFolder(id);
        createNode(folders, position);
    }

    function createNode(folders, position){
        var nodes = [];
        var ul = document.createElement("ul");
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
                left: targetPosition.left + parentPosition.left + $(parent).width()
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

