/**
 * Created by wangheng on 2017/9/19.
 * 企业服务中心》空间
 */
(function() {
    "use strict";
    var app = angular.module("app");

    app.controller('spaceMainCtrl', spaceMainCtrl);

    spaceMainCtrl.$inject = ['$scope', '$http','AppService','httpService'];

    function spaceMainCtrl($scope, $http, AppService,httpService) {
        var vm = this;
        //默认展示楼栋的右侧
        vm.title = AppService.park.parkName;
        vm.show = 1;

        vm.parkNo = AppService.parkNo;
        var type = 'space';
        vm.type = type;

        vm.params={
            parkNo:vm.parkNo,
            type:vm.type
        };

        // 如果是长沙，不要（商业）
        if(vm.parkNo == '04301040001ZSRJ'){
            vm.changsha = true;
        }else{
            vm.changsha = false;
        }

        httpService.getComSpace(vm.params).then(function (resp) {
            if(resp.data.success){
                $scope.comSpace = resp.data.datas;
            }
        },function error (resp){

        });

        //进入页面首先查询园区的数据
        var param = { parkNo: AppService.parkNo };
        getSpaceHttp(param);

        //高德
        $scope.$on('toGaode', function(evt, data) {
            evt.stopPropagation();

            vm.show = 1;
            vm.title = AppService.park.parkName;
            param = { parkNo: AppService.parkNo };
            getSpaceHttp(param);
        });

        //楼栋
        $scope.$on('toFloor', function(evt, data) {
            evt.stopPropagation();
            vm.title = data.name;
            //查询右侧详情
            // param.floorNo = AppService.floorNo;
            param.floorNo = data.id;
            delete param.groundNum;
            delete param.houseNo;
            getSpaceHttp(param);
            vm.show = 2;
        });

        //几层
        $scope.$on('toGround', function(evt, data) {
            evt.stopPropagation();
            vm.title = data.name;
            //查询右侧详情
            param.groundNum = data.id;
            delete param.houseNo;
            getSpaceHttp(param);
            vm.show = 3;
        });

        //房间
        $scope.$on('toRoom', function(evt, data) {
            evt.stopPropagation();
            vm.title = data.name;
            //查询右侧详情
            param.houseNo = data.id;
            getSpaceHttp(param);
            vm.show = 4;
        });

        //获取接口数据
        function getSpaceHttp(param) {
            $http.get("/ovu-screen-fake/pcos/show/space", { params: param }).success(function(data) {
                vm.space = data;
                //图表数据
                if (data && data.spackRate) {
                    var chart = [];
                    chart.push({ name: '出售', value: parseInt(data.spackRate.saleAreaRate) }, { name: '租赁', value: parseInt(data.spackRate.vacantAreaRate) }, { name: '空置', value: parseInt(data.spackRate.leaseAreaRate) })
                    vm.option = AppService.commonPileOption(chart);
                }
            });

        }
    }

})();
