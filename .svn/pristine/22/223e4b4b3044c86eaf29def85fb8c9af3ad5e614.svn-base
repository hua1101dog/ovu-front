(function () {
    var app = angular.module("angularApp");
    app.controller('projectBillFeeCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        angular.extend($rootScope, fac.dicts);
        document.title = "OVU-账单报表";
        $scope.search = {};
        $scope.pageModel = {};
        $scope.isShow = true;

        $scope.billTypeList = [
            {
                value: '1',
                title: '物业'
            },
            {
                value: '2',
                title: '生活'
            },
            {
                value: '3',
                title: '空间'
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
        // $scope.search.expenditureType = ''
        $scope.find = function (pageNo) {
            if ($scope.pageModel.currentPage) {
                delete $scope.pageModel.currentPage;
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            $scope.search.parkId = app.park.ID;
            fac.getPageResult("/ovu-park/backstage/accountDetail/list", $scope.search, function (data) {
                $scope.pageModel = data;

            });
        };

        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find();
            })
        });
        $scope.prompt = function (item) {
            fac.getResult("/ovu-park/backstage/accountDetail/getPay", {text: '催缴'}, function (code) {
                window.msg("已催缴成功!");
                $scope.find();
            });
        }

        $scope.changeExpenditureType=function () {
            fac.getResult("/ovu-park/backstage/expenditure/getExpenditureByType", {expenditureType: $scope.search.expenditureType}, function (success) {
                $scope.billNameList =success
            });
            
        }
    });
    app.controller('A1', function ($scope, $http, $uibModalInstance, $filter, fac, news) {
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
                fac.getResult("/ovu-park/backstage/expenditure/edit", item, function (code) {
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
