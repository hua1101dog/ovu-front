
(function() {
    "use strict";
    var app = angular.module("angularApp");
  
    app.controller("informationCtl", function(
        $scope,
        $rootScope,
        $http,
        $filter,
        $uibModal,
           $sce,
        fac
     
    ) {
        document.title = "信息公示";
       

      

        $scope.pageModel = {};
        $scope.search = {};
     
       

        app.modulePromiss.then(function() {
            $scope.$watch("dept.id", function(deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.deptId = deptId;
                        $scope.search.parkId = $scope.dept.parkId;
                       
                    } else {
                        // alert('请选择跟项目关联的部门');
                        // $scope.search.deptId &&  delete $scope.search.deptId
                        $scope.search.parkId=$rootScope.getParks()
                      
                    }
                    $scope.find(1)
                }
            });
        });

       
      
        //列表查询
        $scope.find = function(pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
              
            });
           
            fac.getPageResult(
                "/ovu-university/university/inform/page",
                $scope.search,
                function(data) {
                    $scope.pageModel = data;
                    // $scope.myHtml = $scope.item.content;
                    // $scope.trustHtml = $sce.trustAsHtml($scope.myHtml)
                    $scope.pageModel.data && $scope.pageModel.data.length && $scope.pageModel.data.forEach(v=>{
                        v.trustHtml = $sce.trustAsHtml(v.content)
                    })
                }
            );
        };
        //新增/查看详情
        $scope.showModal = function(item) {
           
            if(!item && (!$scope.search.parkId || $scope.search.parkId.indexOf(',')!==-1)){
                alert('请选择项目');
                return
            }
            
          
            var copy = angular.extend(
                {
                  
                },
                item
            );
            if(!item){
                copy.parkId=$scope.search.parkId
                copy.deptId=$scope.search.deptId
                
            }
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "/view/university/informat.detail.modal.html",
                controller: "informatDetailModalCtrl",
                resolve: {
                    copy: copy
                }
            });
            modal.result.then(function() {
                $scope.find(1);
            });
        };
        $scope.hideInfoAll=function(){
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
                $http.get(`/ovu-university/university/inform/hide?ids=${ids}`).success(function(data) {
                    if (data.code==0) {
                        msg(data.msg);
                        $scope.find(1);
                    } else {
                        alert(data.msg);
                    }
                });
            })
        }
        $scope.showInfoAll=function(){
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
                $http.get(`/ovu-university/university/inform/show?ids=${ids}`).success(function(data) {
                    if (data.code==0) {
                        msg(data.msg);
                        $scope.find(1);
                    } else {
                        alert(data.msg);
                    }
                });
            })
        }
        $scope.toDelAll = function() {
            
            var arr=$rootScope.getCheckData($scope.pageModel.data)
             var ids = arr.reduce(function (ret, n) { n.checked && ret.push(n.id); return ret }, []);
             
             confirm("是否删除选中的数据？", function() {
                 $http.get('/ovu-university/university/inform/delete?ids='+ids).success(function(data) {
                     if (data.code==0) {
                         msg(data.msg);
                         $scope.find(1);
                     } else {
                         alert(data.msg);
                     }
                 });
             })
         };
         $scope.top=function(id){
            confirm("是否置顶该数据？", function() {
                $http.get('/ovu-university/university/inform/top?id='+id).success(function(data) {
                    if (data.code==0) {
                        msg(data.msg);
                        $scope.find(1);
                    } else {
                        alert(data.msg);
                    }
                });
            })
         }
         $scope.untop=function(id){
            confirm("是否取消置顶该数据？", function() {
                $http.get('/ovu-university/university/inform/cancel?id='+id).success(function(data) {
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
    app.controller("informatDetailModalCtrl", function(
        $scope,
        $http,
        fac,
        $uibModalInstance,
        $uibModal,
        $sce,
        copy
    ) {
        $scope.item = copy || {};
  
        $scope.config={
            toolbar: [
                ' bold italic underline |',
                ' fontfamily fontsize',
                '| justifyleft justifycenter justifyright ',
                
            ]
        };
      
       


        //保存
        $scope.save = function(form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
          if($('#informatContent .edui-editor-body').text().length>500){
              alert('最多可输入500字符')
            return
          }
         
        $http
        .post("/ovu-university/university/inform/insert",$scope.item)
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
  
   
})();
