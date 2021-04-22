
(function () {
    "use strict";
    var app = angular.module("angularApp");

    // 资产授权
    app.controller('jurisdictionCtrl', function ($scope, $rootScope, $sce, $uibModal, $state, $http, $filter, fac) {
        document.title = '资产授权';
        $scope.pageModel = {};
        $scope.search = {};

       // 页面初始化
       app.modulePromiss.then(function () {
        $scope.$watch('dept.id', function (deptId, oldValue) {
            if (deptId) {
                if ($scope.dept.parkId) {
                    $scope.search.deptId=deptId
                    $scope.find(1);
                    selectClassify();
                } else {
                    $scope.search.deptId  && delete $scope.search.deptId
                    alert('请选择跟项目关联的部门');
                    return
                }

            }
        })
       
    })
       
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
            fac.getPageResult("/ovu-gallery/assetsafety/getAssetSafeList", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        }
        // 授权
        $scope.getAcc = function (item) {
            var copy = angular.extend({deptId:$scope.search.deptId},item);
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/gallery/resourceManagement/modal.authorization.html',
                controller: 'authorizationModelCtrl',
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
        //解绑
        $scope.unbundling = function (id) {

            $http.post("/ovu-gallery/assetsafety/unbind", {id:id}).success(function (data) {
               if(data.code==0){
                   msg(data.msg);
                   $scope.find();
               }else{
                   alert(data.msg);
               }
            });

        }
    });

    // 授权Controller
    app.controller('authorizationModelCtrl', function ($scope, $http, $uibModal, $uibModalInstance, $filter, fac, param) {
        $scope.item = {id:param.safeId,deptId:param.deptId,assetId:param.fixedId};
      $scope.item.beginTime= moment().format('YYYY-MM-DD 23:59:59')
        
        $scope.save = function (form, item) {

            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            $http.post('/ovu-gallery/assetsafety/jurisdiction', $scope.item).success(function (data) {
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
