
(function () {
    "use strict";
    var app = angular.module("app");

    app.controller('equipmentCtrl', equipmentCtrl);

    function equipmentCtrl($scope, $http, AppService) {
        var vm = this;
        var parkNo = AppService.parkNo;
        var totalNum;
        var regularNum;
        var brokenNum;
        var failNum;
        vm.statusList = [
            [0, "待派发"],
            [1, "已派发"],
            [4, "已退回"],
            [5, "已接单"],
            [7, "已执行"],
            [8, "已评价"]
        ];
        vm.markers = [];
        //地图基本配置
        vm.mapOptions = {
            uiMapCache : false,
            zoom:18,
            liteStyle:true,
            mapStyle: 'amap://styles/darkblue',
            center:[114.330813,30.518567]
        };
        ///ovu-screen/pcos/show/total.do?parkNo=042010600012046
        //"{\"data\":{\"total\":1468,\"broken_num\":1,\"fail_num\":11,\"regular_num\":1456,\"max_regular_days\":177628},\"success\":true}"
        $http.get('/ovu-screen/pcos/show/total.do?parkNo='+AppService.parkNo).success(function (res) {
            totalNum = res.data.total;
            regularNum = res.data.regular_num;
            brokenNum = res.data.broken_num;
            failNum = res.data.fail_num;

            vm.option1 = {
                title: {
                    text: '设备故障统计',
                    left: 'center',
                    textStyle: {
                        color: '#ccc'
                    }
                },
                // color:[
                //     "#d14a61","#5793f3"
                // ],
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical'
                },
                series : [
                    {
                        name: '设备状态',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:[
                            {value:failNum, name:'故障'},
                            {value:brokenNum, name:'停用'},
                            {value:regularNum, name:'正常'}
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };

        });

        $http.get('/ovu-screen/pcos/show/equip/list?parkNo='+AppService.parkNo).success(function (res) {
            var markers=[];

            res.data && res.data.forEach(function (da) {
                da.longitude_ && markers.push(addMarker(da));
            });

            vm.markers = markers;

        });

        $http.get('/ovu-screen/residence/workOrder/queryWorkUnitList.do',{params:{parkNo: parkNo}}).success(function (result) {
            vm.workList = result.data;
        });



        function addMarker(data) {
            var marker = new AMap.Marker({
                position : [data.longitude_, data.latitude_],
                map : vm.map,
                zIndex: 1000,
                icon : "/show2046/res/img/icon_map_localize.png"
            });
            return marker;
        }
    }

})();
