/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('taskCtl', function ($scope,$rootScope,$uibModal, $http,$filter,fac) {
        document.title ="工作任务";

        $scope.config={edit:false};
        $scope.pageModel = {};

        $scope.search = {type:1,withWorkitem:true,countWorkTask:true,is_frozen:2};

        app.modulePromiss.then(function(){
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    $scope.search.deptId=deptId
                    fac.setWorktypeTree($scope,$scope.search);
                    $scope.find(1);
                }
            })
        })
       

        $scope.find = function(pageNo){
            if(!fac.initDeptId($scope.search)){
                return;
            }

            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("/ovu-pcos/pcos/worktask/listByGrid.do",$scope.search,function(data){
                $scope.pageModel = data;
            });
           
        };

        $scope.selectNode= function (search,node) {
            if(node.state.selected){
                $scope.curNode = node;
                if($scope.curNode.WORKITEM_ID){
                    $scope.search.WORKTYPE_ID = $scope.curNode.pid;
                    $scope.search.WORKITEM_ID =$scope.curNode.WORKITEM_ID;
                }else{
                    $scope.search.WORKTYPE_ID = $scope.curNode.id;
                    delete $scope.search.WORKITEM_ID;
                }
                $scope.pageModel.currentPage = 1;
                $scope.find(1);
            }else{
                delete $scope.curNode;
            }
        }

        $scope.clean= function (search) {
            delete $scope.search.WORKTYPE_ID;
            delete $scope.search.WORKITEM_ID;
            delete $scope.search.text;
        }

      

        $scope.delAll = function(){
            var ids = $scope.pageModel.list.reduce(function(ret,n){n.checked && ret.push(n.ID);return ret},[]);
            delGroup(ids);
        };
        $scope.del = function(item){
            delGroup([item.ID]);
        }

        function delGroup(ids){
            $http.post("/ovu-pcos/pcos/worktask/checkRemove_mute.do",{"ids":ids.join()},fac.postConfig).success(function(resp){
                if(resp.success){
                    var mes = "";
                    var notDel = resp.notDel;
                    if(notDel && notDel.length>0){
                        if(notDel.length == ids.length){
                            alert("选中的任务已被使用过，无法删除！");
                            return;
                        }
                        var canDels = ids.filter(function(n){return notDel.indexOf(n)==-1});
                        mes = "确认删除选中的 "+canDels.length+" 条任务? 另 "+ notDel.length +" 条任务因存在生成的工单，无法删除！";
                        del(mes,canDels);
                    }else{
                        mes = "确认删除选中的"+ids.length+"条任务?";
                        del(mes,ids);
                    }
                }else{
                    alert(resp.error);
                }
            });

            function del(mes,ids){
                confirm("确认删除选中的"+ids.length+"条任务?",function(){
                    $http.post("/ovu-pcos/pcos/worktask/remove.do",{"ids":ids.join()},fac.postConfig).success(function(resp){
                        if(resp.success){
                            fac.setWorktypeTree($scope,$scope.search);
                            $scope.find();
                        }else{
                            alert(resp.error);
                        }
                    })
                });
            }
        }

        //新增、编辑任务
        $scope.showEditModal = function(task){
            function _openModal() {
                var modal = $uibModal.open({
                    animation: false,
                    size: 'lg',
                    templateUrl: '/view/workunit/modal.worktask.html',
                    controller: 'worktaskModalCtrl'
                    , resolve: {
                        task: function () {
                            return copy;
                        }
                    }
                });
                modal.result.then(function () {
                    if(!copy.ID){
                        fac.setWorktypeTree($scope,$scope.search);
                    }
                    $scope.find();
                }, function () {
                    console.info('Modal dismissed at: ' + new Date());
                });
            }

            var copy = $.extend(true,{},task);
            copy.is_equip = (copy.equipment_id ?1:2);

            if(!copy.ID && $scope.curNode && $scope.curNode.WORKITEM_ID){
                copy.WORKTYPE_ID = $scope.curNode.pid;
                copy.WORKTYPE_NAME = $scope.curNode.ptexts;
                copy.WORKITEM_ID =$scope.curNode.WORKITEM_ID;
            }

            if(copy.ID){
                $http.get("/ovu-pcos/pcos/worktask/checkRemove_mute.do?ids="+copy.ID).success(function(resp){
                    if(resp.success){
                        var notDel = resp.notDel;
                        if(notDel && notDel.length>0){
                            copy.hasWorkunit = true;
                        }
                        _openModal();
                    }else{
                        alert(resp.error);
                    }
                });
            }else{
                _openModal();
            }
        }

        //添加设备任务(todel)
       /* $scope.showEditModal = function(group){

            function _openModal(){
                var modal = $uibModal.open({
                    animation: false,
                    size:'lg',
                    templateUrl: '/view/workunit/modal.worktask.html',
                    controller: 'worktaskModalCtrl'
                    ,resolve: {task:function(){return copy;} }
                });
                modal.result.then(function () {
                    $scope.find();
                }, function () {
                    console.info('Modal dismissed at: ' + new Date());
                });
            }

            var copy = $.extend(true,{},group);
            copy.equip_only = true;
            copy.is_equip = (copy.equipment_id ?1:2);
            if(!copy.ID){
                copy.equipment_id = $scope.search.equipmentId;
            }

            if(copy.ID){
                $http.get("/ovu-pcos/pcos/worktask/checkRemove_mute.do?ids="+copy.ID).success(function(resp){
                    if(resp.success){
                        var notDel = resp.notDel;
                        if(notDel && notDel.length>0){
                            copy.hasWorkunit = true;
                        }
                        _openModal();
                    }else{
                        alert(resp.error);
                    }
                });
            }else{
                _openModal();
            }
        }*/

        //生成工单
        $scope.geneModal = function(){
            var taskList = $scope.pageModel.list.filter(function(n){return n.checked && n.is_frozen!=1});
            if(taskList.length==0){
                alert("请勾选待生成工单的未冻结任务！");
                return;
            }
            var wrongList = taskList.filter(function(n){return !n.exec_person_name});
            if(wrongList.length>0){
                alert(wrongList[0].WORKTASK_NAME+"未设置默认执行人！");
                return;
            };

            var modal = $uibModal.open({
                animation: false,
                size:'',
                templateUrl: '/view/workunit/modal.geneWorkunit.html',
                controller: 'geneModalCtrl'
                ,resolve: {taskList: function(){return taskList;}}
            });
            modal.result.then(function () {
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        //批量设置执行人
        $scope.distributeModal = function() {
            var groupList = $scope.pageModel.list.filter(function(n){return n.checked});
            if(groupList.length==0){
                alert("请勾选待设置执行人、协助人、管理人的任务！");
                return;
            }
            var parkId;
            if(['maintenanceUnit','securityUnit','greenUnit'].indexOf(app.domain.orgType )>-1){
                var hasParkIdWorkTask = groupList.find(function(n){return n.PARK_ID});
                if(hasParkIdWorkTask ){
                    parkId = hasParkIdWorkTask.PARK_ID;
                   var hasOtherParkId = groupList.find(function(n){return n.PARK_ID && n.PARK_ID!=parkId});
                   if(hasOtherParkId){
                       alert("工单所处项目存在多个！");
                       return;
                   }
                }
            }
            var modal = $uibModal.open({
                animation: false,
                size: "",
                templateUrl: 'workunit/myworkunit.distribute.html',
                controller: 'personUnitSelectorCtrl',
                resolve: { data:function(){
                    var data ={ deptId:$rootScope.dept.id,parkId:parkId };
                    if(groupList.length==1){
                        var unit=groupList[0];
                        data.exePerson = {id:unit.exec_person_id,name:unit.exec_person_name};//执行人
                        data.managePerson = {id:unit.manage_person_id,name:unit.manage_person_name};//管理人
                        data.assPersons = [];//协助人
                        if(unit.assis_person_ids && unit.assis_person_names){
                            var ids=unit.assis_person_ids.split(',');
                            var names=unit.assis_person_names.split(',');
                            if(ids.length==names.length){
                                ids.forEach(function(id,index){
                                    data.assPersons.push({id:id,name:names[index]});
                                });
                            }
                        }
                    }
                    return data;
                } }
            });
            modal.result.then(function(data) {
                if (data) {
                    var worktaskIdList = groupList.map(function(n){return n.ID});
                    var params = {
                        worktaskIds : worktaskIdList.join(),
                        execId : data.execId,
                        assistanceIds : data.assistanceIds,
                        manageId : data.manageId
                    };
                    $http.get("/ovu-pcos/pcos/worktask/setExecPerson.do",{params:params}).success(function(resp){
                        if(resp.success){
                            $scope.find();
                        }else{
                            alert(resp.error);
                        }
                    })
                }
            }, function() {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        //查看任务下的工单
        $scope.showWorkunitsModal = function(task){
            var modal = $uibModal.open({
                animation: false,
                size:'lg',
                templateUrl: '/view/workunit/modal.workunits.html',
                controller: 'workunitsModalCtrl'
                ,resolve: {task: function(){return task;}}
            });
            modal.result.then(function () {
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        function changeTaskFroze(task,frozeStatus){
            var params = {
                taskId : task.ID,
                frozeStatus : frozeStatus
            };
            $http.get("/ovu-pcos/pcos/worktask/changeTaskFroze.do",{params:params}).success(function(resp){
                if(resp.success){
                    $scope.find();
                }else{
                    alert(resp.error);
                }
            })
        }

        $scope.frozeAll = function(){
            var taskList = $scope.pageModel.list.filter(function(n){return n.checked && n.is_frozen!=1});
            if(taskList.length==0){
                alert("请勾选的未冻结任务！");
                return;
            }
            confirm("确认冻结 "+taskList.length+" 个工作任务吗？未执行计划工单将被删除！",function(){
                taskList.forEach(function(n){
                    var params = {
                        taskId : n.ID,
                        frozeStatus : 1
                    };
                    $http.get("/ovu-pcos/pcos/worktask/changeTaskFroze.do",{params:params}).success(function(resp){
                        if(resp.success){
                            n.is_frozen = 1;
                        }else{
                            alert(resp.error);
                        }
                    })
                })
            });
        }

        $scope.frozeOrUnfroze = function(task){
            if(task.is_frozen == 1){
                confirm("确认解除工作任务："+task.WORKTASK_NAME+" 的冻结状态吗？需重新生成计划工单！",function(){
                    changeTaskFroze(task,2)
                });
            }else{
                confirm("确认冻结工作任务："+task.WORKTASK_NAME+" 吗？未执行计划工单将被删除！",function(){
                    changeTaskFroze(task,1)
                });
            }
        }

    });


    //生成工单
    app.controller('geneModalCtrl', function($scope,$http,$uibModalInstance,$filter,fac,taskList) {
      
      
        $scope.taskList = taskList;
        $scope.item = {PARK_ID:taskList[0].PARK_ID};
        $scope.item.TASK_IDS  = taskList.reduce(function(ret,n){ret.push(n.ID);return ret},[]).join();
        $scope.save = function(form,item){
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            $http.post("/ovu-pcos/pcos/workunit/geneWorkUnit.do",item,fac.postConfig).success(function(resp, status, headers, config) {
                if(resp.success){
                    var message=''
                    $scope.taskList.forEach(function(task){
                        var ret = resp.data.find(function(n){return n.TASK_ID == task.ID});
                        task.result = ret.RESULT;
                        message+=task.WORKTASK_NAME+':'+task.result+ "</br>"
                    })
                   
                    warn(message,1)
                   
                    $uibModalInstance.close();
                } else {
                    alert(resp.error);
                }
            })
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });

    app.controller('LiftReportCtrl', function($scope,$http,$uibModalInstance,$filter,fac,param) {
        $http.get("/ovu-pcos/pcos/liftreport/center/single/workunit/detail.do?type=1&id="+param.id).success(function(resp, status, headers, config) {
            if(fac.isNotEmpty(resp)){
                $scope.report=resp;
                angular.extend($scope.report,param);
            } else {
                alert(resp.error);
            }
        })

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.print = function(){
            $("#myPrint").print({
                globalStyles: true,
                mediaPrint: true,
                stylesheet: null,
                noPrintSelector: ".no-print",
                iframe: true,
                append: null,
                prepend: null,
                manuallyCopyFormValues: true,
                deferred: $.Deferred(),
                timeout: 750,
                title: null,
                doctype: '<!doctype html>'    // remove script tags from print content
            });
        }
    });

})();
