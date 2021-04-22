/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('takingTypeCtrl', function ($scope, $http,$uibModal,fac) {
        document.title ="承接类型管理";
        $scope.search = {};
        $scope.pageModel = {};

        $scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            fac.getPageResult("/ovu-pcos/taking/type/list",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };
        $scope.find(1);

        //批量删除
        $scope.delAll = function(){
            var ids = $scope.pageModel.list.reduce(function(ret,n){n.checked && ret.push(n.id);return ret},[]);
            if(ids.length==0){
                alert("请选择要删除的类型！");
                return;
            }
            dodel(ids.join());
        };
        $scope.del = function(item){
            dodel(item.id);
        };
        function dodel(ids){
            confirm("确认删除类型吗?",function(){
                $http.post("/ovu-pcos/taking/type/remove.do", {id:ids},fac.postConfig).success(function (data) {
                    if (data.success) {
                        $scope.find();
                    } else {
                        alert(data.error);
                    }
                })
            });
        }

        //添加与保存app
        $scope.showEditModal = function(domain){
            var copy = angular.extend({},domain);
            var modal = $uibModal.open({
                animation: false,
                size:'',
                templateUrl: 'undertaking/modal.takingType.html',
                controller: 'modalTakingTypeCtrl'
                ,resolve: {item: function(){return copy;}}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
    });

    app.controller('modalTakingTypeCtrl', function($scope,$http,$uibModalInstance,fac,item) {
        $scope.item = item;
        $scope.save = function (form,item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            $http.post("/ovu-pcos/taking/type/save", item,fac.postConfig).success(function (data, status, headers, config) {
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
})();
