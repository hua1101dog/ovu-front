(function() {
    "use strict";
    document.title = "日志权限设置";
    var app = angular.module("angularApp");

    app.controller("newpermissionsCtrl", newpermissionsCtrl);
    function newpermissionsCtrl($scope, $timeout, $uibModal, $http, fac) {
        var vm = this;
        $scope.pageModel = {};
        $scope.search = {};

        app.modulePromiss.then(function() {
            // fac.initPage($scope, function () {
            //     $scope.find();
            // }, function () {
            //     $scope.find();
            // });

            $scope.$watch("dept.id", function(deptId, oldValue) {
                if (deptId) {
                    $scope.find();
                }
            });
        }),
            function() {};
        $scope.$watch("pageModel.currentPage", function(currentPage) {
            if (currentPage && currentPage == 1) {
                $scope.inputPage = "";
            } else {
                $scope.inputPage = currentPage;
            }
        });

        //分页表格
        $scope.find = function(pageNo) {
            if (!fac.initDeptId($scope.search)) {
                return;
            }
            // if(!$scope.search.deptName){
            //     delete $scope.search.personIds;
            // }
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.personName = $scope.search.user
                ? $scope.search.user.name
                : undefined;
            $scope.search.personIds = $scope.search.user
                ? $scope.search.user.id
                : undefined;
            fac.getPageResult(
                "/ovu-pcos/pcos/worklogs/multi/worklogpermission/worklogpermissionlist.do",
                $scope.search,
                function(data) {
                    $scope.pageModel = data.data;
                    $scope.pageModel.currentPage =
                        $scope.pageModel.pageIndex + 1;
                    $scope.pageModel.totalPage = $scope.pageModel.pageTotal;
                    $scope.search.totalCount = $scope.pageModel.totalRecord =
                        $scope.pageModel.totalCount;
                    if (
                        $scope.pageModel.data &&
                        $scope.pageModel.data.length >= 0
                    ) {
                        $scope.pageModel.list = $scope.pageModel.data;
                    }
                    var pages = [];
                    var hash = {};
                    var list = [
                        1,
                        $scope.search.currentPage - 1,
                        $scope.search.currentPage,
                        $scope.search.currentPage + 1,
                        $scope.pageModel.pageTotal
                    ];
                    list.forEach(function(v) {
                        if (
                            !hash[v] &&
                            v <= $scope.pageModel.pageTotal &&
                            v > 0
                        ) {
                            hash[v] = true;
                            pages.push(v);
                        }
                    });
                    if (pages.length > 2 && pages.indexOf(2) == -1) {
                        pages.splice(1, 0, "······");
                    }
                    if (
                        pages.length > 2 &&
                        pages.indexOf($scope.pageModel.pageTotal - 1) == -1
                    ) {
                        pages.splice(pages.length - 1, 0, "······");
                    }
                    $scope.pageModel.pages = pages;
                }
            );
        };
        $scope.getValue = function(value, total) {
            if (value.length == 1) {
                value = value.replace(/[^1-9]/g, "");
            } else {
                value = value.replace(/\D/g, "");
            }
            if (value - 0 > total) {
                value = "";
            }
            $scope.inputPage = value;
            $scope.find($scope.inputPage);
        };

        //   $scope.selectedPerson=function(item,search){
        //     search.personIds=item.id;
        // }
        //新增修改弹出框
        vm.showEditModal = function(item) {
            var copy = angular.extend({}, item);
            copy = angular.extend(copy, { deptId: $scope.search.deptId });
            var modal = $uibModal.open({
                animation: false,
                templateUrl:
                    "../view/log/permissions/modal.newpermissionsEdit.html",
                size: "max",
                controller: "newpermissionsEditModalCtrl",
                resolve: {
                    param: copy
                }
            });
            modal.result.then(function(data) {
                $scope.find();
            });
        };
        vm.del = function(id) {
            confirm("确认删除该记录?", function() {
                $http
                    .get(
                        "/ovu-pcos//pcos/worklogs/multi/worklogpermission/deletepermission.do?id=" +
                            id
                    )
                    .success(function(data, status, headers, config) {
                        if (data.success) {
                            $scope.find();
                            msg("操作成功");
                        } else {
                            alert("操作失败");
                        }
                    });
            });
        };
    }
    //新增修改弹出框控制器
    app.controller("newpermissionsEditModalCtrl", repositoryEditModalCtrl);
    function repositoryEditModalCtrl(
        $scope,
        $timeout,
        $uibModalInstance,
        $http,
        fac,
        param
    ) {
        var vm = ($scope.vm = this);
        $scope.leaderList = {};
        $scope.parkList = {};
        $scope.personList = {};
        $scope.search = { deptId: param.deptId || "" };
        fac.setPostDict($scope);
        $scope.persons = [];
        $scope.personlist = [];
        $scope.shows = "";
        vm.type;
        var deptId = param.deptId;
        var permissionId = param.permissionId;
        $scope.personNameList = [];
        $scope.show = "";
        $scope.treeDataList = [];

        //编辑权限
        if (fac.isNotEmpty(permissionId)) {
            $http
                .get(
                    "/ovu-pcos/pcos/worklogs/multi/worklogpermission/permissionpark?id=" +
                        permissionId
                )
                .success(function(data, status, headers, config) {
                    $scope.tree(data.data.parkId);

                    //需要将id也放入，以便后面的判断
                    var i = 0;

                    $scope.pName = param.leader;
                    $scope.parentId = param.parentId;
                    var personList = param.member.split(",");
                    var perIdList = param.personIdList.split(",");
                    //需要将id也放入，以便后面的判断
                    var j = 0;
                    personList.forEach(function(personName) {
                        var temp = {};
                        temp.personName = personName;
                        temp.id = perIdList[j];
                        $scope.persons.push(temp);
                        $scope.personlist.push(temp);
                        j++;
                    });
                    $scope.personIdList = param.personIdList;
                    $scope.findParks();
                });
        }
        $scope.checkPost = function(item, data) {
            item.checked = !item.checked;
            if (data) {
                item.checked = data.data.every(function(v) {
                    return !v.checked;
                });
                item.checked = item.checked;
            }

            $scope.pName = item.personName;
            $scope.parentId = item.id;
        };

        $scope.checkPerson = function(item, data) {
            item.checked = !item.checked;
            if (data) {
                data.checked = data.data.every(function(v) {
                    return v.checked;
                });
            }
            if (item.checked) {
                var isSelected = false;
                $scope.personlist &&
                    $scope.personlist.forEach(function(person) {
                        if (item.id == person.id) {
                            isSelected = true;
                        }
                    });
                //在编辑状态下如果在编辑前没有被选中的才加入
                if (!isSelected) {
                    $scope.personlist.push(item);
                }

                if ($scope.personlist.length > 10) {
                    $scope.persons = $scope.personlist.slice(0, 10);
                } else {
                    $scope.persons = $scope.personlist;
                }
            } else {
                if ($scope.personlist.length > 10) {
                    // $scope.personlist.splice( $scope.personlist.indexOf(item), 1);
                    var i = 0;
                    $scope.personlist &&
                        $scope.personlist.forEach(function(person) {
                            if (item.id == person.id) {
                                $scope.personlist.splice(i, 1);
                                return;
                            }
                            i++;
                        });
                    $scope.persons = $scope.personlist.slice(0, 10);
                } else {
                    // $scope.personlist.splice( $scope.personlist.indexOf(item), 1);

                    var i = 0;
                    $scope.personlist &&
                        $scope.personlist.forEach(function(person) {
                            if (item.id == person.id) {
                                $scope.personlist.splice(i, 1);
                                return;
                            }
                            i++;
                        });
                    $scope.persons = $scope.personlist.slice(0, 10);
                    $scope.persons = $scope.personlist;
                }
            }
        };
        $scope.checkPersonAll = function(data) {
            data.checked = !data.checked;
            data.data.forEach(function(n) {
                n.checked = data.checked;
                var isSelected = false;
                $scope.personlist &&
                    $scope.personlist.forEach(function(person) {
                        if (n.id == person.id) {
                            isSelected = true;
                        }
                    });
                //在编辑状态下如果在编辑前没有被选中的才加入
                if (!isSelected) {
                    $scope.personlist.push(n);
                }
                if (!n.checked && isSelected) {
                    var i = 0;
                    $scope.personlist.forEach(function(v) {
                        i++;
                        if (v.id == n.id) {
                            $scope.personlist.splice(i - 1, 1);
                        }
                    });
                }
            });
            $scope.shows = "";
            $scope.persons = $scope.personlist.slice(0, 10);
        };
        $scope.getmores = function() {
            $scope.persons = $scope.personlist;
            $scope.shows = true;
        };
        $scope.getlesss = function() {
            $scope.persons = $scope.personlist.slice(0, 10);
            $scope.shows = false;
        };
        //删除下属
        $scope.delP = function(per, p) {
            $scope.personList.data &&
                $scope.personList.data.forEach(function(v) {
                    v.id == p.id && (v.checked = false);
                });
            p.checked = false;
            if (per.length <= 10) {
                per.splice(per.indexOf(p), 1);
                $scope.persons = per;
                //这是提交保存的数据对象
                $scope.personlist = per;
                $scope.show = "";
            } else {
                per.splice(per.indexOf(p), 1);
                //这是提交保存的数据对象
                $scope.personlist = per;
                $scope.persons = per.slice(0, 10);
            }
            $scope.personlist = per;
        };

        $scope.checkpark = function(item, data) {
            item.checked = !item.checked;
            if (data) {
                data.checked = data.data.every(function(v) {
                    return v.checked;
                });
            }
            if (item.checked) {
                var isSelected = false;
                $scope.parkNameList &&
                    $scope.parkNameList.forEach(function(park) {
                        if (item.id == park.id) {
                            isSelected = true;
                        }
                    });
                //在编辑状态下如果在编辑前没有被选中的才加入
                if (!isSelected) {
                    $scope.parkNameList.push(item);
                }

                if ($scope.parkNameList.length > 2) {
                    $scope.parks = $scope.parkNameList.slice(0, 2);
                } else {
                    $scope.parks = $scope.parkNameList;
                }
            } else {
                if ($scope.parkNameList.length > 2) {
                    // $scope.parkNameList.splice( $scope.parkNameList.indexOf(item), 1);
                    $scope.parks = $scope.parkNameList.slice(0, 2);
                    var i = 0;
                    $scope.parkNameList &&
                        $scope.parkNameList.forEach(function(person) {
                            if (item.id == person.id) {
                                $scope.parkNameList.splice(i, 1);
                                return;
                            }
                            i++;
                        });
                    $scope.parks = $scope.parkNameList;
                    $scope.parks = $scope.parkNameList.slice(0, 2);
                } else {
                    var i = 0;
                    $scope.parkNameList &&
                        $scope.parkNameList.forEach(function(person) {
                            if (item.id == person.id) {
                                $scope.parkNameList.splice(i, 1);
                                return;
                            }
                            i++;
                        });
                    $scope.parks = $scope.parkNameList;
                    // $scope.parkNameList.splice( $scope.parkNameList.indexOf(item), 1);
                    // $scope.parks = $scope.parkNameList;
                }
            }
            var parkNames = [];
            $scope.parkNameList.forEach(function(v) {
                parkNames.push(v.id);
            });
            $scope.parkLength = parkNames.length;
            if ($scope.parkLength == 0) {
                parkNames = "";
            } else {
                parkNames = parkNames.join(",");
            }
            if (parkNames == "") {
                $scope.hasDep = true;
                $scope.personList.data = [];
            }
            $scope.tree(parkNames);
        };

        // var factree = [];
        $scope.tree = function(ids) {
            $scope.treeData = [];
            $http
                .post(
                    "/ovu-base/system/dept/tree",
                    { deptId: $scope.search.deptId },
                    fac.postConfig
                )
                .success(function(data) {
                    $scope.treeData = data || [];
                    //   $scope.treeDataList[0].state = { selected: true };
                    //  factree = fac.treeToFlat($scope.treeDataList);

                    //  $scope.search.DEPT_ID =  $scope.treeDataList[0].did;
                });
            deptIds = [];
        };
        $scope.checkparkAll = function(data) {
            data.checked = !data.checked;
            data.data.forEach(function(n) {
                n.checked = data.checked;

                var isSelected = false;
                $scope.parkNameList &&
                    $scope.parkNameList.forEach(function(park) {
                        if (n.id == park.id) {
                            isSelected = true;
                        }
                    });
                //在编辑状态下如果在编辑前没有被选中的才加入
                if (!isSelected && n.checked) {
                    $scope.parkNameList.push(n);
                }
                if (!n.checked && isSelected) {
                    var i = 0;
                    $scope.parkNameList.forEach(function(v) {
                        i++;
                        if (v.id == n.id) {
                            $scope.parkNameList.splice(i - 1, 1);
                        }
                    });
                }
            });
            $scope.show = "";
            $scope.parks = $scope.parkNameList.slice(0, 2);
            var ids = $scope.parkNameList
                .reduce(function(ret, n) {
                    ret.push(n.id);
                    return ret;
                }, [])
                .join();
            if ($scope.parks == "") {
                $scope.hasDep = true;
                $scope.personList.data = [];
            }
            $scope.tree(ids);
        };
        $scope.tree();
        $scope.getmore = function() {
            $scope.parks = $scope.parkNameList;
            $scope.show = true;
        };
        $scope.getless = function() {
            $scope.parks = $scope.parkNameList.slice(0, 2);
            $scope.show = false;
        };
        //删除项目
        $scope.del = function(parks, p) {
            $scope.parkList.data &&
                $scope.parkList.data.forEach(function(v) {
                    v.id == p.id && (v.checked = false);
                });
            p.checked = false;
            if (parks.length <= 2) {
                parks.splice(parks.indexOf(p), 1);
                $scope.parks = parks;
                $scope.parkNameList = parks;
                $scope.show = "";
            } else {
                parks.splice(parks.indexOf(p), 1);
                $scope.parkNameList = parks;
                $scope.parks = parks.slice(0, 2);
            }
            var ids = $scope.parkNameList
                .reduce(function(ret, n) {
                    ret.push(n.id);
                    return ret;
                }, [])
                .join();
            $scope.tree(ids);
        };

        //领导人员列表
        $scope.find = function(pageNo) {
            $scope.search.personName = $scope.search.highUser
                ? $scope.search.highUser.name
                : undefined;
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.leaderList.currentPage || 1,
                pageSize: $scope.leaderList.pageSize || 10
            });
            fac.getPageResult(
                "/ovu-pcos/pcos/worklogs/multi/worklogpermission/personlist.do",
                $scope.search,
                function(data) {
                    $scope.leaderList = data.data;
                    $scope.leaderList.currentPage =
                        $scope.leaderList.pageIndex + 1;
                    $scope.leaderList.totalPage = $scope.leaderList.pageTotal;
                    $scope.search.totalCount = $scope.leaderList.totalRecord =
                        $scope.leaderList.totalCount;
                    if (
                        $scope.leaderList.data &&
                        $scope.leaderList.data.length >= 0
                    ) {
                        $scope.leaderList.list = $scope.leaderList.data;
                    }
                    var pages = [];
                    var hash = {};
                    var list = [
                        1,
                        $scope.search.currentPage - 1,
                        $scope.search.currentPage,
                        $scope.search.currentPage + 1,
                        $scope.leaderList.pageTotal
                    ];
                    list.forEach(function(v) {
                        if (
                            !hash[v] &&
                            v <= $scope.leaderList.pageTotal &&
                            v > 0
                        ) {
                            hash[v] = true;
                            pages.push(v);
                        }
                    });
                    if (pages.length > 2 && pages.indexOf(2) == -1) {
                        pages.splice(1, 0, "······");
                    }
                    if (
                        pages.length > 2 &&
                        pages.indexOf($scope.leaderList.pageTotal - 1) == -1
                    ) {
                        pages.splice(pages.length - 1, 0, "······");
                    }
                    $scope.leaderList.pages = pages;
                }
            );
        };
        $scope.find();
        //项目信息列表
        $scope.findParks = function(pageNo) {
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.parkList.currentPage || 1,
                pageSize: $scope.parkList.pageSize || 10
            });
            // delete $scope.search.parkId;
            // delete $scope.search.DEPT_ID;
            fac.getPageResult(
                "/ovu-pcos/pcos/worklogs/multi/worklogpermission/parklist.do",
                $scope.search,
                function(data) {
                    $scope.parkList = data.data;
                    $scope.parkList.data.forEach(function(v) {
                        $scope.parkNameList &&
                            $scope.parkNameList.forEach(function(n) {
                                if (n.id == v.id) {
                                    v.checked = true;
                                }
                            });
                    });
                    $scope.parkList.currentPage = $scope.parkList.pageIndex + 1;
                    $scope.parkList.totalPage = $scope.parkList.pageTotal;
                    $scope.search.totalCount = $scope.parkList.totalRecord =
                        $scope.parkList.totalCount;
                    if (
                        $scope.parkList.data &&
                        $scope.parkList.data.length >= 0
                    ) {
                        $scope.parkList.list = $scope.parkList.data;
                    }
                    var pages = [];
                    var hash = {};
                    var list = [
                        1,
                        $scope.search.currentPage - 1,
                        $scope.search.currentPage,
                        $scope.search.currentPage + 1,
                        $scope.parkList.pageTotal
                    ];
                    list.forEach(function(v) {
                        if (
                            !hash[v] &&
                            v <= $scope.parkList.pageTotal &&
                            v > 0
                        ) {
                            hash[v] = true;
                            pages.push(v);
                        }
                    });
                    if (pages.length > 2 && pages.indexOf(2) == -1) {
                        pages.splice(1, 0, "······");
                    }
                    if (
                        pages.length > 2 &&
                        pages.indexOf($scope.parkList.pageTotal - 1) == -1
                    ) {
                        pages.splice(pages.length - 1, 0, "······");
                    }
                    $scope.parkList.pages = pages;
                }
            );
        };
        $scope.findParks();

        function expandFather(node) {
            var father = $scope.treeData.find(function(n) {
                return n.did == node.pdid;
            });
            if (father) {
                father.state = father.state || {};
                father.state.expanded = true;
                expandFather(father);
            }
        }
        function uncheckFather(node) {
            var father = $scope.treeData.find(function(n) {
                return n.parkId == node.pid;
            });
            if (father) {
                father.state = father.state || {};
                father.state.checked = false;
                uncheckFather(father);
            }
        }

        var deptIds = [];
        var dep = "";
        $scope.hasDep = true;
        $scope.check = function(node) {
            console.log(node);
            node.state = node.state || {};
            node.state.checked = !node.state.checked;
            function checkSons(node, status) {
                node.state = node.state || {};
                node.state.checked = status;

                if (node.state.checked) {
                    deptIds.push(node.id);
                } else {
                    // deptIds.splice(deptIds.indexOf(deptIds[node.did],1)) ;
                    var i = 0;
                    deptIds &&
                        deptIds.forEach(function(v) {
                            if (v == node.id) {
                                deptIds.splice(i, 1);
                            }
                            i++;
                        });
                }
                if (node.nodes && node.nodes.length) {
                    node.nodes.forEach(function(n) {
                        checkSons(n, status);
                    });
                }
            }
            if (node.state.checked) {
                checkSons(node, true);
                if (!node.node) {
                }
            } else {
                checkSons(node, false);
            }
            dep = deptIds.join(",");
            if (dep) {
                $scope.findPerson(1, dep);
                $scope.hasDep = false;
            } else {
                $scope.personList.data = [];
                $scope.hasDep = true;
            }
        };

        //查询下属人员列表
        $scope.findPerson = function(pageNo, id) {
            //delete $scope.search.deptId;
            var queryParams = angular.extend({}, $scope.search);
            id = dep;
            delete queryParams.deptId;
            angular.extend(queryParams, {
                currentPage: pageNo || $scope.personList.currentPage || 1,
                pageSize: $scope.personList.pageSize || 10,
                personName: $scope.lowerUser
                    ? $scope.lowerUser.name
                    : undefined,
                deptIds: id
            });
            fac.getPageResult(
                "/ovu-pcos/pcos/worklogs/multi/worklogpermission/personlist.do",
                queryParams,
                function(data) {
                    $scope.personList = data.data;
                    $scope.personList.data.forEach(function(v) {
                        $scope.personlist.forEach(function(n) {
                            if (n.id == v.id) {
                                v.checked = true;
                            }
                        });
                    });
                    $scope.personList.currentPage =
                        $scope.personList.pageIndex + 1;
                    $scope.personList.totalPage = $scope.personList.pageTotal;
                    $scope.search.totalCount = $scope.personList.totalRecord =
                        $scope.personList.totalCount;
                    if (
                        $scope.personList.data &&
                        $scope.personList.data.length >= 0
                    ) {
                        $scope.personList.list = $scope.personList.data;
                    }
                    var pages = [];
                    var hash = {};
                    var list = [
                        1,
                        $scope.search.currentPage - 1,
                        $scope.search.currentPage,
                        $scope.search.currentPage + 1,
                        $scope.personList.pageTotal
                    ];
                    list.forEach(function(v) {
                        if (
                            !hash[v] &&
                            v <= $scope.personList.pageTotal &&
                            v > 0
                        ) {
                            hash[v] = true;
                            pages.push(v);
                        }
                    });
                    if (pages.length > 2 && pages.indexOf(2) == -1) {
                        pages.splice(1, 0, "······");
                    }
                    if (
                        pages.length > 2 &&
                        pages.indexOf($scope.personList.pageTotal - 1) == -1
                    ) {
                        pages.splice(pages.length - 1, 0, "······");
                    }
                    $scope.personList.pages = pages;
                }
            );
        };

        vm.save = function() {
            if (
                fac.isEmpty($scope.parentId) ||
                fac.isEmpty($scope.personlist)
            ) {
                alert("请填写数据");
                return;
            }
            // var personIdList = vm.staffs.map(function (obj) {
            //     return obj.personId;
            // })
            $scope.personlists = [];
            $scope.personlist.forEach(function(v) {
                $scope.personlists.push(v.id);
            });
            $scope.personlists = $scope.personlists.join(",");
            var params = {
                parentId: $scope.parentId,
                personIdList: $scope.personlists,
                deptId: $scope.search.deptId
            };
            if (param.permissionId) {
                params = {
                    parentId: $scope.parentId,
                    personIdList: $scope.personlists,
                    deptId: $scope.search.deptId,
                    permissionId: param.permissionId
                };
                $http
                    .post(
                        "/ovu-pcos/pcos/worklogs/multi/worklogpermission/editpermission.do",
                        params,
                        fac.postConfig
                    )
                    .success(function(data, status, headers, config) {
                        if (data.success) {
                            $uibModalInstance.close();
                            msg("保存成功!");
                        } else {
                            alert();
                        }
                    });
            } else {
                $http
                    .post(
                        "/ovu-pcos/pcos/worklogs/multi/worklogpermission/addpermission.do",
                        params,
                        fac.postConfig
                    )
                    .success(function(data, status, headers, config) {
                        if (data.success) {
                            //需要判断如果返回码是300则是因为存在重复用户添加
                            if (data.code == "300") {
                                msg("该用户已经有权限配置记录，不能重复添加!");
                            } else {
                                $uibModalInstance.close();
                                msg("保存成功!");
                            }
                        } else {
                            alert();
                        }
                    });
            }
        };
        vm.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
    }
})();
