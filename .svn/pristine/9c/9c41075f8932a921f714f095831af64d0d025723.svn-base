(function () {
    var app = angular.module("angularApp");
    app.controller('groupBillFeeCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        angular.extend($rootScope, fac.dicts);
        document.title = "OVU-账单费项管理";
        $scope.search = {};
        $scope.pageModel = {};
        $scope.isShow = true;

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
            fac.getPageResult("/ovu-park/backstage/expenditure/list", $scope.search, function (data) {
                angular.forEach(data.data, function (d, i, a) {
                    switch (d.expenditureType) {
                        case 1:
                            d.expenditureTypeName = '物业费';
                            break;
                        case 2:
                            d.expenditureTypeName = '餐饮费';
                            break;
                        case 3:
                            d.expenditureTypeName = '生活费';
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

        /*app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	$scope.find();
            })
        });*/
        $scope.find();
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
            if (news) {
                news.isNew = 'false';
            }
            var copy = angular.extend({}, news);
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/operationManage/groupBillFee/modal.html',
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
        $scope.billTypeList = [
            {
                value: '1',
                title: '物业'
            },
            {
                value: '2',
                title: '餐饮'
            },
            {
                value: '3',
                title: '生活'
            },
            {
                value: '4',
                title: '商品'
            },
            {
                value: '5',
                title: '众包'
            },
            {
                value: '6',
                title: '住宿'
            }]
        $scope.item.expenditureType = news.expenditureType ? news.expenditureType : 1;
        $scope.changeType = function () {
            fac.getResult("/ovu-park/backstage/expenditure/getExpCodeByType", {
                expenditureType: $scope.item.expenditureType,
                flag: news.isNew ? news.isNew : 'true',
                id: $scope.item.id || ''
            }, function (code) {
                $scope.item.expenditureCode = code
            });
        }
        $scope.changeType();
        $scope.item = news;
        $scope.item.expenditureType = news.expenditureType ? news.expenditureType + '' : '1'
        $scope.saveItem = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            if (item.id) {
                fac.getResult("/ovu-park/backstage/expenditure/edit", item, function (code) {
                    window.msg("修改成功!");
                    $uibModalInstance.close();
                });
            }
            if (!item.id) {
                fac.getResult("/ovu-park/backstage/expenditure/save", item, function (code) {
                    window.msg("新增成功!");
                    $uibModalInstance.close();
                });
            }
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})();
