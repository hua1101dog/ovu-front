/**
 * Created by Cx on 2019/8/29.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('generatorCtrl', function ($scope, $http,$uibModal,fac) {
        $scope.search = {};
        $scope.pageModel = {};

        $scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            fac.getPageResult("/ovu-pcos/platform/generator/tables",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };
        $scope.find(1);

          $http.post('/ovu-pcos/platform/generator/databases').success(function(resp){
             $scope.databaseList=resp.data
          })

        //生成代码
        $scope.showEditModal = function(domain){
            if($scope.search.databaseName){
                domain.databaseName=$scope.search.databaseName
            }
            var copy = angular.extend({},domain);
            var modal = $uibModal.open({
                animation: true,
                size:'max',
                templateUrl: 'sys/modal.generator.html',
                controller: 'modalGeneratorCtrl'
                ,resolve: {item: function(){return copy;}}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
    });

    app.controller('modalGeneratorCtrl', function($scope,$http,$uibModalInstance,fac,item) {
        $scope.item = item;
         //获取列表信息
         $scope.trueOrFalse=[
             [true,'是'],
             [false,'否']

         ]
         $scope.item.removeTablePrefix=true
          $scope.item.cover=true
          $scope.item.paging=true
        //   $scope.item.mapperPath='src.main.resources.mybatis.mapper.mysql'
        var params={
            tableName:item.tableName,
            databaseName:item.databaseName
        }
        $http.get("/ovu-pcos/platform/generator/columns",{params:params}).success(function (resp, status, headers, config) {
            if (resp.code === 0) {
               $scope.fieldList=resp.data
               $scope.fieldList.forEach(v=>{
                   if(v.columnKey!=='PRI'){
                      v.columnShow=true
                      v.editShow=true
                   }else{
                    v.columnShow=false
                    v.editShow=true
                   }
               })

            } else {
                alert(resp.msg);
            }
        })
        $scope.save = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            var params={
                tableName:item.tableName,
                fieldList:$scope.fieldList,
                genConfig:angular.extend({},$scope.item)
            }

            $http.post("/ovu-pcos/platform/generator", params).success(function (data, status, headers, config) {
                if (data.code === 0) {
                    $uibModalInstance.close();
                    msg(data.msg);
                } else {
                    alert(data.msg);
                }
            })
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})();
