/**
 * Created by Zn on 2018/1/8.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");

    app.controller('historyVideoCtrl', function ($scope, $rootScope, $uibModal, $state, $http, $filter, fac) {
        $scope.search = {};
        app.modulePromiss.then(function() {
            // $scope.$watch('park', function(newValue, oldValue) {
            //     //回显下拉框,因为sessionStorage取的是字符串的id，所以减0转换为数值类型
            //     $scope.search={
            //         equipHouseId:sessionStorage.getItem('equipHouseId')-0
            //     };
            //     if (newValue && newValue.id) {
            //         $scope.search.parkId = newValue.id;
            //         $scope.search.parkName = newValue.parkName;
            //         $scope.selectEquip();
            //     } else {
            //         alert("请先选定一个项目");
            //     }
            // })
            $scope.$watch('dept.id', function (deptId, oldValue) {
                //回显下拉框,因为sessionStorage取的是字符串的id，所以减0转换为数值类型
                $scope.search={equipHouseId:sessionStorage.getItem('equipHouseId')-0};
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId;
                        $scope.selectEquip();
                    } else {
                        alert('请选择跟项目关联的部门');
                        return
                    }

                }
            })
        })
        $scope.selectEquip=function () {
            $http.post('/ovu-pcos/pcos/equiphouse/getHouseListName',$scope.search,fac.postConfig).success(function (data) {
                $scope.equipNameArr=data;
//                $scope.find();
            })
        }
        
        $scope.find=function () {
            if(!$rootScope.dept ||!$rootScope.dept.id){
                alert("请选择部门！");
                return false;
            }
            if((!$scope.search.startTime) && (!$scope.search.endTime)){
                alert('请选择时间');
                return
           }
            $http.post('/ovu-pcos/pcos/equiphouse/recordHistory',$scope.search,fac.postConfig).success(function (data) {
                $scope.videoList=data;
              
            })
        }
        //进入视频
        // $scope.enterVideo=function(id){
        //     if(fac.isEmpty(id)){
        //         alert('该地点未绑定视频');
        //         return;
        //     }
        //     $http.post('/ovu-pcos/pcos/equiphouse/recordHistoryReplay', {replayId:id},fac.postConfig).success(function (data) {
        //         fac.showVideo(data);
        //       })
        // }
        /*$scope.goEquipInform=function (item) {
            sessionStorage.setItem("equipName",item.equipHouseName);
            $state.go('admin', {folder: 'equipmentroom', page: 'equipInform'});
        }*/
    });
})();
