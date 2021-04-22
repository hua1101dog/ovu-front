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
                        window.location.href = "http://www.cttic.cc";
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
                name: '能耗指标',
                icon: 'icon iconfont icon-nenghaozhibiao',
                url: 'app.operation.energy'
            },
            {
                name: '设施设备指标',
                icon: 'icon iconfont icon-sheshishepeizhibiao',
                url: 'app.operation.equipment'
            }
        ],
        [{
                name: '设备房',
                //    icon: 'icon iconfont icon-facilities-left-lift',
                icon: 'icon iconfont icon-icon_equipment',
                url: 'app.facility.equipmentRoom'
            },
            {
                name: '电梯',
                // icon: 'icon iconfont icon-facilities-left-lift',
                icon: 'icon iconfont icon-dianti',
                url: 'app.facility.lift'
            },
            /* {
                 name: '摄像头',
                 icon: 'icon iconfont icon-icon-camera',
                 url: 'app.facility.camera'
             },
             {
                 name: '门禁',
                 icon: 'icon iconfont icon-facilities-left-cent',
                 url: 'app.facility.guard'
             },*/
            {
                // name: '停车管理',
                name: '停车场',
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
            /*{
                name: '能源表',
                icon: 'icon iconfont icon-nengyuanbiao',
                url: 'app.facility.energymeter'
            },*/
            {
                name: 'LORA传感器',
                icon: 'icon iconfont icon-facilities-left-sens',
                url: 'app.facility.LORAsensor'
            }
        ],
        [{
                name: '电子围栏',
                // icon: 'icon iconfont icon-safe-left-police',
                icon: 'icon iconfont icon-icon-fence',
                url: 'app.safe.rail'
            },
            {
                name: '防盗报警',
                icon: 'icon iconfont icon-safe-left-police',
                url: 'app.safe.alarm'
            },
            {
                name: '人员轨迹',
                icon: 'icon iconfont icon-renyuanguiji',
                url: 'app.safe.patrolling'
            },
            {
                name: '门禁管理',
                icon: 'icon iconfont icon-facilities-left-cent',
                url: 'app.safe.access'
            },
            {
                name: '摄像头',
                // icon: 'icon iconfont icon-safe-left-fire',
                icon: 'icon iconfont icon-icon-camera1',
                url: 'app.safe.camera'
            },
            {
                name: '消防系统',
                icon: 'icon iconfont icon-safe-left-fire',
                url: 'app.safe.fire'
            }
        ],
        []

    ]);
