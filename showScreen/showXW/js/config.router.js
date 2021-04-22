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
            // debugger;
                $urlRouterProvider.otherwise('/portal');
                $stateProvider
                    .state('index', {
                        url: '/index',
                        templateUrl: '../showXW/page/index.html'
                    })
                    .state('portal', {
                        url: '/portal',
                        templateUrl: '../showXW/page/portal.html',
                        controller: 'portalCtrl',
                        controllerAs: 'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../showXW/page/portalCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    .state('home', {
                        url: '/home',
                        templateUrl: '../showXW/page/home.html',
                        controller: 'homeCtrl',
                        controllerAs: 'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../showXW/page/homeCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    .state('app', {
                        abstract: true,
                        url: '/app',
                        templateUrl: '../showXW/page/app.html',
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
                    //设备运维中心》电梯
                    .state('app.facility.lift', {
                        url: '/lift',
                        templateUrl: '../showXW/page/facility/lift/liftMain.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../showXW/page/facility/lift/liftMainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //设备运维中心》摄像头
                    .state('app.facility.camera', {
                        url: '/camera',
                        templateUrl: '../showXW/page/facility/camera/main.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../showXW/page/facility/camera/mainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //设备运维中心》门禁
                    .state('app.facility.guard', {
                        url: '/guard',
                        templateUrl: '../showXW/page/facility/guard/main.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../showXW/page/facility/guard/mainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //设备运维中心》停车管理
                    .state('app.facility.parking', {
                        url: '/parking',
                        templateUrl: '../showXW/page/facility/parking/main.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../showXW/page/facility/parking/mainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //设备运维中心》LORA传感器
                    .state('app.facility.LORAsensor', {
                        url: '/LORAsensor',
                        templateUrl: '../showXW/page/facility/LORAsensor/main.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../showXW/page/facility/LORAsensor/mainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //设备运维中心》水表
                    .state('app.facility.watermeter', {
                        url: '/watermeter',
                        templateUrl: '../showXW/page/facility/watermeter/main.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../showXW/page/facility/watermeter/mainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //设备运维中心》电表
                    .state('app.facility.electrimeter', {
                        url: '/electrimeter',
                        templateUrl: '../showXW/page/facility/electrimeter/main.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../showXW/page/facility/electrimeter/mainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //设备运维中心》能耗表
                    .state('app.facility.energymeter', {
                        url: '/energymeter',
                        templateUrl: '../showXW/page/facility/energymeter/main.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../showXW/page/facility/energymeter/mainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //企业服务中心
                    .state('app.company', {
                        abstract: true,
                        url: '/company',
                        template: '<div ui-view style="height:100%;"></div>'
                    })
                    //企业服务中心》空间
                    .state('app.company.space', {
                        url: '/space',
                        templateUrl: '../showXW/page/company/space/spaceMain.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../showXW/page/company/space/spaceMainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //企业服务中心》资产
                    .state('app.company.property', {
                        url: '/property',
                        templateUrl: '../showXW/page/company/property/propertyMain.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../showXW/page/company/property/propertyMainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //企业服务中心》企业
                    .state('app.company.firm', {
                        url: '/firm',
                        templateUrl: '../showXW/page/company/firm/firmMain.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../showXW/page/company/firm/firmMainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //企业服务中心》广告位
                    .state('app.company.advertising', {
                        url: '/advertising',
                        templateUrl: '../showXW/page/company/advertising/advertisingMain.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../showXW/page/company/advertising/advertisingMainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //企业服务中心》配套
                    .state('app.company.mating', {
                        abstract: true,
                        url: '/mating',
                        template: '<div ui-view style="height:100%;"></div>',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../showXW/page/company/mating/matingMainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //企业服务中心》配套主页面
                    .state('app.company.mating.main', {
                        url: '/main',
                        templateUrl: '../showXW/page/company/mating/matingMain.html',
                        controller : 'matingMainCtrl',
                        controllerAs : 'vm'
                    })
                    //企业服务中心》配套详情
                    .state('app.company.mating.detail', {
                        url: '/detail/{id}',
                        templateUrl: '../showXW/page/company/mating/matingDetail.html',
                        controller : 'matingDetailCtrl',
                        controllerAs : 'vm'
                    })
                    //企业服务中心》活动
                    .state('app.company.activity', {
                        url: '/activity',
                        templateUrl: '../showXW/page/company/activity/activityMain.html',
                        controller: 'activityMainCtrl',
                        controllerAs: 'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../showXW/page/company/activity/activityMainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //企业服务中心》服务
                    .state('app.company.service', {
                        url: '/service',
                        templateUrl: '../showXW/page/company/service/serviceMain.html',                    
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../showXW/page/company/service/serviceMainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //园区安全中心
                    .state('app.safe', {
                        abstract: true,
                        url: '/safe',
                        template: '<div ui-view style="height:100%;"></div>'
                    })
                    //园区安全中心》防盗报警
                    .state('app.safe.alarm', {
                       /* url: '/alarm',
                        templateUrl: '../showXW/page/safe/alarm/alarmMain.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../showXW/page/safe/alarm/alarmMainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }*/
                        url: '/alarm',
                        templateUrl: '../showXW/page/facility/camera/main.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../showXW/page/facility/camera/mainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //园区安全中心》电子巡更
                    .state('app.safe.patrolling', {
                        url: '/patrolling',
                        templateUrl: '../showXW/page/safe/patrolling/patrollingMain.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../showXW/page/safe/patrolling/patrollingMainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //园区安全中心》门禁管理
                    .state('app.safe.access', {
                        url: '/access',
                        templateUrl: '../showXW/page/safe/access/accessMain.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../showXW/page/safe/access/accessMainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //园区安全中心》消防系统
                    .state('app.safe.fire', {
                        url: '/fire',
                        templateUrl: '../showXW/page/safe/fire/fireMain.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../showXW/page/safe/fire/fireMainCtrl.js'
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
                    //运营指标体系》招商指标
                    .state('app.operation.business', {
                    	params:{"contactId":null},
                        url: '/business',
                        templateUrl: '../showXW/page/operation/business/businessMain.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../showXW/page/operation/business/businessMainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                     //运营指标体系》产业指标
                     .state('app.operation.industry', {
                        url: '/industry',
                        templateUrl: '../showXW/page/operation/industry/industryMain.html',
                        controller: 'industryMainCtrl',
                        controllerAs: 'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../showXW/page/operation/industry/industryMainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //运营指标体系》双创指标
                    .state('app.operation.twoAbilities', {
                        url: '/twoAbilities',
                        templateUrl: '../showXW/page/operation/twoAbilities/twoAbilitiesMain.html',
                        controller: 'twoAbilitiesMainCtrl',
                        controllerAs: 'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../showXW/page/operation/twoAbilities/twoAbilitiesMainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //运营指标体系》能耗指标
                    .state('app.operation.energy', {
                        url: '/energy',
                        templateUrl: '../showXW/page/operation/energy/energyMain.html',
                        controller: 'energyMainCtrl',
                        controllerAs: 'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../showXW/page/operation/energy/energyMainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //运营指标体系》设施设备指标
                    .state('app.operation.equipment', {
                        url: '/equipment',
                        templateUrl: '../showXW/page/operation/equipment/equipmentMain.html',
                        controller: 'equipmentMainCtrl',
                        controllerAs: 'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '../showXW/page/operation/equipment/equipmentMainCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
            }
        ]
    );