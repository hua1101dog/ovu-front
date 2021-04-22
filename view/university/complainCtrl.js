// 投诉管理
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller("complainCtl", function(
        $scope,
        $rootScope,
        $http,
        $filter,
        $uibModal,
        fac
    ) {
        document.title = "投诉管理";
       

      

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
                "/ovu-university/university/complaints/page",
                $scope.search,
                function(data) {
                    $scope.pageModel = data;
                }
            );
        };

        
       

        //回复
        $scope.reply = function(item) {
          
          
           
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "/view/university/complain.reply.modal.html",
                controller: "coplainReplyModalCtrl",
                resolve: {
                    item: item
                }
            });
            modal.result.then(function() {
               
              
              
                $scope.find(1);
            });
        };

        //查看详情
        $scope.showDetailModal = function(item) {
            

            var copy = angular.extend(
                {
                  
                },
                item
            );
           
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "/view/university/complain.detail.modal.html",
                controller: "coplainDetailModalCtrl",
                resolve: {
                    copy: copy
                }
            });
            modal.result.then(function() {
                $scope.find(1);
            });
        };
      
      

    });
    app.controller("coplainDetailModalCtrl", function(
        $scope,
        $http,
        fac,
        $uibModalInstance,
        $uibModal,
        copy
    ) {
       
        $http.get(`/ovu-university/university/complaints/detail?complaintsId=${copy.id}`).success(res=>{
            $scope.item =  res.data;
      
        })

       $scope.showContent=function(){
           $scope.showContentBox=true
       }


        //保存
        $scope.save = function(form,item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            var params = {
                parkId: $scope.item.parkId,
                complaintId:
                $scope.item.id,
                replyContent: $scope.item.replyContent,
              
            };
            $http
                .get("/ovu-university/university/reply/insert", {params:params})
                .success(function(data) {
                    if (data.code == 0) {
                        $scope.pageModel = data;
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
    app.controller("coplainReplyModalCtrl", function(
        $scope,
        $http,
        fac,
        $uibModalInstance,
        $uibModal,
        item
    ) {
       
      $scope.userName=app.user.nickname

       $http.get("/ovu-university/university/reply/get").success(res=>{
           console.log(res.code)
           $scope.replyPersonDept=res.data.replyPersonDept
       })






      $scope.save = function(form) {
        form.$setSubmitted(true);
        if (!form.$valid) {
            return;
        }

        var params = {
            parkId: item.parkId,
            complaintId:item.id,
            replyContent: $scope.item.replyContent,
        };
        $http
            .get("/ovu-university/university/reply/insert", {params:params})
            .success(function(data) {
                if (data.code == 0) {
                    $scope.pageModel = data;
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
