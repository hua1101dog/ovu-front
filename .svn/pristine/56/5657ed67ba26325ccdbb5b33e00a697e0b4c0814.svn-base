// 集团版统计概览 by Cx
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('multipleOverviewCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "统计概览";
        $scope.pageModel = {};
        $scope.search = {};
        app.modulePromiss.then(function () {
            $scope.search.type = fac.isGroupVersion() ? 1 : 0;
            fac.initPage($scope, function () {

                $scope.find(1);
            }, function () {
                $scope.find(1);
            })
        });
       
        //列表查询
        $scope.yqArea = 0; //园区面积
        $scope.zzArea = 0;  //住宅面积
        $scope.yqParkCnt = 0; //园区个数
        $scope.zzParkCnt = 0;  //住宅个数
        $scope.yqEquipmentCnt = 0; //园区设备数
        $scope.zzEquipmentCnt = 0;  //住宅设备数
        $scope.yqEquipmentRatio=0; //园区设备比值
        $scope.zzEquipmentRatio = 0;  //住宅设备比值
        $scope.yqSensorsCnt=0; //园区传感器数
        $scope.zzSensorsCnt = 0;  //住宅传感器数
        $scope.yqSensorRatio=0; ///园区传感器比值
        $scope.zzSensorRatio = 0;  ///住宅传感器比值
        $scope.yqSensorEquimentRatio=0; ///园区设备&传感器比值
        $scope.zzSensorEquimentRatio = 0;  ///住宅设备&传感器比值
        $scope.yqPersonsCnt=0; //园区人员数
        $scope.zzPersonsCnt=0; //住宅人员数
        $scope.find = function () {
            $http.get("/ovu-pcos/pcos/reportstatnew/getOverview").success(function (data) {
                $scope.total = data;
                //项目面积
                data.areaList.forEach(function (v) {
                    v.area = v.area|| 0
                    if (v.yeTai == 'YQ') {
                        $scope.yqArea = $scope.yqArea + v.area - 0
                    } else {
                        $scope.zzArea = $scope.zzArea + v.area - 0
                    }
                })
                //项目个数
                data.parkCntList.forEach(function (v) {
                    v.parkCnt = v.parkCnt|| 0
                    if (v.yeTai == 'YQ') {
                        $scope.yqParkCnt = $scope.yqParkCnt + v.parkCnt - 0
                    } else {
                        $scope.zzParkCnt = $scope.zzParkCnt + v.parkCnt - 0
                    }
                })
                //项目设备数
                data.equipmentCntList.forEach(function (v) {
                    v.equipmentCnt=v.equipmentCnt|| 0
                    if (v.yeTai == 'YQ') {
                        $scope.yqEquipmentCnt = $scope.yqEquipmentCnt + v.equipmentCnt - 0
                    } else {
                        $scope.zzEquipmentCnt = $scope.zzEquipmentCnt + v.equipmentCnt - 0
                    }
                })
                data.equipmentRatio=Math.round(data.equipmentRatio*100)/100  //项目设备比值
                $scope.zzEquipmentRatio=Math.round($scope.zzEquipmentCnt/$scope.zzArea*100)/100  //住宅设备比值
                $scope.yqEquipmentRatio=Math.round($scope.yqEquipmentCnt/$scope.yqArea*100)/100  //园区设备比值
                 //项目传感器总数
                 data.sensorsCntList.forEach(function (v) {
                    v.sensorsCnt=v.sensorsCnt || 0
                    if (v.yeTai == 'YQ') {
                        $scope.yqSensorsCnt = $scope.yqSensorsCnt + v.sensorsCnt - 0
                    } else {
                        $scope.zzSensorsCnt = $scope.zzSensorsCnt + v.sensorsCnt - 0
                    }
                })
                //项目传感器比值
             
                data.sensorEquimentRatio=Math.round(data.sensorEquimentRatio*100)/100  //项目传感器比值
                $scope.zzSensorRatio=Math.round($scope.zzSensorsCnt/$scope.zzArea*100)/100  //住宅传感器比值
                $scope.yqSensorRatio=Math.round($scope.yqSensorsCnt/$scope.yqArea*100)/100  //园区传感器比值
                //项目设备&传感器比值
                 data.sensorsRatio=Math.round(data.sensorsRatio*100)/100  //项目传感器比值
                 $scope.zzSensorEquimentRatio=Math.round($scope.zzSensorsCnt/$scope.zzEquipmentCnt*100)/100  //住宅设备&传感器比值
                 $scope.yqSensorEquimentRatio=Math.round($scope.yqSensorsCnt/$scope.yqEquipmentCnt*100)/100  //园区设备&传感器比值

                  //项目总数
                  data.personsList.forEach(function (v) {
                    v.personsCnt=v.personsCnt || 0
                    if (v.yeTai == 'YQ') {
                        $scope.yqPersonsCnt = $scope.yqPersonsCnt + v.personsCnt - 0
                    } else {
                        $scope.zzPersonsCnt = $scope.zzPersonsCnt + v.personsCnt - 0
                    }
                })
                 //人员项目比
                 data.personsAreaRatio=Math.round(data.personsAreaRatio*100)/100
            });
        };



    });


})();