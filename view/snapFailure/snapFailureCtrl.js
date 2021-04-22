// 抓拍失败记录
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('snapFailureCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "抓拍失败记录";
        $scope.pageModel = {};
        $scope.search = {};
        $scope.find = function (pageNo) {
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
            });
            fac.getPageResult("/ovu-pcos/pcos/video/retry/page", $scope.search, function (data) {
                $scope.pageModel = data;
            });

        };

        // app.modulePromiss.then(function () {
        //     fac.initPage($scope, function () {
        //         $scope.find();
        //     }, function () {
        //         $scope.find();
        //     })
        // })
        $scope.$watch('dept.id', function (deptId, oldValue) {
            if (deptId) {
                if (deptId) {
                    if($scope.dept.parkId){
                        $scope.search.parkId = $scope.dept.parkId;
                      $scope.find(1);
                    }else {
                        alert('请选择跟项目关联的部门');
                        return 
                    }
                    
                } 
                
            }
        })

      
        //抓拍次数
        $scope.recorded = function (task) {
            var copy = angular.extend({}, task);
            copy = angular.extend(copy, {});
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: './snapFailure/modal.recorded.html',
                controller: 'recordedCtrl',
                resolve: {
                    task: copy
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });

        }
        //抓拍
        $scope.snap=function(id){
            $http.get("/ovu-pcos/pcos/video/retry/capture?id="+id).success(function(ret){
                if(ret.code ===0){
                   msg(ret.msg);
                   $scope.find();
                }else{
                 alert(ret.msg);
                 $scope.find();
                }
            })
        }

    });
    app.controller('recordedCtrl', function ($scope, $uibModalInstance, $http, fac, task) {
        var vm = $scope.vm = this;
        $scope.search = {};
        $scope.pageModel = {};
        $scope.find = function () {
            $http.get("/ovu-pcos/pcos/video/retry/record?id="+task.id).success(function(ret){
                $scope.recordList = ret.data || [];
            });
        }
        $scope.find();
        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });

})();