/**
 * Created by Zn on 2018/1/2.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");

    app.controller('abnormalBroadcastCtrl', function ($scope, $rootScope, $uibModal, $state, $http, $filter, fac) {
        document.title='设备房异常播报';
        app.modulePromiss.then(function() {
            $scope.search={};
            $scope.$watch('dept.id', function(deptId, oldValue) {
                if (deptId) {
                    if($scope.dept.parkId){
                        $scope.search.parkId = $scope.dept.parkId;
                        $http.post('/ovu-pcos/pcos/equiphouse/getReport',$scope.search,fac.postConfig).success(function (data) {
                            $scope.data=data
                        })
                    }else {
                        alert('请选择跟项目关联的部门');
                        return
                    }
                    
                } 
            })
          
        })
        $scope.goEquipInform=function (item) {
            sessionStorage.setItem("equipName",item.equipHouseName);
            sessionStorage.setItem("houseId",item.houseId);
            sessionStorage.setItem("equipHouseId",item.equipHouseId);
            // $state.go('admin', {folder: 'equipmentroom', page: 'equipInform'});
            $rootScope.target('/equipmentroom/equipInform','设备房概览详情',false,'','','/equipmentroom/equipInform')
        }
    });
})();
