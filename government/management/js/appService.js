'use strict';

angular.module('app')
    .service('AppService', function($http) {
        var that = this;
        //获取维保单位列表
        this.getMaintenanceunitList = function () {
            return $http.get('/ovu-pcos/pcos/maintenanceunit/mtu/all.do')
                .then(function (resp) {
                       return resp.data;
                })

        }

        //公共饼图
        this.commonPileOption = function() {
            return angular.merge({}, {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                grid: {
                    left: 'center'
                },
                legend: {
                    orient: 'vertical',
                    left: 'right',
                    top: 'middle',
                    data: []
                },
                color: ["#85B9F5", "#FA727E", "#3AD35E"],
                series: [{
                    name: '详情',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    center: ['35%', '50%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '15',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: []
                }]
            });
        };
        //工单完成率统计。用于进度条类似
        this.getPorgressOption = function(data,tip){
            var optionData=[];
            var yaxisData=[];
            var otherData=[];
            data && data.reverse() &&  data.forEach(function(v,i){
                if(v.finishedRate){
                    v.value=v.finishedRate.replace(/%/, "");
                }
                if(v.average){
                    v.value=v.average;
                }
                var obj={
                    value: v.value,
                    itemStyle: {
                        normal: {
                            color: (i % 2 === 0 ? '#E35E5E' : '#669FD8'),
                            borderColor: (i % 2 === 0 ? '#E25555' : '#5594D4'),
                        }
                    }
                };
                optionData.push(obj);
                yaxisData.push(v.personName || v.company);
                otherData.push(100);
            })
            return angular.merge({}, {
                title:{
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function(obj){
                        if(obj[1]){
                            return obj[1].name + ':' + tip + '(' + obj[1].value + (tip == "完成率"?'%':'') + ')';
                        }
                        return '无';
                    },
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '15%',
                    bottom: '3%',
                    top:'15%',
                    containLabel: true
                },
                yAxis: {
                    data: yaxisData,
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                    },
                    axisLine: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    }
                },
                xAxis: {
                    splitLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    show: false,
                    axisLine: {
                        show: false
                    }
                },
                series: [{
                    type: 'bar',
                    barWidth: 12,
                    itemStyle: {
                        normal: {
                            color: '#ddd',
                            barBorderRadius: 15
                        }
                    },
                    silent: true,
                    barGap: '-100%', // Make series be overlap
                    label: {
                        normal: {
                            show: true,
                            position: ['100%', '-50%'],

                            textStyle: {
                                color: '#353535',
                                fontWeight: 'bold',
                                fontSize: 20
                            },
                            formatter: function(params) {
                                if(tip == "完成率"){
                                    return data[params.dataIndex].value + '%';
                                }
                                return data[params.dataIndex].value;
                            }
                        }
                    },
                    data: otherData
                },
                    {
                        type: 'bar',
                        z: 10,
                        barWidth: 12,
                        itemStyle: {
                            normal: {
                                // color: '#E35E5E',
                                // borderColor: '#E25555',
                                borderWidth: 1,
                                borderType: 'solid',
                                barBorderRadius: 15,
                            }
                        },
                        data: optionData
                    }]
            });
        }

        //视频
        this.video = {};
        this.showVideo = function(id) {
            this.video.on = true;
            this.video.id = id;
        };


        // 设置地图范显示围  根据所有的点 求出需要显示的范围  如果list为空 显示武汉市
        this.setMapBounds = function(list,map) {
            if (!list || !list.length) {
                map.setCity('武汉市');
            } else {
                var bounds = getBoundsByListData(list);
                map.setBounds(bounds);
            }
        }
        // 根据list [{longitude:00.000000,latitude:00.000000,...},...] 数据获取地图显示范围
        function getBoundsByListData(list) {
            var lngArr = [],
                latArr = [];

            list.forEach(function(v, i) {
                if (v.longitude && v.latitude) {
                    lngArr.push(parseFloat(v.longitude));
                    latArr.push(parseFloat(v.latitude));
                }
            });

            var minLng = Math.min.apply(null, lngArr),
                maxLng = Math.max.apply(null, lngArr);

            var minLat = Math.min.apply(null, latArr),
                maxLat = Math.max.apply(null, latArr);

            var deltaLng = maxLng - minLng,
                deltaLat = maxLat - minLat;

            minLng -= 0.05 * deltaLng;
            minLat -= 0.05 * deltaLat;
            maxLng += 0.05 * deltaLng;
            maxLat += 0.05 * deltaLat;

            var southWest = new AMap.LngLat(minLng.toFixed(6), minLat.toFixed(6)),
                northEast = new AMap.LngLat(maxLng.toFixed(6), maxLat.toFixed(6));

            return new AMap.Bounds(southWest, northEast);

        }

    });