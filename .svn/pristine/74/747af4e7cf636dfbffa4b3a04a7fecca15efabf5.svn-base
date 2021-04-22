(function () {
    var app = angular.module("angularApp");
    app.controller('forceUpdateIndexCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-通知管理";
        $scope.current = 1;
        angular.extend($rootScope, fac.dicts);
        $scope.search = {};
        $scope.pageModel = {};
        $scope.stateOut = [{
                value: 0,
                text: "未生效"
            },
            {
                value: 1,
                text: "已生效"
            }
        ];
        // 查询
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-park/backstage/userforce/page", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
        $scope.find();
        $scope.query = function () {
            $scope.find();
        }
        // 新增和编辑
        $scope.showEditModal = function (item) {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/integratManage/forceUpdate/modal.updateapp.html',
                controller: 'updateAppModalCtrl',
                resolve: {
                    data: angular.extend({}, item)
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
        // 查看员工
        $scope.checkStaffList = function (item) {
            var modal = $uibModal.open({
                animation: true,
                size: 'lg',
                templateUrl: '/view/integratManage/forceUpdate/model.checkStaffList.html',
                controller: 'checkStaffListCtrl',
                resolve: {
                    item: item
                }
            });
            modal.result.then(function () {}, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        // 是否生效
        $scope.confirm = function (item) {
            let params = {
                status: item.status === 0 ? 1 : 0,
                id: item.id,
            }
            let text = item.status ===0 ? "确认生效吗": "确认取消吗"
            confirm(text, function () {
                $http.get("/ovu-park/backstage/userforce/updateStatus", {
                    params: params
                }).success(function (response) {
                    if (response.code === 0) {
                        if (item.status === 0) {
                            msg("已生效!");
                        } else {
                            msg("已取消!");
                        }
                        $scope.find();
                    }
                })
            })
        }
        // 删除
        $scope.cancel = function (item) {
            let params = {
                id: item.id,
            }
            confirm("确定删除吗", function () {
                $http.get("/ovu-park/backstage/userforce/delete", {
                    params: params
                }).success(function (response) {
                    if (response.code === 0) {
                        msg("已删除!");
                        $scope.find();
                    }
                })
            })
        }
    });

    // 新增编辑
    app.controller('updateAppModalCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, data) {
        $scope.item = {};
        $scope.userList = [];
        let nameList = [];
        let idList = [];
        $scope.userNames = '';
        $scope.userIds = '';
        $scope.sendType = "1";
        if (data.id) {
            $http.get("/ovu-park/backstage/userforce/get?id=" + data.id).success(function (response) {
                console.log(response)
                if (response.code === 0) {
                    let result = response.data;
                    $scope.item = result;
                    angular.forEach(result.userList, function (value) {
                        nameList.push(value.userName);
                        idList.push(value.userId);
                        $scope.userList.push({
                            nickname: value.userName,
                            id: value.userId
                        })
                    });
                    $scope.userNames = nameList.join(',');
                    $scope.userIds = idList.join(',');
                }
            })
        }
        //保存
        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            if (!item.userIds) {
                alert("请选择指定用户!");
                return false;
            }
            let params = {
                id: item.id,
                title: item.title,
                status: 0,
                userIds: item.userIds,
                iosVersion: item.iosVersion,
                androidVersion: item.androidVersion,
                iosUrl: item.iosUrl,
                androidUrl: item.androidUrl,
                content: item.content
            }
            $http.post("/ovu-park/backstage/userforce/saveOrEdit", params, fac.postConfig).success(function (data) {
                if (data.code === 0) {
                    $uibModalInstance.close();
                    msg("保存成功!");
                } else {
                    alert(data.error);
                }
            })
        };

        $scope.sendTypeChange = function (sendType) {
            if (sendType == "0") {
                $(".choosePeoplePanle").css("display", "none");
            } else {
                $(".choosePeoplePanle").css("display", "block");
            }
        };

        $scope.choosePeople = function () {
            var params = {
                parkId: app.park.parkId,
                currentPage: 1,
                pageSize: 10,
                pageIndex: 0
            };
            fac.getPageResult("/ovu-base/ovupark/backstage/customer/getListByIdsNew", params, function (resp) {
                for (var i = 0; i < resp.data.length; i++) {
                    if ($scope.userIds && $scope.userIds.indexOf(resp.data[i].id) != -1) {
                        resp.data[i].disabled = true;
                    } else {
                        resp.data[i].disabled = false;
                    }
                }
                var modal = $uibModal.open({
                    animation: false,
                    size: 'md',
                    templateUrl: '/view/integratManage/forceUpdate/modal.choosePeople.html',
                    controller: 'choosePeopleCtrl',
                    resolve: {
                        choosePeople: {
                            pages: resp,
                            customers: $scope.userList,
                            ids: $scope.userIds
                        }
                    }
                });
                modal.result.then(function (r) {
                    $scope.item.userIds = r.pIds;
                    $scope.item.customers = r.tempAddedCustomers;
                    $(".choosePeoplePanle input").val(r.pNames);
                    $scope.$applyAsync();

                }, function (reason) {
                    console.info('Modal choosePeopledismissed at: ' + new Date());
                });
            });

        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    // 选择用户
    app.controller('choosePeopleCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, choosePeople, $uibModal) {
        $scope.pageModel = choosePeople.pages;
        $scope.customers = choosePeople.customers;
        $scope.ids = choosePeople.ids;
        angular.extend($rootScope, fac.dicts);
        $scope.search = {
            parkId: app.park.parkId,
            currentPage: 1,
            pageSize: 10,
            pageIndex: 0,
            totalCount: 0,
            nickname: "",
            userType: "",
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
            $scope.removePersonItem(cus.id, cus.nickname);
            $("li[personId=" + cus.id + "]", ".ul-persons").remove();
        };

        $scope.addPersonItem = function (item, bool) {
            // loginId
            var personId = item.id,
                personName = item.nickname;
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
                    'nickname': $(this).attr("personName")
                });
                if (index < checkedP.length - 1) {
                    pIds += ",";
                    pNames += ",";
                }
            });

            $uibModalInstance.close({
                pIds: pIds,
                pNames: pNames,
                tempAddedCustomers: tempAddedCustomers
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });

    // 查看
    app.controller('checkStaffListCtrl', function ($scope, $http, $uibModalInstance, $uibModal, $filter, fac, item) {
        $scope.item = item || {};
        $http.get("/ovu-park/backstage/userforce/get?id=" + $scope.item.id).success(function (response) {
            console.log(response)
            if (response.code === 0) {
                let result = response.data;
                $scope.pageModel = result;
            }
        })
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };


    });


    app.filter("takeEffect", function () { //转换标题
        return function (value) {
            if (value == 0) {
                return "未生效";
            } else if (value == 1) {
                return "已生效";
            } else {
                return "--";
            }
        }
    });
})()
