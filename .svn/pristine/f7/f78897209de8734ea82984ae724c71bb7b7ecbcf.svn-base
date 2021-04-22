/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller("trainCtl", function(
        $scope,
        $rootScope,
        $http,
        $filter,
        $uibModal,
        fac
    ) {
        document.title = "OVU-分组管理";
        window.$rootScope = $rootScope;
        window.$scope = $scope;
        $scope.search = {};
        $scope.pageModel = {};

        $scope.treeData_train = [];
        $scope.persons = [];
        $scope.selectPostList = [];
        $scope.selectDeptList = [];

        if ($rootScope.hasPower("编辑")) {
            $scope.spaceConfig = {
                edit: true
            };
        }
        $scope.getDeptTree = function() {
            $http
                .post("/ovu-base/system/dept/rightTree.do")
                .success(function(res) {
                    $scope.deptTree_train = res.data;
                });
        };
        app.modulePromiss.then(function() {
            $scope.$watch("dept.id", function(deptId, oldValue) {
                if (deptId) {
                    $scope.search.deptId = deptId;
                }
                loadTypeTree();
                $scope.getDeptTree();
            });
        });

        $scope.findPerson = function(pageNo, params) {
            var queryParams = angular.extend(params, $scope.search);
            angular.extend(queryParams, {
                currentPage: pageNo || $scope.personList.currentPage || 1,
                pageSize: $scope.personList.pageSize || 10,
                // pageIndex:0
                personIds: id
            });
            fac.getPageResult(
                "/ovu-pcos/pcos/newknowledge/group/findPersonByNameOrJobCode",
                queryParams,
                function(data) {
                    $scope.pageModel = data;
                    $scope.pageModel.data &&
                        $scope.pageModel.data.forEach(function(v) {
                            $scope.persons.forEach(function(n) {
                                if (n.id == v.id) {
                                    v.checked = true;
                                }
                            });
                        });
                }
            );
        };

        function loadTypeTree() {
            $http
                .post(
                    "/ovu-pcos/pcos/newknowledge/group/list",
                    { deptId: $scope.search.deptId },
                    fac.postConfig
                )
                .success(function(res) {
                    $scope.treeData_train = res.data || [];
                    $scope.treeData_train &&
                        $scope.treeData_train.forEach(train => {
                            train.isLeaf = true;
                        });
                    $scope.persons = [];
                    $scope.postTree_train = [];
                    $scope.pageModel = {};
                    // $scope.search={}
                    $scope.search.text && delete $scope.search.text;
                    $scope.search.id && delete $scope.search.id;
                    $scope.search.ids && delete $scope.search.ids;
                    $scope.ids && delete $scope.ids;
                });
        }

        $scope.addTopNode = function() {
            $scope.treeData_train.push({
                state: {
                    edit: true,
                    isLeaf: true
                }
            });
        };
        // $scope.addSon = function (node) {

        //     node.nodes = node.nodes || [];
        //     node.state = node.state || {};
        //     node.state.expanded = true;
        //     // node.isLeaf=true;
        //     node.nodes.push({
        //         parentId: node.id,
        //         state: {
        //             edit: true,
        //             expanded: true
        //         },
        //         copy: {
        //             parentId: node.id,
        //             deptId: node.deptId
        //         }
        //     });
        // }

        function getNodeById(did) {
            if (!did) {
                return false;
            }
            var node = fac.getNodeById($scope.treeData_train, did);
            return node;
        }

        $scope.selectNode = function(node) {
            $scope.getDeptTree();
            $scope.ismore = false;
            $scope.deptTree_train = {};
            $scope.pageModel = {};
            $scope.postTree_train = [];
            $scope.node = node;

            if (node.id) {
                $http
                    .post(
                        "/ovu-pcos/pcos/newknowledge/group/queryByGroupId",
                        { ids: node.id },
                        fac.postConfig
                    )
                    .success(function(res) {
                        $scope.persons = res.data || [];
                        // $scope.persons.length &&
                        //     $scope.persons.forEach(v => {
                        //         v.personName = v.name;
                        //     });
                    });
            }
        };

        //删除分组
        $scope.delNode = function(node) {
            if (node.nodes && node.nodes.length) {
                alert("此节点有下级节点,不能删除！");
            } else {
                confirm("确定删除 " + node.text + "?", function() {
                    //zg begin
                    //$http.post("/ovu-base/system/park/removes.do", {ids: node.did}, fac.postConfig).success(function (resp) {
                    $http
                        .post(
                            "/ovu-pcos/pcos/newknowledge/group/delete",
                            {
                                id: node.id
                            },
                            fac.postConfig
                        )
                        .success(function(resp) {
                            if (resp.code == 0) {
                                loadTypeTree();
                                if ($scope.curNode == node) {
                                    delete $scope.curNode;
                                }
                                var parent = getNodeById(node.parentId);
                                if (parent) {
                                    parent.nodes.splice(
                                        parent.nodes.indexOf(node),
                                        1
                                    );
                                } else {
                                    $scope.treeData_train.splice(
                                        $scope.treeData_train.indexOf(node),
                                        1
                                    );
                                }
                            } else {
                                alert(resp.msg);
                            }
                        });
                    //zg end
                });
            }
        };
        $scope.save = function(node) {
            if (!node.copy.text) {
                alert("名称不能为空");
                return;
            }

            var filterData;
            filterData = $scope.treeData_train;
            var findData = filterData.find(function(n) {
                return n.id != node.copy.id && n.text == node.copy.text;
            });
            if (findData) {
                alert("分类名称已存在");
                return;
            }

            var park = {};

            park.text = node.copy.text;
            park.deptId = $scope.search.deptId;
            park.id = node.id;
            // park.parentId=node.copy.parentId;
            // node.state.expanded = true;
            $http
                .post(
                    "/ovu-pcos/pcos/newknowledge/group/edit",
                    park,
                    fac.postConfig
                )
                .success(function(resp) {
                    if (resp.code == 0) {
                        (node.isLeaf = true), loadTypeTree();
                    } else {
                        alert(resp.msg);
                    }
                });
            //zg end
        };

        $scope.undo = function(node) {
            if (node.id) {
                node.state.edit = false;
            } else {
                var parent = getNodeById(node.parentId);
                if (parent) {
                    parent.nodes.splice(parent.nodes.indexOf(node), 1);
                } else {
                    $scope.treeData_train.splice(
                        $scope.treeData_train.indexOf(node),
                        1
                    );
                }
            }
        };
        $scope.editNode = function(node) {
            node.copy = angular.extend({}, node);
            node.copy.parkType = "0";

            node.state = node.state || {};
            node.state.edit = true;
        };

        $scope.setDept = function(node) {
            //选中部门发3个请求 一个获取岗位列表 一个获取人员列表
            console.log(111111);
            $scope.selectDeptList = [];
            //获取人员列表

            var treeList = fac.treeToFlat($scope.deptTree_train);
            treeList.forEach(v => {
                if (v.state && v.state.checked) {
                    $scope.selectDeptList.push(v.id);
                } else {
                    var index = $scope.selectDeptList.findIndex(n => {
                        return v == n.id;
                    });
                    $scope.selectPostList.splice(index, 1);
                }
            });

            //获取岗位列表
            getPostList($scope.selectDeptList);
            $scope.find(1);
        };
        function getPostList(arr) {
            var deptIds = {};
            deptIds = arr.join(",");
            $http
                .post(
                    "/ovu-pcos/pcos/newknowledge/group/queryPostListByDeptId",
                    { deptIds: arr.join(",") },
                    fac.postConfig
                )
                .success(res => {
                    $scope.postTree_train = res.data || [];
                    $scope.postTree_train &&
                        $scope.postTree_train.forEach(v => {
                            v.text = v.postName;
                        });
                });
        }

        $scope.setPost = function(node) {
            if (node.state.checked) {
                $scope.selectPostList.push(node.id);
            } else {
                var index = $scope.selectPostList.findIndex(v => {
                    return v == node.id;
                });
                $scope.selectPostList.splice(index, 1);
            }
            if ($scope.selectPostList.length) {
                $scope.find(1);
            } else {
                $scope.pageModel = {};
            }
        };
        //获取人员
        $scope.find = function(pageNo) {
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
                deptIds: $scope.selectDeptList.join(","),
                postIds: $scope.selectPostList.join(",")
                // pageIndex:0
            });

            fac.getPageResult(
                "/ovu-pcos/pcos/newknowledge/group/queryPersonListByDeptIdAndPostId",
                $scope.search,
                function(res) {
                    $scope.pageModel = res;

                    $scope.pageModel.data.length &&
                        $scope.pageModel.data.forEach(function(v) {
                            $scope.persons.length &&
                                $scope.persons.forEach(function(n) {
                                    if (n.id == v.id) {
                                        v.checked = true;
                                    }
                                });
                        });
                }
            );
        };

        //全选岗位
        $scope.checkPostAll = function(data) {
            data.checked = !data.checked;
            $scope.selectPostList = [];
            $rootScope.execTreeNode(data, function(node) {
                if (data.checked) {
                    node.state = node.state || {};
                    node.state.checked = true;
                    $scope.selectPostList.push(node.id);
                } else {
                    node.state = node.state || {};
                    node.state.checked = false;
                    $scope.pageModel = {};
                }
            });
            if (data.checked) {
                $scope.find(1);
            } else {
                $scope.pageModel = {};

                $scope.persons = [];
            }
        };

        //选中人员
        $scope.checkPerson = function(item, data) {
            item.checked = !item.checked;

            if (item.checked) {
                //选中
                $scope.persons.push(item);
                if ($scope.persons.length == data.data.length) {
                    data.checked = true;
                }
            } else {
                data.checked = false;
                var index = $scope.persons.findIndex(v => {
                    return v.id == item.id;
                });
                $scope.persons.splice(index, 1);
            }
        };

        //全选人员
        $scope.checkPersonAll = function(data) {
            data.checked = !data.checked;
            $scope.persons = [];
            data.data.forEach(v => {
                if (data.checked) {
                    v.checked = true;
                    $scope.persons.push(v);
                } else {
                    v.checked = false;
                }
            });
        };

        //删除人员
        $scope.delP = function(per, p, obj, node) {
            p.checked = false;

            var index = per.findIndex(v => {
                return v.id == p.id;
            });
            per.splice(index, 1);
            obj.data &&
                obj.data.length &&
                obj.data.forEach(v => {
                    if (p.id == v.id) {
                        v.checked = false;
                    }
                });
            obj.checked = false;
            $http
                .post(
                    "/ovu-pcos/pcos/newknowledge/group/updateGroup",
                    { id: $scope.node.id, personIds: p.id },
                    fac.postConfig
                )
                .success(function(resp) {
                    if (resp.code == 0) {
                    } else {
                        alert(resp.msg);
                    }
                });
        };

        //更多
        $scope.getmores = function() {
            $scope.ismore = !$scope.ismore;
        };

        //保存
        $scope.saveCouple = function() {
            if (!$scope.search.id) {
                alert("请选择分组");
                return;
            }
            $scope.personlists = [];
            $scope.persons.forEach(function(v) {
                $scope.personlists.push(v.id);
            });
            $scope.personlists = $scope.personlists.join(",");

            var params = {
                personIds: $scope.personlists,
                id: $scope.search.id
            };

            $http
                .post(
                    "/ovu-pcos/pcos/newknowledge/group/edit",
                    params,
                    fac.postConfig
                )
                .success(function(data, status, headers, config) {
                    if ($scope.personlists == "") {
                        alert("请选择人员！");
                        return;
                    }
                    if (data.code == 0) {
                        msg("保存成功!");
                    } else {
                        alert("保存失败！");
                        return;
                    }
                });
        };

        //删除
        $scope.cancel = function() {
            $uibModal.dismiss("cancel");
        };
    });
})();
