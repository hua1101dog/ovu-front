/**
 * Created by Cx
 */
(function (angular) {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('energySpaceCtrl', function ($scope, $rootScope, $uibModal, $state, $http, $filter, fac) {
        document.title = '空间能耗统计';
        $scope.search = {};

        $scope.timeDimList = [
            ['year', '年'],
            ['month', '月'],
            ['day', '日']
        ]
        var date=new Date;
       var month=date.getMonth()
       var tyear=date.getFullYear()
        $scope.search.timeDim = 'year';
        $scope.search.time = moment().format("YYYY");
        $scope.config = {
            edit: false,
            showCheckbox: true

        };
        $scope.search.nodeList = []
        $scope.config = {
            edit: false,
            showCheckbox: true
        }
        $scope.callback = function () {
            $scope.findTypes();
            $scope.find();
            $scope.loadParkTree();
            $scope.findTable();

        }
        app.modulePromiss.then(function () {
            $scope.parkTree = [];

            $scope.findTypes();
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId;
                        $scope.callback();
                    } else {
                        alert('请选择跟项目关联的部门');
                        $scope.search.parkId &&  delete $scope.search.parkId
                        
                    }

                }

            })
        });
        $scope.checkTypes = function (item) {
            $scope.search.nodeList = []
            $scope.search.meterType = item.type;
            $scope.find();
            $scope.loadParkTree();
            $scope.findTable();
        };
        //加载计量点分类
        $scope.findTypes = function () {
            $http.get('/ovu-energy/energy/classify/list').success(function (res) {
                if (res.code == 0) {
                    $scope.classifyList = res.data;
                } else {
                    alert(res.msg);
                }
            })

        };
        //选择日期
        $scope.selectTime = function (time) {
            $scope.search.time = '';

        }

        //全选
        var i = 0
        $scope.selectAll = function (tree, $event) {
            i++;
            if (i > 1) {
                return
            }
            tree.forEach(function (node) {
                node.state = node.state || {};

                if (node.checked == false) {
                    node.state.checked = false;
                } else {
                    node.state.checked = true;
                }
                function checkSons(node, status) {
                    node.state = node.state || {};

                    if (node.checked == false) {
                        node.state.checked = false;
                    } else {
                        node.state.checked = true;
                        $scope.search.nodeList.push({ id: node.id, level: node.level });
                    }

                    if (node.nodes && node.nodes.length) {
                        node.nodes.forEach(function (n) {
                            checkSons(n, true);
                        })
                    }
                }
                checkSons(node);

            })

            $scope.find();
            $scope.findTable()


        }
        //置空
        $scope.clearAll = function (tree) {
            i = 0;
            tree.forEach(function (node) {
                node.state = node.state || {};
                node.state.checked = false;
                function checkSons(node, status) {
                    node.state = node.state || {};
                    node.state.checked = false;
                    var index = $scope.search.nodeList && $scope.search.nodeList.findIndex(function (v) {
                        return v.id == node.id
                    })
                    $scope.search.nodeList.splice(index, 1)
                    if (node.nodes && node.nodes.length) {
                        node.nodes.forEach(function (n) {
                            checkSons(n, status);
                        })
                    }
                }
                checkSons(node, false);



            })
            $scope.find();
            $scope.findTable()
        }

        $scope.find = function () {
            delete $scope.search.floorId
            delete $scope.search.stageId
            delete $scope.search.unitNum
            $scope.engerytotal = [];
            $http.post("/ovu-energy/energy/stats/space/chat", $scope.search).success(function (data) {
                var data = data.data
                $scope.engerytotal = data;
                var timeList = [];
                var parkList = [];
                var dataList2 = [];

                if (!fac.isEmpty(data)) {
                    data[0].spaceList.forEach(function (n, index) {
                        parkList.push(n.spaceName);
                    })
                    data.forEach(function (v, index) {
                        timeList.push(v.time);
                        v.spaceList.total = [];
                        v.spaceList && v.spaceList.forEach(function (n, i) {
                            n.total = n.total || '0';
                            v.spaceList.total.push(n.total);
                        })
                        var total = [];
                        v.spaceList.total.forEach(function (n) {
                             // if(index<=month &&  $scope.search.time!==tyear){
                             //    total.push(n)
                             // }
                             if($scope.search.time==tyear){
                                if(index<=month){
                                     total.push(n)
                                }
                             }else{
                                total.push(n)
                             }
                        })
                        dataList2.push(total)

                    })
                    var dataList1=[];
                    for(var j=0;j<dataList2[0].length;j++){
                        var total=[];
                        for(var i=0;i<dataList2.length;i++){
                            total.push(dataList2[i][j])
                        }
                        dataList1.push({data:total,type:'line'})  
                     }
                     dataList1.forEach(function(v,i){
                        v.name=parkList[i]
                     })
                   

                } else {
                    timeList = [];
                    parkList = [];
                    dataList1 = [];
                }

                setTimeout(function () {
                    intLine(timeList, parkList, dataList1);

                }, 1)




            });
        }
        $scope.findTable = function () {
            delete $scope.search.floorId
            delete $scope.search.stageId
            delete $scope.search.unitNum
            $http.post("/ovu-energy/energy/stats/space/spaceStats", $scope.search, ).success(function (data) {
                var data = data.data
                $scope.tableList = data
                // if (fac.isEmpty(data.itemList)) {

                //     $scope.energyLineTrendData.series[0].data[0].value = 0;
                //     $scope.energyConsumeFenXiangCount.series[0].data = [];
                // }
                // else {
                //     $scope.energyConsumeAll.series[0].data[0].value = data.total.value;
                //     $scope.energyConsumeFenXiangCount.series[0].data = data.itemList;
                // }
            });
        }
        //点击查询
        $scope.findAll = function () {
            if (!$scope.search.time) {
                alert('请选择时间');
                return
            }
            if ($scope.search.nodeList.length == 0) {
                alert('请选择空间');
                return
            }
            $scope.find();
            $scope.findTable();
        }
        //加载空间树

        $scope.loadParkTree = function () {
            $http.post("/ovu-energy/energy/stats/space/tree", { parkId: $scope.search.parkId, spaceName: $scope.search.spaceName, meterType: $scope.search.meterType }).success(function (data) {
                if (data.code == 0) {
                    $scope.parkTree = data.data || [];


                }

            });
        };

        function intLine(timeList, parkList, total) {
            var myChartEnergy = echarts.init(document.getElementById('energyTotal'));
            $scope.engeryOption = {

                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: parkList,
                    orient: 'vertical',
                    right: 0,
                    top: 10,
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
                    data: timeList
                },
                yAxis: {
                    type: 'value'
                },
                series: total
            };
            myChartEnergy.setOption($scope.engeryOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartEnergy.resize();

            });
        }



        function expandFather(node) {
            var father = $scope.parkTree.find(function (n) {
                return n.did == node.pdid
            });
            if (father) {
                father.state = father.state || {};
                father.state.expanded = true;
                expandFather(father);
            }
        }
        function uncheckFather(node) {
            var father = $scope.parkTree.find(function (n) { return n.parkId == node.pid });
            if (father) {
                father.state = father.state || {};
                father.state.checked = false;
                uncheckFather(father);
            }
        }


        $scope.check = function (node, $event) {
            node.state = node.state || {};
            node.state.checked = !node.state.checked;
            if (node.checked == false) {

                node.state.checked = false
            } else {
                if (node.state.checked) {
                    $scope.search.nodeList.push({ id: node.id, level: node.level })
                } else {
                    var index = $scope.search.nodeList && $scope.search.nodeList.findIndex(function (v) {
                        return v.id == node.id
                    })
                    $scope.search.nodeList.splice(index, 1)
                }
                $scope.find(1)
                $scope.findTable();
            }







        }
    });
})(angular)

