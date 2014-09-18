'use strict';
define(['appModule'], function(module){
    module.register.controller('clipImgController', function($scope){
        $scope.clip = function(){
            var canvas=document.getElementById("canvas");
            var ctx=canvas.getContext("2d");

            var img=new Image();
            img.onload=function(){

                clipImage(img,140,2,120,110);

            };
            //img.crossOrigin="anonymous";
            img.src="images/1.jpg";

            function clipImage(image,clipX,clipY,clipWidth,clipHeight){

                // draw the image to the canvas
                // clip from the [clipX,clipY] position of the source image
                // the clipped portion will be clipWidth x clipHeight
                ctx.drawImage(image,clipX,clipY,clipWidth,clipHeight,
                    0,0,clipWidth,clipHeight);

                var clippedImg=document.getElementById("clipped");
                clippedImg.src=canvas.toDataURL();
                console.log("success");

            }
        };

    });
});