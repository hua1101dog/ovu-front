(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('multipleProStatctrl', function($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-报表统计";
        var map;
        fac.setDeptDict($rootScope);
        fac.setPostDict($rootScope);
        $scope.search = {startDate:$filter('date')(new Date(), "yyyy-MM")};

        // 导航切换
        $scope.index = 2;
        //asset();
        work();
        $scope.tabChange = function (index) {
            $scope.index = index;
            if/*($scope.index == 1) {
					asset();
				}
				else if*/($scope.index == 2) {
                    work();
                
            }else if($scope.index == 3) {
                person();
            }else if($scope.index == 4) {
                equip();
            }
        };
        // 人员分析统计
        $scope.stat = function () {
            var param = {startTime:$scope.startTime,endTime:$scope.endTime};
            personStat(param);
        };
        // 工作分析统计
        $scope.workStat = function () {
            var param = {startTime:$scope.startTime,endTime:$scope.endTime};
            workStat(param);
        };
        // 设备分析统计
        $scope.equipStat = function () {
            var param = {startTime:$scope.startTime,endTime:$scope.endTime};
        };
        function asset() {
            $http.post("/ovu-pcos/pcos/reportstat/statTbAssetGroup.do",fac.postConfig).success(function(resp){
                $scope.data = resp;
                // 收入执行率
                // 本月
                $scope.incomecm = $scope.data.INRate_CM;
                $scope.incomeCopyCm = angular.copy($scope.incomecm);
                $scope.incomecm.splice(1,1);
                $scope.inrate = 'cm';
                // 初始化
                $scope.income = $scope.incomecm;
                $scope.incomeCopy = $scope.incomeCopyCm;
                initIncome($scope.income)

                $scope.inratecm = function () {
                    $scope.inrate = 'cm';
                    $scope.income = $scope.incomecm;
                    $scope.incomeCopy = $scope.incomeCopyCm;
                    initIncome($scope.income)
                };

                $scope.incomecs = $scope.data.INRate_CS;
                $scope.incomeCopyCs = angular.copy($scope.incomecs);
                $scope.incomecs.splice(1,1);
                // 本季
                $scope.inratecs = function () {
                    $scope.inrate = 'cs';
                    $scope.income = $scope.incomecs;
                    $scope.incomeCopy = $scope.incomeCopyCs;
                    initIncome($scope.income)
                };

                $scope.incomecy = $scope.data.INRate_CY;
                $scope.incomeCopyCy = angular.copy($scope.incomecy);
                $scope.incomecy.splice(1,1);

                // 本年
                $scope.inratecy = function () {
                    $scope.inrate = 'cy';
                    $scope.income = $scope.incomecy;
                    $scope.incomeCopy = $scope.incomeCopyCy;
                    initIncome($scope.income)
                };

                // 支出执行率
                // 本月
                $scope.outcm = $scope.data.OUTRate_CM;
                $scope.outCopyCm = angular.copy($scope.outcm);
                $scope.outcm.splice(1,1);
                $scope.outrate = 'cm';
                // 初始化
                $scope.out = $scope.outcm;
                $scope.outCopy = $scope.outCopyCm;
                initOut($scope.out);

                $scope.outratecm = function () {
                    $scope.outrate = 'cm';
                    $scope.out = $scope.outcm;
                    $scope.outCopy = $scope.outCopyCm;
                    initOut($scope.out);
                };

                $scope.outcs = $scope.data.OUTRate_CS;
                $scope.outCopyCs = angular.copy($scope.outcs);
                $scope.outcs.splice(1,1);
                // 本季
                $scope.outratecs = function () {
                    $scope.outrate = 'cs';
                    $scope.out = $scope.outcs;
                    $scope.outCopy = $scope.incomeCopyCs;
                    initOut($scope.out);
                };

                $scope.outcy = $scope.data.OUTRate_CY;
                $scope.outCopyCy = angular.copy($scope.outcy);
                $scope.outcy.splice(1,1);

                // 本年
                $scope.outratecy = function () {
                    $scope.outrate = 'cy';
                    $scope.out = $scope.outcy;
                    $scope.outCopy = $scope.outCopyCy;
                    initOut($scope.out);
                };

                // 物业收缴率
                // 本月
                $scope.propertycm = $scope.data.SERVICERate_CM;
                $scope.propertyCopyCm = angular.copy($scope.propertycm);
                $scope.propertycm.splice(1,1);
                $scope.srate = 'cm';
                // 初始化
                $scope.property = $scope.propertycm;
                $scope.propertyCopy = $scope.propertyCopyCm;
                initProperty($scope.property);
                $scope.sratecm = function () {
                    $scope.srate = 'cm';
                    $scope.property = $scope.propertycm;
                    $scope.propertyCopy = $scope.propertyCopyCm;
                    initProperty($scope.property);
                };

                $scope.propertycs = $scope.data.SERVICERate_CS;
                $scope.propertyCopyCs = angular.copy($scope.propertycs);
                $scope.propertycs.splice(1,1);
                // 本季
                $scope.sratecs = function () {
                    $scope.srate = 'cs';
                    $scope.property = $scope.propertycs;
                    $scope.propertyCopy = $scope.propertyCopyCs;
                    initProperty($scope.property);
                };

                $scope.propertycy = $scope.data.SERVICERate_CY;
                $scope.propertyCopyCy = angular.copy($scope.propertycy);
                $scope.propertycy.splice(1,1);

                // 本年
                $scope.sratecy = function () {
                    $scope.srate = 'cy';
                    $scope.property = $scope.propertycy;
                    $scope.propertyCopy = $scope.propertyCopyCy;
                    initProperty($scope.property);
                };
                // 收入数据
                $scope.FEE_TYPE = $scope.data.FEE_TYPE;
                $scope.IN_FEE_STAT =$scope.data.IN_FEE_STAT
                initIncomes ($scope.FEE_TYPE,$scope.IN_FEE_STAT);

                // 支出数据
                $scope.OUT_FEE_STAT = $scope.data.OUT_FEE_STAT;
                initOuts ($scope.FEE_TYPE,$scope.OUT_FEE_STAT);
                // 经营型资产盈利状况
                // 本月
                $scope.profitcm = $scope.data.PROFIT_INFO_MONTH;
                $scope.profitcm =$scope.profitcm.map(function(n) {
                    n.name = n.name +' : '+n.value + '万元';
                    return n;
                });
                $scope.ENTITY_TYPE = $scope.profitcm.map(function(n) {
                    return n.name;
                });
                $scope.profitinfo = 'cm';
                // 初始化
                $scope.profit = $scope.profitcm;
                initProfit($scope.ENTITY_TYPE,$scope.profit);

                $scope.profitinfocm = function () {
                    $scope.profitinfo = 'cm';
                    $scope.profit = $scope.profitcm;
                    $scope.ENTITY_TYPE = $scope.profitcm.map(function(n) {
                        return n.name;
                    });
                    initProfit($scope.ENTITY_TYPE,$scope.profit);
                }

                $scope.profitcs = $scope.data.PROFIT_INFO_SEASON;
                $scope.profitcs =$scope.profitcs.map(function(n) {
                    n.name = n.name +' : '+n.value + '万元';
                    return n;
                });
                // 本季
                $scope.profitinfocs = function () {
                    $scope.profitinfo = 'cs';
                    $scope.profit = $scope.profitcs;
                    $scope.ENTITY_TYPE = $scope.profitcs.map(function(n) {
                        return n.name;
                    });
                    initProfit($scope.ENTITY_TYPE,$scope.profit);
                }

                $scope.profitcy = $scope.data.PROFIT_INFO_YEAR;
                $scope.profitcy =$scope.profitcy.map(function(n) {
                    n.name = n.name +' : '+n.value + '万元';
                    return n;
                });

                // 本年
                $scope.profitinfocy = function () {
                    $scope.profitinfo = 'cy';
                    $scope.profit = $scope.profitcy;
                    $scope.ENTITY_TYPE = $scope.profitcy.map(function(n) {
                        return n.name;
                    });
                    initProfit($scope.ENTITY_TYPE,$scope.profit);
                }
                // 总计
                $scope.ENTITY_AMOUNT = $scope.data.ENTITY_AMOUNT;
                //占用
                $scope.ENTITY_AMOUNT_USAGE = $scope.data.ENTITY_AMOUNT_USAGE;
                //空闲
                $scope.ENTITY_AMOUNT_FREE = $scope.data.ENTITY_AMOUNT_FREE;

                // 各项支出情况统计数据
                $scope.ENTITY_USAGE_STAT = $scope.data.ENTITY_USAGE_STAT; //占用
                $scope.ENTITY_FREE_STAT = $scope.data.ENTITY_FREE_STAT; //空闲
                initOutss($scope.data.ENTITY_TYPE, $scope.ENTITY_USAGE_STAT, $scope.ENTITY_FREE_STAT);

                // 执行率趋势图数据
                $scope.IN_EXEC_RATE = $scope.data.IN_EXEC_RATE;
                $scope.OUT_EXEC_RATE = $scope.data.OUT_EXEC_RATE;
                initImplement ($scope.IN_EXEC_RATE,$scope.OUT_EXEC_RATE);
                // 催缴情况趋势图
                $scope.PAY_HOUSE_INFO = $scope.data.PAY_HOUSE_INFO;
                $scope.PAY_PERSON_INFO = $scope.data.PAY_PERSON_INFO;
                $scope.FEE_TYPE = $scope.data.FEE_TYPE;
                initCall($scope.PAY_HOUSE_INFO,$scope.PAY_PERSON_INFO);
            });
        }

        //人员分析
        function person() {
            $http.post("/ovu-pcos/pcos/reportstat/statTbPersonGroup.do",fac.postConfig).success(function(resp){
                $scope.personData = resp.PART_STAT;
                if($scope.personData  && $scope.personData [0]){
                    //默认展示第一个项目
                    $scope.personDetail = $scope.personData [0];
                    //默认展示第一个项目的部门
                    findDep($scope.personData [0].PARK_ID);
                }
                //初始化地图
                initPersonMap($scope.personData);
            });
            //人员分析 统计
            personStat();
            //人员分析地图对应项目
        }
        //点击地图标记点，在查询对应部门以及图表
        function findDep(parkId) {
            return $http.get("/ovu-pcos/pcos/reportstat/projectPersonDetail.do?parkId="+parkId).success(function(data){
                //对应部门
                $scope.personDep = data.PARK_PERSON_STAT_BY_DEPT;
                $scope.total=data.PARK_PERSON_AMOUNT //图表数据
                data.PARK_GOOD_BAD_STAT && initProperson(data.PARK_GOOD_BAD_STAT,$scope.total);
                return data;
            });
        }
        function personStat(param){
            $http.post("/ovu-pcos/pcos/reportstat/statTbPersonByConditionGroup.do",param,fac.postConfig).success(function(resp){
                $scope.personStatData = resp;
                //员工签到异常统计数据
                $scope.personSign = $scope.personStatData.PERSON_SIGN_EXCEPTION_STAT;
                if(!$scope.personSign[2]){
                    $scope.personSignCount=0;
                }else{
                    $scope.personSignCount = $scope.personSign[2].VALUE;
                }
                $scope.personSign.pop();
                $scope.personSign = $scope.personSign.map(function(n){
                    n.value=n.VALUE
                    n.name = n.NAME + ' ' + n.value + ' ' +'人';
                    return n;
                });
                $scope.personSignLend =  $scope.personSign.map(function(n) {
                    return n.name;
                });
                initAbnormal ($scope.personSignCount,$scope.personSignLend,$scope.personSign);
                //员工异动统计数据
                $scope.personTransct =  $scope.personStatData.PERSON_TRANSACTION_STAT.map(function(n){
                    n.value=n.VALUE
                    n.name = n.NAME + ' ' + n.value + ' ' +'人';
                    return n;
                });

                $scope.personTransctLend = $scope.personTransct.map(function(n) {
                    return n.name;
                });
                initTransact ($scope.personTransctLend,$scope.personTransct);
                //员工离职
                $scope.personDimiss = resp.PERSON_DIMISSION_STAT.map(function(n){
                    n.value=n.VALUE
                    n.name = n.NAME + ' ' + n.value + ' ' +'人';
                    return n;
                });
                $scope.dismissLend = $scope.personDimiss.map(function(n) {
                    return n.name;
                });
                initQuit($scope.dismissLend,$scope.personDimiss);

                $scope.projectReport = $scope.personStatData.PERSON_REPORT_STAT; //报事数量TOP10
                $scope.projectOnduty = $scope.personStatData.PROJECT_ONDUTY_STAT;   //出勤率统计TOP10
                $scope.projectAccept = $scope.personStatData.PERSON_ACCEPT_ORDER_STAT; //接单数量Top10

            })
        }
        // 工作分析
        function work() {
            $http.post("/ovu-pcos/pcos/reportstat/statTbWorkGroup.do",fac.postConfig).success(function(resp){
                if(angular.isArray(resp)){
                    $scope.work = resp[0];
                }else{
                    $scope.work = resp;
                }
                
                // $scope.personData = resp.PART_STAT;
                // if($scope.personData  && $scope.personData [0]){
                //     //默认展示第一个项目
                //     $scope.prodetail  = $scope.personData [0];
                //     //默认展示第一个项目的部门
                //     findWorkDept($scope.personData [0].PARK_ID);
                // }
                // //初始化地图
                // initWorkMap($scope.personData);
               
            });
            $http.post("/ovu-pcos/pcos/reportstat/statTbPersonGroup.do",fac.postConfig).success(function(resp){
                $scope.personData = resp.PART_STAT;
                if($scope.personData  && $scope.personData [0]){
                    //默认展示第一个项目
                    $scope.prodetail  = $scope.personData [0];
                    //默认展示第一个项目的部门
                    findWorkDept($scope.personData [0].PARK_ID);
                }
                //初始化地图
                initWorkMap($scope.personData);
            });
            workStat();
        }
        //点击地图标记点，在查询对应部门以及图表
        function findWorkDept(parkId) {
            return $http.get("/ovu-pcos/pcos/reportstat/projectPersonDetail.do?parkId="+parkId).success(function(data){
                //对应部门
                $scope.workDep = data.PARK_PERSON_STAT_BY_DEPT;
                $scope.total=data.PARK_PERSON_AMOUNT;
                //图表数据
                data.PARK_GOOD_BAD_STAT && initProOrder(data.PARK_GOOD_BAD_STAT,$scope.total);
                return data;
               
            });
        }
        //工作搜索
        function workStat(param){
            $http.post("/ovu-pcos/pcos/reportstat/statTbWorkByConditionGroup.do",param,fac.postConfig).success(function(resp){
                $scope.parkFinishRate = resp.PARK_ORDER_FINISH_RATE_STAT;
                // 工单数量top10
                $scope.personFinishRate = resp.PARK_ORDER_FINISH_DESC_STAT;
                $scope.isPersonBest = 'pb';
                $scope.PersonBest = function(){
                    $scope.personFinishRate = resp.PARK_ORDER_FINISH_DESC_STAT;
                    $scope.isPersonBest = 'pb';
                };
                $scope.PersonWorst = function(){
                    $scope.personFinishRate = resp.PARK_ORDER_FINISH_ASC_STAT;
                    $scope.isPersonBest = 'pw';
                };

                // 工单状态统计
              
                $scope.workOrderTypeStat = resp.ORDER_STATUS_STAT.map(function(n){
                    n.value=n.VALUE
                    n.name = n.NAME + ' ' + n.value + ' ' +'条';
                    return n;
                });
                $scope.workOrderLend = $scope.workOrderTypeStat.map(function(n){
                    return n.name;
                });
                $scope.workOrderTotal = 0;
                $scope.workOrderTypeStat.forEach(function (data) {
                    $scope.workOrderTotal += Number(data.value);
                })
                initWorktype($scope.workOrderTotal,$scope.workOrderLend,$scope.workOrderTypeStat);
                //各项目工单统计
                // $scope.workPlan = resp.PARK_JH_COUNT_LIST;
                // $scope.workUrgent = resp.PARK_YJ_COUNT_LIST;
                // $scope.wroklist =  resp.PARK_LIST;
                // initDpworkuit($scope.workOrderType,$scope.wroklist,$scope.workPlan,$scope.workUrgent);
                $scope.workYj = resp.PARK_ORDER_STAT.map(function(n){
                    
                     return n.YJ_COUNT    //应急
                     
                 });
                 $scope.workJh = resp.PARK_ORDER_STAT.map(function(n){
                      
                     return n.JH_COUNT  //计划
                 });
                 $scope.ParkName = resp.PARK_ORDER_STAT.map(function(n){
                
                     return n.PARK_NAME    //项目名称
                 });
             
                initDpworkuit($scope.ParkName,$scope.workJh, $scope.workYj);
                //工单分类统计
                $scope.workCategory = resp.ORDER_CATEGORY_STAT.map(function(n){
                    n.value=n.VALUE
                    n.name = n.NAME + ' ' + n.value + ' ' +'条';
                    return n;
                });
                $scope.workCategoryLend = $scope.workCategory.map(function(n) {
                    return n.name;
                });
                initWorkunits($scope.workCategoryLend,$scope.workCategory);
                //工单完成率
                $scope.workOrderFinish = resp.ORDER_FINISH_RATE.map(function(n){
                    n.value=n.VALUE;
                    n.name = n.NAME + ' ' + n.value + '条';
                    return n;
                });
                $scope.workOrderFinishLend = $scope.workOrderFinish.map(function(n) {
                    return n.name;
                });
                finishrate($scope.workOrderFinishLend,$scope.workOrderFinish);
                //工单好评率
                $scope.workEva = resp.ORDER_EVALUATE_RATE.map(function(n){
                    n.value=n.VALUE
                    n.name = n.NAME + ' ' + n.value + '条';
                    return n;
                });
                $scope.evaLend = $scope.workEva.map(function(n) {
                    return n.name;
                });
                initPraise($scope.evaLend,$scope.workEva);
                // $scope.find();
            });
             //400投诉统计列表

            //分页
        //     $scope.search = {};
        //     $scope.pageModel = {};
        //   $scope.find = function (pageNo) {
        //     angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
        //     fac.getPageResult('/ovu-pcos/pcos/reportstat/multiple/statComplainWorkUnit.do', $scope.search, function (res) {
        //         $scope.pageModel = res;
        //     })
        //   }
        }
        //设备分析
        function equip() {
            $http.post("/ovu-pcos/pcos/reportstat/statTbDeviceGroup.do",fac.postConfig).success(function(resp){
                $scope.equipData = resp;

                //设备运行状态统计数据
                $scope.euipRunStat = $scope.equipData.DEVICE_RUNSTATUS_STAT.map(function(n){

                       n.value=n.VALUE;
                    n.name  = n.NAME + ' ' + n.value + '台';
                    return n;
                });

                $scope.equipLend = $scope.euipRunStat.map(function(n) {
                    return n.name;
                });
                initEquip($scope.equipLend,$scope.euipRunStat);
                //各类故障系统
                $scope.equipTypeE = $scope.equipData.DEVICE_ERROR_STAT.map(function(n){
                    return n.VALUE;
                 });
                 $scope.equipCount = $scope.equipData.DEVICE_ERROR_STAT.map(function(n){
                     n.name=n.NAME
                     return n.name;
                  });
                initFault($scope.equipCount,$scope.equipTypeE);
                //工单统计数据
                $scope.equipOrder = $scope.equipData.DEVICE_ORDER_STAT.map(function(n){
                    n.value=n.VALUE;
                    n.name  = n.NAME + ' ' + n.value + '条';
                    return n;
                });
                $scope.equipOrderType = $scope.equipOrder.map(function(n) {
                    return n.name
                });
                initWorkorder($scope.equipOrderType,$scope.equipOrder);
                $scope.equipType = $scope.equipData.DEVICE_GOOD_STAT_RATE.map(function(n){
                    return n.EQUIPMENT_TYPE;
                });
                $scope.equipGood = $scope.equipData.DEVICE_GOOD_STAT_RATE.map(function(n){
                    return n.GOOD_COUNT;
                });
                $scope.equipBad = $scope.equipData.DEVICE_GOOD_STAT_RATE.map(function(n){
                    return n.BAD_COUNT;
                });
                iniIntactt($scope.equipType,$scope.equipGood,$scope.equipBad);
            });
        }

        // 收入执行率
        function initIncome(data1) {
            var myChartIncome = echarts.init(document.getElementById('income'));
            incomeOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}: {c}元({d}%)"
                },
                series: [{
                    name: '收入',
                    type: 'pie',
                    radius: ['50%', '80%'],
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
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: data1
                }]
            };// 为echarts对象加载数据
            myChartIncome.setOption(incomeOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartIncome.resize();
            });
        }

        // 支出执行率
        function initOut(data) {
            var myChartOut = echarts.init(document.getElementById('out'));
            outOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}: {c}元({d}%)"
                },
                series: [{
                    name: '支出',
                    type: 'pie',
                    radius: ['50%', '80%'],
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
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    color:['green','#2f4554'],
                    data: data
                }]
            };// 为echarts对象加载数据
            myChartOut.setOption(outOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartOut.resize();

            });
        }

        // 物业费收缴率
        function initProperty(data) {
            var myChartProperty = echarts.init(document.getElementById('property'));
            propertyOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}: {c}元({d}%)"
                },
                series: [{
                    name: '收缴',
                    type: 'pie',
                    radius: ['50%', '80%'],
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
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:data
                }]
            };// 为echarts对象加载数据
            myChartProperty.setOption(propertyOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartProperty.resize();

            });
        }

        //各项收入统计方法
        function initIncomes (data1,data2){
            var myChartIncomes = echarts.init(document.getElementById('income_situation'));
            incomesOption = {
                color: ['#c23531'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: "{b}: {c}万元"

                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    data: data1,
                    axisTick: {
                        alignWithLabel: true
                    }
                }],
                yAxis: [{
                    type: 'value',
                    name:'万元'
                }],
                series: [{
                    name: '直接访问',
                    type: 'bar',

                    data: data2
                }]
            };
            myChartIncomes.setOption(incomesOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartIncomes.resize();

            });
        }


        // 各项支出情况统计方法
        function initOuts (data1,data2) {
            var myChartOuts = echarts.init(document.getElementById('out_situation'));
            outsOption = {
                color: ['green'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: "{b}: {c}万元 "
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    data: data1,
                    axisTick: {
                        alignWithLabel: true
                    }
                }],
                yAxis: [{
                    type: 'value',
                    name:'万元'
                }],
                series: [{
                    name: '直接访问',
                    type: 'bar',

                    data: data2
                }]
            };
            myChartOuts.setOption(outsOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartOuts.resize();

            });
        }



        // 经营型资产盈利状况
        function initProfit(data1,data2) {
            var myChartProfit = echarts.init(document.getElementById('profit'));
            profitOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    top:'middle',
                    left:'60%',
                    data: data1
                },
                series: [{
                    name: '访问来源',
                    type: 'pie',
                    radius: ['50%', '80%'],
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
                    center:['25%','50%'],
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: data2
                }]
            };
            myChartProfit.setOption(profitOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartProfit.resize();

            });
        }

        //场地各项支出情况统计方法
        function initOutss (data1,data2,data3) {
            var myChartOutss = echarts.init(document.getElementById('out_status'));

            outssOption = {
                legend: {
                    data: ['空闲', '占用'],
                    align: 'left',
                    left: '30%'
                },
                tooltip: {},
                xAxis: {
                    data: data1,
                    silent: false,
                    axisLine: {onZero: true},
                    splitLine: {show: false},
                    splitArea: {show: false}
                },
                yAxis: {
                    splitArea: {show: false},
                    name:'位'
                },
                grid: {
                    left:'10%',
                    bottom: '10%'
                },
                series: [
                    {
                        name: '占用',
                        type: 'bar',
                        stack: 'two',
                        data: data2
                    },
                    {
                        name: '空闲',
                        type: 'bar',
                        stack: 'two',
                        data: data3
                    }
                ]
            };
            myChartOutss.setOption(outssOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartOutss.resize();

            });
        }

        //执行率年度趋势图方法
        function initImplement (data1,data2) {
            var myChartImplement = echarts.init(document.getElementById('implement'));
            implementOption = {
                tooltip: {
                    trigger: 'axis',
                    formatter: "{b}:{c}%"
                },
                legend: {
                    data: ['收入执行率', '支出执行率']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月','8月', '9月', '10月', '11月', '12月']
                },
                yAxis: {
                    type: 'value',
                    axisLabel : {
                        formatter : '{value}%'
                    },
                    min:0,
                    max:100
                },
                series: [{
                    name: '收入执行率',
                    type: 'line',
                    stack: '总量1',
                    data: data1
                },
                    {
                        name: '支出执行率',
                        type: 'line',
                        stack: '总量2',
                        data: data2
                    }
                ]
            };
            myChartImplement.setOption(implementOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartImplement.resize();

            });
        }


        //催缴情况趋势图
        function initCall(data1,data2) {
            var myChartCall = echarts.init(document.getElementById('call'));
            callOption = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['催缴营业房欠费', '催缴个人欠费']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月','8月', '9月', '10月', '11月', '12月']
                },
                yAxis: {
                    type: 'value',
                    name:'户'
                },
                series: [{
                    name: '催缴营业房欠费',
                    type: 'line',
                    stack: '总量1',
                    data: data1
                },
                    {
                        name: '催缴个人欠费',
                        type: 'line',
                        stack: '总量2',
                        data: data2
                    }
                ]
            };
            myChartCall.setOption(callOption);

        }





        // 人员结构统计图
        function initPframe (data1,data2,data3,data4) {
            var myChartPframe = echarts.init(document.getElementById('p_frame'));
            pframeOption = {
                tooltip: {
                    trigger: 'axis',
                    formatter: "{b}:{c}人"
                },
                legend: {
                    data: data1
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月','8月', '9月', '10月', '11月', '12月']
                },
                yAxis: {
                    type: 'value',
                    name:'人'

                },
                series: [{
                    name: '2年内退休人群',
                    type: 'line',
                    stack: '总量1',
                    data: data2
                },
                    {
                        name: '在职3年以上人群',
                        type: 'line',
                        stack: '总量2',
                        data: data3
                    },
                    {
                        name: '本科以上学历人群',
                        type: 'line',
                        stack: '总量3',
                        data: data4
                    },
                ]
            };
            myChartPframe.setOption(pframeOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartPframe.resize();

            });
        }



        // 人员分析地图
        function initPersonMap(data){
            var map = new AMap.Map('container1',{
                zoom:10
            });
            AMap.plugin(['AMap.ToolBar','AMap.Scale'],
                function(){
                    map.addControl(new AMap.ToolBar());

                    map.addControl(new AMap.Scale());
                });
            var infoWindow = new AMap.InfoWindow();
            for(var i = 0, marker; i < data.length; i++){
                var arr = [];
                if( data[i] && data[i].TR_POSITION){
                    arr.push(data[i].TR_POSITION.split(',')[0]);
                    arr.push(data[i].TR_POSITION.split(',')[1]);
                    marker=new AMap.Marker({
                        position:arr,
                        map:map,
                        extData:data[i]
                    });
                    //给Marker绑定单击事件
                    marker.on('mouseover', markerClick);
                }
            }
            map.setFitView();
            function markerClick(e){
                $scope.personDetail = e.target.getExtData();
                //查询部门
                findDep($scope.personDetail.PARK_ID).then(function (resp) {
                    var data = resp.data;
                    var content ='项目名称:'+$scope.personDetail.PARK_NAME + '<br/>'
                        + '项目主任:' +  ($scope.personDetail.DIRECTOR || '')  + '<br/>'
                        + '人员配置:'+ (data.PARK_PERSON_AMOUNT ? data.PARK_PERSON_AMOUNT+'人':'无');
                    infoWindow.setContent(content);
                    infoWindow.open(map, e.target.getPosition());
                });
                //$scope.$apply();
            }
        }


        //项目工单
        function initProperson(param,total) {
            var data = angular.copy(param);
            
            var arr = [];
            total=total || 0
            data[0] &&  arr.push(data[0]);
            data[1] &&  arr.push(data[1]);
            
            var data1 = arr.map(function(n){
              
                n.value=n.VALUE
                n.name = n.NAME + n.value + '人';
                return n;
            });
            var data2 = data1.map(function(n){
                return n.name;
            });
            

            var myChartProperson= echarts.init(document.getElementById('properson'));
            var propersonOption = {
                title : {
                    text: '总计 ：' + total + '人',
                    y:'80%',
                    x:'40%',
                    textStyle:{
                        fontWeight:'normal',
                        fontSize:'14'
                    }
                },

                tooltip: {
                    trigger: 'item',
                    formatter: "{b}({d}%)"
                },
                legend: {
                    orient: 'horizontal',
                    top:'70%',
                    data: data2,
                },
                series: [{
                    name: '访问来源',
                    type: 'pie',
                    radius: ['35%', '50%'],
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
                    center:['50%','30%'],
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: data1
                }]
            };
            myChartProperson.setOption(propersonOption);
            window.addEventListener('resize', function () {
                myChartProperson.resize();

            });
        }


        //人员异常统计方法
        function initAbnormal (data1,data2,data3) {
            var myChartAbnormal= echarts.init(document.getElementById('abnormal'));
            var abnormalOption = {
                title : {
                    text: '总计 ： '+ data1 + '人',
                    y:'70%',
                    x:'60%',
                    textStyle:{
                        fontWeight:'normal',
                        fontSize:'14'
                    }
                },

                tooltip: {
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    top:'middle',
                    left:'60%',
                    data: data2
                },
                series: [{
                    name: '访问来源',
                    type: 'pie',
                    radius: '70%',
                    center: ['40%', '50%'],
                    data:data3,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            };
            myChartAbnormal.setOption(abnormalOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartAbnormal.resize();

            });
        }

        // 员工异动统计
        function initTransact (data1,data2) {
            var myChartTransaction= echarts.init(document.getElementById('transaction'));
            var transactionOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    top:'middle',
                    left:'60%',
                    data: data1
                },
                series: [{
                    name: '访问来源',
                    type: 'pie',
                    radius: ['40%', '75%'],
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
                    center:['30%','50%'],
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: data2
                }]
            };
            myChartTransaction.setOption(transactionOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartTransaction.resize();

            });
        }

        //员工离职率
        function initQuit(data1,data2) {
            var myChartQuit = echarts.init(document.getElementById('quit'));
            var quitOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    top:'middle',
                    left:'60%',
                    data: data1
                },
                series: [{
                    name: '离职',
                    type: 'pie',
                    radius: ['40%', '75%'],
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
                    center:['30%','50%'],
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: data2
                }]
            };// 为echarts对象加载数据
            myChartQuit.setOption(quitOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartQuit.resize();

            });
        }


        //转化率统计
        function initConversion(data){
            var myChartConversion= echarts.init(document.getElementById('conversion'));
            conversionOption = {

                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c}%"
                },

                calculable: true,
                series: [
                    {
                        name:'漏斗图',
                        type:'funnel',
                        left: '10%',
                        top: 10,
                        //x2: 80,
                        bottom: 10,
                        width: '80%',
                        // height: {totalHeight} - y - y2,
                        min: 0,
                        max: 100,
                        minSize: '0%',
                        maxSize: '100%',
                        sort: 'descending',
                        gap: 2,
                        label: {
                            normal: {
                                show: true,
                                position: 'inside'
                            },
                            emphasis: {
                                textStyle: {
                                    fontSize: 20
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                length: 10,
                                lineStyle: {
                                    width: 1,
                                    type: 'solid'
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                borderColor: '#fff',
                                borderWidth: 1
                            }
                        },
                        data: data
                    }
                ]
            };

            myChartConversion.setOption(conversionOption);
            window.addEventListener('resize', function () {
                myChartConversion.resize();

            });
        }


        // 项目拓展状况统计
        function initExpand(data1,data2){
            var myChartExpand = echarts.init(document.getElementById('expand'));
            expandOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    top:'middle',
                    left:'50%',
                    data: data1
                },
                series: [{
                    name: '访问来源',
                    type: 'pie',
                    radius: ['35%', '55%'],
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
                    center:['25%','50%'],
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: data2
                }]
            };
            myChartExpand.setOption(expandOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartExpand.resize();

            });
        }


        // 项目拓展趋势图
        function initExpandTrend(data1,data2,data3){
            var myChartExpandTrend = echarts.init(document.getElementById('expandtrend'));
            expandtrendOption = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['签订合同','签订合同谈判中','拓展失败']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月','8月', '9月', '10月', '11月', '12月']
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    name: '签订合同',
                    type: 'line',
                    stack: '总量1',
                    data: data1
                },
                    {
                        name: '签订合同谈判中',
                        type: 'line',
                        stack: '总量2',
                        data: data2
                    },
                    {
                        name: '拓展失败',
                        type: 'line',
                        stack: '总量3',
                        data:data3
                    }
                ]
            };
            myChartExpandTrend.setOption(expandtrendOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartExpandTrend.resize();

            });
        }



        // 工作分析地图
        function initWorkMap(data){
            var map = new AMap.Map('container2',{
                zoom:10
            });
            AMap.plugin(['AMap.ToolBar','AMap.Scale'],
                function(){
                    map.addControl(new AMap.ToolBar());

                    map.addControl(new AMap.Scale());


                });
            var infoWindow = new AMap.InfoWindow();
            for(var i = 0, marker; i < data.length; i++){
                var arr = [];
                if( data[i] && data[i].TR_POSITION){
                    arr.push(data[i].TR_POSITION.split(',')[0]);
                    arr.push(data[i].TR_POSITION.split(',')[1]);
                    marker=new AMap.Marker({
                        position:arr,
                        map:map,
                        extData:data[i]
                    });
                    //给Marker绑定单击事件
                    marker.on('mouseover', markerClick);
                }
            }
            map.setFitView();
            function markerClick(e){
                $scope.prodetail = e.target.getExtData();
                //查询部门
                findWorkDept($scope.prodetail.PARK_ID).then(function (resp) {
                    var data = resp.data;
                    var content ='项目名称:'+$scope.prodetail.PARK_NAME + '<br/>'
                        + '项目主任:' +  ($scope.prodetail.DIRECTOR || '')  + '<br/>'
                        + '人员配置:'+ (data.PARK_PERSON_AMOUNT ? data.PARK_PERSON_AMOUNT+'人':'无');
                    infoWindow.setContent(content);
                    infoWindow.open(map, e.target.getPosition());
                });
                //$scope.$apply();
            }
        }



        //项目工单
        function initProOrder(param,total) {
            var data = angular.copy(param);
           
            total =total || 0;
            var arr = [];
            data[0] &&  arr.push(data[0]);
            data[1] &&  arr.push(data[1]);
            
            var data1 = arr.map(function(n){
              
                n.value=n.VALUE
                n.name = n.NAME + n.value + '人';
                return n;
            });
            var data2 = data1.map(function(n){
                return n.name;
            });
            var myChartProOrder= echarts.init(document.getElementById('proOrder'));
            var proOrderOption = {
                title : {
                    text: '总计 ：' + total + '人',
                    y:'80%',
                    x:'30%',
                    textStyle:{
                        fontWeight:'normal',
                        fontSize:'14'
                    }
                },

                tooltip: {
                    trigger: 'item',
                    formatter: "{b}({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    top:'60%',
                    data: data2,
                },
                series: [{
                    name: '访问来源',
                    type: 'pie',
                    radius: ['35%', '50%'],
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
                    center:['50%','30%'],
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: data1
                }]
            };
            myChartProOrder.setOption(proOrderOption);
            window.addEventListener('resize', function () {
                myChartProOrder.resize();

            });
        }



        function initWorktype(data1,data2,data3){
            var myChartWorktype = echarts.init(document.getElementById('worktype'));
            var worktypeOption =  {
                title : {
                    text: '总计 ： ' + data1,
                    y:'85%',
                    x:'60%',
                    textStyle:{
                        fontWeight:'normal',
                        fontSize:'14'
                    }
                },

                tooltip: {
                    trigger: 'item',
                    formatter: "{b}({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    top:'middle',
                    left:'60%',
                    data: data2
                },
                series: [{
                    name: '访问来源',
                    type: 'pie',
                    radius: '60%',
                    center: ['30%', '50%'],
                    label:{
                        normal:{
                            show:false
                        }
                    },
                    data:data3,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            };
            myChartWorktype.setOption(worktypeOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartWorktype.resize();

            });
        }

        // 各部门工单统计方法
        function initDpworkuit(data1,data2,data3){
            var myChartDpworkuit = echarts.init(document.getElementById('dpworkuit'));
            var dpworkuitOption = {
                legend: {
                    data: ['计划工单','应急工单'],
                    align: 'left',
                    left: '40%'
                },
                tooltip: {},
                xAxis: {
                    data: data1,
                    name: '项目名',
                    silent: false,
                    axisLine: {onZero: true},
                    splitLine: {show: false},
                    splitArea: {show: false},
                    axisLabel:{
                        interval:0,
                        rotate:-45,//倾斜度 -90 至 90 默认为0
                        textStyle:{
                            fontSize:"12"

                        }
                    },
                   

                },
                yAxis: {
                    splitArea: {show: false},
                    name: '条',
                },
                grid: {
                    left:'5%',
                    bottom:'35%'
                   
                  
                },
                series: [
                    {
                        name: '计划工单',
                        type: 'bar',
                        stack: 'two1',
                        data: data2,
                        barGap: '0%',
                        label: {
                            normal: {
                                show: true,
                                position: 'outside',
                                formatter: "{c}"
                            }
                        }
                    },
                    {
                        name: '应急工单',
                        type: 'bar',
                        stack: 'two2',
                        data: data3,
                        label: {
                            normal: {
                                show: true,
                                position: 'outside',
                                formatter: "{c}"
                            }
                        }
                    }

                ]
            };
            myChartDpworkuit.setOption(dpworkuitOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartDpworkuit.resize();

            });
        }

        // 工单分类统计方法
        function initWorkunits(data1,data2) {
            var myChartWorkunits = echarts.init(document.getElementById('workunits'));
            var workunitsOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    top:'middle',
                    left:'40%',
                    data: data1,
                },
                series: [{
                    name: '访问来源',
                    type: 'pie',
                    radius: ['30%', '40%'],
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
                    center:['20%','50%'],
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: data2
                }]
            };
            myChartWorkunits.setOption(workunitsOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartWorkunits.resize();

            });
        }

        // 工单完成率
        function finishrate(data1,data2){
            var myChartWorkordercp = echarts.init(document.getElementById('workordercp'));
            var workordercpOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    top:'middle',
                    left:'60%',
                    data:  data1,
                },
                series: [{
                    name: '访问来源',
                    type: 'pie',
                    radius: ['40%', '60%'],
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
                    center:['30%','50%'],
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: data2
                }]
            };
            myChartWorkordercp.setOption(workordercpOption);
            window.addEventListener('resize', function () {
                myChartWorkordercp.resize();

            });

        }




        // 工单好评率方法
        function initPraise(data1,data2) {
            var myChartPraise = echarts.init(document.getElementById('praise'));
            var praiseOption  = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    top:'75%',
                    left:'35%',
                    data:  data1,
                },
                series: [{
                    name: '访问来源',
                    type: 'pie',
                    radius: ['40%', '60%'],
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
                    center:['50%','40%'],
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: data2
                }]
            };
            myChartPraise.setOption( praiseOption);
            myChartPraise.on('click', function (params) {
                if(params.name.indexOf('差评') != -1){
                    //查看回访详情
                    var modal = $uibModal.open({
                        animation: false,
                        templateUrl: '../common/modal.showBadWork.html',
                        size:'lg',
                        controller: 'showBadWorkModalCtrl'
                    });
                    modal.result.then(function () {
                        $scope.find();
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    });
                }
            });
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartPraise.resize();

            });
        }



        // 设备运行状态
        function initEquip(data1,data2) {
            var myChartEquipment= echarts.init(document.getElementById('equipment'));
            var equipmentOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    top:'middle',
                    left:'60%',
                    data: data1
                },
                series: [{
                    name: '访问来源',
                    type: 'pie',
                    // radius: ['35%', '60%'],
                    radius: '55%',
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
                    center:['30%','50%'],
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:data2
                }]
            };
            myChartEquipment.setOption(equipmentOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartEquipment.resize();

            });
        }

        // 各类系统故障统计
        function initFault(data1,data2){
            var myChartFault = echarts.init(document.getElementById('fault'));
            var faultOption = {
                tooltip: {
                    trigger: 'axis',
                    formatter: "{b} : {c}台",
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    data:data1,
                    axisTick: {
                        alignWithLabel: true
                    }
                }],
                yAxis: [{
                    type: 'value',
                    name:'台'

                }],
                series: [{
                    name: '直接访问',
                    type: 'bar',
                    data: data2,
                    label: {
                        normal: {
                            show: true,
                            position: 'outside',
                            formatter: "{c}"
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                var colorList = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074'];
                                return colorList[params.dataIndex]
                            }

                        }
                    }
                }]
            };
            myChartFault.setOption(faultOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartFault.resize();

            });
        }


        // 设备工单统计
        function initWorkorder(data1,data2){
            var myChartWorkorder= echarts.init(document.getElementById('workorder'));
            var workorderOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    top:'middle',
                    left:'60%',
                    data: data1
                },
                series: [{
                    name: '访问来源',
                    type: 'pie',
                    radius: '55%',
                    center: ['30%', '50%'],
                    label:{
                        normal:{
                            show:false
                        }
                    },
                    data: data2,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            };
            myChartWorkorder.setOption(workorderOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartWorkorder.resize();

            });
        }


        // 各类设备完好率统计
        function iniIntactt(data1,data2,data3) {
            var myChartIntact = echarts.init(document.getElementById('intact'));
            var itemStyle = {
                normal: {},
                emphasis: {
                    barBorderWidth: 1,
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowColor: 'rgba(0,0,0,0.5)'
                }
            };

           var  intactOption = {
                tooltip: {
                    formatter: "{a}<br>{b} : {c}台"
                },
                xAxis: {
                    data:  data1,
                    name: '设备',
                    silent: false,
                    axisLine: {onZero: true},
                    splitLine: {show: false},
                    splitArea: {show: false}
                },
                yAxis: {
                    splitArea: {show: false},
                    name:'台'
                },
                grid: {
                    left:'10%',
                    bottom: '10%'
                 
                },
                series: [
                    {
                        name: '完好',
                        type: 'bar',
                        stack: 'two',
                        itemStyle: itemStyle,
                        data: data2
                    },
                    {
                        name: '故障',
                        type: 'bar',
                        stack: 'two',
                        itemStyle: itemStyle,
                        data: data3,
                        label: {
                            normal: {
                                show: true,
                                position: 'outside',
                                formatter: function (obj){
                                    var intactRate = (data2[obj.dataIndex] / (obj.data + data2[obj.dataIndex])*100).toFixed(2) + '%';
                                    return intactRate;
                                }
                            }
                        }
                    }

                ]
            };
            myChartIntact.setOption(intactOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartIntact.resize();

            });
        }


    });
    //查看差评列表
    app.controller('showBadWorkModalCtrl', function($scope,$uibModalInstance,$http,fac) {
        $scope.search={isBad:'bad'};
        $scope.pageModel={};

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("/ovu-pcos/pcos/workunit/parkWorkunitlist.do",$scope.search,function(data){
                $scope.pageModel = data;
            });
        }
        $scope.find();
    });



})();