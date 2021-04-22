/**
 * Created by chenxi on 2018/3/7.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('imosTransformCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {

        document.title = "视频服务配置管理";
        $scope.pageModel = {};
        $scope.search = {};
        var selectedIndex;
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                // $scope.find();
                $scope.changeIndex(selectedIndex);
            })
        });
        $scope.init = function () {
            // $scope.find();
            $scope.changeIndex(selectedIndex);
        }
        $scope.find = function (pageNo) {

            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult("/ovu-camera/pcos/videomanagement/imostransform/list.do", $scope.search, function (data) {
                $scope.pageModel = data;

            });
        };
        $scope.changeIndex = function (index) {
            if (index == 0) {
                $scope.find();
            }

            $scope.$broadcast('index' + index, $scope.search);
            selectedIndex = index;
        };
        //新增配置
        $scope.showEditModal = function (task) {
            var copy = angular.extend({}, task)
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: "../view/videomanagement/modal.imosTransformEdit.html",
                controller: 'imosTransformEditModalCtrl',
                controllerAs: 'vm',
                resolve: {
                    task: copy
                }
            })
            modal.result.then(function () {
                $scope.find()
            }, function () {
                $scope.find()
            })
        }
        //删除配置
        $scope.del = function (id) {
            confirm("确认删除该配置吗?", function () {
                $http.get("/ovu-camera/pcos/videomanagement/imostransform/delete.do?ids=" + id).success(function (msg) {
                    if (msg.success) {
                        $scope.find();
                    } else {
                        alert();
                    }
                })
            })
        }

    });
    //新增转流服务与监控服务配置
    app.controller('imosTransformEditModalCtrl', function ($scope, $uibModal, $uibModalInstance, $http, $filter, fac, task) {
        var vm = $scope.vm = this;
        //获取转流服务编号
        $http.get("/ovu-camera/pcos/videomanagement/transform/list.do").success(function (data, status, headers, config) {
            $scope.transformList = data;
        });

     //获取监控服务编号编号列表
     $http.get("/ovu-camera/pcos/videomanagement/imos/list.do").success(function (data, status, headers, config) {
        $scope.imosList = data;
    });
        if (fac.isNotEmpty(task.id)) {
            $scope.item = {}
            console.log(task);
            $http.get('/ovu-camera/pcos/videomanagement/imostransform/get.do', { params: { id: task.id } }).success(function (res) {
                // res.imosTransform.modifyTime= $filter('date')(res.imosTransform.modifyTime, "yyyy-MM-dd hh:mm:ss")
                //    angular.extend($scope.item, res.imosTransform);
                $scope.item.code=res.imosTransform.code;
                $scope.item.name=res.imosTransform.name;
                $scope.item.imosId=res.imosTransform.imosId;
                $scope.item.transformId=res.imosTransform.transformId;
                $scope.item.status=res.imosTransform.status;
                $scope.item.remark=res.imosTransform.remark;
                $scope.item.id=task.id;




            })
        }
        vm.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return
            }

            $http.post('/ovu-camera/pcos/videomanagement/imostransform/edit.do', item, fac.postConfig).success(function (res) {
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
    //转流服务与流媒体服务器配置
    app.controller('mediaTransformCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        $scope.$on('index1', function (event, data) {

            $scope.find(1, data);

        });

        $scope.find = function (pageNo, data) {

            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 }, data);
            fac.getPageResult("/ovu-camera/pcos/videomanagement/mediatransform/list.do", $scope.search, function (res) {
                $scope.pageModel = res;
            });

        }
        //新增配置
        $scope.showEditModal = function (task) {
            var copy = angular.extend({}, task)
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: "../view/videomanagement/modal.mediaTransfromEdit.html",
                controller: 'mediaTransfromEditModalCtrl',
                controllerAs: 'vm',
                resolve: {
                    task: copy
                }
            })
            modal.result.then(function () {
                $scope.find()
            }, function () {
                $scope.find()
            })
        }
        //删除配置
        $scope.del = function (id) {
            confirm("确认删除该配置吗?", function () {
                $http.get("/ovu-camera/pcos/videomanagement/mediatransform/delete.do?ids=" + id).success(function (msg) {
                    if (msg.success) {
                        $scope.find();
                    } else {
                        alert();
                    }
                })
            })
        }

    })
    //新增转流服务与流媒体服务器配置
    app.controller('mediaTransfromEditModalCtrl', function ($scope, $uibModal, $uibModalInstance, $http, $filter, fac, task) {
        var vm = $scope.vm = this;
         //获取转流服务编号
         $http.get("/ovu-camera/pcos/videomanagement/transform/list.do").success(function (data, status, headers, config) {
            $scope.transformList = data;
        });
           //获取流媒体编号
           $http.get("/ovu-camera/pcos/videomanagement/media/list.do").success(function (data, status, headers, config) {
            $scope.mediaList = data;
        });
        if (fac.isNotEmpty(task.id)) {
            $scope.item = {}
            console.log(task);
            $http.get('/ovu-camera/pcos/videomanagement/mediatransform/get.do', { params: { id: task.id } }).success(function (res) {
                // res.mediaTransform.modifyTime= $filter('date')(res.mediaTransform.modifyTime, "yyyy-MM-dd hh:mm:ss")

               //  angular.extend($scope.item, res.mediaTransform);
               $scope.item.code=res.mediaTransform.code;
               $scope.item.name=res.mediaTransform.name;
               $scope.item.mediaId=res.mediaTransform.mediaId;
               $scope.item.transformId=res.mediaTransform.transformId;
               $scope.item.status=res.mediaTransform.status;
               $scope.item.remark=res.mediaTransform.remark;
               $scope.item.id=task.id;

            })
        }
        vm.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return
            }
            // delete item.createTime;
            console.log(item);
            $http.post('/ovu-camera/pcos/videomanagement/mediatransform/edit.do', item, fac.postConfig).success(function (res) {
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
