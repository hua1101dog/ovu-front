(function (angular, document) {
    // document.title = "OVU-设备监测";
    var app = angular.module("angularApp");

    app.controller('equipMonitorCtl', ['$scope', '$rootScope', '$interval', '$http', '$filter', '$uibModal', 'fac', function ($scope, $rootScope, $interval, $http, $filter, $uibModal, fac) {

        // 项目id
        var parkId = "955e55e218fa43e3baf3cb5e90be178e";

        //var parkId = $scope.$parent.projectId;

        if (parkId === undefined) {
            parkId = '';
        }
        console.log('parkId.................');
        console.log(parkId);
        // 设备监控类型 id
        console.log($scope.$parent.equipmentType_id);
        var equipmentType_id = $scope.$parent.equipmentType_id;

        // 默认 列表模式 
        // $scope.radioModel = 'list-mode';

        // 节能模式
        $scope.radioModel = 'energy-save-mode';

        // websoket 推送数据
        function send_echo() {
            //debugger;
            echo_websocket = new SockJS("/ovu-pcos/pcos/sayhello"); //初始化 websocket
            echo_websocket.onopen = function () {
                console.log('Info: connection opened.');
            };
            echo_websocket.onmessage = function (event) {
                console.log('Received: ' + event.data); //处理服务端返回消息
                $scope.$apply(
                    function () {
                        var data = JSON.parse(event.data);
                        console.log(data);
                        if (data.equipmentType_id == '') {
                            $rootScope.$broadcast('equmentThingClick', data);
                            fingthing();
                        }
                    }
                )
            };
            echo_websocket.onclose = function (event) {
                console.log('Info: connection closed.');
                console.log(event);
            };
        }
        send_echo();

        //事件列表
        $scope.eventList = null;
        //简化设备类型树
        //$scope.simpleEquipTypeTree = null;

        // 事件查询
        function fingthing() {
            $http.get("/ovu-pcos/pcos/equipment/listexceptions.do?parkId=" + parkId + "&equipmentType_id=")
                .success(function(results) {
                    //  $scope.eventList = results;
                    $scope.eventList = results;
                })
                .error(function() {
                    alert("请求事件出错");
                });
        }
        fingthing();


        function findTypeId() {
            if (equipmentType_id === undefined) {
                equipmentType_id = '';
            }
            debugger;
            $http.get("/ovu-pcos/pcos/equipment/list2dequipment.do?parkId=" + parkId + "&equipmentType_id=" + equipmentType_id)
                .success(function (results) {
                    console.log('results');
                    console.log(results);
                    debugger;
                    $scope.simpleEquipTypeTree = tree2list(results[0].nodes);
                    $rootScope.equipdata = results;

                    getMessage();

                }).error(function () {
                    alert("请求设备分类数据出错")
                });
        }


        function getMessage(serid) {
            $http.get("/ovu-pcos/pcos/sensor/get.do?id="+serid)
                .success(function (results) {
                    debugger;
                    $scope.chuanganqi = results;
                }).error(function () {
                    alert("请求设备分类数据出错")
                });

        }


        function tree2list(tree) {

            function getLeafs(obj) {
                if (!angular.isArray(obj.nodes)) {
                    return [];
                }
                var currArr = [obj],
                    list = [];

                while (currArr.length) {
                    var obj1 = currArr.shift();
                    obj1.nodes.forEach(function (v) {
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
            var arr = tree.map(function (v) {
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

        findTypeId();

        $scope.eqList = [{
            workunit_name: '减压阀1',
            CREATE_DATE: 'dasf',
            BimId: '7ee2d2b1-3e05-43ef-bb1c-4da641ce5139-000d8bca'
        }, {
            workunit_name: '减压阀2',
            CREATE_DATE: 'dasf',
            BimId: '7ee2d2b1-3e05-43ef-bb1c-4da641ce5139-000d8bc9'
        }, {
            workunit_name: '减压阀3',
            CREATE_DATE: 'dasf',
            BimId: '7ee2d2b1-3e05-43ef-bb1c-4da641ce5139-000d8bf1'
        }, {
            workunit_name: '减压阀4',
            CREATE_DATE: 'dasf',
            BimId: '7ee2d2b1-3e05-43ef-bb1c-4da641ce5139-000d8bf0'
        }, {
            workunit_name: '温度计1',
            CREATE_DATE: 'dasf',
            BimId: '7ee2d2b1-3e05-43ef-bb1c-4da641ce5139-000d8c65'
        }, {
            workunit_name: '温度计2',
            CREATE_DATE: 'dasf',
            BimId: '7ee2d2b1-3e05-43ef-bb1c-4da641ce5139-000d8bef'
        }]



        // 配置所有的组件里的 tree-view 都是非编辑状态 
        $rootScope.config = {
            edit: false
        };


        //事件列表
        $scope.eventList = null;
        //简化设备类型树
        $scope.simpleEquipTypeTree = null;





       
        $scope.equmentThingClick = function (model) {
            console.log('donging');

            $rootScope.$broadcast('equmentThingClick', model);

             debugger;
            if(!model.sensor_ids){
                return;
            }

            $http.get("/ovu-pcos/pcos/sensor/get.do?id=" + model.sensor_ids.split(',')[0]).success(function (resp) {
                if (resp.success) {
                    $rootScope.equipment = $scope.item = resp.data;

                } else {
                    alert(resp.error);
                }
            })
        }

        $scope.equmentClick = function (model) {
            console.log('dong');
            $rootScope.$broadcast('equmentClick', model);
            // $scope.showEquipDetail(model.id);
            debugger;
            if(!model.sensor_ids){
                return;
            }
            $http.get("/ovu-pcos/pcos/sensor/get.do?id=" + model.sensor_ids.split(',')[0]).success(function (resp) {
                if (resp.success) {
                    $rootScope.equipment = $scope.item = resp.data;

                } else {
                    alert(resp.error);
                }
            });
            
            //$scope.status3.open = true;
        };

        // bim 加载完成 获取楼层数据
        $rootScope.$on('bimFloorLoaded', function (e, data) {
            console.log('bim 楼层数据');
            console.log(data);
            $scope.floorTree = data;
        });


        //图表切换

        //集团版,设置好项目后更新 期栋树
        $scope.refresh = function () {
            var p1 = fac.getHouseTree($scope, $scope.search.parkId);

            var p = fac.setEquipTypeTree($scope, $scope.search.parkId);
            $scope.find();
        }

        app.modulePromiss.then(function (res) {
            // debugger;
            $scope.search = {
                isGroup: fac.isGroupVersion()
            };
            if (app.park) {
                $scope.search.parkId = app.park.ID;
                $scope.search.PARK_NAME = app.park.PARK_NAME;
                fac.getHouseTree($scope, $scope.search.parkId);
            }
            fac.setEquipTypeTree($scope);
            if ($scope.search.isGroup) {
                // $scope.findFirst();
            } else {
                $scope.search.equipmentType_id = equipmentType_id;
                // $scope.find();
            }

            //  自动选中项目
            $http.get('/ovu-base/system/park/tree.do')
                  
                .success(function (res) {
                    console.log('parkTree..................................');
                    console.log(res);
                    var leafArr = [];
                    res.forEach(function (v) {
                        leafArr = leafArr.concat(getLeafs(v));
                    });
                    // console.log(leafArr);
                    console.log('有木有？？？？？？？？？？？？？？？');
                    leafArr.some(function (v) {
                        if (v.id === $rootScope.projectId) {
                            console.log(v.ptexts + v.text);
                            var str = v.ptexts + '>' + v.text;
                            $scope.search.PARK_NAME = str;
                        }
                    })
                });

            function getLeafs(obj) {
                if (!angular.isArray(obj.nodes)) {
                    return [];
                }
                var currArr = [obj],
                    list = [];

                while (currArr.length) {
                    var obj1 = currArr.shift();
                    obj1.nodes.forEach(function (v) {
                        // 是叶节点就加入list
                        if (v.PARK_TYPE === '1') {
                            list.push(v);
                        }
                        if (angular.isArray(v.nodes) && v.nodes.length) {
                            currArr.push(v);
                        }
                    })
                }
                return list;
            }
        });


        $scope.selectNode = function (node) {

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
                            $scope.$watch('floorTree', function (newV, oldV) {
                                var treeData = $scope.houseTree;
                                $scope.houseTree = ergodicTress(treeData, node.text, newV)
                            });
                        }
                    } else {
                        var treeData = $scope.houseTree;
                        //debugger;
                        //if($scope.radioModel === 'list-mode' || $scope.radioModel === 'icon-mode'){
                        $scope.houseTree = ergodicTress(treeData, '', []);
                        //}
                    }

                    $scope.curNode = node;
                    $scope.search.stageId = node.stageId;
                    $scope.search.floorId = node.floorId;
                    $scope.find();
                } else {
                    delete $scope.curNode;
                    delete $scope.search.stageId;
                    delete $scope.search.floorId;
                }
            }


        }
        $scope.selectEquipType = function (node) {
            $scope.search.equipTypeId = node.id;
            $scope.search.typeName = (node.ptexts ? node.ptexts + " > " : "") + node.text;
            $scope.search.typeHover = $scope.search.typeFocus = false;
        }

        $scope.clearEquipType = function () {
            delete $scope.search.equipTypeId;
            delete $scope.search.typeName;
        }



    }]);

    // angular.bootstrap(document.getElementById("angularId"), ['angularApp']);
})(angular, document);