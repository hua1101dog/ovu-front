(function(angular, document) {
    // document.title = "OVU-设备监测";
    var app = angular.module("angularApp");

    app.controller('equipMonitorCtl', ['$scope', '$rootScope', '$interval', '$http', '$filter', '$uibModal', 'fac', function($scope, $rootScope, $interval, $http, $filter, $uibModal, fac) {

        // 项目id
        var parkId = "";
        $scope.search={};

        //集团版,设置好项目后更新 期栋树
        $scope.refresh = function() {
            var p1 = fac.getHouseTree2($scope, $scope.search.parkId);
            $scope.find();

            //向xw地图广播园区切换事件
            p1.then(function(ret) {
                drawEqNumChart1();
                drawEqFaultChart1();
                $scope.$broadcast('parkChanged', { parkId: $scope.search.parkId, treeData: ret });
            });
        }

        app.modulePromiss.then(function () {
            fac.setEquipTypeTree($scope.search);
            $scope.$watch('dept.parkId', function (parkId, oldValue) {
                if (!parkId) {
                   alert("请选择项目！");
                   parkId = "";
                   return;
                }
                parkId = $scope.search.parkId = $rootScope.dept.parkId;
                $scope.refresh();
            })
        });

      /*  app.modulePromiss.then(function(res) {
            fac.initPage($scope,
                function() {
                    if(!$scope.search.isGroup){
                        $scope.houseTree=fac.getHouseTree2($scope, $scope.search.parkId)
                    }
                    $scope.search.equipmentType_id = equipmentType_id;
                    $scope.find();
                },
                function() {

                    $scope.findFirst();
                });
        });*/


        // 设备监控类型 id
        // console.log($scope.$parent.equipmentType_id);
        var equipmentType_id = $scope.$parent.equipmentType_id;

        // 默认 列表模式
        $scope.radioModel = 'list-mode';

        // websoket 推送数据
        function send_echo() {
            // wjlong begin websocket 白名单配置
            // echo_websocket = new SockJS("/ovu-pcos/pcos/sayhello"); //初始化 websocket

            echo_websocket = new SockJS("/ovu-pcos/pcos/sayhello", undefined, {
                // transports: ['websocket', 'xdr-streaming', 'xhr-streaming']
                transports: ['websocket']
            }); // 只允许使用websoket传递数据

            // end

            echo_websocket.onopen = function() {
                console.log('Info: connection opened.');
            };
            echo_websocket.onmessage = function(event) {
                console.log('Received: ' + event.data); //处理服务端返回消息
                $scope.$apply(
                    function() {
                        var data = JSON.parse(event.data);

                        //将服务器推送过来的异常事件广播出去
                        if (data.equipmentType_id == equipmentType_id) {
                            $rootScope.$broadcast('eventItemClick', data);
                            //重新调度
                            fingthing();
                        }
                        //} else if (data.type == 2) {
                        //    //$rootScope.warmingThing();
                        //}
                    }
                )
            };
            echo_websocket.onclose = function(event) {
                console.log('Info: connection closed.');
                console.log(event);
            };
        }
        send_echo();


        $scope.TabModeClick = function() {
            if ($scope.radioModel == 'list-mode' || $scope.radioModel == 'icon-mode' || $scope.radioModel == '2D/3D-mode' || $scope.radioModel == 'BIM-mode' || $scope.radioModel == 'GD-mode') {
                var treeData = $scope.houseTree;
                $scope.houseTree = ergodicTress(treeData, '', []);
            }
        }

        // 配置所有的组件里的 tree-view 都是非编辑状态
        $rootScope.config = {
            edit: false
        };

        // collapse
        $scope.clps1 = {};
        $scope.clps2 = {};
        $scope.clps1.isCollapsed = false;
        $scope.clps2.isCollapsed = true;
        $scope.radioModel = 'list-mode';
        $scope.status2 = {};
        $scope.status2.open = true;

        //事件列表
        $scope.eventList = null;
        //简化设备类型树
        $scope.simpleEquipTypeTree = null;

        // 事件查询
        function fingthing() {
            if (equipmentType_id === undefined) {
                equipmentType_id = '';
            }

            $http.get("/ovu-pcos/pcos/equipment/listexceptions.do?parkId=" + parkId + "&equipmentType_id=" + equipmentType_id)
                .success(function(results) {
                    $scope.eventList = results;
                })
                .error(function() {
                    alert("请求事件出错");
                });
        }
        fingthing();

        // 绘制两个统计图表
        var _eqNumChart, _eqFaultChart;
        // 绘制故障数量饼图

        var drawEqNumChart1 = function() {
            $http.post("/ovu-pcos/pcos/equipment/listpiebimtype.do", {
                parkId: parkId,
                equipTypeId: $scope.search.equipTypeId || ''
            }, fac.postConfig)

            .success(function(res) {
                var chart = echarts.init(document.getElementById('pieChartDiv'));
                if (!angular.isArray(res)) {
                    return;
                }

                var data = res.filter(function(item) {
                    return item.value;
                });

                if (!data.length) {
                    data = res;
                }
                var option = {
                    title: {
                        text: '设备数量分类统计',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} ({c}占比{d}%)"
                    },
                    calculable: false,
                    series: [{
                        name: '设备数量',
                        type: 'pie',
                        radius: '50%',
                        center: ['50%', '70%'],
                        data: data
                    }]
                };
                // $scope.pieOption = option;
                chart.setOption(option);
                // window.addEventListener('resize', function() {
                //     chart.resize();
                // });
            });
        };

        // 绘制故障分布柱状图
        var drawEqFaultChart1 = function() {
            $http
                .post("/ovu-pcos/pcos/equipment/listbarbimtype.do", {
                    parkId: parkId,
                    equipTypeId: $scope.search.equipTypeId
                }, fac.postConfig)

            .success(function(res) {
                var chart = echarts.init(document.getElementById('barChartDiv'));
                if (!angular.isArray(res)) {
                    return;
                }

                var legendData = res.map(function(item) {
                    return item.name;
                });
                var xAxisData = legendData;
                var seriesData = res.map(function(item) {
                    return item.value;
                });

                var option = {
                    title: {
                        text: '设备故障分类统计',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: legendData
                    },
                    grid: {
                        bottom: '20',
                        top: '80',
                        containLabel: false
                    },
                    xAxis: [{
                        type: 'category',
                        data: xAxisData
                    }],
                    yAxis: [{
                        type: 'value'
                    }],
                    series: [{
                        name: '故障个数',
                        type: 'bar',
                        data: seriesData,
                        // markPoint: {
                        //     data: [{
                        //         type: 'max',
                        //         name: '最大值'
                        //     }, {
                        //         type: 'min',
                        //         name: '最小值'
                        //     }]
                        // }
                    }]
                };
                // 为echarts对象加载数据
                // $scope.barOption = option;
                chart.setOption(option);
                // window.addEventListener('resize', function() {
                //     chart.resize();
                // });

            });

        };

        drawEqNumChart1();
        drawEqFaultChart1();

        // 设备查询
        function findTypeId() {
            if (equipmentType_id === undefined) {
                equipmentType_id = '';
            }
            $http.get("/ovu-pcos/pcos/equipment/list2dequipment.do?parkId=" + parkId + "&equipmentType_id=" + equipmentType_id)

            .success(function(results) {
                // 2D/3D BIM 模式下不显示tree结构数据 显示简化的tree 根节点-叶节点 省去中间节点
                $scope.simpleEquipTypeTree = tree2list(results[0].nodes);
                $rootScope.equipdata = results;
            }).error(function() {
                alert("请求设备分类数据出错")
            });
        }

        findTypeId();

        // tree2list   修剪树  tree --> [{id,pid,text,...,leafnodes:[]},...]
        function tree2list(tree) {
            function getLeafs(obj) {
                if (!angular.isArray(obj.nodes)) {
                    return [];
                }
                var currArr = [obj],
                    list = [];

                while (currArr.length) {
                    var obj1 = currArr.shift();
                    obj1.nodes.forEach(function(v) {
                        // 是叶节点就加入list
                        if (v.is_equip) {
                            list.push(v);
                        }
                        if (angular.isArray(v.nodes) && v.nodes.length) {
                            currArr.push(v);
                        }
                    })
                }
                return list;
            }
            // map 一下
            var arr = tree.map(function(v) {
                // 取出叶节点
                v = angular.copy(v);
                v.leafNodes = getLeafs(v);
                return {
                    text: v.text,
                    id: v.id,
                    pid: v.pid,
                    leafNodes: v.leafNodes
                }
            });
            return arr;
        }


        // 设备分类 点击事件 广播出去
        $scope.eqTypeItemClick = function(equip) {
            $rootScope.$broadcast('eqTypeItemClick', equip);
        };

        // 事件列表 点击事件 广播出去
        $scope.eventItemClick = function(model) {
            $rootScope.$broadcast('eventItemClick', model);
        };

        // bim 加载完成 获取楼层数据
        $rootScope.$on('bimFloorLoaded', function(e, data) {
            $scope.floorTree = data;
        });


        //图表切换
        $scope.pageModel = {};

        // 不要显示统计数量 减少后台压力
        $scope.search = { showCnt: false };
        $scope.search.equipmentType_id = equipmentType_id;
        $scope.search.parkId = $rootScope.projectId;
        $scope.findFirst = function(pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;

            // wjlong BEGIN 添加设备监控类型过滤 和 项目过滤
            // 设备监控类型过滤
            $scope.search.equipmentType_id = equipmentType_id;
            // 项目过滤
            $scope.search.parkId = $rootScope.projectId;
            // 如果是从项目跳转过来的 就更新housetree
            if ($rootScope.projectId) {
                var p1 = fac.getHouseTree2($scope, $scope.search.parkId);

                drawEqNumChart1();
                drawEqFaultChart1();

                findTypeId();
                fingthing();
            }
            // wjlong END
            $scope.search.orderBy = "hasSensor";
            fac.getPageResult("/ovu-pcos/pcos/equipment/queryByPage.do", $scope.search, function(data) {
                $scope.pageModel = data;
                $rootScope.$broadcast('pageModelLoaded', data);
            });
        };
        $scope.find = function(pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;

            parkId = $scope.search.parkId;

            drawEqNumChart1();
            drawEqFaultChart1();

            findTypeId();
            fingthing();
            $scope.search.orderBy = "hasSensor";
            fac.getPageResult("/ovu-pcos/pcos/equipment/queryByPage.do", $scope.search, function(data) {
                $scope.pageModel = data;
                $rootScope.$broadcast('pageModelLoaded', data);
            });
        };




        function ergodicTress(data, text, addArray) {
            var array = [];
            if (!data || !angular.isArray(data)) {
                return [];
            }
            data.forEach(function(eqType) {
                if (eqType.nodes) {
                    if (eqType.isAddNodes == true) {
                        delete eqType.nodes;
                    } else {
                        eqType.nodes = ergodicTress(eqType.nodes, text, addArray);
                    }
                } else {
                    if (eqType.isAddNodes == true) {
                        delete eqType.nodes;
                    }
                    if (eqType.text === text) {
                        eqType.nodes = addArray;
                        eqType.isAddNodes = true;
                    }
                }
                array.push(eqType);
            });
            return array
        }

        $scope.selectNode = function(node) {
            $scope.$broadcast('buildingClick', { floorId: node.floorId, floorName: node.floorName });

            if ($scope.curNode != node) {
                $scope.curNode && $scope.curNode.state && ($scope.curNode.state.selected = false);
            }
            node.state = node.state || {};
            node.state.selected = !node.state.selected;
            if (node.type && (node.type == "root" || node.type == "floor" || node.type == "area")) {
                $rootScope.$broadcast('eqTreeItemClick', node);
                if (node.state.selected) {
                    $scope.curNode = node;
                } else {
                    delete $scope.curNode;
                }
            } else if (node.type && (node.type == "map_floor")) {
                $rootScope.$broadcast('eqTreeMapClick', node);
                if (node.state.selected) {
                    $scope.curNode = node;
                } else {
                    delete $scope.curNode;
                }
            } else if (node.is_equipNode || node.is_equip || node.is_equipRoot) {
                if (node.state.selected) {
                    $scope.curNode = node;
                } else {
                    delete $scope.curNode;
                }
            } else {
                if (node.state.selected) {

                    if (node.text === '体验馆') {
                        if ($scope.radioModel == 'BIM-mode' || $scope.radioModel == '2D/3D-mode') {
                            $scope.$watch('floorTree', function(newV, oldV) {
                                var treeData = $scope.houseTree;
                                $scope.houseTree = ergodicTress(treeData, node.text, newV)
                            });
                        }
                    } else {
                        var treeData = $scope.houseTree;
                        $scope.houseTree = ergodicTress(treeData, '', []);

                    }

                    $scope.curNode = node;
                    // $scope.search.stageId = node.stageId;
                    // $scope.search.floorId = node.floorId;
                    if(node.level == 1){
                        $scope.search.floorId && delete $scope.search.floorId;
                        $scope.search.floorName && delete $scope.search.floorName;
                        $scope.search.stageId = node.id;
                    }else if (node.level == "2") {
                        $scope.search.stageId = node.parentId;
                        $scope.search.floorId = node.id;
                        $scope.search.floorName=node.text;
                    }else{
                        delete $scope.curNode;
                        delete $scope.search.stageId;
                        delete $scope.search.floorId;
                    }
                    $scope.find();
                }
            }


        }
        $scope.selectEquipType = function(node) {
            $scope.search.equipTypeId = node.id;
            $scope.search.typeName = (node.ptexts ? node.ptexts + " > " : "") + node.text;
            $scope.search.typeHover = $scope.search.typeFocus = false;
        }

        $scope.clearEquipType = function() {
            delete $scope.search.equipTypeId;
            delete $scope.search.typeName;
        }

        //查看更多
        $scope.showMore = function(equipment) {
            equipment = angular.merge({}, equipment);
            var data = {
                pageIndex: 0,
                pageSize: 10,
                equipmentId: equipment.id
            };
            $uibModal.open({
                animation: false,
                templateUrl: '/view/equipment/modal.moreDetail.html',
                controller: 'equipMonitor.MoreDetailCtrl',
                size: 'lg',
                resolve: {
                    curEquip: function() {
                        return equipment;
                    }
                }
            });

        };
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
        //查看日志
        $scope.showLog = function() {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/equipment/modal.equipmentLog.html',
                controller: 'equipmentLogCtrl'
            });
        };

    }]);

    app.controller('equipMonitor.MoreDetailCtrl', ['$scope', '$rootScope', '$http', 'fac', 'curEquip', function($scope, $rootScope, $http, fac, curEquip) {
        $scope.pageModel = {};
        $scope.search = {};
        $scope.processImgUrl = $rootScope.processImgUrl;
        $scope.showPhoto = $rootScope.showPhoto;

        $scope.find = function(pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || 1,
                pageSize: $scope.pageModel.pageSize || 10,
                equipmentId: curEquip.id
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;

            fac.getPageResult('/ovu-pcos/pcos/equipment/querySubListByPage.do', $scope.search, function(pageModel) {
                $scope.pageModel = pageModel;
                $scope.curEquip = angular.merge({}, curEquip, { params: pageModel.data });
            });
        };
        $scope.find();
    }]);

})(angular, document);
