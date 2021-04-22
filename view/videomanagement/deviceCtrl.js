/**
 * Created by chenxi on 2018/3/7.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('deviceCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {

        document.title = "视频线路管理";
        $scope.search = {};
        $scope.pageModel = {};
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find()
            }, function () {
                $scope.find()
            })
        })
        //分页
        $scope.find = function (pageNo) {
            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult('/ovu-camera/pcos/videomanagement/route/list.do', $scope.search, function (res) {
                $scope.pageModel = res;
            })
        }
        //添加视频线路

        $scope.showEditModal = function (task) {
            var copy = angular.extend({}, task);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: "../view/videomanagement/device/modal.deviceEdit.html",
                controller: 'deviceEditModalCtrl',
                controllerAs: 'vm',
                resolve: { task: copy }

            })
            modal.result.then(function () {
                $scope.find()
            }, function () {
                $scope.find()
            })
        }
        //删除线路
        $scope.del = function (id) {
            confirm("确认删除该视频线路吗?", function () {
                $http.get("/ovu-camera/pcos/videomanagement/route/delete.do?ids=" + id).success(function (msg) {
                    if (msg.success) {
                        $scope.find();
                    } else {
                        alert();
                    }
                })
            })
        }


    });
    app.controller('deviceEditModalCtrl', function ($scope, $uibModal, $uibModalInstance, $http, $filter,$location, fac, task) {
    //获取监控服务编号编号列表
         $http.get("/ovu-camera/pcos/videomanagement/imos/list.do").success(function (data) {

          $scope.imosList = data;
         });

       //获取转流服务编号

       $scope.getTransform=function(id){
           console.log("a")
        $http.get("/ovu-camera/pcos/videomanagement/route/getTransform.do",{params:{id:id}}).success(function (data, status, headers, config) {
            $scope.transformList = data.listTransform;
           });
       }

        //获取流媒体编号
        $scope.getMedia=function(id){
            $http.get("/ovu-camera/pcos/videomanagement/route/getMedia.do",{params:{id:id}}).success(function (data, status, headers, config) {
                $scope.mediaList = data.listMedia;
               });
        }


        var vm = $scope.vm = this;
        $scope.item = {};


        if (fac.isNotEmpty(task.id)) {
            $http.get('/ovu-camera/pcos/videomanagement/route/get.do', { params: { id: task.id } }).success(function (res) {
                // angular.extend($scope.item, res.route);
                // $scope.item.transformId=res.route.transformId;
                $http.get("/ovu-camera/pcos/videomanagement/route/getTransform.do",{params:{id:res.route.imosId}}).success(function (data, status, headers, config) {
                    $scope.transformList = data.listTransform;
                   });
                   $http.get("/ovu-camera/pcos/videomanagement/route/getMedia.do",{params:{id:res.route.transformId}}).success(function (data, status, headers, config) {
                    $scope.mediaList = data.listMedia;
                   });
                   $scope.item.code=res.route.code;
                   $scope.item.name=res.route.name;
                   $scope.item.imosId=res.route.imosId;
                   $scope.item.transformId=res.route.transformId;
                   $scope.item.mediaId=res.route.mediaId;
                   $scope.item.status=res.route.status;
                   $scope.item.remark=res.route.remark;
                   $scope.item.id=task.id;

            })
        }


          vm.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return
            }
            delete item.createTime;
            $http.post('/ovu-camera/pcos/videomanagement/route/edit.do', item, fac.postConfig).success(function (res) {
                if (res.success) {
                    $uibModalInstance.close();
                    msg("操作成功!");
                } else {
                    $uibModalInstance.close();
                    msg("操作失败!");
                }
            })
        };
        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    })

})();
