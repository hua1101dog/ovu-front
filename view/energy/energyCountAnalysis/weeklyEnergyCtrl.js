(function (angular) {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('weeklyEnergyCtrl', function ($scope, $rootScope, $uibModal, $state, $http, $filter, fac) {
        document.title = '周期能耗分析';

        var baseTime = moment().format('YYYY-MM-DD');
       
        $scope.config = {
            edit: false
        }
        $scope.search = {}

        app.modulePromiss.then(function () {
            $scope.search.baseTime = baseTime;
            $scope.search.pointType = 1;
            $scope.search.cycle = 'day';
            $scope.search.compareType = '1'; //同比1 环比2 自定义3
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId;
                        $scope.search.parkName = $scope.dept.parkName;
                        $scope.findTypes();
                    } else {
                        alert('请选择跟项目关联的部门');
                        $scope.search.parkId &&  delete $scope.search.parkId
                        $scope.search.parkName &&  delete $scope.search.parkName;
                    }

                }
            })
        })
        $scope.widthTotal=$(window).width()-300
        $scope.width=$scope.widthTotal/2
        $scope.findTypes = function () {
            $http.get('/ovu-energy/energy/classify/list').success(function (res) {
                if (res.code == 0) {
                    $scope.classifyList = res.data;
                    $scope.classifyList.forEach(function (v) {
                        if (v.type == $scope.search.pointType) {
                            $scope.search.unitName = v.unitName
                        }
                    })
                    $scope.find();
                } else {
                    alert(res.msg);
                }
            })

        };
        $scope.checkTypes = function (item) {
            $scope.search.pointType = item.type;
            $scope.search.classifyId = item.classifyId;
            $scope.search.unitName = item.unitName
            $scope.find();
            // $scope.toggleYear();
        };
        $scope.find = function () {
            if (($scope.search.compareType==3) && (!$scope.search.compareTime)) {
                alert('请选择对比日期');
                return
            }
           
           if($scope.search.compareType==3){
            if($scope.search.baseTime==$scope.search.compareTime){
                alert('不能选择相同日期');
                return
               }
            if(isSameWeek($scope.search.baseTime,$scope.search.compareTime) && ($scope.search.cycle=='week')){
                alert('不能选择相同周');
                return
               }
           }
            $scope.search.classifyId = $scope.search.classifyId || $scope.classifyList[0].classifyId,
                $http.post("/ovu-energy/energy/energystat/cycleloss/energycyclestat", $scope.search, fac.postConfig).success(function (data) {
                   if(data.code==0){
                    var data = data.data;

                    $scope.baseDate = data.baseDate || ''//基准日期
                    // if($scope.baseDate && $scope.baseDate.value-0>0){
                    //     $scope.baseDateAnalysis= baseDate($scope.baseDate) 
                    //    }else{
                    //     var chart1 = document.getElementById('work-chart1');
                    //     chart1.innerHTML = '<span class="nergyData">暂无统计结果</span>'  
                    //    }

                    $scope.lastYearDate = data.lastYearDate || '' //同比日期
                    // if($scope.lastYearDate && $scope.lastYearDate.value-0>0){
                    //     $scope.lastYearDateAnalysis = lastYearDate($scope.lastYearDate) 
                    //    }else{
                    //     var chart2 = document.getElementById('work-chart2');
                    //     chart2.innerHTML = '<span class="nergyData">暂无统计结果</span>'  
                    //    }
                     $scope.lastMonthDate=data.lastMonthDate || '' //环比日期
                //    if($scope.lastMonthDate && $scope.lastMonthDate.value>0){
                //     $scope.lastMonthDateAnalysis = lastMonthDate($scope.lastMonthDate) 
                //    }else{
                //     var chart = document.getElementById('work-chart');
                //     chart.innerHTML = '<span class="nergyData">暂无统计结果</span>'
                //    }
                
                   $scope.baseAverage=data.baseAverageValue //基准均值
                    $scope.lastYearValue = data.lastYearValue || ''; //同比值
                    $scope.lastMonthValue = data.lastMonthValue || ''; //环比值
                    $scope.abnormalValueList = data.abnormalValueList || []; //异常值列表
                   var comtime='';
                   if($scope.search.compareType==1){
                    comtime= $scope.lastYearDate.time //同比
                   }else if($scope.search.compareType==2){
                    comtime= $scope.lastMonthDate.time //环比
                   }else{
                    comtime= $scope.search.compareTime //对比
                   }
                   var timeList=[$scope.search.baseTime,comtime,'基准均值'];
                     var xList=[];
                     var dataA=[];
                     var dataB=[];
                     var dataC=[];
                    //  var data
                     data.dataAnalysis.dataA && data.dataAnalysis.dataA.forEach(function(v){
                            v.time && xList.push(v.time);
                           dataA.push(v.value)
                     })
                     data.dataAnalysis.dataB && data.dataAnalysis.dataB.forEach(function(v){
                        dataB.push(v.value);
                     dataC.push(data.baseAverageValue);
                        
                    });
                   
                       if(fac.isNotEmpty(data.dataAnalysis.dataA) &&  fac.isNotEmpty(data.dataAnalysis.dataB)){
                        $scope.energyLineTrendData=getenergyLineTrendData(timeList,xList,dataA,dataB,dataC); //数据分析
                     }else{
                        var energyLine = document.getElementById('energyLine');
                        energyLine.innerHTML = '<span class="nergyData">暂无统计结果</span>' 
                     }
                   }
                     
                  
                
                  
                  

                });
        }

        $scope.selectTime = function (time) {
            $scope.search.cycle = time;
            // $scope.search.baseTime=""
            
            
            // $scope.find();
        }
        //判断2个日期是否为同一周
        function isSameWeek(old,now){
               var oneDayTime = 1000*60*60*24;  
                var old_count =parseInt(new Date(old)/oneDayTime);  
               var now_other =parseInt(new Date(now)/oneDayTime);  
               return parseInt((old_count+4)/7) == parseInt((now_other+4)/7);  
             } 
       
        //基准日期进度条
        function baseDate(data){
            var option={},
            option={
              grid: {
                  left: '0',
                  right: '18%',
                  bottom: '0',
                  top: '30%',
                  containLabel: true
              },
              yAxis: {
                  data: [data.value], //基准值
                  axisTick: {
                      show: false
                  },
                  axisLabel: {},
                  axisLine: {
                      show: false
                  },
                  splitLine: {
                      show: false
                  },
                  
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
                  barWidth: 15,
                  itemStyle: {
                      normal: {
                          color: '#ccc',
                          barBorderRadius: 15
                      }
                  },
                  silent: true,
                  barGap: '-100%', // Make series be overlap
                  label: {
                      normal: {
                          show: true,
                          position: ['100%', '0%'],
                          textStyle: {
                              color: 'red',
                              fontWeight: 'bold',
                              fontSize: 15
                          },
                          formatter: function (params) {
                              return (data.percent+'%'); //所占比例
                          }
  
                      }
                  },
                  data: [data.baseValue] //总值
              },
              {
                  type: 'bar',
                  z: 10,
                  barWidth: 15,
                  itemStyle: {
                      normal: {
                          // color: '#E35E5E',
                          // borderColor: '#E25555',
                          borderWidth: 1,
                          borderType: 'solid',
                          barBorderRadius: 15,
                      }
                  },
                  data: [{
                      itemStyle: {
                          normal: {
                              color: '#169BD5',
                              borderWidth: 1,
                              borderType: 'solid',
                              barBorderRadius: 15,
                          }
                      },
                      value: data.value//基准值
                  }]
              }
          ]
            }
            return option
          }
        //同比日期进度条
        function lastYearDate(data){
            var option={},
            option={
              grid: {
                  left: '0',
                  right: '18%',
                  bottom: '0',
                  top: '30%',
                  containLabel: false
              },
              yAxis: {
                  data: [data.value], //同比值
                  axisTick: {
                      show: false
                  },
                  axisLabel: {},
                  axisLine: {
                      show: false
                  },
                  splitLine: {
                      show: false
                  },
                  
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
                  barWidth: 15,
                  itemStyle: {
                      normal: {
                          color: '#ccc',
                          barBorderRadius: 15
                      }
                  },
                  silent: true,
                  barGap: '-100%', // Make series be overlap
                  label: {
                      normal: {
                          show: true,
                          position: ['100%', '0%'],
                          textStyle: {
                              color: 'red',
                              fontWeight: 'bold',
                              fontSize: 15
                          },
                          formatter: function (params) {
                              return data.percent+'%'; //所占比例
                          }
  
                      }
                  },
                  data: [data.baseValue] //总值
              },
              {
                  type: 'bar',
                  z: 10,
                  barWidth: 15,
                  itemStyle: {
                      normal: {
                          // color: '#E35E5E',
                          // borderColor: '#E25555',
                          borderWidth: 1,
                          borderType: 'solid',
                          barBorderRadius: 15,
                      }
                  },
                  data: [{
                      itemStyle: {
                          normal: {
                              color: '#169BD5',
                              borderWidth: 1,
                              borderType: 'solid',
                              barBorderRadius: 15,
                          }
                      },
                      value: data.value//同比值
                  }]
              }
          ]
            }
            return option
          }
        //环比日期进度条
        function lastMonthDate(data){
          var option={},
          option={
            grid: {
                left: '0',
                right: '18%',
                bottom: '0',
                top: '30%',
               
            },
            yAxis: {
                data: [data.value], //环比值
                axisTick: {
                    show: false
                },
                axisLabel: {},
                axisLine: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                
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
                barWidth: 15,
                itemStyle: {
                    normal: {
                        color: '#ccc',
                        barBorderRadius: 15
                    }
                },
                silent: true,
                barGap: '-100%', // Make series be overlap
                label: {
                    normal: {
                        show: true,
                        position: ['100%', '0%'],
                        textStyle: {
                            color: 'red',
                            fontWeight: 'bold',
                            fontSize: 15
                        },
                        formatter: function (params) {
                            return data.percent+'%'; //所占比例
                        }

                    }
                },
                data: [data.baseValue] //总值
            },
            {
                type: 'bar',
                z: 10,
                barWidth: 15,
                itemStyle: {
                    normal: {
                        // color: '#E35E5E',
                        // borderColor: '#E25555',
                        borderWidth: 1,
                        borderType: 'solid',
                        barBorderRadius: 15,
                    }
                },
                data: [{
                    itemStyle: {
                        normal: {
                            color: '#169BD5',
                            borderWidth: 1,
                            borderType: 'solid',
                            barBorderRadius: 15,
                        }
                    },
                    value: data.value//环比值
                }]
            }
        ]
          }
          return option
        }
        
        //基准均值进度条
        function getBaseAverage(data) {
            var option = {};
            option = {
                grid: {

                    left: '0',
                    right: '0',
                    bottom: '0',
                    top: '30%',
                    containLabel: true
                },
                yAxis: {
                    data: [],
                    axisTick: {
                        show: false
                    },
                    axisLabel: {},
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
                        show: true
                    },
                    show: false,
                    axisLine: {
                        show: false
                    }
                },
                series: [{
                    type: 'bar',
                    barWidth: 20,
                    itemStyle: {
                        normal: {
                            color: '#169BD5',
                            barBorderRadius: 20
                        }
                    },
                    silent: true,

                    label: {
                        normal: {
                            show: true,
                            position: ['50%', '10%'],
                            textStyle: {
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: 15
                            },



                        }
                    },
                    data: [data]
                }, ]
            };
            return option
        }
        //数据分析
       function getenergyLineTrendData(data1,data2,data3,data4,data5) {
           var obj={};
           obj={
           
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                data: data1
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                splitLine: {
                           show: false
                       },
               
                data:data2,
                //设置字体竖直
                axisLabel: {
                    interval: 0,
                    rotate: -60,
                   
                }
            },

            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            yAxis: {
                type: 'value'
               
            },
            series: [{
                    name: data1[0],
                    type: 'line',
                    data:data3,
                    markLine: {
                        symbol: "none",

                    }
                },
                {
                    name: data1[1],
                    type: 'line',
                    data: data4,
                    markLine: {
                        symbol: "none",
                     
                    }
                },
                {
                    name: data1[2], 
                    type: 'line',
                    data: data5, 
                    markLine: {
                        symbol: "none",
                       
                    }
                }

            ]
        };
        return obj
           }
           
    });
})(angular)
