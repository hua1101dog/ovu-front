/**
 * Created by Administrator on 2017/7/20.
 * modify by ghostsf.com 2018/3/20
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('domainCtrl', function ($rootScope,$scope, $http,$uibModal,fac) {
        $scope.search = {};
        $scope.pageModel = {};

        !$rootScope.orgTypeEnum && $http.get("/ovu-base/sys/orgTypeEnum").success(function(resp){
            if(resp.code ==0){
                $rootScope.orgTypeEnum = resp.data;
            }
        })

        $scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            fac.getPageResult("/ovu-base/sys/domain/list.do",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };
        $scope.find(1);

        //添加与保存域
        $scope.showEditModal = function(domain){
            var copy = angular.extend({},domain);
            var modal = $uibModal.open({
                animation: false,
                size:'lg',
                templateUrl: 'sys/domain.modal.html',
                controller: 'modalDomainCtrl'
                ,resolve: {item: function(){return copy;}}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        //编辑域管理员
        $scope.showAdminModal = function(domain){
            var modal = $uibModal.open({
                animation: false,
                size:'',
                templateUrl: 'sys/modal.domainAdmin.html',
                controller: 'modalDomainAdminCtrl'
                ,resolve: {domain: function(){return domain;}}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }


        $scope.del = function(item){
            confirm("确认删除域用户："+item.domainName+" 吗？",function(){
                $http.get("/ovu-base/sys/domain/del/"+item.id).success(function(resp){
                    if(resp.code === 0){
                        msg(resp.msg);
                        $scope.find();
                    }else{
                        alert(resp.msg);
                    }
                })
            });
        }

    });

    app.controller('modalDomainCtrl', function($scope,$http,$uibModalInstance,fac,item) {
        $scope.item = item;
        $http.get("/ovu-base/sys/module/list").success(function(list){
            $scope.modules = list;
            item.id && $http.get("/ovu-base/sys/domain/get/"+item.id).success(function(resp){
                $scope.item = resp.data;
                var moduleIds = resp.data.moduleIds||"";
                var moduleIdList = moduleIds.split(",");
                list.forEach(function(n){
                    if(moduleIdList.indexOf(n.id+'')>-1){
                        n.checked = true;
                    }
                })
            });
        });

        $scope.save = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            if($scope.item.domainCode.trim().length<4){
                alert('域编码必须为4位！');
                return;
            }
            var moduleIdList = $scope.modules.reduce(function(ret,n){n.checked && ret.push(n.id);return ret},[]);
            $scope.item.moduleIds = moduleIdList.join();
            $http.post("/ovu-base/sys/domain/save", $scope.item).success(function (data, status, headers, config) {
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

    app.controller('modalDomainAdminCtrl', function($scope,$http,$uibModalInstance,fac,domain) {
        $scope.item ={domainId:domain.id}
        domain.adminId && $http.get("/ovu-base/sys/admin/get?userId="+domain.adminId).success(function(resp){
            if(resp.code === 0){
                if(resp.data&& resp.data.id){
                    $scope.item = resp.data;
                }
            }
        });
        $scope.save = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            $http.post("/ovu-base/sys/admin/save", $scope.item).success(function (data, status, headers, config) {
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
