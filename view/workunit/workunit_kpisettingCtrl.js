/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('workunitKpiSettingCtl', function ($scope,$rootScope,$uibModal, $http,$filter,fac) {
        document.title ="关键指标统计设置";
        $scope.item={};

        app.modulePromiss.then(function(){
            $scope.find();
        })

        $scope.find = function(){
            $http.post("/ovu-pcos/pcos/workunit/kpisetting/get.do").success(function (resp, status, headers, config) {
                if (resp.code==0) {
                    $scope.item=resp.data;
                    if(!$scope.item.id){
                        $scope.item.cycleType=2;
                    }
                } else {
                    alert(resp.msg);
                }
            })
        };

        $scope.checkType=function(item){
            item.startDay=null;
            item.endDay=null;
        }

        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            if (item.cycleType==1){
                delete item.startDay;
                delete item.endDay;
            }
            item.outJson=JSON.stringify(item.outList);

            confirm("确认更改设置?",function(){
                doSave();
            });

            function doSave(){
                $http.post("/ovu-pcos/pcos/workunit/kpisetting/save.do", item,fac.postConfig).success(function (resp, status, headers, config) {
                    if (resp.code==0) {
                        msg("保存成功!");
                    } else {
                        alert(resp.msg);
                    }
                })
            }

        };
    });

})();
