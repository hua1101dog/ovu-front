(function () {
    var app = angular.module("angularApp");
    /* 会议室制器 */
    app.controller('meetingBookingCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-预定管理";
        angular.extend($rootScope, fac.dicts);

        $scope.search = {
            userType: 0,
            parkId: ''
        };
        $scope.pageModel = {
            userType: ''
        };



        // 发布状态
        $scope.status = [{
                text: "待付款",
                value: 0
            },
            {
                text: "进行中",
                value: 1
            },
            {
                text: "已完成",
                value: 2
            },
            {
                text: "已取消",
                value: 3
            },
            {
                text: "待退款",
                value: 4
            },
            {
                text: "交易关闭",
                value: 5
            }
        ]

        // 页面初始化
        app.modulePromiss.then(function () {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId
                        $scope.find()
                    } else {
                        $scope.search.parkId && delete $scope.search.parkId
                        // alert('请选择跟项目关联的部门')
                        $scope.find()
                        return
                    }

                }
            })
        })


        // 查询列表
        $scope.find = function (pageNo) {

            if (!$scope.search.parkId) {
                alert("请选择项目关联的部门")
                $scope.pageModel = {};
                return
            }

            if ($scope.pageModel.currentPage) {
                delete $scope.pageModel.currentPage;
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;

            fac.getPageResult("/ovu-park/backstage/operate/officeReserve/list", $scope.search, function (data) {
                $scope.pageModel = data;
                console.log('$scope.pageModel', $scope.pageModel)
                // if (data.data.length > 0) {
                //     $scope.houseMap = data.data[0].houseMap;
                // }
            })

            fac.getPageResult("/ovu-park/backstage/operate/office/spaceList", $scope.search, function (data) {
                $scope.houseMap = data.houseMap;
            })

        };

        $scope.init =function(){
            setTimeout(function(){
                $scope.find()
            },50)
        }
        $scope.init()
        // 会议室位置
        $scope.getPosition = function (houseId) {
            if (fac.isEmpty($scope.houseMap)) {
                return "--"
            } else {
                var houseObj = $scope.houseMap[houseId]
                if (fac.isNotEmpty(houseObj)) {
                    var ground = "--";
                    if (houseObj.groundNum) {
                        ground = houseObj.groundNum + "层";
                    }
                    if (houseObj.floorName) {
                        ground = houseObj.floorName;
                    }
                    return houseObj.stageName + houseObj.buildName + houseObj.unitNum + "单元" + ground + houseObj.houseName;
                } else {
                    return '--'
                }
            }
        }
        $scope.changeUserType = [{
                value: 0,
                text: "运营方"
            },
            {
                value: 1,
                text: "用户"
            }
        ]

        $scope.changeSearchStatus = function () {
            if ($scope.selUserType) {
                var sel = $scope.changeUserType.find(v => {
                    return v.value == $scope.selUserType
                })
                switch (sel.value) {
                    case 0:
                        $scope.search.userType = 0;
                        $scope.pageModel.userType = 0;
                        break;
                    case 1:
                        $scope.search.userType = 1;
                        $scope.pageModel.userType = 1;
                        break;
                }
            }
            $scope.find();
        }

        $scope.changeOrderState = function () {
            if ($scope.selOrderState) {
                var sel = $scope.status.find(v => {
                    return v.value == $scope.selOrderState
                })
                $scope.search.mOrderStatus = sel.value
            } else if ($scope.selOrderState === 0) {
                $scope.search.mOrderStatus = 0
            } else {
                $scope.search.mOrderStatus = ""
            }

            $scope.find()
        }

        // 订单状态
        $scope.getStatus = function (mOrderStatus) {
            switch (mOrderStatus) {
                case 0:
                    return "待付款";
                case 1:
                    return "进行中";
                case 2:
                    return "已完成";
                case 3:
                    return "已取消";
                case 4:
                    return "待退款";
                case 5:
                    return "交易关闭";
            }
        }

        // 会议室详情
        $scope.getDetail = function (item) {
            item.office.position = $scope.getPosition(item.office.houseId);
            var modal = $uibModal.open({
                animation: true,
                size: 'md',
                templateUrl: '/view/operationManage/bookingManage/modal.meetingDetail.html',
                controller: 'meetingDetailCtrl',
                resolve: {
                    item: item
                }
            });
            modal.result.then(function () {
                $scope.find()
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
        // 撤销
        $scope.cancelBooking = function (item) {
            var params = {
                'id': item.id,
                'updatorId': item.updatorId
            };
            confirm("确定撤销该会议室预定?", function () {
                $http.post("/ovu-park/backstage/operate/officeReserve/cancle", params, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        window.msg("撤销成功!");
                        $scope.find(1);
                    } else {
                        window.alert(resp.message);
                    }
                });
            })
        }
        /**
         * 获得办公室硬件配置  （ filter ）
         * */
        $scope.getEqTypeName = function (param) {
            $scope.typeNames = [];
            $scope.typeList = [];
            if (param) {
                var typeLists = param.split(",");
                $scope.typeList = angular.copy(typeLists);
                for (var i = 0; i < $scope.typeList.length; i++) {
                    var type = $scope.typeList[i];
                    $scope.type = $scope.trimStr(type);
                    if (1 == new Number($scope.type)) {
                        $scope.typeNames.push("投影设备");
                    } else if (2 == new Number($scope.type)) {
                        $scope.typeNames.push("音响话筒");
                    } else if (3 == new Number($scope.type)) {
                        $scope.typeNames.push("视频终端");
                    }
                }
            }
            return $scope.typeNames.join(",");
        }
        /**
         * 去除空格
         * */
        $scope.trimStr = function (str) {
            return str.replace(/(^\s*)|(\s*$)/g, "");
        }
        // app.modulePromiss.then(function () {

        //     $scope.find();

        // });

        $scope.query = function () {
            fac.initPage($scope, function () {
                $scope.find(1);
            })
        }
    });
    
    /* 会议室详情 - 控制器 */
    app.controller('meetingDetailCtrl', function ($scope, $http, $uibModalInstance, $filter, fac, item) {
        $scope.item = item;
        $scope.conferenceType = ''
        $scope.getDetail = function (id) {
            $http.get("/ovu-park/backstage/operate/officeReserve/getOrderInfoById?id="+id).success(function (resp) {
                if (resp.code == 0) {
                    $scope.item.reservation = resp.data.reserve.reservation;
                }
            })
        }
        $scope.getDetail($scope.item.id);

        app.modulePromiss.then(function () {
            // console.log('666')
            $scope.init()
        })

        $scope.init = function(){
            if(!item.conferenceType){
                $scope.conferenceType = '--'
                return 
            }
            let arr = item.conferenceType.split(',')
            let strArr = []
            for(i of arr){
                if(i == 1){
                        strArr.push('矿泉水')
                    }else if(i == 2){
                        strArr.push('茶水')
                    }else if(i == 3){
                        strArr.push('果盘')
                    }
                }
            let arr_1 = strArr.join()
            // console.log('arr1',arr_1)
            $scope.conferenceType = arr_1
        }
        
        

        // 订单状态
        $scope.getStatus = function (mOrderStatus) {
            switch (mOrderStatus) {
                case 0:
                    return "待付款";
                case 1:
                    return "进行中";
                case 2:
                    return "已完成";
                case 3:
                    return "已取消";
                case 4:
                    return "待退款";
                case 5:
                    return "交易关闭";
            }
        }

        $scope.save = function (item, state) {
            if (state == 2) {
                var params = {
                    id: item.id,
                    // refundApproveSuggest: item.refundApproveSuggest,
                    refundStatus: state
                }
                $http.get("/ovu-park/backstage/operate/officeReserve/refundApprove", {
                    params: params
                }).success(function (res) {
                    if (res.code == 0) {
                        window.msg("退款成功")
                        setTimeout(() => {
                            $uibModalInstance.close()
                        }, 1000)
                    } else {
                        window.msg(res.message)
                        setTimeout(() => {
                            $uibModalInstance.close();
                        }, 1000)
                    }
                })
            } else {
                var params = {
                    id: item.id,
                    refundApproveSuggest: item.refundApproveSuggest,
                    refundStatus: state
                }
                if (item.refundApproveSuggest) {
                    $http.get("/ovu-park/backstage/operate/officeReserve/refundApprove", {
                        params: params
                    }).success(function (res) {
                        if (res.code == 0) {
                            window.msg("退款已拒绝")
                            setTimeout(() => {
                                $uibModalInstance.close();
                            }, 1000)
                        } else {
                            window.msg(res.message)
                            setTimeout(() => {
                                $uibModalInstance.close();

                            }, 1000)
                        }
                    })
                } else {
                    window.alert("请输入退款原因")
                }

            }

        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    /* 场地控制器 */
    app.controller('spaceBookingCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        angular.extend($rootScope, fac.dicts);
        $scope.search = {
            timeFlag: "0",
            parkId:'',
            userType: 0
        };
        $scope.pageModel = {};

        // 发布状态
        $scope.status = [{
                text: "待付款",
                value: 0
            },
            {
                text: "进行中",
                value: 1
            },
            {
                text: "已完成",
                value: 2
            },
            {
                text: "已取消",
                value: 3
            },
            {
                text: "待退款",
                value: 4
            },
            {
                text: "交易关闭",
                value: 5
            }
        ]

        // 页面初始化
        app.modulePromiss.then(function () {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId
                        $scope.find()
                    } else {
                        $scope.search.parkId && delete $scope.search.parkId
                        // alert('请选择跟项目关联的部门')
                        $scope.find()
                        return
                    }

                }
            })
        })


        $scope.changeUserType = [{
                value: 0,
                text: "运营方"
            },
            {
                value: 1,
                text: "用户"
            }
        ]

        $scope.changeSearchStatus = function () {
            if ($scope.selUserType) {
                var sel = $scope.changeUserType.find(v => {
                    return v.value == $scope.selUserType
                })
                switch (sel.value) {
                    case 0:
                        $scope.search.userType = 0;
                        break;
                    case 1:
                        $scope.search.userType = 1;
                        break;
                }
            }
            $scope.find();
        }

        $scope.changeOrderState = function () {
            if ($scope.selOrderState) {
                var sel = $scope.status.find(v => {
                    return v.value == $scope.selOrderState
                })
                $scope.search.mOrderStatus = sel.value
            } else if ($scope.selOrderState === 0) {
                $scope.search.mOrderStatus = 0
            } else {
                $scope.search.mOrderStatus = ""
            }

            $scope.find()
        }


        // 查询列表
        $scope.find = function (pageNo){
            
            if (!$scope.search.parkId) {
                alert("请选择项目关联的部门")
                $scope.pageModel = {};
                return
            }

            if ($scope.pageModel.currentPage) {
                delete $scope.pageModel.currentPage;
            }

            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            fac.getPageResult("/ovu-park/backstage/operate/yardReserve/list", $scope.search, function (data) {
                $scope.pageModel = data;
                console.log(data)
            });
        };

        $scope.init =function(){
            setTimeout(function(){
                $scope.find()
            },50)
        }
        $scope.init()

        //  订单状态
        $scope.getStatus = function (mOrderStatus) {
            switch (mOrderStatus) {
                case 0:
                    return "待付款";
                case 1:
                    return "进行中";
                case 2:
                    return "已完成";
                case 3:
                    return "已取消";
                case 4:
                    return "待退款";
                case 5:
                    return "交易关闭";
            }
        }

        // 场地详情
        $scope.getDetail = function (item) {
            var modal = $uibModal.open({
                animation: true,
                size: 'md',
                templateUrl: '/view/operationManage/bookingManage/modal.spaceDetail.html',
                controller: 'spaceDetailCtrl',
                resolve: {
                    item: item
                }
            });
        };

        $scope.query = function () {
            if (!fac.checkPark($scope)) {
                return
            } else {
                $scope.find(1);
            }
        }

        /**
         * 去除空格
         * */
        $scope.trimStr = function (str) {
            return str.replace(/(^\s*)|(\s*$)/g, "");
        }
    });

    /* 场地详情 - 控制器 */
    app.controller('spaceDetailCtrl', function ($scope, $http, $uibModalInstance, $filter, $uibModal, fac, item) {
        $scope.item = item;
        $scope.getDetail = function (id) {
            $http.get("/ovu-park/backstage/operate/yardReserve/getOrderInfoById?id="+id).success(function (resp) {
                if (resp.code == 0) {
                    $scope.item.reservation = resp.data.reservation;
                }
            })
        }
        $scope.getDetail($scope.item.id);
        // 订单状态
        $scope.showPosition = function (positon) {
            var copy = angular.extend({
                unclick: true
            }, positon);
            if (!positon.mapLng) {
                alert('当前场地没有位置信息!')
            } else {
                var modalInstance = $uibModal.open({
                    size: 'lg',
                    animation: true,
                    templateUrl: '/view/operationManage/releaseManage/modal.showPosition.html',
                    controller: 'showPositionCtrl',
                    resolve: {
                        positon: copy
                    }
                });
            }

        }

        // 订单状态
        $scope.getStatus = function (mOrderStatus) {
            switch (mOrderStatus) {
                case 0:
                    return "待付款";
                case 1:
                    return "进行中";
                case 2:
                    return "已完成";
                case 3:
                    return "已取消";
                case 4:
                    return "待退款";
                case 5:
                    return "交易关闭";
            }
        }

        $scope.save = function (item, state) {

            if (state == 2) {
                var params = {
                    id: item.id,
                    // refundApproveSuggest: item.refundApproveSuggest,
                    refundStatus: state
                }
                $http.get("/ovu-park/backstage/operate/yardReserve/refundApprove", {
                    params: params
                }).success(function (res) {
                    if (res.code == 0) {
                        window.msg("退款成功")
                        setTimeout(() => {
                            $uibModalInstance.close();
                        }, 1000)
                    } else {
                        window.msg(res.message)
                        setTimeout(() => {
                            $uibModalInstance.close();
                        }, 1000)
                    }
                })
            } else {
                var params = {
                    id: item.id,
                    refundApproveSuggest: item.refundApproveSuggest,
                    refundStatus: state
                }
                if (item.refundApproveSuggest) {
                    $http.get("/ovu-park/backstage/operate/yardReserve/refundApprove", {
                        params: params
                    }).success(function (res) {
                        if (res.code == 0) {
                            window.msg("退款已拒绝")
                            setTimeout(() => {
                                $uibModalInstance.close();
                            }, 1000)
                        } else {
                            window.msg(res.message)
                            setTimeout(() => {
                                $uibModalInstance.close();
                            }, 1000)
                        }
                    })
                } else {
                    window.msg(res.message)
                    setTimeout(() => {
                        $uibModalInstance.close();

                    }, 1000)
                }

            }

        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    /* 广告位制器 */
    app.controller('advBookingCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        angular.extend($rootScope, fac.dicts);
        $scope.search = {
            timeFlag: "0",
            parkId:'',
            userType: 0
        };
        $scope.pageModel = {};

        // 发布状态
        $scope.status = [{
                text: "待付款",
                value: 0
            },
            {
                text: "进行中",
                value: 1
            },
            {
                text: "已完成",
                value: 2
            },
            {
                text: "已取消",
                value: 3
            },
            {
                text: "待退款",
                value: 4
            },
            {
                text: "交易关闭",
                value: 5
            }
        ]
        // 页面初始化
        app.modulePromiss.then(function () {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId
                        $scope.find()
                    } else {
                        $scope.search.parkId && delete $scope.search.parkId
                        // alert('请选择跟项目关联的部门')
                        $scope.find()
                        return
                    }

                }
            })
        })


        $scope.exp = function () {
            // console.log('$scope.search',$scope.search)
            window.open('/ovu-park/backstage/operate/advertisementReserve/reserveExport',$scope.search)
        };


        $scope.changeUserType = [{
                value: 0,
                text: "运营方"
            },
            {
                value: 1,
                text: "用户"
            }
        ]

        $scope.changeSearchStatus = function () {
            if ($scope.selUserType) {
                var sel = $scope.changeUserType.find(v => {
                    return v.value == $scope.selUserType
                })
                switch (sel.value) {
                    case 0:
                        $scope.search.userType = 0;
                        break;
                    case 1:
                        $scope.search.userType = 1;
                        break;
                }
            }
            $scope.find();
        }

        $scope.changeOrderState = function () {
            if ($scope.selOrderState) {
                var sel = $scope.status.find(v => {
                    return v.value == $scope.selOrderState
                })
                $scope.search.mOrderStatus = sel.value
            } else if ($scope.selOrderState === 0) {
                $scope.search.mOrderStatus = 0
            } else {
                $scope.search.mOrderStatus = ""
            }

            $scope.find()
        }

        // 查询列表
        $scope.find = function (pageNo) {
            
            if (!$scope.search.parkId) {
                alert("请选择项目关联的部门")
                $scope.pageModel = {};
                return
            }

            if ($scope.pageModel.currentPage) {
                delete $scope.pageModel.currentPage;
            }

            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;

            fac.getPageResult("/ovu-park/backstage/operate/advertisementReserve/list", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        $scope.init =function(){
            setTimeout(function(){
                $scope.find()
            },50)
        }
        $scope.init()

        // 订单状态
        $scope.getStatus = function (mOrderStatus) {
            switch (mOrderStatus) {
                case 0:
                    return "待付款";
                case 1:
                    return "进行中";
                case 2:
                    return "已完成";
                case 3:
                    return "已取消";
                case 4:
                    return "待退款";
                case 5:
                    return "交易关闭";
            }
        }

        //  预定时长
        $scope.timeRange = function (start, end) {
            var a = moment(start, "YYYY-MM")
            return moment(end, "YYYY-MM").diff(a, 'month')
        }


        // 广告位详情
        $scope.getDetail = function (item) {
            var modal = $uibModal.open({
                animation: true,
                size: 'md',
                templateUrl: '/view/operationManage/bookingManage/modal.advDetail.html',
                controller: 'advDetailCtrl',
                resolve: {
                    item: item
                }
            });
        };

        $scope.query = function () {
            fac.initPage($scope, function () {
                $scope.find(1);
            })
        }
        /**
         * 去除空格
         * */
        $scope.trimStr = function (str) {
            return str.replace(/(^\s*)|(\s*$)/g, "");
        }
    });

    /* 广告位详情 - 控制器 */
    app.controller('advDetailCtrl', function ($scope, $http, $uibModalInstance, $uibModal, $filter, fac, item) {
        $scope.item = item;
        $scope.getDetail = function (id) {
            $http.get("/ovu-park/backstage/operate/advertisementReserve/getOrderInfoById?id="+id).success(function (resp) {
                if (resp.code == 0) {
                    $scope.item.reservation = resp.data.reservation;
                }
            })
        }
        $scope.getDetail($scope.item.id);
        // 订单状态
        $scope.getStatus = function (mOrderStatus) {
            switch (mOrderStatus) {
                case 0:
                    return "待付款";
                case 1:
                    return "进行中";
                case 2:
                    return "已完成";
                case 3:
                    return "已取消";
                case 4:
                    return "待退款";
                case 5:
                    return "交易关闭";
            }
        }

        $scope.save = function (item, state) {
            if (state == 2) {
                var params = {
                    id: item.id,
                    // refundApplyReason: item.refundApplyReason,
                    refundStatus: state
                }
                $http.get("/ovu-park/backstage/operate/advertisementReserve/refundApprove", {
                    params: params
                }).success(function (res) {
                    if (res.code == 0) {
                        window.msg("退款成功")
                        setTimeout(() => {
                            $uibModalInstance.close();
                        }, 1000)
                    } else {
                        window.msg(res.message)
                        setTimeout(() => {
                            $uibModalInstance.close();
                        }, 1000)
                    }
                })
            } else {
                var params = {
                    id: item.id,
                    refundApproveSuggest: item.refundApproveSuggest,
                    refundStatus: state
                }
                if (item.refundApproveSuggest) {
                    $http.get("/ovu-park/backstage/operate/advertisementReserve/refundApprove", {
                        params: params
                    }).success(function (res) {
                        if (res.code == 0) {
                            window.msg("退款已拒绝")
                            setTimeout(() => {
                                $uibModalInstance.close();
                            }, 1000)
                        } else {
                            window.msg(res.message)
                            setTimeout(() => {
                                $uibModalInstance.close();
                            }, 1000)
                        }
                    })
                } else {
                    window.msg(res.message)
                    setTimeout(() => {
                        $uibModalInstance.close();

                    }, 1000)
                }

            }

        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        //  预定时长
        $scope.timeRange = function (start, end) {
            var a = moment(start, "YYYY-MM")
            return moment(end, "YYYY-MM").diff(a, 'month')
        }
        $scope.showPosition = function (positon) {
            var copy = angular.extend({
                unclick: true
            }, positon);

            if (!positon.mapLng) {
                alert('当前场地没有位置信息!')
            } else {
                var modalInstance = $uibModal.open({
                    size: 'lg',
                    animation: true,
                    templateUrl: '/view/operationManage/releaseManage/modal.showPosition.html',
                    controller: 'showPositionCtrl',
                    resolve: {
                        positon: copy
                    }
                });
            }

        }
    });

})()
