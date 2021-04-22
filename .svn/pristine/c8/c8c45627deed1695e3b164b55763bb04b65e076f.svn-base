// config
var app = angular.module("app",
    	['ngAnimate',
		'ui.router',
		'ui.bootstrap',
		'oc.lazyLoad',
        'ng.ueditor']);

app
  .config(
    [        '$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
    function ($controllerProvider,   $compileProvider,   $filterProvider,   $provide) {
        // lazy controller, directive and service
        app.controller = $controllerProvider.register;
        app.directive  = $compileProvider.directive;
        app.filter     = $filterProvider.register;
        app.factory    = $provide.factory;
        app.service    = $provide.service;
        app.constant   = $provide.constant;
        app.value      = $provide.value;
    }
  ])

  .config(['$httpProvider', function($httpProvider){
  	//config http ajax set common
  	$httpProvider.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
  	//set post
  	var postHeaher = $httpProvider.defaults.headers.post;
  	postHeaher['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
  	// add interceptor
  	$httpProvider.interceptors.push(function($q, $injector, $window, $rootScope, $timeout) {
        var layerIndex;
		return {
            'responseError' : function(response) {
                layer.close(layerIndex);
                if (response.status == 403) {
                    confirm("会话已失效，请重新登录！",function(index){
                        window.location.href="/main/login.do";
                    });
                    return $q.reject(response);
                } else if (response.status == 901) {
                    window.location.href="http://www.cttic.cc"
                    return $q.reject(response);
                } else if (response.status === 404) {
                    alert("404!");
                    return $q.reject(response);
                } else if (response.status === 500){
                    return $q.reject(response);
                }
            },
            'response' : function(response) {
                layer.close(layerIndex);
                return response;       },
            'request' : function(config) {
                if(/_mute/.test(config.url) || /.html/.test(config.url) || /.svg/.test(config.url)     || /getNewWorkunit.do/.test(config.url)){
                    return config;
                }
                layerIndex = layer.load(1, {
                    shade: [0.2,'#000'] //0.1透明度的白色背景
                });
                return config;       }
		};
	})
  }]);
