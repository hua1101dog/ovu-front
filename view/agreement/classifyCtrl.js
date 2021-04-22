(function() {
    "use strict";
    var app = angular.module("angularApp");
    //合同分类管理ctrl
    app.controller("classifyCtrl", function($scope, $rootScope, $uibModal, $http, $filter, fac) {
        document.title = "合同分类管理";
        $scope.pageModel = {};
        $scope.search = {};


        //判断是集团版还是项目版
        app.modulePromiss.then(function() {
            $scope.search = { isGroup: fac.isGroupVersion() };
            if ($scope.search.isGroup) {
                ($scope.search.parkId == undefined || $scope.search.parkId == 'undefined' || $scope.search.parkId == null) ? $scope.search.parkId = '': $scope.search.parkId;
                $scope.find();
            } else {
                $scope.$watch('park', function(newValue, oldValue) {
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



        $scope.find = function(pageNo) {
            $.extend($scope.search, { currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;

            fac.getPageResult("/ovu-pcos/pcos/compact/classify/pageQuery", $scope.search, function(data) {
                $scope.pageModel = data;
                console.log("分页成功");
            })


        };


        // $scope.check = function(){
        //     var list = [];
        //     list.classifyName = $scope.classifyName;
        //     list.classifyCode = $scope.classifyCode;
        //     fac.getPageResult("/ovu-pcos/pcos/compact/classify/pageQuery",{classifyName:list.classifyName,classifyCode:list.classifyCode},function(data){
        //         $scope.pageModel = data;
        //     })
        // }
        $scope.del = function(item) {
            confirm("确认删除吗？", function() {
                $http.post('/ovu-pcos/pcos/compact/classify/delClassify', { classifyId: item.classifyId }, fac.postConfig).success(function(data) {
                    if (data.status) {
                        $scope.find();
                        msg(data.msg);
                    } else {
                        msg(data.msg);
                    }
                })
            })
        };

        //编辑／新增合同分类
        $scope.showModal = function(item) {
            item == undefined ? item = { ss: '新增', classifyType: 1 } : item.ss = '修改';
            item.parkId = $scope.search.parkId;
            //radio默认选中值为1

            //item.classifyType = 1;
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/agreement/agreementclassify/modal.classify.html',
                controller: 'editClassifyCtrl',
                //深拷贝
                resolve: { item: angular.copy(item) }
            });
            modal.result.then(function() {
                $scope.find();
            }, function() {
                console.info("Modal dismissed at:" + new Date());
            });

        }

    });


    app.controller("editClassifyCtrl", function($scope, $http, $uibModal, $uibModalInstance, $filter, fac, item) {
        $scope.item = item;

        $scope.save = function(form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            //$scope.item = item;
            $http.post("/ovu-pcos/pcos/compact/classify/edit", $scope.item, fac.postConfig).success(function(data, status, headers, config) {
                if (data.status) {
                    $uibModalInstance.close();
                    msg(data.msg);
                } else {
                    msg(data.msg);
                }
            })
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        }
    });

})();