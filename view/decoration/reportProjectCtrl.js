(function(angular, document, win) {
    document.title = "报装项目";

    var app = angular.module('angularApp');

    app.component('reportProjApp', {
        templateUrl: '/view/decoration/reportproject/reportProjectApp.html',
        controller: 'ReportProjCtrl',
        controllerAs: 'vm'
    });
    app.service('decoration.reportProjHttpHelper', ['$http', '$q', 'fac', function($http, $q, fac) {
        var getProjlistUrl = '/ovu-pcos/pcos/pres/list.do',
            delteProjUrl = '/ovu-pcos/pcos/pres/batchdelete.do',
            addEditProjUrl = '/ovu-pcos/pcos/pres/edit.do';

        // 查询 和 搜索
        this.getList = function(search) {
            var currentPage = search.currentPage || 1; // 默认 显示第一页
            var searchObj = {
                parkId: search.parkId || '',
                pageSize: search.numPerPage || 20, // 默认每页20条数据
                pageIndex: currentPage - 1
            };
            return $q(function(resolve, reject) {
                $http.post(getProjlistUrl, searchObj, fac.postConfig)

                .success(function(res) {
                    // 数据映射 方便查看前后端数据字段
                    var data = res.data.map(function(v) {
                        // begin 后台代码规范  字段名修改 

                        // return {
                        //     projId: v.id,
                        //     projName: v.proname,
                        //     projDesc: v.prodesc
                        // };

                        return {
                            projId: v.id,
                            projName: v.projectName,
                            projDesc: v.projectDesc
                        };
                        // end 
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
        this.deleteFile = function(projIds) {
            // begin 后台代码规范 修改字段名
            // return $http.post(delteProjUrl, {
            //     fileIds: projIds
            // }, fac.postConfig);
            return $http.post(delteProjUrl, {
                id: projIds
            }, fac.postConfig);
            // end
        };
        // 编辑 新增
        this.addEditFile = function(id, name, desc) {
            // begin 后台代码规范 修改字段名
            // return $http.post(addEditProjUrl, {
            //     projectId: id,
            //     projectName: name,
            //     projectDesc: desc
            // }, fac.postConfig);
            return $http.post(addEditProjUrl, {
                id: id,
                projectName: name,
                projectDesc: desc
            }, fac.postConfig);
            // end
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
    app.service('decoration.reportProjModalHelper', ['$uibModal', 'decoration.reportProjHttpHelper', function(
        $uibModal, httpHelper) {
        // 编辑模态框
        function openEditModal(item, isNewAdd) {
            var modal = $uibModal.open({
                animation: true,
                component: 'reportProjEditModal',
                size: 'md',
                resolve: {
                    item: function() {
                        return item;
                    },
                    title: function() {
                        if (isNewAdd) {
                            return '新增报装项目';
                        }
                        return '编辑报装项目';
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
            httpHelper.getList(search).then(function(res) {
                vm.pageModel = res;
            });
        };
        // 添加 或者 编辑
        this.addEdit = function(item, vm) {
            var isNewAdd = false;
            if (!item) {
                isNewAdd = true;
                item = {};
            }
            var context = this;
            openEditModal(item, isNewAdd).then(function(item) {
                httpHelper.addEditFile(item.projId, item.projName, item.projDesc)

                .then(function(res) {
                    if (res.data.success) {
                        if (isNewAdd) {
                            // 添加数据 要跳转到最后一页 后台没有排序 新增在最后一条
                            // var lastPage = Math.ceil((vm.pageModel.totalCount + 1) / vm.pageModel.numPerPage);
                            // 后台排序 新增在第一条
                            var lastPage = 1;
                            vm.pageModel.currentPage = lastPage;
                        }
                        var search = {
                            parkId: vm.parkId,
                            currentPage: vm.pageModel.currentPage,
                            numPerPage: vm.pageModel.numPerPage,
                            // fileName: vm.searchFileName
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
            //                 // fileName: vm.searchFileName
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
                            parkId: vm.parkId,
                            currentPage: vm.pageModel.currentPage,
                            numPerPage: vm.pageModel.numPerPage,
                            // fileName: vm.searchFileName
                        };
                        context.find(search, vm);
                    } else {
                        alert(res.data.error);
                    }

                });

            });
        };
    }]);
    app.controller('ReportProjCtrl', ['fac', 'decoration.reportProjHttpHelper',
        'decoration.reportProjModalHelper', 'decoration.commonService',
        function(fac, httpHelper, modalHelper, commonService) {
        	document.title = "报装项目";
            var vm = this;
            vm.$onInit = function() {
                vm.parkId = '';
                vm.pageModel = {};

                // 全选
                vm.checkAll = commonService.checkAll;
                // 单选
                vm.checkOne = commonService.checkOne;
                // 是否有选择
                vm.hasChecked = commonService.hasChecked;

                vm.find = function(fileName) {
                    var search = {
                        parkId: vm.parkId,
                        currentPage: vm.pageModel.currentPage,
                        numPerPage: vm.pageModel.numPerPage,
                    };
                    modalHelper.find(search, vm);
                };
            };

            // 会话验证 判断是否需要登录
            app.modulePromiss.then(function() {
                if (app.park) {
                    vm.parkId = app.park.ID;
                }
                var search = {
                    parkId: vm.parkId,
                    currentPage: 1,
                    numPerPage: 10,
                };
                modalHelper.find(search, vm);
            });

            // 选择每页（？）多少条数据
            vm.numSelect = function($event) {
                var search = {
                    parkId: vm.parkId,
                    currentPage: 1,
                    numPerPage: $event.nowSelected
                };
                modalHelper.find(search, vm);
            };

            // 页码改变
            vm.pageChanged = function(e) {
                var search = {
                    parkId: vm.parkId,
                    currentPage: e.currentPage,
                    numPerPage: vm.pageModel.numPerPage
                };
                modalHelper.find(search, vm);
            };

            vm.toAdd = function() {
                modalHelper.addEdit(null, vm);
            };
            vm.toEdit = function(item) {
                modalHelper.addEdit(item, vm);
            };
            vm.toDelete = function(item) {
                modalHelper.del([item.projId], "确认删除项目: " + item.projName + " 吗?", vm);
            };
            vm.toDelAll = function() {
                var ids = vm.pageModel.data.reduce(function(ret, n) {
                    n.checked && ret.push(n.projId);
                    return ret
                }, []);

                modalHelper.del(ids, "确认删除选中的 " + ids.length + " 条项目吗?", vm);
            };

        }
    ]);

    app.component('reportProjEditModal', {
        templateUrl: '/view/decoration/reportproject/modal.reportProjectEdit.html',
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
                $ctrl.title = $ctrl.resolve.title;
            };
            $ctrl.ok = function(form) {
                form.$setSubmitted(true);
                if (!form.$valid) {
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

   

})(angular, document, window);