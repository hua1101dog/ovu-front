// config
var app = angular.module("app", ['ngAnimate',
    'ui.router',
    'ui.bootstrap',
    'oc.lazyLoad'
]);

app
    .config(
        ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
            function($controllerProvider, $compileProvider, $filterProvider, $provide) {
                // lazy controller, directive and service
                app.controller = $controllerProvider.register;
                app.directive = $compileProvider.directive;
                app.filter = $filterProvider.register;
                app.factory = $provide.factory;
                app.service = $provide.service;
                app.constant = $provide.constant;
                app.value = $provide.value;
            }
        ])

.config(['$httpProvider', function($httpProvider) {
        //config http ajax set common
        $httpProvider.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
        //set post
        var postHeaher = $httpProvider.defaults.headers.post;
        postHeaher['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        // add interceptor
        $httpProvider.interceptors.push(function($q, $injector, $window, $rootScope, $timeout) {
            var layerIndex;
            return {
                'responseError': function(response) {
                    layer.close(layerIndex);
                    if (response.status == 403) {
                        confirm("会话已失效，请重新登录！", function(index) {
                            window.location.href = "/main/login.do";
                        });
                        return $q.reject(response);
                    } else if (response.status == 901) {
                        window.location.href = "http://www.cttic.cc"
                        return $q.reject(response);
                    } else if (response.status === 404) {
                        alert("404!");
                        return $q.reject(response);
                    } else if (response.status === 500) {
                        return $q.reject(response);
                    }
                },
                'response': function(response) {
                    layer.close(layerIndex);
                    return response;
                },
                'request': function(config) {
                    if (/_mute/.test(config.url) || /.html/.test(config.url) || /.svg/.test(config.url) || /getNewWorkunit.do/.test(config.url)) {
                        return config;
                    }
                    layerIndex = layer.load(1, {
                        shade: [0.2, '#000'] //0.1透明度的白色背景
                    });
                    return config;
                }
            };
        })
    }])
    .constant('MENULIST', [
        [{
                name: '电梯',
                icon: 'icon iconfont icon-facilities-left-lift',
                url: 'app.facility.lift'
            },
            {
                name: '摄像头',
                icon: 'icon iconfont icon-icon-camera',
                url: 'app.facility.camera'
            },
            {
                name: '门禁',
                icon: 'icon iconfont icon-facilities-left-cent',
                url: 'app.facility.guard'
            },
            {
                name: '停车管理',
                icon: 'icon iconfont icon-facilities-left-car',
                url: 'app.facility.parking'
            },
            {
                name: '水表',
                icon: 'icon iconfont icon-shuibiao',
                url: 'app.facility.watermeter'
            },
            {
                name: '电表',
                icon: 'icon iconfont icon-dianbiao',
                url: 'app.facility.electrimeter'
            },
            {
                name: '能源表',
                icon: 'icon iconfont icon-nengyuanbiao',
                url: 'app.facility.energymeter'
            },
            {
                name: 'LORA传感器',
                icon: 'icon iconfont icon-facilities-left-sens',
                url: 'app.facility.LORAsensor'
            }
        ],
        [{
                name: '空间',
                icon: 'icon iconfont icon-screen-left-space',
                url: 'app.company.space'
            },
            {
                name: '企业',
                icon: 'icon iconfont icon-service-left-enterpr',
                url: 'app.company.firm'
            },
            {
                name: '配套',
                icon: 'icon iconfont icon-peitao',
                url: 'app.company.mating.main',
                remark: 'app.company.mating'
            },
            {
                name: '活动',
                icon: 'icon iconfont icon-huodong',
                url: 'app.company.activity'
            },
            {
                name: '服务',
                icon: 'icon iconfont icon-fuwu',
                url: 'app.company.service'
            },
            {
                name: '资产',
                icon: 'icon iconfont icon-service-left-assets',
                url: 'app.company.property'
            }
            /* {
                 name: '广告位',
                 icon: 'icon iconfont icon-service-left-adverti',
                 url: 'app.company.advertising'
             }*/
        ],
        [{
                name: '防盗报警',
                icon: 'icon iconfont icon-safe-left-police',
                url: 'app.safe.alarm'
            },
            {
                name: '电子巡更',
                icon: 'icon iconfont icon-safe-left-camera',
                url: 'app.safe.patrolling'
            },
            {
                name: '门禁管理',
                icon: 'icon iconfont icon-facilities-left-cent',
                url: 'app.safe.access'
            },
            {
                name: '消防系统',
                icon: 'icon iconfont icon-safe-left-fire',
                url: 'app.safe.fire'
            }
        ],
        [{
                name: '招商指标',
                icon: 'icon iconfont icon-zhaoshangzhibiao',
                url: 'app.operation.business'
            },
            {
                name: '产业指标',
                icon: 'icon iconfont icon-icon-industries',
                url: 'app.operation.industry'
            },
            {
                name: '双创指标',
                icon: 'icon iconfont icon-shuangchuangzhibiao',
                url: 'app.operation.twoAbilities'
            },
            {
                name: '能耗指标',
                icon: 'icon iconfont icon-nenghaozhibiao',
                url: 'app.operation.energy'
            },
            {
                name: '设施设备指标',
                icon: 'icon iconfont icon-sheshishepeizhibiao',
                url: 'app.operation.equipment'
            }
        ]

    ]);
