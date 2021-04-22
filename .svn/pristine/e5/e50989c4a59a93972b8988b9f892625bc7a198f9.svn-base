/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");

    app.controller('versionCtl', function ($scope,$rootScope, $http,$filter,$uibModal,fac) {
        $scope.pageModel = {};
        $scope.search = {};

        //查询
        $scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("/ovu-base/sys/version/list.do",$scope.search,function(data){
                $scope.pageModel = data;
                console.log(data);
                //$scope.$apply();
            });
        };
        $scope.find(1);

        $scope.showEditModal = function(item){
            var modal = $uibModal.open({
                animation: false,
                size:'lg',
                templateUrl: '/view/sys/modal.versionbasic.html',
                controller: 'versionBasicModalCtrl'
                ,resolve: {data: angular.extend({},item)}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

    });
    app.controller('versionProCtl', function ($scope,$rootScope, $http,$filter,$uibModal,fac) {
        $scope.pageModel = {};
        $scope.search = {};
        $scope.basicVersions = {};

        //查询
        $scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("/ovu-base/sys/version/listPro.do",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };
        $scope.find(1);

        $scope.showEditModal = function(item){
            var modal = $uibModal.open({
                animation: false,
                size:'lg',
                templateUrl: '/view/sys/modal.versionpro.html',
                controller: 'versionProModalCtrl'
                ,resolve: {data: angular.extend({},item)}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        getBasicVersions();
        function getBasicVersions(){
            $http.get("/ovu-base/sys/version/findAllBasic").success(function(data){
                $scope.basicVersions=data;
            })
        }
    });
    app.controller('versionAppCtl', function ($scope,$rootScope, $http,$filter,$uibModal,fac) {
        $scope.pageModel = {};
        $scope.search = {};
        $scope.basicVersions=[];
        $scope.apps=[];

        //查询
        $scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("/ovu-base/sys/version/listApp.do",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };
        $scope.find();

        $scope.showEditModal = function(item){
            var modal = $uibModal.open({
                animation: false,
                size:'lg',
                templateUrl: '/view/sys/modal.versionapp.html',
                controller: 'versionAppModalCtrl'
                ,resolve: {data: angular.extend({},item)}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        getBasicVersions();
        getApps();
        function getBasicVersions(){
            $http.get("/ovu-base/sys/version/findAllBasic").success(function(data){
                $scope.basicVersions=data;
            })
        }
        function getApps(){
            $http.get("/ovu-base/sys/version/findAllApp").success(function(data){
                $scope.apps=data;
            })
        }
    });

    app.controller('versionBasicModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$uibModal,$filter,fac,data) {
        $scope.item = data || {};

        //保存
        $scope.save = function(form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            $http.post("/ovu-base/sys/version/save.do", item,fac.postConfig).success(function(data) {
                if (data.success) {
                    $uibModalInstance.close();
                    msg("保存成功!");
                } else {
                    alert(data.error);
                }
            })
        }


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    app.controller('versionProModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$uibModal,$filter,fac,data) {
        $scope.item = data || {};
        $scope.basicVersions=[];
        $scope.modules=[];

        //保存
        $scope.save = function(form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            $http.post("/ovu-base/sys/version/savePro.do", item,fac.postConfig).success(function(data) {
                if (data.success) {
                    $uibModalInstance.close();
                    msg("保存成功!");
                } else {
                    alert(data.error);
                }
            })
        }

        getBasicVersions();
        getModules();
        function getBasicVersions(){
            $http.get("/ovu-base/sys/version/findAllBasic").success(function(data){
                $scope.basicVersions=data;
            })
        }
        function getModules(){
            $http.get("/ovu-base/sys/version/findAllModule").success(function(data){
                $scope.modules=data;
            })
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    app.controller('versionAppModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$uibModal,$filter,fac,data) {
        $scope.item = data || {};
        $scope.basicVersions=[];
        $scope.apps=[];
        $scope.pros=[];

        if($scope.item.id){
            $http.get("/ovu-base/sys/version/findAppPro.do?id="+$scope.item.id).success(function(data){
                $scope.pros=data;
            })
        }

        //保存
        $scope.save = function(form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            item.proId=$scope.pros.reduce(function(ret,n){ret.push(n.id);return ret},[]).join();
            if(!item.proId){
                alert('请选择子系统版本！');
                return;
            }
            $http.post("/ovu-base/sys/version/saveApp.do", item,fac.postConfig).success(function(data) {
                if (data.success) {
                    $uibModalInstance.close();
                    msg("保存成功!");
                } else {
                    alert(data.error);
                }
            })
        };

        //添加系统版本
        $scope.addPostItem=function(){
            if(!$scope.item.basicId){
                alert('请先选择代码版本！');
                return;
            }
            var modal = $uibModal.open({
                animation: false,
                size:"",
                templateUrl: '/common/modal.select.proversion.html',
                controller: 'proversionSelectorCtrl'
                ,resolve: {data:{basicId : $scope.item.basicId}}
            });
            modal.result.then(function (data) {
                if (data) {
                    if($scope.pros && $scope.pros.length>0){
                        data.forEach(function(part){
                            $scope.pros.forEach(function(item){
                                if(part.id==item.id || part.moduleId==item.moduleId){
                                    part.isExist=true;
                                }
                            });
                        });
                    }

                    data.forEach(function(part){
                        if(!part.isExist){
                            $scope.pros.push(part);
                        }
                    });
                }
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
        //删除系统版本
        $scope.delpost=function(posts,post){
            posts.splice(posts.indexOf(post),1);
        };


        getBasicVersions();
        getApps();
        function getBasicVersions(){
            $http.get("/ovu-base/sys/version/findAllBasic").success(function(data){
                $scope.basicVersions=data;
            })
        }
        function getApps(){
            $http.get("/ovu-base/sys/version/findAllApp").success(function(data){
                $scope.apps=data;
            })
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

})();
