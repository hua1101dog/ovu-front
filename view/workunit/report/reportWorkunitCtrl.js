/**
 * Created by Administrator on 2017/7/20.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");

    app.controller('reportWorkunitCtrl', function ($scope, $rootScope, $uibModal, $http, $filter, fac) {
        document.title = "工单报表";
        $scope.search = {};
        $scope.pageModel = {};

        !$rootScope.reportTypeDict && $http.get("/workunit/report/reportDict").success(function (resp) {
            if (resp.code == 0) {
                angular.extend($rootScope, resp.data);
            }
        })

        app.modulePromiss.then(function () {
            $scope.report_deptTree = fac.getGlobalTree();
            if ($scope.report_deptTree.length) {
                $scope.search.deptId = $scope.report_deptTree[0].id;
            }
        });

        $scope.setDept = function (search, node) {
            if (node.state.selected) {
                $scope.find(1);
            }
        }

        $scope.find = function (pageNo) {
            $.extend($scope.search, { currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult("/workunit/report/queryReport", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        $scope.getTime = function (start, end) {
            var begintime_ms = Date.parse(new Date(start.replace(/-/g, "/")));

            var endtime_ms = Date.parse(new Date(end.replace(/-/g, "/")));
            return (endtime_ms - begintime_ms) / 1000;
        }



        $scope.del = function (item) {
            confirm("确认删除该报表吗?", function () {
                $http.get("/workunit/report/del?id=" + item.id).success(resp => {
                    if (resp.code == 0) {
                        $scope.find();
                    }
                });
            })
        }

        //导出
        $scope.export = function (item) {
            window.location.href = "/workunit/reportExport/export/" + item.id;
        }

        //应急报事
        $scope.showEditModal = function (item) {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/workunit/report/reportWorkunit.modal.html',
                controller: 'reportWorkunitModalCtrl'
                , resolve: { item: () => item || {} }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        //应急报事
        $scope.detail = function (item) {
            let templateUrl = "";
            switch (item.reportType) {
                case "employee": templateUrl = "/view/workunit/report/reportEmployeeDetail.modal.html"; break;
                case "fx":
                case "zn_elevator":
                case "zn_weak":
                case "zn_engineer":
                case "zn_mechanical":
                case "zn_mechanical_not_firefighting":
                case "zn_firefighting":
                case "cxbj":
                case "cxlh": templateUrl = "/view/workunit/report/reportParkForZyDetail.modal.html"; break;
                case "park": templateUrl = "/view/workunit/report/reportParkDetail.modal.html"; break;
                case "dept": templateUrl = "/view/workunit/report/reportDeptDetail.modal.html"; break;
            }
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: templateUrl,
                controller: 'reportDetailModalCtrl'
                , resolve: { item: () => item || {} }
            });
            modal.result.then(function () {
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
    });

    app.controller('reportWorkunitModalCtrl', function ($rootScope, $scope, $http, $uibModal, $uibModalInstance, $filter, fac, item) {
        $scope.item = item;
        if (item.beginTime) {
            $scope.beginTime = item.beginTime.substring(0, 10)
            $scope.endTime = item.endTime.substring(0, 10)
        }
        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            item.creator = app.user.personId;
            item.creatorName = app.user.nickname;
            item.beginTime = $scope.beginTime + ' 00:00:00'
            item.endTime = $scope.endTime + ' 23:59:59'
            $http.post("/workunit/report/saveReport", item).success(function (resp, status, headers, config) {
                if (resp.code == 0) {
                    $uibModalInstance.close();
                } else {
                    alert(resp.msg);
                }
            })
        }
    });


    app.controller('reportDetailModalCtrl', function ($rootScope, $scope, $http, $uibModal, $uibModalInstance, $filter, fac, item) {
        $http.get("/workunit/report/detail/" + item.id).success(function (resp) {
            $scope.report = resp.data;
        });
        $scope.abnormalList = function (rec, $index) {
            if (!rec.abnormalWorkunitsNum) {
                return;
            }
            $http.get("/workunit/report/abnormalList", { params: { id: $scope.report.id, index: $index } }).success((resp) => {
                if (resp.code == 0) {
                    var modal = $uibModal.open({
                        animation: false,
                        size: 'lg',
                        templateUrl: '/view/workunit/report/abnormalList.modal.html',
                        controller: 'abnormalListModalCtrl'
                        , resolve: { workunitStatics: () => resp.data }
                    });
                    modal.result.then(function () {
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    });
                }
            })
        }

        $scope.effectiveList = function (rec) {
            if (!rec.effectiveNum) {
                return;
            }
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/workunit/report/effectiveList.modal.html',
                controller: 'effectiveListModalCtrl'
                , resolve: { workunitStatics: () => rec }
            });
            modal.result.then(function () {
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }


    });

    app.controller('abnormalListModalCtrl', function ($rootScope, $scope, $http, $uibModal, $uibModalInstance, $filter, fac, workunitStatics) {
        $scope.workunitStatics = workunitStatics;

    });

    app.controller('effectiveListModalCtrl', function ($rootScope, $scope, $http, $uibModal, $uibModalInstance, $filter, fac, workunitStatics) {
        $scope.workunitStatics = workunitStatics;
    });


})();
