(function(){
    "use strict";
    var app = angular.module("angularApp");
    
    //客户管理ctrl
    app.controller("workflowCtrl",function($scope, $rootScope,$uibModal, $http, $state, $filter, fac){
        document.title = "合同工作流管理";
        $scope.pageModel = {};
        $scope.search = {};   
    
        //判断是集团版还是项目版
        app.modulePromiss.then(function(){
            $scope.search = {isGroup: fac.isGroupVersion()};
            if($scope.search.isGroup){
                ($scope.search.parkId == undefined || $scope.search.parkId == 'undefined' || $scope.search.parkId == null) ? $scope.search.parkId = '' : $scope.search.parkId;
                $scope.find();
            }else{
                $scope.$watch('park',function(newValue, oldValue){
                    if(newValue && newValue.id){
                        $scope.search.parkId = newValue.id;
                        //$scope.search.PARK_NAME = newValue.PARK_NAME;
                        $scope.find();
                    }else{
                        alert("请先选定一个项目");
                    }
                });
            }
        });
    
        $scope.find = function(pageNo){
            $.extend($scope.search, { currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10});
            $scope.search.pageIndex = $scope.search.currentPage - 1;

            fac.getPageResult("/ovu-pcos/pcos/compact/workflow/pageQuery",$scope.search,function(data){
                $scope.pageModel = data;
            })
            if($scope.search.parkId == ''){
                $scope.edit = false; 
            }else{
                $scope.edit = true;
            }
        
        };
       


        $scope.del = function(item){
            confirm("确认删除该工作流吗？",function(){
                $http.post('/ovu-pcos/pcos/compact/workflow/del',{id:item.id},fac.postConfig).success(function(data){
                    if(data.status){
                        $scope.find();
                        msg(data.msg);
                    }else{
                        msg(data.msg);
                    }
                })
               
            })
        }

        //编辑／新增模态窗口
        $scope.showModal = function(item){ 
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/agreement/agreementworkflow/modal.workflow.html',
                controller: 'editWorkflowCtrl',
                resolve: {
                    item: angular.copy(item),
                    search:$scope.search
                }
            });
            modal.result.then(function(){
                $scope.find();
            });
            modal.rendered.then(function(){
                console.log("Modal rendered");
            });
            modal.opened.then(function(){
                console.log("Modal opened");
            });
        }

        
    });

    app.controller("editWorkflowCtrl",function($scope, $http, $uibModal, $uibModalInstance, $filter, fac, item ,search){
        item == undefined ? $scope.title = '新增合同工作流' : $scope.title = '修改合同工作流';
        //加载审批角色名称
        $http.post("/ovu-pcos/pcos/compact/checkrole/loadRoleList",{parkId:search.parkId},fac.postConfig).success(function(data,status,config){
            if(data){
                console.log(data);
                $scope.msg = data;
                if (item.roleId) {
                   $scope.roleId = item.roleId;
                }
            }else{
                alert("数据获取失败");
            }
        })
       

        $scope.item = item;
        // item == undefined ? item = {id:undefined} : item;
        // if(item.customerId){
        //     $http.post("/ovu-pcos/pcos/compact/customer/get",{customerId:item.customerId},fac.postConfig).success(function(data){
        //         // delete data.creatorId;
        //         // delete data.createTime;    
        //         $scope.item=data;
        //         console.log("获取当前客户项的所有信息");
                
        //     })
        // }
        $scope.save = function(form,item){
            console.log(item);
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            item.parkId = search.parkId;
            item.roleId = $scope.roleId;
        
            $http.post("/ovu-pcos/pcos/compact/workflow/edit",item, fac.postConfig).success(function(data){
                if(data.status){
                    msg(data.msg); 
                    $uibModalInstance.close();            
                }else{
                    alert(data.msg);                  
                }
            })
        }

        $scope.cancel = function(){
            $uibModalInstance.dismiss("cancel");
        };
    });

   

})();
