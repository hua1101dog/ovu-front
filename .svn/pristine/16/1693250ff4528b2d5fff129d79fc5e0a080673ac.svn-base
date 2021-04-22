// 变配电数值报表

(function (angular) {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('distributionFormCtrl', function ($scope, $rootScope, $uibModal,$sce, $state, $http, $filter, fac){
        document.title='变配电数值报表';
        $scope.search={};
        $scope.pageModel={};
        $scope.fn=function () {
            selectClassify();
            $scope.find();
        }
        var startTime=moment().subtract(1, 'months').format('YYYY-MM-DD');
        var endTime=moment().format('YYYY-MM-DD');
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
        }

		$scope.changeCategory = function (id) {
            $http.post("/ovu-energy/energy/item/list", {
                classifyId: id
            }, fac.postConfig).success(function (data) {
                $scope.fenXiangList = data.data;
            });
        }

        $scope.find=function (pageNo) {
            $.extend($scope.search, {currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10});
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-energy/energy/report/transformer/value", $scope.search, function (data) {
                var pageModel = data;
                $scope.pageModel = pageModel;
            });
        }
        $scope.exportForm=function () {
            var checkedItemsId='';
//          var pointIds = [];
            var checkedItems = $scope.pageModel.data.filter(function(item){
                return item.checked;
            });

            for (var i = 0; i < checkedItems.length; i++) {
                checkedItemsId+=checkedItems[i].pointId+',';
//              pointIds.push(checkedItems[i]);
            }
            checkedItemsId=(checkedItemsId.substring(checkedItemsId.length-1)===',')?checkedItemsId.substring(0,checkedItemsId.length-1):checkedItemsId;
            if(checkedItemsId!==''){
            	var url = "/ovu-energy/energy/report/transformer/export?pointStrs="+checkedItemsId;
            	if($scope.search.startTime){
            		url = url + "&startTime=" + $scope.search.startTime;
            	}
            	if($scope.search.endTime){
            		url = url + "&endTime=" + $scope.search.endTime;
            	}
            	if($scope.search.pointName){
            		url = url + "&pointName=" + $scope.search.pointName;
            	}
            	if($scope.search.property){
            		url = url + "&property=" + $scope.search.property;
            	}
            	if($scope.search.classifyId){
            		url = url + "&classifyId=" + $scope.search.classifyId;
            	}
            	if($scope.search.itemId){
            		url = url + "&itemId=" + $scope.search.itemId;
            	}
                window.location.href=url;
            }
            else {
                alert("请勾选下面条目");
            }

        }
      
    });
  
})(angular)
