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
                // $urlRouterProvider.otherwise('app/welcome');
                // 进入页面首先展示平台运营管理
                $urlRouterProvider.otherwise('app/platform');
                $stateProvider
                    .state('app', {
                        abstract: true,
                        url: '/app',
                        templateUrl: '/government/management/page/app.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                    ]).then(function () {
                                    });
                                }]
                        }
                    })
                    //平台运营管理
                    .state('app.welcome', {
                        url: '/welcome',
                        templateUrl: '/view/welcome.html'
                    })
                    //平台运营管理
                    .state('app.platform', {
                        url: '/platform',
                        controller:'PlatformCtrl',
                        controllerAs:'vm',
                        templateUrl: '/government/management/page/platform/platform.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '/government/management/page/platform/PlatformCtrl.js'
                                    ]).then(function() {
                                    });
                                }
                            ]
                        }
                    })
                    //预警事件管理
                    .state('app.warning', {
                        url: '/warning',
                        controller:'WarningCtrl',
                        controllerAs:'vm',
                        templateUrl: '/government/management/page/warning/warning.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '/government/management/page/warning/WarningCtrl.js'
                                    ]).then(function() {
                                    });
                                }
                            ]
                        }
                    })
                    //电梯运行监测
                    .state('app.elevatorMonitoring', {
                        url: '/elevatorMonitoring',
                        controller:'ElevatorMonitoringCtrl',
                        controllerAs:'vm',
                        templateUrl: '/government/management/page/elevatorMonitoring/elevatorMonitoring.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '/government/management/page/elevatorMonitoring/ElevatorMonitoringCtrl.js'
                                    ]).then(function() {
                                    });
                                }
                            ]
                        }
                    })
                    //电梯管理
                    .state('app.elevatorManage', {
                        url: '/elevatorManage',
                        controller:'ElevatorManageCtrl',
                        controllerAs:'vm',
                        templateUrl: '/government/management/page/elevatorManage/elevatorManage.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '/government/management/page/elevatorManage/ElevatorManageCtrl.js'
                                    ]).then(function() {
                                    });
                                }
                            ]
                        }
                    })
                    //维保单位管理
                    .state('app.maintenance', {
                        url: '/maintenance',
                        abstract: true,
                        template: '<div ui-view ></div>',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '/res/js/ajaxfileupload.js',
                                        '/government/management/page/maintenance/MaintenanceCtrl.js'
                                    ]).then(function() {
                                    });
                                }
                            ]
                        }
                    })
                    .state('app.maintenance.list', {
                        url: '/list',
                        controller:'MaintenanceCtrl',
                        controllerAs:'vm',
                        templateUrl: '/government/management/page/maintenance/maintenance.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                    ]).then(function() {
                                    });
                                }
                            ]
                        }
                    })
                    //新增修改维保单位管理
                    .state('app.maintenance.edit', {
                        url: '/edit/{id}',
                        controller:'MaintenanceEditCtrl',
                        controllerAs:'vm',
                        templateUrl: '/government/management/page/maintenance/maintenance-edit.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                    ]).then(function() {
                                    });
                                }
                            ]
                        }
                    })
                    //维保合同管理
                    .state('app.contractManage', {
                        url: '/contractManage',
                        controller:'ContractManageCtrl',
                        controllerAs:'vm',
                        templateUrl: '/government/management/page/contractManage/contractManage.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '/government/management/page/contractManage/ContractManageCtrl.js'
                                    ]).then(function() {
                                    });
                                }
                            ]
                        }
                    })
                    //使用单位管理
                    .state('app.useUnitManage', {
                        url: '/useUnitManage',
                        controller:'UseUnitManageCtrl',
                        controllerAs:'vm',
                        templateUrl: '/government/management/page/useUnitManage/useUnitManage.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '/government/management/page/useUnitManage/UseUnitManageCtrl.js'
                                    ]).then(function() {
                                    });
                                }
                            ]
                        }
                    })
                    //维保工作管理
                    .state('app.workManage', {
                        url: '/workManage',
                        controller:'WorkManageCtrl',
                        controllerAs:'vm',
                        templateUrl: '/government/management/page/workManage/workManage.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '/government/management/page/workManage/WorkManageCtrl.js'
                                    ]).then(function() {
                                    });
                                }
                            ]
                        }
                    })
                    //服务质量管理
                    .state('app.serviceQuality', {
                        url: '/serviceQuality',
                        controller:'ServiceQualityCtrl',
                        controllerAs:'vm',
                        templateUrl: '/government/management/page/serviceQuality/serviceQuality.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '/government/management/page/serviceQuality/ServiceQualityCtrl.js'
                                    ]).then(function() {
                                    });
                                }
                            ]
                        }
                    })
                    //统计分析
                    .state('app.statistics', {
                        url: '/statistics',
                        controller:'StatisticsCtrl',
                        controllerAs:'vm',
                        templateUrl: '/government/management/page/statistics/statistics.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '/government/management/page/statistics/StatisticsCtrl.js'
                                    ]).then(function() {
                                    });
                                }
                            ]
                        }
                    })
                    //首页后台管理
                    .state('app.homeManage', {
                        abstract: true,
                        url: '/homeManage',
                        templateUrl: '/government/management/page/homeManage/homeManage.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '/government/lib/ueditor/ueditor.config.js',
                                        '/government/lib/ueditor/ueditor.all.min.js',
                                        '/government/lib/ueditor/ueditor.parse.js',
                                        '/government/lib/ueditor/angular-ueditor.js'
                                    ]).then(function() {
                                    });
                                }
                            ]
                        }
                    })
                    //首页后台管理>通知公告
                    .state('app.homeManage.notify', {
                        abstract: true,
                        url: '/notify',
                        template: '<div ui-view ></div>',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '/government/management/page/homeManage/NotifyCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    .state('app.homeManage.notify.list', {
                        url: '/list',
                        templateUrl: '/government/management/page/homeManage/homeManage-list.html',
                        controller:'NotifyCtrl',
                        controllerAs:'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([

                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    .state('app.homeManage.notify.details', {
                        url: '/details/{id}',
                        templateUrl: '/government/management/page/homeManage/homeManage-details.html',
                        controller:'NotifyDetailsCtrl',
                        controllerAs:'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    .state('app.homeManage.notify.add', {
                        url: '/add/{id}',
                        templateUrl: '/government/management/page/homeManage/homeManage-add.html',
                        controller:'NotifyAddCtrl',
                        controllerAs:'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //首页后台管理>行业新闻
                    .state('app.homeManage.news', {
                        abstract: true,
                        url: '/news',
                        template: '<div ui-view ></div>',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '/res/js/ajaxfileupload.js',
                                        '/government/management/page/homeManage/NewsCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    .state('app.homeManage.news.list', {
                        url: '/list',
                        templateUrl: '/government/management/page/homeManage/homeManage-list.html',
                        controller:'NewsCtrl',
                        controllerAs:'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([

                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    .state('app.homeManage.news.add', {
                        url: '/add/{id}',
                        templateUrl: '/government/management/page/homeManage/homeManage-add.html',
                        controller:'NewsAddCtrl',
                        controllerAs:'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    .state('app.homeManage.news.details', {
                        url: '/details/{id}',
                        templateUrl: '/government/management/page/homeManage/homeManage-details.html',
                        controller:'NewsDetailsCtrl',
                        controllerAs:'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //首页后台管理>业务指南
                    .state('app.homeManage.guide', {
                        abstract: true,
                        url: '/guide',
                        template: '<div ui-view ></div>',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '/government/management/page/homeManage/GuideCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    .state('app.homeManage.guide.list', {
                        url: '/list',
                        templateUrl: '/government/management/page/homeManage/homeManage-list.html',
                        controller:'GuideCtrl',
                        controllerAs:'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([

                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    .state('app.homeManage.guide.add', {
                        url: '/add/{id}',
                        templateUrl: '/government/management/page/homeManage/homeManage-add.html',
                        controller:'GuideAddCtrl',
                        controllerAs:'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    .state('app.homeManage.guide.details', {
                        url: '/details/{id}',
                        templateUrl: '/government/management/page/homeManage/homeManage-details.html',
                        controller:'GuideDetailsCtrl',
                        controllerAs:'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //首页后台管理>公示数据
                    .state('app.homeManage.data', {
                        abstract: true,
                        url: '/data',
                        template: '<div ui-view ></div>',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '/government/management/page/homeManage/DataCtrl.js'
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    .state('app.homeManage.data.list', {
                        url: '/list',
                        templateUrl: '/government/management/page/homeManage/homeManage-list.html',
                        controller:'DataCtrl',
                        controllerAs:'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([

                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    .state('app.homeManage.data.add', {
                        url: '/add/{id}',
                        templateUrl: '/government/management/page/homeManage/homeManage-add.html',
                        controller:'DataAddCtrl',
                        controllerAs:'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    .state('app.homeManage.data.details', {
                        url: '/details/{id}',
                        templateUrl: '/government/management/page/homeManage/homeManage-details.html',
                        controller:'DataDetailsCtrl',
                        controllerAs:'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                    ]).then(function() {});
                                }
                            ]
                        }
                    })
                    //系统管理
                    .state('app.system', {
                        url: '/system',
                        controller:'SystemCtrl',
                        controllerAs:'vm',
                        templateUrl: '/government/management/page/system/system.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '/government/management/page/system/SystemCtrl.js'
                                    ]).then(function() {
                                    });
                                }
                            ]
                        }
                    })
            }
        ]
    );