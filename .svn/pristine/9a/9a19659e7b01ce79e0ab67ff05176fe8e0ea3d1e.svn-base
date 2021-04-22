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



        getCommonRight();
        //右侧方法
        function getCommonRight() {
            //1.业主报事列表
            $http.get('/ovu-screen/pcos/show/workunit/listNoEquId.do',{params:{domainId: AppService.domainId}}).success(function (result) {
                vm.workList = result.data && result.data.filter(function(da){
                    return da.WORKUNIT_TYPE == 2;
                });
                vm.sensorList = result.data && result.data.filter(function(da){
                    return da.equipment_id;
                });
            });

            //2.设备传感器异常列表
            var param = { parkNo: vm.parkNo, type: 'sensor' };

             //传感器报警
            $http.get('/ovu-screen/pcos/show/sensorAlertList.do',{params:{parkNo: parkNo, type: 'sensor'}}).success(function (result) {
                var data = result.data;

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
         /*   param.type='alarm';
            //安防报警
            AppService.getEquipList(param).then(function(data) {
                vm.alarmList = data.data.filter(function(item) {
                    return item.equip_status != 1;
                });
            });*/

            //左侧巡查事项列表
           /* $http.get('/ovu-screen/residence/workOrder/getPatrolMatter.do',{params:{parkNo: parkNo}}).success(function (result) {
                vm.time = moment().hour() *60 + moment().minute();
                result.data.forEach(function (da) {
                    var temptime = da.patrolDate.split('-')[1].split(":");
                    if((temptime[0]*60+Number(temptime[1]))<vm.time){
                        da.isGreen = true;
                    }
                });
                vm.patrolMatterList = result.data;

            });*/


        }


    }

})();
