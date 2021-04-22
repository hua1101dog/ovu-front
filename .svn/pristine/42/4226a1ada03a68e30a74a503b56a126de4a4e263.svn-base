/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('appCtrl', function ($scope, $http,$uibModal,fac) {
        $scope.search = {};
        $scope.pageModel = {};

        $scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            fac.getPageResult("/ovu-base/sys/app/list",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };
        $scope.find(1);

        //删除
        $scope.del = function(item){
            confirm("确认删除该APP吗？",function(){
                $http.get("/ovu-base/sys/app/del.do?id="+item.id).success(function(resp){
                    if(resp.code === 0){
                        $scope.find();
                    }else{
                        alert(resp.msg);
                    }
                })
            });
        }

        //添加与保存app
        $scope.showEditModal = function(domain){
            var copy = angular.extend({},domain);
            var modal = $uibModal.open({
                animation: false,
                size:'',
                templateUrl: 'sys/modal.app.html',
                controller: 'modalAppCtrl'
                ,resolve: {item: function(){return copy;}}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
    });

    app.controller('modalAppCtrl', function($scope,$http,$uibModalInstance,fac,item) {
        $scope.item = item;
        $scope.domains=[];

        $http.get("/ovu-base/sys/domain/all").success(function(list){
            $scope.domains = list;
            if(item.id && fac.isNotEmpty(item.domainIds)){
                var domainIdList = item.domainIds.split(",");
                list.forEach(function(n){
                    if(domainIdList.indexOf(n.id+'')>-1){
                        n.checked = true;
                    }
                })
            }
        });

        $scope.save = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            var domainIdList = $scope.domains.reduce(function(ret,n){n.checked && ret.push(n.id);return ret},[]);
            $scope.item.domainIds = domainIdList.join();
            $http.post("/ovu-base/sys/app/save", $scope.item).success(function (data, status, headers, config) {
                if (data.code === 0) {
                    $uibModalInstance.close();
                    msg("保存成功!");
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
