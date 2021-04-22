


(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('tripScenarioCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $interval) {
        document.title = "OVU-出行管理";
        $scope.search = $scope.param = {};

        $scope.msg_classes = [1, 2, 3, 4, 4, 0];

        function moveUp() {
            let curr = [];
            $scope.msg_classes.forEach(v => {
                curr.push(v);
            });
            let ls = curr.pop();
            curr.unshift(ls);
            $scope.msg_classes = curr;
        }

        $interval(() => {
            moveUp();
        }, 2000);

        var mapCenter = [114.32233, 30.471139];


        // $scope.mainMap.setCenter(mapCenter);

        //左侧大地图
        $scope.mainMapOptions = {
            toolbar: true,
            // map-self config
            resizeEnable: true,
            // ui map config
            uiMapCache: false,
            zoom: 15,
            center: mapCenter,
            //精简模式
            liteStyle: true,
            expandZoomRange: true,


        }

        function addmainMarker(data) {
            var imagePath;
            //判断是室内点还是室外点
            if (data.type == 2) { //室外点
                if (data.equipmentId) { //是否是视频巡查
                    imagePath = '../res/img/inspection/out-camera.png';
                } else {
                    imagePath = '../res/img/inspection/out.png';
                }
            } else {
                if (data.equipmentId) {
                    imagePath = '../res/img/inspection/in.png';
                } else {
                    imagePath = '../res/img/inspection/in.png';
                }
            }

            var icon = new AMap.Icon({
                image: imagePath,
                size: new AMap.Size(30, 30),
                imageSize: new AMap.Size(26, 26)
            });

            var marker = new AMap.Marker({
                position: [data.longitude, data.latitude],
                map: $scope.mainMap,
                icon: icon,
                extData: data,

            });

            marker.setLabel({ //label默认蓝框白底左上角显示，样式className为：amap-marker-label
                offset: new AMap.Pixel(10, 10), //修改label相对于maker的位置
                content: data.name

            });
            return marker;
        }


        var data1 = [{value: 256, name: 'vip车位'},
            {value: 748, name: '非vip车位'}];


        // 设备状态统计
        function setPie(data1,id,title) {

            var myChartStateInfo = echarts.init(document.getElementById(id));
            var stageInfoOption = {
                color: ['#FFD85C', '#37A2DA'],
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}({c}个)"
                },
                legend: {
                    orient: 'vertical',
                    right: 10,
                    top: 75,
                    padding: 0,
                    data: data1,
                    formatter: function (name) {

                        var oa = stageInfoOption.series[0].data;

                        // var num = oa[0].value + oa[1].value + oa[2].value + oa[3].value;

                        for (var i = 0; i < stageInfoOption.series[0].data.length; i++) {

                            if (name == oa[i].name) {

                                return name + ' ' + oa[i].value + '个';

                            }

                        }

                    }
                },
                series: [{
                    name: title,
                    type: 'pie',
                    radius: ['0', '45%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '12',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    center: ['30%', '50%'],
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: data1,

                }]
            };
            myChartStateInfo.setOption(stageInfoOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartStateInfo.resize();
            });
        }

        setPie(data1,'parkingInfo','车位统计');



        app.modulePromiss.then(function () {

        })


    });
})();

