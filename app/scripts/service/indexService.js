'use strict';

define(['appModule'], function(module){
    module.register.factory('indexService', ['$resource','networkService',function($resource, networkService){
        var data = [
            {
                title: '江湖里的那些大侠，锄强扶弱之余在干什么呢',
                content: '谢邀我曾经认识一位大侠，武功盖世，人称操大刀，名字颇是风骚，可惜姓不是很好，有阵子比武，小厮吐字不利索，本说得是操大侠来了，一哆嗦说成来操大侠了。比武的一众大侠便落荒而逃，都说江东有人丧心病狂，专操大侠。一时间，姓操的风光无限',
                like: 40,
                collection: 100,
                moduleId: 1,
                pageId: 1,
                url: 'http://baidu.com'
            },
            {
                title: '那些年入上百万的人是如何做到的？这一人群的平均年龄是多少？',
                content: '我有一个虽然很低，但绝对是铁打的底线。不知道的，绝不瞎说。这篇答案里的每一个字，都来自于我的生活和经历。曾经是个义字当先，为了兄弟朋友可以得罪所有人的热血青年',
                like: 40,
                collection: 100,
                moduleId: 1,
                pageId: 2,
                url: 'http://xmfish.com'
            },
            {
                title: '系统地学习表演，提高演技，会对日常生活有什么帮助',
                content: '谢谢邀请，这个问题我本来真的不想回答的。但是，看到其他几个答案，让我心里挺不舒服。想起有一年放假回国，我母亲说了一些特别刺激我的话',
                like: 40,
                collection: 100,
                moduleId: 1,
                pageId: 3,
                url: 'http://google.com'
            }
        ];

        return {
            getNewestData: function(callback){

                networkService.getData({
                    url: 'latestItems',
                    callback: callback
                });

            },
            queryCategory: function(callback){
                networkService.getData({
                    url: 'queryFolderCategory',
                    callback: callback
                });
            },
            queryCategoryItems: function(params, callback){
                networkService.getData({
                    url: 'categoryItems',
                    data: {
                        category: params.category || "",
                        page: params.page,
                        start: params.start,
                        searchKey: params.searchKey || ""
                    },
                    callback: callback
                });
            },

            getPage: function(pageId){
                var page;
                data.some(function(item){
                    if(item.pageId == pageId){
                        page = item;
                        return true;
                    }
                });
                return page;
            },
            getCollectionFolder: function(){
                return [
                    {
                        name: '生活有趣'
                    },
                    {
                        name: '奇闻趣事'
                    },
                    {
                        name: '经典文学'
                    }
                ]
            }
        };
    }]);
});
