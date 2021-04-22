(function () {
    var app = angular.module("angularApp");
    app.controller('demandOrderCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        angular.extend($rootScope, fac.dicts);
        document.title = "OVU-订单管理";
        $scope.search = {};
        $scope.industryModel = {};
        $scope.parentIndustryCode = '';
        $scope.customerUserModel = {};
        $scope.pageModel = {};
        fac.loadSelect($scope, "INDUSTRY");
        $scope.find = function (pageNo) {
            if (fac.isNotEmpty($scope.parentIndustryCode) && fac.isEmpty($scope.search.industry)) {
                $('.childSelect').addClass('selectInvalid');
                return false;
            } else {
                $('.childSelect').removeClass('selectInvalid');
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;

            fac.getPageResult("/ovu-park/backstage/crowdSource/order/list", $scope.search, function (data) {
                $scope.pageModel = data;
                fac.loadIndustryList($scope);
                $http.post("/ovu-base/ovupark/web/industry/queryIndustryList", {
                    "grade": 1
                }).success(function (data) {
                    var jsonObject = angular.fromJson(data);
                    $scope.industryList = jsonObject.data;
                    angular.forEach($scope.pageModel.data, function (obj, index) {
                        angular.forEach($scope.industryList, function (industryObj) {
                            if (obj.crowdSourceDemand.industry === industryObj.industryCode) {
                                $scope.pageModel.data[index].industryName = industryObj.industryName;
                            }
                        });
                    });
                });
            });
        };

        //获取一级行业类型
        $scope.parentIndustryList = function () {
            $http.post("/ovu-base/ovupark/web/industry/queryIndustryList", {
                grade: 0
            }, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $scope.parentIndustryList = resp.data;
                }
            });
        }
        //获取一级行业下对应父行业的行业类型列表
        $scope.getIndustryList = function (parentIndustryCode) {
            if (fac.isEmpty(parentIndustryCode)) {
                $('.childSelect').removeClass('selectInvalid');
                $scope.industryList = [];
                // $scope.search.industryCode = '';
            } else {
                $http.post("/ovu-base/ovupark/web/industry/queryIndustryByParentCode", {
                    parentCode: $scope.parentIndustryCode
                }, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        // $scope.search.industryCode = '';
                        $scope.industryList = resp.data;
                    }
                });
            }
        }

        /**
         * 设置标题
         */
        $scope.convertTitle = function (title) {
            if (fac.isEmpty(title)) {
                title = '--';
            } else {
                if (title.length > 16) {
                    title = title.substring(0, 16) + "...";
                }
            }
            return title;
        }

        /**
         * 查看订单
         */
        $scope.showApproveModal = function (order) {
            order = order || {};
            var copy = angular.extend({}, order);
            var modal = $uibModal.open({
                animation: true,
                size: 'md',
                templateUrl: '/view/crowdSource/order/modal.orderDetails.html',
                controller: 'viewOrderCtrl',
                resolve: {
                    order: copy
                },
                backdrop: 'static',
                keyboard: false
            });
            modal.result.then(function () {

            }, function () {
                console.info('Modal approveDemandCtrl dismissed at: ' + new Date());
            });
        };
        $scope.find();
    });

    app.controller('viewOrderCtrl', function ($scope, $http, $uibModalInstance, $filter, fac, order, $uibModal) {
        $scope.item = order;
        $scope.allSolution = [{
                name: '技术咨询',
                id: 1
            },
            {
                name: '技术培训',
                id: 2
            },
            {
                name: '方案设计',
                id: 3
            },
            {
                name: '技术转让/许可',
                id: 4
            },
            {
                name: '委托/合作开发',
                id: 5
            },
            {
                name: '其他',
                id: 6
            }
        ]
        $scope.downLoad = function (url) {
            window.open(url);
        }
        // 换算需求解决方式
        $scope.solution = function (str) {
            var strs = '';
            $scope.allSolution.forEach(function (park) {
                if (str.indexOf(park.id) != -1) {
                    strs += park.name + ',';
                }
            })
            strs = strs.slice(0, strs.length - 1)
            return strs
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

})()
