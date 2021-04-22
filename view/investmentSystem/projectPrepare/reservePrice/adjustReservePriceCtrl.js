(function () {
    var app = angular.module("angularApp");
    app.controller('adjustReservePriceCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "底价调价方案查询";
        var width = $(window).width() - 300
        $('#table_rese').width(width)
        app.modulePromiss.then(function () {
            $scope.search = {};
            $scope.pageModel = {};
            $scope.$watch('project.id', function (projectId, oldValue) {
                if (projectId) {
                    $scope.search.park_id = ""
                    $scope.search.stage_id = ""
                    $scope.search.build_id = ""
                    $scope.search.park_id = $rootScope.project.parkId;
                    $rootScope.project.buildId && ($scope.search.build_id = $rootScope.project.buildId)
                    $rootScope.project.stageId && ($scope.search.stage_id = $rootScope.project.stageId)
                    $scope.find(1)
                }
            })

        });

        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-park/backstage/sale/saleMinAdjustmentProject/list", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
        //编辑／新增模态窗口
        $scope.addReserve = function (id) {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/investmentSystem/projectPrepare/reservePrice/modal.addReservePrice.html',
                controller: 'addReservePriceCtrl',
                resolve: {}
            });
            modal.result.then(function () {
                $scope.find(1);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.delReserce = function (item) {
            if (item.approveStatus == 1 || item.approveStatus == 2) {
                return
            }
            confirm("确认删除?", function () {
                $http.post("/ovu-park/backstage/sale/saleMinAdjustmentProject/delete", {
                    "id": item.id
                }, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        $scope.find(1);
                    } else {
                        alert(resp.error);
                    }
                })
            });

        }
        //查看调价方案
        $scope.showModal = function (id, states, isShow) {
            if (states != 0 && !isShow) {
                return
            }
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/investmentSystem/projectPrepare/reservePrice/modal.reserveMethod.html',
                controller: 'reserveMethodCtrl',
                resolve: {
                    param: {
                        'id': id,
                        states: states,
                        "isShow": isShow
                    }
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
        //审批
        $scope.approve = function (item) {
            if (item.approveStatus !== 1) {
                return
            }
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '/view/investmentSystem/projectPrepare/modal.approval.html',
                controller: 'reserveApprovalCtrl',
                resolve: {
                    paramdata: {
                        id: item.id,
                        enactmentDate: item.enactmentDate
                    }
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
    });

    //新增调价方案
    app.controller('addReservePriceCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac) {
        $scope.curIndex = 1;
        $scope.parkId = $rootScope.project.parkId;

        $scope.priceInfo = {
            pricingmanner: 1, //计价方式
            computingMethod: 1 //计算方法
        }
        $scope.adjustRoomList = []
        var houses = []; //选中的房间信息

        // 页面初始化
        // app.modulePromiss.then(function () {
        //     $scope.$watch('dept.id', function (deptId, oldValue) {
        //         if (deptId) {
        //             if ($scope.dept.parkId) {
        //                 $scope.parkId = $scope.dept.parkId

        //             } else {
        //                 $scope.parkId && delete $scope.search.parkId

        //                 return
        //             }

        //         }
        //     })
        // })


        // 保存
        $scope.save = function (form) {
            if (!$scope.parkId) {
                alert("请选择项目关联的部门")
                return
            }
            form.$setSubmitted(true);
            if (!form.$valid) {
                alert("请完成必填选项！")
                return false;
            }
            if (!$scope.priceInfo.houseIds) {
                alert("请选择需要调整的房间！")
                return
            }
            if ($scope.priceInfo.computingMethod == 1) {

            
                if (!/^(([1-9][0-9]{0,8})|(([0]\.\d{1,6}|[1-9][0-9]{0,8}\.\d{1,6})))$/.test($scope.priceInfo.houseTotalPrice)) {
                    alert("总价最大支持输入9位，请输入正确的总价！")
                    return
                }

                confirm("设置的总价为" + $scope.priceInfo.houseTotalPrice + "万元，是否保存?", function () {
                    $scope.priceInfo.houseTotalPrice = $scope.priceInfo.houseTotalPrice * 10000
                    $scope.priceInfo.modifyBy = $rootScope.user.id
                    $scope.priceInfo.parkId = $scope.parkId
                    $http.post("/ovu-park/backstage/sale/saleMinAdjustmentProject/add", $scope.priceInfo, fac.postConfig).success(function (resp) {
                        if (resp.code == 0) {
                            window.msg("新增成功")
                            $uibModalInstance.close()
                        } else {
                            if ($scope.priceInfo.computingMethod == 1 && $scope.priceInfo.houseTotalPrice) {
                                $scope.priceInfo.houseTotalPrice = $scope.priceInfo.houseTotalPrice / 10000
                            }
                            alert(resp.msg);
                            //$uibModalInstance.dismiss('cancel');
                        }

                    });
                });


            } else {
                
                if (!/^(([1-9][0-9]{0,8})|(([0]\.\d{1,2}|[1-9][0-9]{0,8}\.\d{1,2})))$/
                .test($scope.priceInfo.unitPrice)) {
                    alert("基点单价最大支持输入9位，请输入正确的基点单价！")
                    return
                }

                confirm("设置的基点单价为" + $scope.priceInfo.unitPrice + "元，是否保存?", function () {


                    $scope.priceInfo.modifyBy = $rootScope.user.id
                    $scope.priceInfo.parkId = $scope.parkId
                    $http.post("/ovu-park/backstage/sale/saleMinAdjustmentProject/add", $scope.priceInfo, fac.postConfig).success(function (resp) {
                        if (resp.code == 0) {
                            window.msg("新增成功")
                            $uibModalInstance.close()
                        } else {
                            if ($scope.priceInfo.computingMethod == 1 && $scope.priceInfo.houseTotalPrice) {
                                $scope.priceInfo.houseTotalPrice = $scope.priceInfo.houseTotalPrice / 10000
                            }
                            alert(resp.msg);
                        }

                    });
                });

            }



            // $scope.priceInfo.modifyBy = $rootScope.user.id
            // $scope.priceInfo.parkId = $scope.parkId
            // $http.post("/ovu-park/backstage/sale/saleMinAdjustmentProject/add", $scope.priceInfo, fac.postConfig).success(function (resp) {
            //     if (resp.code == 0) {
            //         window.msg("新增成功")
            //         $uibModalInstance.close()
            //     } else {
            //         if ($scope.priceInfo.computingMethod == 1&&$scope.priceInfo.houseTotalPrice) {
            //             $scope.priceInfo.houseTotalPrice = $scope.priceInfo.houseTotalPrice / 10000
            //         }
            //         alert(resp.msg);
            //     }

            // });

        }
        // 选择房间
        $scope.openHouseModal = function () {
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '/view/investmentSystem/projectPrepare/modal.selectRoom.html',
                controller: 'selectRoomModalCtrl',
                resolve: {
                    houses: function () {
                        return angular.extend([], houses)
                    },
                }
            });
            modal.result.then(function (data) {
                console.log("data.newChooseIds:", data.newChooseIds)
                if (data.newChooseIds.length) {
                    houses = data.houses
                    $scope.priceInfo.houseIds = data.newChooseIds.join(",")
                    $http.post("/ovu-park/backstage/sale/saleparkhouse/getHouseAreaByHouseIds", {
                        houseIds: data.newChooseIds.join(",")
                    }, fac.postConfig).success(function (resp) {
                        if (resp.code == 0) {
                            $scope.adjustRoomList = resp.data
                        } else {
                            alert(resp.msg);
                        }

                    });
                }
            }, function () {});
        }
        //房间清单
        $scope.showRoomListModal = function (ids) {

            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '/view/investmentSystem/projectPrepare/modal.roomList.html',
                controller: 'roomListCtrl',
                resolve: {
                    data: {
                        houseIds: ids
                    }
                }
            });
            modal.result.then(function (data) {}, function () {});
        }
        // 取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    });
    //查看调价方案
    app.controller('reserveMethodCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, param) {
        $scope.reserveInfo = {
            approveStatus: param.states
        };
        $scope.isEdit = true
        var adjustProjectId = param.id
        $scope.isShow = param.isShow; //查看or审批
        var initDetail = function (adjustProjectId) {
            $http.post("/ovu-park/backstage/sale/saleMinAdjustmentProject/getDetailsById", {
                id: adjustProjectId
            }, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $.extend($scope.reserveInfo, resp.data);
                    $scope.isEdit = $scope.isShow && ($scope.reserveInfo.approveStatus == 0 || $scope.reserveInfo.approveStatus == 3) ? true : false
                    var unitPrice = $scope.reserveInfo.pricingmanner == 1 ? $scope.reserveInfo.minAreaUnitPrice : $scope.reserveInfo.minAreaSuUnitPrice
                    $scope.reserveInfo.unitPrice = parseFloat((unitPrice).toFixed(2))
                    $scope.totalPrice = parseFloat(($scope.reserveInfo.houseTotalPrice / 10000).toFixed(2))
                    $scope.saleStatusStr = $filter("approveStatus")($scope.reserveInfo.approveStatus)
                } else {
                    alert(resp.msg);
                }
            });
        }
        initDetail(adjustProjectId)
        $scope.computePrice = function () {
            if ($scope.reserveInfo.computingMethod == 2 && $scope.reserveInfo.unitPrice) {
                if ($scope.reserveInfo.pricingmanner == 1) { //乘以建筑面积
                    $scope.totalPrice = parseFloat(($scope.reserveInfo.unitPrice * $scope.reserveInfo.areaCount / 10000).toFixed(6))
                } else { //乘以套内面积
                    $scope.totalPrice = parseFloat(($scope.reserveInfo.unitPrice * $scope.reserveInfo.areaSuCount / 10000).toFixed(6))
                }
            } else if ($scope.reserveInfo.computingMethod == 1 && $scope.totalPrice) {
                if ($scope.reserveInfo.pricingmanner == 1) { //除建筑面积
                    $scope.reserveInfo.unitPrice = parseFloat(($scope.totalPrice * 10000 / $scope.reserveInfo.areaCount).toFixed(2))
                } else { //除套内面积
                    $scope.reserveInfo.unitPrice = parseFloat(($scope.totalPrice * 10000 / $scope.reserveInfo.areaSuCount).toFixed(2))
                }
            }else{
                $scope.totalPrice = ''
                $scope.reserveInfo.unitPrice = ''
            }

        }
        // 保存
        $scope.save = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return false;
            }
            if ($scope.reserveInfo.computingMethod == 1) {

                if (!$scope.totalPrice) {
                    alert("请输入总价！")
                    return
                }
                
                // if ($scope.totalPrice > 999999999.99) {
                //     alert("总价最大支持输入9位，请输入正确的总价！")
                //     return
                // }

                if (!/^(([1-9][0-9]{0,8})|(([0]\.\d{1,6}|[1-9][0-9]{0,8}\.\d{1,6})))$/.test($scope.totalPrice)) {
                    alert("总价最大支持输入9位，请输入正确的总价！")
                    return
                }

                confirm("设置的总价为" + $scope.totalPrice + "万元，是否保存?", function () {
                    $scope.reserveInfo.houseTotalPrice = $scope.totalPrice * 10000
                    $scope.reserveInfo.modifyBy = $rootScope.user.id
                    $http.post("/ovu-park/backstage/sale/saleMinAdjustmentProject/update", $scope.reserveInfo, fac.postConfig).success(function (resp) {
                        if (resp.code == 0) {
                            window.msg("保存成功！")
                            $uibModalInstance.close()
                        } else {
                            alert(resp.msg);
                        }
                    });
                });


            } else {
                
                if (!$scope.reserveInfo.unitPrice) {
                    alert("请输入基点单价！")
                    return
                }
                
                if (!/^(([1-9][0-9]{0,8})|(([0]\.\d{1,2}|[1-9][0-9]{0,8}\.\d{1,2})))$/.test($scope.reserveInfo.unitPrice)) {
                    alert("基点单价最大支持输入9位，请输入正确的基点单价！")
                    return
                }
                
                
                confirm("设置的基点单价为" + $scope.reserveInfo.unitPrice + "元，是否保存?", function () {
                    $scope.reserveInfo.modifyBy = $rootScope.user.id
                    $http.post("/ovu-park/backstage/sale/saleMinAdjustmentProject/update", $scope.reserveInfo, fac.postConfig).success(function (resp) {
                        if (resp.code == 0) {
                            window.msg("保存成功！")
                            $uibModalInstance.close()
                        } else {
                            alert(resp.msg);
                        }
                    });
                });
                
            }



        }

        //房间清单
        $scope.showRoomListModal = function (ids) {
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '/view/investmentSystem/projectPrepare/modal.roomList.html',
                controller: 'roomListCtrl',
                resolve: {
                    data: {
                        houseIds: ids
                    }
                }
            });
            modal.result.then(function (data) {}, function () {});
        }
        $scope.approval = function () {
            $http.post("/ovu-park//backstage/sale/saleMinAdjustmentProject/startApprove", {
                adjustProjectId: adjustProjectId
            }, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    window.msg("发起审核成功！");
                } else {
                    alert(resp.msg);
                }
                $uibModalInstance.close();
            });
        }
        // 取消
        $scope.cancel = function () {
            $uibModalInstance.close();
        }
    });
    // 选择房间
    app.controller('selectRoomModalCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, houses) {
        $rootScope.treeData = null;
        $rootScope.flatData = null;
        $scope.config = {
            edit: false,
            showCheckbox: true
        }
        $scope.rightObj = '';
        var parkId = $rootScope.project.parkId
        var parkName = $rootScope.project.parkName
        $scope.newChooseIds = []; //编辑资源，已选定，即将要关联的空间id
        var dataObj = {
            "park_id": parkId,
            "treeType": 1,
            "sale_status": 1
        }
        $http.post("/ovu-park/backstage/sale/saleparkhouse/tree", dataObj, fac.postConfig).success(function (treeData) {
            if (treeData.code == 0) {
                if (treeData.data && treeData.data.length > 0) {
                    $scope.treeData = treeData.data;
                    $scope.treeData.forEach(function (n) {
                        n.text = parkName + n.text
                    })
                    $scope.flatData = fac.treeToFlat(treeData.data);
                    $scope.rightList = [];
                    houses.forEach(function (house) {
                        var node = $scope.flatData.find(function (n) {
                            return n.id == house.id
                        });
                        if (node != undefined) {
                            node.state = node.state || {};
                            node.state.checked = true;
                            expandFather(node);
                            node.fullPath = parkName + node.stage_name + ">" + node.build_name + ">" + node.house_name;
                            $scope.rightList.push(node);
                            $scope.newChooseIds.push(node.house_id);
                        }
                    });
                } else {
                    alert("没有可调价的房间!")
                }

            }
        });

        function expandFather(node) {
            var father = $scope.flatData.find(function (n) {
                return n.id == node.parentId
            });
            if (father) {
                father.state = father.state || {};
                father.state.expanded = true;
                expandFather(father);
            }
        }
        $scope.validChooseHids = []; //用于收集已勾选的房屋id
        $scope.reduceHis = []; //用于收集取消勾选的房屋id
        $scope.check = function (node) {
            node.state = node.state || {};
            node.state.checked = !node.state.checked;

            function checkSons(node, status) {
                node.state = node.state || {};
                node.state.checked = status;
                if (node.nodes && node.nodes.length) {
                    node.nodes.forEach(function (n) {
                        if (node.state.checked) { //当选中的时候
                            if ($scope.validChooseHids.indexOf(n.house_id) === -1) { //只有不包含当前房屋的id时，才加入
                                $scope.validChooseHids.push(n.house_id);
                            }
                        }
                        checkSons(n, status);
                    });
                } else {
                    if (node.state.checked) { //当选中的时候
                        if ($scope.validChooseHids.indexOf(node.house_id) === -1) { //只有不包含当前房屋的id时，才加入
                            $scope.validChooseHids.push(node.house_id);
                        }
                    } else { //当未选中的时候
                        $scope.validChooseHids.splice($scope.validChooseHids.indexOf(node.house_id), 1);
                        $scope.reduceHis.push(node.house_id);
                    }
                }
            }

            function uncheckFather(node) {
                var father = $scope.flatData.find(function (n) {
                    return n.id == node.parentId
                });
                if (father) {
                    father.state = father.state || {};
                    father.state.checked = false;
                    uncheckFather(father);
                }
            }
            if (node.state.checked) {
                checkSons(node, true);
            } else {
                checkSons(node, false);
                uncheckFather(node);
            }
            $scope.rightList = $scope.flatData.filter(function (n) {
                return n.state && n.state.checked == true && n.parentId != null && n.house_name != null
            })
            //console.info(angular.toJson($scope.rightList));
            $scope.newChooseIds = [];
            for (var i = 0; i < $scope.rightList.length; i++) {
                var rightObj = $scope.rightList[i];
                var fullPath = parkName + rightObj.stage_name + ">" + rightObj.build_name + ">" + rightObj.house_name;
                $scope.rightList[i].fullPath = fullPath;
                $scope.newChooseIds.push(rightObj.house_id);
            }
            if ($scope.rightList.length == 0) {
                $scope.newChooseIds = [];
            }
        }
        $scope.save = function () {
            var houses = [];
            angular.copy($scope.rightList, houses);
            $uibModalInstance.close({
                houses: houses,
                newChooseIds: $scope.newChooseIds
            });
            $scope.reduceHis = []; //清空
        }
        //copy======end
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    });
    //显示房间清单
    app.controller('roomListCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, data) {
        $scope.search = {
            houseIds: data.houseIds
        };
        $scope.pageModel = {}
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-park/backstage/sale/saleparkhouse/getHouseByHouseIds", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
        $scope.find(1)
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    });
    //审批
    app.controller('reserveApprovalCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, paramdata) {
        $scope.approvalInfo = {
            adjustProjectId: paramdata.id,
            approverId: $rootScope.user.id
        }
        $scope.approverPerson = $rootScope.user.nickname
        $scope.title = "底价"
        $scope.dealApproval = function (form, status) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return false;
            }
            if (paramdata.enactmentDate > $scope.approvalInfo.approveDate) {
                alert("审批日期不能晚于制定日期！");
                return
            }
            $scope.approvalInfo.approveStatus = status
            $http.post("/ovu-park/backstage/sale/saleMinAdjustmentProject/approve", $scope.approvalInfo, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    window.msg("审核成功！");
                } else {
                    alert(resp.msg);
                }
                $uibModalInstance.close();
            });

        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    });
})();
