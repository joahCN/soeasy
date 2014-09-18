'use strict';
var path = require("path");
var fs = require("fs");

module.exports = function(grunt){

    var buildConfig = {
        distFolder: 'app/scripts/favTool/dist',
        srcFolder: 'app/scripts/favTool'
    };

    grunt.config.set("uglify", {
        js: {
            files: [
                {
                    expand: true,
                    cwd: buildConfig.srcFolder,
                    src: '*.js',
                    dest: buildConfig.distFolder,
                    ext: '.min.js'
                }
            ]
        }
    });
    grunt.config.set("cssmin", {
        minify : {
            files: [
                {
                    src: path.join(buildConfig.srcFolder,"favTool.css"),
                    dest: buildConfig.distFolder + "/favTool.min.css"
                }
            ]
        }
    });
    grunt.config.set("htmlmin", {
        htmlmin: {
            options: {                                 // Target options
                removeComments: true,
                collapseWhitespace: true
            },
            files: [{
                src: path.join(buildConfig.srcFolder, 'favToolContent.html'),
                dest: buildConfig.distFolder + "/favToolContent.min.html"
            }]
        }
    });

    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-htmlmin");

    grunt.registerTask("mergeHTMLtoJS", function(){

        var htmlPath = path.join(buildConfig.distFolder , "favToolContent.min.html");
        var jsPath = path.join(buildConfig.srcFolder, "favTool.js");
        var jsTmpPath = path.join(buildConfig.srcFolder, "build.js");
        var content = fs.readFileSync(htmlPath,{encoding : 'utf8'});

        var htmlNodeTemplate = "SoeasyModule.html='<%=content%>';";
        var htmlNode = grunt.template.process(htmlNodeTemplate, {
            data: {
                content: content
            }
        });

        grunt.file.copy(jsPath,jsTmpPath);

        fs.appendFileSync(jsTmpPath, htmlNode);
    });

    grunt.registerTask("clearFolder", function(){
        grunt.file.delete(buildConfig.distFolder);
//        var jsTmpPath = path.join(buildConfig.distFolder, "favToolTmp.js");
//        grunt.file.delete(jsTmpPath);
    });

    grunt.registerTask("buildFavTool", ["clearFolder","cssmin","htmlmin","mergeHTMLtoJS","uglify"]);
};