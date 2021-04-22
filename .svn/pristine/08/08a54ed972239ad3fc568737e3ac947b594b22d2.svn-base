(function(angular, document, win) {
    document.title = "报装协议";

    var app = angular.module('angularApp');


    app.component('reportProtApp', {
        templateUrl: '/view/decoration/reportprotocol/reportProtocolApp.html',
        controller: 'ReportProtCtrl',
        controllerAs: 'vm'
    });

    app.controller('ReportProtCtrl', ['$timeout', 'fac', 'decoration.reportProtModalHelper', 'decoration.commonService',
        function($timeout, fac, protolModalHelper, commonService) {
			document.title = "报装协议";
            var vm = this;

            vm.$onInit = function() {
                vm.parkId = '';
                vm.pageModel = {};

                vm.redOrder = null;

                // 全选
                vm.checkAll = commonService.checkAll;
                // 单选
                vm.checkOne = commonService.checkOne;
                // 是否有选择
                vm.hasChecked = commonService.hasChecked;

                vm.find = function(fileName) {
                    var search = {
                        parkId: vm.parkId,
                        // currentPage: vm.pageModel.currentPage,
                        currentPage: 1,
                        numPerPage: vm.pageModel.numPerPage,
                        protocolName: vm.searchProtocolName
                    };
                    protolModalHelper.find(search, vm);
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
                        protocolName: ''
                    };
                    protolModalHelper.find(search, vm);
                });
            };

            // 选择每页（？）多少条数据
            vm.numSelect = function($event) {
                var search = {
                    parkId: vm.parkId,
                    currentPage: 1,
                    numPerPage: $event.nowSelected,
                    protocolName: vm.searchProtocolName
                };
                protolModalHelper.find(search, vm);
            };

            // 页码改变
            vm.pageChanged = function(e) {
                var search = {
                    parkId: vm.parkId,
                    currentPage: e.currentPage,
                    numPerPage: vm.pageModel.numPerPage,
                    protocolName: vm.searchProtocolName
                };
                protolModalHelper.find(search, vm);
            };

            vm.toAdd = function() {
                protolModalHelper.addEdit(null, vm);
            };
            vm.toEdit = function(item) {
                protolModalHelper.addEdit(item, vm);
            };
            vm.toDelete = function(item) {
                protolModalHelper.del([item.protocolId], "确认删除协议: " + item.protocolName + " 吗?", vm);
            };
            vm.toDelAll = function() {
                var ids = vm.pageModel.data.reduce(function(ret, n) {
                    n.checked && ret.push(n.protocolId);
                    return ret
                }, []);

                protolModalHelper.del(ids, "确认删除选中的 " + ids.length + " 条项目吗?", vm);
            };
            // 保存排序
            vm.saveSort = function() {
                // var orders = vm.pageModel.data.map(function(item) {
                //     return item.orderIndex;
                // });
                // var check = checkUnique(orders);

                var check = vm.checkSortUnique();
                if (!check) {
                    alert('排序号不能相同, 请检查排序号！');
                    return;
                }

                var idIndexs = vm.pageModel.data.reduce(function(ret, n) {
                    ret.push(n.protocolId + ':' + n.orderIndex);
                    return ret
                }, []);
                idIndexs = idIndexs.length ? idIndexs.join() : '';
                protolModalHelper.saveSort(idIndexs, vm);

            };
            // 查重
            vm.checkSortUnique = function() {
                var orders = vm.pageModel.data.map(function(item) {
                    return item.orderIndex;
                });
                var check = checkUnique(orders);
                if (!check.isUnique) {
                    vm.redOrder = check.firstDupOrder;
                } else {
                    vm.redOrder = null;
                }
                return check.isUnique;
            };
            // 判断数组元素是否有重复值
            function checkUnique(arr) {
                var obj = {};
                var ret = {
                    isUnique: true
                };
                arr.some(function(item) {
                    if (!obj[item]) {
                        obj[item] = 1;
                    } else {
                        ret.isUnique = false;
                        ret.firstDupOrder = item;
                        return true;
                    }
                });
                return ret;
            }


        }
    ]);

    app.component('reportProtEditModal', {
        templateUrl: '/view/decoration/reportprotocol/modal.reportProtocolEdit.html',
        bindings: {
            close: '&',
            dismiss: '&',
            resolve: '<'
        },
        controller: function() {
            var $ctrl = this;
            var um;
            $ctrl.$onInit = function() {
                // 深拷贝 防止模态框变化引起table同步变化
                $ctrl.item = angular.copy($ctrl.resolve.item);
                $ctrl.title = $ctrl.resolve.title;
                // 打开富文本编辑器
                um = UM.getEditor('myEditor', {
                    initialFrameWidth: '100%',
                    // 不要删除 这是umeditor默认的所有配置项
                    // toolbar: [
                    //     'source | undo redo | bold italic underline strikethrough | superscript subscript | forecolor backcolor | removeformat |',
                    //     'insertorderedlist insertunorderedlist | selectall cleardoc paragraph | fontfamily fontsize',
                    //     '| justifyleft justifycenter justifyright justifyjustify |',
                    //     'link unlink | emotion image video  | map',
                    //     '| horizontal print preview fullscreen', 'drafts', 'formula'
                    // ]
                    toolbar: [
                        'source | undo redo | bold italic underline strikethrough | superscript subscript | forecolor backcolor | removeformat |',
                        'insertorderedlist insertunorderedlist | selectall cleardoc paragraph | fontfamily fontsize',
                        '| justifyleft justifycenter justifyright justifyjustify |',
                        'link unlink | emotion ',
                        '| horizontal'
                    ]

                });
                um.setContent("");
                // 先清空编辑器
                // um.execCommand('cleardoc');
                // 设置左对齐
                // um.execCommand('justify', 'left');
                // 内容插入编辑器
                // um.execCommand('insertHtml', $ctrl.item.protocolContent);
                if ($ctrl.item.protocolContent) {
                    um.setContent($ctrl.item.protocolContent);
                }
                // 富文本 超链接 点击事件
                $('body').delegate('.UM-Editor  .edui-body-container a','click',function(){
                    window.open(this.href);
                });

            };
            $ctrl.ok = function(form) {
                form.$setSubmitted(true);
                if (!form.$valid) {
                    return;
                }
                if (!um.hasContents()) {
                    alert('协议内容不能为空！');
                    return;
                }
                // 获取富文本内容
                // var content = UM.getEditor('myEditor').getContent();
                var content = um.getContent();
                win.str = content;
                // 去除编辑器末尾添加的空行

                // console.log(content);
                $ctrl.item.protocolContent = content.split('<p><br/></p>')[0];

                // 关闭编辑器
                // UM.delEditor('myEditor');
                um.destroy();


                $ctrl.close({
                    $value: $ctrl.item
                });
            };
            $ctrl.cancel = function() {
                $ctrl.dismiss({
                    $value: $ctrl.item
                });
                // 关闭编辑器
                // UM.delEditor('myEditor');
                um.destroy();
            };
            // 解绑代理事件
            $ctrl.$onDestroy = function(){
                $('body').undelegate();
            };
        }
    });

    app.service('decoration.reportProtHttpHelper', ['$http', '$q', 'fac', function($http, $q, fac) {
        var getProtolistUrl = '/ovu-pcos/pcos/presAgree/list.do',
            delteProtoUrl = '/ovu-pcos/pcos/presAgree/batchdelete.do',
            addEditProtoUrl = '/ovu-pcos/pcos/presAgree/edit.do';

        var saveSortUrl = '/ovu-pcos/pcos/presAgree/saveOrder.do';

        // 查询 和 搜索
        this.getList = function(search) {
            var currentPage = search.currentPage || 1; // 默认 显示第一页
            // begin 后台代码规范  字段名修改
            // var searchObj = {
            //     parkId: search.parkId || '',
            //     pageSize: search.numPerPage || 20, // 默认每页20条数据
            //     pageIndex: currentPage - 1,
            //     name: search.protocolName || ''
            // };
            var searchObj = {
                parkId: search.parkId || '',
                pageSize: search.numPerPage || 20, // 默认每页20条数据
                pageIndex: currentPage - 1,
                agreementName: search.protocolName || ''
            };
            // end
            return $q(function(resolve, reject) {
                $http.post(getProtolistUrl, searchObj, fac.postConfig)

                .success(function(res) {
                    // 数据映射 方便查看前后端数据字段
                    var data = res.data.map(function(v) {
                        // begin 后台代码规范  字段名修改
                        // return {
                        //     protocolId: v.aid,
                        //     protocolName: v.dname,
                        //     protocolContent: v.dnode,
                        //     orderIndex: v.onum
                        // };
                        return {
                            protocolId: v.id,
                            protocolName: v.agreementName,
                            protocolContent: v.agreementNode,
                            orderIndex: v.orderNum
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
        this.deleteFile = function(protoIds) {
            // begin 后台代码规范  字段名修改
            // return $http.post(delteProtoUrl, {
            //     fileIds: protoIds
            // }, fac.postConfig);
            return $http.post(delteProtoUrl, {
                id: protoIds
            }, fac.postConfig);
            // end
        };
        // 编辑 新增
        this.addEditFile = function(id, name, content, orderIndex) {
            // begin 后台代码规范  字段名修改
            // return $http.post(addEditProtoUrl, {
            //     partsId: id,
            //     agreementName: name,
            //     agreementNode: content,
            //     orderId: orderIndex
            // }, fac.postConfig);
            return $http.post(addEditProtoUrl, {
                id: id,
                agreementName: name,
                agreementNode: content,
                orderNum: orderIndex
            }, fac.postConfig);
            // end
        };

        // 保存排序
        this.saveSort = function(idIndexs) {
            // begin 后台代码规范  字段名修改
            // return $http.post(saveSortUrl, {
            //     orderStr: idIndexs
            // }, fac.postConfig);
            return $http.post(saveSortUrl, {
                orderNum: idIndexs
            }, fac.postConfig);
            // end
        };
    }]);

    app.service('decoration.reportProtModalHelper', ['$uibModal', 'decoration.reportProtHttpHelper', function(
        $uibModal, httpHelper) {
        // 编辑模态框
        function openEditModal(item, isNewAdd) {
            var modal = $uibModal.open({
                animation: true,
                component: 'reportProtEditModal',
                size: 'lg',
                resolve: {
                    item: function() {
                        return item;
                    },
                    title: function() {
                        if (isNewAdd) {
                            return '新增报装协议';
                        }
                        return '编辑报装协议';
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
                vm.checkSortUnique(); // 查重
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
                // console.log(item);
                httpHelper.addEditFile(
                    item.protocolId,
                    item.protocolName,
                    item.protocolContent,
                    item.orderIndex)

                .then(function(res) {
                    // console.log(res.data);
                    if (res.data.success) {
                        if (isNewAdd) {
                            // 添加数据 要跳转到最后一页   新增在最后一条
                            var lastPage = Math.ceil((vm.pageModel.totalCount + 1) / vm.pageModel.numPerPage);
                            // 后台排序 新增在第一条
                            // var lastPage = 1;
                            vm.pageModel.currentPage = lastPage;
                        }
                        var search = {
                            parkId: vm.parkId,
                            //新增跳到最后一页，4952 【装修管理-报装协议】新增协议后，跳转界面页码不正确
                        //    currentPage: vm.pageModel.currentPage,
                        	//新增跳到第一页
                        	currentPage: 1,
                            numPerPage: vm.pageModel.numPerPage,
                            protocolName: vm.searchProtocolName
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
            //                 protocolName: vm.searchProtocolName
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
                            protocolName: vm.searchProtocolName
                        };
                        context.find(search, vm);
                    } else {
                        alert(res.data.error);
                    }

                });

            });
        };
        // 保存排序
        this.saveSort = function(idIndexs, vm) {
            httpHelper.saveSort(idIndexs).then(function(res) {
                // console.log(res.data);
                if (res.data.success) {
                    var search = {
                        parkId: vm.parkId,
                        currentPage: vm.pageModel.currentPage,
                        numPerPage: vm.pageModel.numPerPage,
                        // protocolName: vm.searchProtocolName
                    };
                    // modalHelper.find(search, vm);
                    httpHelper.getList(search).then(function(res) {
                        vm.pageModel = res;
                    });
                }
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