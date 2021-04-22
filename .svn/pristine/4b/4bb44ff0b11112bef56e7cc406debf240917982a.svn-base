(function () {
    "use strict";
    var app = angular.module("angularApp");

    // 资产类别管理
    app.controller('classificationCtrl', function ($scope, $rootScope, $sce, $uibModal, $state, $http, $filter, fac) {
        document.title = '资产类别管理';
        $scope.pageModel = {};
        $scope.search = {};
       
        // 页面初始化
        app.modulePromiss.then(function () {
            
            
            $scope.find()
        })

       
        // 查询
        $scope.find = function () {
            
            $scope.pId = 'top';
            $http.post("/ovu-gallery/asset/category/getAssetCategoryList", {
                parentId: $scope.pId
            }).success(function (data) {
                if (data.code == 0) {
                    $scope.fatherList = data.data;
                    if($scope.fatherList.length>0){
                        $scope.parentId = $scope.fatherList[0].id;
                        $scope.deptId = $scope.fatherList[0].type
                    $http.post("/ovu-gallery/asset/category/getAssetCategoryList", {
                        parentId: $scope.parentId
                    }).success(function (resp) {
                        if (resp.code == 0) {
                            $scope.sonList = resp.data || [];
                        }

                    });
                    }else{
                         $scope.sonList=[];
                    }
                }
            });
        }
      
        //新增编辑一级分类
        $scope.editTop = function (item,id) {
            var copy = angular.extend({
                parentId: id,
                nickname:$scope.user.nickname
            }, item);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/gallery/resourceManagement/modal.classifiTopEdit.html',
                controller: 'classifiTopEdit',
                resolve: {
                    param: copy
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {

            });
        }
        // 新增,编辑
        $scope.edit = function (item, id) {
            var copy = angular.extend({
                parentId: id,
                deptId:$scope.deptId
            }, item);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/gallery/resourceManagement/modal.classificationEdit.html',
                controller: 'classificationEdit',
                resolve: {
                    param: copy
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {

            });
        }
        // 删除
        $scope.del = function (id) {
            confirm("删除此条数据后，所有数据将被删除，确认删除吗？", function () {
                $http.post("/ovu-gallery/asset/category/deleteAssetCategory", {
                    id: id
                }).success(function (data) {
                    if (data.code == 0) {

                        $scope.find();
                        msg("删除成功");
                    } else {
                        alert("失败");
                    }
                });
            });
        }

        //获取二级分类
        $scope.getSecond = function (item) {
            $scope.assetName = item.assetName
            $scope.parentId = item.id;
            $scope.deptId = item.type
            $http.post("/ovu-gallery/asset/category/getAssetCategoryList", {
                parentId: item.id
            }).success(function (data) {
                if (data.code == 0) {
                    $scope.sonList = data.data || [];
                } else {
                    alert(data.msg);
                }
            });

        }

    });
    // 新增编辑一级分类Controller
    app.controller('classifiTopEdit', function ($scope, $http, $uibModal, $uibModalInstance, $filter, fac, param) {
        $scope.nickname=param.nickname
        //资产类型列表
        $scope.topList=[
            {
             type:'book',
             name:'书籍'
            },
            {
             type:'collection',
             name :'藏品'
            },
            {
             type:'other',
             name:'其他'
            },
           
        ]
        $scope.item = param || {};
        if(param.id){
            $scope.item.deptId=param.type; 
        }
        var url = ''
        $scope.save = function (form, item) {
            
            
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            if($scope.nickname=='合美术馆'){
                $scope.item.deptId='other'
            }
            if (param.id) {
                url = '/ovu-gallery/asset/category/editAssetCategory'
            } else {
                url = '/ovu-gallery/asset/category/saveAssetCategory'
            }
            $http.post(url, item).success(function (data) {
                if (data.code == 0) {
                    msg(data.msg);
                    $uibModalInstance.close();
                } else {
                    alert(data.msg);
                    $uibModalInstance.close();
                }
            });
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });
    // 新增编辑Controller
    app.controller('classificationEdit', function ($scope, $http, $uibModal, $uibModalInstance, $filter, fac, param) {
        $scope.item = param || {};
       $scope.item.deptId = param.deptId 
        var url = ''
        $scope.save = function (form, item) {

            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            if (param.id) {
                url = '/ovu-gallery/asset/category/editAssetCategory'
            } else {
                url = '/ovu-gallery/asset/category/saveAssetCategory'
            }
            $http.post(url, $scope.item).success(function (data) {
                if (data.code == 0) {
                    msg(data.msg);
                    $uibModalInstance.close();
                } else {
                    alert(data.msg);
                    $uibModalInstance.close();
                }
            });
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });


})();
