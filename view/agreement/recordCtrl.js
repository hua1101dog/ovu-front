(function(){
    "use strict";
    var app = angular.module("angularApp");

    //合同备案管理ctrl
    app.controller("recordCtrl",function($scope, $rootScope, $uibModal, $http, $filter, fac, $state){
        document.title = "OVU-合同备案管理";
        $scope.pageModel = {};
        $scope.search = {};

         //判断是集团版还是项目版
        app.modulePromiss.then(function(){
            $scope.search = {isGroup: fac.isGroupVersion()};
            if($scope.search.isGroup){
                ($scope.search.parkId == undefined || $scope.search.parkId == 'undefined' || $scope.search.parkId == null) ? $scope.search.parkId = '' : $scope.search.parkId;
                $scope.find();
            }else{
                $scope.$watch('park',function(newValue, oldValue){
                    if(newValue && newValue.id){
                        $scope.search.parkId = newValue.id;
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
            
            $scope.search.compactStatus = 2;
            fac.getPageResult("/ovu-pcos/pcos/compact/info/list",$scope.search,function(data){
                $scope.pageModel = data;
            })
        };
        

         $scope.examInform = function (item) {
            sessionStorage.setItem('id', item.infoId);
            $state.go('three', { folder: 'agreement', catalogue: 'agreementcheck', page: 'agreementreading' });
        };
        //合同备案
        $scope.record = function(item){
            sessionStorage.setItem('back','record');
            sessionStorage.setItem('id',item.infoId);
            $state.go('three', { folder: 'agreement', catalogue: 'agreementrecord', page: 'agreementrecord' });
            // $http.post('/ovu-pcos/pcos/compact/info/recordPass',{compactInfoId:item.infoId},fac.postConfig).success(function(data){
            //     if(data.status == 0){
            //         msg(data.desc);
            //     }else{
            //         msg(data.desc);
            //     }
            //     $scope.find();
            // })
        };

        $scope.del = function(item){
            confirm("确认删除吗？",function(){
                $http.post('/ovu-pcos/pcos/compact/info/remove',{compactInfoId:item.infoId},fac.postConfig).success(function(data){
                    if(data.status){
                        $scope.find();
                        msg(data.msg);
                    }else{
                        msg(data.msg);
                    }
                })
            })
        }

        //编辑／新增合同分类
        $scope.showModal = function(item){
            item == undefined ? item = {ss:'新增'} : item.ss = '编辑';
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/agreement/agreementclassify/modal.classify.html',
                controller: 'editClassifyCtrl',
                resolve: {item: item}
            });
            modal.result.then(function(){
                $scope.find();
            },function(){
                console.info("Modal dismissed at:" + new Data());
            });

        }

    });


    app.controller("editClassifyCtrl",function($scope, $http, $uibModal, $uibModalInstance, $filter, fac, item){
        $scope.item = item;
        $scope.save = function(form,item){
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            $scope.item = item;

            $http.post("/ovu-pcos/pcos/compact/classify/edit",$scope.item, fac.postConfig).success(function(data, status, headers, config){
                if(data.status){
                    $uibModalInstance.close();
                    msg("保存成功");
                }else{
                    alert("保存失败");
                }
            })
        };

        $scope.cancel = function(){
            $uibModalInstance.dismiss("cancel");
        }
    });

})();