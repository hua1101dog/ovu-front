(function(angular, doc) {
    // 避免重复加载 尤其是使用component一定不能重复加载
    var invokes = angular.module('angularApp')
        ._invokeQueue
        .map(function(v) {
            return v[2][0];
        });

    var loaded = invokes.some(function(v) {
        return v === 'eqMonitorBim';
    });

    if (loaded) {
        return;
    }

    var app = angular.module('angularApp');

    app.component('eqMonitorBim', {
        templateUrl: '../view/equipment/monitoring/detail/BIM/view.html',
        bindings: {},
        controller: 'eqMonitorBimCtrl',
        controllerAs: 'vm'
    });

    // BIM 控制器
    app.controller('eqMonitorBimCtrl', ['$scope', '$http', '$rootScope', '$window', '$interval', 'fac', 'chartsService',
        function($scope, $http, $rootScope, $window, $interval, fac, charts) {
            var res1 = [];
            var _storeys; //空间列表
            var bim_projectName = "创意天地-体验馆";

            var projId = "c7c6e01e-c1fa-4dd7-a986-569ab5d63425";

            var _eqNumChart; //设备数量图表
            var _eqFaultChart; //设备故障图表
            var parkId = "af98a32c9b4d490297cadc2d85faf797";
            var _selectedEq; //已选择的设备
            var _selectedEqType; //已选择的某个设备类型
            var _eventInterval; //报警动画的值
            var _eventEqBimId; //事件设备构件ID

            var _elementRGBA = [0.8, 0.6, 0.0, 1.0]; //设备定位选中的颜色
            var _eventRGBA = [1.0, 0.0, 0.0, 1.0]; //事件设备定位选中的颜色       

            var _eqTypes = [];
            var _eqDatas = [];

            var _initPosition; //相机初始位置
            var _initTarget; //相机初始目标       

            var _areaShowFlag = false; //区域显示标志
            var _coveringHideFlag = false; //二楼天花版隐藏标志
            var _selectedArea; //已选择的区域

            var _areaPosition = {
                "x": 9598.50627013739,
                "y": -9171.581856450859,
                "z": 59806.71142485092
            }; //查看区域初始相机位置
            var _areaTarget = {
                "x": 3296.6468032172493,
                "y": -3923.50266231428,
                "z": -1500.6909583266652
            }; //查看区域初始相机目标        

            var _floorTwoTexts = ["72bc31e8-5a44-408d-9e8a-ce7cc4e93748-000d4615",
                "72bc31e8-5a44-408d-9e8a-ce7cc4e93748-000d4630",
                "72bc31e8-5a44-408d-9e8a-ce7cc4e93748-000d4652", "72bc31e8-5a44-408d-9e8a-ce7cc4e93748-000d4664", ,
                "72bc31e8-5a44-408d-9e8a-ce7cc4e93748-000d468e", "72bc31e8-5a44-408d-9e8a-ce7cc4e93748-000d460a",
                "72bc31e8-5a44-408d-9e8a-ce7cc4e93748-000d458a", "72bc31e8-5a44-408d-9e8a-ce7cc4e93748-000d45ba"
            ];

            $scope.config = {
                edit: false,
                sort: false
            };

            var bimEngine = new BIMVIZ.RenderEngine({
                projectId: projId,
                renderDomId: 'viewport',
                ip: "116.211.5.54",
                //ip: "192.168.0.11",
                port: 7005,
                key: 'bc29bc21-4544-41d2-b22e-4992e3725180',
                resizeMode: 'fullpage',
                resourcePath: '/res/js/bimViz/sdk/viz/data/',
                selectSettings: {
                    grayScene: false,
                    cameraMove: true
                },
    	        logo:false
            });

            //var msgControl = new BIMVIZ.UI.DefaultMessageControl(bimEngine, 'messages');
            try {
                bimEngine.start();
            } catch (e) {
                console.log('BIM 服务器异常');
                console.log(e);
            }



            bimEngine.addListener(BIMVIZ.EVENT.OnLoadProgressStep, function(evt) {
                var data = evt.args;
                if (data.current == data.total) {
                    _initPosition = bimEngine.getCameraPosition();
                    _initTarget = bimEngine.getCameraTarget();
                    // $rootScope.bimTimeFn();
                }
            });

            function getFloorNodes() {
                var floorNodes = [];

                //根节点
                var rootNode = {
                    id: 0,
                    pid: "",
                    text: bim_projectName,
                    spread: true,
                    nodes: [],
                    type: "root"
                };

                //遍历楼层
                _storeys.forEach(function(floor) {
                    //去掉夹层
                    if (floor.Id == "2") {
                        return;
                    }

                    var floorNode = {
                        id: floor.Id,
                        pid: "0",
                        text: floor.Name,
                        nodes: [],
                        type: "floor"
                    };

                    //遍历楼层内的区域
                    var groupList = floor.GroupList;
                    groupList.forEach(function(group) {
                		
      					if (group.Name == "IfcSlab") {
                            var areas = group.ElementNodes;
                            areas.forEach(function(area) {
                                var areaNode = {
                                    id: area.GlobalId,
                                    text: area.Name.split(":")[1],
                                    pid: floor.Id,
                                    floorId: floor.Id,
                                    type: "area",
                                    is_equip: true
                                };

                                floorNode.nodes.push(areaNode);
                                //floorNodes.push(areaNode);
                            });
                        }
                    });

                    rootNode.nodes.push(floorNode);
                    //floorNodes.push(floorNode);

                });

                floorNodes.push(rootNode);
                //debugger;
                return floorNodes;
            }


            function showFloor(type, floorId) {
                if (type == 'all') {
                    _storeys.forEach(function(floor) {
                        bimEngine.showBuildingStorey(floor.Id, true);
                    });
                } else if (type == 'single') {
                    if (floorId == 3 && _coveringHideFlag) {
                        return;
                    }
                    _storeys.forEach(function(floor) {
                        if (floorId == floor.Id) {
                            bimEngine.showBuildingStorey(floor.Id, true);
                        } else {
                            bimEngine.showBuildingStorey(floor.Id, false);
                        }

                    });

                } else {
                    console.log("Error:showFloor type not defined!");
                }
            }

            //eqTreeItemClick
            $scope.$on('eqTreeItemClick', function(e, data) {
                // debugger;
                console.log('设备分类监听事件');
                console.log(e);
                console.log(data);
                $scope.selectTreeNode(data);

            });

            //加载树状菜单
            $scope.$on('eqTypeItemClick', function(e, data) {
                // debugger;
                console.log('设备分类监听事件');
                console.log(e);
                console.log(data);
                $scope.selectTreeNode(data);
            });

            $scope.$on('eventItemClick', function(e, data) {
                console.log('事件列表监听事件');
                console.log(e);
                console.log(data);
                $scope.selectThing(data);
            });

            bimEngine.addListener(BIMVIZ.EVENT.ProjectOverviewLoaded, function(evt) {
                var project = evt.args;
                _storeys = project.spaces;

                var bodyMsg = getFloorNodes();
                //debugger;
                $scope.budingTree = bodyMsg;
                // 传递给root
                // $rootScope.budingTree = bodyMsg;
                $scope.$emit('bimFloorLoaded', bodyMsg);
            });

            //window resize 事件 重新渲染
            angular.element($window).on('resize', function() {
                $scope.$broadcast("onWindowResize");
            });

            $scope.reDraw = function() {
                $scope.$broadcast('reDraw');
            }







            $scope.selectThing = function(row) {
                showFloor('all');
                //var eventList = $scope.eventList;
                //debugger;
                clearSelectedEq();
                clearSelectedEqType();

                flyToEq(row.revit_no);
                showAlarm(row.bim_id);
                
                fac.showVideo(row.equipment_id);
            }

            function flyToEq(eqCode) {
                //var cameraBookmarkManager = bimEngine.getCameraBookmarkManager();
                //cameraBookmarkManager.getList(function(success, list) {
                	//debugger;
                    //if (success && list.length > 0) {
                    //    list.forEach(function(cameraBookmark) {
                    //        debugger;
                    //        if (cameraBookmark.description == eqCode) {
                    //            bimEngine.flyFromTo(cameraBookmark.position, cameraBookmark
                    //                .target);
                    //        }
                    //    });
                    //}
                	//bimEngine.flyFromTo(new THREE.Vector3 (-11038.327376312474, -9913.770799138987, 3956.79709359928),new THREE.Vector3 (-2750.094943044623, -8775.264238283125, 1202.872276690983));
                //});
				flyFromTo(eqCode);
            }

            function flyFromTo(_eventEqBimId){
                //7ee2d2b1-3e05-43ef-bb1c-4da641ce5139-000d8bc9
            	if(_eventEqBimId=="1500021499266"){
            		bimEngine.flyFromTo(new THREE.Vector3 (6086.533332079051,-2535.811770934796,2164.5592316674565), new THREE.Vector3(-1307.1241579999987,2526.6190792625002,-300.8290591625));
             	}
              
                //7ee2d2b1-3e05-43ef-bb1c-4da641ce5139-000d8bca
            	if(_eventEqBimId=="1500021499267"){
            		bimEngine.flyFromTo(new THREE.Vector3 (-6989.671144451385,-5042.708418524009,-1185.7193776136837),new THREE.Vector3(-1715.4991579999987,2606.3778683250002,-1402.75728181875));
             	}
              
                //7ee2d2b1-3e05-43ef-bb1c-4da641ce5139-000d8c65
            	if(_eventEqBimId=="1500021499268"){
            		bimEngine.flyFromTo(new THREE.Vector3 (4491.075796800393,-3989.9401469811583,3331.2815187010074),new THREE.Vector3 (-384.6202517499987,2471.3847042625002,-1235.05025056875));
             	}
              
                //7ee2d2b1-3e05-43ef-bb1c-4da641ce5139-000d8bf1
            	if(_eventEqBimId=="1500021499269"){
            		bimEngine.flyFromTo(new THREE.Vector3 (6981.810171800392,-3854.9460063561573,3160.0266358885065),new THREE.Vector3 (2106.1141232500013,2606.3788448875002,-1406.30513338125));
             	}
              
                //7ee2d2b1-3e05-43ef-bb1c-4da641ce5139-000d8bf0
            	if(_eventEqBimId=="1500021499270"){
            		bimEngine.flyFromTo(new THREE.Vector3 (7368.571890550391,-4108.234092293656,4318.288842919756),new THREE.Vector3 (2492.8758420000013,2353.0907589500002,-248.04292635000002));
             	}
              
                //7ee2d2b1-3e05-43ef-bb1c-4da641ce5139-000d8cef
            	if(_eventEqBimId=="1500021499271"){
            		bimEngine.flyFromTo(new THREE.Vector3 (8315.728140550389,-3990.7360454186546,3364.0593507322546),new THREE.Vector3 (3440.0320920000013,2470.5888058250002,-1202.2724185375));
             	}     
            	
            	if(_eventEqBimId=="1500021499272"){
            		bimEngine.flyFromTo(new THREE.Vector3 (-11038.327376312474, -9913.770799138987, 3956.79709359928),new THREE.Vector3 (-2750.094943044623, -8775.264238283125, 1202.872276690983));
             	}  				
            }

            function showAlarm(eqBimId) {
                //var eqData = getEqDataByEqCode(eqCode);
                var flag = true;
                if (_eventInterval) {
                    window.clearInterval(_eventInterval);
                }
                if (_eventEqBimId) {
                    bimEngine.resetElementRGBA(_eventEqBimId);
                }
                _eventEqBimId = eqBimId;
                _eventInterval = window.setInterval(function() {
                    if (flag) {
                        bimEngine.changeElementRGBA(_eventEqBimId, _eventRGBA);
                    } else {
                        bimEngine.resetElementRGBA(_eventEqBimId);
                    }

                    flag = !flag;

                }, 500);
            }

            function closeAlarm() {
                if (_eventInterval) {
                    window.clearInterval(_eventInterval);
                }
                if (_eventEqBimId) {
                    bimEngine.resetElementRGBA(_eventEqBimId);
                }

            }

            function getEqDataByEqCode(eqCode) {
                var eqData;
                _eqDatas.forEach(function(item) {
                    if (item.eqCode == eqCode) {
                        eqData = item;
                        return;
                    }
                });
                return eqData;
            }

            $scope.selectTreeNode = function(node) {
                debugger;
                closeAlarm();

                clearSelectedEq();

                clearSelectedEqType();

                if (node.type) {
                    if (node.type == "root") {
                        if (_selectedArea) {
                            bimEngine.resetElementRGBA(_selectedArea);
                        }

                        showFloor('all');
                        bimEngine.flyFromTo(_initPosition, _initTarget);

                        _areaShowFlag = false;
                    }

                    if (node.type == "floor") {

                        if (_selectedArea) {
                            bimEngine.resetElementRGBA(_selectedArea);
                        }

                        _coveringHideFlag = false;
                        showFloor('single', node.id);

                        hideCovering();

                        //显示二楼的区域说明文字
                        if (node.id == 3) {
                            _floorTwoTexts.forEach(function(item) {
                                bimEngine.setElementVisible(item, true);
                            });
                        }

                        bimEngine.flyFromTo(_initPosition, _initTarget);

                        _areaShowFlag = false;

                    }

                    if (node.type == "area") {
                        //debugger;
                        if (_selectedArea) {
                            bimEngine.resetElementRGBA(_selectedArea);
                        }

                        _selectedArea = node.id;

                        showFloor('single', node.floorId);

                        //显示二楼的区域说明文字
                        if (node.floorId == 3) {
                            hideCovering();

                            _floorTwoTexts.forEach(function(item) {
                                bimEngine.setElementVisible(item, true);
                            });
                        }

                        bimEngine.changeElementRGBA(node.id, _elementRGBA);

                        if (_areaShowFlag) {
                            //debugger;
                            bimEngine.flyToElement(node.id);
                        } else {
                            bimEngine.flyFromTo(_areaPosition, _areaTarget);
                            _areaShowFlag = true;
                        }

                    }


                } else if (node.is_equip) {
                    showFloor('all');

                    console.info(node);
                    debugger;
                    bimEngine.changeElementRGBA(node.bim_id, _elementRGBA);

                    _selectedEq = node.bim_id;

                    //跳转到设备相机书签
                    flyToEq(node.revit_no);

                    //showEqDetailInfo(item.code);     
                    if (node.pname == "摄像头") {
                        fac.showVedio();
                    }


                } else {

                    showFloor('all');

                }


            }

            //清除已选择的设备
            function clearSelectedEq() {
                if (_selectedEq) {
                    bimEngine.resetElementRGBA(_selectedEq);
                }
            }

            //清除已选择的设备类型下的所有设备
            function clearSelectedEqType() {
                if (_selectedEqType) {
                    _eqDatas.forEach(function(eqData) {
                        if (eqData.eqType == _selectedEqType) {
                            bimEngine.resetElementRGBA(eqData.eqBimId);
                        }
                    });
                }
            }

            // findTypeId();
            // findThings();

            function hideCovering() {
                if (_coveringHideFlag) {
                    return;
                }

                bimEngine.searchElementsByText("IfcCovering", function(result, text) {
                    if (result.success && result.total > 0) {
                        result.list.forEach(function(item) {
                            bimEngine.setElementVisible(item.Element.GlobalId, false);
                        });
                    }
                });

                _coveringHideFlag = true;
            }

        }
    ]);

    app.factory('chartsService', function() {
        return {
            initPie: function() {
                return {
                    title: {
                        text: '设备数量分类统计',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} ({d}%)"
                    },
                    calculable: false,
                    animation: true,
                    animationDuration: 2000,
                    series: [{
                        name: '设备数量',
                        type: 'pie',
                        radius: '50%',
                        center: ['50%', '70%'],
                        data: [] //seriesData
                    }]
                }
            },
            getPieOptionByData: function(option1) {
                var pieOption = this.initPie();
                pieOption.series[0].data = option1;
                return pieOption;
            },
            initBar: function() {
                return {
                    title: {
                        text: '设备故障分类统计',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: [] //legendData
                    },
                    xAxis: [{
                        type: 'category',
                        data: [], //xAxisData
                    }],
                    yAxis: [{
                        type: 'value'
                    }],
                    series: [{
                        name: '故障次数',
                        type: 'bar',
                        data: [], //seriesData,

                        markPoint: {
                            data: [{
                                type: 'max',
                                name: '最大值'
                            }, {
                                type: 'min',
                                name: '最小值'
                            }],

                            animation: true,
                            animationDuration: 9000,
                        }
                    }]
                }
            },
            getBarOptionByData: function(legendData, xAxisData, seriesData) {
                var barOption = this.initBar();
                barOption.legend.data = legendData;
                barOption.xAxis[0].data = xAxisData;
                barOption.series[0].data = seriesData;
                return barOption;
            }
        }
    });

})(angular, document);