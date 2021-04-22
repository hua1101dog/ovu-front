
// 巡查任务查询
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('instaskSearchCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $timeout, fac) {
        document.title = "巡查任务列表";
        $scope.pageModel = {};
       
        $scope.search = {
            startTime:moment().format('YYYY-MM-DD'),
            endTime:moment().format('YYYY-MM-DD'),
         
        };
        $scope.childTree=[]
        app.modulePromiss.then(function () {
            $scope.$watch("dept.id", function (deptId, oldValue) {
              
                if (deptId) {
             
                    $scope.childTree=[]
                    $scope.search.postList=[]
                    $scope.search.deptId = deptId
                    $scope.search.nodeText=''
                  
                    $rootScope.execTreeNode($rootScope.deptTree, function(
                        node
                    ) {
                       
                        if (node.id && (node.id==deptId)) {
                         
                         $scope.childTree=node.nodes || []
                        }
                        
                    });
                   
                    $http.get("/ovu-base/pcos/person/getPost?id="+$scope.search.deptId).success(function(res){
                        $scope.search.postList = res;
                    })
                  
                    $scope.find(1);
                
                  
                    
                }

               

            
            });
          
               
      
           

        })
        $scope.find = function (pageNo) {
         
              $scope.search.personId = $scope.search.user?$scope.search.user.id:undefined;
           
            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult("/ovu-pcos/pcos/inspection/inswaytask/page.do", $scope.search, function (data) {
                $scope.pageModel = data;

            });
        };
        
          $scope.setDep = function(search,node){
             
             if(node){
                $scope.search.deptId=node.id
              
             }else{
                $scope.search.deptId=$scope.dept.id
             }
             $http.get("/ovu-base/pcos/person/getPost?id="+$scope.search.deptId).success(function(res){
                $scope.search.postList = res;
            })
            $scope.find(1);
        }
       
      
        //查看详情模态框
        $scope.showModal = function (task) {
            var copy = angular.extend({}, task);
            if (!copy.deptId) {
                angular.extend(copy, { deptId: $scope.search.deptId})
            }

            var modal = $uibModal.open({
                animation: false,
                templateUrl: '../view/inspection/instaskSearch/modal.instaskShow.html',
                size: 'md',
                controller: 'instaskShowCtrl',
                resolve: { task: copy }
            });
            modal.result.then(function () {
                // $scope.find();
            }, function () {
                // $scope.find();
            });

        }
        $scope.del = function (id) {
            confirm("确认删除该巡查任务?", function () {
                $http.post("/ovu-pcos/pcos/inspection/instask/delete.do", {
                    "insTaskId": id
                }, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        msg(resp.msg);
                        $scope.find();
                    } else {
                        alert(resp.msg);
                    }
                })
            });
        }

    });
    //查看详情
    app.controller("instaskShowCtrl", function ($scope, $uibModal, $uibModalInstance, $http,$sce, fac, task) {
        //查看任务详情
            $scope.item = {}
            $http.post("/ovu-pcos/pcos/inspection/inswaytask/detail.do", { id: task.id}, fac.postConfig).success(function (res) {
               
              
                res.data && res.data.forEach(element => {
                     element.itemList && element.itemList .forEach(v=>{
                       if(v.imgPaths){
                        v.imgPaths= v.imgPaths.split(',') || [];
                       }else{
                           
                       }
                       v.trustHtml = $sce.trustAsHtml(v.description)
                     })
                });
                $scope.detailList=res.data || []
               
            })
       
        //点击取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });
    
})();
