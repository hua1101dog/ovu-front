(function () {
    "use strict";
    var app = angular.module("angularApp");

    // 预警设置
    app.controller('setWarnCtrl', function ($scope, $rootScope, $sce, $uibModal, $state, $http, $filter, fac) {
        document.title = '预警设置';
        $scope.pageModel = {};
        $scope.search = {};

        // 页面初始化
        app.modulePromiss.then(function () {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.deptId=deptId
                        $scope.find(1);
                    } else {
                        $scope.search.deptId  && delete $scope.search.deptId
                        alert('请选择跟项目关联的部门');
                        return
                    }
    
                }
            })

           
        })
        // 查询
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-gallery/asset/person/getAssetPersonList", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        }
        //推送
         $scope.push=function(){
            var copy = { deptId: $scope.search.deptId};
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/gallery/resourceManagement/modal.addPerson.html',
                controller: 'addPersonCtrl',
                resolve: {
                    param: copy
                }
                
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
         }
        // 删除
        $scope.del = function (item) {
            confirm("删除此条数据后，需要重新添加数据，确认删除吗？", function () {
                $http.post("/ovu-gallery/asset/person/deleteAssetPerson", {
                    id: item.id
                }).success(function (data) {
                    if (data.code == 0) {
                        $scope.find();
                        msg(data.msg);
                    } else {
                        alert(data.msg);
                    }
                });
            });
        }
       


    });
 // 新增Controller
 app.controller('addPersonCtrl', function ($scope, $http, $uibModal, $uibModalInstance, $filter, fac,param) {
    $scope.item = param || {};
    $scope.save = function (form, item) {
        form.$setSubmitted(true);
        if (!form.$valid) {
            return;
        }

        $http.post('/ovu-gallery/asset/person/saveAssetPerson',  $scope.item).success(function (data) {
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
