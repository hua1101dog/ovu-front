(function() {
    var app = angular.module("angularApp");
    app.controller('InspectTotalCtrl', ['$scope', '$rootScope', '$uibModal', '$http', '$filter', 'fac', '$log', '$window',function ($scope, $rootScope, $uibModal, $http, $filter, fac, $log, $window) {
        document.title = "巡查统计";
        $scope.pageModel = {};
        $scope.pageModel_zyh={}
        $scope.search = {
          startTime:moment().format('YYYY-MM-DD'),
          endTime:moment().format('YYYY-MM-DD'),
        };
        $scope.setCurTabName='wy'
        $scope.search2 = {
           
          };
          app.modulePromiss.then(function () {

			
            $scope.childTree=[]
            app.modulePromiss.then(function () {
                $scope.$watch("dept.id", function (deptId, oldValue) {
                  
                    if (deptId) {
                 
                     
                        if (!$scope.dept.parkId) {
                        
                            $scope.search.parkId && delete $scope.search.parkId;
                            $scope.search.parkName && delete $scope.search.parkName;
                            $scope.childTree=[]
                            $scope.postList=[]
                      
                       
                        }
                        $scope.childTree=[]
                        $scope.search.postList=[]
                      $scope.search.deptId=deptId
                      $scope.search.nodeText=''
                      $rootScope.execTreeNode($rootScope.deptTree,function(n){
                           
                        if (n.parkId) {
                            if(n.nodes && n.nodes.length){
                         
                             $rootScope.execTreeNode(n.nodes,function(node){
                                node.parentPark=true
                               
                             })
                            }
                          
                            
                        }
                        if (n.id && (n.id==deptId)) {
                             
                            $scope.childTree=n.nodes || []
                          }
                          
                      
                    })
                        
                      
                     
                        $scope.setDept($scope.search)
                    }
    
                   
    
                
                });
              
                   
          
               
    
            })
        });
         $scope.findAll=function(){
             if(app.domain.orgType!=='propertyManagement'){
                $scope.find(1);
             }else{
                if(!$scope.isPark){
                    $scope.find(1);
                }else{
                  
                    $scope.setCurTab($scope.setCurTabName) 
                }
             }
            
         }
      
        // 查询统计列表
        $scope.find = function (pageNo) {
            if(!$scope.search.deptId){
              alert('请选择部门')
              return
            }
            var url=''
             if(app.domain.orgType=='propertyManagement'){
                 //物业
                 url='/ovu-pcos/pcos/inspection/inswaytask/stats/page'
             }else{
                url='/ovu-pcos/pcos/inspection/inswaytask/stats/personPage'
             }
            $.extend($scope.search, {currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10, deptId: $scope.search.deptId});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            fac.getPageResult(url, $scope.search, function(data) {
                $scope.pageModel = data;
            })
        };
        $scope.find_zyh = function (pageNo) {
            console.log($scope.search.deptId)
            if(!$scope.search.deptId){
              alert('请选择部门')
              return
            }
          
            $.extend($scope.search2, { deptId: $scope.search.deptId,startTime:$scope.search.startTime,endTime:$scope.search.endTime});
           
            fac.getPageResult("/ovu-pcos/pcos/inspection/inswaytask/stats/specializedStats", $scope.search2, function(data) {
                $scope.pageModel_zyh = data;
               
            })
        };
        $scope.setCurTab=function(name){
            $scope.setCurTabName=name
              if(name=='wy'){
               $scope.find(1)
              }else{
               $scope.find_zyh(1)
              }
           }
           $scope.setDept = function(search,node){
            if(node){
                $scope.search.deptId=node.id
                if(node.nodes && node.nodes.length){
                    $scope.isLeave=false
                   }else{
                     $scope.isLeave=true 
                    }
                   if(node.parkId){
                    $scope.isPark=true
                    $scope.search2.parkId=node.parkId
                     if(!node.nodes || node.nodes.length){
                        $scope.isLeave=false 
                     }
                   }else{
                    $scope.isPark=false
                   }
                   if(node.parentPark){
                     
                       //项目下的部门
                         $scope.parentHasParkDept=true
                   }else{
                    $scope.parentHasParkDept=false
                   }
                    if(node.deptName=='丽岛物业'){
                        //是否是丽岛物业
                        $scope.isWY=true
        
                    }else{
                        $scope.isWY=false
                    }
                    if(!$scope.isWY && ! $scope.parentHasParkDept && !$scope.parentHasParkDept){
                        //如果不是项目 也不是项目下的部门 也不是丽岛物业 那么就是片区
                        $scope.isArea=true
        
                    }else{
                        $scope.isArea=false  
                    }
           }else{
               var nnode=[]
               $scope.search.deptId=$scope.dept.id
               $rootScope.execTreeNode($rootScope.deptTree, function(
                node
            ) {
               
                if (node.id && (node.id==$scope.search.deptId)) {
                 
                    nnode=node
                }
                
                
            });
           
               if(nnode.nodes && nnode.nodes.length){
                $scope.isLeave=false
               }else{
                 $scope.isLeave=true 
                }
               if(nnode.parkId){
                $scope.isPark=true
                $scope.search2.parkId=nnode.parkId
                 if(!nnode.nodes || nnode.nodes.length){
                    $scope.isLeave=false 
                 }
               }else{
                $scope.isPark=false
               }
               if(nnode.parentPark){
                 
                   //项目下的部门
                     $scope.parentHasParkDept=true
               }else{
                $scope.parentHasParkDept=false
               }
                if(nnode.deptName=='丽岛物业'){
                  
                    //是否是丽岛物业
                    $scope.isWY=true
    
                }else{
                    $scope.isWY=false
                }
                if(!$scope.isWY && ! $scope.parentHasParkDept && !$scope.parentHasParkDept){
                    //如果不是项目 也不是项目下的部门 也不是丽岛物业 那么就是片区
                    $scope.isArea=true
    
                }else{
                    $scope.isArea=false  
                }
           }
          
         
            $http.get("/ovu-base/pcos/person/getPost?id="+$scope.search.deptId).success(function(res){
              $scope.search.postList = res;
          })
            if(!$scope.isPark){
                $scope.find(1);
            }else{
              
                $scope.setCurTab($scope.setCurTabName) 
            }
      }
      
        // 导出文件
        $scope.exportFile = function () {
            window.location.href="/ovu-pcos/pcos/inspection/inswaytask/stats/export?deptId="+$scope.search.deptId+"&postId="+$scope.search.postId+"&startTime="+$scope.search.startTime+"&endTime="+$scope.search.endTime;
        }
        
       
    
    }])

  
})()