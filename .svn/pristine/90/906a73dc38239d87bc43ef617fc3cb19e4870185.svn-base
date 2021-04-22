'use strict';

/**
 * 配置路由信息
 */
angular.module('app')
    .run(
        ['$rootScope', '$state', '$stateParams',
            function($rootScope, $state, $stateParams) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
            }
        ]
    )
    .config(
        ['$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {
                $urlRouterProvider.otherwise('/portal');
                $stateProvider
                    .state('portal', {
                        url: '/portal',
                        templateUrl: '../show-cmcc/page/portal.html',
                        controller: 'portalCtrl',
                        controllerAs: 'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../show-cmcc/page/portalCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    .state('home', {
                        url: '/home',
                        templateUrl: '../show-cmcc/page/home.html',
                        controller: 'homeCtrl',
                        controllerAs: 'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../show-cmcc/page/homeCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //业主
                    .state('owner', {
                        url: '/owner',
                        templateUrl: '../show-cmcc/page/owner.html',
                        controller: 'ownerCtrl',
                        controllerAs: 'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../show-cmcc/page/ownerCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //项目
                    .state('project', {
                        url: '/project',
                        templateUrl: '../show-cmcc/page/project.html',
                        controller: 'projectCtrl',
                        controllerAs: 'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../show-cmcc/page/projectCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //人员
                    .state('person', {
                        url: '/person',
                        templateUrl: '../show-cmcc/page/person.html',
                        controller: 'personCtrl',
                        controllerAs: 'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../show-cmcc/page/personCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //电梯运行情况
                    .state('elevator', {
                        url: '/elevator',
                        templateUrl: '../show-cmcc/page/elevator.html',
                        controller: 'elevatorCtrl',
                        controllerAs: 'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../show-cmcc/page/elevatorCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //设备运行情况
                    .state('equipment', {
                        url: '/equipment',
                        templateUrl: '../show-cmcc/page/equipment.html',
                        controller: 'equipmentCtrl',
                        controllerAs: 'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../show-cmcc/page/equipmentCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //设备运行情况
                    .state('equipmentRoom', {
                        url: '/equipmentRoom',
                        templateUrl: '../show-cmcc/page/equipmentRoom.html',
                        controller: 'equipmentRoomCtrl',
                        controllerAs: 'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../show-cmcc/page/equipmentRoomCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    .state('app', {
                        abstract: true,
                        url: '/app',
                        templateUrl: '../show-cmcc/page/app.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([

                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //设备运维中心
                    .state('app.facility', {
                        abstract: true,
                        url: '/facility',
                        template: '<div ui-view style="height:100%;"></div>'
                    })
                    //设备运维中心》设备房
                    .state('app.facility.equipmentRoom', {
                        url: '/equipmentRoom',
                        templateUrl: '../show-cmcc/page/facility/equipmentRoom/equipmentRoom.html',
                        controller:'equipmentRoomCtrl',
                        controllerAs:'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../show-cmcc/page/facility/equipmentRoom/equipmentRoomCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //设备运维中心》电梯
                    .state('app.facility.lift', {
                        url: '/lift',
                        templateUrl: '../show-cmcc/page/facility/lift/liftMain.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../show-cmcc/page/facility/lift/liftMainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //设备运维中心》摄像头
                    .state('app.facility.camera', {
                        url: '/camera',
                        templateUrl: '../show-cmcc/page/facility/camera/main.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../show-cmcc/page/facility/camera/mainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //设备运维中心》门禁
                    .state('app.facility.guard', {
                        url: '/guard',
                        templateUrl: '../show-cmcc/page/facility/guard/main.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../show-cmcc/page/facility/guard/mainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //设备运维中心》停车管理
                    .state('app.facility.parking', {
                        url: '/parking',
                        templateUrl: '../show-cmcc/page/facility/parking/main.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../show-cmcc/page/facility/parking/mainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //设备运维中心》LORA传感器
                    .state('app.facility.LORAsensor', {
                        url: '/LORAsensor',
                        templateUrl: '../show-cmcc/page/facility/LORAsensor/main.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../show-cmcc/page/facility/LORAsensor/mainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //设备运维中心》水表
                    .state('app.facility.watermeter', {
                        url: '/watermeter',
                        templateUrl: '../show-cmcc/page/facility/watermeter/main.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../show-cmcc/page/facility/watermeter/mainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //设备运维中心》电表
                    .state('app.facility.electrimeter', {
                        url: '/electrimeter',
                        templateUrl: '../show-cmcc/page/facility/electrimeter/main.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../show-cmcc/page/facility/electrimeter/mainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //设备运维中心》能耗表
                    .state('app.facility.energymeter', {
                        url: '/energymeter',
                        templateUrl: '../show-cmcc/page/facility/energymeter/main.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../show-cmcc/page/facility/energymeter/mainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //项目安全中心
                    .state('app.safe', {
                        abstract: true,
                        url: '/safe',
                        template: '<div ui-view style="height:100%;"></div>'
                    })
                    //项目安全中心》电子围栏
                    .state('app.safe.rail', {
                        url: '/rail',
                        templateUrl: '../show-cmcc/page/safe/rail/railMain.html',
                        controller:'railMainCtrl',
                        controllerAs:'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../show-cmcc/page/safe/rail/railMainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //项目安全中心》防盗报警
                    .state('app.safe.alarm', {
                        url: '/alarm',
                        templateUrl: '../show-cmcc/page/safe/alarm/alarmMain.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../show-cmcc/page/safe/alarm/alarmMainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //项目安全中心》电子巡更
                    .state('app.safe.patrolling', {
                        url: '/patrolling',
                        templateUrl: '../show-cmcc/page/safe/patrolling/patrollingMain.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../show-cmcc/page/safe/patrolling/patrollingMainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //项目安全中心》门禁管理
                    .state('app.safe.access', {
                        url: '/access',
                        templateUrl: '../show-cmcc/page/safe/access/accessMain.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../show-cmcc/page/safe/access/accessMainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //设备运维中心》摄像头
                    .state('app.safe.camera', {
                        url: '/camera',
                        templateUrl: '../show-cmcc/page/safe/camera/main.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../show-cmcc/page/safe/camera/mainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //项目安全中心》消防系统
                    .state('app.safe.fire', {
                        url: '/fire',
                        templateUrl: '../show-cmcc/page/safe/fire/fireMain.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../show-cmcc/page/safe/fire/fireMainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //运营指标体系
                    .state('app.operation', {
                        abstract: true,
                        url: '/operation',
                        template: '<div ui-view style="height:100%;"></div>'
                    })
                    //运营指标体系》能耗指标
                    .state('app.operation.energy', {
                        url: '/energy',
                        templateUrl: '../show-cmcc/page/operation/energy/energyMain.html',
                        controller: 'energyMainCtrl',
                        controllerAs: 'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../show-cmcc/page/operation/energy/energyMainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //运营指标体系》设施设备指标
                    .state('app.operation.equipment', {
                        url: '/equipment',
                        templateUrl: '../show-cmcc/page/operation/equipment/equipmentMain.html',
                        controller: 'equipmentMainCtrl',
                        controllerAs: 'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../show-cmcc/page/operation/equipment/equipmentMainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //调度指挥中心
                    .state('app.dispatch', {
                        url: '/dispatch',
                        templateUrl: '../show-cmcc/page/dispatch/dispatchMain.html',
                        controller: 'dispatchMainCtrl',
                        controllerAs: 'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../show-cmcc/page/dispatch/dispatchMainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
            }
        ]
    );