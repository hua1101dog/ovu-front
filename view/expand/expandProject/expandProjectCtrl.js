/**
 * Created by ghostsf on 2017/9/15.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");

    //项目管理ctrl
    app.controller('expandProjectCtrl', function ($scope, $state, $rootScope, $http, $filter, $uibModal, $location, fac) {
        document.title = "OVU-项目拓展-拓展立项";
        $scope.pageModel = {};
        $scope.search = {};

        $scope.followUpState_options = [["0", "初次接洽"], ["1", "项目跟进中"], ["2", "合同谈判中"], ["3", "签订合同"], ["4", "已确定其他物业公司"]];
        $scope.propertyManagement_options = [[0, "其他"], [1, "顾问管理"], ["2", "全权委托"]];

        app.modulePromiss.then(function () {
            $scope.search.checkState = 1;//只显示审核通过的
            $scope.search.projectState = 0;
            $scope.find();
        });

        /**
         * 切换审核状态列表
         * @param checkState
         */
        $scope.switchTab = function (checkType) {
            if (checkType == 0) {
                $scope.search.projectState = 0;
            } else {
                $scope.search.projectState = 1;
            }
            $scope.pageModel.currentPage = 1;
            $scope.find();
        }

        /**
         * 搜索查询
         * @param pageNo
         */
        $scope.find = function (pageNo) {
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-pcos/pcos/expand/expandProject/listInfo.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        /**
         * 立项
         * @param id
         */
        $scope.check = function (id) {
            var param = {
                id: id
            };
            var modal = $uibModal.open({
                animation: true,
                templateUrl: 'expand/expandProject/modal.check.html',
                controller: 'approvalCtrl'
                , resolve: {param: param}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }


        /**
         * 跟进日志
         * @param id
         */
        $scope.visitingModal = function (id) {
            var param = {
                id: id
            };
            var modal = $uibModal.open({
                animation: true,
                templateUrl: 'expand/expandProject/modal.visiting.html',
                controller: 'visitingCtrl'
                , resolve: {param: param}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        /**
         * 编辑状态
         * @param id
         */
        $scope.editstate = function (id) {
            var param = {
                id: id
            };
            var modal = $uibModal.open({
                animation: true,
                templateUrl: 'expand/expandProject/modal.editstate.html',
                controller: 'editstateCtrl'
                , resolve: {param: param}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        /**
         * 查看报价单
         * @param id
         */
        $scope.catreport = function (id) {
          var param = {
            id: id,
            isEdit:false,
            canExport:true
          };
          var modal = $uibModal.open({
            animation: true,
            size: 'lg',
            templateUrl: 'expand/report/modal.list.html',
            controller: 'costReportModalCtrl'
            , resolve: {param: param}
          });
          modal.result.then(function () {
          }, function () {
            console.info('Modal dismissed at: ' + new Date());
          });
        };

    });

    app.controller('catreportCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, param) {
        $scope.config = {edit: false};//左侧树不可编辑

        $scope.canExport = true;
        $scope.item = {};//form实体
        $scope.pays = [];//支付列表
        $scope.earning = {};//收入表
        $scope.log = {};//报价版本
        var costList = [];

        getTypeTree();

        var url = "/ovu-pcos/extend/report/getProjectCosts.do?id=" + param.id;

        $http.get(url).success(function (data) {
            $scope.pays = data.pays;
            $scope.earning = data.earning;
            $scope.item = data.project;
            $scope.log = data.log;
        });

        $scope.selectNode = function (node) {
            if ($scope.curNode != node) {
                $scope.curNode && $scope.curNode.state && ($scope.curNode.state.selected = false);
            }
            node.state = node.state || {};
            node.state.selected = !node.state.selected;
            if (node.state.selected) {
                $scope.curNode = node;
                changeNode(node);
            } else {
                delete $scope.curNode;
            }
            changeNode($scope.curNode);
        }


        function changeNode(node) {
            if (node) {
                $scope.costs = costList.reduce(function (ret, n) {
                    (n.fid == node.id) && ret.push(n);
                    return ret;
                }, []);
            }
        }

        function getTypeTree() {
            $http.get("/ovu-pcos/extend/report/typeTopTree.do").success(function (data) {
                $scope.treeData = data;
            });
        }

        getprovercost();

        function getprovercost() {
            $http.post("/ovu-pcos/extend/report/listprovercost.do", {projectId: param.id, versionId: param.versionId}, fac.postConfig).success(function (data) {
                costList = data;
            });
        }

        $scope.export = function () {
            var projectId = $scope.log.project_id;
            var versionId = $scope.log.version_id;

            var elemIF = document.createElement("iframe");
            elemIF.src = "/ovu-pcos/extend/report/export.do?projectId=" + projectId + "&versionId=" + versionId;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });


    /**
     * 立项
     */
    app.controller('approvalCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, param) {
        $scope.item = {
            projectId: param.id,
            remarks: ""
        };

        /**
         * 选择跟进人员
         */
        $scope.choosePerson = function () {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/common/modal.select.person.html',
                controller: 'personSelectorCtrl'
                , resolve: {
                    data: {
                        parkId: '',
                        onlyOne: true
                    }
                }
            });
            modal.result.then(function (data) {
                if (data) {
                    $scope.item.followUpPeopleId = data.per_Id;
                    $scope.item.followUpPeopleName = data.per_Name;
                    $scope.$apply();
                }
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }


        /**
         * 确认立项
         * @param form
         * @param item
         */
        $scope.saveprojectApproval = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            $http.post("/ovu-pcos//pcos/expand/expandProject/projectApprova.do", item, fac.postConfig).success(function (data, status, headers, config) {
                console.log("data:" + data);
                if (data.state == "success") {
                    msg("立项成功!");
                    $uibModalInstance.close();
                } else {
                    alert(data.state);
                }
            })
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    /**
     * 跟进日志
     */
    app.controller('visitingCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, param) {
        $scope.item = {
            projectId: param.id,
            followupDetails: ""
        };
        $scope.projectInfo = {};
        $scope.visitingLogs = {};

        $scope.followUpState_options = [["0", "初次接洽"], ["1", "项目跟进中"], ["2", "合同谈判中"], ["3", "签订合同"], ["4", "已确定其他物业公司"]];

        if (fac.isNotEmpty(param.id)) {
            $http.get("/ovu-pcos/pcos/expand/project/get.do?projectID=" + param.id).success(function (data) {
                if (data.state == "success") {
                    $scope.projectInfo = data.data;
                    $http.get("/ovu-pcos/pcos/expand/expandProject/getCustomerLog.do?projectID=" + param.id).success(function (data) {
                        if (data.state == "success") {
                            $scope.visitingLogs = data.data;
                        } else {
                            alert(data.state);
                        }
                    });
                } else {
                    alert(data.state);
                }
            })
        }

        /**
         * 选择跟进人员
         */
        $scope.choosePerson = function () {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/common/modal.select.person.html',
                controller: 'personSelectorCtrl'
                , resolve: {
                    data: {
                        parkId: '',
                        onlyOne: true
                    }
                }
            });
            modal.result.then(function (data) {
                if (data) {
                    $scope.item.followupUserid = data.per_Id;
                    $scope.item.followupUsername = data.per_Name;
                    $scope.$apply();
                }
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        /**
         * 被拜访人（该项目的客户的联系人）选择器
         */
        $scope.chooseCustomer = function (projectId) {
            var modal = $uibModal.open({
                animation: false,
                templateUrl: 'expand/expandProject/modal.select.customer.html',
                controller: 'customerSelectorCtrl',
                resolve: {
                    projectId: projectId
                }
            });
            modal.result.then(function (data) {
                console.log(data);
                if (data) {
                    $scope.item.byvisitingUserid = data.id;
                    $scope.item.byvisitingUsername = data.name;
                    $scope.item.byvisitingUserposition = data.position;
                    $scope.$applyAsync();
                }
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };


        /**
         * 保存跟进日志
         * @param form
         * @param item
         */
        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            $http.post("/ovu-pcos//pcos/expand/expandProject/saveLog.do", item, fac.postConfig).success(function (data, status, headers, config) {
                console.log("data:" + data);
                if (data.state == "success") {
                    msg("保存成功!");
                    $uibModalInstance.close();
                } else {
                    alert(data.state);
                }
            })
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    /**
     * 客户选择器(被拜访人选择器)
     */
    app.controller('customerSelectorCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac,projectId) {
        $scope.pageModel = {};
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
                projectId:projectId
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-pcos/expand/customerContact/list.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
        $scope.search = {};
        $scope.find();
        $scope.checkOnlyOne = function (item, all) {
            all.forEach(function (value, index) {
                value.checked = false;
            });
            item.checked = true;
        }
        $scope.choose = function () {
            var data = $scope.pageModel.list.reduce(function (ret, n) {
                n.checked && ret.push(n);
                return ret
            }, []);
            if (data.length == 0) {
                alert("请选择一个客户联系人");
            } else if (data.length > 1) {
                alert("只能选择一个客户联系人");
            } else {
                $uibModalInstance.close(data[0]);
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });


    /**
     * 编辑状态
     */
    app.controller('editstateCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, param) {
        $scope.item = {
            projectId: param.id,
            followupDetails: ""
        };

        $scope.followUpState_options = [["0", "初次接洽"], ["1", "项目跟进中"], ["2", "合同谈判中"], ["3", "签订合同"], ["4", "已确定其他物业公司"]];

        /**
         * 选择跟进人员
         */
        $scope.choosePerson = function () {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/common/modal.select.person.html',
                controller: 'personSelectorCtrl'
                , resolve: {
                    data: {
                        parkId: '',
                        onlyOne: true
                    }
                }
            });
            modal.result.then(function (data) {
                if (data) {
                    $scope.item.followupUserid = data.per_Id;
                    $scope.item.followupUsername = data.per_Name;
                    $scope.$apply();
                }
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        /**
         * 保存状态
         * @param form
         * @param item
         */
        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            $http.post("/ovu-pcos//pcos/expand/expandProject/saveEditStatus.do", item, fac.postConfig).success(function (data, status, headers, config) {
                console.log("data:" + data);
                if (data.state == "success") {
                    msg("保存成功!");
                    $uibModalInstance.close();
                } else {
                    alert(data.state);
                }
            })
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

})();
