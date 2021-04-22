/*
 *
 */
'use strict';

/* Controllers */

angular.module('app')
    .controller('AppCtrl', ['$scope', '$rootScope', '$window', '$http', '$state', 'AppService',
        function($scope, $rootScope, $window, $http, $state, AppService) {
            //路由切换开始
            $scope.$on('$stateChangeStart', function(event, state) {

            });
            $window.onresize = function() {
                $scope.$broadcast('onWindowResize');
            }

            //ue配置
            $rootScope.config = {
                //focus时自动清空初始化时的内容
                autoClearinitialContent: true,
                //关闭字数统计
                wordCount: false,
                //关闭elementPath
                elementPathEnabled: false
            };
            //当前时间
            moment.locale('zh-cn');
            $scope.today = moment().format('YYYY年MM月DD日 dddd');
        }
    ])
