/**
 * Created by wangheng on 2017/9/19.
 * 电梯运行监测
 */
(function() {
    "use strict";
    var app = angular.module("app");

    //预警事件控制器
    app.controller('ElevatorMonitoringCtrl', ElevatorMonitoringCtrl);
    function ElevatorMonitoringCtrl($scope, $http, $uibModal, fac,AppService) {
        document.title = "电梯运行监测";
        var vm = this;
        $scope.pageModel = {};
        $scope.search = {};
        $scope.names = ['图片模式', '列表模式'];
        $scope.selectedName = $scope.names[0];  //默认选择图片模式

        $scope.find = function(pageNo) {
            angular.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("/ovu-pcos/pcos/liftreport/center/single/lift/display/page.do", $scope.search, function(data) {
                $scope.pageModel = data;
            });
            //查询总数
            $scope.findToatl();
        }
        //查询总数
        $scope.findToatl = function() {
            $http({
                method: 'post',
                url: '/ovu-pcos/pcos/liftreport/center/single/lift/display/total.do',
                params: $scope.search
            }).success(function(data) {
                $scope.totalData = data;
            });
        }

        //查询维保单位list
        AppService.getMaintenanceunitList().then(function (data) {
            $scope.maintenanceunitList = data || [];
        })
        //获取设备类型树
        $http.get("/ovu-pcos/pcos/equipment/getEmtTree.do").success(function(resp){
            if(resp.success){
                $scope.typeData  = resp.data;
            }
        })
        //选择树节点
        $scope.selectNode = function(node){
            //电梯分类
            if(node.domain_id){
                if(fac.isEmpty(node.nodes)){
                    $scope.search.modelId = node.id;
                    $scope.search.modelName = node.text;
                    $scope.search.modelHover = $scope.search.modelFocus = false;
                }else{
                    alert("请选择产品型号！");
                }
            }else{
                //项目数
                if ($scope.curNode != node) {
                    $scope.curNode && $scope.curNode.state && ($scope.curNode.state.selected = false);
                }
                node.state = node.state || {};
                node.state.selected = !node.state.selected;
                if (node.state.selected) {
                    $scope.curNode = node;
                    $scope.find();
                } else {
                    delete $scope.curNode;
                }
            }
        }

        /**
         * 2017/10/19 by wangheng
         * 选择维保单位
         */
        vm.chooseMaintenanceNumber = function(){
            var modal = $uibModal.open({
                animation: false,
                size:'lg',
                component: 'maintenanceModelComponent'
            });
            modal.result.then(function (data) {
                $scope.search.maintainName=data.companyName;
                $scope.search.maintainNumber=data.number;
            }, function () {
            });
        }

        $scope.find(1);

    }
})();
