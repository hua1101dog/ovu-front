(function () {
    "use strict";
    document.title = "客户管理";
    var app = angular.module("angularApp");
    
    //客户管理ctrl
    app.controller("customerCtrl", function ($scope, $rootScope, $uibModal, $http, $state, $filter, fac) {
        $scope.pageModel = {};
        $scope.search = {};

        //判断是集团版还是项目版
        app.modulePromiss.then(function () {
            //isGroup
            $scope.search = { isGroup: fac.isGroupVersion() };
            console.log($scope.search.isGroup);
            if ($scope.search.isGroup) {
                ($scope.search.parkId == undefined || $scope.search.parkId == 'undefined' || $scope.search.parkId == null) ? $scope.search.parkId = '' : $scope.search.parkId;
                // if($scope.search.PARK_NAME == 'null' || $scope.search.PARK_NAME == 'undefined' || $scope.search.PARK_NAME == null || $scope.search.PARK_NAME == undefined){
                //     $scope.search.PARK_NAME = '请选择项目';
                // }else{
                //     $scope.search.PARK_NAME = sessionStorage.getItem('parkName');
                // }
                $scope.find();

                //sessionStorage.setItem("parkId",$scope.search.parkId);
            } else {
                $scope.$watch('park', function (newValue, oldValue) {
                    if (newValue && newValue.id) {
                        $scope.search.parkId = newValue.id;
                        //$scope.search.PARK_NAME = newValue.PARK_NAME;
                        $scope.find();

                    } else {
                        alert("请先选定一个项目");
                    }
                });
            }
        });


        $scope.msg = [
            [1, "企业"],
            [2, "个体户"],
            [3, "自然人"]
        ];

        $scope.find = function (pageNo) {
            $.extend($scope.search, { currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;

            fac.getPageResult("/ovu-pcos/pcos/compact/customer/pageQuery", $scope.search, function (data) {
                $scope.pageModel = data;
            })
        };

        $scope.del = function (item) {
            confirm("确认删除该客户吗？", function () {
                $http.post('/ovu-pcos/pcos/compact/customer/delCustomer', { customerId: item.customerId }, fac.postConfig).success(function (data) {
                    if (data.status) {
                        $scope.find();
                        msg(data.msg);
                    } else {
                        msg(data.msg);
                    }
                })

            })
        };

        //编辑／新增模态窗口
        $scope.showModal = function (item) {
            item == undefined ? item = { ss: '新增', customerType: 1 } : item.ss = '编辑';
            item.parkId = $scope.search.parkId;
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/agreement/customer/modal.editCus.html',
                controller: 'editCusModalCtrl',
                //resolve: { park: function(){ return copy; }}
                resolve: { item: angular.copy(item) }
            });
            modal.result.then(function () {
                $scope.find();
            });
            modal.rendered.then(function () {
                console.log("Modal rendered");
            });
            modal.opened.then(function () {
                console.log("Modal opened");
            });
        };

    });

    app.controller("editCusModalCtrl", function ($scope, $http, $uibModal, $uibModalInstance, $filter, fac, item) {
        $scope.item = item;
        item == undefined ? item = { customerId: undefined } : item;
        $scope.title = "新增";
        if (item.customerId) {
            $scope.title = "编辑";
            $http.post("/ovu-pcos/pcos/compact/customer/get", { customerId: item.customerId }, fac.postConfig).success(function (data) {
                $scope.item = data;
                //console.log("获取当前客户项的所有信息"); 
            })
        }
        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            //console.log(item.customerPhone.length);
            if (item.customerPhone.length > 25) {
                alert('您输入的联系方式过长，请重新输入！')
            } else {
                $http.post("/ovu-pcos/pcos/compact/customer/edit", item, fac.postConfig).success(function (data, status, headers, config) {
                    if (data.status) {
                        $uibModalInstance.close();
                        msg(data.msg);
                    } else {
                        alert(data.msg);
                    }
                })
            }

        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        };
    });

})();
