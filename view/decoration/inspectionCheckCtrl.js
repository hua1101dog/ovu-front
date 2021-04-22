(function(angular, document, win) {
    document.title = "巡检验收事项设置";

    var app = angular.module('angularApp');

    app.component('inspCheckApp', {
        templateUrl: '/view/decoration/inspectioncheck/inspectionCheckApp.html',
        controller: 'InspCheckCtrl',
        controllerAs: 'vm'
    });

    app.controller('InspCheckCtrl', ['$scope', '$rootScope', 'fac', 'decoration.inspCheckModalHelper', 'decoration.commonService',
        function($scope, $rootScope, fac, insModalHelper, commonService) {
			document.title = "巡检验收事项设置";
            var vm = this;
            vm.$onInit = function() {
                vm.parkId = '';
                vm.deptId = '';
                vm.pageModel = {};

                // 全选
                vm.checkAll = commonService.checkAll;
                // 单选
                vm.checkOne = commonService.checkOne;
                // 是否有选择
                vm.hasChecked = commonService.hasChecked;

                vm.find = function(fileName) {
                    var search = {
                    //    parkId: vm.parkId,
                        deptId: vm.deptId,
                        // currentPage: vm.pageModel.currentPage,
                        currentPage: 1,
                        numPerPage: vm.pageModel.numPerPage,
                        matterName: vm.searchMatterName
                    };
                    insModalHelper.find(search, vm);
                };
            };

            // 会话验证 判断是否需要登录
            app.modulePromiss.then(function() {
                /*vm.search = {};
                if (app.park) {
                    vm.parkId = app.park.ID;
                    vm.search.PARK_NAME = app.park.PARK_NAME;
                    // $rootScope.parkId = app.park.ID;
                }
                vm.search.isGroup = fac.isGroupVersion();
                vm.search.parkId = vm.parkId;
                vm.search.currentPage = 1;
                vm.search.numPerPage = 10;
                if (vm.search.isGroup) {
                    modalHelper.find(vm.search, vm);
                } else {
                    $scope.$watch(function() {
                        return $rootScope.park;
                    }, function(newValue, oldValue) {
                        if (newValue && newValue.id) {
                            vm.parkId = newValue.id;
                            vm.search.parkId = newValue.id;
                            vm.search.parkName = newValue.parkName;
                            modalHelper.find(vm.search, vm);
                        } else {
                            alert("请先选定一个项目");
                        }
                    });
                }*/
               //集团版、项目版合并，监控部门变化
	        //    $rootScope.$watch('dept', function (deptO, oldValue) {
	        	$scope.$watch(function() {
                        return $rootScope.dept;
                    }, function(deptO, oldValue) {
		            	if(!$scope.search){
		            		$scope.search = {};
		            	}
		            	var deptCopy = angular.copy(deptO);
		                if(deptCopy.id != $scope.search.deptId){
		                	$scope.search.deptId = deptCopy.id;
		                	vm.deptId = deptCopy.id;
		                	vm.parkId = deptCopy.parkId;
		                }
		                
	                	vm.search = {};
	                	vm.search.deptId = vm.deptId;
		                vm.search.currentPage = 1;
		                vm.search.numPerPage = vm.pageModel.numPerPage?vm.pageModel.numPerPage:10;
		                vm.matterName = vm.searchMatterName?vm.searchMatterName:'';
			            if($scope.search.deptId){
		                	insModalHelper.find(vm.search, vm);
		                }else{
		                	//清空表格
		                	vm.parkId = undefined;
		                	vm.pageModel.totalCount = 0;
		                	vm.pageModel.totalPage1;
		                	vm.pageModel.data = [];
		                }
	            },true)
            });


            // 选择每页（？）多少条数据
            vm.numSelect = function($event) {
                var search = {
                //    parkId: vm.parkId,
                	deptId: vm.deptId,
                    currentPage: 1,
                    numPerPage: $event.nowSelected,
                    matterName: vm.searchMatterName
                };
                insModalHelper.find(search, vm);
            };

            // 页码改变
            vm.pageChanged = function(e) {
                var search = {
                //    parkId: vm.parkId,
                    deptId: vm.deptId,
                    currentPage: e.currentPage,
                    numPerPage: vm.pageModel.numPerPage,
                    matterName: vm.searchMatterName
                };
                insModalHelper.find(search, vm);
            };

            vm.toAdd = function() {
                insModalHelper.addEdit(null, vm);
            };
            vm.toEdit = function(item) {
                insModalHelper.addEdit(item, vm);
            };
            vm.toDelete = function(item) {
                insModalHelper.del([item.id], "确认删除巡检验收事项: " + item.matterName + " 吗?", vm);
            };
            vm.toDelAll = function() {
                var ids = vm.pageModel.data.reduce(function(ret, n) {
                    n.checked && ret.push(n.id);
                    return ret
                }, []);

                insModalHelper.del(ids, "确认删除选中的 " + ids.length + " 条项目吗?", vm);
            };
        }
    ]);

    app.component('inspCheckEditModal', {
        templateUrl: '/view/decoration/inspectioncheck/modal.inspectionCheckEdit.html',
        bindings: {
            close: '&',
            dismiss: '&',
            resolve: '<'
        },
        controller: function($scope) {
            var $ctrl = this;
            $ctrl.$onInit = function() {
                // 深拷贝 防止模态框变化引起table同步变化
                $ctrl.item = angular.copy($ctrl.resolve.item);
                $ctrl.title = $ctrl.resolve.title;
                $ctrl.contentInvalid = false;
            };
            $ctrl.ok = function(form) {
                var val = angular.element('input.new-todo').val().trim();
                if (!!val) {
                    $ctrl.item.matterCotent.push({
                        title: val
                    });
                }
                var invalid = !$ctrl.item.matterCotent || !$ctrl.item.matterCotent.length;
                if (invalid) {
                    $ctrl.contentInvalid = true;
                    $scope.matterCotent = $ctrl.item.matterCotent;
                    var stop = $scope.$watch('matterCotent.length', function(newVal) {
                        if (newVal !== 0) {
                            $ctrl.contentInvalid = false;
                            stop();
                        }
                    });
                }
                form.$setSubmitted(true);
                if (!form.$valid) {
                    return;
                }
                if (invalid) {
                    return;
                }

                $ctrl.close({
                    $value: $ctrl.item
                });
            };
            $ctrl.cancel = function() {
                $ctrl.dismiss({
                    $value: $ctrl.item
                });
            };
        }
    });

    app.service('decoration.inspCheckHttpHelper', ['$http', '$q', 'fac', '$sce', function($http, $q, fac, $sce) {
        var getInspChecklistUrl = '/ovu-pcos/pcos/presOnSite/list.do',
            delteInspCheckUrl = '/ovu-pcos/pcos/presOnSite/batchdelete.do',
            addEditInspCheckUrl = '/ovu-pcos/pcos/presOnSite/edit.do';

        // 查询 和 搜索
        this.getList = function(search) {
            var currentPage = search.currentPage || 1; // 默认 显示第一页
            var searchObj = {
            //    parkId: search.parkId || '',
                deptId: search.deptId || '',
                pageSize: search.numPerPage || 20, // 默认每页20条数据
                pageIndex: currentPage - 1,
                onSitetName: search.matterName || ''
            };
            return $q(function(resolve, reject) {
                $http.post(getInspChecklistUrl, searchObj, fac.postConfig)

                .success(function(res) {
                    // 数据映射 方便查看前后端数据字段
                    var data = res.data.map(function(v) {
                        var content;
                        if (!v.onSiteNode) {
                            content = [];
                        }
                        try {
                            content = JSON.parse(v.onSiteNode);
                        } catch (err) {
                            content = [{
                                title: v.onSiteNode
                            }];
                        }
                        // if (!angular.isArray(content)) {
                        //     content = [{
                        //         title: JSON.stringify(content)
                        //     }];
                        // }
                        var contentBr = content.map(function(item) {
                            return item.title;
                        }).join('<br/>');
                        return {
                            id: v.id,
                            matterName: v.onSitetName,
                            matterCotent: content,
                            // matterCotentBr: $sce.trustAsHtml(contentBr)
                            matterCotentBr: contentBr
                        };
                    })
                    var pageModel = {
                        currentPage: res.pageIndex + 1,
                        numPerPage: res.pageSize,
                        totalCount: res.totalCount,
                        data: data
                    };
                    resolve(pageModel);
                }).error(function() {
                    reject('请求数据失败');
                });
            })
        };

        // 删除 fileIds '1,2,3'
        this.deleteFile = function(inspCheckIds) {
            return $http.post(delteInspCheckUrl, {
                id: inspCheckIds
            }, fac.postConfig);
        };
        // 编辑 新增
        this.addEditFile = function(id, deptId, name, content) {
            return $http.post(addEditInspCheckUrl, {
            //    parkId: parkId,
                deptId: deptId,
                id: id,
                onSitetName: name,
                onSiteNode: JSON.stringify(content)
            }, fac.postConfig);
        };
    }]);

    app.service('decoration.inspCheckModalHelper', ['$uibModal', 'decoration.inspCheckHttpHelper', function(
        $uibModal, httpHelper) {
        // 编辑模态框
        function openEditModal(item, isNewAdd) {
            var modal = $uibModal.open({
                animation: true,
                component: 'inspCheckEditModal',
                size: 'md',
                resolve: {
                    item: function() {
                        return item;
                    },
                    title: function() {
                        if (isNewAdd) {
                            return '新增标准';
                        }
                        return '编辑标准';
                    }
                }
            });
            // 返回一个promise
            return modal.result;
        }
        // 删除确认模态框
        function openConfirmModal(msg) {
            var modal = $uibModal.open({
                animation: true,
                component: 'decoration.ConfirmModal',
                size: 'md',
                resolve: {
                    msg: function() {
                        return msg;
                    }
                }
            });
            // 返回一个promise
            return modal.result;
        }
        // 获取数据封装 非纯函数
        this.find = function(search, vm) {
        	if(!vm.deptId){
        		alert("请选择部门");
        		return;
        	}
            httpHelper.getList(search).then(function(res) {
                vm.pageModel = res;
            });
        };
        // 添加 或者 编辑
        this.addEdit = function(item, vm) {
            var isNewAdd = false;
            if (!item) {
                isNewAdd = true;
                item = {
                    matterCotent: []
                };
            }
            var context = this;
            openEditModal(item, isNewAdd).then(function(item) {
                httpHelper.addEditFile(item.id, vm.deptId, item.matterName, item.matterCotent)

                .then(function(res) {
                    // console.log(res.data);
                    if (res.data.success) {
                        if (isNewAdd) {
                            // 后台没有排序 添加数据 要跳转到最后一页
                            // var lastPage = Math.ceil((vm.pageModel.totalCount + 1) / vm.pageModel.numPerPage);
                            // 后台已经排序 新增的都添加在第一条
                            var lastPage = 1;
                            vm.pageModel.currentPage = lastPage;
                        }
                        var search = {
                        //    parkId: vm.parkId,
                            deptId: vm.deptId,
                            currentPage: vm.pageModel.currentPage,
                            numPerPage: vm.pageModel.numPerPage,
                            matterName: vm.searchMatterName
                        };
                        context.find(search, vm);
                    }
                })
            }, function() {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
        // [id1,id2...] 删除数据
        this.del = function(ids, msg, vm) {
            var context = this;
            // openConfirmModal(msg).then(function() {
            //     httpHelper.deleteFile(ids.join()).then(function(res) {
            //         if (res.data.success) {
            //             var search = {
            //                 parkId: vm.parkId,
            //                 currentPage: vm.pageModel.currentPage,
            //                 numPerPage: vm.pageModel.numPerPage,
            //                 matterName: vm.searchMatterName
            //             };
            //             context.find(search, vm);
            //         } else {
            //             alert(res.data.error);
            //         }

            //     });

            // }, function() {
            //     console.info('Modal dismissed at: ' + new Date());
            // });

            confirm(msg, function() {
                httpHelper.deleteFile(ids.join()).then(function(res) {
                    if (res.data.success) {
                        var search = {
                        //    parkId: vm.parkId,
                            deptId: vm.deptId,
                            currentPage: vm.pageModel.currentPage,
                            numPerPage: vm.pageModel.numPerPage,
                            matterName: vm.searchMatterName
                        };
                        context.find(search, vm);
                    } else {
                        alert(res.data.error);
                    }

                });

            });
        };
    }]);
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