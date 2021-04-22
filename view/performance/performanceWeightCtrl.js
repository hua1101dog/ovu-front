/**
 * @author  ghostsf
 * @date 2017-12-06
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");

    app.controller('performanceWeightCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "定义权重";
        $scope.pageModel = {};
        $scope.search = {};

        app.modulePromiss.then(function () {
            /*if (!('parkId' in $scope.search) && !$scope.search.parkId) {
                alert("请先选定一个项目");
            } else {
                $scope.find();
            }*/
           //集团版、项目版合并，监控部门变化
            $scope.$watch('dept', function (dept, oldValue) {
            	if(!$scope.search){
            		$scope.search = {};
            	}
                if(dept.id != $scope.search.deptId){
                	$scope.search.deptId = dept.id;
                }
                if($scope.search.deptId){
                	$scope.find();
                }else{
                	$scope.pageModel.list = [];
                	$scope.pageModel.totalCount = 0;
                	$scope.pageModel.totalPage = 1;
                }
                /*else{
                	alert("请先选定一个部门");
                }*/
            },true)
        })

        $scope.find = function (pageNo) {
        	if(!$scope.search.deptId){
        		alert("请选择部门");
        		return;
        	}
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-pcos/pcos/performance/weight/queryByPage.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        $scope.doSearch = function () {
            $scope.find();
        };

        //是否为正整数
        function isPositiveNum(s) {
            var re = /^[0-9]+$/;
            return re.test(s)
        }

        $scope.save = function (item) {
            if (item.emergency_weight == null || item.emergency_weight == "") {
                alert("应急工单权重没填");
                return;
            }
            if (item.plan_weight == null || item.plan_weight == "") {
                alert("计划工单权重没填");
                return;
            }
            if (item.spontaneous_weight == null || item.spontaneous_weight == "") {
                alert("自发工单权重没填");
                return;
            }
            if (!isPositiveNum(item.emergency_weight) || !isPositiveNum(item.plan_weight) || !isPositiveNum(item.spontaneous_weight)) {
                alert("权重值应为正整数");
                return;
            }
            var total = parseInt(item.emergency_weight) + parseInt(item.plan_weight) + parseInt(item.spontaneous_weight);
            if ((total) !== 100) {
                alert("权重值总和应为100");
                return;
            }
            var param = {};
            param.dept_id = item.deptId;
            if (!('id' in item)) {
                param.id = "";
            } else {
                param.id = item.id;
            }
            param.emergency_weight = item.emergency_weight;
            param.plan_weight = item.plan_weight;
            param.spontaneous_weight = item.spontaneous_weight;
            $http.post("/ovu-pcos/pcos/performance/weight/saveOrUpdate.do", param, fac.postConfig).success(function (resp, status, headers, config) {
                if (resp.success) {
                    msg("保存成功!");
                } else {
                    alert(resp.error);
                }
            })
        }

    });

})();
