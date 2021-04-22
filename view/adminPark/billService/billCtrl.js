(function () {
    var app = angular.module("angularApp");
    // 水费账单
    app.controller('walterBillCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-账单管理";
        angular.extend($rootScope, fac.dicts);
        $scope.search = {};
        $scope.pageModel = {};
        // 获取列表
        $scope.find = function (pageNo) {
            if (!app.park || !app.park.ID) {
                window.msg("请先选择一个项目!");
                return false;
            }
            $scope.search.parkId = app.park.ID;
            // if($scope.pageModel.currentPage){
            //     delete $scope.pageModel.currentPage;
            // }
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;

            fac.getPageResult("/ovu-park/backstage/waterBill/list", $scope.search, function (resp) {
                $scope.pageModel = resp;
            });
        }

        // 详情
        $scope.detail = function (waterBill) {

            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/adminPark/billService/modal.walterDetail.html',
                controller: 'walterBillDetailCtrl',
                resolve: {waterBill: waterBill}
            });
        }
        // 催单
        $scope.reminder = function (waterBill) {
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/adminPark/billService/modal.reminder.html',
                controller: 'reminderWaterCtrl',
                resolve: {waterBill: waterBill}
            });
            modal.result.then(function (result) {
                $scope.find();
            }, function (reason) {
                $scope.find();
                $modalInstance.dismiss('cancel');
            });
        }
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find();
            })
        });

    });
    // 水费账单 - 详情
    app.controller('walterBillDetailCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $uibModalInstance, fac, waterBill) {
        angular.extend($rootScope, fac.dicts);
        $scope.search = waterBill;
        $scope.pageModel = {};

        $scope.find = function (pageNo) {
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;

            $("#toolbarTr").prevAll().remove();
            $("#tableloading").removeClass("hide");
            delete $scope.search.customerId;
            fac.getPageResult("/ovu-park/backstage/waterBill/listDetails", $scope.search, function (data) {
                $("#tableloading").addClass("hide");
                $scope.pageModel = data;
            });
        };

        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find();
            })
        });

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    // 水费账单 - 催收
    app.controller('reminderWaterCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $uibModalInstance, fac, waterBill) {
        $scope.bill = waterBill
        $scope.reminder = function () {
            fac.getResult("/ovu-park/backstage/waterBill/updateCollected", {
                collectedContent: $scope.bill.collectedContent,
                id: $scope.bill.id
            }, function () {
                window.msg("催收成功");
                $scope.cancel();
            });
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    // 电费账单
    app.controller('eleBillCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        angular.extend($rootScope, fac.dicts);
        $scope.search = {};
        $scope.pageModel = {};
        // 获取列表
        $scope.find = function (pageNo) {
            if (!app.park || !app.park.ID) {
                window.msg("请先选择一个项目!");
                return false;
            }
            $scope.search.parkId = app.park.ID;
            // if($scope.pageModel.currentPage){
            //     delete $scope.pageModel.currentPage;
            // }
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;

            fac.getPageResult("/ovu-park/backstage/electricityBill/list", $scope.search, function (resp) {
                $scope.pageModel = resp;
            });
        }

        // 详情
        $scope.detail = function (eleBill) {

            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/adminPark/billService/modal.eleDetail.html',
                controller: 'eleBillDetailCtrl',
                resolve: {eleBill: eleBill}
            });
        }
        // 催单

        $scope.reminder = function (eleBill) {
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/adminPark/billService/modal.reminder.html',
                controller: 'reminderEleCtrl',
                resolve: {eleBill: eleBill}
            });
            modal.result.then(function (result) {
                $scope.find();
            }, function (reason) {
                $scope.find();
                $modalInstance.dismiss('cancel');
            });
        }
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find();
            })
        });

    });
    // 电费账单 - 详情
    app.controller('eleBillDetailCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $uibModalInstance, fac, eleBill) {
        angular.extend($rootScope, fac.dicts);
        $scope.search = eleBill;
        $scope.pageModel = {};

        $scope.find = function (pageNo) {
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;

            $("#toolbarTr").prevAll().remove();
            $("#tableloading").removeClass("hide");
            delete $scope.search.customerId;
            fac.getPageResult("/ovu-park/backstage/electricityBill/listDetails", $scope.search, function (data) {
                $("#tableloading").addClass("hide");
                $scope.pageModel = data;
            });
        };

        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find();
            })
        });

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    // 电费账单 - 催收
    app.controller('reminderEleCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $uibModalInstance, fac, eleBill) {
        $scope.bill = eleBill
        $scope.reminder = function () {
            fac.getResult("/ovu-park/backstage/electricityBill/updateCollected", {
                collectedContent: $scope.bill.collectedContent,
                id: $scope.bill.id
            }, function () {
                window.msg("催收成功");
                $scope.cancel();
            });
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    // 物业费账单
    app.controller('propertyBillCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        angular.extend($rootScope, fac.dicts);
        $scope.search = {};
        $scope.pageModel = {};
        // 获取列表
        $scope.find = function (pageNo) {
            if (!app.park || !app.park.ID) {
                debugger;
                window.msg("请先选择一个项目!");
                return false;
            }
            $scope.search.parkId = app.park.ID;
            // if($scope.pageModel.currentPage){
            //     delete $scope.pageModel.currentPage;
            // }
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;

            fac.getPageResult("/ovu-park/backstage/propertyBill/list", $scope.search, function (resp) {
                $scope.pageModel = resp;
            });
        }

        // 详情
        $scope.detail = function (proBill) {

            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/adminPark/billService/modal.proDetail.html',
                controller: 'proBillDetailCtrl',
                resolve: {proBill: proBill}
            });
        }
        // 物业费账单 - 催单
        $scope.reminder = function (proBill) {
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/adminPark/billService/modal.reminder.html',
                controller: 'reminderProCtrl',
                resolve: {proBill: proBill}
            });
            modal.result.then(function (result) {
                $scope.find();
            }, function (reason) {
                $scope.find();
                $modalInstance.dismiss('cancel');
            });
        }
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find();
            })
        });

    });
    // 物业费账单 - 详情
    app.controller('proBillDetailCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $uibModalInstance, fac, proBill) {
        angular.extend($rootScope, fac.dicts);
        $scope.search = proBill;
        $scope.pageModel = {};

        $scope.find = function (pageNo) {
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;

            $("#toolbarTr").prevAll().remove();
            $("#tableloading").removeClass("hide");

            delete $scope.search.customerId;
            fac.getPageResult("/ovu-park/backstage/propertyBill/listDetails", $scope.search, function (data) {
                $("#tableloading").addClass("hide");
                $scope.pageModel = data;
            });
        };

        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find();
            })
        });

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    // 物业费账单 - 催收
    app.controller('reminderProCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $uibModalInstance, fac, proBill) {
        $scope.bill = proBill

        $scope.reminder = function () {
            fac.getResult("/ovu-park/backstage/propertyBill/updateCollected", {
                collectedContent: $scope.bill.collectedContent,
                id: $scope.bill.id
            }, function (resp) {
                window.msg("催收成功");
                $scope.cancel();
            });
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    // 能源账单
    app.controller('energeyBillCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        angular.extend($rootScope, fac.dicts);
        $scope.search = {};
        $scope.pageModel = {};
        // 获取列表
        $scope.find = function (pageNo) {
            if (!app.park || !app.park.ID) {
                debugger;
                window.msg("请先选择一个项目!");
                return false;
            }
            $scope.search.parkId = app.park.ID;
            // if($scope.pageModel.currentPage){
            //     delete $scope.pageModel.currentPage;
            // }
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;

            fac.getPageResult("/ovu-park/backstage/energyBill/list", $scope.search, function (resp) {
                $scope.pageModel = resp;
            });
        }

        // 详情
        $scope.detail = function (waterBill) {

            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/adminPark/billService/modal.enerDetail.html',
                controller: 'enerBillDetailCtrl',
                resolve: {waterBill: waterBill}
            });
        }
        // 能源账单 - 催单
        $scope.reminder = function (enerBill) {
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/adminPark/billService/modal.reminder.html',
                controller: 'reminderEnerCtrl',
                resolve: {enerBill: enerBill}
            });
            modal.result.then(function (result) {
                $scope.find();
            }, function (reason) {
                $scope.find();
                $modalInstance.dismiss('cancel');
            });
        }
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find();
            })
        });

    });
    // 物业费账单 - 催收
    app.controller('reminderEnerCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $uibModalInstance, fac, enerBill) {
        $scope.bill = enerBill
        $scope.reminder = function () {
            fac.getResult("/ovu-park/backstage/energyBill/updateCollected", {
                collectedContent: $scope.bill.collectedContent,
                id: $scope.bill.id
            }, function (resp) {
                if (resp.code) {
                    window.msg("催收成功");
                } else {
                    window.error(resp.message);
                }
                $scope.cancel();
            });
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

})()
