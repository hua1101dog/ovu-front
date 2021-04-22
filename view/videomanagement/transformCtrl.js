/**
 * Created by chenxi on 2018/3/7.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('transformCtrl', function ($scope,$rootScope, $http,$filter,$uibModal,fac) {

        document.title ="转流服务管理";
        $scope.search = {};
        $scope.pageModel = {};
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find()
            }, function () {
                $scope.find()
            })
        })
        //分页
        $scope.find = function (pageNo) {
            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult('/ovu-camera/pcos/videomanagement/transform/pageList.do', $scope.search, function (res) {
                $scope.pageModel = res;
            })
        }
        //添加转流服务

        $scope.showEditModal = function (task) {
            var copy=angular.extend({},task)
         var modal=$uibModal.open({
            animation:false,
            size:'lg',
            templateUrl:"../view/videomanagement/transform/modal.transformEdit.html",
            controller:'transformEditModalCtrl',
            controllerAs:'vm',
            resolve:{
                task:copy
            }
         })
         modal.result.then(function(){
            $scope.find()
         },function(){
            $scope.find()
         })
        }
        $scope.del = function (id) {
            confirm("确认删除该转流服务吗?", function () {
                $http.get("/ovu-camera/pcos/videomanagement/transform/delete.do?id="+id).success(function (msg) {
                    if (msg.success) {
                           $scope.find();
                       } else {
                           alert();
                       }
                   });
            })
        }


    });
    app.controller('transformEditModalCtrl',function($scope,$uibModal,$uibModalInstance,$http,$filter,fac,task){

        $http.get("/ovu-camera/pcos/videomanagement/hardware/list.do").success(function (data, status, headers, config) {
            $scope.hardwareList = data;
        });
        var vm=$scope.vm=this;
        if(fac.isNotEmpty(task.id)){
            $scope.item={};
            $http.get('/ovu-camera/pcos/videomanagement/transform/get.do',{params:{id:task.id}}).success(function(res){
               angular.extend($scope.item, res);
            })
       }
      vm.save=function(form,item){
          form.$setSubmitted(true);
          if(!form.$valid){
            return
          }
          delete item.createTime;
          $http.get('/ovu-camera/pcos/videomanagement/transform/edit.do',{params:item}).success(function(res){
              if(res.success){
                  $uibModalInstance.close();
                  msg("操作成功!");
              }else{
                  $uibModalInstance.close();
                  msg("操作失败!");
              }
          })
        };
        vm.cancel=function(){
          $uibModalInstance.dismiss('cancel');
        }
    })

})();
