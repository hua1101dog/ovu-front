(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('securityScenarioCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $interval) {
        document.title = "OVU-安防管理";
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


        var data1 = [{value: 862, name: '正常'},
            {value: 18, name: '异常'}];
        var data2 = [{value: 862, name: '正常'},
            {value: 18, name: '异常'}];
        var data3 = [{value: 862, name: '正常'},
            {value: 18, name: '异常'}];


        // 设备状态统计
        function setPie(data1,id,t) {

            var myChartStateInfo = echarts.init(document.getElementById(id));
            var stageInfoOption = {
                color: ['#0C86E4', '#FF5B36'],
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
                    name: t,
                    type: 'pie',
                    radius: ['30%', '50%'],
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

        setPie(data1,'cameraInfo','摄像头');
        setPie(data2,'gateInfo','门禁');
        setPie(data3,'evalerInfo','电梯');



        app.modulePromiss.then(function () {

        })


    });
})();
