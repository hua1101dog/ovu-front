/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('dclCtl', function($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title ="我的工单";
        $scope.search = {operateType:11}
        $scope.find = function(pageNo) {
            if($scope.$parent.search.curTab !='DCL'){
                return;
            }
            $.extend($scope.search,$scope.$parent.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            delete $scope.search.isClosed;
            fac.getPageResult("/ovu-pcos/pcos/workunit/myWorkunitList.do", $scope.search, function(data) {
                $scope.pageModel = data;
                data.list.forEach(function(n){
                    if(n.supervise && n.supervise.length){
                        if(n.supervise.find(function(s){return s.SUPERVISE_STATUS == 0})){
                            n.SUPERVISE_STATUS = 0;
                        }else{
                            n.SUPERVISE_STATUS = 1;
                        }
                    }
                })
            });
        };
      
      $scope.acceptAll = function(item) {
        var ids = $scope.pageModel.list.reduce(function(ret, n) { n.checked && ret.push(n.ID); return ret }, []);
        ids.length && confirm("确认接收共"+ids.length+"个工单吗?", function() {
          $http.post("/ovu-pcos/pcos/workunit/acceptAll.do", { "ids": ids.join()}, fac.postConfig).success(function(resp) {
            if (resp.success) {
              var tips = "共"+resp.cnt+"个工单接收成功！";
              if(resp.cnt < ids.length){
                 tips +=resp.msg
                 alert(tips);
              }else{
                 msg(tips);
              }
              $scope.find();
            }
          });
        });
      }
      $scope.distributeAll = function() {
          var list = $scope.pageModel.list.filter(function(n) {return n.checked});
          var deptId = list[0].deptId;
          if(!list.every(function(n){return n.deptId==deptId})){
              alert("工单归属部门不一致，不可统一派发！");
              return;
          }
         var ids = list.reduce(function(ret, n) { ret.push(n.ID); return ret }, []);
         $scope.distributeModal(ids.join(),deptId);
      }
        app.modulePromiss.then(function() {
            $scope.find(1);
        })
        $scope.$on("DCL", function() {
            $scope.find();
        });
    });
    app.controller('yclCtl', function($scope, $rootScope, $http, $filter, $uibModal, fac) {
        $scope.search = {operateType:12,isClosed:2}
        $scope.find = function(pageNo) {
            if($scope.$parent.search.curTab !='YCL'){
                return;
            }
            $.extend($scope.search,$scope.$parent.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult("/ovu-pcos/pcos/workunit/myWorkunitList.do", $scope.search, function(data) {
                $scope.pageModel = data;
                data.list.forEach(function(n){
                    if(n.supervise && n.supervise.length){
                        if(n.supervise.find(function(s){return s.SUPERVISE_STATUS == 0})){
                            n.SUPERVISE_STATUS = 0;
                        }else{
                            n.SUPERVISE_STATUS = 1;
                        }
                    }
                })
            });
        };
        app.modulePromiss.then(function() {
            $scope.find(1);
        })
       
        
        $scope.$on("YCL", function() {
            $scope.find();
        });

    });

    app.controller('myworkunitCtl', function($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-我的工单";
        $scope.operateTypeDict = [{ type: "派发人", title: "待派发", value: 11 },
            { type: "派发人", title: "已派发", value: 12 },
            { type: "执行人", title: "待接单", value: 21 },
            { type: "执行人", title: "待执行", value: 22 },
            { type: "执行人", title: "已完成", value: 23 },
            { type: "管理人", title: "待评价", value: 31 },
            { type: "管理人", title: "已评价", value: 32 },
            { type: "督办人", title: "待督办", value: 41 },
            { type: "督办人", title: "已督办", value: 42 },
            { type: "协助人", title: "查看", value: 5 }
        ]

        //选择工作分类
        $scope.changeWorktype = function(worktype){
            $scope.workTypeTree = worktype==1?$rootScope.planWorkTypeTree:(worktype==2?$rootScope.emerWorkTypeTree:[])
            delete $scope.search.WORKTYPE_ID
            delete $scope.search.workTypeName;
        }
        $scope.width=$(window).width()-300
     
        $scope.pageModel = {};
        $scope.search = {curTab:"DCL"};
        $scope.currUser=app.user || {};
      
         $scope.setCurTab = function(tab){
             if($scope.search.curTab!=tab){
                 $scope.search.curTab = tab;
                 $scope.$broadcast($scope.search.curTab);
             }
         }

        //工单接收
        $scope.acceptWork = function(item) {
            confirm("确认接收工单：" + item.WORKUNIT_NAME + " 吗?", function() {
                $http.post("/ovu-pcos/pcos/workunit/acceptWork.do", { "id": item.ID}, fac.postConfig).success(function(resp) {
                    if (resp.success) {
                        $scope.$broadcast($scope.search.curTab);
                    } else {
                        alert(resp.error);
                    }
                });
            });
        }

        $scope.supervise = function(item) {
            confirm("确认督办工单：" + item.WORKUNIT_NAME + " 吗?", function() {
                $http.post("/ovu-pcos/pcos/workunit/supervise.do", { "ids": item.ID }, fac.postConfig).success(function(resp) {
                    if (resp.success) {
                        $scope.$broadcast($scope.search.curTab);
                    } else {
                        alert(resp.error);
                    }
                });
            });
        }

        //工单评价
        $scope.evaluateModal = function(workunit,evaluateType) {

            var evaluate = {
                WORKUNIT_ID: workunit.ID,
                WORKUNIT_NAME: workunit.WORKUNIT_NAME,
                EXEC_DATE: workunit.EXEC_DATE,
                PERSON_ID: $scope.currUser.id,
                EVALUATE_TYPE : evaluateType
            }
            var modal = $uibModal.open({
                animation: false,
                size: "",
                templateUrl: '/view/workunit/modal.workunitEvaluate.html',
                controller: 'workunitEvaluateCtrl',
                resolve: { evaluate: function() { return evaluate } }
            });
            modal.result.then(function() {
                $scope.$broadcast($scope.search.curTab);
            }, function() {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        //工单退回
        $scope.showRefuseModal = function(item) {
            var modal = $uibModal.open({
                animation: false,
                size: "",
                templateUrl: 'refuseModal.html',
                controller: 'refuseModalCtrl',
                resolve: { refuseItem: function() { return item; } }
            });
            modal.result.then(function() {
                $scope.$broadcast($scope.search.curTab);
            }, function() {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        //工单纠正
        $scope.modifyModal = function(item) {
            var modal = $uibModal.open({
                animation: false,
                size: "",
                templateUrl: 'modifyModal.html',
                controller: 'modifyModalCtrl',
                resolve: { modifyItem: angular.extend({},item) }
            });
            modal.result.then(function() {
                $scope.$broadcast($scope.search.curTab);
            }, function() {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        //工单执行
        $scope.showExecModal = function(workunit_id) {
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: '/view/workunit/modal.workunitExec.html',
                controller: 'workUnitExecModalCtrl',
                resolve: { workunit: function() { return { ID: workunit_id } } }
            });
            modal.result.then(function() {
                $scope.$broadcast($scope.search.curTab);
            }, function() {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        //工单派发
        $scope.distributeModal = function(ids,sourceUserId,deptId,parkId,WORKUNIT_TYPE) {
            var modal = $uibModal.open({
                animation: false,
                size: "",
                templateUrl: 'workunit/myworkunit.distribute.html',
                controller: 'personUnitSelectorCtrl',
                resolve: { data: { deptId:deptId,parkId:parkId,sourceUserId:sourceUserId,workunitType:WORKUNIT_TYPE, } }
            });
            modal.result.then(function(data) {
                if (data) {
                    var params = {
                        unitIds: ids,
                        execId: data.execId,
                        assistanceIds: data.assistanceIds,
                        manageId: data.manageId,
                        remark: data.remark
                    };
                    $http.post("/ovu-pcos/pcos/workunit/distributeWorkUnit.do", params,fac.postConfig).success(function(resp) {
                        if (resp.success) {
                            msg("派单成功!");
                            $scope.$broadcast($scope.search.curTab);
                        } else {
                            alert(resp.error);
                        }
                    })
                }
            }, function() {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        //工单延期
        $scope.showDelayModal = function(item) {
            var modal = $uibModal.open({
                animation: false,
                size: "",
                templateUrl: 'delayModal.html',
                controller: 'delayModalCtrl',
                resolve: { model: function() { return item; } }
            });
            modal.result.then(function() {
                $scope.$broadcast($scope.search.curTab);
            }, function() {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        //工单延期审核
        $scope.showVerifyModal = function(item) {
            var modal = $uibModal.open({
                animation: false,
                size: "",
                templateUrl: 'delayVerifyModal.html',
                controller: 'delayVerifyModalCtrl',
                resolve: { model: function() { return item; } }
            });
            modal.result.then(function() {
                $scope.$broadcast($scope.search.curTab);
            }, function() {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
    });


    app.controller('refuseModalCtrl', function($scope, $rootScope, $http, $uibModalInstance, $filter, fac, refuseItem) {

        $scope.item = refuseItem;

        $scope.save = function(form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            $http.post("/ovu-pcos/pcos/workunit/refuseWork.do", { "WORKUNIT_ID": item.ID, "CONTENT": item.refuseReason }, fac.postConfig).success(function(resp) {
                if (resp.success) {
                    $uibModalInstance.close();
                } else {
                    alert(resp.error);
                }
            })
        }
    });

    app.controller('delayModalCtrl', function($scope, $rootScope, $http, $uibModalInstance, $filter, fac, model) {

        $scope.item = {workUnitId:model.ID,exec_date:model.EXEC_DATE,WORKUNIT_NAME:model.WORKUNIT_NAME};

        //获取延期原因
        $http.get("/ovu-pcos/pcos/workunit_reason/getAll.do").success(function(data) {
            $scope.reasons=data;
        });

        //更改延期原因
        $scope.changeReson=function(item){
            if (item.reasonId) {
                var reason=$scope.reasons.find(function (o) {
                    return o.id==item.reasonId;
                });
                if (reason){
                    $scope.maxDelayDate=moment().add('days',reason.days).format('YYYY-MM-DD');
                }
            }

        }


        $scope.save = function(form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            if ($scope.maxDelayDate && item.date>$scope.maxDelayDate) {
                alert('延期时间不能超过：'+$scope.maxDelayDate);
                return;
            }

            $http.post("/ovu-pcos/pcos/workunit_delay/submit.do", item, fac.postConfig).success(function(resp) {
                if (resp.success) {
                    msg('延期申请已提交，请等待审核！');
                    $uibModalInstance.close();
                } else {
                    alert(resp.error);
                }
            })
        }
    });

    app.controller('delayVerifyModalCtrl', function($scope, $rootScope, $http, $uibModalInstance, $filter, fac, model) {

        $scope.item = {workUnitId:model.ID,exec_date:model.EXEC_DATE,passable:1};

        //获取延期详情
        if (model.delayId){
            $http.post("/ovu-pcos/pcos/workunit_delay/get.do",{id:model.delayId},fac.postConfig).success(function(resp) {
                $scope.item=angular.extend($scope.item,resp.data);
            });
        }

        $scope.save = function(form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            var passable=item.passable;
            if (passable==1){   //通过
                $http.post("/ovu-pcos/pcos/workunit_delay/pass.do", item, fac.postConfig).success(function(resp) {
                    if (resp.success) {
                        msg('延期申请已通过！');
                        $uibModalInstance.close();
                    } else {
                        alert(resp.error);
                    }
                })
            } else{
                $http.post("/ovu-pcos/pcos/workunit_delay/noPass.do", item, fac.postConfig).success(function(resp) {
                    if (resp.success) {
                        msg('延期申请已驳回！');
                        $uibModalInstance.close();
                    } else {
                        alert(resp.error);
                    }
                })
            }
        }
    });

    app.controller('modifyModalCtrl', function($scope, $rootScope, $http, $uibModalInstance, $filter, fac, modifyItem) {

        $scope.item = modifyItem;
        var oriWorktypeId = modifyItem.WORKTYPE_ID;


        $scope.save = function(form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            if(oriWorktypeId == item.WORKTYPE_ID){
                alert("请重新选择应急工作分类！")
                return;
            }
            $http.post("/ovu-pcos/pcos/workunit/modifyWork.do", { "workunitId": item.ID,"workTypeName": item.WORKTYPE_NAME, "workTypeId": item.WORKTYPE_ID,"modifyReason":item.modifyReason }, fac.postConfig).success(function(resp) {
                if (resp.code == 0) {
                    $uibModalInstance.close();
                } else {
                    alert(resp.msg);
                }
            })
        }
    });

    app.controller('workUnitExecModalCtrl', function($scope, $rootScope, $http, $uibModal, $uibModalInstance, $filter, fac, workunit) {

        $scope.item = workunit;
        var data;
        //工序列表
        function showTask(task) {
            $http.post("/ovu-pcos/pcos/workunit/getWorkStepById.do", { taskId: task.ID, unitId: workunit.ID }, fac.postConfig).success(function(resp) {
                task.stepList = resp.steplist;
                var stepOperList = [];
                if (resp.arr && resp.arr.ID) {
                    data.ID = resp.arr.ID;
                    stepOperList = JSON.parse(resp.arr.DESCRIPTION);
                }
                task.stepList.forEach(function(n) {
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
                    n.oper = stepOperList.find(function(m) { return m.id == n.ID }) || { id: n.ID };
                });
            })
        }

        function getFaultTypeTree(equipmentId){
            $scope.faultTypeTree = undefined;
            if(!equipmentId){
                return;
            }
            $http.get("/ovu-pcos/pcos/equipment/getFaultTypeTree.do?equipmentId="+equipmentId).success(function(resp) {
                 if(resp.code ==0 &&resp.data && resp.data.length){
                     $scope.faultTypeTree = resp.data;
                 }
            })
        }
        //获取工单详情
        $http.get("/ovu-pcos/pcos/workunit/getWorkunit.do?id=" + workunit.ID).success(function(resp) {
            if (resp.success) {
                angular.extend(workunit, resp.data);
                getFaultTypeTree(workunit.equipment_id);
                workunit.photos = workunit.PHOTO ? workunit.PHOTO.split(",") : [];
                if (workunit.task) {
                    data = { WORKUNIT_ID: workunit.ID, WORKTASK_ID: workunit.WORKTASK_ID, UNIT_STATUS: 5, ID: workunit.task.DESCRIPTION_ID };
                    var stepOperList = [];
                    if (workunit.task.DESCRIPTION_ID && workunit.task.DESCRIPTION) {
                        stepOperList = JSON.parse(workunit.task.DESCRIPTION);
                    }
                    workunit.task.stepChild.forEach(function(n) {
                        if (n.OPERATION_TYPE == 3) {
                            //选择
                            n.options = n.OPTIONS_LIST.split(/[,，]/);
                        }
                        n.oper = stepOperList.find(function(m) { return m.id == n.WORKSTEP_ID }) || { id: n.WORKSTEP_ID };
                        if (n.OPERATION_TYPE == 1) {
                            //图片
                            n.oper.photos = n.oper.photos||[];
                        }
                    });
                }
            } else {
                alert(resp.error);
            }
        });

        //选择配件
        $scope.chooseParts = function() {
            var modal = $uibModal.open({
                animation: false,
                size: "",
                templateUrl: '/common/modal.select.parts.html',
                controller: 'partsMultiSelectorCtrl',
                resolve: { data: { parkId: workunit.PARK_ID } }
            });
            modal.result.then(function(data) {
                if (data) {
                    if (workunit.partsList && workunit.partsList.length > 0) {
                        data.forEach(function(part) {
                            workunit.partsList.forEach(function(item) {
                                if (part.partsId != item.partsId) {
                                    workunit.partsList.push(part);
                                }
                            });
                        });
                    } else {
                        data.forEach(function(part) {
                            workunit.partsList.push(part);
                        });
                    }
                }
            }, function() {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        //删除配件
        $scope.delParts = function(parts, p) {
            confirm("确定删除此配件吗？", function() {
                parts.splice(parts.indexOf(p), 1);
                $scope.$apply();
            })
        }

        function updateWorkunit(form,item,fn){
            if (item.WORKUNIT_TYPE == 2) {
                var workUnit = { id: item.ID, photo: item.photos.join(","), comment: item.SUCCESS_TEXT,equipmentId:item.equipment_id,faultType:item.faultType };
                $http.post("/ovu-pcos/pcos/workunit/execEmerWorkunit.do", workUnit, fac.postConfig).success(function(resp) {
                    fn && fn(resp);
                })
            } else {
                var v_alert = '';
                workunit.partsList && workunit.partsList.forEach(function(part) {
                    if (!part.amount) {
                        v_alert = part.partsName + '配件的数量不能为空！';
                        return;
                    }
                });
                if (v_alert) {
                    alert(v_alert);
                    return;
                }
                 
                if (workunit.task.stepChild && workunit.task.stepChild.length) {
                    var opers = [];
                    workunit.task.stepChild.forEach(function(step) {
                        opers.push(step.oper);
                    })
                    data.DESCRIPTION = JSON.stringify(opers);
                    data.WORKTASKNEW_ID=workunit.task.stepChild[0].WORKTASKNEW_ID
                }
                data.partsData = JSON.stringify(workunit.partsList);
                data.success_text = item.SUCCESS_TEXT
                var params=angular.copy(data)
                  if(params.WORKTASKNEW_ID){
                   delete params.WORKTASK_ID
                  }else{
                    delete params.WORKTASKNEW_ID
                  }
                
                $http.post("/ovu-pcos/pcos/workunit/workunitOpera.do", data, fac.postConfig).success(function(resp) {
                    fn && fn(resp);
                })
            }
        }

        //保存
        $scope.updateWorkUnit = function(form, item) {
            /*form.$setSubmitted(true);
             if(!form.$valid){
             return;
             }*/
            updateWorkunit(form,item,function(resp){
                if (resp.code == 0) {
                    $uibModalInstance.close();
                } else {
                    alert(resp.msg);
                }
            })
        }

        //选择设备
        $scope.chooseEquipment = function(item){
            var modal = $uibModal.open({
                animation: false,
                size:'lg',
                templateUrl: '/view/equipment/selector.equipment.html',
                controller: 'equipmentSelectorCtrl'
                ,resolve: {data: function(){return {parkId:item.PARK_ID,equipment_id:item.equipment_id,deptId:item.deptId};}}
            });
            modal.result.then(function (data) {
                item.equipment_id = data.id;
                item.equipment_name = data.name;
                getFaultTypeTree(data.id);
            });
        }



        //完成
        $scope.finishWork = function(form,item) {
            form.$setSubmitted(true);
             if(!form.$valid){
             return;
             }
             /*//计划图片
             if(item.task && item.task.stepChild && item.task.stepChild.find(function(n){
                    return n.OPERATION_TYPE == 1 && fac.isEmpty(n.oper.photos)
                 })){
                 alert("请上传图片！");
                 return;
             }
             //应急图片
             if(item.WORKUNIT_TYPE==2 && fac.isNotEmpty(item.PICTURE) && fac.isEmpty(item.photos)){
                 alert("请上传图片！");
                 return;
             }*/
            confirm("确认完成工单：" + item.WORKUNIT_NAME + " 吗？", function() {
                updateWorkunit(form,item,function(data){
                    if(data.code == 0){
                        $http.get("/ovu-pcos/pcos/workunit/finishWork.do",{params:{"id":item.ID}}).success(function(resp) {
                            if (resp.code == 0) {
                                $uibModalInstance.close();
                            } else {
                                alert(resp.msg);
                            }
                        });
                    }else{
                        alert(data.msg);
                    }
                })
            });
        }

    });

    app.controller('workunitEvaluateCtrl', function($scope, $rootScope, $http, $uibModalInstance, $filter, fac, evaluate) {
        $scope.item = evaluate;
        evaluate.photos = evaluate.PICTURE ? (evaluate.PICTURE.split(",")) : [];

        evaluate.temp_score = evaluate.EVALUATE_SCORE;
        $scope.hoveringOver = function(value){
            evaluate.temp_score = value;
        }
        $scope.save = function(form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            if(!evaluate.EVALUATE_SCORE){
                alert("请评分！");
                return ;
            }
            item.PICTURE = item.photos.join(",");
            $http.post("/ovu-pcos/pcos/workunit/workunitevaluate/save.do", item, fac.postConfig).success(function(resp, status, headers, config) {
                if (resp.success) {
                    $uibModalInstance.close();
                } else {
                    alert(resp.error);
                }
            })
        }

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        //添加工单详情
        var workunit = $scope.detail = { ID: evaluate.WORKUNIT_ID };

        function getWorkunitTask(WORKUNIT_ID) {
            $http.get("/ovu-pcos/pcos/workunit/getWorkunitTask.do?WORKUNIT_ID=" + WORKUNIT_ID).success(function(resp) {
                if (resp.success) {
                    $scope.task = resp.data;
                    var stepOperList = [];
                    if ($scope.task.DESCRIPTION_ID) {
                        stepOperList = JSON.parse($scope.task.DESCRIPTION);
                    }
                    $scope.task.stepChild.forEach(function(n) {
                        if (n.OPERATION_TYPE == 3) {
                            //选择
                            n.options = n.OPTIONS_LIST.split(/[,，]/);
                        }
                        n.oper = stepOperList.find(function(m) { return m.id == n.WORKSTEP_ID }) || { id: n.WORKSTEP_ID };
                    });
                } else {
                    alert(resp.error);
                }
            })
        }
        var workUnitPromise = $http.get("/ovu-pcos/pcos/workunit/getWorkunit.do?id=" + workunit.ID).then(function(resp) {
            var ret = resp.data;
            if (ret.success) {
                angular.extend(workunit, ret.data);
                workunit.evaluates && workunit.evaluates.forEach(function(n) {
                        n.photos = n.PICTURE ? (n.PICTURE.split(",")) : [];
                    })
                    //应急工单
                if (workunit.WORKUNIT_TYPE == 1) {
                    getWorkunitTask(workunit.ID);
                } else {
                    workunit.pictures = workunit.PICTURE ? workunit.PICTURE.split(",") : [];
                    workunit.photos = workunit.PHOTO ? workunit.PHOTO.split(",") : [];
                }
            } else {
                alert(ret.error);
            }
        });
    });

})();
