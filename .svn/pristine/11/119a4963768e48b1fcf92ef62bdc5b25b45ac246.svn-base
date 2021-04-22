
(function () {
    "use strict";
    var app = angular.module("angularApp");

    // 盘点管理
    app.controller('inventoryCtrl', function ($scope, $rootScope, $sce, $uibModal, $state, $http, $filter, fac) {
        document.title = '盘点管理';
        $scope.pageModel = {};
        $scope.search = {};

        // 页面初始化
        app.modulePromiss.then(function () {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.deptId = deptId
                        $scope.init();
                     
                    } else {
                        $scope.search.deptId  && delete $scope.search.deptId
                        alert('请选择跟项目关联的部门');
                        return
                    }
    
                }
            })
        })
        $scope.init = function () {
            selectClassify()
            $scope.find();
        }

         //获取一级分类
         function selectClassify() {
            $http.post("/ovu-gallery/asset/category/getAssetCategoryList.do",{'parentId':'top'}).success(function (data) {
                $scope.parentList = data.data;
            });
        }
        //获取二级分类
        $scope.getclass=function(id){
            $http.post("/ovu-gallery/asset/category/getAssetCategoryList.do",{'parentId':id}).success(function (data) {
                $scope.secondList = data.data;
            });
        }

        // 查询
        $scope.find = function (pageNo) {
          
            $.extend($scope.search, {
                currentPage: pageNo || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            if($scope.parentId){
                if($scope.search.assetCategoryId == undefined){
                    alert('请选择资产类别');
                    return
                }
                
            }
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-gallery/asset/check/getCheckList", $scope.search, function (data) {
                var pageModel = data;
                $scope.pageModel = pageModel;
            });
        }
        // 详情
        $scope.detailShow = function (item) {
            var copy = angular.extend({},item);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/gallery/resourceManagement/modal.inventoryDetail.html',
                controller: 'inventoryDetailModelCtrl',
                resolve: {
                    params: copy
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
      

      
    });

    // 详情Controller
    app.controller('inventoryDetailModelCtrl', function ($scope, $http, $uibModal, $uibModalInstance, $filter, fac, params) {
        $scope.pageModel = {};
        $scope.search = {};
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || 1,
                pageSize: $scope.pageModel.pageSize || 10,
                assetCategoryId: params.assetCategoryId,
                time: params.checkTime,
                checkPlace: params.place,
            });
           
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-gallery/asset/check/checkDetail", $scope.search, function (data) {
                var pageModel = data;
                $scope.pageModel = pageModel;
            });
        }
       $scope.find(1);
       $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    });
})();
