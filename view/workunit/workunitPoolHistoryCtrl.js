/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");

    app.controller('workunitPoolHistoryCtrl', function ($scope,$rootScope, $http,$filter,$uibModal,fac) {
        document.title ="OVU-历史工单查询";
      
        $scope.search = {isClosed:1,year:moment().subtract(1, 'year').format('YYYY')}
        $scope.pageModel = {};
     
        $scope.currentDate=new Date().format('yyyy-MM-dd')
        app.modulePromiss.then(function() {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    $scope.find(1);
                }
            })
        })
        $scope.find = function(pageNo){
            if(!fac.initDeptId($scope.search)){
                return;
            }
            if(!$scope.search.year){
             alert('请选择年份')
             return
            }
            if($scope.fromTime){
                $scope.search.fromTime=$scope.search.year+'-'+$scope.fromTime
            }
            if($scope.toTime1){
                $scope.search.toTime=$scope.search.year+'-'+$scope.toTime1
            }
            if($scope.fromDate){
                $scope.search.fromDate=$scope.search.year+'-'+$scope.fromDate
            }
            if($scope.FinishTimeStart){
                $scope.search.FinishTimeStart=$scope.search.year+'-'+$scope.FinishTimeStart
            }
            if($scope.FinishTimeEnd){
                $scope.search.FinishTimeEnd=$scope.search.year+'-'+$scope.FinishTimeEnd
            }
            if($scope.toDate){
                $scope.search.toDate=$scope.search.year+'-'+$scope.toDate
            }
          
          
            if(app.domain.orgType == 'operatingCompany'||app.domain.orgType == 'propertyManagement'){
                //对于运营公司或物业公司，可以查看运营空间下所有工单
                delete $scope.search.deptId;
                $scope.search.parkId = fac.getAuthParkIds($rootScope.dept);
            }
            if(!$scope.isDelayed){
                $scope.search.isBad &&  delete $scope.search.isBad
              }
            $.extend($scope.search,{ currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult("/workunit/workunit/closeWorkunitList",$scope.search,function(data){
                $scope.pageModel = data;
                data.data && data.data.forEach(n=>{
                    n.acceptTime= n.acceptTime?(new Date(n.acceptTime)):"" ;
                })
            });
        };

        $scope.selectedExecPerson=function(item,search){
            search.execPersonId=item.id;
        }
        $scope.selectedSourcePerson=function(item,search){
            search.sourceUserId=item.id;
            search.sourceUserType=item.type;
        }

        $scope.changeExecPerson=function(search){
            if(!search.execName){
                delete search.execPersonId;
            }
        }
        $scope.changeSourcePerson=function(search){
            if(!search.sourceName){
                delete search.sourceUserId;
                delete search.sourceUserType;
            }
        }
        $scope.changeWorktype = function(worktype){
            $scope.workTypeTree = worktype==1?$rootScope.planWorkTypeTree:(worktype==2?$rootScope.emerWorkTypeTree:[])
            $scope.isDelayed =(worktype ==2?true:false);
          
            delete $scope.search.worktypeId
            delete $scope.search.workTypeName;
        }
        //查看工单详情
        $scope.showWorkUnitDetail_1 = function (item) {
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: '/view/workunit/modal.newworkunitDetail.html',
                controller: 'workUnitDetailHisModalCtrl',
                resolve: {
                    item
                }
            });
        };
        //回访
        $scope.returnVisit = function(id){
            var modal = $uibModal.open({
                animation: false,
                templateUrl: '../view/workunit/modal.returnVisit.html',
                controller: 'returnVisitModalCtrl',
                resolve: {
                    id: function(){return id;}
                }
            });
            modal.result.then(function () {
                $scope.$broadcast($scope.search.curTab);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        //查看回访详情
        $scope.showReturnVisit = function(id){
            var modal = $uibModal.open({
                animation: false,
                templateUrl: '../view/workunit/modal.showReturnVisit.html',
                size:'lg',
                controller: 'showReturnVisitModalCtrl',
                resolve: {
                    id: function(){return id;}
                }
            });
            modal.result.then(function () {
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

    });
    //回访
    app.controller('returnVisitModalCtrl', function($scope,$uibModalInstance,$http,fac,id) {
        var vm = $scope.vm = this;
        vm.item={worktypeId:id};

        vm.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            $http.post("/ovu-pcos/pcos/workunit_callback/saveCallBack.do", item,fac.postConfig).success(function (data, status, headers, config) {
                if (data.success) {
                    $uibModalInstance.close();
                    msg("保存成功!");
                } else {
                    alert();
                }
            });
        }
        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    //查看回访
    app.controller('showReturnVisitModalCtrl', function($scope,$uibModalInstance,$http,fac,id) {
        $scope.search={unitId:id};
        $scope.pageModel={};

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("/ovu-pcos/pcos/workunit_callback/list.do",$scope.search,function(data){
                $scope.pageModel = data;
            });
        }
        $scope.find();
    });
     //工单详情
     app.controller('workUnitDetailHisModalCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, item) {
        $scope.item ={}
        var workunit = $scope.item =item;
        $scope.phaseList = [];

        //Deprecated
        $scope.chooseTask = function (task) {
            $scope.curTask = task;
            if (!task.stepList || task.stepList.length == 0) {
                $http.post("/ovu-pcos/pcos/workunit/getWorkStepById.do", {
                    taskId: task.ID,
                    unitId: workunit.ID
                }, fac.postConfig).success(function (resp) {
                    task.stepList = resp.steplist;
                    var stepOperList = [];
                    if (resp.arr && resp.arr.ID) {
                        stepOperList = JSON.parse(resp.arr.DESCRIPTION);
                    }
                    task.stepList.forEach(function (n) {
                        switch (n.OPERATION_TYPE) {
                            case "1":
                                break;
                            case "2":
                                break;
                            case "3":
                                n.options = n.OPTIONS_LIST.split(/[,，]/);
                                break;
                            case "4":
                                break;
                        }
                        n.oper = stepOperList.find(function (m) {
                            return m.id == n.ID
                        }) || {
                                id: n.ID
                            };
                    });

                })
            }
        }
        workunit.evaluates= JSON.parse(workunit.evaluates) || []
        workunit.partsList =JSON.parse(workunit.partsList) || []
        workunit.task = JSON.parse(workunit.task) || []
        workunit.evaluates && workunit.evaluates.forEach(function (n) {
            n.photos = n.PICTURE ? (n.PICTURE.split(",")) : [];
        });
        // 巡检验收工单添加 巡检验收标准
        // workunit.onsiteinsp_node = '[{"title":"1.检查主墙面是否破损"},{"title":"2.检查房屋厨房卫生间是否漏水"},{"title":"3"},{"title":"4"},{"title":"5"}]';
        if (workunit.onsiteinsp_node) {
            var list = JSON.parse(workunit.onsiteinsp_node);
            workunit.onsiteinsp_node = list.map(function (item) {
                return item.title;
            }).join('<br/>');
        }
        //应急工单
        if (workunit.workunitType == 1) {
            $scope.task = workunit.task;
            var stepOperList = [];
            if ($scope.task.DESCRIPTION_ID && $scope.task.DESCRIPTION) {
                stepOperList = JSON.parse($scope.task.DESCRIPTION);
            }
            $scope.task.stepChild.forEach(function (n) {
                if (n.OPERATION_TYPE == 3) {
                    //选择
                    n.options = n.OPTIONS_LIST.split(/[,，]/);
                }
                n.oper = stepOperList.find(function (m) {
                    return m.id == n.WORKSTEP_ID
                }) || {
                        id: n.WORKSTEP_ID
                    };
            });

        } else {
            workunit.pictures = workunit.PICTURE ? workunit.PICTURE.split(",") : [];
            workunit.photos = workunit.PHOTO ? workunit.PHOTO.split(",") : [];
        }
     
        fillProgressBar();

        //工单生成
        if (workunit.workunitType == 2) {
            $scope.phaseList.push({
                title: "报事",
                time: workunit.REPORT_TIME || workunit.createTime,
                content: "发起人：" + (workunit.sourcePersonName || "无")
            })
        } else {
            $scope.phaseList.push({
                title: "工单生成",
                time: workunit.REL_TIME,
                content: "发起人：" + workunit.sourcePersonName || "无"
            })
        }
        workunit.callbacks=JSON.parse(workunit.callbacks) || []
        if (workunit.callbacks && workunit.callbacks.length) {
            var callbacks = workunit.callbacks.map(function (n) {
                return {
                    title: "回访",
                    time: n.BACK_TIME,
                    content: "回访人：" + n.BACK_NAME,
                    BACK_TEXT: n.BACK_TEXT
                }
            });
            $scope.phaseList = $scope.phaseList.concat(callbacks)
        }
        workunit.delays=JSON.parse(workunit.delays) || []
        if (workunit.delays && workunit.delays.length) {
            var callbacks = workunit.delays.map(function (n) {
                var statusName='';
                if (n.status==0){
                    statusName='审核中';
                }else if (n.status==1){
                    statusName='审核通过';
                }else{
                    statusName='审核不通过';
                }
                return {
                    title: "延期",
                    content: "执行人：" + workunit.EXEC_PERSON_NAME,
                    status:n.status,
                    statusName:statusName,
                    time:n.createTime,
                    date: n.date,
                    reason:n.reasonName,
                    remark: n.remark,
                    verifyTime: n.verifyTime,
                    verifyRemark:n.verifyRemark
                }
            });
            $scope.phaseList = $scope.phaseList.concat(callbacks)
        }
        workunit.histories=JSON.parse(workunit.histories) || []
        if (workunit.histories && workunit.histories.length) {
            workunit.histories.forEach(function (n) {
                var phase = {
                    time: n.CREATE_TIME,
                    unitStatus: n.UNIT_STATUS
                };
                switch (n.UNIT_STATUS) {
                    case 1:
                        phase.title = "派发";
                        phase.content = "派发人：" + (n.WORK_PERSON_NAME || '系统自动派发');
                        phase.noDetail = false;
                        phase.WORK_CONTENT = n.WORK_CONTENT;
                        break;
                    case 2:
                        phase.title = "修订";
                        phase.content = "派发人：" + n.WORK_PERSON_NAME;
                        phase.WORK_CONTENT = n.WORK_CONTENT;
                        break;
                    case 4:
                        phase.title = "退回";
                        phase.content = "回退人：" + n.WORK_PERSON_NAME;
                        phase.WORK_CONTENT = n.WORK_CONTENT;
                        break;
                    case 5:
                        phase.title = "接单";
                        phase.content = "执行人：" + n.WORK_PERSON_NAME;
                        phase.noDetail = true;
                        break;
                    case 7:
                        phase.title = "执行";
                        phase.content = "执行人：" + n.WORK_PERSON_NAME;
                        break;
                    case 8:
                        phase.title = "评价";
                        phase.content = "管理人：" + n.WORK_PERSON_NAME;
                        phase.evaluate = workunit.evaluates.find(function (n) {
                            return n.EVALUATE_TYPE == 2
                        })
                        break;
                }
                phase.title && $scope.phaseList.push(phase);
            })
        }
      
        if (workunit.evaluates && workunit.evaluates.length) {
            var eva = workunit.evaluates.find(function (n) {
                return n.EVALUATE_TYPE == 1
            });
            if (eva) {
                var phase = {
                    title: "评价",
                    time: eva.CREATE_TIME,
                    content: "发起人：" + eva.PERSON_NAME || "无"
                }
                phase.evaluate = eva;
                $scope.phaseList.push(phase)
            }
        }
        workunit.supervises && (workunit.supervises=JSON.parse(workunit.supervises) || [])
        //工单督办
        if (workunit.supervises && workunit.supervises.length) {
            var supervises = workunit.supervises.map(function (n) {
                return n.SUPERVISE_STATUS == 1 ? {
                    title: "已督办",
                    time: n.SUPERVISE_TIME,
                    content: "督办人：" + n.SUPERVISE_PERSON_NAME,
                    noDetail: true
                } : {
                        title: "待督办",
                        time: n.CREATE_TIME,
                        content: "",
                        noDetail: true
                    }
            });
            $scope.phaseList = $scope.phaseList.concat(supervises)
        }

        //查看设备详情
        if (workunit.equipment_id) {
            $scope.showEquipment = true;
            getEquipmentInfo(workunit.equipment_id);
        }

        function fillProgressBar() {

            var types = ['success', 'info', 'warning', 'danger'];
            $scope.stacked = [{
                value: 1,
                unitStatus: -1,
                title: workunit.workunitType == 2 ? '报事' : '工单生成',
                type: 'default'
            },
            {
                value: 1,
                unitStatus: 1,
                title: '派发',
                type: 'default'
            },
            {
                value: 1,
                unitStatus: 4,
                title: '退回',
                type: 'default'
            },
            {
                value: 1,
                unitStatus: 5,
                title: '接单',
                type: 'default'
            },
            {
                value: 1,
                unitStatus: 7,
                title: '执行',
                type: 'default'
            },
            {
                value: 1,
                unitStatus: 8,
                title: '评价',
                type: 'default'
            }
            ];
            $scope.stacked.forEach(function (n) {
                if (workunit.unitStatus >= n.unitStatus) {
                    n.type = 'success';
                }
            })
            if (workunit.unitStatus == 4) {
                $scope.stacked[2].type = 'danger';
                $scope.stacked[3].value = 0;
            } else {
                $scope.stacked[2].value = 0;
            }
        };

        function getEquipmentInfo(equipmentId) {
            $http.get("/ovu-pcos/pcos/equipment/get.do?id=" + equipmentId).success(function (resp) {
                if (resp.success) {
                    $scope.equipinfo = resp.data;

                } else {
                    alert(resp.error);
                }
            });
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

})();
