var app = angular.module("angularApp");
app.controller('projectIntegralCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    angular.extend($rootScope, fac.dicts);
    document.title = "OVU-兑换管理";
    $scope.search = {};
    $scope.pageModel = {};
    $scope.isShow = true;

    $scope.find = function (pageNo) {
        if ($scope.pageModel.currentPage) {
            delete $scope.pageModel.currentPage;
        }

        var request = {
            mainType: $scope.search.mainType ? parseInt($scope.search.mainType) : '',
            customerName: $scope.search.customerName || '',
            integralStatus: $scope.search.integralStatus ? parseInt($scope.search.integralStatus) : '',
            pageIndex: $scope.search.currentPage - 1,
            totalCount: $scope.pageModel.totalCount || 0,
            currentPage: pageNo || $scope.pageModel.currentPage || 1,
            pageSize: $scope.pageModel.pageSize || 10,
            parkId: app.park.parkId
        }
        fac.getPageResult("/ovu-park/backstage/accountDetail/listIntegral", request, function (data) {
            angular.forEach(data.data, function (d, i, a) {
                switch (parseInt(d.expenditureType)) {
                    case 1:
                        d.expenditureTypeName = '物业费';
                        break;
                    case 2:
                        d.expenditureTypeName = '生活费';
                        break;
                    case 3:
                        d.expenditureTypeName = '空间费';
                        break;
                    case 4:
                        d.expenditureTypeName = '商品费';
                        break;
                    case 5:
                        d.expenditureTypeName = '众包费';
                        break;
                    case 6:
                        d.expenditureTypeName = '住宿费';
                        break;
                }
            })
            $scope.pageModel = data;

        });
    };

    app.modulePromiss.then(function () {
        fac.initPage($scope, function () {
            $scope.find();
        })
    });
    $scope.query = function(){
    	if(!fac.checkPark($scope)){
    		return
    	}else{
    		$scope.find(1);
    	}
    }
    //删除实体项目
    $scope.del = function (item) {
        confirm("确定删除 " + item.expenditureName, function () {

            fac.getResult("/ovu-park/backstage/expenditure/remove", {id: item.id}, function (data) {
                window.msg("删除成功!");
                $scope.find();
            });
        })
    }
    $scope.switchItem = function (item) {
        fac.getResult("/ovu-park/backstage/expenditure/startOrStopStatus", {
            id: item.id,
            status: item.status == "2" ? '0' : '2'
        }, function (data) {
            window.msg(item.status == "2" ? "停用" : '启用' + "成功!");
            $scope.find();
        });
    }

    //新增/编辑
    $scope.showItem = function (news) {
        var copy = angular.extend({}, news);
        var modal = $uibModal.open({
            animation: false,
            size: 'md',
            templateUrl: '/view/projectSpace/projectIntegral/modal.html',
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
app.controller('A1', function ($scope, $http, $uibModalInstance, $filter, fac, news, $uibModal) {
    console.log(news)
    $scope.item = news;
    $scope.item.expenditureType = news.expenditureType ? news.expenditureType + '' : '1'
    $scope.doAction = function (item, type) {
        var data = {
            id: item.id,
            customerUserId: item.customerUserId,
            billName: item.expenditureName,
            amount: item.amount
        }
        switch (type) {
            case 'pass':
                data.isPass = true;
                break;
            case'refuse':
                data.isPass = false;
                break;
        }
        fac.getResult("/ovu-park/backstage/accountDetail/getIntegral", data, function (code) {
            window.msg("操作成功!");
            $uibModalInstance.close();
        });
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    // 查看图片
    $scope.showPhotoEditModal = function (photos) {
        var copy = angular.extend({}, photos);
        var modalInstance = $uibModal.open({
            size: 'md',
            animation: true,
            templateUrl: '/view/operationManage/releaseManage/modal.showPhoto.html',
            controller: 'showYardPhotoCtrl',
            resolve: {photos: copy}
        });
    }

});
// 查看图片
app.controller('showYardPhotoCtrl', function ($scope, $http, $uibModalInstance, fac, photos) {
    if (photos) {
        // console.log(photos)
        $scope.carouselPhotos = photos;
    }
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
