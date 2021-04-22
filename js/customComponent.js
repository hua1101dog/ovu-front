/**
 * 自定义 angular组件
 */
(function() {
    'use strict';

    var app = angular.module("angularApp");

    /**
     * 项目以及楼栋选择器,type为1则为项目,2为分期楼栋选择器
     */
    app.component('parkComponent', {
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        templateUrl: '../view/elevator/videoConfig/modal.parkOrFloor.tree.html',
        controllerAs: 'vm',
        controller: function($http, fac) {
            var vm = this;

            vm.$onInit = function() {
                vm.items = vm.resolve.param;
                var url;
                var arg;
                if (vm.items.type == 1) {
                    url = "/ovu-base/system/park/tree.do";
                    arg = {};
                } else {
                    url = "/ovu-base/system/parkStage/tree.do";
                    arg = { onlyFloor: true, parkId: vm.items.parkId };
                }
                $http.post(url, arg, fac.postConfig).success(function(data) {
                    data.unshift({ did: '', text: '无' });
                    var $checkableTree = $('#parkModalTree').treeview({
                        data: data,
                        showIcon: false,
                        showCheckbox: false,
                        onNodeSelected: function(event, node) {
                            if (node.nodes && node.nodes.length) {
                                return;
                            }
                            vm.close({ $value: node });
                        }
                    });
                })
            };
            vm.cancel = function() {
                vm.dismiss({ $value: 'cancel' });
            };
        }
    });

    //视频播放组件
    app.component('playVideoComponent', {
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        templateUrl: '/view/quality/point/modal.quality.playVedio.html',
        controllerAs: 'vm',
        controller: function() {
            var vm = this;

            vm.$onInit = function() {
                vm.item = vm.resolve.param;
            };

            vm.cancel = function() {
                vm.dismiss({ $value: 'cancel' });
            };
        }
    });
    //用户信息弹出框组件
    app.component('userInfoModelComponent', {
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        templateUrl: '/view/sys/modal.userInfo.html',
        controllerAs: 'vm',
        controller: function($http,$rootScope,fac) {
            var vm = this;
            vm.showPhoto = $rootScope.showPhoto;
            vm.processImgUrl = $rootScope.processImgUrl;
            vm.clearPhoto = $rootScope.clearPhoto;
            vm.addPhoto = $rootScope.addPhoto;

            vm.$onInit = function() {
                $http.get("/ovu-base/system/user/get.do?id="+vm.resolve.param.id).success(function(resp) {
                    if (resp.code==0) {
                        vm.item = resp.data;
                    }
                })
            };

            vm.save = function(form) {
                form.$setSubmitted(true);
                if (!form.$valid) {
                    return;
                }
                $http.post("/ovu-base/system/user/save.do", vm.item, fac.postConfig).success(function(data, status, headers, config) {
                    if (data.code==0) {
                        msg('保存成功！');
                        vm.close({ $value: vm.item });
                    }else {
                        alert("密码修改失败!");
                    }

                })
            };

            vm.cancel = function() {
                vm.dismiss({ $value: 'cancel' });
            };

        }
    });
    //修改密码弹出框组件
    app.component('changePasswordModelComponent', {
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        templateUrl: '/view/sys/modal.changePassword.html',
        controllerAs: 'vm',
        controller: function($http, fac) {
            var vm = this;

            vm.$onInit = function() {
                vm.item = vm.resolve.param || {};
            };

            vm.cancel = function() {
                vm.dismiss({ $value: 'cancel' });
            };

            vm.save = function(form) {
                form.$setSubmitted(true);
                if (!form.$valid) {
                    return;
                }
                if (vm.item.newPwd != vm.item.entryPwd) {
                    alert("新密码与确认密码输入不一致！");
                    return;
                }
                var param = { oldPwd: vm.item.oldPwd, newPwd: vm.item.newPwd };
                $http.post("/ovu-base/system/user/updatePassword.do", vm.item, fac.postConfig).success(function(data, status, headers, config) {
                    if (data.code==0) {
                        confirm("密码修改成功,请重新登陆!", function() {
                            $http.get("/ovu-base/logout").success(function(resp) {
                                // window.location.href = "/login.html";
                                window.location.href = "/";
                            })
                        });
                    } else {
                        alert(data.msg);
                    }

                })
            };
        }
    });
    //当前版本信息弹出框组件
    app.component('moduleVersionInfoModelComponent', {
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        templateUrl: '/view/sys/modal.moduleVersionInfo.html',
        controllerAs: 'vm',
        controller: function($scope, $http) {
            var vm = this;

            vm.$onInit = function() {
                var moduleId = vm.resolve.param;
                //获取系统版本信息
                $http.get("/ovu-base/sys/version/findModuleVersionInfo?id=" + moduleId).success(function(data) {
                    $scope.list = data || [];
                })
            };
            vm.cancel = function() {
                vm.dismiss({ $value: 'cancel' });
            };
        }
    });
    //选择设备分页列表弹出框
    //param:parkId,stageId,floorId
    app.component('sensorModelComponent', {
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        templateUrl: '/view/quality/point/modal.quality.sensor.html',
        controllerAs: 'vm',
        controller: function($scope, $http, fac) {
            var vm = this;
            vm.$onInit = function() {
                $scope.param = vm.resolve.param;
                $scope.search = { parkId: $scope.param.parkId,
                                  stageId: $scope.param.stageId,
                                  floorId: $scope.param.floorId}
                $scope.pageModel = {};

                //获取设备类型树
                $http.get("/ovu-pcos/pcos/equipment/getEmtTree.do").success(function(resp) {
                    if (resp.success) {
                        $scope.typeData = resp.data;
                    }
                })
                $scope.find();
            };

            $scope.find = function(pageNo) {
                $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
                $scope.search.pageIndex = $scope.search.currentPage - 1;
                fac.getPageResult("/ovu-pcos/system/video/equipmentList.do", $scope.search, function(data) {
                    $scope.pageModel = data;
                });
            }

            $scope.cancel = function() {
                vm.dismiss({ $value: 'cancel' });
            };

            $scope.save = function() {
                var sensor = $scope.pageModel.data.find(function(se) {
                    return se.checked;
                })
                if (!sensor) {
                    return;
                }
                vm.close({ $value: { sensor: sensor } });
            }

            //选择树节点
            $scope.selectNode = function(node) {
                // if (node.is_model == 1) {
                //     $scope.search.modelId = node.id;
                //     $scope.search.emtTypeName = node.text;
                //     $scope.search.modelHover = search.modelFocus = false;
                // } else {
                //     alert("请选择产品型号！");
                // }

              /*  必须选择最后一个节点
              if (node.nodes && node.nodes.length > 0) {
                    alert('请选择最后一级分类!');
                    return;
                } else {
                    $scope.search.modelId = node.id;
                    $scope.search.emtTypeName = node.text;
                    $scope.search.modelHover = $scope.search.modelFocus = false;
                }*/
                $scope.search.modelId = node.id;
                $scope.search.emtTypeName = node.text;
                $scope.search.modelHover = $scope.search.modelFocus = false;
            }
        }
    });
    //公共新增修改组件，只支持简单的保存功能
    //url:html路径
    //postUrl:请求路径
    //key:主键名
    //id:主键id
    app.component('commonEditModelComponent', {
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        template: '<div ng-include="vm.getTemplate()">',
        controllerAs: 'vm',
        controller: function($scope, $http, fac) {
            var vm = this;

            vm.getTemplate = function() {
                return vm.param.url;
            };

            vm.$onInit = function() {
                vm.param = vm.resolve.param;
                vm.item = {};
                if (fac.isNotEmpty(vm.param.id)) {
                    $http.get(vm.param.postUrl + '/get.do?' + vm.param.key + '=' + vm.param.id).success(function(data) {
                        vm.item = data;
                    })
                }
            };

            vm.cancel = function() {
                vm.dismiss({ $value: 'cancel' });
            };

            vm.save = function(form, item) {
                form.$setSubmitted(true);
                if (!form.$valid) {
                    return;
                }
                $http.post(vm.param.postUrl + '/edit.do', item, fac.postConfig).success(function(data, status, headers, config) {
                    if (data.success) {
                        msg("保存成功!");
                    } else {
                        alert();
                    }
                })
                vm.close({ $value: {} });
            }
        }
    });
    //消息推送状态
    app.component('messagePushModelComponent', {
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        templateUrl: '../view/fire/modal/modal.messagePush.html',
        controllerAs: 'vm',
        controller: function($scope, $http, fac) {
            var vm = this;

            vm.$onInit = function() {
                vm.param = vm.resolve.param;
                $scope.search = {};
                $scope.find();
            };

            vm.cancel = function() {
                vm.dismiss({ $value: 'cancel' });
            };

            $scope.find = function(pageNo) {
                angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
                fac.getPageResult("/ovu-pcos/pcos/fire/firepoint/list.do", $scope.search, function(data) {
                    $scope.pageModel = data;
                });
            };


        }
    });

    //智慧消防的工单管理的编辑以及展示modal
    app.component('workOrderModalComponent', {
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        templateUrl: '../view/fire/modal/modal.editWorkOrder.html',
        controllerAs: 'vm',
        controller: function($scope, $http, $uibModal, fac) {
            var vm = this;
            vm.item = {};

            vm.$onInit = function() {
                vm.param = vm.resolve.param;

                if (fac.isNotEmpty(vm.param.id)) {
                    $http.get("/ovu-pcos/pcos/fire/workunit/get.do?fireWorkunitId=" + vm.param.id).success(function(data) {
                        vm.item = data;
                        if(vm.item.imgPaths){
                            vm.item.imgPaths=vm.item.imgPaths.split(',')
                        }else{
                            vm.item.imgPaths= [];
                        }
                       
                    })
                }
            };
           
            vm.cancel = function() {
                vm.dismiss({ $value: 'cancel' });
            };

            vm.save = function(form, item) {
                form.$setSubmitted(true);

                if (!form.$valid) {
                    return;
                }else if(!vm.item.imgPaths){
                    alert("请上传图片");
                    return;
                }
                item.imgPaths=item.imgPaths.join(',')
                $http.post('/ovu-pcos/pcos/fire/workunit/edit.do', item, fac.postConfig).success(function(data, status, headers, config) {
                    if (data.success) {
                        msg("保存成功!");
                        vm.close({ $value: {} });
                    } else {
                        alert();
                    }
                })
            }

            //选择执行人员
            vm.chooseExecutePerson = function() {
                    var modal = $uibModal.open({
                        animation: false,
                        size: 'lg',
                        templateUrl: '/common/modal.select.person.html',
                        controller: 'personSelectorCtrl',
                        resolve: {
                            data: {
                                onlyOne: true,
                                per_Id: vm.item.executeId, //人员id
                                per_Name: vm.item.executeName, //人员名字
                                parkId: (vm.param.isGroup ? '' : vm.param.parkId)
                            }
                        }
                    });
                    modal.result.then(function(data) {
                        if (data) {
                            vm.item.execPersonId = data.per_Id;
                            vm.item.execPersonName = data.per_Name;
                        }
                    }, function() {});
                }
                //选择配合人员
            vm.chooseOtherPerson = function() {
                var modal = $uibModal.open({
                    animation: false,
                    size: 'lg',
                    templateUrl: '/common/modal.select.person.html',
                    controller: 'personSelectorCtrl',
                    resolve: {
                        data: {
                            per_Id: vm.item.otherId, //人员id
                            per_Name: vm.item.otherName, //人员名字
                            parkId: (vm.param.isGroup ? '' : vm.param.parkId)
                        }
                    }
                });
                modal.result.then(function(data) {
                    if (data) {
                        vm.item.coopPersonIds = data.per_Id;
                        vm.item.coopPersonName = data.per_Name;
                    }
                }, function() {});
            }

        }
    });

    //维保单位选择弹出框
    app.component('maintenanceModelComponent', {
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        templateUrl: '/common/modal.maintenanceList.html',
        controllerAs: 'vm',
        controller: function($scope, $http, fac) {
            var vm = this;
            vm.$onInit = function() {
                $scope.param = vm.resolve.param;
                $scope.search = {};
                $scope.pageModel = {};

                $scope.find();
            };

            $scope.find = function(pageNo) {
                angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
                fac.getPageResult("/ovu-pcos/pcos/maintenanceunit/mtu/list.do", $scope.search, function(data) {
                    $scope.pageModel = data;
                });
            };

            $scope.cancel = function() {
                vm.dismiss({ $value: 'cancel' });
            };

            $scope.save = function() {
                var sensor = $scope.pageModel.data.find(function(se) {
                    return se.checked;
                })
                if (!sensor) {
                    return;
                }
                vm.close({ $value: sensor });
            }

        }
    });

    //维保单位新增修改弹出框
    app.component('maintenanceAddOrEditModelComponent', {
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        templateUrl: '/view/maintenance/modal.maintenance.html',
        controllerAs: 'vm',
        controller: function($scope, $http, fac) {
            var vm = this;
            vm.$onInit = function() {
                var id = vm.resolve.id;

                vm.item = { personList: [] };
                vm.topTitle = "新增";
                vm.titles = ['管理者代表(总经理)', '维保负责人', '质保负责人', '技术负责人', '施工(安装改造)负责人', '开工告示指定人'];
                //修改
                if (fac.isNotEmpty(id)) {
                    vm.topTitle = "修改";
                    $http.get("/ovu-pcos/pcos/maintenanceunit/mtu/get.do?id=" + id).success(function(data) {
                        vm.item = data || {};
                        vm.item.approvalDate=vm.item.approvalDate.substring(0, 10)
                        vm.item.validDate=vm.item.validDate.substring(0, 10)
                        if(vm.item.dateOfEstablishment){
                            vm.item.dateOfEstablishment=vm.item.dateOfEstablishment.substring(0, 10)
                        }
                    }).error(function() {
                        alert();
                    })
                }
            };

            /*vm.addPhoto = function (item) {
                fac.upload({url:"/ovu-pcos/upload/img.do"},function(resp){
                    if(resp.status==1){
                        item.photo=resp.url;
                        $scope.$apply();
                    }else{
                        alert(resp.error);
                    }
                })
            }

            vm.addPhoto2 = function (item) {
                fac.upload({url:"/ovu-pcos/upload/img.do"},function(resp){
                    if(resp.status==1){
                        item.qualificationPhoto=resp.url;
                        $scope.$apply();
                    }else{
                        alert(resp.error);
                    }
                })
            }*/

            //保存
            vm.save = function(form, item) {
                form.$setSubmitted(true);
                if (!form.$valid) {
                    return;
                }
                if(!item.qualificationPhoto){
                    alert('请传入图片');
                    return;
                }
                var param = angular.copy(item);
                $http.post("/ovu-pcos/pcos/maintenanceunit/mtu/edit.do", param).success(function(data) {
                    if (data.success) {
                        msg("保存成功!");
                        vm.close();
                    } else {
                        alert();
                    }
                })
            }


            vm.cancel = function() {
                vm.dismiss({ $value: 'cancel' });
            };


        }
    });

    /**
     * tree公共选择器
     */
    app.component('commonTreeModelComponent', {
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        templateUrl: '../view/log/manage/modal.common.tree.html',
        controllerAs: 'vm',
        controller: function($http, fac) {
            var vm = this;

            vm.$onInit = function() {
                vm.title = vm.resolve.param.title;
                var data = vm.resolve.param.data;
                data[0] && data[0].text != '无' && data.unshift({ did: '', text: '无' });
                var $checkableTree = $('#parkModalTree').treeview({
                    data: data,
                    showIcon: false,
                    showCheckbox: false,
                    onNodeSelected: function(event, node) {
                        vm.close({ $value: node });
                    }
                });
            };
            vm.cancel = function() {
                vm.dismiss({ $value: 'cancel' });
            };
        }
    });

    //视频播放组件
  //视频播放组件
  app.component('playModal', {
    bindings: {
        deviceId: '<?',
        width: '<?',
        height: '<?',
        url: '<?',
        index : '<?'
    },
    templateUrl: '/view/playVedio/vedioModel.html',
    controllerAs: 'vm',
    controller: function ($scope, $timeout, $http) {
        var CAMERA_SERVICE_URL=app.CAMERA_SERVICE_URL;
        var vm = this;
        var width;
        vm.id = 'video' + $scope.$id;
        //初始化方法
        vm.$onInit = function () {
            vm.player;
            width = $(window).width();
            vm.width = width * 0.4;
        };

        vm.$onDestroy = function () {
            flv_destroy();
            clearInterval( vm.timer);
            clearInterval( vm.timer2);
        }

        vm.middle = function () {
            vm.width = width * 0.6;
        };
        vm.small = function () {
            vm.width = width * 0.4;
        };
        vm.large = function () {
            vm.width = width * 0.8;
        };
        //关闭
        vm.close = function () {
            $scope.$emit('closePlay',vm.deviceId);
        };
        //点击视频源，用于切换摄像头
        vm.clickVideo = function (camera,index) {
            vm.videoIndex = index;
            vm.lineList = camera.sources;  //线路列表
            $http.jsonp(CAMERA_SERVICE_URL+'/api/getIsOpen?code=' + camera.regi_code+"&callback=JSON_CALLBACK").success(function (data) {
                if(data.code==0){
                    vm.changeLine(camera.sources[0].sourceId,0); //默认选中第一个线路
                }else{
                   alert(data.msg);
                }
            });
        }
        //改变线路
        vm.timer;   //保持播放的心跳
        vm.timer2;   //没有播放地址时一直查询的心跳
        vm.changeLine = function (id,index) {
            vm.lineIndex = index;
            clearInterval( vm.timer);
            clearInterval( vm.timer2);
            $http.jsonp(CAMERA_SERVICE_URL+"/api/keepLive?sourceId=" + id+"&callback=JSON_CALLBACK");
            vm.timer = setInterval(function () {
                $http.jsonp(CAMERA_SERVICE_URL+"/api/keepLive?sourceId=" + id+"&callback=JSON_CALLBACK").success(function (data) {
                    if (!data.success) {
                        clearInterval(vm.timer);
                    }
                })
            },40000);
            $http.jsonp(CAMERA_SERVICE_URL+'/api/playVideo?sourceId=' + id+"&callback=JSON_CALLBACK").success(function (resp) {
                if (resp.data && resp.data.flvUrl) {
                    play(resp.data.flvUrl);
                } else {
                    getUrlById(id);
                    vm.timer2 = setInterval(function () {
                        getUrlById(id);
                    },2000)
                }
            });
        }
        function getUrlById(id) {
            $http.jsonp(CAMERA_SERVICE_URL+'/api/sourceDetail?sourceId=' + id+"&callback=JSON_CALLBACK").success(function (data) {
                if (data.data && data.data.flvUrl) {
                    clearInterval(vm.timer2);
                    vm.url = data.data.flvUrl;
                }
            });
        }
        //监听url变化
        $scope.$watch('vm.url', function (current, prev) {
            if (angular.isDefined(current) && !angular.equals(current, prev)) {
                if (current == '') {
                    init();
                } else {
                    //切换视频源
                    play(current);
                }
            }
        }, true);
        //播放视频初始化方法
        function init() {

            vm.deviceId && $http.get('/ovu-pcos/api/video/getCameraAndSources.do?equipmentId=' + vm.deviceId).success(function (res) {
                if(res.code ==0){
                    //摄像头列表
                    vm.videoList = res.data;
                    //默认选中第一个摄像头
                    vm.videoList[0] && vm.clickVideo(vm.videoList[0],0);
                }
            })

            /*vm.deviceId && $http.get('/ovu-pcos/system/video/cameraList.do?equipmentId=' + vm.deviceId).success(function (res) {
                //摄像头列表
                vm.videoList = res;
                //默认选中第一个摄像头
                vm.videoList[0] && vm.clickVideo(vm.videoList[0], 0);
            })*/
        }
        //初始化
        $timeout(function () {
            if (vm.deviceId) {
                init();
            } else {
                $scope.$watch('vm.deviceId', function (current, prev) {
                    if (angular.isDefined(current) && !angular.equals(current, prev)) {
                        init();
                    }
                }, true);
            }
        });

        function play(url) {
            //利用奇米来进行视频播放，内置的有线路切换
            if (flvjs.isSupported()) {
                if (typeof vm.player !== "undefined") {
                    if (vm.player != null) {
                        vm.player.unload();
                        vm.player.detachMediaElement();
                        vm.player.destroy();
                        vm.player = null;
                    }
                }
                var videoElement = document.getElementById(vm.id);
                vm.player = flvjs.createPlayer({
                    type: 'flv',
                    isLive: true,
                    hasAudio: false,
                    url: url || 'http://116.205.13.37:8082/live/34020000001310000001.flv'
                });
                vm.player.attachMediaElement(videoElement);
                vm.player.load();
                vm.player.play();

                vm.player.on(flvjs.Events.ERROR, function (data) {
                    console.log(data);
                    vm.player.unload();
                    vm.player.detachMediaElement();
                    vm.player.attachMediaElement(videoElement);
                    vm.player.load();
                    vm.player.play();
                })
            }
        }

        function flv_destroy() {
            if (vm.player) {
                vm.player.pause();
                vm.player.unload();
                vm.player.detachMediaElement();
                vm.player.destroy();
                vm.player = null;
            }
        }
    }
});
})()
