(function() {
    var app = angular.module("angularApp");

    app.controller('passengerChartsCtl', function ($scope,$rootScope,$uibModal, $http,$filter,fac) {
        document.title ="OVU-客流统计表";
        $scope.cameras = [];
        $scope.search = {numType:'',timeType:'hour'};


        app.modulePromiss.then(function(){
            $rootScope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    delete $scope.search.floorId;
                    delete $scope.search.buildName;
                    getBuildTree(deptId);

                    $scope.showChart();
                }
            })
        });

        function getBuildTree(deptId) {
            $http.post("/ovu-pcos/pcos/passengerFlow/getBuildTree.do",{deptId:deptId},fac.postConfig).success(function (data) {
                if(data.code==0){
                    $scope.houseTree=data.data;
                }
            });
        }

        $scope.selectBuild=function () {
            if (!$scope.search.floorId) {
                $scope.cameras = [];
                return;
            }
            var param={deptId:$rootScope.dept.id,floorId:$scope.search.floorId};
            $http.post('/ovu-pcos/pcos/passengerFlow/list.do',param,fac.postConfig).success(function (resp) {
                if (resp.data){
                    var videos=resp.data[0].videos;
                    $scope.cameras = videos;
                } else{
                    $scope.cameras = [];
                }
            })
        };

        $scope.onChange=function () {
            delete $scope.search.time;
            delete $scope.search.startTime;
            delete $scope.search.endTime;
            $scope.showChart();
        }

        $scope.showChart=function(){
            var sc=[];
            $scope.cameras.forEach(function (c) {
                if(c.checked && c.code){
                    sc.push(c.code);
                }
            });
            $scope.search.cameraCodes=sc.join();


            //加载图表
            if(!$scope.search.floorId || !$scope.search.cameraCodes){
                return;
            }
            if($scope.search.timeType=='hour' && !$scope.search.time){
                return;
            }
            if($scope.search.timeType!='hour' && (!$scope.search.startTime || !$scope.search.endTime)){
                return;
            }

            loadData($scope.search);
        }

        //获取图表数据
        function loadData(search){
            var url='/dapingAgent/api/camera';
            if (search.timeType=='hour'){
                url+='/getHourCameraPassenger';
            } else if (search.timeType=='day'){
                url+='/getEveryDayCameraPassenger';
            }else if (search.timeType=='month'){
                url+='/getEveryMouthCameraPassenger';
            }

            $http.post(url,search,fac.postConfig).success(function (resp) {
                var data={cameraNames:[],times:[],data:[]};
                if (resp.code==0){
                    var tempData=resp.data;

                    data.cameraCodes=tempData.cameraCodes;
                    data.cameraCodes.forEach(function (code) {
                        $scope.cameras.forEach(function (o) {
                            if (code==o.code){
                                data.cameraNames.push(o.name);
                            }
                        })
                    })

                    data.times=tempData.times;
                    tempData.data.forEach(function (item) {
                        var came={};
                        came.type='line';
                        came.name=item.code;
                        $scope.cameras.forEach(function (o) {
                            if (item.code==o.code){
                                came.name=o.name;
                            }
                        })
                        came.data=[];
                        var enters=item.numberModel.enters;
                        var exits=item.numberModel.exits;
                        var retens=item.numberModel.retens;
                        var totals=item.numberModel.totals;
                        if (search.numType==1){
                            came.data=enters;
                        } else if (search.numType==2) {
                            came.data=exits;
                        }else if (search.numType==3) {
                            came.data=retens;
                        }else{
                            came.data=totals;
                        }
                        data.data.push(came);
                    })
                }

                loadChart(data);
            })
        }

        //加载图表
        function loadChart(data) {
            var myChart = echarts.init(document.getElementById('chart'));

            var totalNum=0;
            data.data.forEach(function (item) {
                item.data.forEach(function (num) {
                    totalNum+=num;
                })
            })

            var option = {
                title: {
                    text: '客流量统计',
                    subtext: '总人数：'+totalNum+'人'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:data.cameraNames
                },
                toolbox: {
                    show: false
                },
                xAxis:  {
                    type: 'category',
                    boundaryGap: false,
                    data: data.times
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} 人'
                    }
                },
                series: data.data
            };

            myChart.setOption(option,true);
        }

    });

})()
