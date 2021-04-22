/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller("allDclCtl", function(
        $scope,
        $rootScope,
        $http,
        $filter,
        $uibModal,
        fac
    ) {
        $scope.search = { isClosed: 2, operateType: 1 };
        $scope.pageModel = {};

        app.modulePromiss.then(function() {
            $scope.$watch("dept.id", function(deptId, oldValue) {
                if (deptId && $scope.$parent.search.curTab == "DCL") {
                    $scope.find(1);
                }
            });
        });

        $scope.find = function(pageNo) {
            if (!fac.initDeptId($scope.search)) {
                return;
            }

            if (!$scope.isDelayed) {
                $scope.search.IS_DELAYED && delete $scope.search.IS_DELAYED;
            }

            if (
                app.domain.orgType == "operatingCompany" ||
                app.domain.orgType == "propertyManagement"
            ) {
                //对于运营公司，可以查看运营空间下所有工单
                delete $scope.search.deptId;
                $scope.search.parkId = fac.getAuthParkIds($rootScope.dept);
            }
            $scope.search.totalCount && delete $scope.search.totalCount
            $.extend($scope.search, $scope.$parent.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult(
                "/ovu-pcos/pcos/workunit/parkWorkunitlist.do",
                $scope.search,
                function(data) {
                    $scope.pageModel = data;
                    data.data.forEach(n => {
                        n.ACCEPT_TIME = n.ACCEPT_TIME
                            ? new Date(n.ACCEPT_TIME)
                            : "";
                    });
                }
            );
        };

        $scope.$on("DCL", function(eve, flag) {
            if (flag) {
                $scope.find();
            } else {
                if (
                    !$scope.pageModel.data ||
                    ($rootScope.dept &&
                        $scope.search.deptId != $rootScope.dept.id)
                ) {
                    $scope.find();
                }
            }
        });
    });
    app.controller("allYgbCtl", function(
        $scope,
        $rootScope,
        $http,
        $filter,
        $uibModal,
        fac
    ) {
        $scope.search = { isClosed: 1 };
        $scope.pageModel = {};
        app.modulePromiss.then(function() {
            $scope.$watch("dept.id", function(deptId, oldValue) {
                if (deptId && $scope.$parent.search.curTab == "YGB") {
                    $scope.find(1);
                }
            });
        });

        $scope.find = function(pageNo) {
            if (!fac.initDeptId($scope.search)) {
                return;
            }
            if (
                app.domain.orgType == "operatingCompany" ||
                app.domain.orgType == "propertyManagement"
            ) {
                //对于运营公司或物业公司，可以查看运营空间下所有工单
                delete $scope.search.deptId;
                $scope.search.parkId = fac.getAuthParkIds($rootScope.dept);
            }
            if (!$scope.isDelayed) {
                $scope.search.IS_DELAYED && delete $scope.search.IS_DELAYED;
            }
            $scope.search.totalCount && delete $scope.search.totalCount
            $.extend($scope.search, $scope.$parent.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult(
                "/ovu-pcos/pcos/workunit/parkWorkunitlist.do",
                $scope.search,
                function(data) {
                    $scope.pageModel = data;
                    data.data.forEach(n => {
                        n.ACCEPT_TIME = n.ACCEPT_TIME
                            ? new Date(n.ACCEPT_TIME)
                            : "";
                    });
                }
            );
        };
        $scope.$on("YGB", function() {
            if (
                !$scope.pageModel.data ||
                ($rootScope.dept && $scope.search.deptId != $rootScope.dept.id)
            ) {
                $scope.find();
            }
        });
    });
    /*    app.controller('allPlanCtl', function($scope, $rootScope, $http, $filter, $uibModal, fac) {
        $scope.search = {self:0,isClosed:2}
        $scope.pageModel = {};

        $scope.find = function(pageNo){
            if (!fac.hasActivePark($scope.$parent.search)) {
                return;
            }
            $.extend($scope.search,$scope.$parent.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult("/ovu-pcos/pcos/workunit/parkWorkunitlist.do",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };
        $scope.$on("PLAN", function() {
            $scope.find();
        });
    });*/

    app.controller("workunit_poolCtrl", function(
        $scope,
        $rootScope,
        $http,
        $filter,
        $uibModal,
        fac
    ) {
        document.title = "OVU-工单查询";

        $scope.search = {};
        $scope.setCurTab = function(tab) {
            if ($scope.search.curTab != tab) {
                $scope.search.curTab = tab;
                $scope.$broadcast($scope.search.curTab);
            }
        };

        $scope.selectedExecPerson = function(item, search) {
            search.execPersonId = item.id;
        };
        $scope.selectedSourcePerson = function(item, search) {
            search.sourceUserId = item.id;
            search.sourceUserType = item.type;
        };

        $scope.changeExecPerson = function(search) {
            if (!search.EXEC_NAME) {
                delete search.execPersonId;
            }
        };
        $scope.changeSourcePerson = function(search) {
            if (!search.SOURCE_NAME) {
                delete search.sourceUserId;
                delete search.sourceUserType;
            }
        };
        $scope.changeWorktype = function(worktype,search) {
          
            $scope.workTypeTree =
                worktype == 1
                    ? $rootScope.planWorkTypeTree
                    : worktype == 2
                    ? $rootScope.emerWorkTypeTree
                    : [];
            $scope.isDelayed = worktype == 2 ? true : false;

            delete search.WORKTYPE_ID;
            delete search.workTypeName;
        };

        //回访
        $scope.returnVisit = function(id) {
            var modal = $uibModal.open({
                animation: false,
                templateUrl: "../view/workunit/modal.returnVisit.html",
                controller: "returnVisitModalCtrl",
                resolve: {
                    id: function() {
                        return id;
                    }
                }
            });
            modal.result.then(
                function() {
                    $scope.$broadcast($scope.search.curTab);
                },
                function() {
                    console.info("Modal dismissed at: " + new Date());
                }
            );
        };
        //查看回访详情
        $scope.showReturnVisit = function(id) {
            var modal = $uibModal.open({
                animation: false,
                templateUrl: "../view/workunit/modal.showReturnVisit.html",
                size: "lg",
                controller: "showReturnVisitModalCtrl",
                resolve: {
                    id: function() {
                        return id;
                    }
                }
            });
            modal.result.then(
                function() {},
                function() {
                    console.info("Modal dismissed at: " + new Date());
                }
            );
        };
        function del(ids) {
            confirm("确认删除选中的工单?", function () {
                console.log($scope.search);
                var parms = {};
                if ($scope.search.curTab == "DCL") {
                    parms.isClosed = 2;
                } else {
                    parms.isClosed = 1;
                }
                parms.ids = ids;
                $http.post("/ovu-pcos/pcos/workunit/delete", parms, fac.postConfig).success(function (resp) {
                    if (resp.code ==0) {
                        $scope.$broadcast($scope.search.curTab, true);
                            msg("操作成功");
                    } else {
                        alert(resp.msg);
                    }
                })
            });
        }
        //删除工单
        $scope.deleteWorkUnit = function(id) {
            del(id);
        };
        //批量删除工单
        $scope.toDelAll=function(arr){
            var ids = arr.reduce(function (ret, n) { n.checked && ret.push(n.ID); return ret }, []);
            if(ids.length==0){
                alert('请选择删除的工单！');
                return;
            }
            del(ids.join()); 
        }
        //批量导出
        $scope.exportAll=function(arr){
           
       
           var ids =arr.reduce(function (ret, n) {
                n.checked && ret.push(n.ID);
                return ret
            }, []).join(',')
            var url = "/workunit/workunit/exportWorkunit?id="+ids;
             window.location.href = url;
        }
          //工单派发
          $scope.distributeModal = function(ids,deptId,parkId,WORKUNIT_TYPE) {
            var modal = $uibModal.open({
                animation: false,
                size: "",
                templateUrl: 'workunit/myworkunit.distribute.html',
                controller: 'personUnitSelectorCtrl',
                resolve: { data: { deptId:deptId,parkId:parkId,workunitType:WORKUNIT_TYPE, } }
            });
            modal.result.then(function(data) {
                if (data) {
                    var params = {
                        ids: ids,
                        execPersonId: data.execId,
                        assisPersonId: data.assistanceIds,
                        managePersonId: data.manageId,
                        remark: data.remark,
                        userId: app.user.id
                    };
                    $http.post("/workunit/workunit/batchDistributionWorkunit", params,fac.postConfig).success(function(resp) {
                        if (resp.code==0) {
                            msg("派单成功!");
                            $scope.$broadcast($scope.search.curTab, true);
                        } else {
                            alert(resp.msg);
                        }
                      
                    })
                }
            }, function() {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
        //批量派发工单
        $scope.distributeAll = function(arr) {
            var list = arr.filter(function(n) {return n.checked});
            var deptId = list[0].deptId;
            if(!list.every(function(n){return n.deptId==deptId})){
                alert("工单归属部门不一致，不可统一派发！");
                return;
            }
           var ids = list.reduce(function(ret, n) { ret.push(n.ID); return ret }, []);
          
           $scope.distributeModal(ids.join(),deptId);
        }
      
    });
    //回访
    app.controller("returnVisitModalCtrl", function(
        $scope,
        $uibModalInstance,
        $http,
        fac,
        id
    ) {
        var vm = ($scope.vm = this);
        vm.item = { WORKUNIT_ID: id };

        vm.save = function(form, item) {
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
                .success(function(data, status, headers, config) {
                    if (data.success) {
                        $uibModalInstance.close();
                        msg("保存成功!");
                    } else {
                        alert();
                    }
                });
        };
        vm.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
    });
    //查看回访
    app.controller("showReturnVisitModalCtrl", function(
        $scope,
        $uibModalInstance,
        $http,
        fac,
        id
    ) {
        $scope.search = { unitId: id };
        $scope.pageModel = {};

        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };

        $scope.find = function(pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult(
                "/ovu-pcos/pcos/workunit_callback/list.do",
                $scope.search,
                function(data) {
                    $scope.pageModel = data;
                }
            );
        };
        $scope.find();
    });
})();
