/**
 * Created by wangheng on 2017/9/19.
 * 园区安全中心》防盗报警
 */
(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('dispatchMainCtrl', dispatchMainCtrl);

    function dispatchMainCtrl($scope, $http, AppService) {
        var vm = this;

        var parkNo = vm.parkNo = AppService.parkNo;
        var type = 'dispatch';
        vm.type = type;
        vm.statusList = [
            [0, "待派发"],
            [1, "已派发"],
            [4, "已退回"],
            [5, "已接单"],
            [7, "已执行"],
            [8, "已评价"]
        ];

        vm.checked;
        var obj = {};

        vm.checkOne = function(id) {
            obj.id = id;
            vm.checked = id;
            $scope.$broadcast('showBubble',obj);
        };

        // 设备工单列表
        $scope.$on('toWork',function (evt, data) {
          console.log(data);
          vm.location = data.location;
          $http.get('/ovu-screen/pcos/show/workunit/workUnitOne', { params: { domainId: data.domain_id, equipment_id: data.id} }).success(function (res) {
            console.log(res.data);
            vm.workUnitList = res.data;
          });
        });

        getCommonRight();
        //右侧方法
        function getCommonRight() {

            //1.业主报事列表
            $http.get('/ovu-screen/residence/workOrder/queryWorkUnitList.do',{params:{parkNo: parkNo}}).success(function (result) {

                vm.workList = result.data && result.data.filter(function(da){
                  return da.WORKUNIT_TYPE == 2;
                });
                vm.numW=4;
                vm.infoW="查看更多《" ;
                vm.getmoreW=function(){
                    if(vm.infoW=="查看更多《"){
                      vm.numW=vm.workList.length;
                      vm.infoW="收起《";
                    }
                    else{
                      vm.numW=4;
                      vm.infoW="查看更多《";
                    }

                }

            });

            //2.设备传感器异常列表

            var param = { parkNo: vm.parkNo, type: 'sensor' };

            // 传感器报警
            $http.get('/ovu-screen/pcos/show/sensorAlertList.do',{params:{parkNo: parkNo, type: 'sensor'}}).success(function (result) {

                var data = result.data;

                vm.sensorList = data.filter(function(v) {

                    return v.is_regular != 1 && v.equip_type != 'gate' && v.equip_type != 'infrared';
                });
                vm.nums=4;
                vm.infos="查看更多《" ;
                vm.getmores=function(){
                    if(vm.infos=="查看更多《"){
                      vm.nums=vm.sensorList.length;
                      vm.infos="收起《";
                    }
                    else{
                      vm.nums=4;
                      vm.infos="查看更多《";
                    }

                      };
                vm.alarmList = data.filter(function(v) {

                    return v.equip_type == 'gate' || v.equip_type == 'infrared';
                });
                vm.num=4;
                    vm.info="查看更多《" ;
                    vm.getmore=function(){
                        if(vm.info=="查看更多《"){
                          vm.num=vm.alarmList.length;
                          vm.info="收起《";
                        }
                        else{
                          vm.num=4;
                          vm.info="查看更多《";
                        }

                    };

            });

        }

    }

})();
