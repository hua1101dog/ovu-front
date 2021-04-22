
// 区块责任人分配
(function () {
    "use strict";
    var app = angular.module("angularApp");
     
    app.controller('blockResponsibilityCtrl', function ($scope, $rootScope, $uibModal, $http, $filter, fac, $timeout) {
        document.title = "区块责任人分配";
        
        $scope.search = {};
        function init(){
            getCouple()
            $scope.find()
        }
        function getCouple(){
            $http.post("/ovu-pcos/pcos/parkBlock/group/list",{deptId:$scope.search.deptId}).success(function (resp) {
                if (resp.code == 0) {
                  $scope.coupleData=resp.data
                }
            })
        }
        app.modulePromiss.then(function () {
            $rootScope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    $scope.search.deptId=deptId
                    var parkDept = fac.getParkDept(null, deptId);
                    if (parkDept) {
                        $scope.search.parkId = parkDept.parkId;
                        $scope.search.parkName = parkDept.parkName
                      
                        init()
                    }else{
                        alert('请选择项目关联的部门')
                        $scope.search.parkId="";
                        $scope.search.parkName=""
                    }
                    
                   
                    
                     
                }
            })
        });
       

        // 查询列表
        $scope.find = function () {
            var params={deptId:$scope.search.deptId}
            if($scope.search.groupId){
               params={deptId:$scope.search.deptId,groupId:$scope.search.groupId}
            }
            $http.post("/ovu-pcos/pcos/parkBlock/person/list",params).success(function (resp) {
                if (resp.code == 0) {
                  $scope.pageList=resp.data
                  $scope.pageList && $scope.pageList.forEach(v=>{
                      if(v.blockPersonList.length==0){
                        v.blockPersonList.push({
                            worktypeName:'--',
                            personNames:'--',
                            createTime:'--'
                        })
                      }
                  })
                
                }
            })
          
        };
       
    
        //设置责任人

        $scope.setPerson = function (item) {
          item.parkId=$scope.search.parkId
          item.deptId=$scope.search.deptId
            var modal = $uibModal.open({
                animation: false,
                size:'lg',
                templateUrl: 'projectManege/modal.headPerson.html',
                controller: 'headPersonModalCtrl'
                ,resolve: {data:function(){return  angular.extend({},item);}}
            });
            modal.result.then(function (data) {
              $scope.find(1)
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        } 
       
    });
    app.controller('headPersonModalCtrl', function($scope,$rootScope,$timeout,$http,$uibModalInstance,$uibModal,$filter,fac,data) {
        $scope.item = data || {};
        var personList=[]
        $scope.selected={}
            function pushPerson(treeData,list){
                function pushNode(nodes) {
                    nodes && nodes.forEach(function (n) {
                      
                        list.forEach(function(v){
                            if(v.id==n.id){
                                n.selectPersons=[]
                                v.refNodeId.forEach(function(re,i){
                                    n.selectPersons.push({
                                        name:v.refNodeText[i],
                                        id:re,
                                       
                                    })
                                })
                                
                                n.selected={}
                                n.selected.value = n.selectPersons
                            }
                        })
                        if (n.nodes && n.nodes.length) {
                            pushNode(n.nodes);
                        }
                    })
                }
    
                pushNode(treeData);
                return treeData;
            }
       $http.get("/ovu-pcos/pcos/parkBlock/person/get/"+data.blockId).success(function (resp) {
        if (resp.code == '0') {
            $scope.blockWorkTree=resp.data
            function personsFlat(nodes) {
                nodes && nodes.forEach(function (n) {
                    if(n.refNodeId){
                        n.refNodeId=n.refNodeId.split(',')
                        n.refNodeText=n.refNodeText.split(',')
                        n.selected={}
                        n.selected.value=[];
                        n.refNodeText.forEach(function(se,i){
                            n.selected.value.push({
                                id:n.refNodeId[i],
                                 name:se
                           })
                        })
                    }
                    if (n.nodes && n.nodes.length) {
                        personsFlat(n.nodes);
                    }
                })
            }

                  personsFlat($scope.blockWorkTree);
                
           
       
        } 
    })
        
        
         //保存
        $scope.save = function() {
            console.log($scope.blockWorkTree)
            var params={
                blockId:data.blockId
            }
            var list = [];
            var blockPersonList=[]
            function pushNode(nodes) {
                nodes && nodes.forEach(function (n) {
                    if(n.selected && n.selected.value.length){
                        list.push(n)
                    }
                    if (n.nodes && n.nodes.length) {
                        pushNode(n.nodes);
                    }
                })
            }

            pushNode($scope.blockWorkTree);
           list.forEach(function(v){
              if(v.selected){
                var arr=[]
                v.selected.value.forEach(function(n){
                        arr.push(n.id)
                })
                blockPersonList.push({
                    worktypeId:v.id,
                    personIds:arr.join(',')
                })
              }
           })
           data.blockPersonList=blockPersonList
            $http.post("/ovu-pcos/pcos/parkBlock/person/edit", data).success(function(resp) {
                if (resp.code==0) {
                    $uibModalInstance.close();
                    msg(resp.msg);
                } else {
                    alert(resp.msg);
                }
            })
        }


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

})()
