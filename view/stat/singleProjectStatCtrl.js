(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('proSingle', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-报表统计";
        $scope.search = $scope.param = {
            dbName:app.envName,
            domainId:app.domain.id
        };

        var map;
        // 导航切换
        $scope.index = 2;
        work();
        $scope.tabChange = function (index) {
            index && ($scope.index = index);
            if ($scope.index == 2) {

                if( moment().startOf('month').format('YYYY-MM-DD') ==moment().format('YYYY-MM-DD')){
                    //如果今天是本月的第一天，则范围为上个月的第一天到上个月的最后一天
                    $scope.search.startTime= moment().subtract('month', 1).format('YYYY-MM-DD') + '-01' // 上个月的第一天.
                    $scope.search.endTime=moment( $scope.search.startTime).subtract('month', -1).add('days', -1).format('YYYY-MM-DD');  //上个月的最后一天
                }else{
                    $scope.search.startTime=moment().startOf('month').format('YYYY-MM-DD') // 这月的第一天.
                    $scope.search.endTime=moment().subtract(1, 'day').format('YYYY-MM-DD');  //昨天
                }

                work();
            } else if ($scope.index == 3) {
                person();
            } else if ($scope.index == 4) {
                if ($scope.dept.parkId) {
                    // $scope.search.parkId = $scope.dept.parkId;
                    equip();
                } else {
                    alert('请选择跟项目关联的部门');
                    var intact = document.getElementById('intact');
                    intact.innerHTML = '<div style="text-align:  center;">暂无统计结果</div>';
                    var equipment = document.getElementById('equipment');
                    equipment.innerHTML = '<div style="text-align:  center;">暂无统计结果</div>';
                    var fault = document.getElementById('fault');
                    fault.innerHTML = '<div style="text-align:  center;">暂无统计结果</div>';
                    var workorder = document.getElementById('workorder');
                    workorder.innerHTML = '<div style="text-align:  center;">暂无统计结果</div>';
                    $scope.equipData={};
                }

            }
        };


        app.modulePromiss.then(function () {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    $scope.search.deptId = deptId;
                    $scope.tabChange();
                    $scope.deptTree = $.extend(true,[],[fac.getNodeById(app.deptTree,deptId)])
                }
            })
        })
        // 人员分析统计
        $scope.stat = function () {
            if(!$rootScope.dept ||!$rootScope.dept.id){
                alert("请选择部门！");
                return false;
            }
            var param = {
                // parkId: $scope.param.parkId,
                startTime: $scope.search.startTimes,
                endTime: $scope.search.endTimes,
                deptId: $scope.search.deptId
            };
            statSearch(param);
            //人点击查询
            //更新有效使用人
            $http.post("/ovu-pcos/pcos/person/statistics/getEffectivePersonList", {
                deptId: param.deptId,
                dateFrom : $scope.search.startTimes?$scope.search.startTimes:$scope.search.startTime,
                dateTo : $scope.search.endTimes?$scope.search.endTimes:$scope.search.endTime,
                staticDomainId : '14bdbea59d2c4b0a96594fb94382901e'
            }, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $scope.EffectiveUser = resp.data || [];
                    $scope.person = $scope.EffectiveUser[0].effectivePersonList
                 
                }

            });
        }
        // 工作分析统计
        $scope.workStat = function () {
            if(!$rootScope.dept ||!$rootScope.dept.id){
                alert("请选择部门！");
                return false;
            }
            var param = {
                deptId: $scope.search.deptId,
                startTime: $scope.search.startTime,
                endTime: $scope.search.endTime
            };
            workSearch(param)


        };
        // 人员分析
        function person() {
            //统计
            //var mapHeight = $RIGHT_COL.outerHeight()-$(".page-title").outerHeight()-$("#personList").outerHeight();
            $("#mapDiv").css("height", "300px");

            var param = {
                pageSize: 10000,
                isDirect: true,
                pageIndex: 0,
                deptId: $scope.search.deptId,
            };

            $scope.setDept = function (search,node) {
                $scope.deptTree.forEach(function(no){
                    no.state = no.state || {};
                    no.state.selected = false;
                    if(no.nodes){
                        uncheck(no.nodes)

                    }
                    function uncheck(v){
                        v.forEach(function(n){
                            n.state = n.state || {};
                            n.state.selected = false;
                            if(n.nodes){
                                uncheck(n.nodes)
                            }
                        })

                    }
                })

                node.state.selected = !node.state.selected;
                if (node.state.selected) {
                    // param.deptId = node.id;
                    // $scope.param.deptId = node.id;
                    $scope.getDirectEmployees();
                    statSearch($scope.param);
                    getPersonAnalysis(param.deptId)
                    $scope.person = [];
                    if (node.nodes) {
                        $scope.deptList = node.nodes
                    } else {
                        $scope.deptList = node
                    }
                    //选择顶部部门
                    $http.post("/ovu-pcos/pcos/person/statistics/getEffectivePersonList", {
                        deptId: param.deptId,
                        dateFrom : $scope.search.startTimes?$scope.search.startTimes:$scope.search.startTime,
                        dateTo : $scope.search.endTimes?$scope.search.endTimes:$scope.search.endTime,
                        staticDomainId : '14bdbea59d2c4b0a96594fb94382901e'
                    }, fac.postConfig).success(function (resp) {
                        if (resp.code == 0) {
                            $scope.EffectiveUser = resp.data || [];
                            if($scope.EffectiveUser && $scope.EffectiveUser[0] && $scope.EffectiveUser[0].effectivePersonList){
                                $scope.person = $scope.EffectiveUser[0].effectivePersonList
                            }
                         
                        } 

                    });

                }
            }
            //获取部门下直署员工
            $scope.getDirectEmployees = function () {
                $http.post("/ovu-pcos/pcos/arrange/signStatistics/realTimeSignStat", param, fac.postConfig).success(function (data) {
                    $scope.employees = data.data;
                    if ($scope.employees && $scope.employees.length) {
                        loadPostion($scope.employees);
                    }
                })
            }

            // function loadPerson(data) {
                
            //     data[0].state = {
            //         selected: true
            //     }
            //     param.deptId = data[0].id;
            //     $scope.getDirectEmployees();
            //     statSearch($scope.param);
            //     getPersonAnalysis(param.deptId)
            //     if (data[0].nodes) {
            //         $scope.deptList = data[0].nodes
            //     } else {
            //         $scope.deptList = data
            //     }
            //     $scope.deptID =  param.deptId;
            //     //加载树
            //     $http.post("/ovu-pcos/pcos/person/statistics/getEffectivePersonList", {
            //         deptId: $scope.deptID,
            //         dateFrom : $scope.search.startTimes?$scope.search.startTimes:$scope.search.startTime,
            //         dateTo : $scope.search.endTimes?$scope.search.endTimes:$scope.search.endTime,
            //         staticDomainId : '14bdbea59d2c4b0a96594fb94382901e'
            //     }, fac.postConfig).success(function (resp) {
            //         if (resp.code == 0) {
            //             $scope.EffectiveUser = resp.data || []
            //         }

            //     });

            // }
            // loadPerson($scope.deptTree)
            $scope.setDept('',$scope.deptTree[0])
            //点击左侧树
            // $scope.getPerson = function (id) {
            //     // 获取有效使用人
            //     $scope.deptID = id
            //     $http.post("/ovu-pcos/pcos/person/statistics/getEffectivePersonList", {
            //         deptId: id,
            //         dateFrom : $scope.search.startTimes?$scope.search.startTimes:$scope.search.startTime,
            //         dateTo : $scope.search.endTimes?$scope.search.endTimes:$scope.search.endTime,
            //         staticDomainId : '14bdbea59d2c4b0a96594fb94382901e'
            //     }, fac.postConfig).success(function (resp) {
            //         if (resp.code == 0) {
            //             $scope.EffectiveUser = resp.data || []
            //         }

            //     });
            // }
            // }
           
            $scope.getPerson =function (id,arr){
                $scope.person=[]
               arr.forEach(e=>{
                      if(e.deptId==id){
                        (e.effectivePersonList) && ($scope.person=e.effectivePersonList)
                      }
               })
             
            }


            $scope.setZoomAndCenter = function (person) {
                if (person.lng) {
                    map.setZoomAndCenter(18, [person.lng,person.lat]);
                }
            }

            //初始化地图,显示当前项目空间的经纬度，否则显示武汉地图
            function initMap() {
                var park = app.park || {};
                var mapConfig = {
                    resizeEnable: true,
                };
                if (park.TR_POSITION && park.BL_POSITION) {
                    mapConfig.zoom = 15;
                    var topRight = park.TR_POSITION.split(",");
                    var bomLeft = park.BL_POSITION.split(",");
                    var centerLng = (Number(topRight[0]) + Number(bomLeft[0])) / 2;
                    var centerLat = (Number(topRight[1]) + Number(bomLeft[1])) / 2;
                    mapConfig.center = [centerLng.toFixed(6), centerLat.toFixed(6)];
                    if (park.PARK_ICON) {
                        var imageLayer = new AMap.ImageLayer({
                            url: '/ovu-base/' + park.PARK_ICON,
                            bounds: new AMap.Bounds(
                                bomLeft,
                                topRight
                            ),
                            zooms: [15, 18]
                        });
                        mapConfig.layers = [
                            new AMap.TileLayer(),
                            imageLayer
                        ]
                    }
                }
                map = new AMap.Map('container', mapConfig);
            }


            function loadPostion(list) {
                var infoWindow = new AMap.InfoWindow({
                    offset: new AMap.Pixel(0, -30)
                });

                function markerClick(e) {
                    infoWindow.setContent(e.target.content);
                    infoWindow.open(map, e.target.getPosition());
                }
                 // 清除地图覆盖物
                 map = map || new AMap.Map('container', {
                    resizeEnable: true,
                    zoom: 13
                });
                map.clearMap();
                //标记图片
                var icons = [];
                for (var i = 0; i < 10; i++) {
                    var icon = new AMap.Icon({
                        image: '/res/img/mark_bs/mark_bs' + (i + 1) + '.png',
                    });
                    icons[i] = icon;
                }
                list.forEach(function (node, i) {
                    if (!isNaN(node.lng) && !isNaN(node.lat)) {
                        //var pos = fac.transform( parseFloat(node.MAP_LAT),parseFloat(node.mapLng));
                        var position = [parseFloat(node.lng), parseFloat(node.lat)];
                        var marker = new AMap.Marker({
                            map: map,
                            icon: icons[i % 10],
                            position: position,
                            offset: new AMap.Pixel(-12, -36)
                        })
                        marker.content = node.name + "：" + new Date(node.positionTime).format("yyyy-MM-dd hh:mm:ss");
                        marker.on('click', markerClick);
                        marker.emit('click', {
                            target: marker
                        });
                    }
                })
                map.setFitView();
            }
            initMap()
            // loadDeptTree($scope.param.parkId);
            // 获取人员编制年龄学历工龄
            function getPersonAnalysis(id) {
                $http.post("/dapingAgent/person/personAnalysis.do", {
                    deptId: id
                }, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        //人员编制分析
                        if (fac.isNotEmpty(resp.data.employeeNumList)) {
                            $scope.depName = resp.data.employeeNumList.map(function (n) {

                                return n.deptName
                            });
                            $scope.actualEmployeeNum = resp.data.employeeNumList.map(function (n) {

                                return n.actualEmployeeNum
                            });
                            $scope.employeeNum = resp.data.employeeNumList.map(function (n) {

                                return n.employeeNum
                            });


                            initCompile($scope.depName, $scope.actualEmployeeNum, $scope.employeeNum)
                        } else {
                            var compile = document.getElementById('compile');
                            compile.innerHTML = '<div style="text-align:  center;">暂无统计结果</div>'
                        }
                        //员工年龄分析
                        if (fac.isNotEmpty(resp.data.ageMap)) {
                            var ageList = [{
                                name: '20岁以下',
                                value: resp.data.ageMap['A'] || 0
                            },
                                {
                                    name: '20到30岁',
                                    value: resp.data.ageMap['B'] || 0
                                },
                                {
                                    name: '30到40岁',
                                    value: resp.data.ageMap['C'] || 0
                                },
                                {
                                    name: '40到50岁',
                                    value: resp.data.ageMap['D'] || 0
                                },
                                {
                                    name: '50岁以上',
                                    value: resp.data.ageMap['E'] || 0
                                }
                            ]
                            $scope.ageTypeStat = ageList && ageList.map(function (n) {
                                n.value = n.value
                                n.name = n.name + ' ' + n.value + ' ' + '人';
                                return n;
                            });
                            $scope.ageOrderLend = ageList && ageList.map(function (n) {
                                return n.name;
                            });

                            initAge($scope.ageTypeStat, $scope.ageOrderLend)
                        } else {
                            var age = document.getElementById('age');
                            age.innerHTML = '<div style="text-align:  center;">暂无统计结果</div>'
                        }
                        //员工学历分析
                        if (fac.isNotEmpty(resp.data.educatList)) {
                            $scope.educatTypeStat = resp.data.educatList && resp.data.educatList.map(function (n, i) {

                                n.value = n.number
                                n.name = n.educat + ' ' + n.number + ' ' + '人';
                                return n;
                            });
                            $scope.educatOrderLend = $scope.educatTypeStat && $scope.educatTypeStat.map(function (n) {
                                return n.name;
                            });

                            initSchooling($scope.educatTypeStat, $scope.educatOrderLend)
                        } else {
                            var schooling = document.getElementById('schooling');
                            schooling.innerHTML = '<div style="text-align:  center;">暂无统计结果</div>'
                        }
                        //员工入职年限分析
                        if (fac.isNotEmpty(resp.data.workingYearsMap)) {
                            var entryList = [{
                                name: '3年以下',
                                value: resp.data.workingYearsMap['A'] || 0
                            },
                                {
                                    name: '3到5年',
                                    value: resp.data.workingYearsMap['B'] || 0
                                },
                                {
                                    name: '5到10年',
                                    value: resp.data.workingYearsMap['C'] || 0
                                },
                                {
                                    name: '10到20年',
                                    value: resp.data.workingYearsMap['D'] || 0
                                },
                                {
                                    name: '20年以上',
                                    value: resp.data.workingYearsMap['E'] || 0
                                }
                            ]
                            $scope.entryTypeStat = entryList && entryList.map(function (n) {

                                n.value = n.value
                                n.name = n.name + ' ' + n.value + ' ' + '人';
                                return n;
                            });
                            $scope.entryOrderLend = entryList && entryList.map(function (n) {
                                return n.name;
                            });

                            initEntry($scope.entryTypeStat, $scope.entryOrderLend)
                        } else {
                            var entry = document.getElementById('entry');
                            entry.innerHTML = '<div style="text-align:  center;">暂无统计结果</div>'
                        }
                    }

                });
            }
            getPersonAnalysis(param.deptId)


        }

        function statSearch(param) {
            // 员工签到异常统计
            //$http.post("/dapingAgent/person/signAbnormal.do", param, fac.postConfig).success(function (resp) {
              $http.post("/ovu-pcos/pcos/person/statistics/signAbnormal", param, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    //员工签到异常统计
                    if (fac.isNotEmpty(resp.data)) {
                        $scope.personSignCount = resp.data.normal + resp.data.unnormal
                        var errList = [{
                            name: '正常',
                            value: resp.data.normal || 0
                        },
                            {
                                name: '异常',
                                value: resp.data.unnormal || 0
                            }

                        ];
                        $scope.errTypeStat = errList && errList.map(function (n) {

                            n.value = n.value
                            n.name = n.name + ' ' + n.value + ' ' + '人';
                            return n;
                        });
                        $scope.errOrderLend = errList && errList.map(function (n) {
                            return n.name;
                        });

                        initAbnormal($scope.personSignCount, $scope.errTypeStat, $scope.errOrderLend);

                    } else {
                        var abnormal = document.getElementById('abnormal');
                        abnormal.innerHTML = '<div style="text-align:  center;">暂无统计结果</div>'
                    }

                }

            });
            // 员工异动统计
            $http.post("/dapingAgent/person/personChange.do", param, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    //人员编制分析
                    if (fac.isNotEmpty(resp.data)) {

                        resp.data.forEach(function (n) {
                            if (n.changeType == '0') {
                                n.name = '入职'
                            } else if (n.changeType == '1') {
                                n.name = '调岗'
                            } else if (n.changeType == '2') {
                                n.name = '停薪留职'
                            } else {
                                n.name = '离职'
                            }
                            n.value = n.number

                        })

                        $scope.personStat = resp.data && resp.data.map(function (n) {

                            n.value = n.value
                            n.name = n.name + ' ' + n.value + ' ' + '人';
                            return n;
                        });
                        $scope.personrLend = resp.data && resp.data.map(function (n) {
                            return n.name;
                        });

                        initTransact($scope.personrLend, $scope.personStat);

                    } else {
                        var transaction = document.getElementById('transaction');
                        transaction.innerHTML = '<div style="text-align:  center;">暂无统计结果</div>'
                    }
                }

            });
            // 步数排名
            $http.post("/dapingAgent/person/staticsPedometerRank.do", param, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $scope.personReport = resp.data || []
                }
            });
        }

        //工作分析
        function work() {

            $http.post("/ovu-pcos/pcos/reportstatdept/getDeptWorkunitCnt", {
                deptId: $scope.param.deptId,

            }, fac.postConfig).success(function (resp) {
                if (angular.isArray(resp)) {
                    $scope.work = resp.data;
                } else {
                    $scope.work = resp.data;
                }

                workSearch($scope.param);

            });
        }

        function workSearch(param) {
            $scope.tab_index = 1;
            // $scope.title = '员工执行工单量TOP10';
            $http.post("/ovu-pcos/pcos/reportstatdept/getDeptWorkunitStatics.do", param, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    //工单情况统计
                    if (fac.isNotEmpty(resp.data.unitStatuCnt)) {
                        var unitStatu = [{
                            name: '待处理',
                            value: resp.data.unitStatuCnt[0].backlogWorkunitCnt|| 0
                        },
                            {
                                name: '已关闭',
                                value: resp.data.unitStatuCnt[0].finishWorkunitCnt|| 0
                            }

                        ];
                        $scope.unitStatuStat = unitStatu && unitStatu.map(function (n) {

                            n.value = n.value
                            n.name = n.name + ' ' + n.value + ' ' + '条';
                            return n;
                        });
                        $scope.unitStatuLend = unitStatu && unitStatu.map(function (n) {
                            return n.name;
                        });
                        initWorkinfo($scope.unitStatuLend, $scope.unitStatuStat);

                    } else {
                        var workinfo = document.getElementById('workinfo');
                        workinfo.innerHTML = '<div style="text-align:  center;">暂无统计结果</div>'
                    }
                    //工单状态统计
                    if (fac.isNotEmpty(resp.data.unitStatusCnt)) {
                        $scope.workOrderType = [{
                            name: '待执行',
                            value: resp.data.unitStatusCnt[0]['DZX'] || 0
                        },
                            {
                                name: '待督办',
                                value: resp.data.unitStatusCnt[0]['DDB'] || 0
                            },
                            {
                                name: '待派单',
                                value: resp.data.unitStatusCnt[0]['DPD'] || 0
                            },
                            {
                                name: '待接单',
                                value: resp.data.unitStatusCnt[0]['DJD'] || 0
                            },
                            {
                                name: '待评价',
                                value: resp.data.unitStatusCnt[0]['DPJ'] || 0
                            },
                        ]
                        $scope.workOrderTypeStat = $scope.workOrderType && $scope.workOrderType.map(function (n) {
                            n.value = n.value
                            n.name = n.name + ' ' + n.value + ' ' + '条';
                            return n;
                        });
                        $scope.workOrderLend = $scope.workOrderType && $scope.workOrderType.map(function (n) {
                            return n.name;
                        });

                        initWorktype($scope.workOrderLend, $scope.workOrderTypeStat);
                    } else {
                        var worktype = document.getElementById('worktype');
                        worktype.innerHTML = '<div style="text-align:  center;">暂无统计结果</div>'
                    }
                    if (fac.isNotEmpty(resp.data.unitTypeCnt)) {
                        //工单分类统计
                        $scope.workCategory = resp.data.unitTypeCnt && resp.data.unitTypeCnt.map(function (n) {
                            n.value = n.count
                            n.name = n.workTypeName + ' ' + n.value + ' ' + '条';
                            return n;
                        });
                        $scope.workCategoryLend = $scope.workCategory.map(function (n) {
                            return n.name;
                        });
                        initWorkunits($scope.workCategoryLend, $scope.workCategory);

                    } else {
                        var workunits = document.getElementById('workunits');
                        workunits.innerHTML = '<div style="text-align:  center;">暂无统计结果</div>'
                    }

                    if (fac.isNotEmpty(resp.data.ownerWecharCnt)) {
                        //业主工单来源统计
                        $scope.ownerOrderType = [{
                            name: 'i丽岛工单数量',
                            value: resp.data.ownerWecharCnt[0]['ownerWorkunitCnt'] || 0
                        },
                            {
                                name: '微信服务号',
                                value: resp.data.ownerWecharCnt[0]['weCharWorkunitCnt'] || 0
                            },


                        ]
                        $scope.ownerCategory = $scope.ownerOrderType && $scope.ownerOrderType.map(function (n) {
                            n.value = n.value
                            n.name = n.name + ' ' + n.value + ' ' + '条';
                            return n;
                        });
                        $scope.ownerCategoryLend = $scope.ownerOrderType.map(function (n) {
                            return n.name;
                        });

                        initOwner($scope.ownerCategoryLend, $scope.ownerCategory);


                    } else {
                        var owner = document.getElementById('owner');
                        owner.innerHTML = '<div style="text-align:  center;">暂无统计结果</div>'

                    }



                }


            });
            $http.post("/dapingAgent/api/workunit/getParkWorkunitStatics.do", param, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    //有效使用人数
                    $scope.userCategory = [{
                        name: '有效使用人数' + ' ' + resp.data.usingCount + ' ' + '人',
                        value: resp.data.usingCount
                    }]
                    $scope.userCategoryLend = $scope.userCategory.map(function (n) {
                        return n.name;
                    });
                    // initUsers($scope.userCategoryLend, $scope.userCategory);
                    if (fac.isNotEmpty(resp.data.finishPlanPercentage.percentage)) {
                        //计划工单完成率
                        $scope.jhCompletionCategory = [{
                            name: '计划工单完成率' + ' ' + resp.data.finishPlanPercentage.percentage,
                            value: resp.data.finishPlanPercentage.percentage.split('%')[0]
                        },
                            {name:'',value:100-resp.data.finishPlanPercentage.percentage.split('%')[0]}

                        ]

                        $scope.jhCompletionCategoryLend = $scope.jhCompletionCategory.map(function (n) {
                            return n.name;
                        });
                        $scope.jhCompletionCategoryLend.push();
                        initJhCompletion($scope.jhCompletionCategoryLend, $scope.jhCompletionCategory);

                    } else {
                        var jhCompletion = document.getElementById('jhCompletion');
                        jhCompletion.innerHTML = '<div style="text-align:  center;">暂无统计结果</div>'

                    }
                    if (fac.isNotEmpty(resp.data.durationUnitCnt)) {
                        //耗时统计
                        $scope.timeOrderType = [{
                            name: '6H以下',
                            value: resp.data.durationUnitCnt[0]['sixHourFinishWorkunitCnt'] || 0
                        },
                            {
                                name: '6-12H',
                                value: resp.data.durationUnitCnt[0]['twelveHourFinishWorkunitCnt'] || 0
                            },
                            {
                                name: '12-24H',
                                value: resp.data.durationUnitCnt[0]['twelveHourFinishWorkunitCnt'] || 0
                            },
                            {
                                name: '24H以上',
                                value: resp.data.durationUnitCnt[0]['moreHourFinishWorkunitCnt'] || 0
                            },

                        ]
                        $scope.timeCategory = $scope.timeOrderType && $scope.timeOrderType.map(function (n) {
                            n.value = n.value
                            n.name = n.name + ' ' + n.value + ' ' + '条';
                            return n;
                        });
                        $scope.timeCategoryLend = $scope.timeCategory.map(function (n) {
                            return n.name;
                        });
                        initTime($scope.timeCategoryLend, $scope.timeCategory);

                    } else {
                        var time = document.getElementById('time');
                        time.innerHTML = '<div style="text-align:  center;">暂无统计结果</div>'

                    }
                    //各部门工单完成率排名
                    $scope.workdFinishRate = resp.data.deptFinishWorkunitPercentage;

                    if (fac.isNotEmpty(resp.data.deptFinishWorkunitCnt)) {
                        //各部门工单统计
                        $scope.deptFinishCategoryLend = resp.data.deptFinishWorkunitCnt.map(function (n) {
                            return n.deptName;
                        });
                        //应急工单
                        $scope.emerWorkunitCnt = resp.data.deptFinishWorkunitCnt.map(function (n) {
                            return n.emerWorkunitCnt || 0
                        })
                        //计划工单
                        $scope.planWorkunitCnt = resp.data.deptFinishWorkunitCnt.map(function (n) {
                            return n.planWorkunitCnt || 0
                        })
                        //自发工单
                        $scope.onselfWorkunitCnt = resp.data.deptFinishWorkunitCnt.map(function (n) {
                            return n.onselfWorkunitCnt || 0
                        })

                        initDpworkuit($scope.deptFinishCategoryLend, $scope.emerWorkunitCnt, $scope.planWorkunitCnt, $scope.onselfWorkunitCnt);


                    } else {
                        var dpworkuit = document.getElementById('dpworkuit');
                        dpworkuit.innerHTML = '<div style="text-align:  center;">暂无统计结果</div>'

                    }

                    $scope.workpFinishRate = resp.data.top10PersonUnit || [];
                    $scope.topChange = function (index) {
                        $scope.tab_index = index;

                        if (index == 1) {
                            //员工执行工单量TOP10
                            $scope.title = '员工执行工单量TOP10';
                            $scope.workpFinishRate = resp.data.top10PersonUnit || [];

                        } else if (index == 2) {
                            //员工创建工单数量排名
                            $scope.title = '员工创建工单数量TOP10';
                            $scope.workpFinishRate = resp.data.top10PersonCreateUnitCnt || [];
                        } else {
                            //员工自发工单完成数量排名
                            $scope.title = '员工自发工单完成数量TOP10';
                            $scope.workpFinishRate = resp.data.top10PersonOneselfUnitCnt || [];
                        }
                    }


                }


            });



        }

        function equip() {
            $http.post("/ovu-pcos/pcos/reportstat/statTbDevice.do", {
                deptId: $scope.param.deptId
            }, fac.postConfig).success(function (resp) {
                $scope.equipData = resp || '';
                //设备类型统计
                $scope.equipData.DEVICE_AMOUNT_STAT =resp &&  resp.DEVICE_AMOUNT_STAT || [];
                //设备运行状态统计
                if (fac.isNotEmpty($scope.equipData.DEVICE_RUNSTATUS_STAT)) {
                    $scope.euipRunStat = $scope.equipData.DEVICE_RUNSTATUS_STAT.map(function (n) {
                        n.value = n.VALUE;
                        n.name = n.NAME + ' ' + n.value + '台';
                        return n;
                    });

                    $scope.equipLend = $scope.euipRunStat.map(function (n) {
                        return n.name;
                    });
                    initEquip($scope.equipLend, $scope.euipRunStat);
                } else {
                    var equipment = document.getElementById('equipment');
                    equipment.innerHTML = '<div style="text-align:  center;">暂无统计结果</div>'
                }

                //各类设备故障统计
                if (fac.isNotEmpty($scope.equipData.DEVICE_ERROR_STAT)) {
                    $scope.equipTypeE = $scope.equipData.DEVICE_ERROR_STAT.map(function (n) {
                        return n.VALUE;
                    });
                    $scope.equipCount = $scope.equipData.DEVICE_ERROR_STAT.map(function (n) {
                        n.name = n.NAME
                        return n.name;
                    });
                    initFault($scope.equipCount, $scope.equipTypeE);
                } else {
                    var fault = document.getElementById('fault');
                    fault.innerHTML = '<div style="text-align:  center;">暂无统计结果</div>'
                }

                //工单统计数据
                if (fac.isNotEmpty($scope.equipData.DEVICE_ORDER_STAT)) {
                    $scope.equipOrder = $scope.equipData.DEVICE_ORDER_STAT.map(function (n) {
                        n.value = n.VALUE;
                        n.name = n.NAME + ' ' + n.value + '条';
                        return n;
                    });
                    $scope.equipOrderType = $scope.equipOrder.map(function (n) {
                        return n.name;
                    });

                    initWorkorder($scope.equipOrderType, $scope.equipOrder);
                } else {
                    var workorder = document.getElementById('workorder');
                    workorder.innerHTML = '<div style="text-align:  center;">暂无统计结果</div>'
                }

                //各类设备完好率统计
                if (fac.isNotEmpty($scope.equipData.DEVICE_GOOD_STAT_RATE)) {
                    $scope.equipType = $scope.equipData.DEVICE_GOOD_STAT_RATE.map(function (n) {
                        return n.EQUIPMENT_TYPE;
                    });
                    $scope.equipGood = $scope.equipData.DEVICE_GOOD_STAT_RATE.map(function (n) {
                        return n.GOOD_COUNT;
                    });
                    $scope.equipBad = $scope.equipData.DEVICE_GOOD_STAT_RATE.map(function (n) {
                        return n.BAD_COUNT;
                    });
                    iniIntactt($scope.equipType, $scope.equipGood, $scope.equipBad);
                } else {
                    var intact = document.getElementById('intact');
                    intact.innerHTML = '<div style="text-align:  center;">暂无统计结果</div>'
                }

            });
        }
        // 工单情况统计
        function initWorkinfo(data1, data2) {
            var myChartWorkinfo = echarts.init(document.getElementById('workinfo'));
            var workinfoOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    left: '5%',
                    data: data2,
                    padding: 0,
                    data: data1
                },
                series: [{
                    name: '工单情况统计',
                    type: 'pie',
                    radius: ['30%', '50%'],
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
                    center: ['50%', '50%'],
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: data2,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'rgba(255,0, 0,.5)',
                        },
                        normal: {
                            color: function (params) {
                                //自定义颜色
                                var colorList = [
                                    'rgba(102, 194,165)', 'rgba(252, 141, 98)',
                                ];
                                return colorList[params.dataIndex]



                            },
                        }
                    }
                }]
            };
            myChartWorkinfo.setOption(workinfoOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartWorkinfo.resize();

            });
        }
        // 工单状态统计
        function initWorktype(data1, data2) {
            var myChartWorktype = echarts.init(document.getElementById('worktype'));
            var worktypeOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    left: '5%',
                    data: data2,
                    padding: 0,
                    data: data1
                },
                series: [{
                    name: '工单状态统计',
                    type: 'pie',
                    radius: ['30%', '50%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,

                        },

                    },
                    center: ['50%', '50%'],
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: data2,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'rgba(255,0, 0,.5)',
                        },
                        normal: {
                            color: function (params) {
                                //自定义颜色
                                var colorList = [
                                    'rgba(102, 194,165)', 'rgba(252, 141, 98)', 'rgba(229, 196,148)', 'rgba(141, 160, 203)', 'rgba(96, 157, 202)'
                                ];
                                return colorList[params.dataIndex]



                            },
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

        // 工单分类统计
        function initWorkunits(data1, data2) {
            var myChartWorkunits = echarts.init(document.getElementById('workunits'));
            var workunitsOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    left: '5%',
                    data: data2,
                    padding: 0,
                    data: data1
                },
                series: [{
                    name: '工单状态统计',
                    type: 'pie',
                    radius: ['30%', '50%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,

                        },

                    },
                    center: ['70%', '50%'],
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: data2,


                }]
            };
            myChartWorkunits.setOption(workunitsOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartWorkunits.resize();

            });
        }
        // 有效使用人数
        function initUsers(data1, data2) {
            var myChartUsers = echarts.init(document.getElementById('users'));
            var usersOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    left: '5%',
                    data: data2,
                    padding: 0,
                    data: data1
                },
                series: [{
                    name: '有效使用人数',
                    type: 'pie',
                    radius: ['30%', '50%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,

                        },

                    },
                    center: ['50%', '50%'],
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: data2,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'rgba(255,0, 0,.5)',
                        },
                        normal: {
                            color: function (params) {
                                //自定义颜色
                                var colorList = [
                                    'rgba(184, 135,195)'
                                ];
                                return colorList[params.dataIndex]



                            },
                        }
                    }


                }]
            };
            myChartUsers.setOption(usersOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartUsers.resize();

            });
        }
        // 计划工单完成率
        function initJhCompletion(data1, data2) {
            var myChartJhCompletion = echarts.init(document.getElementById('jhCompletion'));
            var jhCompletionOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    left: '5%',
                    padding: 0,
                    data: data1
                },

                series: [{
                    name: '计划工单完成率',
                    type: 'pie',
                    radius: ['30%', '50%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,

                        },

                    },
                    // center: ['50%', '50%'],
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: data2,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'rgba(255,0, 0,.5)',
                        },
                        normal: {
                            color: function (params) {
                                //自定义颜色
                                var colorList = [
                                    'rgba(229, 196,148)','rgba(181, 135,195)'
                                ];
                                return colorList[params.dataIndex]
                            },
                        }
                    }
                }]


            }
            myChartJhCompletion.setOption(jhCompletionOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartJhCompletion.resize();

            });
        }
        // 耗时统计
        function initTime(data1, data2) {
            var myChartTime = echarts.init(document.getElementById('time'));
            var timeOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    left: '5%',
                    data: data2,
                    padding: 0,
                    data: data1
                },
                series: [{
                    name: '耗时统计',
                    type: 'pie',
                    radius: ['30%', '50%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,

                        },

                    },
                    center: ['50%', '50%'],
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: data2,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'rgba(255,0, 0,.5)',
                        },
                        normal: {
                            color: function (params) {
                                //自定义颜色
                                var colorList = [
                                    'rgba(102, 194,165)', 'rgba(252, 141, 98)', 'rgba(141, 160, 203)', 'rgba(96, 157, 202)'
                                ];
                                return colorList[params.dataIndex]



                            },
                        }
                    }


                }]
            };
            myChartTime.setOption(timeOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartTime.resize();

            });
        }
        // 各部门工单统计
        function initDpworkuit(data1, data2, data3, data4) {
            var myChartDpworkuit = echarts.init(document.getElementById('dpworkuit'));
            var dpworkuitOption = {
                legend: {
                    data: ['应急工单', '计划工单', '自发工单'],
                    align: 'left',
                    left: '40%',
                    
                },
              
                tooltip: {
                    trigger: 'item',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    },
                },
                xAxis: {
                    data: data1,
                    name: '部门',
                    silent: false,
                    axisLine: {
                        onZero: true
                    },
                    splitLine: {
                        show: false
                    },
                    splitArea: {
                        show: false
                    },
                    axisLabel: {
                     
                        interval: 0,
                        rotate: -45, //倾斜度 -90 至 90 默认为0
                        textStyle: {
                            fontSize: "8"

                        }
                    }
                },
                yAxis: {
                    splitArea: {
                        show: false
                    },
                    
                    name: '条',
                },
                grid: {
                    left: '10%',
                    bottom: '20%'
                },
                series: [{
                    name: '应急工单',
                    type: 'bar',

                    data: data2,
                    barGap: '0%',
                    // label: {
                    //     normal: {
                    //         show: true,
                    //         position: 'outside',
                    //         formatter: "{c}"
                    //     }
                    // },
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'rgba(255,0, 0,.5)',
                        },
                        normal: {
                            color: function (params) {
                                //自定义颜色
                                var colorList = [
                                    'rgba(96, 157, 202)'
                                ];
                                return colorList[params.dataIndex]



                            },
                        }
                    }

                },
                    {
                        name: '计划工单',
                        type: 'bar',

                        data: data3,
                        // label: {
                        //     normal: {
                        //         show: true,
                        //         position: 'outside',
                        //         formatter: "{c}"
                        //     }
                        // },
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)',
                                color: 'rgba(255,0, 0,.5)',
                            },
                            normal: {
                                color: function (params) {
                                    //自定义颜色
                                    var colorList = [
                                        'rgba(141, 160, 203)'
                                    ];
                                    return colorList[params.dataIndex]



                                },
                            }
                        }
                    },
                    {
                        name: '自发工单',
                        type: 'bar',

                        data: data4,
                        // label: {
                        //     normal: {
                        //         show: true,
                        //         position: 'outside',
                        //         formatter: "{c}"
                        //     }
                        // },
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)',
                                color: 'rgba(255,0, 0,.5)',
                            },
                            normal: {
                               
                                color: function (params) {
                                    //自定义颜色
                                    var colorList = [
                                        'rgba(102, 194,165)'
                                    ];
                                    return colorList[params.dataIndex]



                                },
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
        // 业主工单来源统计
        function initOwner(data1, data2) {
            var myChartOwner = echarts.init(document.getElementById('owner'));
            var ownerOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    left: '5%',
                    data: data2,
                    padding: 0,
                    data: data1
                },
                series: [{
                    name: '工单状态统计',
                    type: 'pie',
                    radius: ['30%', '50%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,

                        },

                    },
                    center: ['50%', '50%'],
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: data2,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'rgba(255,0, 0,.5)',
                        },
                        normal: {
                            color: function (params) {
                                //自定义颜色
                                var colorList = [
                                    'rgba(252, 141, 98)', 'rgba(141, 160, 203)'
                                ];
                                return colorList[params.dataIndex]



                            },
                        }
                    }
                }]
            };
            myChartOwner.setOption(ownerOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartOwner.resize();

            });
        }

        //人员编制分析
        function initCompile(data1, data2, data3) {
            var myChartCompile = echarts.init(document.getElementById('compile'));
            var compileOption = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    },
                },
                legend: {
                    data: ['实际在编人数', '编制人数']
                },

                calculable: true,
                xAxis: [{
                    type: 'category',
                    data: data1,
                    axisLabel: {
                        interval: 0,
                        rotate: 40,
                        fontSize: 8,
                    }

                },

                ],
                yAxis: [{
                    type: 'value',

                }],
                series: [{
                    name: '实际在编人数',
                    type: 'bar',
                    stack: '总量',
                    barCategoryGap: '50%',
                    itemStyle: {
                        normal: {
                            color: '#E5C494',
                            barBorderColor: '#A4A09B',
                            label: {
                                show: true,
                                textStyle: {
                                    color: '#fff'
                                }

                            }
                        }
                    },
                    data: data2
                },
                    {
                        name: '编制人数',
                        type: 'bar',
                        stack: '总量',
                        barCategoryGap: '50%',
                        itemStyle: {
                            normal: {
                                color: '#A4A09B',
                                barBorderColor: '#A4A09B',

                                label: {
                                    show: true,

                                    textStyle: {
                                        color: '#fff'
                                    }
                                }
                            }
                        },
                        data: data3
                    }
                ]
            };
            myChartCompile.setOption(compileOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartCompile.resize();

            });
        }
        //员工年龄分析
        function initAge(data1, data2) {
            var myChartAge = echarts.init(document.getElementById('age'));
            var ageOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    left: '3%',
                    data: data2,
                    textStyle: {
                        fontSize: 8,
                        margin: 0,


                    },

                    padding: 0
                },
                series: [{
                    name: '员工年龄分析',
                    type: 'pie',
                    radius: '50%',
                    center: ['70%', '70%'],
                    data: data1,
                    label: {
                        normal: {
                            show: false,

                        }


                    },
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'rgba(255,0, 0,.5)',
                        },
                        normal: {
                           
                            color: function (params) {
                                //自定义颜色
                                var colorList = [
                                    'rgba(229, 196,148)', 'rgba(141, 160, 203)', 'rgba(96, 157, 202)', 'rgba(184, 135, 195)', 'rgba(164, 160, 155)',
                                ];
                                return colorList[params.dataIndex]



                            },
                        }
                    }
                }]
            };
            myChartAge.setOption(ageOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartAge.resize();

            });
        }
        //员工学历分析
        function initSchooling(data1, data2) {
            var myChartSchooling = echarts.init(document.getElementById('schooling'));
            var schoolingOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    left: '3%',
                    data: data2,
                    textStyle: {
                        fontSize: 8,
                        margin: 0,

                    },

                    padding: 0
                },
                series: [{
                    name: '员工学历分析',
                    type: 'pie',
                    radius: '50%',
                    center: ['70%', '70%'],
                    data: data1,
                    label: {
                        normal: {
                            show: false
                        }


                    },
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'rgba(255,0, 0,.5)',
                        },
                        normal: {
                           
                            color: function (params) {
                                //自定义颜色
                                var colorList = [
                                    'rgba(229, 196,148)', 'rgba(141, 160, 203)', 'rgba(96, 157, 202)', 'rgba(184, 135, 195)',

                                ];
                                return colorList[params.dataIndex]



                            },
                        }
                    }
                }]

            };
            myChartSchooling.setOption(schoolingOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartSchooling.resize();

            });
        }

        //员工入职年限分析
        function initEntry(data1, data2) {
            var myChartEntry = echarts.init(document.getElementById('entry'));
            var entryOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    left: '3%',
                    data: data2,
                    textStyle: {
                        fontSize: 8,
                        margin: 0,

                    },

                    padding: 0
                },
                series: [{
                    name: '员工入职年限分析',
                    type: 'pie',
                    radius: '50%',
                    center: ['70%', '70%'],
                    data: data1,
                    label: {
                        normal: {
                            show: false
                        }


                    },
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'rgba(255,0, 0,.5)',
                        },
                        normal: {
                            
                            color: function (params) {
                                //自定义颜色
                                var colorList = [
                                    'rgba(229, 196,148)', 'rgba(141, 160, 203)', 'rgba(96, 157, 202)', 'rgba(184, 135, 195)', 'rgba(164, 160, 155)',
                                ];
                                return colorList[params.dataIndex]



                            },
                        }
                    }
                }]
            };
            myChartEntry.setOption(entryOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartEntry.resize();

            });
        }
        //员工签到异常统计
        function initAbnormal(data1, data2, data3) {
            var myChartAbnormal = echarts.init(document.getElementById('abnormal'));
            var abnormalOption = {
                title: {
                    text: '总计 ： ' + data1 + '人',
                    y: '80%',
                    x: '60%',
                    textStyle: {
                        fontWeight: 'normal',
                        fontSize: '12'
                    }
                },

                tooltip: {
                    trigger: 'item',
                    formatter: "{b}({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    left: '3%',
                    data: data3,

                    padding: 0
                },
                series: [{
                    name: '员工签到异常统计',
                    type: 'pie',
                    radius: '60%',
                    center: ['60%', '50%'],
                    data: data2,
                    label: {
                        normal: {
                            show: false
                        }


                    },
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'rgba(255,0, 0,.5)',
                        },
                        normal: {
                            
                            color: function (params) {
                                //自定义颜色
                                var colorList = [
                                    'rgba(184, 135,195)', 'rgba(254, 144, 194)',
                                ];
                                return colorList[params.dataIndex]



                            },
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
        function initTransact(data1, data2) {
            var myChartTransaction = echarts.init(document.getElementById('transaction'));
            var transactionOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },

                legend: {
                    orient: 'vertical',
                    x: 'left',
                    left: '3%',
                    data: data1,

                    padding: 0
                },
                series: [{
                    name: '员工异动统计',
                    type: 'pie',
                    radius: ['50%', '70%'],
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
                    data: data2,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'rgba(255,0, 0,.5)',
                        },
                        normal: {
                           
                            color: function (params) {
                                //自定义颜色
                                var colorList = [
                                    'rgba(102, 194,165)', 'rgba(252, 141, 98)',
                                ];
                                return colorList[params.dataIndex]



                            },
                        }
                    }
                }]
            };
            myChartTransaction.setOption(transactionOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartTransaction.resize();

            });
        }




        // 设备运行状态方法
        function initEquip(data1, data2) {
            var myChartEquipment = echarts.init(document.getElementById('equipment'));
            var equipmentOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    top: 'middle',
                    left: '60%',
                    data: data1
                },
                series: [{
                    name: '访问来源',
                    type: 'pie',
                    radius: ['35%', '60%'],
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
                    center: ['30%', '50%'],
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: data2
                }]
            };
            myChartEquipment.setOption(equipmentOption);
            //图标自适应大小
            window.addEventListener('resize', function () {
                myChartEquipment.resize();

            });
        }


        // 各类系统故障统计
        function initFault(data1, data2) {
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
                    data: data1,
                    axisTick: {
                        alignWithLabel: true
                    }
                }],
                yAxis: [{
                    type: 'value',
                    name: '台'
                }],
                series: [{
                    name: '各类故障统计',
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
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'rgba(255,0, 0,.5)',
                        },
                        normal: {
                            
                            color: function (params) {
                                var colorList = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074'];
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
        function initWorkorder(data1, data2) {

            var myChartWorkorder = echarts.init(document.getElementById('workorder'));
            var workorderOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    top: 'middle',
                    left: '60%',
                    data: data1
                },
                series: [{
                    name: '访问来源',
                    type: 'pie',
                    radius: '55%',
                    center: ['30%', '50%'],
                    label: {
                        normal: {
                            show: false
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
        function iniIntactt(data1, data2, data3) {
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

            var intactOption = {
                tooltip: {
                    formatter: "{b} : {c}台"
                },
                xAxis: {
                    data: data1,
                    name: '设备',
                    silent: false,
                    axisLine: {
                        onZero: true
                    },
                    splitLine: {
                        show: false
                    },
                    splitArea: {
                        show: false
                    }
                },
                yAxis: {
                    splitArea: {
                        show: false
                    },
                    name: '台'
                },
                grid: {
                    left: '10%',
                    bottom: '10%'
                },
                series: [{
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
                                formatter: function (obj) {
                                    var intactRate = (data2[obj.dataIndex] / (obj.data + data2[obj.dataIndex]) * 100).toFixed(2) + '%';
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


})();
