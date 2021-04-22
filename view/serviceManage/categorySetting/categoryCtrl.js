(function () {
    var app = angular.module("angularApp");
    app.controller('categorySetting', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-分类设置";
        angular.extend($rootScope, fac.dicts);
        $scope.search = {};
        $scope.pageModel = {};
        var param = {
            // edition:1,
            // status:1,
            serviceLevel: 1
        };
        //查询
        $scope.find = function (pageNo) {
        	 if($scope.pageModel.currentPage){
                 delete $scope.pageModel.currentPage;
             }
        	 $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
             $scope.search.pageIndex = $scope.search.currentPage-1;
             $scope.search.totalCount = $scope.pageModel.totalCount||0;
            $scope.search.serviceLevel=1;
            fac.getPageResult("/ovu-park/backstage/serviceManage/list", $scope.search, function (service) {
                $scope.pageModel = service;
            });
        };

        $scope.find(1);
        $scope.validate = function (item) {
            $scope.del(item.id);
        };

        $scope.del = function (id) {
            confirm("确认删除该服务分类吗?", function () {
                fac.getResult("/ovu-park/backstage/serviceManage/remove", {ids: id, edition: '1'}, function (resp) {
                    window.msg("删除成功!");
                    $scope.find();

                });
            })
        };

        //添加
        $scope.showEditModal = function (categorySetting) {
            categorySetting = categorySetting || {createrId: app.user.id, useType: 1};
            var copy = angular.extend({}, categorySetting);
            copy.isEdit = true;
            copy.isShow = false;
            createModal(copy)
        };
        //查看
        $scope.showItemModal = function (categorySetting) {
            categorySetting = categorySetting || {createrId: app.user.id};
            categorySetting.isShow = true;
            var copy = angular.extend({}, categorySetting);
            createModal(copy)
        };

        function createModal(data) {
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/serviceManage/categorySetting/modal.categorySetting.html',
                controller: 'categorySettingCtrl',
                resolve: {categorySetting: data}
            });
            modal.result.then(function () {
            	data.isShow = false;
	        	$scope.find(1);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
    });

    app.controller('categorySettingCtrl', function ($scope, $http, $uibModalInstance, $filter, $uibModal, fac, categorySetting) {
        $scope.isEdit = categorySetting.isEdit | false;
        $scope.isShow = categorySetting.isShow | false;
        $scope.item = categorySetting;
        $scope.item.useType = categorySetting.useType.toString() || '1';
        if (categorySetting.createTime) {
            //编辑的时候，重传createTime会导致异常，此处针对该bug做的前端处理
            delete $scope.item.createTime;
        }
        $scope.item.status = (categorySetting.status || 1) + '';
        $scope.item.isDevelop = (categorySetting.isDevelop || 1) + '';

        $scope.item.parentId = '10086';
        $scope.initServiceRanges = [];
        $scope.initLabels = [];

        fac.getResult("/ovu-park/backstage/serviceManage/getOrderNo", {parentId: '10086'}, function (success) {
            if (!categorySetting.orderNo) {
                $scope.item.orderNo = success.orderNo
            }
        });
        $scope.save = function (form) {
            if ($(".save").attr("disabled")) {
                return false;
            }
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            fac.getResult("/ovu-park/backstage/serviceManage/saveOrEdit", $scope.item, function (resp) {
                $uibModalInstance.close();
                window.msg("操作成功!");
            });
        };


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

})();
