
(function () {
    "use strict";
    var app = angular.module("angularApp");

    app.controller('workbenchCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-审批工作台";
   
        fac.setPostDict($rootScope);

        $scope.pageModel = {data:[]};

        $scope.search = {approvalStatus:0};

        $scope.curTab='dsp'
        $scope.domainCode=''
       function getTree(domainCode){
        $http
        .get(
            "/ovu-base/system/dept/rightTree.do?domainCode=" +domainCode
        
        )
        .success(function (resp) {
            if (resp.code == 0) {
                $scope.deptTree_workbench = resp.data;
              
                if($scope.deptTree_workbench.length){
                    $scope.search.deptId = $scope.deptTree_workbench[0].id;
                    $scope.curTab='dsp'
                    $scope.search.approvalStatus = 0;
                    $scope.active=0
                    $scope.setDept('',$scope.deptTree_workbench[0])
                  
                  
                }
               
            }
        });
       }

        app.modulePromiss.then(function () {
           
            $scope.deptTree_workbench=fac.getGlobalTree();
            if($scope.deptTree_workbench.length){
                $scope.search.deptId = $scope.deptTree_workbench[0].id;
            }
         
        })
        // approvalStatus 0 未审批 1已拒绝 2已通过
        $scope.find = function (pageNo) {


            

            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
    
            });
        
            
            fac.getPageResult("/ovu-pcos/pcos/wrokTaskNewApproval/page", $scope.search, function (data) {
                
                $scope.pageModel = data;
            });
        };

        $scope.setDept = function(search,node){
            node.state= node.state || {}
            node.state.selected=!node.state.selected
            $scope.find(1);
        }
      
        $scope.setCurTab = function(tab) {
            if ($scope.curTab != tab) {
                $scope.curTab = tab;
                if(tab=='ywc'){
                    $scope.search.approvalStatus = 3;
                }else{
                    $scope.search.approvalStatus = 0;
                }
                
                
                $scope.find(1)
            }
        };
        $scope.setCurTabDept=function(domainCode){
            $scope.domainCode=domainCode
            getTree( $scope.domainCode)

        }
        $scope.setCurTabDept('')
        $scope.showModal = function (item,flag) {
          
            var copy=angular.extend({ parkId: $scope.search.parkId,
                personId: item.personId,
                userId: item.userId,
                flag:flag,
                curTab:$scope.curTab},item)
            var modal = $uibModal.open({
                animation: true,
                templateUrl: 'approval/modal.approval.html',
                controller: 'approvalModalCtrl',
                size:'max'
                , resolve: {param: copy}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
            });
        }

     
    });

    /**
     * 查看详情/审批
     */
    app.controller('approvalModalCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, param) {
        $scope.search = {};
        $scope.curTab='list'
        $scope.pageModel = {data:[]};
        $scope.item=param 
        $scope.hasNoStatus=true
        $scope.setCurTab = function(tab) {
            
            if ($scope.curTab != tab) {
                $scope.curTab = tab;
            }
            if($scope.curTab!=='list'){
                  
                $scope.changeFre(1)
             }else{
                $scope.changeFre()
             }
        };
     
        $scope.showDetail=true
        $scope.hasPage=true
        $scope.find = function (pageNo) {
          
            $scope.pageModel.data=[]
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
                IDS:param.workTaskIds,
            
            });
            $scope.search.EXEC_CYCLE=$scope.item.exeCycle
        
            fac.getPageResult("/ovu-pcos/pcos/wrokTaskNew/page", $scope.search, function (data) {
                $scope.pageModel = data;
                $scope.pageModel.data && $scope.pageModel.data.length && $scope.pageModel.data.forEach(v=>{
                    if(v.equipmentNameList && v.equipmentNameList.length){
                        if(v.equipmentNameList.length>2){
                            v.equipmentNames=v.equipmentNameList[1]+','+v.equipmentNameList[2]+'...等'+v.equipmentNameList.length+'个设备'
                         }else{
                            v.equipmentNames=v.equipmentNameList.join()
                         }
                    }else{
                        v.equipmentNames=''
                    }
                    if(v.execDate){
                        v.execDateList=v.execDate.split(',')
                    }
                   
                    
                })
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
    
        $scope.changeFre=function(value){
        
            $scope.item.exeCycle=value
            if(value==1){
                $scope.dayList=[
                    '周一', '周二', '周三', '周四', '周五','周六', '周日'
                ]
            }else if(value==2){
               
                $scope.dayList = Array.from({length:28}, (v,k) => k+1+'日');
            }else{
                $scope.dayList = Array.from({length:12}, (v,k) => k+1+'月');
            }
            $scope.find(1);
        }
       
      
        $scope.save=function(type){
        $http.post("/ovu-pcos/pcos/wrokTaskNewApproval/save", { "approvalStatus": type, "id": $scope.item.id,"remark":$scope.item.remark }).success(function(resp) {
            if (resp.code==0) {
                if(type==2){
                    //审批通过后要弹出生成多少工单
                    var message=''
                    resp.data.length && resp.data.forEach(function(task){
                                  
                        message+='【'+task.workTaskNewName+'】事项生成了'+task.sum+'条计划工单'+ "</br>"
                    })
                   
                       warn(message,1)
                   
                     
                                   }else{
                                      msg('操作成功')
                                   }
                $uibModalInstance.close();
            } else {
                alert(resp.msg);
             
               
            }
        })
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

})();
