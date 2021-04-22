/**
 * Created by Zn on 2017/11/20.
 */
(function (angular) {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('measureDataManageCtrl', function ($scope, $rootScope, $uibModal,$sce, $state, $http, $filter, fac){
        document.title='计量点数据管理';
        $scope.search={};
        $scope.pageModel={};

        $scope.fn=function () {
            selectClassify();
            $scope.find();
        }
        app.modulePromiss.then(function () {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId;
                        $scope.search.parkName = $scope.dept.parkName;
                        $scope.fn();
                    } else {
                        alert('请选择跟项目关联的部门');
                        $scope.search.parkId &&  delete $scope.search.parkId
                        $scope.search.parkName &&  delete $scope.search.parkName;

                    }

                }

            })
        })
        function selectClassify() {
            $http.get("/ovu-energy/energy/classify/list.do").success(function (data) {
                $scope.measureCategory=data.data;
            });
            $http.get("/ovu-energy/energy/point/ratioList?parkId="+$scope.search.parkId).success(function (data) {
                $scope.radioList = data.data;

            });
        }

        $scope.changeCategory=function (id) {
            $http.post("/ovu-energy/energy/item/list",{classifyId:id},fac.postConfig).success(function (data) {
                $scope.fenXiangList=data.data;
            });
        }
        $scope.sort=function(value){
            $scope.search.sort=value
            $scope.find(1)
        }
        $scope.find = function (pageNo) {
            if (!$rootScope.dept || !$rootScope.dept.id) {
                alert("请选择部门！");
                return false;
            }
            $.extend($scope.search, {currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10});
            $scope.search.pageIndex = $scope.search.currentPage - 1;

            fac.getPageResult("/ovu-energy/energy/data/list", $scope.search, function (data) {
                /*$scope.pageModel = data;*/
                var pageModel=data;
                if(pageModel.data!=undefined){
                    pageModel.data=pageModel.data.map(function (item) {
                        item.spaceName= item.spaceName && $sce.trustAsHtml(item.spaceName.split(",").map(function (v,i) {
                            return (i+1)+'.'+v;
                        }).join('<br>'));
                        return item;
                    })
                }
                $scope.pageModel = pageModel;
            });
        };
        $scope.seeDataInform=function (item) {
           /* $rootScope.currentItem=item;*/
            sessionStorage.setItem("pointId",item.pointId);
            /*sessionStorage.setItem("parkId",$scope.search.parkId);
            sessionStorage.setItem("parkName",$scope.search.PARK_NAME);*/
          /*  $rootScope.parkId=$scope.search.parkId;*/
            // $state.go('three',{folder:'energy',catalogue:'measureDataManage',page:'dataInform'});
            $rootScope.target('energy/measureDataManage/dataInform','计量点数据详情',false,'',{id:item.pointId},'energy/measureDataManage/dataInform')
        };

        // 导出用电负荷统计表
        $scope.exportPowerLoad = function () {
            window.location.href = "/ovu-energy/energy/loadStatistical/export";
        }
    });
})(angular)
