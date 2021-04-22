var mytoday = '';
(function () {
    "use strict";
    var app = angular.module("angularApp");

    // 资产信息
    app.controller('passengerFlowReportCtrl', function ($scope, $rootScope, $sce, $uibModal, $state, $http, $filter, fac) {
        document.title = '客流报表';

        let curTime = new Date();

        let today = $filter('date')(curTime, 'yyyy-MM-dd');


        let typeConfig=[
            function (val) {
                return val+':00'
            },
            function (val) {
                return Number(val)+'日'
            },
            function (val) {
                return Number(val)+'月'
            },
        ];

        $scope.Time=today;
        mytoday=today;

        $scope.type0=1;



        function setKLTJ(type,time){
            if(time){
                $http.post('/ovu-gallery/api/visit/getVisitTotalByTime', {type:type,time:time}, fac.postConfig).then(res=>{
                    console.log(res.data.data)
                    $scope.option = setOption(res.data.data,type);
                });
            }else {
                alert('请选择时间');
            }

        }

        setKLTJ(1,today);


        // 页面初始化
        app.modulePromiss.then(function () {


        })
        $scope.info={};

        $http.get('/ovu-gallery/api/visit/getVisitTotal').then(res=>{
            $scope.info=res.data.data;
        })

        $scope.chooseOne=function(index){
            $scope.type0=index;

        }


        $scope.totalP=0;

        $scope.find=function(){
            setKLTJ($scope.type0,$scope.Time);
        };

        function setOption(data,type){
            let v_data = [];
            let t_data = [];
            let setType = typeConfig[type-1];
            let num =0;
            data.forEach(v=>{
                v_data.push(v.enterPeople);
                t_data.push(setType(v.timePoint));
                num+=v.enterPeople;
            });
            $scope.totalP =  num;
            let option={
                color:['#229fff'],
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(10, 10, 10, .5)',
                    textStyle: {
                        color: '#fff',
                    },
                    axisPointer: {
                        type: 'cross',
                        lineStyle: {
                            color: 'rgba(10, 10, 10, .6)',
                        },
                        label: {
                            backgroundColor: 'rgba(10, 10, 10, .5)',
                        },
                        crossStyle: {
                            color: 'rgba(10, 10, 10, .6)',
                        }
                    }
                },
                xAxis: {
                    type: 'category',
                    data: t_data,
                },
                yAxis: {
                    name: '单位：人',
                    type: 'value'
                },
                series: [{
                    data: v_data,
                    type: 'line',
                    smooth: true,
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: 'rgba(30,170,255,.5)'},
                                {offset: 1, color: 'rgba(30,170,255,.5)'}
                            ]
                        )
                    },
                }]
            };

            return option;
        }

        });

})();
