(function(){
    "use strict";
    var app = angular.module("angularApp");
    var parkId;
    //数据项管理
    app.controller("dataCtrl",function($scope, $rootScope,$uibModal, $http, $state, $filter, fac){
        document.title = "合同数据项管理";
        $scope.pageModel = {};
        $scope.search = {};


        //判断是集团版还是项目版
        app.modulePromiss.then(function(){
            $scope.search = {isGroup: fac.isGroupVersion()};
            if($scope.search.isGroup){
                ($scope.search.parkId == undefined || $scope.search.parkId == 'undefined' || $scope.search.parkId == null) ? $scope.search.parkId = '' : $scope.search.parkId;
                parkId = $scope.search.parkId;
                $scope.find();
            }else{
                $scope.$watch('park',function(newValue, oldValue){
                    if(newValue && newValue.id){
                        $scope.search.parkId = newValue.id;
                        parkId = $scope.search.parkId;
                        //$scope.search.PARK_NAME = newValue.PARK_NAME;
                        $scope.find();
                    }else{
                        alert("请先选定一个项目");
                    }
                });
            }
        });
        
        $scope.find = function(pageNo){
            $.extend($scope.search, { currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10});
            $scope.search.pageIndex = $scope.search.currentPage - 1;

            fac.getPageResult("/ovu-pcos/pcos/compact/dataitem/pageQuery",$scope.search,function(data){
                $scope.pageModel = data;
            })
        };
        
        
        $scope.del = function(item){
            confirm("确定删除吗？",function(){
                $http.post('/ovu-pcos/pcos/compact/dataitem/del',{dataItemId:item.dataItemId},fac.postConfig).success(function(data){
                    if(data.status){
                        $scope.find();
                        msg(data.msg);
                    }else{
                        msg(data.msg);
                    }
                })
            })
        };

        //编辑／新增
        $scope.showModal = function(item){
             //默认的radio选中值，设置title
            item == undefined ? item = {ss:'新增合同数据项',dataItemType: 1,isNeed:1} : item.ss = '修改合同数据项';
            //把parkId加到item中传到modal
            item.parkId = $scope.search.parkId;
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/agreement/agreementdata/modal.data.html',
                controller: 'editDataModalCtrl',
                resolve: {item: angular.copy(item)}
            });
            modal.result.then(function(){
                $scope.find();
            });
            modal.rendered.then(function(){
                console.log("Modal rendered");
            });
            modal.opened.then(function(){
                console.log("Modal opened");
            });
        }

    });

    app.controller("editDataModalCtrl",function($scope, $http, $uibModal, $uibModalInstance, $filter, fac, item){
        $scope.item = item;
        
        // item == undefined ? item = {dataItemId:undefined} : item;
        // if(item.dataItemId){
        //     $scope.title = '修改合同数据项';
        // }else{
        //     $scope.title = '新增合同数据项';
        // }
        //如果是编辑
        // if(item.dataItemId){
        //     $scope.title = '编辑';
        //     $http.post("/ovu-pcos/pcos/compact/dataitem/edit",{},fac.postConfig).success(function(res){
        //         console.log(res);
        //     })
        // }
        $scope.save = function(form,item){
           console.log($scope.item);
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            //item.parkId = parkId;
            $http.post("/ovu-pcos/pcos/compact/dataitem/edit",$scope.item, fac.postConfig).success(function(data, status, headers, config){
                if(data.status){
                    $uibModalInstance.close();
                    msg("保存成功！");
                }else{
                    alert("保存失败");
                }
            })

        }

        $scope.cancel = function(){
            $uibModalInstance.dismiss("cancel");
        };
    })
})();