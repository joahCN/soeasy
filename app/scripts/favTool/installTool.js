(function(){
    var isJQInstall, isSOSInstall, isHtmlReady;
    var isDebugger = true;
    var sosUrl,jqsUrl,cssUrl;
    var domain = "http://wx.xcjx.org";
    if(isDebugger){
        sosUrl = domain + "/scripts/favTool/build.js";
        jqsUrl = "http://code.jquery.com/jquery-1.11.1.min.js";
        cssUrl = domain + "/scripts/favTool/favTool.css";
    } else {
        sosUrl = domain + "/scripts/favTool/dist/build.min.js";
        jqsUrl = "http://code.jquery.com/jquery-1.11.1.min.js";
        cssUrl = domain + "/scripts/favTool/dist/favTool.min.css";
    }

    loadData();

    function loadData(){
        var head = document.getElementsByTagName('head').item(0);

        loadCSS();
        loadJQuery();
        loadSoScript();

        function loadCSS(){
            var link = document.createElement('link');
            link.href = cssUrl;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            head.appendChild(link);
        }


        function loadJQuery(){
            var jquery = window.jQuery;

            var jqScript = document.createElement("script");
            jqScript.onload = jqScript.onreadystatechange = function(){
                if(!this.readyState||this.readyState=='loaded'||this.readyState=='complete'){
                    isJQInstall = true;
                    if(isSOSInstall){
                        initTool();
                    }
                }
            };
            jqScript.src = jqsUrl;
            head.appendChild(jqScript);

//            if(!jquery || !jquery.ajax){
//
//            } else {
//                isJQInstall = true;
//            }
        }

        function loadSoScript(){
            var soScript = document.createElement("script");

            soScript.onload = soScript.onreadystatechange = function(){
                if(!this.readyState||this.readyState=='loaded'||this.readyState=='complete'){
                    isSOSInstall = true;
                    var toolContainer = document.createElement("div");
                    toolContainer.innerHTML = SoeasyModule.html;
                    document.body.appendChild(toolContainer);
                    if(isJQInstall){
                        initTool();
                    }
                }
            };
            soScript.charset = "UTF-8";
            soScript.src = sosUrl;
            head.appendChild(soScript);
        }

        function initTool(){
            new SoeasyModule(jQuery).loadData();
        }

//        function loadHtmlData(jq){
//            jq.get(htmlUrl, function(data){
//                var toolContainer = document.createElement("div");
//                toolContainer.innerHTML = data;
//                isHtmlReady = true;
//                if(isSOSInstall){
//                    new SoeasyModule(jQuery).initFolders();
//                }
//            });
//        }
    }



})();
