(function() {
    var app = angular.module("angularApp");
    /* 图文消息控制器 */
    app.controller('propagandaFiles0Ctl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title ="素材管理";
        angular.extend($rootScope,fac.dicts);
        $scope.search = {
            timeFlag:"0",
        };
        $scope.pageModel = {};
        // 查询列表
        $scope.find = function(pageNo){

            if($scope.pageModel.currentPage){
                delete $scope.pageModel.currentPage;
            }

            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;
            if($("#search_date01").val()){
                $scope.search.fromcreatetime = $("#search_date01").val() + " 00:00:00";
            }else{
                delete $scope.search.fromcreatetime;
            }
            if($("#search_date02").val()){
                $scope.search.tocreatetime = $("#search_date02").val()+ " 23:59:59";
            }else{
                delete $scope.search.tocreatetime;
            }

            fac.getPageResult("/ovu-park/backstage/propagandaGraphicInfo/list",$scope.search,function(data){
                $scope.pageModel = data;
                console.log(data);
            });
        };

        //删除图文消息
        $scope.del= function(news){
            confirm("确定删除 "+news.title,function(){
                $.post("/ovu-park/backstage/propagandaGraphicInfo/delete",{ids: news.id},function(code){
                    if(code.code == 0){
                        window.msg("删除成功!");
                        $scope.find();
                    }
                });
            })
        }

        $scope.showNews = function (item) {
            item = item || {author : app.user.ID, creatorName : app.user.NICKNAME};
            var E;
            var editor;
            var copy = angular.extend({},item);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/propaganda/propagandaFiles/modal.editPropagandaGraphicInfo.html',
                controller: 'editPropagandaGraphicInfoCtrl'
                , resolve: {item: copy}
            });
            modal.rendered.then(function(){
                //初始化UM
                E = window.wangEditor;
                editor = new E('#editor');
                editor.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片
                editor.create();
                if(item.content){
                    editor.txt.html(item.content);
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                /*console.info('Modal dismissed at: ' + new Date());*/
            });
        }

        $scope.find();
        /**
         * 去除空格
         * */
        $scope.trimStr=function(str) {
            return str.replace(/(^\s*)|(\s*$)/g,"");
        }
    });

    /* 图文信息编辑框 - 控制器 */
    app.controller('editPropagandaGraphicInfoCtrl',function($scope, $http, $uibModalInstance, $filter, fac,item){
        $scope.item = item;

        $scope.cancel = function(){
            $uibModalInstance.dismiss('cancel');
        };

        $scope.saveItem = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return false;
            }

            var content = $(".w-e-text").html()+"";
            $scope.item.content = content;
            if(item.id){
                $.post("/ovu-park/backstage/propagandaGraphicInfo/saveGraphicInfo",item,function(code){
                    if(code.code == 0){
                        window.msg("修改成功!");
                        $uibModalInstance.close();
                    }else{
                        alert(code.message);
                    }
                });
            }
            if(!item.id){
                $.post("/ovu-park/backstage/propagandaGraphicInfo/saveGraphicInfo",item,function(code){
                    if(code.code == 0){
                        window.msg("新增成功!");
                        $uibModalInstance.close();
                    }else{
                        alert(code.message);
                    }
                });
            }
        }
    });

    /* 视频控制器 */
    app.controller('propagandaFiles1Ctl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title ="素材管理";
        angular.extend($rootScope,fac.dicts);
        $scope.search = {
            timeFlag:"0",
        };
        $scope.pageModel = {};
        // 查询列表
        $scope.find = function(pageNo){

            $scope.search.type1 = '1';

            if($scope.pageModel.currentPage){
                delete $scope.pageModel.currentPage;
            }

            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;
            if($("#search_date1").val()){
                $scope.search.fromcreatetime = $("#search_date1").val() + " 00:00:00";
            }else{
                delete $scope.search.fromcreatetime;
            }
            if($("#search_date2").val()){
                $scope.search.tocreatetime = $("#search_date2").val()+ " 23:59:59";
            }else{
                delete $scope.search.tocreatetime;
            }

            fac.getPageResult("/ovu-park/backstage/propagandaFiles/list",$scope.search,function(data){
                $scope.pageModel = data;
                console.log(data);
            });
        };

        $scope.addNewFile = function(item) {

            if (!item){
                item = {};
            }
            var copy = angular.copy(item);
            var modal = $uibModal.open({
                animation: true,
                templateUrl: '/view/propaganda/propagandaFiles/modal.addVideoFile.html',
                controller: 'addVideoFileCtrl'
                , resolve: {
                    data:function() {
                        return copy;
                    }
                }
            });

            modal.result.then(function (result) {	//关闭
                $scope.find();
            }, function (reason) {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        //删除视频
        $scope.del= function(news){
            confirm("确定删除 "+news.title,function(){
                $.post("/ovu-park/backstage/propagandaFiles/delete",{ids: news.id},function(code){
                    if(code.code == 0){
                        window.msg("删除成功!");
                        $scope.find();
                    }
                });
            })
        }

        $scope.find();
        /**
         * 去除空格
         * */
        $scope.trimStr=function(str) {
            return str.replace(/(^\s*)|(\s*$)/g,"");
        }
    });

    /* 视频编辑控制器 */
    app.controller('addVideoFileCtrl', function($scope,$http,$uibModal,$uibModalInstance,fac,$rootScope,data) {

        $scope.item = data || {};
        $scope.item.originalFilePath = $scope.item.address;
        $scope.item.originalFileName = $scope.item.filename;

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.addFile =function(type){

            var accepts = [];
            accepts.push(".mp4");

            $rootScope.addLimitFile20($scope.item,'originalFilePath','originalFileName',accepts);

        };

        $scope.delFile = function(type)	{
            $scope.item.originalFileName = '';
            $scope.item.originalFilePath = '';
            msg('删除成功！');
        };

        $scope.saveItem = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return false;
            }

            $scope.item.type1 = '1';
            $scope.item.address = $scope.item.originalFilePath;
            $scope.item.filename = $scope.item.originalFileName;

            if($scope.item.id){
                delete $scope.item.createtime;
                $.post("/ovu-park/backstage/propagandaFiles/saveFile",$scope.item,function(code){
                    if(code.code == 0){
                        window.msg("修改成功!");
                        $uibModalInstance.close();
                    }else{
                        alert(code.message);
                    }
                });
            }
            if(!$scope.item.id){
                $.post("/ovu-park/backstage/propagandaFiles/saveFile",$scope.item,function(code){
                    if(code.code == 0){
                        window.msg("新增成功!");
                        $uibModalInstance.close();
                    }else{
                        alert(code.message);
                    }
                });
            }
        }
    });

    /* 语音控制器 */
    app.controller('propagandaFiles2Ctl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title ="素材管理";
        angular.extend($rootScope,fac.dicts);
        $scope.search = {
            timeFlag:"0",
        };
        $scope.pageModel = {};
        // 查询列表
        $scope.find = function(pageNo){

            $scope.search.type1 = '2';

            if($scope.pageModel.currentPage){
                delete $scope.pageModel.currentPage;
            }

            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;
            if($("#search_date3").val()){
                $scope.search.fromcreatetime = $("#search_date3").val() + " 00:00:00";
            }else{
                delete $scope.search.fromcreatetime;
            }
            if($("#search_date4").val()){
                $scope.search.tocreatetime = $("#search_date4").val()+ " 23:59:59";
            }else{
                delete $scope.search.tocreatetime;
            }

            fac.getPageResult("/ovu-park/backstage/propagandaFiles/list",$scope.search,function(data){
                $scope.pageModel = data;
                console.log(data);
            });
        };

        $scope.addNewFile = function(item) {

            if (!item){
                item = {};
            }
            var copy = angular.copy(item);
            var modal = $uibModal.open({
                animation: true,
                templateUrl: '/view/propaganda/propagandaFiles/modal.addVoiceFile.html',
                controller: 'addVoiceFileCtrl'
                , resolve: {
                    data:function() {
                        return copy;
                    }
                }
            });

            modal.result.then(function (result) {	//关闭
                $scope.find();
            }, function (reason) {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        //删除语音
        $scope.del= function(news){
            confirm("确定删除 "+news.title,function(){
                $.post("/ovu-park/backstage/propagandaFiles/delete",{ids: news.id},function(code){
                    if(code.code == 0){
                        window.msg("删除成功!");
                        $scope.find();
                    }
                });
            })
        }

        $scope.find();
        /**
         * 去除空格
         * */
        $scope.trimStr=function(str) {
            return str.replace(/(^\s*)|(\s*$)/g,"");
        }
    });

    /* 语音编辑控制器 */
    app.controller('addVoiceFileCtrl', function($scope,$http,$uibModal,$uibModalInstance,fac,$rootScope,data) {

        $scope.item = data || {};
        $scope.item.originalFilePath = $scope.item.address;
        $scope.item.originalFileName = $scope.item.filename;

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.addFile =function(type){

            var accepts = [];
            accepts.push(".mp3");
            $rootScope.addLimitFile20($scope.item,'originalFilePath','originalFileName',accepts);
        };

        $scope.delFile = function(type)	{
            $scope.item.originalFileName = '';
            $scope.item.originalFilePath = '';
            msg('删除成功！');
        };

        $scope.saveItem = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return false;
            }

            $scope.item.type1 = '2';
            $scope.item.address = $scope.item.originalFilePath;
            $scope.item.filename = $scope.item.originalFileName;

            if($scope.item.id){
                delete $scope.item.createtime;
                $.post("/ovu-park/backstage/propagandaFiles/saveFile",$scope.item,function(code){
                    if(code.code == 0){
                        window.msg("修改成功!");
                        $uibModalInstance.close();
                    }else{
                        alert(code.message);
                    }
                });
            }
            if(!$scope.item.id){
                $.post("/ovu-park/backstage/propagandaFiles/saveFile",$scope.item,function(code){
                    if(code.code == 0){
                        window.msg("新增成功!");
                        $uibModalInstance.close();
                    }else{
                        alert(code.message);
                    }
                });
            }
        }
    });


    /* 图片控制器 */
    app.controller('propagandaFiles3Ctl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title ="素材管理";
        angular.extend($rootScope,fac.dicts);
        $scope.search = {
            timeFlag:"0",
        };
        $scope.pageModel = {};
        // 查询列表
        $scope.find = function(pageNo){

            $scope.search.type1 = '3';

            if($scope.pageModel.currentPage){
                delete $scope.pageModel.currentPage;
            }

            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;
            if($("#search_date5").val()){
                $scope.search.fromcreatetime = $("#search_date5").val() + " 00:00:00";
            }else{
                delete $scope.search.fromcreatetime;
            }
            if($("#search_date6").val()){
                $scope.search.tocreatetime = $("#search_date6").val()+ " 23:59:59";
            }else{
                delete $scope.search.tocreatetime;
            }

            fac.getPageResult("/ovu-park/backstage/propagandaFiles/list",$scope.search,function(data){
                $scope.pageModel = data;
                console.log(data);
            });
        };

        $scope.addNewFile = function(item) {

            if (!item){
                item = {};
            }
            var copy = angular.copy(item);
            var modal = $uibModal.open({
                animation: true,
                templateUrl: '/view/propaganda/propagandaFiles/modal.addImageFile.html',
                controller: 'addImageFileCtrl'
                , resolve: {
                    data:function() {
                        return copy;
                    }
                }
            });

            modal.result.then(function (result) {	//关闭
                $scope.find();
            }, function (reason) {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        //删除语音
        $scope.del= function(news){
            confirm("确定删除 "+news.title,function(){
                $.post("/ovu-park/backstage/propagandaFiles/delete",{ids: news.id},function(code){
                    if(code.code == 0){
                        window.msg("删除成功!");
                        $scope.find();
                    }
                });
            })
        }

        $scope.find();
        /**
         * 去除空格
         * */
        $scope.trimStr=function(str) {
            return str.replace(/(^\s*)|(\s*$)/g,"");
        }
    });

    /* 图片编辑控制器 */
    app.controller('addImageFileCtrl', function($scope,$http,$uibModal,$uibModalInstance,fac,$rootScope,data) {

        $scope.item = data || {};
        $scope.item.originalFilePath = $scope.item.address;
        $scope.item.originalFileName = $scope.item.filename;

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.addFile =function(type){

            var accepts = [];
            accepts.push(".gif");
            accepts.push(".png");
            accepts.push(".jpg");
            $rootScope.addLimitFile20($scope.item,'originalFilePath','originalFileName',accepts);
        };

        $scope.delFile = function(type)	{
            $scope.item.originalFileName = '';
            $scope.item.originalFilePath = '';
            msg('删除成功！');
        };

        $scope.saveItem = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return false;
            }

            $scope.item.type1 = '3';
            $scope.item.address = $scope.item.originalFilePath;
            $scope.item.filename = $scope.item.originalFileName;

            if($scope.item.id){
                delete $scope.item.createtime;
                $.post("/ovu-park/backstage/propagandaFiles/saveFile",$scope.item,function(code){
                    if(code.code == 0){
                        window.msg("修改成功!");
                        $uibModalInstance.close();
                    }else{
                        alert(code.message);
                    }
                });
            }
            if(!$scope.item.id){
                $.post("/ovu-park/backstage/propagandaFiles/saveFile",$scope.item,function(code){
                    if(code.code == 0){
                        window.msg("新增成功!");
                        $uibModalInstance.close();
                    }else{
                        alert(code.message);
                    }
                });
            }
        }
    });


})()
