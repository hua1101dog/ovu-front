(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('playbackStateCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac,$location) {
        document.title = "视频播放状态详情";
        $scope.search = {};
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find();
            }, function () {
                $scope.find();
            });

        })
        $scope.pid=""
        $scope.find = function (pageNo) {
            $scope.pid=$location.$$search.pid;
            // $scope.pid=86
            $http.get("/ovu-camera/pcos/videomanagement/device/getDeviceStatus?id="+ $scope.pid).success(function (data) {
                $scope.routeList = data.data;
                if( $scope.routeList.imosStatus!==0){
                    $scope.routeList.routeImosStatus=1;
                    $scope.routeList.mediaStatus=1;
                    $scope.routeList.transformStatusIstrue=1;
                    $scope.routeList.transformStatus=8;
                    $scope.routeList.status =1;
                }
            })
        };
        //
        $scope.showCameraModal = function (id) {
            var copy = angular.extend({}, { id: id });
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: "../view/videomanagement/modal/modal.cameraEdit.html",
                controller: 'cameraEditModalCtrl',
                controllerAs: 'vm',
                resolve: {
                    task: copy
                }

            })
            modal.result.then(function () {
                $scope.find();

            }, function () {
                $scope.find();

            })
        }
        $scope.showImosModal = function (id) {
            var copy = angular.extend({}, { id: id });
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: "../view/videomanagement/modal/modal.imosEdit.html",
                controller: 'imosEditModalCtrl',
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
        $scope.showTransformModal = function (id) {
            var copy = angular.extend({}, { id: id });
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: "../view/videomanagement/modal/modal.transformEdit.html",
                controller: 'transformEditModalCtrl',
                controllerAs: 'vm',
                   resolve:{
                       task:copy
                   }
            })
            modal.result.then(function () {
                $scope.find()
            }, function () {
                $scope.find()
            })
        }
        // $scope.showPlaysourceModal = function () {
        //     // var copy = angular.extend({}, task);

        //     var modal = $uibModal.open({
        //         animation: false,
        //         size: 'lg',
        //         templateUrl: "../view/videomanagement/modal/modal.playsourceEdit.html",
        //         controller: 'playsourceEditModalCtrl',
        //         controllerAs: 'vm',
        //         // resolve: { task: copy }

        //     })
        //     modal.result.then(function () {
        //         $scope.find()
        //     }, function () {
        //         $scope.find()
        //     })
        // }
        $scope.showCTM = function (id) {
            var copy = angular.extend({}, { id: id});
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: "../view/videomanagement/modal/modal.CTM.html",
                controller: 'CTMCtrl',
                controllerAs: 'vm',
                resolve: { task: copy }

            })
            modal.result.then(function () {
                $scope.find()
            }, function () {
                $scope.find()
            })
        }
        $scope.showMTO = function (id,status) {
            var copy = angular.extend({}, { id: id,status:status});
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: "../view/videomanagement/modal/modal.MTO.html",
                controller: 'MTOCtrl',
                controllerAs: 'vm',
                resolve: { task: copy }

            })
            modal.result.then(function () {
                $scope.find()
            }, function () {
                $scope.find()
            })
        }
        $scope.showOTE = function (id,status) {
            var copy = angular.extend({}, { id: id,status:status});
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: "../view/videomanagement/modal/modal.OTE.html",
                controller: 'OTECtrl',
                controllerAs: 'vm',
                resolve: { task: copy }

            })
            modal.result.then(function () {
                $scope.find()
            }, function () {
                $scope.find()
            })
        }

    });
    app.controller('cameraEditModalCtrl', function ($scope, $uibModal, $uibModalInstance, $http, fac, task) {
        var vm = $scope.vm = this;
        $scope.item = {};
        $http.get("/ovu-camera/pcos/videomanagement/camerinfo/get.do?id=" + task.id).success(function (res) {
            angular.extend($scope.item, res);
            //获取监控服务编号编号列表
            $http.get("/ovu-camera/pcos/videomanagement/imos/list.do").success(function (data, status, headers, config) {
                $scope.imosList = data;
                 $scope.imosList.forEach(function (v) {
                    if (v.id == $scope.item.imosId) {
                        $scope.imosName= v.imosName;
                    }
                })
            });

            //获取NVR编号列表
            $http.get("/ovu-camera/pcos/videomanagement/nvr/list.do").success(function (data, status, headers, config) {
                $scope.nvrList = data;
                $scope.nvrList.forEach(function (v) {
                    if (v.id == $scope.item.nvrId ) {
                        $scope.nvrName= v.nvrName;
                    }
                })

            });

        });
        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    })
    app.controller('imosEditModalCtrl', function ($scope, $uibModal, $uibModalInstance, $http, $filter, fac,task) {
        var vm = $scope.vm = this;
        $scope.item = {}
        $http.get("/ovu-camera/pcos/videomanagement/imos/get.do?id="+task.id).success(function (res) {
            angular.extend($scope.item, res);
            $http.get("/ovu-camera/pcos/videomanagement/hardware/list.do").success(function (data, status, headers, config) {
                $scope.hardwareList = data;
                $scope.hardwareList.forEach(function(v){
                 if(v.id==$scope.item.hardwareId){
                   $scope.hardwareName=v.name+"("+v.hardwareNo+")"
                 }
                })

            });

        });


        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    })
    app.controller('transformEditModalCtrl', function ($scope, $uibModal, $uibModalInstance, $http, $filter, fac,task) {

        var vm = $scope.vm = this;
        $scope.item = {}
        $http.get('/ovu-camera/pcos/videomanagement/transform/get.do',{params:{id:task.id}}).success(function(res){
            angular.extend($scope.item, res);
            $http.get("/ovu-camera/pcos/videomanagement/hardware/list.do").success(function (data) {
                $scope.hardwareList = data;
                $scope.hardwareList.forEach(function(v){
                 if(v.id==$scope.item.hardwareId){
                   $scope.hardwareName=v.name+"("+v.hardwareNo+")"
                 }
                })

            });
         })

        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    })
    /*app.controller('playsourceEditModalCtrl', function ($scope, $uibModal, $uibModalInstance, $http, $filter, fac) {
        var vm = $scope.vm = this;
        $scope.item = {};
        $scope.cameraList = ""
        //获取摄像头编码列表
        $http.get("/ovu-camera/pcos/videomanagement/camerinfo/list.do").success(function (data, status, headers, config) {
            $scope.cameraList = data;
        });

        //根据摄像头编号查询路线
        $scope.getRouter = function (id) {
            var camerainfoNo = $scope.cameraList.reduce(function (ret, n) {
                (n.id == id) && ret.push(n.code);
                return ret;
            }, []).join();
            $scope.item.cameraCode = camerainfoNo;
            $http.get("/ovu-camera/pcos/videomanagement/route/getRouteList.do", { params: { camerainfoNo: camerainfoNo } }).success(function (data, status, headers, config) {
                $scope.routeList = data.data;
            });
        }


        vm.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return
            }
            //     var date=new Date();
            //    item.updateTime=date.getTime(item.updateTime)
            $http.post('/ovu-camera/pcos/videomanagement/device/edit.do', item, fac.postConfig).success(function (res) {
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
        };


    });
    */
    app.controller('CTMCtrl', function ($scope, $uibModal, $uibModalInstance, $http, $filter, fac,task) {
        var vm = $scope.vm = this;
        $scope.item = {};

        $http.get("/ovu-camera/pcos/videomanagement/device/getCameraImos?id="+task.id).success(function (data) {
            $scope.CTMList = data.data;
        });


        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };


    });
    app.controller('MTOCtrl', function ($scope, $uibModal, $uibModalInstance, $http, $filter, fac,task) {
        var vm = $scope.vm = this;
        $scope.MTOList={};
        $scope.item = {};

        $http.get("/ovu-camera/pcos/videomanagement/device/getImosOvu?id="+task.id).success(function (data, status, headers, config) {
            $scope.MTOList = data.data;
            if(task.status!==0){
                $scope.MTOList.imosStatus="8";
            }
            if($scope.MTOList.maxLive<$scope.MTOList.count){
                alert("连接已达上限");
           }

        });



        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };


    });
    app.controller('OTECtrl', function ($scope, $uibModal, $uibModalInstance, $http, $filter, fac,task) {
        var vm = $scope.vm = this;
        $scope.item = {};
        $http.get("/ovu-camera/pcos/videomanagement/device/getOvuEms?id="+task.id).success(function (data, status, headers, config) {
            $scope.OTEList = data.data;
            if($scope.OTEList.maxLive<$scope.OTEList.count){
                alert("连接已达上限");
           }
        });
        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };


    });
})();
