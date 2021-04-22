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
                $urlRouterProvider.otherwise('app/home');
                $stateProvider
                    .state('app', {
                        abstract: true,
                        url: '/app',
                        templateUrl: '/government/portal/page/app.html',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                    ]).then(function () {
                                    });
                                }]
                        }
                    })
                    //门户首页
                    .state('app.home', {
                        url: '/home',
                        templateUrl: '/government/portal/page/home/home.html',
                        controller:'HomeCtrl',
                        controllerAs:'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '/res/js/base64encode.js',
                                        '/government/portal/page/home/HomeCtrl.js'
                                    ]).then(function() {

                                    });
                                }
                            ]
                        }
                    })
                    //通知公告
                    .state('app.notifyDetail', {
                        url: '/notifyDetail/{id}',
                        templateUrl: '/government/portal/page/home/commonDetail.html',
                        controller:'NotifyDetailCtrl',
                        controllerAs:'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '/government/portal/page/notifyDetail/NotifyDetailCtrl.js'
                                    ]).then(function() {

                                    });
                                }
                            ]
                        }
                    })
                    //行业新闻
                    .state('app.newsDetail', {
                        url: '/newsDetail/{id}',
                        templateUrl: '/government/portal/page/home/commonDetail.html',
                        controller:'NotifyDetailCtrl',
                        controllerAs:'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '/government/portal/page/newsDetail/NewsDetailCtrl.js'
                                    ]).then(function() {

                                    });
                                }
                            ]
                        }
                    })
                    //业务指南
                    .state('app.guideDetail', {
                        url: '/guideDetail/{id}',
                        templateUrl: '/government/portal/page/home/commonDetail.html',
                        controller:'GuideDetailCtrl',
                        controllerAs:'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '/government/portal/page/guideDetail/GuideDetailCtrl.js'
                                    ]).then(function() {

                                    });
                                }
                            ]
                        }
                    })
                    //公示数据详情
                    .state('app.dataDetail', {
                        url: '/dataDetail/{id}',
                        templateUrl: '/government/portal/page/dataDetail/dataDetail.html',
                        controller:'DataDetailCtrl',
                        controllerAs:'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '/government/portal/page/dataDetail/DataDetailCtrl.js'
                                    ]).then(function() {

                                    });
                                }
                            ]
                        }
                    })
                    //设备查询详情
                    .state('app.sensorDetail', {
                        url: '/sensorDetail',
                        params: {'sensorData': null},
                        templateUrl: '/government/portal/page/sensorDetail/sensorDetail.html',
                        controller:'SensorDetailCtrl',
                        controllerAs:'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '/government/portal/page/sensorDetail/SensorDetailCtrl.js'
                                    ]).then(function() {

                                    });
                                }
                            ]
                        }
                    })
                    //人员查询详情
                    .state('app.userDetail', {
                        url: '/userDetail',
                        params: {'userData': null},
                        templateUrl: '/government/portal/page/userDetail/userDetail.html',
                        controller:'UserDetailCtrl',
                        controllerAs:'vm',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        '/government/portal/page/userDetail/UserDetailCtrl.js'
                                    ]).then(function() {

                                    });
                                }
                            ]
                        }
                    })

            }
        ]
    );