(function(angular, document, win) {
    document.title = "报装巡检任务";

    var app = angular.module('angularApp');

    app.controller('inspectionTaskCtrl', ['$scope', '$rootScope', '$http', '$uibModal', 'fac', 'decoration.commonService','$filter', function($scope, $rootScope, $http, $uibModal, fac, myService,$filter) {
		/*$scope.search = {};
        $scope.search = {workunitype: 2};*/
		document.title = "报装巡检任务";
        $scope.checkAll = myService.checkAll;
        $scope.checkOne = myService.checkOne;
        $scope.hasChecked = myService.hasChecked;
    //    fac.workTypeTree($scope,2);

        $scope.pageModel = {};

        // 会话验证 判断是否需要登录
        app.modulePromiss.then(function() {
        	$scope.search = {workunitype: 2};
            /*if (app.park) {
                $scope.parkId = app.park.ID;
            }
            $scope.search = {};
            $scope.search.isGroup = fac.isGroupVersion();

            fac.initPage($scope, function() {
                $scope.find();
            }, function() {
                $scope.find();
            });*/
           //集团版、项目版合并，监控部门变化
            $scope.$watch('dept', function (deptO, oldValue) {
            	var deptCopy = angular.copy(deptO);
                if(deptCopy.id != $scope.search.deptId){
                	$scope.search.deptId = deptCopy.id;
                	$scope.deptId = deptCopy.id;
                }
                if($scope.search.deptId){
                	$scope.find();
                }else{
                	//清空表格
                	$scope.pageModel.totalCount = 0;
                	$scope.pageModel.totalPage1;
                	$scope.pageModel.data = [];
                }
            },true)
        });


        // 搜索
        $scope.find = function(searchObj) {
			if(!$scope.search.deptId){
        		alert("请选择部门！");
        		return;
        	}
            var search = {};
            search.pageSize = $scope.search.pageSize || 10;
            search.pageIndex = $scope.search.pageIndex || 0;
        //    search.parkId = $scope.search.parkId;
        	search.deptId = $scope.search.deptId;
            if (searchObj) {
                search.patrolName = searchObj.inspTask;
                search.startTime = searchObj.startTime&&searchObj.startTime+" 00:00:00";
                search.endTime = searchObj.endTime&&searchObj.endTime+" 23:59:59";
                search.status = searchObj.taskStatus;
            }
            $http.post('/ovu-pcos/decoration/decorationPatrol/list.do', search, fac.postConfig).then(function(res) {

                // 如果没有parkId 就不要显示数据
                if (!$scope.search.deptId) {
                    $scope.pageModel.data = [];
                    return;
                }
                $scope.pageModel = res.data;
                $scope.pageModel.currentPage = $scope.pageModel.pageIndex + 1;
                $scope.pageModel.numPerPage = $scope.pageModel.pageSize;

                if ($scope.search.operateType == 11) {
                    $scope.search.findWork = true;
                } else {
                    $scope.search.findWork = false;
                }
            });
        };

        // $scope.find();

        $scope.refresh = function() {

            $scope.find();
        //    $scope.search.parkId = app.park.id;
        };

        // 选择每页（？）多少条数据
        $scope.numSelect = function($event) {
            $scope.search.pageSize = $event.nowSelected;
            $scope.search.pageIndex = 0;

            $scope.find();
        };

        // 页码改变
        $scope.pageChanged = function(e) {
            if (e.currentPage) {

                $scope.search.pageIndex = e.currentPage - 1;
                $scope.find();
            }

        };

        // 打开工单
        $scope.toWorkUnit = function(item, generateWorkUnit) {
            var modal = $uibModal.open({
                animation: true,
                component: 'inspec.workUnitModal',
                size: 'md',
                resolve: {
                    item: function() {
                        item.generateWorkUnit = generateWorkUnit;
                        return item;
                    },
                    title: function() {
                        // return '工单列表';
                        return generateWorkUnit ? '生成工单' : '工单列表';
                    },
                    parkId: function() {
                        return $scope.parkId
                    },
                    deptId: function() {
                        return $scope.deptId
                    }
                }
            });
            modal.result.then(function(result) {
                var data = {
                	parkId: $scope.parkId || item.parkId,
                	deptId: $scope.deptId || item.deptId,
                	patrolId: item.id,
                	workUnitName: item.patrolName,
                	customerName: item.ownerName,
                	description: result.suggest,
                	patrolTime: result.inspecCheckTime,
                	picture: result.picUrls,
                	workTypeId: result.worktype_ID,
                	workTypeName: result.WORKTYPE_NAME,
                	decorationOnsiteinspId: result.decoration_onsiteinsp_id,
                	houseId: item.roomId,
                	customerPhone: item.ownerTel,
                };

                $http.post('/ovu-pcos/decoration/decorationPatrol/addOrder.do', data, fac.postConfig).then(function(res) {

                    if (res.data.success) {
                        confirm('巡检工单保存成功！');
                    }
                });
            }, function() {
                console.log('打开modal失败');
            });
        };

        // 启停
        $scope.toStartStop = function(item) {
            // openStartStop(item).then(function () {
            confirm(item.status == '0' ? '启用巡检任务？' : '停用巡检任务？', function() {
                var status;
                if (item.status == '0') {
                    status = 1;
                } else {
                    status = 0;
                }
                var data = {
                    ids: item.id,
                    status: status
                };
                $http.post('/ovu-pcos/decoration/decorationPatrol/edit.do', data, fac.postConfig).then(function() {
                    $scope.find();
                });
            });
        };

        // function openStartStop(item) {
        //     var modal = $uibModal.open({
        //         animation: true,
        //         component: 'stopStartModal',
        //         size: 'md',
        //         resolve: {
        //             item: function() {
        //                 return item;
        //             },
        //             title: function() {
        //                 if (item.status == '0') {
        //                     return '启用巡检任务';
        //                 } else {
        //                     return '停用巡检任务';
        //                 }
        //             },
        //             parkId: function() {
        //                 return $scope.parkId
        //             }
        //         }
        //     });
        //     return modal.result;
        // }

        // 排期
        $scope.toSchedule = function(item) {
            schedule([item.patrolName], [item.id]);
        };

        // 批量排期
        $scope.toScheduleAll = function() {
            var items = $scope.pageModel.data.reduce(function(ret, n) {
                n.checked && n.status !== 0 && ret.push(n.patrolName);
                return ret
            }, []);
            var ids = $scope.pageModel.data.reduce(function(ret, n) {
                n.checked && n.status !== 0 && ret.push(n.id);
                return ret
            }, []);
            if (!ids.length) {
                confirm('没有可以排期的巡检任务');
                return;
            }
            schedule(items, ids);
        };

        function schedule(items, ids) {
            var modal = $uibModal.open({
                animation: true,
                component: 'inspec.scheduleModal',
                size: 'md',
                resolve: {
                    items: function() {
                        return items;
                    }
                }
            });

            modal.result.then(function(result) {
                $http.post('/ovu-pcos/decoration/decorationPatrol/schedule.do', {
                    ids: ids.join(),
                    patrolStartTime: result.startTime,
                    isStart: result.autoWorkUnit ? 1 : 0,

                    // 新增
                    worktypeId: result.worktype_ID,
                    worktypeName: result.WORKTYPE_NAME,
                    // PICTURE: result.PICTURE,// 2018-01-26 需求变更 取消上传图片
                    decorationOnsiteinspId: result.decoration_onsiteinsp_id

                }, fac.postConfig).then(function(res) {
                    console.log(res.data);
                    if (res.data.success) {
                        $scope.find($scope.search);
                    }
                });
            }, function() {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        // 批量停用
        $scope.toStopAll = function() {
            console.log('批量停用');
            var ids = $scope.pageModel.data.reduce(function(ret, n) {
                n.checked && n.status !== 0 && ret.push(n.id);
                return ret
            }, []);

            if (!ids.length) {
                confirm('没有可以停用的巡检任务');
                return;
            }

            // confirm('批量停用选中的' + ids.length + '条任务?', function() {
            confirm('批量停用选中的任务?', function() {
                $http.post('/ovu-pcos/decoration/decorationPatrol/updateStopAll.do', {
                    ids: ids.join()
                }, fac.postConfig).then(function(res) {
                    console.log(res.data);
                    if (res.data.success) {
                        $scope.find($scope.search);
                    }
                });
            });
        };

        // 验收
        $scope.toInspCheck = function(item) {
            inspCheck(item);
            function inspCheck(item) {
                var modal = $uibModal.open({
                    animation: true,
                    component: 'inspec.checkModal',
                    size: 'md',
                    resolve: {
                        item: function() {
                            return item;
                        }
                    }
                });
                modal.result.then(function(result) {
                    $http.post('/ovu-pcos/decoration/decorationCheck/addOrder.do', {
                    //	parkId: item.parkId,
                    	deptId: item.deptId,
                    	workUnitName: item.roomName,
                    	customerName: item.ownerName,
                    	description: result.suggest,
                    	checkTime: result.inspecCheckTime,
                    	workTypeId: result.worktype_ID,
                    	workTypeName: result.WORKTYPE_NAME,
                    	picture: result.PICTURE,
                        decorationOnsiteinspId: result.decoration_onsiteinsp_id,
                        houseId: item.roomId,
                    }, fac.postConfig).then(function(res) {
                        console.log(res.data);
                    });
                }, function() {
                    console.info('Modal dismissed at: ' + new Date());
                });
            }
        };


    }]);

    //工单列表
    app.component('inspec.workUnitModal', {
        templateUrl: '/view/decoration/inspectiontask/modal.inspectionWorkUnit.html',
        bindings: {
            close: '&',
            dismiss: '&',
            resolve: '<'
        },
        controller: function($http, $scope,$rootScope, $timeout, fac) {
            var $ctrl = this;
            $ctrl.$onInit = function() {
            	fac.workTypeTree($scope,2);
                // 图片上传
                $ctrl.showPhoto = $rootScope.showPhoto;
                $ctrl.addPhotos = $rootScope.addPhotos;
                $ctrl.delPhoto = $rootScope.delPhoto;
                $ctrl.processImgUrl = $rootScope.processImgUrl;

                // 深拷贝 防止模态框变化引起table同步变化
                $ctrl.item = angular.copy($ctrl.resolve.item);
                $ctrl.title = angular.copy($ctrl.resolve.title);

                $ctrl.item.photos = $ctrl.item.photos || [];
                $ctrl.item.patrol_name = $ctrl.item.patrolName.slice(0, -19);
                $ctrl.parkId = angular.copy($ctrl.resolve.parkId);
                $ctrl.deptId = angular.copy($ctrl.resolve.deptId);
                $ctrl.showWorkUnitDetail = $rootScope.showWorkUnitDetail;
                $ctrl.unitStatusDict = $rootScope.unitStatusDict;
                $ctrl.itemStatus = $ctrl.item.status;
                $ctrl.pageModel = {};


                if (!$ctrl.item.generateWorkUnit) {
                    find();
                } else {
                    var searchObj = {
                    //    parkId: $rootScope.park.id,
                        deptId: $ctrl.deptId,
                        pageSize: 100, // 默认每页100条数据
                        pageIndex: 0
                    };
                    $http.post('/ovu-pcos/pcos/presOnSite/list.do', searchObj, fac.postConfig).then(function(res) {
                        //checkOptions
                        // console.log(res.data);
                        var data = res.data;
                        $ctrl.checkOptions = data.data;
                    });
                }
            };
            // 选择每页（？）多少条数据
            $ctrl.numSelect = function($event) {
                find(0, $event.nowSelected);
            };

            // 页码改变
            $ctrl.pageChanged = function(e) {

                if (e.currentPage) {
                    find(e.currentPage - 1, $ctrl.pageModel.pageSize);
                }
            };

            function find(pageIndex, pageSize) {
                if (!angular.isNumber(pageIndex)) {
                    pageIndex = $ctrl.pageModel.pageIndex || 0;
                }
                var data = {
                //    parkId: $ctrl.parkId || $ctrl.item.parkId,
                    deptId: $ctrl.deptId || $ctrl.item.deptId,
                    patrolId: $ctrl.item.id,
                    decorationType: 2,
                    pageIndex: pageIndex,
                    pageSize: pageSize || $ctrl.pageModel.pageSize || 10
                };
                $http.post('/ovu-pcos/decoration/decorationApply/getOrderList.do', data, fac.postConfig).then(function(res) {
                    console.log(res.data);
                    $ctrl.pageModel = res.data;
                    $ctrl.pageModel.currentPage = $ctrl.pageModel.pageIndex + 1;
                    $ctrl.pageModel.numPerPage = $ctrl.pageModel.pageSize;
                });
            }

            $ctrl.chooseWorkType = function() {
                modalWork.open({
                    callback: function(node) {
                        if (node.tid && node.text) {
                            $timeout(function() {
                                if (node.tid == "0") {
                                    delete $ctrl.WORKTYPE_NAME;
                                    delete $ctrl.WORKTYPE_ID;
                                } else {
                                    $ctrl.WORKTYPE_NAME = node.text;
                                    $ctrl.WORKTYPE_ID = node.tid;
                                }
                            })

                        }
                        modalWork.close();
                    },
                    selectedId: $ctrl.WORKTYPE_ID
                });
            };

            $ctrl.ok = function(form) {
                form.$setSubmitted(true);

                if (!form.$valid) {
                    return;
                }
                $ctrl.close({
                    $value: {
                        inspecCheckTime: $ctrl.inspecCheckTime,
                        picUrls: $ctrl.item.photos ? $ctrl.item.photos.join() : '',
                        suggest: $ctrl.suggest,
                        worktype_ID: $ctrl.WORKTYPE_ID,
                        WORKTYPE_NAME: $ctrl.WORKTYPE_NAME,
                        // PICTURE: $ctrl.photos.join(),
                        decoration_onsiteinsp_id: $ctrl.checkOption
                    }
                });
            };
            $ctrl.cancel = function() {
                $ctrl.dismiss({
                    $value: $ctrl.item
                });
            };
        }
    });

    //启动 停用
    app.component('stopStartModal', {
        templateUrl: '/view/decoration/inspectiontask/modal.stopStart.html',
        bindings: {
            close: '&',
            dismiss: '&',
            resolve: '<'
        },
        controller: function() {
            var $ctrl = this;
            $ctrl.$onInit = function() {
                // 深拷贝 防止模态框变化引起table同步变化
                $ctrl.item = angular.copy($ctrl.resolve.item);
                $ctrl.title = angular.copy($ctrl.resolve.title);
            };
            $ctrl.ok = function(form) {
                $ctrl.close({
                    $value: ''
                });
            };
            $ctrl.cancel = function() {
                $ctrl.dismiss({
                    $value: $ctrl.item
                });
            };
        }
    });

    // 排期组件
    app.component('inspec.scheduleModal', {
        templateUrl: '/view/decoration/inspectiontask/modal.inspectionSchedule.html',
        bindings: {
            close: '&',
            dismiss: '&',
            resolve: '<'
        },
        controller: ['$scope', '$rootScope', '$http', 'fac', '$timeout','$filter', function($scope, $rootScope, $http, fac, $timeout,$filter) {
            var $ctrl = this;
            $ctrl.$onInit = function() {
            	fac.workTypeTree($scope,2);
                // 深拷贝 防止模态框变化引起table同步变化
                // $ctrl.title = angular.copy($ctrl.resolve.title);
                $ctrl.inspecNames = angular.copy($ctrl.resolve.items);
                $ctrl.autoWorkUnit = true;

                $ctrl.showPhoto = $rootScope.showPhoto;
                $ctrl.addPhotos = $rootScope.addPhotos;
                $ctrl.delPhoto = $rootScope.delPhoto;
                $ctrl.processImgUrl = $rootScope.processImgUrl;
                $ctrl.photos = [];

                var searchObj = {
                //    parkId: $rootScope.park.id,
                    deptId: $rootScope.dept.id,
                    pageSize: 100, // 默认每页100条数据
                    pageIndex: 0
                };
                $http.post('/ovu-pcos/pcos/presOnSite/list.do', searchObj, fac.postConfig).then(function(res) {
                    //checkOptions
                    // console.log(res.data);
                    var data = res.data;
                    $ctrl.checkOptions = data.data;
                });
            };
            $ctrl.chooseWorkType = function() {
                modalWork.open({
                    callback: function(node) {
                        if (node.tid && node.text) {
                            $timeout(function() {
                                if (node.tid == "0") {
                                    delete $ctrl.WORKTYPE_NAME;
                                    delete $ctrl.WORKTYPE_ID;
                                } else {
                                    $ctrl.WORKTYPE_NAME = node.text;
                                    $ctrl.WORKTYPE_ID = node.tid;
                                }
                            })

                        }
                        modalWork.close();
                    },
                    selectedId: $ctrl.WORKTYPE_ID
                });
            };
            $ctrl.ok = function(form) {
                form.$setSubmitted(true);
                if (!form.$valid) {
                    return;
                }
                $ctrl.close({
                    $value: {
                        startTime: $ctrl.startTime,
                        autoWorkUnit: $ctrl.autoWorkUnit,
                        worktype_ID: $ctrl.WORKTYPE_ID,
                        WORKTYPE_NAME: $ctrl.WORKTYPE_NAME,
                        PICTURE: $ctrl.photos.join(),
                        decoration_onsiteinsp_id: $ctrl.checkOption
                    }
                });
            };
            $ctrl.cancel = function() {
                $ctrl.dismiss({
                    $value: $ctrl.item
                });
            };
        }]

    });

    // 验收组件
    app.component('inspec.checkModal', {
        templateUrl: '/view/decoration/inspectiontask/modal.inspectionCheck.html',
        bindings: {
            close: '&',
            dismiss: '&',
            resolve: '<'
        },
        controller: ['$scope', '$rootScope', '$http', '$timeout', 'fac', function($scope, $rootScope, $http, $timeout, fac) {
            var $ctrl = this;
            $ctrl.$onInit = function() {
            	fac.workTypeTree($scope,2);
                // 深拷贝 防止模态框变化引起table同步变化
                $ctrl.item = angular.copy($ctrl.resolve.item);

                $ctrl.showPhoto = $rootScope.showPhoto;
                $ctrl.addPhotos = $rootScope.addPhotos;
                $ctrl.delPhoto = $rootScope.delPhoto;
                $ctrl.processImgUrl = $rootScope.processImgUrl;
                $ctrl.photos = [];

                var searchObj = {
                //    parkId: $rootScope.park.id,
                	deptId: $rootScope.dept.id,
                    pageSize: 100, // 默认每页100条数据
                    pageIndex: 0,
                   

                };
                $http.post('/ovu-pcos/pcos/presOnSite/list.do', searchObj, fac.postConfig).then(function(res) {
                    //checkOptions
                    // console.log(res.data);
                    var data = res.data;
                    $ctrl.checkOptions = data.data;
                });
            };
            $ctrl.chooseWorkType = function() {
                modalWork.open({
                    callback: function(node) {
                        if (node.tid && node.text) {
                            $timeout(function() {
                                if (node.tid == "0") {
                                    delete $ctrl.WORKTYPE_NAME;
                                    delete $ctrl.WORKTYPE_ID;
                                } else {
                                    $ctrl.WORKTYPE_NAME = node.text;
                                    $ctrl.WORKTYPE_ID = node.tid;
                                }
                            })

                        }
                        modalWork.close();
                    },
                    selectedId: $ctrl.WORKTYPE_ID
                });
            };
            $ctrl.ok = function(form) {
                form.$setSubmitted(true);
                if (!form.$valid) {
                    return;
                }
                $ctrl.close({
                    $value: {
                        inspecCheckTime: $ctrl.inspecCheckTime,
                        suggest: $ctrl.suggest,
                        worktype_ID: $ctrl.WORKTYPE_ID,
                        WORKTYPE_NAME: $ctrl.WORKTYPE_NAME,
                        PICTURE: $ctrl.photos.join(),
                        decoration_onsiteinsp_id: $ctrl.checkOption,
                       
                    }
                });
            };
            $ctrl.cancel = function() {
                $ctrl.dismiss({
                    $value: $ctrl.item
                });
            };
        }]

    });
    app.service('decoration.commonService', function() {
        // 全选
        this.checkAll = function(pageModel) {
            pageModel.checked = !pageModel.checked;
            pageModel.data.forEach(function(n) {
                n.checked = pageModel.checked
            });
        };

        // 单选
        this.checkOne = function(item, pageModel) {
            item.checked = !item.checked;
            pageModel.checked = pageModel.data.every(function(v) {
                return v.checked;
            });
        };

        // 是否有选择
        this.hasChecked = function(pageModel) {
            if (pageModel && pageModel.data && pageModel.data.length) {
                return pageModel.data.filter(function(n) {
                    return n.checked
                }).length;
            }
            return false;
        };
    });

})(angular, document, window);