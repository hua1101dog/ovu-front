(function() {
        var app = angular.module("angularApp");
        //项目架构ctl
        app.controller('monthRunReportController', function($scope, $rootScope,
                $http, $filter, $uibModal, fac) {
        	document.title = "OVU-企业运营月报统计报表";
            angular.extend($rootScope, fac.dicts);
            $rootScope.search = {
                parkId : app.park.ID
            };
            $rootScope.houseIdTypes = {};
            $scope.pageModel = {};

            //判断是否选中项目
            function hasActivePark() {
                if (!$rootScope.search.parkId) {
                    alert("请选择项目！");
                    return false;
                } else {
                    return true;
                }
            }

            //查询
            $scope.find = function(pageNo) {
                var pag = {
                    currentPage : pageNo || $scope.pageModel.currentPage || 1,
                    pageSize : $scope.pageModel.pageSize || 10
                };
                $.extend($scope.search, pag);
                $scope.search.pageIndex = $scope.search.currentPage - 1;
                $scope.search.totalCount = $scope.pageModel.totalCount || 0;
                fac.getPageResult("/ovu-base/ovupark/backstage/customerRunReport/listCompanyRunReportByGrid",$scope.search,function(data){
            		$scope.pageModel = data;
                });
            }
            
            //切换园区的时候重新进行一次查询，防止parkId丢失
            hasActivePark() && app.modulePromiss.then(function() {
                fac.initPage($scope,function(){
                	$scope.find();
                })
            });
        });
    })()