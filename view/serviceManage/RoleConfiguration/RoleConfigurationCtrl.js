(function () {
    var app = angular.module("angularApp");
    //角色配置
    app.controller('roleCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "角色配置";
        angular.extend($rootScope, fac.dicts);
        $scope.search = {};
        $scope.pageModel = {};
        console.log(app.user, app.park)
        app.modulePromiss.then(function () {
            $scope.find()
        });

        // 查询列表
        $scope.find = function (pageNo) {
            if ($scope.pageModel.currentPage) {
                delete $scope.pageModel.currentPage;
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            $scope.search.domainId = app.user.domainId
            fac.getPageResult("/ovu-park/backstage/role/page", $scope.search, function (data) {
                $scope.pageModel = data;
            });

        };

        //新增编辑
        $scope.showEditModal = function (item) {

            // if(!fac.checkPark($scope)){
            // 	return
            // }

            var item = item ? item : {};

            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/serviceManage/RoleConfiguration/modal.editBottomMenuConfig.html',
                controller: 'editConfig',
                resolve: {
                    item: item
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                $scope.find();
                console.info('Modal dismissed at: ' + new Date());
            });
            event.stopPropagation();
        };

        $scope.alert = function () {
            console.log(111111111)
        }

        //关联服务
        $scope.showServicesModal = function (item) {

            // if(!fac.checkPark($scope)){
            // 	return
            // }

            var item = item ? item : {};

            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/serviceManage/RoleConfiguration/modal.showServicesModal.html',
                controller: 'showServicesModal',
                resolve: {
                    item: item
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                $scope.find();
                console.info('Modal dismissed at: ' + new Date());
            });
            // event.stopPropagation();
        };
        //关联账号
        $scope.showAccountModal = function (item) {

            // if(!fac.checkPark($scope)){
            // 	return
            // }

            var item = item ? item : {};
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/serviceManage/RoleConfiguration/modal.showAccountModal.html',
                controller: 'showAccountModal',
                resolve: {
                    item: item
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                $scope.find();
                console.info('Modal dismissed at: ' + new Date());
            });
            event.stopPropagation();
        };

        //解除关联
        $scope.remove = function (item) {

            // if(!fac.checkPark($scope)){
            // 	return
            // }

            var item = item ? item : {};
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/serviceManage/RoleConfiguration/modal.remove.html',
                controller: 'remove',
                resolve: {
                    item: item
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                $scope.find();
                console.info('Modal dismissed at: ' + new Date());
            });
            event.stopPropagation();
        };

        $scope.del = function (item) {
            confirm("确认删除该角色吗?", function () {
                $.get("/ovu-park/backstage/role/deleteRole", {
                    id: item.id,
                    domainId: app.user.domainId
                }, function (resp) {
                    if (resp.code == 0) {
                        window.msg('删除成功!');
                        $scope.find();
                    } else {
                        window.alert(resp.msg);
                    }
                });
            })
        };

    });

    // 新增编辑
    app.controller('editConfig', function ($scope, $rootScope, $http, $uibModalInstance, $filter, $uibModal, fac, item) {
        $scope.item = item
        $scope.item.domainId = app.user.domainId
        if ($scope.item.roleType == 2) {
            $scope.item.roleTypeName = '自定义角色'
        }
        $scope.save = function () {
            $.get("/ovu-park/backstage/role/saveOrUpdate", $scope.item, function (resp) {
                if (resp.code == 0) {
                    $uibModalInstance.close();
                    window.msg("操作成功!");

                } else {
                    window.alert("操作失败")
                }

            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    //关联服务
    app.controller('showServicesModal', function ($scope, $rootScope, $http, $uibModalInstance, $filter, $uibModal, fac, item) {
        $scope.parentServiceName = "角色配置"
        $scope.personDeptTree = []
        $scope.item = item
        $scope.item.roleId = $scope.item.id
        fac.getResult("/ovu-park/backstage/role/listShowRoleService", {
            roleId: $scope.item.roleId,
            domainId: app.user.domainId
        }, function (res) {
            $scope.personDeptTree = res
        });
        $.get("/ovu-park/backstage/role/listRoleService", {
            roleId: $scope.item.roleId,
            domainId: app.user.domainId
        }, function (resp) {
            if (resp.code == 0) {
                // console.log(resp)
                $scope.serviceIds = resp.data
            } else {
                window.alert("操作失败")
            }
        });
        // console.log($scope.personDeptTree)
        // var cache = {
        //     "id": item.id,
        //     "mainType": item.mainType
        // }
        // $scope.userClassify = {
        //     enterprise: item.permission && item.permission.indexOf('2') != -1 ? true : false,
        //     virtualCom: item.permission && item.permission.indexOf('0') != -1 ? true : false,
        //     staff: item.permission && item.permission.indexOf('3') != -1 ? true : false,
        //     personal: item.permission && item.permission.indexOf('1') != -1 ? true : false,
        //     operation: item.permission && item.permission.indexOf('4') != -1 ? true : false
        // }
        angular.extend($scope.item, item);
        // console.log($scope)

        // 获取第一级职位
        $scope.loadJobType = function () {
            $http.post("/ovu-park/backstage/role/listSelectService", {}, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    // console.log(resp)
                    var datas = resp.data;
                    for (var i = 0; i < datas.length; i++) {
                        if (datas[i].useType == 1) {
                            datas[i].useTypeName = "App/Web"
                        } else if (datas[i].useType == 2) {
                            datas[i].useTypeName = "Web"
                        } else if (datas[i].useType == 3) {
                            datas[i].useTypeName = "App"
                        }
                        datas[i].iconCls = "noBg";
                        datas[i].text = datas[i].serviceName + "(" + datas[i].parkName + "-" + datas[i].useTypeName + ")";
                        if (datas[i].isParent) {
                            datas[i].state = "closed";
                            $scope.parentId = datas[i].parentId
                        }
                    }
                    $('#AppServerTree_role').tree({
                        data: datas,
                        animate: true,
                        onBeforeExpand: function (row) {
                            // console.log(row)
                            if (row) {
                                loadData(row);
                            }
                            return false;
                        },
                        onClick: function (row) {
                            // console.log(row)
                            if (row) {
                                selJob(row);
                            }
                        }
                    });


                } else {
                    alert(resp.message);
                }
            });
        }
        $scope.loadJobType();

        // 获取子节点
        function loadData(row) {
            var params = {
                "parentId": row.id
            }
            $http.post("/ovu-park/backstage/role/listSelectService", params, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    var datas = resp.data;
                    var childrenNodes = $('#AppServerTree_role').tree('getChildren', row.target);
                    if (childrenNodes.length > 0) {
                        for (var i = 0; i < childrenNodes.length; i++) {
                            $('#AppServerTree_role').tree('remove', childrenNodes[i].target);
                        }
                    };
                    for (var i = 0; i < datas.length; i++) {
                        if (datas[i].useType == 1) {
                            datas[i].useTypeName = "App/Web"
                        } else if (datas[i].useType == 2) {
                            datas[i].useTypeName = "Web"
                        } else if (datas[i].useType == 3) {
                            datas[i].useTypeName = "App"
                        }
                        datas[i].iconCls = "noBg";
                        datas[i].text = datas[i].serviceName + "(" + datas[i].parkName + "-" + datas[i].useTypeName + ")";
                        if (datas[i].isParent) {
                            datas[i].state = "closed";
                        }
                    };
                    var node = $('#AppServerTree_role').tree("getSelected");
                    $('#AppServerTree_role').tree("append", {
                        parent: row.target,
                        data: datas,
                    });
                    $('#AppServerTree_role').tree('expand', row.target);
                    // return true;
                } else {
                    alert(resp.message);
                }
            });
        }



        // 选择子节点
        function selJob(row) {
            // console.log(row)
            if (row.isParent == 0) {
                $scope.personDeptTree.push({
                    id: row.id,
                    parentId: row.parentId,
                    serviceName: row.serviceName
                })
                $scope.personDeptTree = func4($scope.personDeptTree)
                // console.log($scope.personDeptTree)
                // calcuPersonDept()
            }
            // debugger
            $scope.item.checkName = row.text;
            $scope.$apply(function () {
                $scope.item.checkName = row.text;
            });
            $scope.item.parentId = row.id

        }
        // 清楚选中父级
        $scope.clearSel = function () {
            $scope.item.parentId = null;
            $scope.item.checkName = null;
        }


        //供应商显示列表去重
        function func4(objArray) {
            var result = [];
            var temp = {};
            for (var i = 0; i < objArray.length; i++) {
                var myname = objArray[i].id;
                if (temp[myname]) {
                    continue;
                }
                temp[myname] = true;
                result.push(objArray[i])
            }
            return result;
        }
        $scope.delPro = function (item) {
            // console.log($scope.item)
            // return
            for (var i = 0; i < $scope.personDeptTree.length; i++)
                if ($scope.personDeptTree[i].id === item.id) {
                    $scope.serviceIds.splice(i, 1);
                    $scope.personDeptTree.splice(i, 1);
                    // console.log($scope.serviceIds)
                    break;
                }
        }

        // 交换数组元素
        var swapItems = function (arr, index1, index2) {
            arr[index1] = arr.splice(index2, 1, arr[index1])[0];
            return arr;
        };


        $scope.save = function (form) {
            if ($(".save").attr("disabled")) {
                return false;
            }
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            //用户分类
            // if (!$scope.userClassify.virtualCom && !$scope.userClassify.personal && !$scope.userClassify.enterprise && !$scope.userClassify.staff && !$scope.userClassify.operation) {
            //     alert("请勾选用户权限");
            //     return false;
            // }
            // 字段补全
            // $scope.item.parkId = $scope.dept.parkId
            // debugger
            $scope.ids = []
            $scope.personDeptTree.forEach(ele => {
                $scope.ids.push(ele.id)
            })
            $scope.personDeptTree.forEach(ele => {
                $scope.ids.push(ele.parentId)
            })
            $scope.ids.push($scope.parentId)
            // console.log($scope.ids)
            $scope.item.serviceIds = $scope.ids.join()
            $scope.item.roleId = $scope.item.id
            $scope.item.domainId = app.user.domainId
            console.log($scope.item)
            $.get("/ovu-park/backstage/role/changeRoleService", $scope.item, function (resp) {
                if (resp.code == 0) {
                    $uibModalInstance.close();
                    window.msg("操作成功!");

                } else {
                    window.alert("操作失败")
                }

            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    //关联账号
    app.controller('showAccountModal', function ($scope, $http, $uibModalInstance, $filter, fac, item, $uibModal) {
        $scope.item = item;
        $scope.selectedReceiver = '';
        $scope.nameList = []
        console.log($scope.item)
        var temp = [];
        if ($scope.item.id) {
            $http.post("/ovu-park/backstage/role/listUserByRole", {
                roleId: $scope.item.id,
                domainId: app.user.domainId
            }, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    // console.log(resp)
                    $scope.customers = resp.data
                    $scope.customers.forEach(ele => {
                        $scope.nameList.push(ele.name)
                    })
                    $scope.selectedReceiver = $scope.nameList.join(',')
                } else {
                    window.alert("操作失败")
                }

            });
        }
        $scope.saveMessage = function (form, item) {
            $uibModalInstance.close();
            window.msg("操作成功!");

        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
            $uibModalInstance.close();
        };

        $scope.chooseCompany = function () {
            var params = {
                parkId: app.park.parkId,
                currentPage: 1,
                pageSize: 10,
                pageIndex: 0
            };
            fac.getPageResult("/ovu-base/ovupark/backstage/customer/getListByIdsNew", params, function (resp) {
                for (var i = 0; i < resp.data.length; i++) {
                    if ($scope.item.sendCustomers && $scope.item.sendCustomers.indexOf(resp.data[i].id) != -1) {
                        resp.data[i].disabled = true;
                    } else {
                        resp.data[i].disabled = false;
                    }
                }
                var modal = $uibModal.open({
                    animation: false,
                    size: 'lg',
                    templateUrl: "/view/serviceManage/RoleConfiguration/modal.chooseCompany.html",
                    controller: 'chooseCompanyCtrl',
                    resolve: {
                        chooseCompany: {
                            roleId: $scope.item.id,
                            pages: resp,
                            customers: $scope.item.customers,
                            ids: $scope.item.sendCustomers
                        }
                    }
                });
                modal.result.then(function (r) {
                    $scope.item.sendCustomers = r.pIds;
                    $scope.item.customers = r.tempAddedCustomers;
                    $(".chooseCompanyPanle input").val(r.pNames);
                    $scope.$applyAsync();
                    var selectedReceiver = []
                    $scope.item.customers.forEach(ele => {
                        selectedReceiver.push(ele.name)
                    })
                    $scope.selectedReceiver = selectedReceiver.join(',')
                    // console.log($scope.item.customers)

                }, function (reason) {
                    console.info('Modal chooseCompany dismissed at: ' + new Date());
                });
            });
        };

    });

    //解除关联
    app.controller('remove', function ($scope, $http, $uibModalInstance, $filter, fac, item, $uibModal) {
        $scope.item = item;
        $scope.selectedReceiver = '';
        $scope.nameList = []
        console.log($scope.item)
        var temp = [];
        if ($scope.item.id) {
            $http.post("/ovu-park/backstage/role/listInvertUserByRole", {
                roleId: $scope.item.id,
                domainId: app.user.domainId
            }, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    // console.log(resp)
                    $scope.customers = resp.data
                    $scope.customers.forEach(ele => {
                        $scope.nameList.push(ele.name)
                    })
                    $scope.selectedReceiver = $scope.nameList.join(',')
                } else {
                    window.alert("操作失败")
                }

            });
        }
        $scope.saveMessage = function (form, item) {
            $uibModalInstance.close();
            window.msg("操作成功!");

        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
            $uibModalInstance.close();
        };

        $scope.chooseCompany333 = function () {
            var params = {
                parkId: app.park.parkId,
                currentPage: 1,
                pageSize: 10,
                pageIndex: 0
            };
            fac.getPageResult("/ovu-base/ovupark/backstage/customer/getListByIdsNew", params, function (resp) {
                for (var i = 0; i < resp.data.length; i++) {
                    if ($scope.item.sendCustomers && $scope.item.sendCustomers.indexOf(resp.data[i].id) != -1) {
                        resp.data[i].disabled = true;
                    } else {
                        resp.data[i].disabled = false;
                    }
                }
                var modal = $uibModal.open({
                    animation: false,
                    size: 'lg',
                    templateUrl: "/view/serviceManage/RoleConfiguration/modal.chooseCompany333.html",
                    controller: 'chooseCompany333Ctrl',
                    resolve: {
                        chooseCompany: {
                            roleId: $scope.item.id,
                            pages: resp,
                            customers: $scope.item.customers,
                            ids: $scope.item.sendCustomers
                        }
                    }
                });
                modal.result.then(function (r) {
                    $scope.item.sendCustomers = r.pIds;
                    $scope.item.customers = r.tempAddedCustomers;
                    $(".chooseCompanyPanle input").val(r.pNames);
                    $scope.$applyAsync();
                    var selectedReceiver = []
                    $scope.item.customers.forEach(ele => {
                        selectedReceiver.push(ele.name)
                    })
                    $scope.selectedReceiver = selectedReceiver.join(',')
                    // console.log($scope.item.customers)

                }, function (reason) {
                    console.info('Modal chooseCompany dismissed at: ' + new Date());
                });
            });
        };

    });

    app.controller('chooseCompanyCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, chooseCompany, $uibModal) {
        console.log(chooseCompany)
        $scope.pageModel = chooseCompany.pages;
        $scope.customers = chooseCompany.customers;
        $scope.roleId = chooseCompany.roleId;
        angular.extend($rootScope, fac.dicts);
        $scope.search = {
            parkId: app.park.parkId,
            currentPage: 1,
            pageSize: 10,
            pageIndex: 0,
            totalCount: 0,
            name: "",
            userType: "",
            phone: ""
        }
        $scope.userType = [{
                value: 1,
                text: "个人用户"
            },
            {
                value: 2,
                text: "企业用户"
            },
            {
                value: 3,
                text: "员工用户"
            },
        ]
        if ($scope.roleId) {
            $http.post("/ovu-park/backstage/role/listUserByRole", {
                roleId: $scope.roleId,
                domainId: app.user.domainId
            }, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    // console.log(resp)
                    $scope.customers = resp.data
                } else {
                    window.alert("操作失败")
                }

            });
        }
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            $scope.search.domainId = app.user.domainId
            fac.getPageResult("/ovu-base/ovupark/backstage/customer/getListByIdsNew", $scope.search, function (cInfos) {
                console.log($scope.ids)
                $scope.ids = []
                $scope.customers.forEach(ele => {
                    $scope.ids.push(ele.id)
                })

                for (var i = 0; i < cInfos.data.length; i++) {
                    if ($scope.ids && $scope.ids.indexOf(cInfos.data[i].id) != -1) {
                        cInfos.data[i].disabled = true;
                    } else {
                        cInfos.data[i].disabled = false;
                    }
                }
                $scope.pageModel = cInfos;
                $scope.$applyAsync();
            });
        };
        $scope.find();
        $scope.query = function () {
            $scope.pageModel.currentPage = 0;
            $scope.pageModel.pageSize = 10;
            $scope.pageModel.pageIndex = 0;
            $scope.pageModel.totalCount = 0;
            $scope.find();
        }
        $scope.removePersonItem = function (personId, personName) {
            $("#selectTable  #" + personId).html("<span class='glyphicon glyphicon-plus'></span>添加");
            $("#selectTable  #" + personId).removeAttr("disabled");
            $("#selectTable  #" + personId).removeAttr("ng-disabled");
        };

        $scope.initRemove = function (cus) {
            $scope.removePersonItem(cus.id, cus.name);
            $("li[personId=" + cus.id + "]", ".ul-persons").remove();
        };

        $scope.addPersonItem = function (item, bool) {
            // loginId
            var personId = item.id
            if (item.name) {
                personName = item.name
            } else {
                personName = item.loginName
            }
            if ($("#selectTable  #" + personId).attr("disabled") || $("#selectTable  #" + personId).attr("ng-disabled") == "true") {
                return false;
            }

            //如果是单选，已经添加了一个，先删除原来的，在添加新的人员
            if ($("#selectForm #PER_TYPE").val() == "1") {
                $(".ul-persons .item").each(function () {
                    var id = $(this).attr("personId"); //获取原来的人员id
                    var name = $(this).attr("personName"); //原来的人员姓名，状态改为可选
                    $("#selectTable  #" + id).removeAttr("disabled");
                    $(".ul-persons .item").remove();
                });
            }

            var li = $("<li ></li>");
            $(li).addClass("item");
            $(li).attr("personId", personId);
            $(li).attr("personName", personName);
            $(li).text(personName);
            var a = $('<a href="javascript:void(0);"></a>');
            $(a).append("<i class='fa fa-remove'></i>");
            $(li).append(a);
            $(".ul-persons").append(li);
            if (bool) { //添加人员，状态改为已添加
                $("#selectTable  #" + personId).html("<span class='glyphicon'></span>已添加");
                $("#selectTable  #" + personId).attr("disabled", "disabled");
            }

            $(a).bind("click", function () {
                $(this).parent().remove();
                $scope.removePersonItem(personId, personName);
            });

        };

        $scope.checkPerson = function () {
            var checkedP = $(".ul-persons .item");
            // if (checkedP.length <= 0) {
            //     window.msg("请至少添加一个用户!");
            //     return false;
            // }
            var pIds = "",
                pNames = "";
            var tempAddedCustomers = [];
            checkedP.each(function (index) {
                pIds += $(this).attr("personId");
                pNames += $(this).attr("personName");
                tempAddedCustomers.push({
                    'id': $(this).attr("personId"),
                    'name': $(this).attr("personName")
                });
                if (index < checkedP.length - 1) {
                    pIds += ",";
                    pNames += ",";
                }
            });
            // console.log(tempAddedCustomers)
            var userIds = []
            tempAddedCustomers.forEach(ele => {
                userIds.push(ele.id)
            })
            $scope.item = {
                userIds: userIds.join(','),
                roleId: $scope.roleId,
                domainId: app.user.domainId
            }
            $http.post("/ovu-park/backstage/role/changeUserRole", $scope.item, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $uibModalInstance.close({
                        pNames: pNames,
                        tempAddedCustomers: tempAddedCustomers,

                    });
                    window.msg("操作成功!");

                } else {
                    window.alert("操作失败")
                }

            });


        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });

    //解除关联选择账号
    app.controller('chooseCompany333Ctrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, chooseCompany, $uibModal) {
        console.log(chooseCompany)
        $scope.pageModel = chooseCompany.pages;
        $scope.customers = chooseCompany.customers;
        $scope.roleId = chooseCompany.roleId;
        angular.extend($rootScope, fac.dicts);
        $scope.search = {
            parkId: app.park.parkId,
            currentPage: 1,
            pageSize: 10,
            pageIndex: 0,
            totalCount: 0,
            name: "",
            userType: "",
            phone: ""
        }
        $scope.userType = [{
                value: 1,
                text: "个人用户"
            },
            {
                value: 2,
                text: "企业用户"
            },
            {
                value: 3,
                text: "员工用户"
            },
        ]
        if ($scope.roleId) {
            $http.post("/ovu-park/backstage/role/listInvertUserByRole", {
                roleId: $scope.roleId,
                domainId: app.user.domainId
            }, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    // console.log(resp)
                    $scope.customers = resp.data
                } else {
                    window.alert("操作失败")
                }

            });
        }
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            $scope.search.domainId = app.user.domainId
            fac.getPageResult("/ovu-base/ovupark/backstage/customer/getListByIdsNew", $scope.search, function (cInfos) {
                console.log($scope.ids)
                $scope.ids = []
                $scope.customers.forEach(ele => {
                    $scope.ids.push(ele.id)
                })

                for (var i = 0; i < cInfos.data.length; i++) {
                    if ($scope.ids && $scope.ids.indexOf(cInfos.data[i].id) != -1) {
                        cInfos.data[i].disabled = true;
                    } else {
                        cInfos.data[i].disabled = false;
                    }
                }
                $scope.pageModel = cInfos;
                $scope.$applyAsync();
            });
        };
        $scope.find();
        $scope.query = function () {
            $scope.pageModel.currentPage = 0;
            $scope.pageModel.pageSize = 10;
            $scope.pageModel.pageIndex = 0;
            $scope.pageModel.totalCount = 0;
            $scope.find();
        }
        $scope.removePersonItem = function (personId, personName) {
            $("#selectTable  #" + personId).html("<span class='glyphicon glyphicon-plus'></span>添加");
            $("#selectTable  #" + personId).removeAttr("disabled");
            $("#selectTable  #" + personId).removeAttr("ng-disabled");
        };

        $scope.initRemove = function (cus) {
            $scope.removePersonItem(cus.id, cus.name);
            $("li[personId=" + cus.id + "]", ".ul-persons").remove();
        };

        $scope.addPersonItem = function (item, bool) {
            // loginId
            var personId = item.id,
                personName = item.name;
            if ($("#selectTable  #" + personId).attr("disabled") || $("#selectTable  #" + personId).attr("ng-disabled") == "true") {
                return false;
            }

            //如果是单选，已经添加了一个，先删除原来的，在添加新的人员
            if ($("#selectForm #PER_TYPE").val() == "1") {
                $(".ul-persons .item").each(function () {
                    var id = $(this).attr("personId"); //获取原来的人员id
                    var name = $(this).attr("personName"); //原来的人员姓名，状态改为可选
                    $("#selectTable  #" + id).removeAttr("disabled");
                    $(".ul-persons .item").remove();
                });
            }

            var li = $("<li ></li>");
            $(li).addClass("item");
            $(li).attr("personId", personId);
            $(li).attr("personName", personName);
            $(li).text(personName);
            var a = $('<a href="javascript:void(0);"></a>');
            $(a).append("<i class='fa fa-remove'></i>");
            $(li).append(a);
            $(".ul-persons").append(li);
            if (bool) { //添加人员，状态改为已添加
                $("#selectTable  #" + personId).html("<span class='glyphicon'></span>已添加");
                $("#selectTable  #" + personId).attr("disabled", "disabled");
            }

            $(a).bind("click", function () {
                $(this).parent().remove();
                $scope.removePersonItem(personId, personName);
            });

        };

        $scope.checkPerson = function () {
            var checkedP = $(".ul-persons .item");
            // if (checkedP.length <= 0) {
            //     window.msg("请至少添加一个用户!");
            //     return false;
            // }
            var pIds = "",
                pNames = "";
            var tempAddedCustomers = [];
            checkedP.each(function (index) {
                pIds += $(this).attr("personId");
                pNames += $(this).attr("personName");
                tempAddedCustomers.push({
                    'id': $(this).attr("personId"),
                    'name': $(this).attr("personName")
                });
                if (index < checkedP.length - 1) {
                    pIds += ",";
                    pNames += ",";
                }
            });
            // console.log(tempAddedCustomers)
            var userIds = []
            tempAddedCustomers.forEach(ele => {
                userIds.push(ele.id)
            })
            $scope.item = {
                userIds: userIds.join(','),
                roleId: $scope.roleId,
                domainId: app.user.domainId
            }
            $http.post("/ovu-park/backstage/role/changeInvertUserRole", $scope.item, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $uibModalInstance.close({
                        pNames: pNames,
                        tempAddedCustomers: tempAddedCustomers,
                    });
                    window.msg("操作成功!");

                } else {
                    window.alert("操作失败")
                }

            });


        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });

    //运营角色配置
    app.controller('operatingCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "角色配置";
        angular.extend($rootScope, fac.dicts);
        $scope.search = {};
        $scope.pageModel = {};

        app.modulePromiss.then(function () {
            $scope.find()
        });

        // 查询列表
        $scope.find = function (pageNo) {
            if ($scope.pageModel.currentPage) {
                delete $scope.pageModel.currentPage;
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            // $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            $scope.search.domainId = app.user.domainId
            // $scope.search.queryType = 'yyd'
            fac.getPageResult("/ovu-park/backstage/authUser/pageYyd", $scope.search, function (data) {
                $scope.pageModel = data;
            });

        };

        //新增编辑
        $scope.showEditModal = function (item) {
            console.log(item)
            var item = item ? item : {};

            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/serviceManage/RoleConfiguration/modal.editOperating.html',
                controller: 'editOperating',
                resolve: {
                    item: item
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                $scope.find();
                console.info('Modal dismissed at: ' + new Date());
            });
            event.stopPropagation();
        };


        //关联账号
        $scope.showAccountModal = function (item) {

            // if(!fac.checkPark($scope)){
            // 	return
            // }

            var item = item ? item : {};
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/serviceManage/RoleConfiguration/modal.showAccountModal.html',
                controller: 'showAccountModal',
                resolve: {
                    item: item
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                $scope.find();
                console.info('Modal dismissed at: ' + new Date());
            });
            event.stopPropagation();
        };

        $scope.del = function (item) {
            confirm("确认删除该账号吗?", function () {
                $.get("/ovu-park/backstage/authUser/delete", {
                    id: item.id,
                    domainId: app.user.domainId
                }, function (resp) {
                    if (resp.code == 0) {
                        window.msg("删除成功!");
                        $scope.find();
                    } else {
                        window.alert(resp.msg);
                    }
                });
            })
        };

    });

    // 运营新增编辑
    app.controller('editOperating', function ($scope, $rootScope, $http, $uibModalInstance, $filter, $uibModal, fac, item) {
        // $scope.item.customer111 = []
        // $scope.item.customer222 = []
        // $scope.item.customer444 = []
        console.log(item)
        $scope.item = item
        if (item.id) {
            $scope.selectedReceiver111 = item.webName
            $scope.selectedReceiver222 = item.backName
            $scope.selectedReceiver444 = item.emsUserName
        } else {

        }
        
        $scope.chooseCompany111 = function () {
            console.log(app.park)
            if($scope.item.customer111 && $scope.item.customer111.length){
                $scope.item.parkUserId=$scope.item.customer111[0].id
                $scope.item.webName=$scope.item.customer111[0].name
            }
            var params = {
                parkId: app.park.parkId,
                currentPage: 1,
                pageSize: 10,
                pageIndex: 0
            };
            fac.getPageResult("/ovu-base/ovupark/backstage/customer/getListByIdsNew", params, function (resp) {
                console.log(resp)
                for (var i = 0; i < resp.data.length; i++) {
                    
                    if ($scope.item.parkUserId && $scope.item.parkUserId.indexOf(resp.data[i].id) != -1) {
                        console.log($scope.item.parkUserId.indexOf(resp.data[i].id) != -1)
                        resp.data[i].disabled = true;
                    } else {
                        resp.data[i].disabled = false;
                    }
                }
                if (!$scope.item.parkUserId) {
                    $scope.item.customer111 = []
                } else {
                    $scope.item.customer111 = [{
                        id: $scope.item.parkUserId,
                        name: $scope.item.webName
                    }]
                }
                var modal = $uibModal.open({
                    animation: false,
                    size: 'lg',
                    templateUrl: "/view/serviceManage/RoleConfiguration/modal.chooseCompany111.html",
                    controller: 'chooseCompany111Ctrl',
                    resolve: {
                        chooseCompany: {
                            roleId: $scope.item.id,
                            pages: resp,
                            customers: $scope.item.customer111,
                            ids: $scope.item.sendCustomer111,
                            customer111: $scope.item.customer111
                        }
                    }
                });
                modal.result.then(function (r) {
                    console.log(r)
                    $scope.item.sendCustomer111 = r.pIds;
                    $scope.item.customer111 = r.tempAddedCustomers111;
                    $(".chooseCompanyPanle input").val(r.pNames);
                    $scope.$applyAsync();
                    if ($scope.item.customer111.length != 0) {
                        $scope.item.customer111.forEach(ele => {
                            $scope.selectedReceiver111 = ele.name
                            $scope.parkUserId = ele.id
                        })
                    } else {
                        $scope.item.selectedReceiver111 = ''
                        $scope.item.parkUserId = ''
                        $scope.selectedReceiver111 = ''
                        $scope.parkUserId = ''
                    }



                }, function (reason) {
                    console.info('Modal chooseCompany dismissed at: ' + new Date());
                });
            });
        };

        $scope.chooseCompany222 = function () {
            console.log($scope.item, 111)
            $scope.deptId = app.park.pid
            if($scope.item.customer222 && $scope.item.customer222.length){
                $scope.item.yqtUserId=$scope.item.customer222[0].id
                $scope.item.backName=$scope.item.customer222[0].name
            }
            var params = {
                deptId: $scope.deptId,
                deptName: $scope.deptName,
                currentPage: 1,
                pageSize: 10,
                pageIndex: 0
            };
            fac.getPageResult("/ovu-base/pcos/person/listByGrid.do", params, function (resp) {
                console.log(resp)
                for (var i = 0; i < resp.data.length; i++) {
                    if ($scope.item.yqtUserId && $scope.item.yqtUserId.indexOf(resp.data[i].id) != -1) {
                        resp.data[i].disabled = true;
                    } else {
                        resp.data[i].disabled = false;
                    }
                }
                if (!$scope.item.yqtUserId) {
                    $scope.item.customer222 = []
                } else {
                    $scope.item.customer222 = [{
                        id: $scope.item.yqtUserId,
                        name: $scope.item.backName
                    }]
                }
                console.log($scope.item)
                var modal = $uibModal.open({
                    animation: false,
                    size: 'lg',
                    templateUrl: "/view/serviceManage/RoleConfiguration/modal.chooseCompany222.html",
                    controller: 'chooseCompany222Ctrl',
                    resolve: {
                        chooseCompany: {
                            roleId: $scope.item.id,
                            pages: resp,
                            customers: $scope.item.customer222,
                            ids: $scope.item.sendCustomer222,
                            customer222: $scope.item.customer222
                        }
                    }
                });
                modal.result.then(function (r) {
                    console.log(r)
                    $scope.item.sendCustomer222 = r.pIds;
                    $scope.item.customer222 = r.tempAddedCustomers222;
                    $(".chooseCompanyPanle input").val(r.pNames);
                    $scope.$applyAsync();
                    console.log($scope.item.customer222)
                    if ($scope.item.customer222.length != 0) {
                        $scope.item.customer222.forEach(ele => {
                            $scope.selectedReceiver222 = ele.name
                            $scope.yqtUserId = ele.id
                        })
                    } else {
                        $scope.selectedReceiver222 = ''
                        $scope.yqtUserId = ''
                        $scope.item.backName = ''
                        $scope.item.yqtUserId = ''
                    }


                }, function (reason) {
                    console.info('Modal chooseCompany dismissed at: ' + new Date());
                });
            });
        };

        $scope.chooseCompany444 = function () {
            $scope.deptId = app.park.pid
            $scope.deptName = "中电光谷"
            if($scope.item.customer444 && $scope.item.customer444.length){
                $scope.item.emsUserId=$scope.item.customer444[0].id
                $scope.item.emsUserName=$scope.item.customer444[0].name
            }
            var params = {
                deptId: $scope.deptId,
                deptName: $scope.deptName,
                currentPage: 1,
                pageSize: 10,
                pageIndex: 0
            };
            fac.getPageResult("/ovu-base/pcos/person/listByGrid1.do", params, function (resp) {
                for (var i = 0; i < resp.data.length; i++) {
                    if ($scope.item.emsUserId && $scope.item.emsUserId.indexOf(resp.data[i].id) != -1) {
                        resp.data[i].disabled = true;
                    } else {
                        resp.data[i].disabled = false;
                    }
                }
                if (!$scope.item.emsUserId) {
                    $scope.item.customer444 = []
                } else {
                    $scope.item.customer444 = [{
                        id: $scope.item.emsUserId,
                        name: $scope.item.emsUserName
                    }]
                }


                var modal = $uibModal.open({
                    animation: false,
                    size: 'lg',
                    templateUrl: "/view/serviceManage/RoleConfiguration/modal.chooseCompany444.html",
                    controller: 'chooseCompany444Ctrl',
                    resolve: {
                        chooseCompany: {
                            roleId: $scope.item.id,
                            pages: resp,
                            customers: $scope.item.customer444,
                            ids: $scope.item.sendCustomer444,
                            customer444: $scope.item.customer444
                        }
                    }
                });
                modal.result.then(function (r) {
                    $scope.item.sendCustomer444 = r.pIds;
                    $scope.item.customer444 = r.tempAddedCustomers444;
                    $(".chooseCompanyPanle input").val(r.pNames);
                    $scope.$applyAsync();
                    if ($scope.item.customer444.length != 0) {
                        $scope.item.customer444.forEach(ele => {
                            $scope.selectedReceiver444 = ele.name
                            $scope.emsUserId = ele.id
                        })
                    } else {
                        $scope.selectedReceiver444 = ''
                        $scope.emsUserId = ''
                        $scope.item.emsUserName = ''
                        $scope.item.emsUserId = ''
                    }

                }, function (reason) {
                    console.info('Modal chooseCompany dismissed at: ' + new Date());
                });
            });
        };
        $scope.save = function () {
            console.log($scope.item)

            if ($scope.item.customer111) {
                $scope.item.parkUserId = $scope.item.customer111[0].id
                $scope.item.webName = $scope.item.customer111[0].name
            }
            if ($scope.item.customer222) {
                $scope.item.yqtUserId = $scope.item.customer222[0].id
                $scope.item.backName = $scope.item.customer222[0].name
            }
            if ($scope.item.customer444) {
                $scope.item.emsUserId = $scope.item.customer444[0].id
                $scope.item.emsUserName = $scope.item.customer444[0].name
            }
            $scope.item1 = {
                yqtUserId: $scope.item.yqtUserId,
                parkUserId: $scope.item.parkUserId,
                emsUserId: $scope.item.emsUserId,
                domainId: app.user.domainId
            }
            $.get("/ovu-park/backstage/authUser/saveOrUpdate", $scope.item1, function (resp) {
                if (resp.code == 0) {
                    $uibModalInstance.close();
                    window.msg("操作成功!");

                } else {
                    window.alert(resp.msg)
                }

            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    //官网用户选择
    app.controller('chooseCompany111Ctrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, chooseCompany, $uibModal) {
        console.log(chooseCompany)
        $scope.pageModel = chooseCompany.pages;
        $scope.customer111 = chooseCompany.customers;
        $scope.roleId = chooseCompany.roleId;
        angular.extend($rootScope, fac.dicts);
        $scope.search = {
            parkId: app.park.parkId,
            currentPage: 1,
            pageSize: 10,
            pageIndex: 0,
            totalCount: 0,
            name: "",
            userType: "",
            phone: ""
        }
        $scope.userType = [{
                value: 1,
                text: "个人用户"
            },
            {
                value: 2,
                text: "企业用户"
            },
            {
                value: 3,
                text: "员工用户"
            },
        ]
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            fac.getPageResult("/ovu-base/ovupark/backstage/customer/getListByIdsNew", $scope.search, function (cInfos) {
                // if ($scope.roleId) {
                //     $scope.ids = $scope.customer111[0].id
                // }else{
                    
                // }
                if($scope.customer111 && $scope.customer111.length){
                    $scope.ids = $scope.customer111[0].id
                }
                for (var i = 0; i < cInfos.data.length; i++) {
                    if ($scope.ids && $scope.ids.indexOf(cInfos.data[i].id) != -1) {
                        cInfos.data[i].disabled = true;
                    } else {
                        cInfos.data[i].disabled = false;
                    }
                }
                $scope.pageModel = cInfos;
                $scope.$applyAsync();
            });
        };
        $scope.find();
        if (chooseCompany.customer111) {
            $scope.customer111 = chooseCompany.customer111
        }
        $scope.query = function () {
            $scope.pageModel.currentPage = 0;
            $scope.pageModel.pageSize = 10;
            $scope.pageModel.pageIndex = 0;
            $scope.pageModel.totalCount = 0;
            $scope.find();
        }
        $scope.removePersonItem = function (personId, personName) {
            $("#selectTable  #" + personId).html("<span class='glyphicon glyphicon-plus'></span>添加");
            $("#selectTable  #" + personId).removeAttr("disabled");
            $("#selectTable  #" + personId).removeAttr("ng-disabled");
        };

        $scope.initRemove = function (cus) {
            $scope.removePersonItem(cus.id, cus.name);
            $("li[personId=" + cus.id + "]", ".ul-persons").remove();
        };

        $scope.addPersonItem = function (item, bool) {
            // loginId
            var checkedPerson = $(".ul-persons .item")
            if (checkedPerson.length > 0) {
                window.msg("只能添加一个用户!");
                return false;
            }
            var personId = item.id,
                personName = item.name;
            if ($("#selectTable  #" + personId).attr("disabled") || $("#selectTable  #" + personId).attr("ng-disabled") == "true") {
                return false;
            }

            //如果是单选，已经添加了一个，先删除原来的，在添加新的人员
            if ($("#selectForm #PER_TYPE").val() == "1") {
                $(".ul-persons .item").each(function () {
                    var id = $(this).attr("personId"); //获取原来的人员id
                    var name = $(this).attr("personName"); //原来的人员姓名，状态改为可选
                    $("#selectTable  #" + id).removeAttr("disabled");
                    $(".ul-persons .item").remove();
                });
            }

            var li = $("<li ></li>");
            $(li).addClass("item");
            $(li).attr("personId", personId);
            $(li).attr("personName", personName);
            $(li).text(personName);
            var a = $('<a href="javascript:void(0);"></a>');
            $(a).append("<i class='fa fa-remove'></i>");
            $(li).append(a);
            $(".ul-persons").append(li);
            if (bool) { //添加人员，状态改为已添加
                $("#selectTable  #" + personId).html("<span class='glyphicon'></span>已添加");
                $("#selectTable  #" + personId).attr("disabled", "disabled");
            }

            $(a).bind("click", function () {
                $(this).parent().remove();
                $scope.removePersonItem(personId, personName);
            });

        };

        if ($scope.roleId) {
            $http.post("/ovu-park/backstage/role/listUserByRole", {
                roleId: $scope.roleId
            }, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    console.log(resp)
                    $scope.customers = resp.data
                } else {
                    window.alert("操作失败")
                }

            });
        }
        $scope.checkPerson = function () {
            var checkedP = $(".ul-persons .item");
            if (checkedP.length <= 0) {
                window.msg("请至少添加一个用户!");
                return false;
            }
            var pIds = "",
                pNames = "";
            var tempAddedCustomers = [];
            checkedP.each(function (index) {
                pIds += $(this).attr("personId");
                pNames += $(this).attr("personName");
                tempAddedCustomers.push({
                    'id': $(this).attr("personId"),
                    'name': $(this).attr("personName")
                });
                if (index < checkedP.length - 1) {
                    pIds += ",";
                    pNames += ",";
                }
            });
            console.log(tempAddedCustomers)
            var userIds = []
            tempAddedCustomers.forEach(ele => {
                userIds.push(ele.id)
            })
            $scope.item = {
                userIds: userIds.join(','),
                roleId: $scope.roleId
            }
            $uibModalInstance.close({
                pIds: pIds,
                pNames: pNames,
                tempAddedCustomers111: tempAddedCustomers
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });

    //运营用户选择
    app.controller('chooseCompany222Ctrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, chooseCompany, $uibModal) {
        console.log(chooseCompany)
        $scope.pageModel = chooseCompany.pages;
        $scope.customer222 = chooseCompany.customers;
        $scope.roleId = chooseCompany.roleId;
        angular.extend($rootScope, fac.dicts);
        $scope.search = {
            deptId: "",
            deptName: "",
            currentPage: 1,
            pageSize: 10,
            pageIndex: 0,
            totalCount: 0,
        }
        $scope.userType = [{
                value: 1,
                text: "个人用户"
            },
            {
                value: 2,
                text: "企业用户"
            },
            {
                value: 3,
                text: "员工用户"
            },
        ]
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
                deptId: app.park.pid,
                deptName: '中电光谷'
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            fac.getPageResult("/ovu-base/pcos/person/listByGrid.do", $scope.search, function (cInfos) {
                // if ($scope.roleId) {
                //     $scope.ids = $scope.customer222[0].id
                // }else{
                //     $scope.ids = $scope.customer222[0].id
                // }
                if($scope.customer222 && $scope.customer222.length){
                    $scope.ids = $scope.customer222[0].id
                }
                console.log( $scope.customer222)
                for (var i = 0; i < cInfos.data.length; i++) {
                    if ($scope.ids && $scope.ids.indexOf(cInfos.data[i].userId) != -1) {
                        cInfos.data[i].disabled = true;
                    } else {
                        cInfos.data[i].disabled = false;
                    }
                }
                $scope.pageModel = cInfos;
                $scope.$applyAsync();
            });
        };
        $scope.find();
        if (chooseCompany.customer222) {
            $scope.customer222 = chooseCompany.customer222
        }
        $scope.query = function () {
            $scope.pageModel.currentPage = 0;
            $scope.pageModel.pageSize = 10;
            $scope.pageModel.pageIndex = 0;
            $scope.pageModel.totalCount = 0;
            $scope.find();
        }
        $scope.removePersonItem = function (personId, personName) {
            $("#selectTable  #" + personId).html("<span class='glyphicon glyphicon-plus'></span>添加");
            $("#selectTable  #" + personId).removeAttr("disabled");
            $("#selectTable  #" + personId).removeAttr("ng-disabled");
        };

        $scope.initRemove = function (cus) {
            $scope.removePersonItem(cus.id, cus.name);
            $("li[personId=" + cus.id + "]", ".ul-persons").remove();
        };

        $scope.addPersonItem = function (item, bool) {
            // loginId
            var checkedPerson = $(".ul-persons .item")
            if (checkedPerson.length > 0) {
                window.msg("只能添加一个用户!");
                return false;
            }
            var personId = item.userId,
                personName = item.name;
            if ($("#selectTable  #" + personId).attr("disabled") || $("#selectTable  #" + personId).attr("ng-disabled") == "true") {
                return false;
            }

            //如果是单选，已经添加了一个，先删除原来的，在添加新的人员
            if ($("#selectForm #PER_TYPE").val() == "1") {
                $(".ul-persons .item").each(function () {
                    var id = $(this).attr("personId"); //获取原来的人员id
                    var name = $(this).attr("personName"); //原来的人员姓名，状态改为可选
                    $("#selectTable  #" + id).removeAttr("disabled");
                    $(".ul-persons .item").remove();
                });
            }

            var li = $("<li ></li>");
            $(li).addClass("item");
            $(li).attr("personId", personId);
            $(li).attr("personName", personName);
            $(li).text(personName);
            var a = $('<a href="javascript:void(0);"></a>');
            $(a).append("<i class='fa fa-remove'></i>");
            $(li).append(a);
            $(".ul-persons").append(li);
            if (bool) { //添加人员，状态改为已添加
                $("#selectTable  #" + personId).html("<span class='glyphicon'></span>已添加");
                $("#selectTable  #" + personId).attr("disabled", "disabled");
            }

            $(a).bind("click", function () {
                $(this).parent().remove();
                $scope.removePersonItem(personId, personName);
            });

        };

        // if ($scope.roleId) {
        //     $http.post("/ovu-park/backstage/role/listUserByRole", {
        //         roleId: $scope.roleId
        //     }, fac.postConfig).success(function (resp) {
        //         if (resp.code == 0) {
        //             console.log(resp)
        //             $scope.customers = resp.data
        //         } else {
        //             window.alert("操作失败")
        //         }

        //     });
        // }
        $scope.checkPerson = function () {
            var checkedP = $(".ul-persons .item");
            // if (checkedP.length <= 0) {
            //     window.msg("请至少添加一个用户!");
            //     return false;
            // }
            var pIds = "",
                pNames = "";
            var tempAddedCustomers = [];
            checkedP.each(function (index) {
                pIds += $(this).attr("personId");
                pNames += $(this).attr("personName");
                tempAddedCustomers.push({
                    'id': $(this).attr("personId"),
                    'name': $(this).attr("personName")
                });
                if (index < checkedP.length - 1) {
                    pIds += ",";
                    pNames += ",";
                }
            });
            console.log(tempAddedCustomers)
            var userIds = []
            tempAddedCustomers.forEach(ele => {
                userIds.push(ele.id)
            })
            $scope.item = {
                userIds: userIds.join(','),
                roleId: $scope.roleId
            }
            $uibModalInstance.close({
                pNames: pNames,
                tempAddedCustomers222: tempAddedCustomers
            });
            // $http.post("/ovu-park/backstage/role/changeUserRole", $scope.item, fac.postConfig).success(function (resp) {
            //     if (resp.code == 0) {

            //         window.msg("操作成功!");

            //     } else {
            //         window.alert("操作失败")
            //     }

            // });


        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });

    //物业用户选择
    app.controller('chooseCompany444Ctrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, chooseCompany, $uibModal) {
        console.log(chooseCompany)
        $scope.pageModel = chooseCompany.pages;
        $scope.customer444 = chooseCompany.customers;
        $scope.roleId = chooseCompany.roleId;
        angular.extend($rootScope, fac.dicts);
        $scope.search = {
            deptId: "",
            deptName: "",
            currentPage: 1,
            pageSize: 10,
            pageIndex: 0,
            totalCount: 0,
        }
        $scope.userType = [{
                value: 1,
                text: "个人用户"
            },
            {
                value: 2,
                text: "企业用户"
            },
            {
                value: 3,
                text: "员工用户"
            },
        ]
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
                deptId: app.park.pid,
                deptName: '中电光谷'
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            fac.getPageResult("/ovu-base/pcos/person/listByGrid1.do", $scope.search, function (cInfos) {
                // if ($scope.roleId) {
                //     $scope.ids = $scope.customer444[0].id
                // }else{
                //     $scope.ids = $scope.customer444[0].id
                // }
                if($scope.customer444 && $scope.customer444.length){
                    $scope.ids = $scope.customer444[0].id
                }
                console.log($scope.ids)
                for (var i = 0; i < cInfos.data.length; i++) {
                    if ($scope.ids && $scope.ids.indexOf(cInfos.data[i].userId) != -1) {
                        cInfos.data[i].disabled = true;
                    } else {
                        cInfos.data[i].disabled = false;
                    }
                }
                $scope.pageModel = cInfos;
                console.log($scope.pageModel, '物业')
                $scope.$applyAsync();
            });
        };
        $scope.find();
        if (chooseCompany.customer444) {
            $scope.customer444 = chooseCompany.customer444
        }
        $scope.query = function () {
            $scope.pageModel.currentPage = 0;
            $scope.pageModel.pageSize = 10;
            $scope.pageModel.pageIndex = 0;
            $scope.pageModel.totalCount = 0;
            $scope.find();
        }
        $scope.removePersonItem = function (personId, personName) {
            $("#selectTable  #" + personId).html("<span class='glyphicon glyphicon-plus'></span>添加");
            $("#selectTable  #" + personId).removeAttr("disabled");
            $("#selectTable  #" + personId).removeAttr("ng-disabled");
        };

        $scope.initRemove = function (cus) {
            $scope.removePersonItem(cus.id, cus.name);
            $("li[personId=" + cus.id + "]", ".ul-persons").remove();
        };

        $scope.addPersonItem = function (item, bool) {
            // loginId
            var checkedPerson = $(".ul-persons .item")
            if (checkedPerson.length > 0) {
                window.msg("只能添加一个用户!");
                return false;
            }
            var personId = item.userId,
                personName = item.name;
            if ($("#selectTable  #" + personId).attr("disabled") || $("#selectTable  #" + personId).attr("ng-disabled") == "true") {
                return false;
            }

            //如果是单选，已经添加了一个，先删除原来的，在添加新的人员
            if ($("#selectForm #PER_TYPE").val() == "1") {
                $(".ul-persons .item").each(function () {
                    var id = $(this).attr("personId"); //获取原来的人员id
                    var name = $(this).attr("personName"); //原来的人员姓名，状态改为可选
                    $("#selectTable  #" + id).removeAttr("disabled");
                    $(".ul-persons .item").remove();
                });
            }

            var li = $("<li ></li>");
            $(li).addClass("item");
            $(li).attr("personId", personId);
            $(li).attr("personName", personName);
            $(li).text(personName);
            var a = $('<a href="javascript:void(0);"></a>');
            $(a).append("<i class='fa fa-remove'></i>");
            $(li).append(a);
            $(".ul-persons").append(li);
            if (bool) { //添加人员，状态改为已添加
                $("#selectTable  #" + personId).html("<span class='glyphicon'></span>已添加");
                $("#selectTable  #" + personId).attr("disabled", "disabled");
            }

            $(a).bind("click", function () {
                $(this).parent().remove();
                $scope.removePersonItem(personId, personName);
            });

        };

        // if ($scope.roleId) {
        //     $http.post("/ovu-park/backstage/role/listUserByRole", {
        //         roleId: $scope.roleId
        //     }, fac.postConfig).success(function (resp) {
        //         if (resp.code == 0) {
        //             console.log(resp)
        //             $scope.customers = resp.data
        //         } else {
        //             window.alert("操作失败")
        //         }

        //     });
        // }
        $scope.checkPerson = function () {
            var checkedP = $(".ul-persons .item");
            // if (checkedP.length <= 0) {
            //     window.msg("请至少添加一个用户!");
            //     return false;
            // }
            var pIds = "",
                pNames = "";
            var tempAddedCustomers = [];
            checkedP.each(function (index) {
                pIds += $(this).attr("personId");
                pNames += $(this).attr("personName");
                tempAddedCustomers.push({
                    'id': $(this).attr("personId"),
                    'name': $(this).attr("personName")
                });
                if (index < checkedP.length - 1) {
                    pIds += ",";
                    pNames += ",";
                }
            });
            console.log(tempAddedCustomers)
            var userIds = []
            tempAddedCustomers.forEach(ele => {
                userIds.push(ele.id)
            })
            $scope.item = {
                userIds: userIds.join(','),
                roleId: $scope.roleId
            }
            $uibModalInstance.close({
                pNames: pNames,
                tempAddedCustomers444: tempAddedCustomers
            });
            // $http.post("/ovu-park/backstage/role/changeUserRole", $scope.item, fac.postConfig).success(function (resp) {
            //     if (resp.code == 0) {

            //         window.msg("操作成功!");

            //     } else {
            //         window.alert("操作失败")
            //     }

            // });


        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });
})()
