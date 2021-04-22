/**
 * Created by Zn on 2017/11/20.
 */
(function (angular) {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('dataInformCtrl', function ($scope, $rootScope, $uibModal,$sce, $state, $http, $filter, fac){
        /*console.log($rootScope.currentItem);
        console.log(sessionStorage.getItem("parkId"));*/
        $scope.back=function () {
            // sessionStorage.setItem('parkId',sessionStorage.getItem("parkId"));
            // sessionStorage.setItem('parkName',sessionStorage.getItem("parkName"));
            // $state.go('three',{folder:'energy',catalogue:'measureDataManage',page:'measureDataManage'});
            $rootScope.target('energy/measureDataManage/measureDataManage','计量点数据管理',false,'','','energy/measureDataManage/measureDataManage')
          
        };
        if(sessionStorage.getItem("pointId")){
            $http.post("/ovu-energy/energy/data/detail/info",{pointId:sessionStorage.getItem("pointId")}, fac.postConfig).success(function (data) {
              /*  $scope.BaseData=data;
                console.log(data);*/
                var BaseData=data.data;
                BaseData.spaceName=BaseData.spaceName && $sce.trustAsHtml(BaseData.spaceName.split(",").map(function (v,i) {
                    return (i+1)+'.'+v;
                }).join('<br>'))
                 $scope.BaseData = BaseData;
            });
        }
        $scope.search={
            pointId:sessionStorage.getItem("pointId")
        };
        $scope.pageModel={};
        app.modulePromiss.then(function () {
             fac.initPage($scope,function(){
                $scope.find();
            },function(){
                $scope.find();
            })
        })
        $scope.dataInform={
            pointId:sessionStorage.getItem("pointId")
        }
        $scope.find = function (pageNo) {
            $.extend($scope.dataInform, {currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10});
            $scope.dataInform.pageIndex = $scope.dataInform.currentPage - 1;
            fac.getPageResult("/ovu-energy/energy/data/detail/data", $scope.dataInform, function (data) {
                $scope.pageModel = data;

            });
        };
        $scope.export=function () {
            var checkedItemsId='';
            var checkedItems = $scope.pageModel.data.filter(function(item){
                return item.checked;
            });
            for (var i = 0; i < checkedItems.length; i++) {
                checkedItemsId+=checkedItems[i].dataId+',';
            }
            checkedItemsId=(checkedItemsId.substring(checkedItemsId.length-1)===',')?checkedItemsId.substring(0,checkedItemsId.length-1):checkedItemsId;
            if(checkedItemsId!==''){
                window.location.href='/ovu-energy/energy/data/export?dataIds='+checkedItemsId;
            }
            else {
                alert("请勾选下面条目");
            }
        }
        $scope.del=function (item) {
            confirm("确认删除该项吗?",function () {
                $http.get('/ovu-energy/energy/data/delete?dataId='+item.dataId).success(function (data) {
                    if(data.code==0){
                        msg(data.msg);
                        $scope.find();
                    }
                    else {
                        alert(data.msg);
                    }
                });
            })
        }
        $scope.addData=function (item) {
            var flag;
            if(item){
                flag = true;
            }else{
                flag=false;
                item={
                    pointId:sessionStorage.getItem("pointId"),
                    dataId:undefined
                };
            }
            /*var param={
                parkId:sessionStorage.getItem("parkId"),
                foolrId:$rootScope.currentItem.foolrId,
                pointId:sessionStorage.getItem("pointId"),
                id:item.id
            }*/
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/energy/measureDataManage/modal.addData.html',
                controller: 'addDataModalCtrl',
                resolve:{
                    isEdit:flag,
                    param:item
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        $scope.dataManage=function (item) {
            $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/energy/measureDataManage/modal.dataManage.html',
                controller: 'dataManageModalCtrl',
                resolve:{
                    param:item
                }
            });
        };
    });
    app.controller('addDataModalCtrl', function ($scope, $rootScope, $uibModal,$uibModalInstance, $state, $http, $filter, fac,isEdit,param){
        // console.log(isEdit);
        $scope.isEdit=isEdit;
        $scope.item=param;

        if($scope.item.dataId){
            $http.post('/ovu-energy/energy/data/get',{dataId:$scope.item.dataId},fac.postConfig).success(function (data) {
                $scope.item=data.data;
            });
        }
        $scope.save=function () {
            if($scope.item.dataId){
                if($scope.item.originalValue==undefined ||$scope.item.originalTime==undefined||$scope.item.modifyValue==undefined||$scope.item.modifyTime==undefined){
                    alert("请填写完整");
                    return
                }
            }
            else {
                if($scope.item.originalValue==undefined ||$scope.item.originalTime==undefined){
                    alert("请填写完整");
                    return
                }
            }
            $http.post('/ovu-energy/energy/data/edit',$scope.item,fac.postConfig).success(function (data) {
                if(data.code==0){
                    msg(data.msg);
                    $uibModalInstance.close();
                }
                else {
                    alert(data.msg);
                }
            });

        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    app.controller('dataManageModalCtrl', function ($scope, $rootScope, $uibModal,$uibModalInstance, $state, $http, $filter, fac,param){
        $scope.initData=function () {
            $http.post("/ovu-energy/energy/data/space/get",{dataId:param.dataId}, fac.postConfig).success(function (data) {
                if (data.code==0) {
                    $scope.allData=data.data;
                    if($scope.allData.spaceList){
                        for (var i = 0; i < $scope.allData.spaceList.length; i++) {
                            $scope.allData.spaceList[i].seeStatus=true;
                        }
                        if(($scope.allData.spaceList.length==1) && !$scope.allData.spaceList[0].value){
                            $scope.allData.spaceList[0].value=$scope.allData.minusValue
                        }
                    }
                } else {
                    alert(data.msg);
                }
            });
        };
        $scope.initData();
        $scope.editBtn=function (item) {
            item.seeStatus=false;
        }
        /*$scope.del=function (id) {
            console.log(id);
            for (var i = 0; i < $scope.allData.spaceList.length; i++) {
                var spaceObj = $scope.allData.spaceList[i];
                if(spaceObj.spaceId==id){
                    $scope.allData.spaceList.splice(i,1);
                }
            }
            console.log($scope.allData.spaceList);
        }*/
        $scope.cancelBtn=function (item) {
            item.seeStatus=true;
        }
        $scope.saveBtn=function (item) {
            if(!item.value){
                alert("输入不能为空");
                return;
            }
            var values=0;
            for (var i = 0; i < $scope.allData.spaceList.length; i++) {
                var v = $scope.allData.spaceList[i];
                values+=parseInt(v.value);
            }
            /*$scope.allData.totalValue=values;*/
            item.seeStatus=true;
            /*$scope.allData.totalValue=*/
            /* $http.post("/ovu-pcos/pcos/foolrRecord/editor",item, fac.postConfig).success(function (data) {
                console.log(data);
            });*/
        }
        $scope.save=function () {
            var values=0;
            for (var i = 0; i < $scope.allData.spaceList.length; i++) {
                var v = $scope.allData.spaceList[i];

                if(v.value==''){
                    alert("输入不能为空");
                    return
                }
                values+=parseFloat(v.value);
            }
           if($scope.allData.totalValue==values){
               $http.post('/ovu-energy/energy/data/space/edit',{dataId:$scope.allData.dataId,spaceList:$scope.allData.spaceList}).success(function (data) {
                   if(data.code==0){
                       msg(data.msg);
                       $uibModalInstance.close();
                   }
                   else {
                       alert(data.msg);
                   }
               });
           }
           else {
               alert("分户数据之和与总计数据不同");
               return;
           }

        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})(angular)
