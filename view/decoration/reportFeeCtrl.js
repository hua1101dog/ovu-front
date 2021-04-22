(function(angular, document, win) {
    document.title = "报装收费项目管理";

    var app = angular.module('angularApp');

    app.component('reportFeeApp', {
        templateUrl: '/view/decoration/reportfee/reportFeeApp.html',
        controller: 'ReportFeeCtrl',
        controllerAs: 'vm'
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
    app.controller('ReportFeeCtrl', ['$rootScope', 'fac', 'decoration.reportFeeModalHelper', 'decoration.commonService',
        function($rootScope, fac, modalHelper, commonService) {
        	document.title = "报装收费项目管理";
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

                vm.findPark = $rootScope.findPark;

                vm.find = function(projectName, isRequired) {
                    var search = {
                        parkId: vm.parkId,
                        // currentPage: vm.pageModel.currentPage,
                        currentPage: 1,
                        numPerPage: vm.pageModel.numPerPage,
                        projectName: projectName,
                        isRequired: isRequired
                    };
                    modalHelper.find(search, vm);
                };
            };

            // 会话验证 判断是否需要登录
            app.modulePromiss.then(function() {
                if (app.park) {
                    vm.parkId = app.park.ID;
                }
                vm.search = {};
                vm.search.isGroup = fac.isGroupVersion();
                vm.search.parkId = vm.parkId;
                vm.search.currentPage = 1;
                vm.search.numPerPage = 10;
                modalHelper.find(vm.search, vm);
            });

            // 选择每页（？）多少条数据
            vm.numSelect = function($event) {
                var search = {
                    parkId: vm.parkId,
                    currentPage: 1,
                    numPerPage: $event.nowSelected,
                    projName: vm.searchFileName,
                    isRequired: vm.searchIsRequired
                };
                modalHelper.find(search, vm);
            };

            // 页码改变
            vm.pageChanged = function(e) {
                var search = {
                    parkId: vm.parkId,
                    currentPage: e.currentPage,
                    numPerPage: vm.pageModel.numPerPage,
                    projName: vm.searchFileName,
                    isRequired: vm.searchIsRequired
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
                modalHelper.del([item.id], "确认删除收费项目: " + item.name + " 吗?", vm);
            };
            vm.toDelAll = function() {
                var ids = vm.pageModel.data.reduce(function(ret, n) {
                    n.checked && ret.push(n.id);
                    return ret
                }, []);
                console.log(ids);
                modalHelper.del(ids, "确认删除选中的 " + ids.length + " 条项目吗?", vm);
            };

        }
    ]);

    app.component('reportFeeEditModal', {
        templateUrl: '/view/decoration/reportfee/modal.reportFeeEdit.html',
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

    app.service('decoration.reportFeeHttpHelper', ['$http', '$q', 'fac', function($http, $q, fac) {
        var getFeeProjlistUrl = '/ovu-pcos/pcos/presCharge/list.do',
            delteFeeProjUrl = '/ovu-pcos/pcos/presCharge/batchdelete.do',
            addEditFeeProjUrl = '/ovu-pcos/pcos/presCharge/edit.do';

        // 查询 和 搜索
        this.getList = function(search) {
            var currentPage = search.currentPage || 1; // 默认 显示第一页
            // begin 后台代码规范  字段名修改 
            // var searchObj = {
            //     parkId: search.parkId || '',
            //     pageSize: search.numPerPage || 20, // 默认每页20条数据
            //     pageIndex: currentPage - 1,
            //     name: search.projectName || '',
            //     isRequired: search.isRequired
            // };
            var searchObj = {
                parkId: search.parkId || '',
                pageSize: search.numPerPage || 20, // 默认每页20条数据
                pageIndex: currentPage - 1,
                chargeName: search.projectName || '',
                isRequired: search.isRequired
            };
            // end
            return $q(function(resolve, reject) {
                $http.post(getFeeProjlistUrl, searchObj, fac.postConfig)

                .success(function(res) {
                    // 数据映射 方便查看前后端数据字段
                    var data = res.data.map(function(v) {
                        // begin 后台代码规范  字段名修改 
                        // return {
                        //     id: v.projectId,
                        //     name: v.itmeName,
                        //     price: v.itemPrice,
                        //     priceUnit: v.itemUnit,
                        //     priceCycle: v.itemClcye,
                        //     priceCycleType: v.itemClcyeType,
                        //     chargeMethod: v.itemChargeType,
                        //     billMethod: v.itemChargeMode,
                        //     isMultiTier: v.itemIsPrice,
                        //     isOverdue: v.itemIsPay,
                        //     isRequired: v.itemIsRequired
                        // };
                        return {
                            id: v.id,
                            name: v.chargeName,
                            price: v.price,
                            priceUnit: v.unit,
                            priceCycle: v.cycle,
                            priceCycleType: v.cycleType,
                            chargeMethod: v.chargeType,
                            billMethod: v.chargeMode,
                            isMultiTier: v.isPrice,
                            isOverdue: v.isPay,
                            isRequired: v.isRequired
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
        this.deleteFile = function(ids) {
            // begin 后台代码规范  字段名修改
            // return $http.post(delteFeeProjUrl, {
            //     fileIds: ids
            // }, fac.postConfig);
            return $http.post(delteFeeProjUrl, {
                id: ids
            }, fac.postConfig);
            // end
        };
        // 编辑 新增
        this.addEditFile = function(id, name, price, priceUnit, chargeMethod, billMethod, priceCycleType, priceCycle, isRequired, isOverdue, isMultiTier, parkId) {
            // begin 后台代码规范  字段名修改
            // return $http.post(addEditFeeProjUrl, {
            //     partsId: id,
            //     changeName: name,
            //     price: price,
            //     unit: priceUnit,
            //     chargeType: chargeMethod,
            //     chargeMode: billMethod,
            //     cycleType: priceCycleType,
            //     cycle: priceCycle,
            //     isRequired: isRequired,
            //     isPay: isOverdue,
            //     isPrice: isMultiTier,
            //     parkId: parkId || 'af98a32c9b4d490297cadc2d85faf797'
            // }, fac.postConfig);
            return $http.post(addEditFeeProjUrl, {
                id: id,
                chargeName: name,
                price: price,
                unit: priceUnit,
                chargeType: chargeMethod,
                chargeMode: billMethod,
                cycleType: priceCycleType,
                cycle: priceCycle,
                isRequired: isRequired,
                isPay: isOverdue,
                isPrice: isMultiTier,
                parkId: parkId
            }, fac.postConfig);
            // end
        };
    }]);

    app.service('decoration.reportFeeModalHelper', ['$uibModal', 'decoration.reportFeeHttpHelper', function(
        $uibModal, httpHelper) {
        // 编辑模态框
        function openEditModal(item, isNewAdd) {
            var modal = $uibModal.open({
                animation: true,
                component: 'reportFeeEditModal',
                size: 'md',
                resolve: {
                    item: function() {
                        return item;
                    },
                    title: function() {
                        if (isNewAdd) {
                            return '新增报装收费项目';
                        }
                        return '编辑报装收费项目';
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
                // console.log(res);
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
                httpHelper.addEditFile(item.id, item.name, item.price, item.priceUnit, item.chargeMethod, item.billMethod, item.priceCycleType, item.priceCycle, item.isRequired, item.isOverdue, item.isMultiTier, vm.parkId)

                .then(function(res) {
                    // console.log(res.data);
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
                            projName: vm.searchFileName,
                            isRequired: vm.searchIsRequired
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
            //                 projName: vm.searchFileName,
            //                 isRequired: vm.searchIsRequired
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
                            projName: vm.searchFileName,
                            isRequired: vm.searchIsRequired
                        };
                        context.find(search, vm);
                    } else {
                        alert(res.data.error);
                    }

                });

            });
        };
    }]);
})(angular, document, window);