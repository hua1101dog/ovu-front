/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller("groupCtrl", function(
        $scope,
        $rootScope,
        $http,
        $filter,
        $uibModal,
        fac
    ) {
        document.title = "OVU-分组管理";

        $scope.search = {};
        $scope.pageModel = {};

        $scope.tree_group = [];
        $scope.persons = [];
        $scope.searchs = {};
        $scope.find = function(pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.groupTypeId = $scope.searchs.groupTypeId;
            fac.getPageResult(
                "/ovu-pcos/pcos/newknowledge/group/page",
                $scope.search,
                function(data) {
                    $scope.pageModel = data;
                    $scope.pageModel.checked = false;
                    $scope.pageModel.data &&
                        $scope.pageModel.data.length &&
                        $scope.pageModel.data.forEach(v => {
                            v.checked = false;
                        });
                }
            );
        };
        app.modulePromiss.then(function() {
            $scope.$watch("dept.id", function(deptId, oldValue) {
                if (deptId) {
                    $scope.search.deptId = deptId;
                    $scope.searchs = {};
                }
                loadGroupTree();
                $scope.find(1);
            });
        });

        function loadGroupTree() {
            $http
                .post("/ovu-pcos/pcos/newknowledge/group/type/tree", {
                    deptId: $scope.search.deptId
                })
                .success(function(res) {
                    $scope.tree_group = res.data || [];
                    if ($scope.tree_group.length) {
                    } else {
                        $scope.pageModel = {};
                    }
                });
        }

        $scope.addTopNode = function() {
            $scope.tree_group = $scope.tree_group || [];
            $scope.tree_group.push({
                state: {
                    edit: true
                },
                copy: {}
            });
        };

        //新增子节点
        $scope.addSon = function(node) {
            node.nodes = node.nodes || [];
            node.state = node.state || {};
            node.state.expanded = true;

            node.nodes.push({
                parentId: node.id,
                state: {
                    edit: true
                },
                copy: {
                    parentId: node.id
                }
            });
        };
        //选择该节点
        $scope.selectNode = function(search, node) {
            if (node.state.selected) {
                $scope.find(1, node.id);
            }
        };
        //删除节点
        $scope.delNode = function(node) {
            if (node.nodes && node.nodes.length) {
                alert("此节点有下级节点,不能删除！");
            } else {
                confirm("确定删除 " + node.text, function() {
                    $http
                        .get(
                            "/ovu-pcos/pcos/newknowledge/group/type/delete/" +
                                node.id
                        )
                        .success(function(resp) {
                            if (resp.code == 0) {
                                if ($scope.curNode == node) {
                                    delete $scope.curNode;
                                }
                                var parent =
                                    node.parentId &&
                                    fac.getNodeById(
                                        $scope.tree_group,
                                        node.parentId
                                    );
                                if (parent) {
                                    parent.nodes.splice(
                                        parent.nodes.indexOf(node),
                                        1
                                    );
                                } else {
                                    $scope.tree_group.splice(
                                        $scope.tree_group.indexOf(node),
                                        1
                                    );
                                }
                                msg(resp.msg);
                            } else {
                                alert(resp.msg);
                            }
                        });
                });
            }
        };
        //保存节点
        $scope.save = function(node) {
            if (fac.isNotEmpty(node.copy.text)) {
                var group = {};
                group.name = node.copy.text;
                group.groupTypeId = node.copy.id;
                group.parentId = node.copy.parentId;
                group.deptId = $scope.search.deptId;
                $http
                    .post("/ovu-pcos/pcos/newknowledge/group/type/edit", group)
                    .success(function(resp) {
                        if (resp.code == "0") {
                            msg(resp.msg);
                            node.id = resp.data.groupTypeId;
                            node.parentId = resp.data.parentId;
                            node.text = resp.data.name;
                            node.state.edit = false;
                        } else {
                            alert(resp.msg);
                        }
                    });
            }
        };
        //撤销
        $scope.undo = function(node) {
            if (node.id) {
                node.state.edit = false;
            } else {
                //获取父节点
                var parent =
                    node.parentId &&
                    fac.getNodeById($scope.tree_group, node.parentId);
                //如果有父节点，则从父节点的子list中删除
                if (parent) {
                    parent.nodes.splice(parent.nodes.indexOf(node), 1);
                } else {
                    $scope.tree_group.splice(
                        $scope.tree_group.indexOf(node),
                        1
                    );
                }
            }
        };
        //修改节点
        $scope.$parent.editNode = function(node) {
            node.copy = angular.extend({}, node);
            node.state = node.state || {};
            node.state.edit = true;
        };

        $scope.selectNode = function(search, node) {
            if (node.state.selected) {
                $scope.search.groupTypeId = node.id;
                $scope.find(1, node.id);
            }
        };

        //导出分组
        $scope.exportGroup = function() {
            var ids = $scope.pageModel.list.reduce(function(ret, n) {
                n.checked && ret.push(n.id);
                return ret;
            }, []);
            if (!ids.length) {
                alert("请选择数据");
                return;
            }

            var url = "/ovu-pcos/pcos/newknowledge/group/export/" + ids.join();

            window.location.href = url;
            $scope.find(1);
        };
        $scope.showModal = function(item) {
            var copy = angular.extend(
                { tree_group: $scope.tree_group, deptId: $scope.search.deptId },
                item
            );
            if (!copy.groupTypeId) {
                if ($scope.search.groupTypeId) {
                    copy.groupTypeId = $scope.search.groupTypeId || "";
                }
            }
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "/view/knowledge/group/modal.editGroup.html",
                controller: "editGroupCtrl",
                resolve: { group: copy }
            });
            modal.result.then(
                function() {
                    $scope.find();
                },
                function() {
                    console.info("Modal dismissed at: " + new Date());
                }
            );
        };
        //
        //批量删除分组
        $scope.delAll = function() {
            var ids = $scope.pageModel.list.reduce(function(ret, n) {
                n.checked && ret.push(n.id);
                return ret;
            }, []);
            doDel(ids.join());
        };
        //删除分组
        $scope.del = function(item) {
            doDel(item.id);
        };
        function doDel(id) {
            confirm("确认删除选中的分组吗?", function() {
                $http
                    .get("/ovu-pcos/pcos/newknowledge/group/delete/" + id)
                    .success(function(data) {
                        if (data.code == 0) {
                            $scope.find();
                        } else {
                            alert(data.msg);
                        }
                    });
            });
        }
    });
    app.controller("editGroupCtrl", function(
        $scope,
        $http,
        $uibModalInstance,
        $filter,
        fac,
        group,
        $uibModal,
        $rootScope
    ) {
        $scope.item = group;
        $scope.item.pageModel = {};
        $scope.item.eliminateList = [];
        $scope.item.selectPostIds = [];
        var notInIds = [];
        if (group.id) {
            //编辑
            $http
                .get("/ovu-pcos/pcos/newknowledge/group/get/" + group.id)
                .success(res => {
                    var json = JSON.parse(res.data.member);
                    $scope.item.pageModel.data = json.personList;
                    $scope.item.posts = json.postList;
                    $scope.item.depts = json.deptList;
                    $scope.item.eliminateList = json.excludePersonList || [];
                    if ($scope.item.eliminateList.length) {
                        notInIds = $scope.item.eliminateList.reduce(function(
                            ret,
                            n
                        ) {
                            ret.push(n.id);
                            return ret;
                        },
                        []);
                    }
                    if (json.postList && json.postList.length) {
                        $scope.item.selectPostIds = json.postList.reduce(
                            function(ret, n) {
                                ret.push(n.id);
                                return ret;
                            },
                            []
                        );
                        $scope.item.selectIds = $scope.item.selectPostIds.join(
                            ","
                        );
                        if (notInIds.length) {
                            $scope.find(1, {
                                postIds: $scope.item.selectIds,
                                notInIds: notInIds.join(",")
                            });
                        } else {
                            $scope.find(1, {
                                postIds: $scope.item.selectIds
                            });
                        }
                    }
                    if (json.deptList && json.deptList.length) {
                        $scope.item.depts.forEach(v => {
                            v.fullPath = v.parentName + " > " + v.deptName;
                        });
                        var ids = json.deptList.reduce(function(ret, n) {
                            ret.push(n.id);
                            return ret;
                        }, []);
                        $scope.item.selectDeptIds = ids.join(",");
                        if (notInIds.length) {
                            $scope.find(1, {
                                deptIds: $scope.item.selectDeptIds,
                                notInIds: notInIds.join(",")
                            });
                        } else {
                            $scope.find(1, {
                                deptIds: $scope.item.selectDeptIds
                            });
                        }
                    }
                });
        }

        //人员列表
        $scope.find = function(pageNo, param) {
            angular.extend(param, {
                currentPage: pageNo || $scope.item.pageModel.currentPage || 1,
                pageSize: $scope.item.pageModel.pageSize || 10
            });

            fac.getPageResult(
                "/ovu-pcos/pcos/newknowledge/group/queryPersonListByDeptIdAndPostId",
                param,
                function(data) {
                    $scope.item.pageModel = data;
                }
            );
        };
        //通过部门/岗位查人员
        function getPersonIds(params) {
            $scope.find(1, params);
        }

        $scope.groupTree = group.tree_group;
        //选择分组方式
        $scope.chooseGroupWay = function(value, item) {
            item.pageModel = {};
            item.posts = [];
            item.selectIds = "";
            item.depts = [];
            item.selectDeptIds = "";
            item.eliminateList = [];
            if (value == "2") {
                //岗位建组
                $scope.showPostDetail(item);
            } else if (value == "3") {
                //组织架构建组
                $scope.showJgDetail(item);
            } else {
                //导入建组

                uploadExcel(function(resp) {
                    if (resp.passCode == 0) {
                        $scope.item.pageModel = resp;

                        rtmsg();
                    }
                });
            }
        };
        //导入
        function rtmsg() {
            $scope.workcopyMsg = "导入成功！";
            msg("导入成功！");
            $scope.$apply();
        }

        function uploadExcel(fn) {
            fac.upload(
                {
                    url: "/ovu-pcos/pcos/newknowledge/examine/importPerson",
                    accept:
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                },
                function(resp) {
                    if (resp.success) {
                        fn && fn(resp);
                    } else {
                        alert(resp.error);
                    }
                }
            );
        }
        //下载模板
        $scope.downloadFile = function(e) {
            e.stopPropagation();
            var url = "/ovu-pcos/pcos/newknowledge/examine/downloadExcel";
            getBlankTmpl(url);
        };

        function getBlankTmpl(url) {
            var elemIF = document.createElement("iframe");
            elemIF.src = url;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
        }
        //查看组织架构
        $scope.showJgDetail = function(item) {
            var copy = angular.extend({}, item);
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "/view/knowledge/group/modal.showJg.html",
                controller: "editJgCtrl",
                resolve: { jg: copy }
            });
            modal.result.then(
                function(data) {
                    item.depts = data.selectDept;
                    var ids = item.depts.reduce(function(ret, n) {
                        ret.push(n.id);
                        return ret;
                    }, []);
                    item.selectDeptIds = ids.join(",");
                    // eliminateList
                    if (data.eliminateList && data.eliminateList.length) {
                        var notInIds = data.eliminateList.reduce(function(
                            ret,
                            n
                        ) {
                            ret.push(n.id);
                            return ret;
                        },
                        []);
                        getPersonIds({
                            deptIds: ids.join(","),
                            notInIds: notInIds.join(",")
                        });
                    } else {
                        getPersonIds({
                            deptIds: ids.join(",")
                        });
                    }
                },
                function() {
                    console.info("Modal dismissed at: " + new Date());
                }
            );
        };
        //查看岗位
        $scope.showPostDetail = function(item) {
            var copy = angular.extend({ deptId: group.deptId }, item);
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "/view/knowledge/group/modal.showPost.html",
                controller: "editPostCtrl",
                resolve: { post: copy }
            });
            modal.result.then(
                function(data) {
                    item.posts = data.selectPost;
                    var ids = item.posts.reduce(function(ret, n) {
                        ret.push(n.id);
                        return ret;
                    }, []);
                    item.selectIds = ids.join(",");
                    if (data.eliminateList && data.eliminateList.length) {
                        var notInIds = data.eliminateList.reduce(function(
                            ret,
                            n
                        ) {
                            ret.push(n.id);
                            return ret;
                        },
                        []);
                        getPersonIds({
                            postIds: item.selectIds,
                            notInIds: notInIds.join(",")
                        });
                    } else {
                        getPersonIds({ postIds: item.selectIds });
                    }
                },
                function() {
                    console.info("Modal dismissed at: " + new Date());
                }
            );
        };
        //岗位分组/组织架构 分组查看员工
        $scope.showEmployees = function(item) {
            var copy = angular.extend({}, item);
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "/view/knowledge/group/modal.showEmployees.html",
                controller: "editEmployeesCtrl",
                resolve: { employee: copy }
            });
            modal.result.then(
                function(data) {
                    item.pageModel.data = data.selectPerson;
                    item.eliminateList = data.eliminateList;
                },
                function() {
                    console.info("Modal dismissed at: " + new Date());
                }
            );
        };
        //导入分组 查看员工
        $scope.showEmployeesByInput = function(item) {
            var copy = angular.extend({}, item);
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl:
                    "/view/knowledge/group/modal.showEmployeesByImport.html",
                controller: "editEmployeesCtrlByImport",
                resolve: { employee: copy }
            });
            modal.result.then(
                function(data) {
                    item.pageModel.data = data.selectPerson;
                },
                function() {
                    console.info("Modal dismissed at: " + new Date());
                }
            );
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
        $scope.save = function(form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            var params = {};
            if (item.mode == 1) {
                if (!item.pageModel.data || !item.pageModel.data.length) {
                    alert("请导入人员");
                    return;
                }
            } else if (item.mode == 2) {
                if (!item.posts || !item.posts.length) {
                    alert("请选择岗位");
                    return;
                }
            } else {
                if (!item.depts.length) {
                    alert("请选择组织架构");
                    return;
                }
            }
            params.groupTypeId = item.groupTypeId;
            params.deptId = group.deptId;
            params.mode = item.mode;
            params.text = item.text;
            params.desp = item.desp;
            params.member = {};
            var param;
            params.id = item.id;
            param = { param: {} };

            //新增
            param.mode = params.mode;

            if (params.mode == 1) {
                //导入建组
                var personId = item.pageModel.data.reduce(function(ret, n) {
                    ret.push(n.id);
                    return ret;
                }, []);
                param.param = { personId: personId };
            } else {
                if (params.mode == 2) {
                    //岗位建组

                    param.param.deptId = group.deptId;
                    var postId = item.posts.reduce(function(ret, n) {
                        ret.push(n.id);
                        return ret;
                    }, []);

                    param.param.postId = postId;
                } else {
                    //组织架构建组
                    var deptIds = item.depts.reduce(function(ret, n) {
                        ret.push(n.id);
                        return ret;
                    }, []);
                    param.param.deptId = deptIds;
                }
                var excludePersonId = item.eliminateList.reduce(function(
                    ret,
                    n
                ) {
                    ret.push(n.id);
                    return ret;
                },
                []);
                param.param.excludePersonId = excludePersonId;
            }

            params.member = JSON.stringify(param);

            $http
                .post("/ovu-pcos/pcos/newknowledge/group/edit", params)
                .success(function(resp) {
                    if (resp.code == 0) {
                        msg(resp.msg);
                        $uibModalInstance.close();
                    } else {
                        layer.open({
                            type: 1,
                           
                            title: false,
                            closeBtn: 1,
                            content: resp.msg
                          });
                    }
                });
        };
    });
    //查看员工
    app.controller("editEmployeesCtrl", function(
        $scope,
        $http,
        $uibModalInstance,
        $filter,
        fac,
        employee,
        $uibModal,
        $rootScope
    ) {
        $scope.item = employee;
        $scope.search = {};
        $scope.item.pageModel = employee.pageModel || {};
        $scope.eliminateList = employee.eliminateList.concat() || []; //剔除列表
        if ($scope.eliminateList.length) {
            var ids = $scope.item.eliminateList.reduce(function(ret, n) {
                ret.push(n.id);
                return ret;
            }, []);
            $scope.search.notInIds = ids.join(",");
        }
        //人员列表
        $scope.find = function(pageNo) {
            angular.extend($scope.search, {
                currentPage: pageNo || $$scope.item.pageModel.currentPage || 1,
                pageSize: $scope.item.pageModel.pageSize || 10
            });

            if (employee.mode == 2) {
                $scope.search.postIds = employee.selectIds;
            } else {
                $scope.search.deptIds = employee.selectDeptIds;
            }

            fac.getPageResult(
                "/ovu-pcos/pcos/newknowledge/group/queryPersonListByDeptIdAndPostId",
                $scope.search,
                function(data) {
                    $scope.item.pageModel = data;
                }
            );
        };
        $scope.find(1);
        $scope.clear = function() {
            $scope.search.name = "";
            $scope.search.loginName = "";
            $scope.find(1);
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
        $scope.delPerson = function(item, arr) {
            confirm("确认剔除该数据?", function() {
                $scope.eliminateList.push(item);
                var ids = $scope.eliminateList.reduce(function(ret, n) {
                    ret.push(n.id);
                    return ret;
                }, []);
                $scope.search.notInIds = ids.join(",");
                $scope.find(1);
                $scope.$apply(); //需要手动刷新
            });
        };
        $scope.del = function(item, arr) {
            arr.splice(arr.indexOf(item), 1);

            var ids = arr.reduce(function(ret, n) {
                ret.push(n.id);
                return ret;
            }, []);
            $scope.search.notInIds = ids.join(",");
            $scope.find(1);
        };
        $scope.save = function() {
            if (!$scope.item.pageModel.data.length) {
                alert("请选择人员");
                return;
            }
            $uibModalInstance.close({
                selectPerson: $scope.item.pageModel.data,
                eliminateList: $scope.eliminateList
            });
        };
    });
    //查看员工
    app.controller("editEmployeesCtrlByImport", function(
        $scope,
        $http,
        $uibModalInstance,
        $filter,
        fac,
        employee,
        $uibModal,
        $rootScope
    ) {
        $scope.item = {};
        $scope.search = {};
        $scope.item = {};

        $scope.item.data = employee.pageModel.data.concat() || [];

        $scope.item.data &&
            $scope.item.data.length &&
            $scope.item.data.forEach(v => {
                v.isShow = true;
            });

        //人员列表
        $scope.find = function() {
            if ($scope.item.data && $scope.item.data.length) {
                $scope.item.data.forEach(v => {
                    if ($scope.search.name && !$scope.search.loginName) {
                        if (v.name.indexOf($scope.search.name) !== -1) {
                            v.isShow = true;
                        } else {
                            v.isShow = false;
                        }
                    } else if (
                        !$scope.search.name &&
                        !$scope.search.loginName
                    ) {
                        v.isShow = true;
                    } else if (!$scope.search.name && $scope.search.loginName) {
                        if (
                            v.loginName.indexOf($scope.search.loginName) !== -1
                        ) {
                            v.isShow = true;
                        } else {
                            v.isShow = false;
                        }
                    } else {
                        if (
                            v.loginName.indexOf($scope.search.loginName) !==
                                -1 ||
                            v.name.indexOf($scope.search.name) !== -1
                        ) {
                            v.isShow = true;
                        } else {
                            v.isShow = false;
                        }
                    }
                });
            }
        };

        $scope.clear = function() {
            $scope.search.name = "";
            $scope.search.loginName = "";
            $scope.find();
        };

        $scope.delPerson = function(item, arr) {
            confirm("确认删除该数据?", function() {
                arr.splice(arr.indexOf(item), 1);

                $scope.$apply(); //需要手动刷新
            });
        };

        $scope.save = function() {
            if (!$scope.item.data.length) {
                alert("请选择人员");
                return;
            }
            $uibModalInstance.close({
                selectPerson: $scope.item.data
            });
        };
        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
    });
    //查看岗位
    app.controller("editPostCtrl", function(
        $scope,
        $http,
        $uibModalInstance,
        $filter,
        fac,
        post,
        $uibModal,
        $rootScope
    ) {
        $scope.item = post;
        $scope.pageModel = {};
        $scope.search = {};
        $scope.posts = [];

        if (post.posts && post.posts.length) {
            $scope.posts = post.posts.concat();
        }
        $scope.config = {
            edit: false
        };
        $scope.item.pageModel = {};
        $scope.search = {};
        //单个添加
        $scope.checkOne = function(post, data) {
            post.checked = !post.checked;
            if (data) {
                data.checked = data.every(function(v) {
                    return v.checked;
                });
            }
            if (post.checked) {
                var isSelected = false;

                $scope.posts &&
                    $scope.posts.forEach(function(item) {
                        if (post.id == item.id) {
                            isSelected = true;
                        }
                    });
                //在编辑状态下如果在编辑前没有被选中的才加入
                if (!isSelected) {
                    $scope.posts.unshift(post);
                }
            } else {
                $scope.posts.splice($scope.posts.indexOf(post), 1);
            }
        };

        //全选
        $scope.checkAll = function(data) {
            data.checked = !data.checked;
            data.data.forEach(function(n) {
                n.checked = data.checked;
                var isSelected = false;
                $scope.posts &&
                    $scope.posts.forEach(function(post) {
                        if (n.id == post.id) {
                            isSelected = true;
                        }
                    });
                //在编辑状态下如果在编辑前没有被选中的才加入
                if (!isSelected && n.checked) {
                    $scope.posts.push(n);
                }
                if (!n.checked && isSelected) {
                    var i = 0;
                    $scope.posts.forEach(function(v) {
                        i++;
                        if (v.id == n.id) {
                            $scope.posts.splice(i - 1, 1);
                        }
                    });
                }
            });
        };

        $scope.find = function(pageNo) {
            $scope.search.parentId = $scope.curNode && $scope.curNode.id;
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
                deptId: post.deptId
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult(
                "/ovu-base/system/post/listByGrid.do",
                $scope.search,
                function(data) {
                    $scope.pageModel = data;
                    $scope.pageModel.data &&
                        $scope.pageModel.data.forEach(function(v) {
                            $scope.posts.length &&
                                $scope.posts.forEach(function(n) {
                                    if (n.id == v.id) {
                                        v.checked = true;
                                    }
                                });
                        });
                }
            );
        };

        $scope.selectNode = function(node) {
            if ($scope.curNode != node) {
                $scope.curNode &&
                    $scope.curNode.state &&
                    ($scope.curNode.state.selected = false);
            }
            node.state = node.state || {};
            node.state.selected = !node.state.selected;
            if (node.state.selected) {
                $scope.curNode = node;
                $scope.find(1);
            } else {
                delete $scope.curNode;
            }
        };

        // function loadDeptTree() {
        //     $http
        //         .post("/ovu-base/system/postType/tree.do", {}, fac.postConfig)
        //         .success(function(data) {
        //             $scope.deptListTreeData = data;
        //         });
        // }
        // loadDeptTree();
        $scope.find();
        $scope.clear = function() {
            $scope.search.name = "";
            $scope.find(1);
        };

        $scope.del = function(post, posts) {
            confirm("确认删除该数据?", function() {
                post.checked = false;
                posts.splice(posts.indexOf(post), 1);

                $scope.$apply(); //需要手动刷新
            });
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
        $scope.save = function(form, item) {
            if (!$scope.posts.length) {
                alert("请先选择岗位");
                return;
            }

            $uibModalInstance.close({
                selectPost: $scope.posts,
                eliminateList: post.eliminateList
            });
        };
    });
    //查看组织架构
    app.controller("editJgCtrl", function(
        $scope,
        $http,
        $uibModalInstance,
        $filter,
        fac,
        jg,
        $uibModal,
        $rootScope
    ) {
        $scope.search = { name: "" };
        $scope.dept = {};
        $scope.item = jg;

        $scope.stayCheckList = []; //待选区

        $scope.isCheck = false;

        $scope.selectedList = jg.depts.concat() || []; // 已选区
        $scope.stayCheckList = jg.depts.concat() || [];

        $scope.$watch("dept.text", function(val) {
            if (val) {
                // var flatTree = fac.treeToFlat($rootScope.deptTree);
                // flatTree.forEach(function(n) {
                //     n.state = n.state || {};
                //     if (val != "" && n["text"].indexOf(val) > -1) {
                //         n.state.highLight = true;
                //         $scope.selectAllBtn = true;
                //         checkSons(n, true);
                //     } else {
                //         n.state.highLight = false;
                //     }
                // });
            } else {
                if (jg.depts && jg.depts.length) {
                    $scope.selectAllBtn = true;

                    var ids = jg.depts.reduce(function(ret, n) {
                        ret.push(n.id);
                        return ret;
                    }, []);
                    $scope.stayCheckList.forEach(v => {
                        v.isShow = true;
                        // v.checked = true;
                        if (ids.indexOf(v.id) !== -1) {
                            v.checked = true;
                        }
                    });
                    $rootScope.deptTree.expanded = true;
                    $rootScope.execTreeNode($rootScope.deptTree, function(
                        node
                    ) {
                        node.state = node.state || {};
                        node.state.checked = false;
                        node.state.expanded = true;
                        if (ids.indexOf(node.id) !== -1) {
                            node.state.checked = true;
                        }
                    });
                } else {
                    $rootScope.execTreeNode($rootScope.deptTree, function(
                        node
                    ) {
                        node.state = node.state || {};
                        node.state.checked = false;
                    });
                }
            }
        });
        $(document).keydown(function(event) {
            if (event.keyCode == 13) {
                if ($scope.dept.text) {
                    var flatTree = fac.treeToFlat($rootScope.deptTree);

                    flatTree.forEach(function(n) {
                        n.state = n.state || {};

                        if (n["text"].indexOf($scope.dept.text) > -1) {
                            n.state.highLight = true;
                            $scope.selectAllBtn = true;

                            checkSons(n, true);
                        } else {
                            n.state.highLight = false;
                        }
                    });
                } else {
                    $rootScope.execTreeNode($rootScope.deptTree, function(
                        node
                    ) {
                        node.state = node.state || {};
                        node.state.checked = false;
                    });
                }
                $scope.isCheck = false; //全选按钮取消选中
                $scope.find();
                $scope.$apply(); //需要手动刷新
            }
        });
        $scope.clearSearch = function() {
            $scope.search.name = "";
            $scope.isCheck = false;
            $scope.find();
        };

        function checkSons(node, status) {
            node.state = node.state || {};
            node.state.checked = status;
            if (status) {
                node.isShow = true;

                if (node.nodes && node.nodes.length) {
                } else {
                    if ($scope.stayCheckList.length) {
                        var index = $scope.stayCheckList.findIndex(v => {
                            return v.id == node.id;
                        });
                        node.checked = false;
                        index == -1 && $scope.stayCheckList.unshift(node);
                    } else {
                        node.checked = false;
                        $scope.stayCheckList.unshift(node);
                    }
                }
            } else {
                var index = $scope.stayCheckList.findIndex(v => {
                    return v.id == node.id;
                });

                $scope.stayCheckList.splice(index, 1);
                var index = $scope.selectedList.findIndex(v => {
                    return v.id == node.id;
                });
                $scope.selectedList.splice(index, 1);
            }
            if (node.nodes && node.nodes.length) {
                node.nodes.forEach(function(n) {
                    checkSons(n, true);
                });
            }
        }
        $scope.check = function(node) {
            $scope.isCheck = false; //全选按钮取消选中
            node.state = node.state || {};
            node.state.checked = !node.state.checked;

            function checkSons(node, status) {
                node.state = node.state || {};
                node.state.checked = status;
                node.checked = false;
                if (node.state.checked) {
                    $scope.selectAllBtn = true;
                    node.isShow = true;
                    if (node.nodes && node.nodes.length) {
                    } else {
                        if ($scope.stayCheckList.length) {
                            var index = $scope.stayCheckList.findIndex(v => {
                                return v.id == node.id;
                            });
                            index == -1 && $scope.stayCheckList.unshift(node);
                        } else {
                            $scope.stayCheckList.unshift(node);
                        }
                    }
                } else {
                    var index = $scope.stayCheckList.findIndex(v => {
                        return v.id == node.id;
                    });
                    $scope.stayCheckList.splice(index, 1);
                    var index = $scope.selectedList.findIndex(v => {
                        return v.id == node.id;
                    });
                    $scope.selectedList.splice(index, 1);
                }
                if (node.nodes && node.nodes.length) {
                    node.nodes.forEach(function(n) {
                        checkSons(n, status);
                    });
                }
            }

            function uncheckFather(node) {
                var father = fac
                    .treeToFlat($rootScope.deptTree)
                    .find(function(n) {
                        return n.id == node.pid;
                    });

                if (father) {
                    father.state = father.state || {};

                    father.state.checked = false;
                    var index = $scope.stayCheckList.findIndex(v => {
                        return v.id == father.id;
                    });
                    index !== -1 && $scope.stayCheckList.splice(index, 1);

                    uncheckFather(father);
                }
            }
            if (node.state.checked) {
                checkSons(node, true);
            } else {
                checkSons(node, false);
                uncheckFather(node);
            }
            if (!$scope.stayCheckList.length) {
                $scope.selectAllBtn = false; // 如果没有数据,则不显示数组
                $scope.isCheck = false;
            }
        };

        $scope.find = function() {
            var num = 0;
            $rootScope.execTreeNode($scope.stayCheckList, function(node) {
                if (node.fullPath.indexOf($scope.search.name) !== -1) {
                    node.isShow = true;
                    $scope.selectAllBtn = true;
                } else {
                    node.isShow = false;
                    num++;
                }
            });
            if (num == $scope.stayCheckList.length) {
                $scope.selectAllBtn = false; // 如果没有可以匹配到的数据,则不显示数组
                $scope.isCheck = false; //全选按钮取消选中
            }
        };
        //单个删除
        $scope.del = function(item, arr) {
            confirm("确认删除该数据?", function() {
                arr.splice(arr.indexOf(item), 1);
                // $scope.stayCheckList = arr;
                $rootScope.execTreeNode($rootScope.deptTree, function(node) {
                    if (node.id == item.id) {
                        node.state.checked = false;
                    }
                });
                if (!$scope.stayCheckList.length) {
                    $scope.selectAllBtn = false; // 如果没有数据,则不显示数组
                    $scope.isCheck = false; //全选按钮取消选中
                }
                $scope.$apply(); //需要手动刷新
            });
        };
        function uncheckFather(node) {
            var father = fac.treeToFlat($rootScope.deptTree).find(function(n) {
                return n.id == node.pid;
            });
            if (father) {
                father.state = father.state || {};
                father.state.checked = false;
                uncheckFather(father);
            }
        }
        //批量删除
        $scope.delAll = function() {
            // 待选区已经删除的数据
            var ids = $scope.stayCheckList.reduce(function(ret, n) {
                n.checked && n.isShow && ret.push(n.id);
                return ret;
            }, []);
            if (!ids.length) {
                alert("请选择数据");
                return;
            }
            $scope.stayCheckList = $scope.stayCheckList.filter(
                item => ids.indexOf(item.id) == -1
            );
            console.log($scope.stayCheckList);

            $rootScope.execTreeNode($rootScope.deptTree, function(node) {
                if (ids.indexOf(node.id) !== -1) {
                    node.state = node.state || {};
                    node.state.checked = false;
                    uncheckFather(node);
                }
            });
            // $scope.selectedList = $scope.selectedList.filter(
            //     item => ids.indexOf(item.id) == -1
            // );

            if (!$scope.stayCheckList.length) {
                $scope.selectAllBtn = false; // 如果没有数据,则不显示数组
                $scope.isCheck = false; //全选按钮取消选中
            }
            var numlist = $scope.stayCheckList.reduce(function(ret, n) {
                !n.isShow;
                return ret;
            }, []);
            if (numlist.length == $scope.stayCheckList.length) {
                $scope.selectAllBtn = false; // 如果没有数据,则不显示数组
                $scope.isCheck = false; //全选按钮取消选中
            }
        };
        //单个添加
        $scope.checkOne = function(item, data) {
            item.checked = !item.checked;
        };

        //单个删除
        $scope.removeDept = function(item, arr) {
            confirm("确认删除该数据?", function() {
                arr.splice(arr.indexOf(item), 1);
                // $scope.selectedList = arr;
                $scope.stayCheckList.forEach(v => {
                    item.id == v.id && (v.checked = false);
                });

                $scope.$apply(); //需要手动刷新
            });
            // $scope.stayCheckList.push(item);
        };

        //全选
        $scope.checkAll = function(data) {
            $scope.isCheck = !$scope.isCheck;

            $rootScope.execTreeNode(data, function(node) {
                if ($scope.isCheck) {
                    if (node.isShow) {
                        node.checked = true;
                    } else {
                        node.checked = false;
                    }
                } else {
                    node.state = node.state || {};
                    node.checked = false;
                }
            });
        };
        $scope.staticSave = function() {
            // $scope.selectedList = $scope.stayCheckList.filter(
            //     item => item.checked
            // );
            // if (!$scope.selectedList.length) {
            //     alert("请先选择部门");
            // }
            var arr = $scope.stayCheckList.reduce(function(ret, n) {
                n.checked && ret.push(n);
                return ret;
            }, []);
            $scope.selectedList = $scope.selectedList.concat(arr);
            $scope.selectedList = $scope.selectedList.filter(function(
                item,
                index,
                self
            ) {
                return self.indexOf(item) == index;
            });
        };
        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
        $scope.save = function() {
            if (!$scope.selectedList.length) {
                alert("请先选择部门");
                return;
            }

            $uibModalInstance.close({
                selectDept: $scope.selectedList,
                eliminateList: jg.eliminateList
            });
        };
    });
})();
