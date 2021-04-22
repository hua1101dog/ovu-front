/**
 * Created by Administrator on 2017/7/20.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");

    app.controller('workunitEmergenCtl', function ($scope, $rootScope, $uibModal, $http, $filter, fac) {
        document.title = "应急报事";
        $scope.search = {};

        $scope.tabs = [{ name: "待处理", isClosed: 0, pageModel: {} }, { name: "已关闭", isClosed: 1, pageModel: {} }]
        app.modulePromiss.then(function () {
        })
        $scope.currUser = app.user || {};
        $scope.setCurTab = function (tab) {
            $scope.curTab = tab;
            $scope.search.isClosed = tab.isClosed;
            if (!tab.pageModel.data) {
                $scope.find(1);
            }
        }
        $scope.deptId = 'b549f6d04b3b42a599ac0b872027e294' //丽岛物业
        //工单派发
        $scope.distributeModal = function (ids, sourceUserId, deptId, parkId, WORKUNIT_TYPE) {
            var modal = $uibModal.open({
                animation: false,
                size: "",
                templateUrl: 'workunit/myworkunit.distribute.html',
                controller: 'personUnitSelectorCtrl',
                resolve: { data: { deptId: deptId, parkId: parkId, sourceUserId: sourceUserId, workunitType: WORKUNIT_TYPE, } }
            });
            modal.result.then(function (data) {
                if (data) {
                    var params = {
                        unitIds: ids,
                        execId: data.execId,
                        assistanceIds: data.assistanceIds,
                        manageId: data.manageId,
                        remark: data.remark
                    };
                    $http.post("/ovu-pcos/pcos/workunit/distributeWorkUnit.do", params, fac.postConfig).success(function (resp) {
                        if (resp.success) {
                            msg("派单成功!");
                            $scope.find(1);
                        } else {
                            alert(resp.error);
                        }
                    })
                }
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        //选中分类项
        $scope.selectNode = function (search, node) {
            if (node.state.selected) {
                console.log($scope.curNode);

                $scope.curNode = node;
            } else {
                delete $scope.curNode;
            }
            $scope.find(1);
        }

        $scope.find = function (pageNo) {
            $scope.search.execPersonId = $scope.EXEC ? $scope.EXEC.id : undefined;
            $scope.search.managePersonId = $scope.MANAGE_PERSON ? $scope.MANAGE_PERSON.id : undefined;
            $.extend($scope.search, { currentPage: pageNo || 1, pageSize: $scope.curTab.pageModel.pageSize || 10 });
            fac.getPageResult("/ovu-pcos/pcos/workunit/getEmerWorkUnitList.do", $scope.search, function (data) {
                $scope.curTab.pageModel = data;
                data.data && data.data.forEach(n => {
                    n.ACCEPT_TIME = n.ACCEPT_TIME
                        ? new Date(n.ACCEPT_TIME)
                        : "";
                });
            });
        };

        $scope.del = function (item) {
            confirm("确认删除该工单吗?", function () {
                $.post("/ovu-pcos/pcos/workunit/emerWorkUnitDel.do", { "id": item.ID }, function (msg) {
                    if (msg == 'success') {
                        $scope.find();
                    } else {
                        alert();
                    }
                });
            })
        }

        //应急报事
        $scope.showEditModal = function (workunit) {
            workunit = workunit || { SOURCE: 1 };
            var copy = angular.extend({}, workunit);
            copy.is_equip = (copy.equipment_id ? 1 : 2);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: workunit.ID ? '/view/workunit/workunitEmergen.edit.modal.html' : '/view/workunit/workunitEmergen.modal.html',
                controller: 'workunitEmergenModalCtrl'
                , resolve: { item: copy }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        //工单评价
        $scope.evaluateModal = function (workunit) {
            var evaluate = {
                WORKUNIT_ID: workunit.ID,
                WORKUNIT_NAME: workunit.WORKUNIT_NAME,
                EXEC_DATE: workunit.EXEC_DATE,
                PERSON_ID: $scope.user.id,
                EVALUATE_TYPE: "1"
            }
            var modal = $uibModal.open({
                animation: false,
                size: "",
                templateUrl: '/view/workunit/modal.workunitEvaluate.html',
                controller: 'sourcePersonEvaluateCtrl',
                resolve: { evaluate: function () { return evaluate } }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        //回访
        $scope.returnVisit = function (id) {
            var modal = $uibModal.open({
                animation: false,
                templateUrl: "../view/workunit/modal.returnVisit.html",
                controller: "returnVisitModalCtrl",
                resolve: {
                    id: function () {
                        return id;
                    }
                }
            });
            modal.result.then(
                function () {
                    $scope.$broadcast($scope.search.curTab);
                },
                function () {
                    console.info("Modal dismissed at: " + new Date());
                }
            );
        };
        //查看回访详情
        $scope.showReturnVisit = function (id) {
            var modal = $uibModal.open({
                animation: false,
                templateUrl: "../view/workunit/modal.showReturnVisit.html",
                size: "lg",
                controller: "showReturnVisitModalCtrl",
                resolve: {
                    id: function () {
                        return id;
                    }
                }
            });
            modal.result.then(
                function () { },
                function () {
                    console.info("Modal dismissed at: " + new Date());
                }
            );
        };
        //导出
        $scope.export = function (data, tab) {
            console.log(tab)
            var ids = data.list.reduce(function (ret, n) { n.checked && ret.push(n.ID); return ret }, []);


            if (ids != '') {

                window.location.href = "/ovu-pcos/pcos/workunit/exportEmergen.do?tag=" + (tab - 0 + 1) + "&ids=" + ids;
                data.list.forEach(function (n) { n.checked = false });
                data.checked = false
            }
            else {
                msg("请勾选下面条目");
            }
        }
    });

  

    app.controller('myjobCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        $scope.search = { self: 2, isClosed: 2 }
        $scope.find = function (pageNo) {
            if ($scope.$parent.search.curTab != 'MYJOB') {
                return;
            }
            $.extend($scope.search, $scope.$parent.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult("/ovu-pcos/pcos/workunit/myWorkunitList.do", $scope.search, function (data) {
                $scope.pageModel = data;
                data.list.forEach(function (n) {
                    if (n.supervise && n.supervise.length) {
                        if (n.supervise.find(function (s) { return s.SUPERVISE_STATUS == 0 })) {
                            n.SUPERVISE_STATUS = 0;
                        } else {
                            n.SUPERVISE_STATUS = 1;
                        }
                    }
                })
            });
        };
        app.modulePromiss.then(function () {
            $scope.find(1);
        })
        $scope.$on("MYJOB", function () {
            $scope.find();
        });
    });

    app.controller('sourcePersonEvaluateCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, evaluate) {
        $scope.item = evaluate;
        evaluate.photos = evaluate.PICTURE ? (evaluate.PICTURE.split(",")) : [];

        evaluate.temp_score = evaluate.EVALUATE_SCORE;
        $scope.hoveringOver = function (value) {
            evaluate.temp_score = value;
        }
        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            if (!evaluate.EVALUATE_SCORE) {
                alert("请评分！");
                return;
            }
            item.PICTURE = item.photos.join(",");
            $http.post("/ovu-pcos/pcos/workunit/sourcePersonEvaluate.do", item, fac.postConfig).success(function (resp, status, headers, config) {
                if (resp.code == 0) {
                    $uibModalInstance.close();
                } else {
                    alert(resp.msg);
                }
            })
        }

        //添加工单详情
        var workunit = $scope.detail = { ID: evaluate.WORKUNIT_ID };

        var workUnitPromise = $http.get("/ovu-pcos/pcos/workunit/getWorkunit.do?id=" + workunit.ID).then(function (resp) {
            var ret = resp.data;
            if (ret.success) {
                angular.extend(workunit, ret.data);
                workunit.evaluates && workunit.evaluates.forEach(function (n) {
                    n.photos = n.PICTURE ? (n.PICTURE.split(",")) : [];
                })
                //应急工单
                workunit.pictures = workunit.PICTURE ? workunit.PICTURE.split(",") : [];
                workunit.photos = workunit.PHOTO ? workunit.PHOTO.split(",") : [];
            } else {
                alert(ret.error);
            }
        });
    });
    //回访
    app.controller("returnVisitModalCtrl", function (
        $scope,
        $uibModalInstance,
        $http,
        fac,
        id
    ) {
        var vm = ($scope.vm = this);
        vm.item = { WORKUNIT_ID: id };

        vm.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            $http
                .post(
                    "/ovu-pcos/pcos/workunit_callback/saveCallBack.do",
                    item,
                    fac.postConfig
                )
                .success(function (data, status, headers, config) {
                    if (data.success) {
                        $uibModalInstance.close();
                        msg("保存成功!");
                    } else {
                        alert();
                    }
                });
        };
        vm.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        };
    });
    //查看回访
    app.controller("showReturnVisitModalCtrl", function (
        $scope,
        $uibModalInstance,
        $http,
        fac,
        id
    ) {
        $scope.search = { unitId: id };
        $scope.pageModel = {};

        $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        };

        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult(
                "/ovu-pcos/pcos/workunit_callback/list.do",
                $scope.search,
                function (data) {
                    $scope.pageModel = data;
                }
            );
        };
        $scope.find();
    });
    //选择管理人
    app.controller("managePersonSelectorCtrl", function (
        $scope,
        $uibModalInstance,
        $http,
        fac,
        data,

    ) {
        $scope.search = {};
        $scope.pageModel = {};



        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
                deptId: 'b549f6d04b3b42a599ac0b872027e294'
            });
            fac.getPageResult(
                "/ovu-base/pcos/person/findPerson_mute.do",
                $scope.search,
                function (data) {
                    $scope.pageModel = data;
                }
            );
        };
        $scope.find();

        $scope.tabs = [{
            search: {},
            pageModel: {}
        }, {
            search: {},
            pageModel: {}
        }];



        $scope.managePerson = data.managePerson || {}; //管理人





        //添加管理人（单人、!=执行人）
        $scope.setManagePerson = function (item) {
            $scope.managePerson = {
                name: item.name,
                id: item.id
            };

        };





        //删除
        $scope.del = function (persons, person) {
            persons.splice(persons.indexOf(person), 1);
        };
        $scope.delExePerson = function () {
            $scope.exePerson = {};
        };
        $scope.delMngPerson = function () {
            $scope.managePerson = {};
        };

        //确定
        $scope.save = function () {
            // if (!$scope.managePerson.id) {
            //     alert("请选择管理人！");
            //     return

            // } 


            $uibModalInstance.close($scope.managePerson);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})();
