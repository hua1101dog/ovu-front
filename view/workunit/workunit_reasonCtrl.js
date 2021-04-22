/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('workunitReasonCtl', function ($scope,$rootScope,$uibModal, $http,$filter,fac) {
        document.title ="延期原因";

        $scope.pageModel = {};

        $scope.search = {};
        app.modulePromiss.then(function(){
            $scope.find(1);
        })


        $scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("/ovu-pcos/pcos/workunit_reason/list.do",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };

        $scope.delAll = function(){
            var ids = $scope.pageModel.list.reduce(function(ret,n){n.checked && ret.push(n.ID);return ret},[]);
            del(ids.join());
        };
        $scope.del = function(item){
            del(item.id);
        }

        function del(ids){
            confirm("确认删除选中的原因?",function(){
                $http.post("/ovu-pcos/pcos/workunit_reason/delete.do",{ids:ids},fac.postConfig).success(function(resp){
                    if(resp.success){
                        $scope.find();
                    }else{
                        alert(resp.error);
                    }
                })
            });
        }

        //新增、编辑原因
        $scope.showEditModal = function(task){
            task=task || {};
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '/view/workunit/modal.workunitReason.html',
                controller: 'workunitReasonModalCtrl'
                ,resolve: {
                    task: function () {
                        return task;
                    }
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
    });

    app.controller('workunitReasonModalCtrl', function($scope,$http,$uibModalInstance,$filter,fac,task) {
        $scope.item = task;

        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            $http.post("/ovu-pcos/pcos/workunit_reason/save.do", item,fac.postConfig).success(function (resp, status, headers, config) {
                if (resp.success) {
                    $uibModalInstance.close();
                    msg("保存成功!");
                } else {
                    alert(resp.error);
                }
            })
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

})();
