// 失物招领/寻物启事
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller("anyNoticeCtl", function(
        $scope,
        $rootScope,
        $http,
        $filter,
        $uibModal,
        fac
    ) {
        document.title = "失物招领/寻物启事";
     

        $scope.pageModel = {};
        $scope.search = {kind:1};
        
        $scope.search.parkId=$scope.dept.parkId || $rootScope.getParks()

        app.modulePromiss.then(function() {
            $scope.$watch("dept.id", function(deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.deptId = deptId;
                        $scope.search.parkId = $scope.dept.parkId;
                    
                    } else {
                        // alert('请选择跟项目关联的部门');
                        // $scope.search.deptId &&  delete $scope.search.deptId
                        // $scope.search.parkId &&  delete $scope.search.parkId
                        
                        //如果没有parkId 那么就看看子节点有没有parkId,把子节点的parkId拼接出来
                        $scope.search.parkId=$rootScope.getParks()
                     
                       
                    }
                    
                    $scope.find(1)
                }
            });
        });
        
    
        $scope.setCurTab = function(tab) {
            $scope.search.kind=tab
            console.log(111)
           
         
            $scope.find(1);
        };

        //列表查询
        $scope.find = function(pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
               
            });
           
            fac.getPageResult(
                "/ovu-university/university/lost/page",
                $scope.search,
                function(data) {
                    $scope.pageModel = data;
                }
            );
        };

       
     

        //查看
        $scope.showDetailModal = function(item) {
            
          
           var copy = angular.extend( {
              
            },item);
            copy.tab=$scope.tab
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "/view/university/anyNotice.detail.modal.html",
                controller: "detailNoticCtrl",
                resolve: {
                    copy: copy
                }
            });
            modal.result.then(function() {
                
              
              
                $scope.find(1);
            });
        };

        //新增
        $scope.add = function() {
          
            if(!$scope.search.parkId || $scope.search.parkId.indexOf(',')!==-1){
                alert('请选择项目');
                return
            }
          var copy={kind:$scope.search.kind,parkId:$scope.search.parkId}

           
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "/view/university/anyNotic.add.modal.html",
                controller: "addNoticCtrl",
                resolve: {
                    item:copy
                }
            });
            modal.result.then(function() {
                $scope.find(1);
            });
        };
       
        //批量删除

        $scope.toDelAll = function() {
            
           var arr=$rootScope.getCheckData($scope.pageModel.data)
            var ids = arr.reduce(function (ret, n) { n.checked && ret.push(n.id); return ret }, []);
            
            confirm("是否删除选中的数据？", function() {
                $http.get('/ovu-university/university/lost/delete?ids='+ids).success(function(data) {
                    if (data.code==0) {
                        msg(data.msg);
                        $scope.find(1);
                    } else {
                        alert(data.msg);
                    }
                });
            })
        };
        $scope.hideAll=function(){
            var flag = true
         
          var arr = $rootScope.getCheckData($scope.pageModel.data)
            for (var i = 0; i < arr.length; i++) {
                if ( arr[i].infoStatus == 1) {
                    flag = false
                    break;
                }

            }
            if (!flag) {
                alert('请选择显示中的数据')
                return
            }
            var ids = arr.reduce(function (ret, n) { n.checked && ret.push(n.id); return ret }, []);
            
            confirm("是否屏蔽选中的数据？", function() {
                $http.get(`/ovu-university/university/lost/hide?ids=${ids}`).success(function(data) {
                    if (data.code==0) {
                        msg(data.msg);
                        $scope.find(1);
                    } else {
                        alert(data.msg);
                    }
                });
            })
        }
        $scope.showAll=function(){
            var flag = true
         
            var arr = $rootScope.getCheckData($scope.pageModel.data)
              for (var i = 0; i < arr.length; i++) {
                  if ( arr[i].infoStatus == 0) {
                      flag = false
                      break;
                  }
  
              }
              if (!flag) {
                  alert('请选择屏蔽中的数据')
                  return
              }
              var ids = arr.reduce(function (ret, n) { n.checked && ret.push(n.id); return ret }, []);
            confirm("是否取消屏蔽选中的数据？", function() {
                $http.get(`/ovu-university/university/lost/show?ids=${ids}`).success(function(data) {
                    if (data.code==0) {
                        msg(data.msg);
                        $scope.find(1);
                    } else {
                        alert(data.msg);
                    }
                });
            })
        }
    });
    app.controller("addNoticCtrl", function(
        $scope,
        $http,
        fac,
        $uibModalInstance,
        $uibModal,
        item
    ) {
      
      $scope.item=item
     console.log(item)
      $scope.pics=[]
        

        //保存
        $scope.save = function(form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
 
          
            if( $scope.pics.length){
                $scope.item.picture=$scope.pics.join(',')
            }else{
                alert('请上传图片!')
                return
            }
            $http
                .get("/ovu-university/university/lost/insert", {params:$scope.item})
                .success(function(data) {
                    if (data.code == 0) {
                      
                        msg("保存成功!");
                        $uibModalInstance.close();
                    } else {
                        alert(data.msg);
                    }
                });
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
    });
    app.controller("detailNoticCtrl", function(
        $scope,
        $http,
        fac,
        $uibModalInstance,
        $uibModal,
        copy
    ) {
        $scope.pics=[]
        
        $http.get(`/ovu-university/university/lost/detail?lostId=${copy.id}`).success(res=>{
            $scope.item =  res.data;
            if($scope.item.picture){
                $scope.pics=$scope.item.picture.split(',')
            }
            
      
        })
      

        //保存
        $scope.save = function(form) {
           
           
           
         

            

            $http
                .get(
                    `/ovu-university/university/lost/found?id=${copy.id}`
                )
                .success(function(resp) {
                    if (resp.code == "0") {
                        $uibModalInstance.close();
                       
                        msg(resp.msg);
                    } else {
                        alert(resp.msg);
                    }
                });
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
    });
  
})();
