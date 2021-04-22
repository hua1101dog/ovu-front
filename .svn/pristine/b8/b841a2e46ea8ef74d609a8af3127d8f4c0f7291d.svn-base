/*
 *
 */
'use strict';

/* Controllers */

angular.module('app')
    .controller('AppCtrl', ['$scope', '$rootScope', '$window', '$http', '$uibModal','$q', 'AppService',
        function($scope, $rootScope, $window, $http, $uibModal,$q, AppService) {
            //路由切换开始
            var index;
            $scope.$on('$stateChangeStart', function(event, state) {
                if($scope.video.on){
                    $scope.video.on = false;
                    $scope.video.id = null;
                }

            });
            $window.onresize = function() {
                $scope.$broadcast('onWindowResize');
            }

            $scope.video = AppService.video;

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


            //获取当前菜单
            function getMenuTree(moduleId){
                var matches = location.search.match(/module=(\d+)/);
                if(matches && matches.length>=2){
                    var moduleId = matches[1];
                    $http.get("/ovu-base/getMenu?moduleId="+moduleId).success(function(resp){
                        if(resp.success){
                            $scope.menuList  = resp.data.moduleMenu;
                        }else{
                            alert(resp.error)
                        }
                    })
                }

               /* $http.get("/ovu-base/sys/menu/tree?moduleId="+moduleId).success(function(resp){
                    $scope.menuList  = resp.data;
                })*/
            }
            getMenuTree();
            //获取当前用户
            function getLoginUser(){
                var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
                $http.get("/ovu-base/getSessionInfo").success(function(data){
                    if(data.user && data.user.ID){
                        $rootScope.user = data.user;
                        $rootScope.domain = data.domain;
                        deferred.resolve(data.user);
                    }else{
                        location.href="/government/portal/main.html";
                    }
                }).error(function(data, status, headers, config) {
                    deferred.reject(data);   // 声明执行失败，即服务器返回错误
                    location.href="/government/portal/main.html";
                });
                return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
            }
            getLoginUser();

            //查询设备预警数量
            $http.get("/ovu-pcos/pcos/govcloud/warning/total.do").success(function(data){
                $scope.equipmentTotal = data || 0;
            }).error(function(data) {
            });

            //展示个人信息
            $scope.showinfo = function(user){
                var modal = $uibModal.open({
                    component:'userInfoModelComponent',
                    resolve : {
                        param:user
                    }
                });
                modal.result.then(function(node) {
                }, function() {
                });
            }
            //修改密码
            $scope.changePwd = function(){
                var modal = $uibModal.open({
                    component:'changePasswordModelComponent'
                });
                modal.result.then(function(node) {
                }, function() {
                });
            }
        }
    ])
