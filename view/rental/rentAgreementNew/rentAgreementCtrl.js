/*
     -1:草稿
     0:待提交,              编辑  提交  合同预览
     1:待审批,              审批        合同预览
     2:审批通过,执行中 ,      终止       合同预览
     3:已驳回,              编辑  提交  合同预览
     4:合同终止,            合同预览
     5:合同结束                                 合同预览
*/
/**生成账单约定:createBillModel 
 *  1:按合同生成账单
 *  2:按租赁资源生成账单
 */

(function () {
    var app = angular.module("angularApp");
    app.directive('wdatePicker', function () {
        return {
            restrict: "A",
            link: function (scope, element, attr) {
                element.bind('click', function () {
                    window.WdatePicker({
                        onpicked: function () {
                            element.change()
                        },
                        oncleared: function () {
                            element.change()
                        }
                    })
                });
            }
        }
    });
    app.controller('rentAgreementCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $location, fac) {
        document.title = "OVU-租赁合同";
        $scope.contractStatus = [{
                name: "草稿",
                id: "-1"
            },
            {
                name: "待提交",
                id: "0"
            },
            {
                name: "待审批",
                id: "1"
            },
            {
                name: "执行中",
                id: "2"
            },
            {
                name: "已驳回",
                id: "3"
            },
            {
                name: "已终止",
                id: "4"
            },
            {
                name: "已结束",
                id: "5"
            }
        ]
        // 排序状态值
        $scope.sortStatusCopy = {
            createTimeSort: -1,
            leaseStartSort: -1,
            leaseEndSort: -1
        }
        $scope.sortStatus = {
            createTimeSort: -1,
            leaseStartSort: -1,
            leaseEndSort: -1
        }
        $scope.search = {};
        $scope.pageModel = {};
        $scope.find = function (pageNo) {
            console.log($scope.search)
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            fac.getPageResult("/ovu-park/backstage/rental/contractBaseInfo/getContractListByPage", $scope.search, function (data) {
                console.log(data);
                $scope.pageModel = data;
            });
        };
        $scope.sort = function (key, value) {
            $scope.sortStatus = angular.copy($scope.sortStatusCopy);
            $scope.sortStatus[key] = value;
            delete $scope.search.createTimeSort;
            delete $scope.search.leaseStartSort;
            delete $scope.search.leaseEndSort;
            $scope.search[key] = value;
            $scope.find(1);
        }
        // 新增和编辑合同
        $scope.addEditAgreement = function (item) {
            let curId = {}
            if (item && item.id) {
                curId = item;
            }
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/rental/rentAgreementNew/addAgreement.html',
                controller: 'addAgreementCtrl',
                resolve: {
                    curContractId: curId
                }
            });
            modal.result.then(function (data) {
                $scope.find();
            }, function () {
                $scope.find();
            });
        }
        // 合同审批
        $scope.examAgreement = function (id, status) {
            $rootScope.target("rental/rentAgreementNew/examAgreement", "审批合同", false, '', {
                'id': id,
                "status": status
            }, "rental/rentAgreementNew/examAgreement");
        }
        // 合同预览
        $scope.lookAgreement = function (item) {
            $rootScope.target("rental/rentAgreementNew/lookAgreement", "预览合同", false, '', {
                "id": item.id, "createBillModel": item.createBillModel, "status": item.status
            }, "rental/rentAgreementNew/lookAgreement");
        }
        // 终止合同
        $scope.endAgreement = function (id) {
            $rootScope.target("rental/rentAgreementNew/endAgreement", "终止合同", false, '', {
                "id": id
            }, "rental/rentAgreementNew/endAgreement");
        }
        // 提交合同
        $scope.submitContract = function (id) {
            confirm("确认提交该合同审批", function () {
                $.post("/ovu-park/backstage/rental/contractBaseInfo/submit", {
                    id: id,
                    status: 0
                }, function (resp) {
                    if (resp.code == 0) {
                        window.msg("成功提交该合同");
                        $scope.find();
                    } else {
                        window.alert(resp.msg);
                    }
                });
            })
        }
        // 删除合同
        $scope.delAgreement = function (id) {
            confirm("确认删除该合同", function () {
                $.post("/ovu-park/backstage/rental/contractBaseInfo/deleteContract", {
                    'contractId': id
                }, function (resp) {
                    if (resp.code == 0) {
                        window.msg("成功删除合同");
                        $scope.find();
                    } else {
                        window.alert(resp.msg);
                    }
                });
            })
        }

        // 更新合同附件
        $scope.updateContractFile = function (item) {
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/rental/rentAgreementNew/modal.updateContractFile.html',
                controller: 'updateContractFileCtrl',
                resolve: {
                    curItem: item
                }
            });
            modal.result.then(function (data) {
                $scope.find();
            }, function () {
                $scope.find();
            });
        }
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find();
            })
        });
    });

    app.controller('rentAgreementCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $location, fac) {
        document.title = "OVU-租赁合同";
        $scope.contractStatus = [{
                name: "草稿",
                id: "-1"
            },
            {
                name: "待提交",
                id: "0"
            },
            {
                name: "待审批",
                id: "1"
            },
            {
                name: "执行中",
                id: "2"
            },
            {
                name: "已驳回",
                id: "3"
            },
            {
                name: "已终止",
                id: "4"
            },
            {
                name: "已结束",
                id: "5"
            }
        ]
        // 排序状态值
        $scope.sortStatusCopy = {
            createTimeSort: -1,
            leaseStartSort: -1,
            leaseEndSort: -1
        }
        $scope.sortStatus = {
            createTimeSort: -1,
            leaseStartSort: -1,
            leaseEndSort: -1
        }
        $scope.search = {};
        $scope.pageModel = {};
        $scope.find = function (pageNo) {
            console.log($scope.search)
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            fac.getPageResult("/ovu-park/backstage/rental/contractBaseInfo/getContractListByPage", $scope.search, function (data) {
                console.log(data);
                $scope.pageModel = data;
            });
        };
        $scope.sort = function (key, value) {
            $scope.sortStatus = angular.copy($scope.sortStatusCopy);
            $scope.sortStatus[key] = value;
            delete $scope.search.createTimeSort;
            delete $scope.search.leaseStartSort;
            delete $scope.search.leaseEndSort;
            $scope.search[key] = value;
            $scope.find(1);
        }
        // 新增和编辑合同
        $scope.addEditAgreement = function (item) {
            let curId = {}
            if (item && item.id) {
                curId = item;
            }
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/rental/rentAgreementNew/addAgreement.html',
                controller: 'addAgreementCtrl',
                resolve: {
                    curContractId: curId
                }
            });
            modal.result.then(function (data) {
                $scope.find();
            }, function () {
                $scope.find();
            });
        }
        // 合同审批
        $scope.examAgreement = function (id, status) {
            $rootScope.target("rental/rentAgreementNew/examAgreement", "审批合同", false, '', {
                'id': id,
                "status": status
            }, "rental/rentAgreementNew/examAgreement");
        }
        // 合同预览
        $scope.lookAgreement = function (item) {
            $rootScope.target("rental/rentAgreementNew/lookAgreement", "预览合同", false, '', {
                "id": item.id, "createBillModel": item.createBillModel, "status": item.status
            }, "rental/rentAgreementNew/lookAgreement");
        }
        // 终止合同
        $scope.endAgreement = function (id) {
            $rootScope.target("rental/rentAgreementNew/endAgreement", "终止合同", false, '', {
                "id": id
            }, "rental/rentAgreementNew/endAgreement");
        }
        // 提交合同
        $scope.submitContract = function (id) {
            confirm("确认提交该合同审批", function () {
                $.post("/ovu-park/backstage/rental/contractBaseInfo/submit", {
                    id: id,
                    status: 0
                }, function (resp) {
                    if (resp.code == 0) {
                        window.msg("成功提交该合同");
                        $scope.find();
                    } else {
                        window.alert(resp.msg);
                    }
                });
            })
        }
        // 删除合同
        $scope.delAgreement = function (id) {
            confirm("确认删除该合同", function () {
                $.post("/ovu-park/backstage/rental/contractBaseInfo/deleteContract", {
                    'contractId': id
                }, function (resp) {
                    if (resp.code == 0) {
                        window.msg("成功删除合同");
                        $scope.find();
                    } else {
                        window.alert(resp.msg);
                    }
                });
            })
        }

        // 更新合同附件
        $scope.updateContractFile = function (item) {
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/rental/rentAgreementNew/modal.updateContractFile.html',
                controller: 'updateContractFileCtrl',
                resolve: {
                    curItem: item
                }
            });
            modal.result.then(function (data) {
                $scope.find();
            }, function () {
                $scope.find();
            });
        }
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find();
            })
        });
    });

    // app.controller('addAgreementCtrl', function ($scope, $rootScope, $http, $filter, $uibModalInstance, $location, fac, curItem) {
    //     console.log("打开编辑租赁合同----------------")
    // });
    // 合同来源
    app.filter("contractSource", function () {
        return function (status) {
            switch (status) {
                case 1:
                    return '标准租赁';
                    break;
                case 2:
                    return '租房申请';
                    break;
            }
        }
    })

    // 创建时间-格式化
    app.filter("formateDate", function () {
        return function (createTime) {
            var date = new Date(createTime);
            return date;
        }
    })

})()
