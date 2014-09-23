'use strict';

define(['appModule'], function(module){
    module.register.controller("installToolController", ['$scope',function($scope){
        $scope.link = "javascript:void(function(d,a,c,b){var domain = 'wx.xcjx.org';a[c]&&typeof a[c].shadeLayer=='function'?a[c].shadeLayer():(b=a.createElement('script'),b.id='health_script',b.setAttribute('charset','utf-8'),b.src='http://'+domain+'/scripts/favTool/installTool.js?'+Math.floor(+new Date/1E7),a.body.appendChild(b))}(window,document,'healthTribe'));";
        $scope.clickToolTip = function(event){
            $scope.isShowTip = true;
            event.preventDefault();
            event.stopPropagation();
        }
    }]);
});
