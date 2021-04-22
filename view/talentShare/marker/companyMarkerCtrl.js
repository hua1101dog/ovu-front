/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('companyMarkerCtrl', function($scope, $rootScope, $http, $filter, $uibModal, $timeout, fac) {
        document.title = "OVU-标签管理";
        $scope.pageModel = {};
        $scope.search = {};

        $scope.find = function(pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-park/backstage/talentShare/marker/list", $scope.search, function(data) {
                $scope.pageModel = data;
            });
        };
        
        $scope.find(1);

        //批量删除
        $scope.delAll = function() {
            var ids = $scope.pageModel.list.reduce(function(ret, n) {
                n.checked && ret.push(n.id);
                return ret
            }, []);
            if (ids.length == 0) {
                alert("请选择要删除的标签！");
                return;
            }
            dodel(ids.join());
        };
        $scope.del = function(item) {
            dodel(item.id);
        };

        function dodel(ids) {
            confirm("确认删除标签吗?", function() {
            	var param = { "ids": ids };
            	$http.post("/ovu-park/backstage/talentShare/marker/batchRemove", param, fac.postConfig).success(function (resp) {
            		if (resp.code == 0) {
                        $scope.find(1);
                    } else {
                        alert(resp.message);
                    }
            	});
            });
        }
       
        $scope.showEditModal = function(item) {
           /* if (!fac.hasOnlyPark($scope.search)) {
                return;
            }*/
        	var mark = {}; 
        	angular.copy(item, mark);
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/talentShare/marker/modal.editMarker.html',
                controller: 'editMarkerCtrl',
                resolve: { marker: mark}
            });
            modal.result.then(function() {
                $scope.find();
            }, function() {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
    });

    app.controller('editMarkerCtrl', function($scope, $rootScope, $http, $uibModalInstance, $filter, fac, marker) {
    	$scope.item = marker;
    	if (marker.hasOwnProperty("id") && marker.id) {
    		$scope.edit = true; 
    	} else {
    		$scope.edit = false;
    	}
    	
        $scope.save = function(form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            $scope.data = {}; 
            angular.copy(item, $scope.data);
            $scope.data.userId = app.user.id;
            $http.post("/ovu-park/backstage/talentShare/marker/save", $scope.data, fac.postConfig).success(function(resp) {
                if (resp.code == 0) {
                    $uibModalInstance.close();
                    msg("保存成功!");
                } else {
                    alert(resp.message);
                }
            })
        }

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    });
})();
