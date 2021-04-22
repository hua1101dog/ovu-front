(function () {
    var app = angular.module("angularApp");
    app.controller('labelManageCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        angular.extend($rootScope, fac.dicts);
        document.title = "OVU-标签管理";
        $scope.search = {};
        $scope.pageModel = {};

        $scope.find = function (pageNo) {
            if ($scope.pageModel.currentPage) {
                delete $scope.pageModel.currentPage;
            }

            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            fac.getPageResult("/ovu-park/backstage/parkSteward/label/listByParm", $scope.search, function (data) {
            	$scope.pageModel = data;
            });
        };

        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find(1);
            })
        });
        $scope.query = function(){
        	fac.initPage($scope, function () {
                $scope.find(1);
            })
        }
        //删除实体项目
        $scope.del = function (item) {
            confirm("确定删除 " + item.name, function () {
                fac.getResult("/ovu-park/backstage/parkSteward/label/remove", {ids: item.id}, function (data) {
                    window.msg("删除成功!");
                    $scope.find();
                });
            })
        }
        $scope.switchItem = function (item) {
            fac.getResult("/ovu-park/backstage/parkSteward/label/updateEnabled", {
                id: item.id,
                enabled: item.enabled == "1" ? '2' : '1',
                parkId: app.park.parkId
            }, function (code) {
                window.msg(item.enabled == "1" ? "停用成功!" : "启用成功!");
                $scope.find();
            });
        }

        //新增/编辑
        $scope.showItem = function (news) {
            var copy = angular.extend({}, news);
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/adminPark/labelManage/modal.html',
                controller: 'A1',
                resolve: {news: copy}
            });
            modal.result.then(function () {
                if ($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1) {
                    $scope.pageModel.currentPage = $scope.pageModel.currentPage - 1;
                }
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

    });
    app.controller('A1', function ($scope, $http, $uibModalInstance, $filter, fac, news) {
        $scope.item = news;
        $scope.saveItem = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            if (item.id) {
            	var params = { createrId: news.createrId,
	                        name: $scope.item.name,
	                        parkId: app.park.parkId,
	                        enabled: news.enabled,
	                        id: item.id};
            	 $.post("/ovu-park/backstage/parkSteward/label/saveOrEdit", params, function(resp){
          		   if(resp.code == 0){
                 		window.msg("修改成功!");
                         $uibModalInstance.close();
                 	}else{
                 		alert(resp.message);
                 	}
                 });
            }
            if (!item.id) {
            	var params = {createrId: app.user.id,
		                    name: $scope.item.name,
		                    parkId: app.park.parkId,
		                    enabled: 0};
        	   $.post("/ovu-park/backstage/parkSteward/label/saveOrEdit", params, function(resp){
        		   if(resp.code == 0){
               		window.msg("新增成功!");
                       $uibModalInstance.close();
               	}else{
               		alert(resp.message);
               	}
               });
            }
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})();
