/**
 * 自定义 angular组件
 */
(function() {
    'use strict';

    var app = angular.module("app");

//用户信息弹出框组件
    app.component('userInfoModelComponent', {
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        templateUrl: '/view/sys/modal.userInfo.html',
        controllerAs:'vm',
        controller: function () {
            var vm = this;

            vm.$onInit = function () {
                vm.item = vm.resolve.param;
            };

            vm.cancel = function () {
                vm.dismiss({$value: 'cancel'});
            };
        }
    });
    //修改密码弹出框组件
    app.component('changePasswordModelComponent', {
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        templateUrl: '/view/sys/modal.changePassword.html',
        controllerAs:'vm',
        controller: function ($http,fac) {
            var vm = this;

            vm.$onInit = function () {
                vm.item = vm.resolve.param || {};
            };

            vm.cancel = function () {
                vm.dismiss({$value: 'cancel'});
            };

            vm.save = function (form) {
                form.$setSubmitted(true);
                if (!form.$valid) {
                    return;
                }
                if(vm.item.newPwd != vm.item.entryPwd){
                    return;
                    //("新密码与确认新密码不一致。");
                }
                var param={oldPwd:vm.item.oldPwd,newPwd:vm.item.newPwd};
                $http.post("/ovu-base/system/user/updatePassword.do", vm.item,fac.postConfig).success(function (data, status, headers, config) {
                    if (data.code === 0) {
                        confirm(data.msg, function() {
                            window.location.href = "/login.html";
                        });
                    }else {
                        alert(data.msg);
                    }
                })
            };
        }
    });

    //维保单位选择弹出框
    app.component('maintenanceModelComponent', {
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        templateUrl: '/common/modal.maintenanceList.html',
        controllerAs: 'vm',
        controller: function ($scope,$http,fac) {
            var vm = this;
            vm.$onInit = function () {
                $scope.param = vm.resolve.param;
                $scope.search={};
                $scope.pageModel = {};

                $scope.find();
            };

            $scope.find = function(pageNo){
                angular.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
                fac.getPageResult("/ovu-pcos/pcos/maintenanceunit/mtu/list.do",$scope.search,function(data){
                    $scope.pageModel = data;
                });
            };

            $scope.cancel =  function () {
                vm.dismiss({$value: 'cancel'});
            };

            $scope.save = function () {
                var sensor = $scope.pageModel.data.find(function(se){
                    return se.checked;
                })
                if(!sensor){
                    return;
                }
                vm.close({$value: sensor});
            }

        }
    });

    //维保单位新增修改弹出框
    app.component('maintenanceAddOrEditModelComponent', {
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        templateUrl: '/view/maintenance/modal.maintenance.html',
        controllerAs: 'vm',
        controller: function ($scope,$rootScope,$http,fac) {
            var vm = this;
            vm.$onInit = function () {
                var id = vm.resolve.id;
                //实体
                vm.item={personList:[]};
                //模态框标题
                vm.topTitle = "新增";
                //人员列表的标题
                vm.titles=['管理者代表(总经理)','维保负责人','质保负责人','技术负责人','施工(安装改造)负责人','开工告示指定人'];
                //修改
                if(fac.isNotEmpty(id)){
                    vm.topTitle = "修改";
                    $http.get("/ovu-pcos/pcos/maintenanceunit/mtu/get.do?id="+id).success(function(data) {
                        vm.item = data || {};
                        // vm.item.approvalDate=vm.item.approvalDate
                        // vm.validDate
                        vm.item.approvalDate=vm.item.approvalDate.substring(0, 10)
                        vm.item.validDate=vm.item.validDate.substring(0, 10)
                        if(vm.item.dateOfEstablishment){
                            vm.item.dateOfEstablishment=vm.item.dateOfEstablishment.substring(0, 10)
                        }
                       
                       
                    }).error(function () {
                        alert();
                    })
                }
            };

          /*  vm.addPhoto = function (item) {
                fac.upload({url:"/upload/img.do"},function(resp){
                    if(resp.status==1){
                        item.photo=resp.url;
                        $scope.$apply();
                    }else{
                        alert(resp.error);
                    }
                })
            }

            vm.addPhoto2 = function (item) {
                fac.upload({url:"/upload/img.do"},function(resp){
                    if(resp.status==1){
                        item.qualificationPhoto=resp.url;
                        $scope.$apply();
                    }else{
                        alert(resp.error);
                    }
                })
            }*/

            //保存
            vm.save = function (form,item) {
                form.$setSubmitted(true);
                if(!form.$valid){
                    return;
                }
                var param = angular.copy(item);
                $http.post("/ovu-pcos/pcos/maintenanceunit/mtu/edit.do",param).success(function(data) {
                    if(data.success){
                        msg("保存成功!");
                        vm.close();
                    } else {
                        alert();
                    }
                })
            }

            vm.cancel =  function () {
                vm.dismiss({$value: 'cancel'});
            };
        }
    });
})()