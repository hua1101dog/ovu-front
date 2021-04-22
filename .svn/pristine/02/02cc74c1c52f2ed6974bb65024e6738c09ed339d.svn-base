
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('energyLossCtrl', function ($scope, $rootScope, $sce, $uibModal, $state, $http, $window, $filter, fac) {
        document.title = '能源损耗分析';
        $scope.pageModel = {};
     $scope.search = { isGetPointData: false };
        $scope.search.pointType = 1;
        $scope.search.classifyType = 1;
        var selectedIndex;

        $scope.search.startTime = moment().startOf('month').format('YYYY-MM-DD');
        $scope.search.endTime = moment().format('YYYY-MM-DD');
        $scope.treeData = [];
        $scope.search.isshow = true;
        $scope.config = {
            edit: false
        }
        // 页面初始化
        app.modulePromiss.then(function () {
            $scope.findTypes();
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId;
                        $scope.search.parkName = $scope.dept.parkName;
                        $scope.init();
                    } else {
                        alert('请选择跟项目关联的部门');
                        $scope.search.parkId &&  delete $scope.search.parkId
                        $scope.search.parkName &&  delete $scope.search.parkName;
                    }

                }

            })

        })
        function int() {
            var myChartProOrder = [];
            var data = [];
            var option = [];

            for (var i = 0; i < $scope.treeList.length; i++) {  

                myChartProOrder[i] = echarts.init(document.getElementById('proOrder-' + i));  //创建多颗树
               
                data[i] = {
                    "name": $scope.treeList[i].name,   //每棵树的父节点名字
                    "children": $scope.treeList[i].nodes   //每棵树的子节点
                };

                option[i] = {
                    tooltip: {
                        trigger: 'item',
                        triggerOn: 'mousemove',
                        formatter: function (v) {
                            var text=v.name;
                            return text;
                        }
                    },

                    series: [

                        {
                            type: 'tree',
                            data: [data[i]],

                            top: '5%',
                            left: '20%',
                            bottom: '2%',
                            right: '20%',
                            symbolSize: 10,
                            // padding: 40,
                           
                            label: {
                                normal: {
                                    position: 'left',
                                    verticalAlign: 'middle',
                                    align: 'right',
                                    fontSize:14,
                                    formatter: function (v) {
                                        var text = v.name;
                                        return  text.split(" ").join("\n");
                                    }
                                   
                       
                                },
                            },
                            leaves: {
                                label: {
                                    normal: {
                                        position: 'right',
                                        verticalAlign: 'middle',
                                        align: 'left'
                                    }
                                }
                            },

                            expandAndCollapse: true,

                            animationDuration: 550,
                            animationDurationUpdate: 750

                        },

                    ]
                }
                // myChartProOrder.hideLoading();

                myChartProOrder[i].setOption(option[i]);
                angular.element($window).on('resize', function () {
                      for(var i=0;i<myChartProOrder.length;i++){
                        myChartProOrder[i].resize();
                      }
                    // setTimeout(function () {
                    //     debugger
                    //     myChartProOrder[i].resize();
                    // }, 1)
                });

            }

        }
        function intAbnormal(timeList, typeList, data) {
            var myChartAbnormal = echarts.init(document.getElementById('Abnormal'));;
            var AbnormalOption = {
                title: {
                    // text: '能源消耗趋势图',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',

                },
                legend: {
                    orient: 'vertical',
                    right: 0,
                    top: 10,
                    data: typeList
                },
                xAxis: {
                    type: 'category',
                    // name: 'x',
                    splitLine: { show: false },
                    data: timeList,

                },

                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                yAxis: {
                    type: 'value'
                    //name: 'y'
                },
                series: data
            }
            myChartAbnormal.setOption(AbnormalOption,true);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartAbnormal.resize();

            });
        }
        $scope.changeIndex = function (index) {
            selectedIndex = index;
            $scope.treeData = [];
            $scope.search.classifyType = index - 0 + 1;
            if (index == 0 || index == 1) {
                $scope.search.isshow = true;
                $scope.loadEnergyTree();

            } else {
                $scope.search.isshow = false;
                $scope.findAbnormal();

            }
        };
        $scope.init = function () {
            $scope.loadEnergyTree();

        }

        $scope.selectNode = function (search,node) {
            //只允许点击父节点
            if (node.parentId == 0) {
                if (node.state.selected) {
                     $scope.search.nodeId=node.id
                    if ($scope.search.classifyType == 1) {

                        $scope.find()
    
                    } else {
    
                        $scope.findLevel();
    
                    }
                } else {
                    // if ($scope.search.classifyType == 1) {

                    //     $scope.energyCouple=[]
    
                    // } else {
    
                    //     $scope.treeList=[];
    
                    // }
                    delete $scope.curNode;
                }
                
            } else {
                alert('只允许点击一级节点');
            }

        };

        // 查询
        //加载分组数据
        $scope.find = function (pageNo, nodeId) {
           
            
            var param = {
                parkId: $scope.search.parkId,
                classifyType: $scope.search.classifyType,
                pointType: $scope.search.pointType,
                endTime: $scope.search.endTime,
                startTime: $scope.search.startTime,
                nodeId:$scope.search.nodeId
                
            }
            $http.post('/ovu-energy/energy/energystat/classify/energylossgroupstat', param).success(function (res) {
                if (res.code == 0) {
                    $scope.energyCouple = res.data
                } 
            })
        }
        //加载分层数据
        $scope.findLevel = function (pageNo, nodeId) {
            if (!$rootScope.dept || !$rootScope.dept.id) {
                alert("请选择部门！");
                return false;
            }
           
            var param = {
                parkId: $scope.search.parkId,
                pointType: $scope.search.pointType,
                endTime: $scope.search.endTime,
                startTime: $scope.search.startTime,
                nodeId: $scope.search.nodeId
            }
            $http.post('/ovu-energy/energy/energystat/classify/energylosslevelstat', param).success(function (res) {
                if (res.code == 0) {
                    $scope.treeList = res.data || [];
                    $scope.treeList && $scope.treeList.forEach(function (v) { //遍历每个数组
                        var energyValue;
                        var fixLossValue;
                        var lossValue;
                        if (v.energyValue) {
                            energyValue = ' 能耗值:' + v.energyValue
                        } else {
                            energyValue = ''
                        }
                        if (v.fixLossValue) {
                            fixLossValue = '固定损耗:' + v.fixLossValue
                        } else {
                            fixLossValue = ''
                        }
                        if (v.lossValue) {
                            lossValue = '损耗数据:' + v.lossValue
                        }else{
                            lossValue = ''
                        }

                        v.name = v.text + ' ' + energyValue +' ' + fixLossValue  +' ' +lossValue;
                        v.nodes && v.nodes.forEach(function (n) {
                            if (n.energyValue) {
                                n.energyValue = ' 能耗值:' + n.energyValue
                            } else {
                                n.energyValue = ''
                            }
                            if (n.fixLossValue) {
                                n.fixLossValue = '固定损耗:' + n.fixLossValue
                            } else {
                                n.fixLossValue = ''
                            }
                            if (n.lossValue) {
                                n.lossValue = '损耗数据:' + n.lossValue
                            }else{
                                n.lossValue = ''
                            }
                            n.name = n.text + ' ' +
                                n.energyValue + ' ' +
                                n.fixLossValue + ' ' +
                                 n.lossValue + ' ';
                            function getNode(v) {
                                v.children = v.nodes; //遍历每个数组的nodes 把Nodes变为children 方便绘制成树状图
                                v.children && v.children.forEach(function (n) {
                                    if (n.energyValue) {
                                        n.energyValue = ' 能耗值：' + n.energyValue
                                    } else {
                                        n.energyValue = ''
                                    }
                                    if (n.fixLossValue) {
                                        n.fixLossValue = '固定损耗：' + n.fixLossValue
                                    } else {
                                        n.fixLossValue = ''
                                    }
                                    if (n.lossValue) {
                                        n.lossValue = '损耗数据:' + n.lossValue
                                    }else{
                                        n.lossValue = ''
                                    }
                                    n.name = n.text + ' ' +
                                        n.energyValue + ' ' +
                                        n.fixLossValue + ' ' +
                                        n.lossValue+ ' ' ;
                                    getNode(n)
                                })
                            }

                            getNode(n)


                        })
                    })
                   
                    setTimeout(function () {
                        int();
                    }, 1)
                } else {
                    alert(res.msg);
                }
            })

        }
        //加载异常列表数据
        $scope.findAbnormal = function () {
            if (!$rootScope.dept || !$rootScope.dept.id) {
                alert("请选择部门！");
                return false;
            }
         
            var param = {
                parkId: $scope.search.parkId,
                pointType: $scope.search.pointType,
                endTime: $scope.search.endTime,
                startTime: $scope.search.startTime,

            }
            $http.post('/ovu-energy/energy/energystat/classify/energylossabnormalstat', param).success(function (res) {
                if (res.code == 0) {
                    $scope.abnormalList = res.data.statU || [];  //公式表格
                    $scope.intAbnormalEchart = res.data.statD;//图表
                    var timeList = [];
                    var typeList = [];
                    var dataList2 = [];
                    if (!fac.isEmpty($scope.intAbnormalEchart)) {
                        $scope.intAbnormalEchart[0].calculateType.forEach(function (v) {
                            typeList.push(v.type);
                        })
                        $scope.intAbnormalEchart.forEach(function (v, i) {
                            v && v.time;
                            timeList.push(v.time);
                            v.calculateType.value = [];
                            v.calculateType && v.calculateType.forEach(function (n, index) {
                                n.value = n.value || '0';
                                v.calculateType.value.push(n.value);
                            })
                            var total = [];
                            v.calculateType.value.forEach(function (n) {
                                total.push(n)
                            })
                            dataList2.push(total)
                        })
                        var dataList1 = [];
                        for (var j = 0; j < dataList2[0].length; j++) {  //每个对象里的每个数组里的每一项
                            var total = [];
                            for (var i = 0; i < dataList2.length; i++) {   //每个对象里的每个数组
                                total.push(dataList2[i][j])
                            }
                            dataList1.push({ data: total, type: 'line' })
                        }
                        dataList1.forEach(function (v, i) {
                            v.name = typeList[i]
                        })
                       
                    }else{
                       timeList = [];
                       typeList = [];
                      dataList1= [];
                    }
                    intAbnormal(timeList, typeList, dataList1);
                } else {
                    alert(res.msg);
                }
               
            })
        }
        $scope.findTypes = function () {
            $http.get('/ovu-energy/energy/classify/list').success(function (res) {
                if (res.code == 0) {
                    $scope.classifyList = res.data;
                } else {
                    alert(res.msg);
                }
            })
        }
        //选择分类
        $scope.checkTypes = function (item) {
            $scope.treeData = [];
            delete $scope.search.nodeId;
            $scope.search.pointType = item.type;
            $scope.search.classifyId = item.classifyId;
            $scope.loadEnergyTree();


        }

        //导出
        $scope.outputDo = function () {
            if ($scope.search.classifyType == 3) {
                if ($scope.search.nodeId) {
                    window.location.href = "/ovu-energy/energy/energystat/classify/export?classifyType=" + $scope.search.classifyType +
                        "&parkId=" + $scope.search.parkId + "&pointType=" + $scope.search.pointType + '&startTime=' + $scope.search.startTime +
                        '&endTime=' + $scope.search.endTime + '&nodeId=' + $scope.search.nodeId;
                } else {
                    window.location.href = "/ovu-energy/energy/energystat/classify/export?classifyType=" + $scope.search.classifyType +
                        "&parkId=" + $scope.search.parkId + "&pointType=" + $scope.search.pointType + '&startTime=' + $scope.search.startTime +
                        '&endTime=' + $scope.search.endTime;
                }

            } else {
                var modal = $uibModal.open({
                    animation: false,
                    size: 'md',
                    templateUrl: 'energy/energyCountAnalysis/modal.outport.html',
                    controller: 'outportModalCtrl'
                    , resolve: {
                        data: $scope.search
                    }
                });
                modal.result.then(function () {
                    $scope.find();
                    console.info('Modal dismissed at: ' + new Date());
                }, function () {
                    console.info('Modal dismissed at: ' + new Date());
                });
            }



        }
        //加载能耗树
        $scope.loadEnergyTree = function () {
            $scope.search.classifyType = $scope.search.classifyType || '1';
            $scope.energyCouple = [];
            $scope.treeList = [];
            var  params={
                pointType:$scope.search.pointType,
                isGetPointData:$scope.search.isGetPointData,
                parkId:$scope.search.parkId,
                classifyType:$scope.search.classifyType
            }
            if (($scope.search.classifyType == 3)) {
                $scope.findAbnormal();
            }else{
                $http.post("/ovu-energy/energy/energyanalysis/tree", params, fac.postConfig).success(function (data) {
                    if (data.code == 0 && data.data) {
                        $scope.search.nodeId = data.data[0].id;
                        if ($scope.search.classifyType == 1) {
                            $scope.find(1, $scope.search.nodeId);
                        } else if ($scope.search.classifyType == 2) {
                            $scope.findLevel(1, $scope.search.nodeId);
                        }
                    }
                    $scope.treeData = data.data || [];
                    if ($scope.treeData.length !== 0) {
                        $scope.treeData[0].state = $scope.treeData[0].state || {};
                        $scope.treeData[0].state.selected = true;
                    }
    
                });
            }
         
        };
        //鼠标悬浮

        $scope.show = function (item) {
            var copy = angular.extend({}, item)
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: 'energy/energyCountAnalysis/modal.showInfo.html',
                controller: 'showInfoModalCtrl'
                , resolve: {
                    data: copy
                }
            });
            modal.result.then(function () {
                modal.close();
                //返回页面顶部
                $('html , body').scrollTop(0);
            }, function () {
                modal.close();
                //返回页面顶部
                $('html , body').scrollTop(0);

            });

        }
    });
    //导出
    app.controller('outportModalCtrl', function ($scope, $rootScope, $http, $sce, $uibModalInstance, $uibModal, $filter, $q, fac, data) {
        $scope.item = {}
        $scope.item.exportType = 1;
        $scope.save = function () {
            window.location.href = "/ovu-energy/energy/energystat/classify/export?classifyType=" + data.classifyType +
                "&parkId=" + data.parkId + '&exportType=' + $scope.item.exportType + "&pointType=" + data.pointType + '&startTime=' + data.startTime +
                '&endTime=' + data.endTime + '&nodeId=' + data.nodeId;

        };

        /**
         * 取消
         */
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    //展示详情
    app.controller('showInfoModalCtrl', function ($scope, $rootScope, $http, $sce, $uibModalInstance, $uibModal, $filter, $q, fac, data) {
        $scope.item = data || {};

        // $scope.item.lossData = ''
        // $scope.item.nodes && $scope.item.nodes.forEach(function (v) {
        //     $scope.item.lossData -= v.energyValue
        // })
        $scope.cancel = function () {
            $uibModalInstance.close('cancel');

        };
    });
    //层级control
    app.controller('layeredEnergyCtrl', function ($scope, $rootScope, $http, $sce, $filter, $window, $q, fac) {



    });

    //异常control
    app.controller('abnormalEnergyCtrl', function ($scope, $rootScope, $http, $sce, $filter, $q, fac) {

    });

})();
