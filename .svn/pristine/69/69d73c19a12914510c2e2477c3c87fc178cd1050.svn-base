(function(doc, angular) {
    doc.title = "配件库";
    var app = angular.module('angularApp');

    app.controller('PartsLibCtrl', ['$scope', '$http', '$uibModal', '$log', 'fac', function($scope, $http, $uibModal, $log, fac) {
        var vm = this;
        $scope.search={};
        //项目id
        vm.projectId = null;

        // 获取项目列表
        $http.get('/ovu-base/system/park/tree.do')

        .success(function(data) {
            // console.log(data);

            vm.treeData = data;
        });
        // tree-view 配置 不需要编辑 排序 不能配置给 vm
        $scope.config = {
            edit: false,
            sort: false
        };
        //更换统一的项目选择器（修改）
        $scope.findPark = function () {
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: '/common/modal.select.parks.html',
                controller: 'parksSelectorCtrl',
                resolve: {
                    data: function () {
                        return { isOnly: true }
                    }
                }
            });
            modal.result.then(function (data) {
                //console.log(data);
                $scope.search.projectName = data.fullPath;
                $scope.search.projectId = data.id;
                getPartsList(data.id);
            }, function () {

            });
        }
        // 列表点击事件
      /*  $scope.selectNode = function(node) {
            if ($scope.curNode != node) {
                $scope.curNode && $scope.curNode.state && ($scope.curNode.state.selected = false);
            }
            node.state = node.state || {};
            node.state.selected = !node.state.selected;
            if (node.state.selected) {
                $scope.curNode = node;
                // 刷新配件列表
                vm.projectId = node.parkId;
                getPartsList(node.parkId);
            } else {
                delete $scope.curNode;
            }

        };*/
        // 刚加载页面没有数据
        vm.treeNotice = '请选择项目';
        vm.disabled = true;

        // 分页初始化
        vm.totalItems = 0;
        vm.currentDisplay = 0;

        // 根据id 获取配件列表
        function getPartsList(id) {
        	vm.projectId=id;
            $http.get('/ovu-pcos/pcos/parts/getList.do?projectId=' + id)
         
            .success(function(obj) {
                // console.log(obj);
                var data = obj.data.map(function(v) {
                    return {
                        position: v.position,
                        partName: v.partsName,
                        id: v.partsId                    
                    }
                });
                // 查询到空数组[] 就提示暂无数据
                vm.disabled = false;
                if (data.length === 0) {
                    vm.treeNotice = '暂无数据';
                }
                vm.partsList = data;
                //共多少数据
                vm.totalItems = vm.partsList.length;
                var pages = Math.ceil(vm.totalItems / vm.numPerPage);
                vm.selectablePages = getSelectPages(pages, 1);
            });
        }


        // 编辑前的备份数据
        var itemBak = null;
        viewArr = ['position', 'partName', 'id'];

        // 新增配件
        vm.toAdd = function() {
            // 打开模态框
            var newItem = {};
            viewArr.forEach(function(v) {
                newItem[v] = '';
            });
            var p = openEditModal(newItem, vm.partsList, true);
            p.then(function(item) {
                // 保存数据
                saveItem(item, vm.partsList);
            }, function(item) {
                // 取消
                cancelItem(item, vm.partsList);
            });
        };
        // 编辑
        vm.toEdit = function(item) {
            // 先备份数据
            itemBak = {};
            viewArr.forEach(function(v) {
                itemBak[v] = item[v];
            });
            // 打开模态框
            var p = openEditModal(item, vm.partsList);
            p.then(function(item) {
                // 保存数据
                saveItem(item, vm.partsList);
            }, function() {
                // 取消
                cancelItem(item, vm.partsList);
            });
        };
        // 删除
        vm.toDelete = function(item) {
            // openComponentModal 返回一个异步结果 promise
            var p = openConfirmModal();
            p.then(function() {
                deleteItem(vm.partsList, item);
            }, function() {
                // 取消
                $log.info('modal-component dismissed at: ' + new Date());
            });

        };

        // 确定删除模态框
        function openConfirmModal() {
            var modal = $uibModal.open({
                animation: true,
                component: 'confirmModalComponent',
                size: 'md'
            });
            // 返回一个promise
            return modal.result;
        };

        // 编辑模态框
        function openEditModal(item, list, isNewAdd) {
            var modal = $uibModal.open({
                animation: true,
                component: 'editModalComponent',
                size: 'md',
                resolve: {
                    item: function() {
                        // 给item 添加一个索引 用来标识
                        var index;
                        list.some(function(v, i) {
                            if (v === item) {
                                index = i;
                                return true;
                            }
                        });
                        item.index = index;
                        // 新增  list 里不要增加数据 不然 显示 一个空行
                        if (index === undefined) {
                            item.index = list.length;
                        }
                        return item;
                    },
                    title: function() {
                        if (isNewAdd) {
                            return '新增配件';
                        }
                        return '编辑配件';
                    }
                }
            });
            // 返回一个promise
            return modal.result;
        }

        // 保存数据
        function saveItem(item, list) {
            // trim 数据
            for (var key in item) {
                var value = item[key];
                if (angular.isString(value)) {
                    item[key] = value.trim();
                }
            }
            // 判断客户名称 customName 字段是否为空
            if (item.customName === '') {
                // alert('客户名称不能为空');
                return;
            }
            // 判断数据是否真的发生了变化
            var itemViewObj = {};
            viewArr.forEach(function(v) {
                itemViewObj[v] = item[v];
            });
            if (angular.equals(itemBak, itemViewObj)) {
                // console.log('数据没有变化');
                return;
            }
            // 保存数据
            console.log('post 数据 增加/修改');
            console.log(itemViewObj);
            var item = {
                "projectId": $scope.search.projectId,
                "partsId": itemViewObj.id,
                "partsName": itemViewObj.partName,
                "position": itemViewObj.position
            };

            $http.post('/ovu-pcos/pcos/parts/edit.do', item, fac.postConfig)

            .success(function(result) {
                if (!result.success) {
                    console.log(result.msg);
                } else {
                    itemBak = null;
                    getPartsList(vm.projectId);
                }
            });

        }
        // 取消操作
        function cancelItem(item, list) {
            if (itemBak) {
                list.splice(item.index, 1, itemBak);
            } else {
                list.splice(item.index, 1);
            }
        }

        // 删除数据
        function deleteItem(list, item) {
            var deleteIndex;
            //获取要删除的item的索引
            list.some(function(v, i) {
                if (v === item) {
                    deleteIndex = i;
                    return true;
                }
            });
            // 根据索引删除该条目数据
            if (deleteIndex !== undefined) {
                console.log('post 数据 增加/修改');
                $http.post('/ovu-pcos/pcos/parts/delete.do', {
                    "partsId": item.id
                }, fac.postConfig)

                .success(function(result) {
                    console.log(result);
                    if (!result.success) {
                        console.log(result.msg);
                    } else {
                        list.splice(deleteIndex, 1);
                    }
                });
            }
        }

        // 分页
        // 共多少条数据
        // vm.totalItems = vm.partsList.length;
        // 当前页码
        vm.currentPage = 1;

        vm.setPage = function(pageNo) {
            vm.currentPage = pageNo;
        };

        vm.pageChanged = function() {
            $log.log('Page changed to: ' + vm.currentPage);
        };
        // 最多显示多少页 5 -> 1 2 3 4 5
        vm.maxSize = 6;
        // 每页显示多少条数据
        vm.numPerPage = 20;
        // 得到select 可选的页码数组
        function getSelectPages(numPages, gap) {
            var arr = [];
            var num = Math.floor(numPages / gap);
            for (var i = 0; i < num; i++) {
                arr.push(gap * (i + 1));
            }
            return arr;
        }
        // 监听 currentPage 绑定到界面
        $scope.$watch('vm.currentPage * vm.totalItems * vm.numPerPage', function(newV) {
            var from = (vm.currentPage - 1) * vm.numPerPage + 1;
            var to = vm.currentPage * vm.numPerPage > vm.totalItems ? vm.totalItems : vm.currentPage * vm.numPerPage;
            if (parseInt(to) === 0) {
                vm.currentDisplay = '0';
            } else if (parseInt(from) === parseInt(to)) {
                vm.currentDisplay = '第' + from;
            } else {
                vm.currentDisplay = from + '-' + to;
            }
        });

    }]);

    // 自动获取焦点
    app.directive('autoFocus', ['$timeout', function($timeout) {
        return function(scope, elem, attrs) {
            scope.$watch(attrs.autoFocus, function(newV) {
                if (newV) {
                    $timeout(function() {
                        elem[0].focus();
                    }, 0, false);
                }
            })
        }
    }]);

    app.component('confirmModalComponent', {
        templateUrl: 'confirmModalComponent.html',
        bindings: {
            close: '&',
            dismiss: '&'
        },
        controller: function() {
            var $ctrl = this;
            $ctrl.ok = function() {
                $ctrl.close({
                    $value: ''
                });
            };
            $ctrl.cancel = function() {
                $ctrl.dismiss({
                    $value: 'cancel'
                });
            };
        }
    });

    app.component('editModalComponent', {
        templateUrl: 'editModalComponent.html',
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
                // 客户名称非空验证
                if ($ctrl.item.position.trim() !== '' && $ctrl.item.partName.trim() !== '') {
                    $ctrl.close({
                        $value: $ctrl.item
                    });
                } else {
                    // trim 数据
                    $ctrl.item.position = $ctrl.item.position.trim();
                    $ctrl.item.partName = $ctrl.item.partName.trim()
                }
            };
            $ctrl.cancel = function() {
                $ctrl.dismiss({
                    $value: $ctrl.item
                });
            };
        }
    });

})(document, angular)
