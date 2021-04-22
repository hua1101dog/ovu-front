(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('workStationCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $interval) {
        document.title = "OVU-操作台";
        $scope.search = $scope.param = {};

        let pages = [
            'cytdPerson',
            'workUnit',
            'patrol',
            'eqRoom',
            'security',
            'firectrl',
            // 'trip',
            'viptrip',
            'equipment',
            'energy',
            'faceTrack',
            'meeting',
            'elevator',
            'meetUse'

        ];
        let pageText = [
            '操作人员',
            '操作工单',
            '操作巡检',
            '操作设备房',
            '操作安防',
            '操作消防',
            // '操作出行',
            '操作VIP车位',
            '操作设备',
            '操作能源',
            '操作人脸',
            '会议室',
            '电梯',
            '会议室使用'
        ];

        // pageText.forEach((v, i) => {
        //     if ($scope.hasPower(v)) {
        //         $scope.pagesrc = '../../view/scenario/ws/' + pages[i] + '.html';
        //         $scope.sel_ed = i;
        //         return
        //     }
        // })
        for (var k = 0; k < pageText.length; k++) {
            if ($scope.hasPower(pageText[k])) {
                $scope.pagesrc = '../../view/scenario/ws/' + pages[k] + '.html';
                $scope.sel_ed = k;
                break;
            }
        }



        // $scope.pagesrc = '../../view/scenario/ws/' + pages[0] + '.html';

        // $scope.sel_ed = 0;

        $scope.selPage = function (index) {
            $scope.sel_ed = index;
            $scope.pagesrc = '../../view/scenario/ws/' + pages[index] + '.html';
        };


        app.modulePromiss.then(function () {

        })


    });


    //人员
    app.controller('cytdPersonctrl', function ($scope, $rootScope, $http, $filter, $uibModal, $interval, fac) {

        $scope.name = '人员';
        $scope.pageModel = [];
        $scope.search = {
            parkNo: '04201110001CYTD'
        }
        $scope.pageModel = {};

        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult('/ovu-pcos/mobile/personPostionStatic/offPositionRecord', $scope.search, function (res) {
                $scope.pageModel = res;
            })
        }

        $scope.noticePerson = function (item) {
            var msg = item.personName + ":" + item.personTel
            layer.confirm(msg, {
                btn: ['取消'],
                title: false
            }, function (index) {
                layer.close(index);
            });

        }
        $scope.noticeLeader = function (item) {

            var param = {
                personId: item.personId
            }
            var leader = item.extra.split("-");
            if (leader.length > 0) {
                param.leaderId = leader[0]
            } else {
                alert("通知失败，没有找到该人员的领导！")
            }
            $http.get('/ovu-pcos/mobile/personPostionStatic/connect', {
                params: param
            }).success(function (res) {
                if (res.code == 0) {
                    msg("通知成功！")
                } else {

                    alert(res.msg);
                }
            })
        }
        $scope.find(1);
        // $scope.timer1 = $interval(() => {
        //     queryOffPerson();
        // }, 300000);

        $scope.$on("$destroy", function () {
            $scope.timer1 && $interval.cancel($scope.timer1);

        })
    });
    //工单
    app.controller('workUnitctrl1', function ($scope, $rootScope, $http, $filter, $uibModal, $interval, fac) {
        $scope.name = '工单1';
        //勾选条件
        $scope.checkList = {
            yingji: false,
            jihua: false,
            shebei: false,
            siningning: false

        };
        $scope.pageModel = {};
        $scope.search = {
            parkNo: '04201110001CYTD',
            msgType: 'workunit'
        };
        $scope.search.msgStatus = 0
        $scope.search.operateType = '11';
        $scope.search.isClosed = 2
        //查询未处理工单
        $scope.find = function (pageNo) {
            var selArr = [];
            console.log($scope.checkList)
            $scope.checkList.yingji && selArr.push(1);
            $scope.checkList.jihua && selArr.push(2);
            $scope.checkList.shebei && selArr.push(3);
            $scope.checkList.siningning && selArr.push(4);
            $scope.search.types = selArr.length > 0 ? selArr.join(",") : ''
            $scope.search.parkId = 'af98a32c9b4d490297cadc2d85faf797'
            console.log("$scope.search", $scope.search)
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });

            var url = '';

            if ($scope.search.msgStatus == 2) {
                // url='/ovu-pcos/pcos/workunitExt/abnormalList' 
                url = '/ovu-pcos/pcos/workunit/parkWorkunitlist'


            } else {
                url = '/ovu-pcos/pcos/sceneMessage/page'
            }
            //查询异常工单
            fac.getPageResult(url, $scope.search, function (res) {
                $scope.pageModel = res;

            })
        }
        $scope.find(1)
        //通知本人
        $scope.noticePerson = function (item) {
            if ($scope.search.msgStatus == 2) {
                var personNameArr = item.personName.split(",");
                var phoneArr = item.phone.split(",");
                var msg = personNameArr[0] + " : " + phoneArr[0]
                if (personNameArr.length > 1 && personNameArr.length == phoneArr.length) {
                    for (var i = 1; i < personNameArr.length; i++) {
                        msg += '<br>' + personNameArr[i] + " : " + phoneArr[i]
                    }
                }
                layer.confirm(msg, {
                    btn: ['取消'],
                    title: false
                }, function (index) {
                    layer.close(index);
                });
            } else {
                var modal = $uibModal.open({
                    animation: false,
                    size: "",
                    templateUrl: 'scenario/ws/myworkunit.noticePerson.html',
                    controller: 'noticePersonCtrl',
                    resolve: {
                        data: item
                    }
                });
                modal.result.then(function () {
                    $scope.find(1);
                }, function () {
                    console.info('Modal dismissed at: ' + new Date());
                });
            }


        }
        //通知领导
        $scope.noticeLeader = function (item) {
            if ($scope.search.msgStatus == 2) {
                var param = {
                    workunitId: item.id,
                    parkNo: $scope.search.parkNo
                }
                $http.get('/ovu-pcos/pcos/workunitExt/noticeLeader', {
                    params: param
                }).success(function (res) {
                    if (res.code == 0) {
                        msg("通知成功！")
                    } else {
                        alert("通知失败！")
                    }
                })
            } else {
                var modal = $uibModal.open({
                    animation: false,
                    size: "",
                    templateUrl: 'scenario/ws/myworkunit.noticeLeader.html',
                    controller: 'noticeLeaderCtrl',
                    resolve: {
                        data: item
                    }
                });
                modal.result.then(function () {
                    $scope.find(1);
                }, function () {
                    console.info('Modal dismissed at: ' + new Date());
                });
            }
        }
        //派发
        $scope.distributeModal = function (ids, deptId, parkId, msgId) {
            var modal = $uibModal.open({
                animation: false,
                size: "",
                templateUrl: 'scenario/ws/myworkunit.distribute.html',
                controller: 'personUnitSelectorCtrl',
                resolve: {
                    data: {
                        deptId: deptId,
                        parkId: parkId,
                    }
                }
            });
            modal.result.then(function (data) {
                if (data) {
                    var params = {
                        unitIds: ids,
                        execId: data.execId,
                        assistanceIds: data.assistanceIds,
                        manageId: data.manageId,
                        remark: data.remark,

                    };
                    $http.post("/ovu-pcos/pcos/workunit/distributeWorkUnit.do", params, fac.postConfig).success(function (resp) {
                        if (resp.success) {
                            params.opType = '3';
                            params.opContent = '派发了工单';
                            params.msgId = msgId

                            if ($scope.search.msgStatus !== 2) {
                                $http.post("/ovu-pcos/pcos/sceneMessage/edit", params, fac.postConfig).success(function (resp) {
                                    if (resp.code == 0) {
                                        msg("派单成功!");
                                        $scope.find(1);
                                    } else {
                                        alert(resp.error);
                                    }
                                })
                            } else {
                                msg("派单成功!");
                                $scope.find(1);
                            }
                        } else {
                            alert(resp.error);
                        }
                    })

                }
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
        //操作记录
        $scope.record = function (item) {
            var personNameArr = item.personName.split(",");
            var phoneArr = item.phone.split(",");

            var msg = '操作方式: ' + (item.opType == 1 ? '联系本人' : item.opType == 2 ? '通知上级' : '派发工单') + '<br>' +
                '备注: ' + item.opContent
            // var msg = '操作方式: '+personNameArr[0]+'<br>' + 
            // '通知人: ' +phoneArr[0]
            if (personNameArr.length > 1 && personNameArr.length == phoneArr.length) {
                for (var i = 1; i < personNameArr.length; i++) {
                    msg += '<br>' + personNameArr[i] + " : " + phoneArr[i]
                }
            }
            layer.confirm(msg, {
                btn: ['取消'],
                title: false
            }, function (index) {
                layer.close(index);
            });
        }
    });


    app.controller('personUnitSelectorCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, data) {

        //$scope.tabs = [{ search: {}, pageModel: {} }, { search: {}, pageModel: {} }];
        $scope.pageModel = {}
        $scope.search = {
            type: 1,
            name: '',
            parkNo: '04201110001CYTD'
        };
        $scope.searchType

        $scope.exePerson = data.exePerson || {}; //执行人
        $scope.assPersons = data.assPersons || []; //协助人
        $scope.managePerson = data.managePerson || {}; //管理人
        $scope.remark = data.remark || '';

        $scope.find = function (pageNo, type) {
            if (type) {
                $scope.search.type = type;
                $scope.search.name = '';
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-pcos/pcos/workunitExt/getParkPersons", $scope.search, function (data) {
                angular.extend($scope.pageModel, data);
            });
        };
        $scope.find(1, 1)

        //添加执行人（单人、!=协助人&!=管理人）
        $scope.setExecPerson = function (item) {
            if ($scope.managePerson == item) {
                $scope.managePerson = {};
            }
            var assisPerson = $scope.assPersons.find(function (n) {
                return n.id == item.id
            });
            assisPerson && $scope.assPersons.splice($scope.assPersons.indexOf(assisPerson), 1);
            $scope.exePerson = item;
        };

        //添加管理人（单人、!=执行人）
        $scope.setManagePerson = function (item) {
            if ($scope.exePerson && $scope.exePerson.id == item.id) {
                $scope.exePerson = {};
            }
            $scope.managePerson = item;
        };

        //添加协助人（多人、!=执行人）
        $scope.addAssiPerson = function (item) {
            if ($scope.exePerson && $scope.exePerson.id == item.id) {
                $scope.exePerson = {};
            }
            var assisPerson = $scope.assPersons.find(function (n) {
                return n.id == item.id
            });
            !assisPerson && ($scope.assPersons.push(item));
        };

        $scope.existAssis = function (item) {
            return $scope.assPersons.find(function (n) {
                return n.id == item.id
            })
        };

        //删除
        $scope.del = function (persons, person) {
            persons.splice(persons.indexOf(person), 1);
        };
        $scope.delExePerson = function () {
            $scope.exePerson = {};
        };
        $scope.delMngPerson = function () {
            $scope.managePerson = {};
        };

        //确定
        $scope.save = function () {
            if (!$scope.exePerson.id) {
                alert("请选择执行人！");
                return;
            } else if (!$scope.managePerson.id) {
                alert("请选择管理人！");
                return;
            } else {
                var assids = [];
                $scope.assPersons.forEach(function (item) {
                    assids.push(item.id);
                });
                $uibModalInstance.close({
                    execId: $scope.exePerson.id,
                    assistanceIds: assids.join(),
                    manageId: $scope.managePerson.id,
                    remark: $scope.remark,
                });
            }
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    // app.controller('workUnitctrl2', function ($scope, $rootScope, $http, $filter, $uibModal, $interval, fac) {

    //     $scope.name = '工单2';
    //   $scope.showContent=true;
    //     $scope.isDisable = false;
    //     $scope.showItem = false
    //     $scope.workUnitInfo={};
    //     $scope.noDealWorkName;
    //     $scope.fourOwnerName;
    //     $scope.noDealWorkList;
    //     $scope.pageModel = {};
    //     $scope.ownerDisable = false;
    //     $scope.search = {
    //         parkNo: '04201110001CYTD',
    //         name: ''
    //     };
    //     $scope.location = {
    //         parkId: 'af98a32c9b4d490297cadc2d85faf797',
    //         stageId: '',
    //         buildId: '',
    //         unitNo: '',
    //         groundNo: '',
    //         houseId: ''
    //     };
    //     //查询近期报事
    //     $scope.find = function (pageNo) {
    //         $.extend($scope.search, {
    //             currentPage: pageNo || $scope.pageModel.currentPage || 1,
    //             pageSize: $scope.pageModel.pageSize || 10
    //         });
    //         fac.getPageResult('/ovu-pcos/pcos/workunitExt/get400', $scope.search, function (res) {
    //             $scope.pageModel = res;
    //         })
    //     }
    //     $scope.find(1)
    //     //查询业主
    //     $scope.queryOwner = function () {

    //         var reg = new RegExp("^[1][3|5|7|8|9][0-9]{9}$");
    //         if (!reg.test($scope.workUnitInfo.ownerPhone)) {
    //             alert('请输入正确的电话！');
    //             return
    //         }
    //         var param = {
    //             parkId: 'af98a32c9b4d490297cadc2d85faf797',
    //             pid: '5821dc751f0441a0b3a7497a5d1a4ab2',
    //             parkName: '创意天地',
    //             ownerPhone: $scope.workUnitInfo.ownerPhone,
    //             currentPage: 1,
    //             pageSize: 1,
    //             pageIndex: 0,
    //             totalCount: 0,
    //         }

    //         $http.get('/ovu-base/system/parkHouse/listHousePersonByGrid', {
    //             params: param
    //         }).success(function (res) {
    //             if (res.code == 0) {
    //                 if (res.data.data.length == 1) {
    //                     $scope.location = {
    //                         parkId: 'af98a32c9b4d490297cadc2d85faf797',
    //                         stageId: res.data.data[0].stageId,
    //                         buildId: res.data.data[0].buildId,
    //                         unitNo: res.data.data[0].unitNo,
    //                         groundNo: res.data.data[0].groundNo,
    //                         houseId: res.data.data[0].id
    //                     };
    //                     $scope.workUnitInfo.ownerName = res.data.data[0].ownerName
    //                     $scope.workUnitInfo.ownerId = res.data.data[0].ownerId
    //                     $scope.isDisable = true;

    //                 } else {
    //                     $scope.isDisable = false;
    //                     $scope.workUnitInfo.ownerName = '';
    //                     $scope.workUnitInfo.description = '';
    //                     $scope.workUnitInfo.ownerId = '';
    //                     $scope.workUnitInfo.position = '';
    //                     $scope.location = {
    //                         parkId: 'af98a32c9b4d490297cadc2d85faf797',
    //                         stageId: '',
    //                         buildId: '',
    //                         unitNo: '',
    //                         groundNo: '',
    //                         houseId: ''
    //                     };
    //                 }

    //             } else {

    //                 alert("查询业主电话失败，请稍后再试！")
    //             }
    //             $scope.showItem = true;
    //             $scope.ownerDisable = true;
    //         })
    //     }
    //     $scope.resetFormInfo = function () {
    //         $scope.showItem = !$scope.showItem;
    //         $scope.isDisable = false;
    //         $scope.ownerDisable = false;
    //         $scope.workUnitInfo.ownerName = '';
    //         $scope.workUnitInfo.description = '';
    //         $scope.workUnitInfo.ownerId = '';
    //         $scope.workUnitInfo.position = '';
    //         $scope.location = {
    //             parkId: 'af98a32c9b4d490297cadc2d85faf797',
    //             stageId: '',
    //             buildId: '',
    //             unitNo: '',
    //             groundNo: '',
    //             houseId: ''
    //         };
    //     }

    //     $scope.saveWorkUnit = function (isValid) {
    //         if (!isValid) {
    //             alert('请完成必填项！')
    //             return false;
    //         }
    //         var reg = new RegExp("^[1][3|5|7|8|9][0-9]{9}$");
    //         if (!reg.test($scope.workUnitInfo.ownerPhone)) {
    //             alert('请输入正确的电话！');
    //             return
    //         }
    //         if (!$scope.location.stageId && !$scope.workUnitInfo.position) {
    //             alert('请输入报事位置或者详细地址！');
    //             return false;
    //         } else if (!$scope.workUnitInfo.position) {
    //             if (!$scope.location.stageId || !$scope.location.buildId || !$scope.location.unitNo || !$scope.location.groundNo || !$scope.location.houseId) {
    //                 alert('请补全报事位置！');
    //                 return false;
    //             }

    //         }
    //         var param = {
    //             parkNo: '04201110001CYTD',
    //             name: $scope.workUnitInfo.ownerName,
    //             desc: $scope.workUnitInfo.description,
    //             phone: $scope.workUnitInfo.ownerPhone,
    //             ownerId: $scope.workUnitInfo.ownerId
    //         }
    //         if ($scope.location.stageId) {
    //             param.stageId = $scope.location.stageId,
    //                 param.buildId = $scope.location.buildId,
    //                 param.unitNo = $scope.location.unitNo,
    //                 param.groundNo = $scope.location.groundNo,
    //                 param.houseId = $scope.location.houseId

    //         } else if ($scope.workUnitInfo.position) {
    //             param.address = $scope.workUnitInfo.position;
    //         }
    //         $http.get('/ovu-pcos/pcos/workunitExt/submit400', {
    //             params: param
    //         }).success(function (res) {
    //             if (res.code == 0) {
    //                 msg("保存成功！")
    //                 $scope.resetFormInfo();
    //                 $scope.find(1)

    //             } else {

    //                 alert("保存失败！")
    //             }
    //         })

    //     }
    // });

    //巡检
    app.controller('patrolCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $interval, fac) {
        var parkNo = '04201110001CYTD';
        $scope.name = '巡检'
        $scope.msgStatus = '0'
        $scope.search = {
            parkNo: parkNo,
            wayName: '',
            createTime: moment().format('YYYY-MM-DD')
        }
        var url = '';
        $scope.checkedList = []

        $scope.isNext = true
        $scope.isBefore = true
        $scope.img = {}
        $scope.pageModel = {}
        // 查询路线列表
        $scope.findAllWay = function () {
            $http.get('/ovu-pcos/pcos/inspection/insway/list?parkNo=' + $scope.search.parkNo + '&insType=1').success(function (resp) {
                if (resp.code == 0) {
                    $scope.isnWayList = resp.data || [];
                    if ($scope.isnWayList.length > 0) {
                        $scope.search.insWayIds = $scope.isnWayList[0].insWayId
                        $scope.find(1);
                    }

                }
            })
        }
        $scope.findAllWay()

        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            if ($scope.msgStatus == 0) {
                url = '/ovu-pcos/pcos/inspection/daping/report/page'
            } else {
                url = '/ovu-pcos/pcos/inspection/insvideo/list.do'
            }
            fac.getPageResult(url, $scope.search, function (resp) {
                $scope.pageModel = resp
                if ($scope.msgStatus == '1') {
                    $scope.pageModel.data && $scope.pageModel.data.forEach(function (v) {
                        v.imgPaths && (v.imgPaths = v.imgPaths.split(','));

                        if (v.score == undefined) {
                            v.score = 1
                        }

                        v.captureTimes && (v.captureTimes = v.captureTimes.split(','));
                        v.handles && (v.handles = v.handles.split(','));
                        v.insResultId && (v.insResultId = v.insResultId.split(','));
                        v.newList = [];
                        v.imgPaths && v.imgPaths.forEach(function (img, i) {
                            v.newList.push({
                                img: img,
                                insResultId: v.insResultId[i],
                                handles: v.handles[i]
                            })
                        })

                    })
                }
            })
        }
        //点击图片右下角
        $scope.chooseItem = function (item) {
            // console.log(item)
            // console.log(i)

            if (item.handles == '1' || item.handles == '2') {
                item.handles = '0'
                var index = $scope.checkedList.findIndex((v, i) => {
                    return item == v
                })
                $scope.checkedList.splice(index, 1)
            } else {
                item.handles = '2'
                $scope.checkedList.push(item)
            }


        }
        // //显示图片
        $scope.showPhoto = function (src, imgList) {
            $("#sImg").attr('src', src);
            var src = event.srcElement.getAttribute("src") || src;
            if (src && src.indexOf("?imageView2") > -1) {
                src = src.substr(0, src.indexOf("?imageView2"));
            }


            var index = imgList.findIndex((v, i) => {
                return src == v.img
            })
            $scope.img.handles = imgList[index].handles
            $scope.curPic = {
                url: src,
                on: true
            };
            //下一张图片
            if (imgList.length == 1) {
                $scope.isNext = false
                $scope.isBefore = false
            } else if (index == 0) {
                $scope.isBefore = false
                $scope.isNext = true
            } else if (index == imgList.length - 1) {
                $scope.isNext = false
                $scope.isBefore = true
            } else {
                $scope.isNext = true
                $scope.isBefore = true
            }


            $scope.next = function () {
                    index++
                    $scope.curPic = {
                        url: imgList[index].img,
                        on: true
                    }
                    $scope.img.handles = imgList[index].handles

                    if (index == imgList.length - 1) {
                        $scope.isNext = false
                        $scope.isBefore = true
                        return
                    }
                    $scope.isNext = true
                    $scope.isBefore = true

                },
                $scope.before = function () {
                    index--
                    $scope.img.handles = imgList[index].handles
                    $scope.curPic = {
                        url: imgList[index].img,
                        on: true
                    }
                    $scope.isNext = true
                    $scope.isBefore = true
                    if (index == 0) {
                        $scope.isBefore = false
                        $scope.isNext = true
                        return
                    }


                }
            //点击图片详情之后 点击右下角
            $scope.chooseBigItem = function () {
                if ($scope.img.handles == '1' || $scope.img.handles == '2') {
                    $scope.img.handles = '0'
                    imgList[index].handles = '0'
                    var index1 = $scope.checkedList.findIndex((v, i) => {
                        return imgList[index] == v
                    })
                    $scope.checkedList.splice(index1, 1)
                } else {
                    $scope.img.handles = '2'
                    imgList[index].handles = '2'
                    $scope.checkedList.push(imgList[index])
                }
            }


        }
        //一键保存
        $scope.save = function () {

            //弹出一键处理弹出框
            var params = {};
            var modal = $uibModal.open({
                animation: false,
                templateUrl: '/view/inspection/videoInsManage/modal.inspection.deal.html',
                controller: 'dealModalCtrl',
                size: 'md',
                resolve: {
                    param: function () {
                        return $scope.checkedList
                    }

                }
            });
            modal.result.then(function (data) {
                // angular.extend(item, {resultList:data})
                params = data

                $scope.checkedList.forEach(function (v) {
                    if (v.handles == '2') {
                        v.handles = '1'
                    }
                    for (var k in data) {
                        v[k] = data[k]
                    }
                })
                console.log($scope.checkedList)
                save($scope.checkedList)
            });



            function save(param) {
                $http.post("/ovu-pcos/pcos/inspection/insvideo/save", param).success(function (data, status, headers, config) {
                    if (data.code == 0) {
                        msg(data.msg);
                        $scope.find();
                        $scope.checkedList = []
                    } else {
                        alert(data.msg);


                    }
                })
            }



        }



    });
    //设备房
    app.controller('eqRoomCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $interval, fac) {
        var parkNo = '04201110001CYTD';
        $scope.name = '设备房'
        $scope.search = {
            parkNo: parkNo,
            equipHouseAddr: ''
        };
        $scope.pageModel = {}
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult('/ovu-pcos/pcos/equiphouse/daping/report/page', $scope.search, function (resp) {
                $scope.pageModel = resp
            })
        };
        $scope.find(1);
        $scope.getInfo = function (item) {
            var copy = angular.extend({
                parkNo: parkNo
            }, item);
            copy = angular.extend(copy);
            $uibModal.open({
                animation: false,
                templateUrl: '../view/scenario/ws/modal.getEqRoom.html',
                size: 'lg',
                controller: 'getEqRoomModalCtrl',
                resolve: {
                    data: copy
                }
            });
        };


    });
    //安防
    app.controller('security', function ($scope, $rootScope, $http, $filter, $uibModal, $interval, fac) {

        $scope.name = '安防';


        Date.prototype.toLocaleString = function () {
            return this.getFullYear() + "年" + (this.getMonth() + 1) + "月" + this.getDate() + "日" + ' ' + this.getHours() + ":" + this.getMinutes();
        };


        function filterTime(currT, time) {
            let unixTimestamp = new Date((Number(currT) - time * 60 * 1000));
            return unixTimestamp.toLocaleString();
        }

        $scope.search = {
            parkNo: '04201110001CYTD',
        };
        $scope.pageModel = {}
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult('/ovu-pcos/pcos/prevent/safety/getEquipmentMessage', $scope.search, function (resp) {
                $scope.pageModel = resp
            })

        }
        $scope.find(1)

        //
        // $http.get('/ovu-pcos/pcos/prevent/safety/getEquipmentMessage?parkNo=04201110001CYTD').then((res) => {
        //     console.log(res.data.data);
        //     let currT = new Date().getTime();
        //     res.data.data.forEach((v) => {
        //         v.time = filterTime(currT, v.intervaltime);
        //     });
        //     $scope.EquipmentMessage = res.data.data;
        //
        // });

        $scope.showDetail = function (id) {
            $http.get(`/ovu-pcos/pcos/equiphouse/daping/detail?parkNo=04201110001CYTD&equipId=${id.equipment_id}`).then((res) => {
                console.log(res.data.data);

                $uibModal.open({
                    animation: false,
                    templateUrl: '../view/scenario/ws/modal.getEqRoom2.html',
                    size: 'lg',
                    controller: 'getAnFangModalCtrl',
                    resolve: {
                        data: {
                            data: res.data.data,
                            workinfo: id,
                            name: '安防'
                        }
                    }
                });
            });
        }


    });

    //消防
    app.controller('firectrl', function ($scope, $rootScope, $http, $filter, $uibModal, $interval, fac) {

        $scope.name = '消防';
        $scope.search_text = '';
        $scope.eqtp1 = false; //SBCGCGWSD0
        $scope.eqtp2 = false; //SBCGCGYANW
        $scope.eqtp3 = false; //SBCGCGYEW0
        $scope.eqtp4 = false; //SBXFDXYG00
        $scope.str = '';
        let keys = {
            eqtp2: 'SBCGCGWSD0',
            eqtp1: 'SBCGCGYANW',
            eqtp3: 'SBCGCGYEW0',
            eqtp4: 'SBXFDXYG00'
        }


        $scope.search00 = function () {
            $scope.str = ''
            for (let i = 1; i < 5; i++) {
                if ($scope['eqtp' + i]) {
                    $scope.str += (keys['eqtp' + i] + ',')
                }
            }

            //
            // $http.get(`/ovu-pcos/pcos/prevent/firecontrol/getEquipmentMessage?parkNo=04201110001CYTD&equipName=${$scope.search_text}&equipType=${str}`).then((res) => {
            //     console.log(res.data.data);
            //     let currT = new Date().getTime();
            //     res.data.data.forEach((v) => {
            //         v.time = filterTime(currT, v.intervaltime);
            //     });
            //     $scope.EquipmentMessage = res.data.data;
            //
            // });
            $scope.find(1)

            $scope.str = '';

        };


        $scope.search = {
            parkNo: '04201110001CYTD',
            equipName: '',
            equipType: "",
        };
        $scope.pageModel = {}
        $scope.find = function (pageNo) {
            $scope.search.equipType = $scope.str;
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult('/ovu-pcos/pcos/prevent/firecontrol/getEquipmentMessage', $scope.search, function (resp) {
                $scope.pageModel = resp
            })

        }
        $scope.find(1)

        Date.prototype.toLocaleString = function () {
            return this.getFullYear() + "年" + (this.getMonth() + 1) + "月" + this.getDate() + "日" + ' ' + this.getHours() + ":" + this.getMinutes();
        };


        function filterTime(currT, time) {
            let unixTimestamp = new Date((Number(currT) - time * 60 * 1000));
            return unixTimestamp.toLocaleString();
        }

        // $http.get('/ovu-pcos/pcos/prevent/firecontrol/getEquipmentMessage?parkNo=04201110001CYTD&equipName=').then((res) => {
        //     console.log(res.data.data);
        //     let currT = new Date().getTime();
        //     res.data.data.forEach((v) => {
        //         v.time = filterTime(currT, v.intervaltime);
        //     });
        //     $scope.EquipmentMessage = res.data.data;
        //
        // });

        $scope.showDetail = function (id) {
            $http.get(`/ovu-pcos/pcos/equiphouse/daping/detail?parkNo=04201110001CYTD&equipId=${id.equipment_id}`).then((res) => {
                console.log(res.data.data);
                $uibModal.open({
                    animation: false,
                    templateUrl: '../view/scenario/ws/modal.getEqRoom2.html',
                    size: 'lg',
                    controller: 'getAnFangModalCtrl',
                    resolve: {
                        data: {
                            data: res.data.data,
                            workinfo: id,
                            name: '消防'
                        }
                    }
                });
            });
        }

    });
    //设备房模态框
    app.controller('getEqRoomModalCtrl', function ($scope, $rootScope, $http, $filter, $timeout, $uibModalInstance, $uibModal, fac, $interval, data) {
        $scope.name = '设备房';
        $scope.sensorParamList = [];
        $scope.personList = [];



        //地图配置
        var mapCenter = [114.321749, 30.470118];
        //左侧大地图
        $scope.mainMapOptions = {
            toolbar: true,
            // map-self config
            resizeEnable: true,
            // ui map config
            uiMapCache: false,
            zoom: 15,
            //精简模式
            liteStyle: true,
            expandZoomRange: true,
        }
        $timeout(function () {
            $scope.mainMap.setCenter(mapCenter);
        }, 200)
        $scope.mainMap = new AMap.Map('mainMap', {
            center: mapCenter,
            zooms: [4, 18], //设置地图级别范围
            zoom: 17
        });

        function addMark(longitude, latitude) {
            var marker = new AMap.Marker({
                position: [longitude, latitude],


            });
            return marker
        }

        //获取详情
        $http.post("/ovu-pcos/pcos/equiphouse/daping/detail", {
            parkNo: data.parkNo,
            equipId: data.equipId
        }, fac.postConfig).success(function (resp) {
            if (resp.code == 0) {
                $scope.sensorParamList = resp.data.sensorParamList || [];
                $scope.personList = resp.data.personList || []
                $scope.equipId = data.equipId;
                if (resp.data.longitude) {
                    var marker = addMark(resp.data.longitude, resp.data.latitude);
                    $scope.mainMap.add(marker)
                }


            }
        })

        //通知
        $scope.tell = function (personId) {
            $http.post("/ovu-pcos/pcos/equiphouse/daping/notify", {
                personId: personId,
                workunitId: data.workunitId,
                workunitName: data.workunitName
            }, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    msg(resp.msg)
                } else {
                    alert(resp.msg);
                }
            })
        };

        $scope.cancel = function ($event) {

            let iframes = $(".iframeWork");
            if (iframes.length) {
                for (var i = 0; i < iframes.length; i++) {
                    if (iframes[i].contentWindow.closePlayer) {
                        iframes[i].contentWindow.closePlayer();
                    }
                }
            }

            $event.preventDefault();
            $uibModalInstance.dismiss('cancel');

        };

    });


    app.controller('getAnFangModalCtrl', function ($scope, $rootScope, $http, $filter, $timeout, $uibModalInstance, $uibModal, fac, $interval, data) {
        $scope.name = data.name;
        $scope.sensorParamList = data.data.sensorParamList;
        $scope.personList = data.data.personList;
        $scope.cameraCode = data.workinfo.regi_code;
        $scope.equipmentId = data.workinfo.eqId;

        $scope.params0 = true;
        if (data.data.params0) {
            $scope.params0 = false;
        }
        //地图配置
        var mapCenter = [114.321749, 30.470118];
        //左侧大地图
        $scope.mainMapOptions = {
            toolbar: true,
            // map-self config
            resizeEnable: true,
            // ui map config
            uiMapCache: false,
            zoom: 15,
            //精简模式
            liteStyle: true,
            expandZoomRange: true,
        }
        $timeout(function () {
            $scope.mainMap.setCenter(mapCenter);
            $scope.mainMap.add(addMark(data.data.longitude, data.data.latitude))
        }, 200)
        $scope.mainMap = new AMap.Map('mainMap', {
            center: mapCenter,
            zooms: [4, 18], //设置地图级别范围
            zoom: 17
        });


        function addMark(longitude, latitude) {


            var marker = new AMap.Marker({
                position: [longitude, latitude],


            });
            return marker
        }


        //通知
        $scope.tell = function (personId) {
            if ($scope.name == "出行") {
                msg('通知成功');
            } else {
                $http.post("/ovu-pcos/pcos/equiphouse/daping/notify", {
                    personId: personId,
                    workunitId: data.workinfo.id,
                    workunitName: data.workinfo.workunit_name,
                }, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        msg(resp.msg)
                    } else {
                        alert(resp.msg);
                    }
                })
            }

        };


        $scope.cancel = function ($event) {
            let iframes = $(".iframeWork");
            if (iframes.length) {
                for (var i = 0; i < iframes.length; i++) {
                    if (iframes[i].contentWindow.closePlayer) {
                        iframes[i].contentWindow.closePlayer();
                    }
                }
            }

            $event.preventDefault();
            $uibModalInstance.dismiss('cancel');
        };

    });


    //出行
    // app.controller('trip', function ($scope, $rootScope, $http, $filter, $uibModal, $interval, fac) {
    //     var parkNo = '04201110001CYTD';
    //     $scope.name = 'trip';


    //     $scope.carsWarnning = [{
    //             name: '郭瑞',
    //             code: '12VU8',
    //             h: 9,
    //             m: 2,
    //             lnglat: [114.323565, 30.471788],
    //             regi_code: '34020000001324600009'

    //         },
    //         {
    //             name: '吴刚',
    //             code: '368G3',
    //             h: 9,
    //             m: 8,
    //             lnglat: [114.3218, 30.471801],
    //             regi_code: '34020000001321300013'


    //         },
    //         {
    //             name: '王艳',
    //             code: '91624',
    //             h: 9,
    //             m: 12,
    //             lnglat: [114.320942, 30.470068],
    //             regi_code: '34020000001324600002'

    //         },
    //         {
    //             name: '李可欣',
    //             code: '77JK2',
    //             h: 9,
    //             m: 17,
    //             lnglat: [114.321113, 30.47219],
    //             regi_code: '34020000001321500010'

    //         },
    //         {
    //             name: '孟祥鑫',
    //             code: '04067',
    //             h: 9,
    //             m: 21,
    //             lnglat: [114.323742, 30.469827],
    //             regi_code: '34020000001322100012'

    //         },

    //     ];

    //     let curTime = new Date();

    //     $scope.carsWarnning.forEach(v => {
    //         if (curTime.getHours() - v.h > 0) {
    //             v.time0 = curTime.getHours() - v.h + '小时';
    //         } else {
    //             v.time0 = curTime.getMinutes() - v.m + '分钟';

    //         }
    //     });


    //     $scope.showDetail = function (id) {
    //         console.log(id);

    //         $http.get(`/ovu-pcos/pcos/equiphouse/daping/detail?parkNo=04201110001CYTD&equipId=1532506753915`).then((res) => {

    //             $uibModal.open({
    //                 animation: false,
    //                 templateUrl: '../view/scenario/ws/modal.getEqRoom2.html',
    //                 size: 'lg',
    //                 controller: 'getAnFangModalCtrl', //114.321749, 30.470118
    //                 resolve: {
    //                     data: {
    //                         workinfo: {
    //                             id: '',
    //                             workunit_name: '车位被占，请前去处理',
    //                             regi_code: id.regi_code,
    //                         },
    //                         data: {
    //                             params0: true,
    //                             personList: res.data.data.personList,
    //                             longitude: id.lnglat[0],
    //                             latitude: id.lnglat[1],

    //                         },
    //                         name: '出行'
    //                     }
    //                 }
    //             });
    //         });


    //     }


    // });
    //能耗
    app.controller('energyctrl', function ($scope, $rootScope, $http, $filter, $uibModal, $interval, fac) {
        $scope.name = '能耗';
        $scope.pageModel = {};
        $scope.search = {
            parkNo: '04201110001CYTD',
            workunitName: ''
        };
        //查询未处理工单
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });

            fac.getPageResult('/ovu-energy/energy/park/stats/scene/alarm/page', $scope.search, function (res) {
                $scope.pageModel = res;
            })
        }
        $scope.find(1);
        //通知本人
        $scope.noticePerson = function (item) {
            var personNameArr = item.personName.split(",");
            var phoneArr = item.phone.split(",");
            var msg = personNameArr[0] + ":" + phoneArr[0]
            if (personNameArr.length > 1 && personNameArr.length == phoneArr.length) {
                for (var i = 1; i < personNameArr.length; i++) {
                    msg += '<br>' + personNameArr[i] + ":" + phoneArr[i]
                }
            }
            layer.confirm(msg, {
                btn: ['取消'],
                title: false
            }, function (index) {
                layer.close(index);
            });
        }
        //通知领导
        $scope.noticeLeader = function (item) {

            var param = {
                workunitId: item.workunitId,
                parkNo: $scope.search.parkNo
            };
            $http.get('/ovu-pcos/pcos/workunitExt/noticeLeader', {
                params: param
            }).success(function (res) {
                if (res.code == 0) {
                    msg("通知成功！")
                } else {
                    alert("通知失败！")
                }
            })
        }
        //派发
        $scope.distributeModal = function (ids, deptId, parkId) {

            var modal = $uibModal.open({
                animation: false,
                size: "",
                templateUrl: 'scenario/ws/myworkunit.distribute.html',
                controller: 'personUnitSelectorCtrl',
                resolve: {
                    data: {
                        deptId: deptId,
                        parkId: parkId,


                    }
                }
            });
            modal.result.then(function (data) {
                if (data) {
                    var params = {
                        unitIds: ids,
                        execId: data.execId,
                        assistanceIds: data.assistanceIds,
                        manageId: data.manageId,
                        remark: data.remark
                    };
                    $http.post("/ovu-pcos/pcos/workunit/distributeWorkUnit.do", params, fac.postConfig).success(function (resp) {
                        if (resp.success) {
                            msg("派单成功!");
                            $scope.find(1);
                        } else {
                            alert(resp.error);
                        }
                    })
                }
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
    });


    //VIP出行
    app.controller('viptrip', function ($scope, $rootScope, $http, $filter, $uibModal, $interval, fac) {
        var parkNo = '04201110001CYTD';
        $scope.name = 'viptrip';
        $scope.search = {
            domainId: '14bdbea59d2c4b0a96594fb94382901e',
        };
        $scope.pageModel = {};
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult('/ovu-base/api/parking/occupiedList', $scope.search, function (res) {
                $scope.pageModel = res;
                console.log(res);
            })
        };
        $scope.find(1);
        $scope.showDetail = function (id) {

            $http.get("/ovu-pcos/pcos/equipment/bigScreen/queryEquipIdByHouseId?houseId=" + id.id).success(function (resp) {
                if (resp.data) {
                    var cameraCode = resp.data.regi_code
                    $http.get("/ovu-pcos/pcos/equiphouse/daping/vipdetail?parkNo=04201110001CYTD&equipId=" + resp.data.id).then((res) => {
                        $uibModal.open({
                            animation: false,
                            templateUrl: '../view/scenario/ws/modal.getEqRoom2.html',
                            size: 'lg',
                            controller: 'getAnFangModalCtrl', //114.321749, 30.470118
                            resolve: {
                                data: {
                                    workinfo: {
                                        id: '',
                                        workunit_name: '车位被占，请前去处理',
                                        regi_code: cameraCode,
                                    },
                                    data: {
                                        params0: true,
                                        personList: res.data.data.personList,
                                        longitude: id.buildLng,
                                        latitude: id.buildLat,

                                    },
                                    name: '出行'
                                }
                            }
                        });
                    });
                }
            })
        }
    });

    //设备
    app.controller('equipment', function ($scope, $rootScope, $http, $filter, $uibModal, $interval, fac) {
        var parkNo = '04201110001CYTD';
        $scope.name = 'equipment';

        $scope.pageModel = {};
        $scope.search = {
            parkNo: '04201110001CYTD',
            name: '',
            types: "3",
        };

        //查询未处理工单
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            http:
                fac.getPageResult('/ovu-pcos/pcos/workunitExt/list', $scope.search, function (res) {
                    $scope.pageModel = res;
                    // if (res.code == 0) {
                    //
                    //     $scope.pageModel.totalPage = res.data.pageTotal;
                    //     $scope.pageModel.currentPage = res.data.pageIndex;
                    //     $scope.pageModel.totalRecord=res.data.totalCount
                    // } else {
                    //     alert(res.msg)
                    // }
                })
        }
        $scope.find(1)

        //通知本人
        $scope.noticePerson = function (item) {
            var msg = item.personName + ":" + item.phone
            layer.confirm(msg, {
                btn: ['取消'],
                title: false
            }, function (index) {
                layer.close(index);
            });
        }

        //通知领导
        $scope.noticeLeader = function (item) {

            var param = {
                workunitId: item.id,
                parkNo: $scope.search.parkNo
            }
            $http.get('/ovu-pcos/pcos/workunitExt/noticeLeader', {
                params: param
            }).success(function (res) {
                if (res.code == 0) {
                    msg("通知成功！")
                } else {
                    alert("通知失败！")
                }
            })
        }

        //派发
        $scope.distributeModal = function (ids, deptId, parkId) {
            var modal = $uibModal.open({
                animation: false,
                size: "",
                templateUrl: 'scenario/ws/myworkunit.distribute.html',
                controller: 'personUnitSelectorCtrl',
                resolve: {
                    data: {
                        deptId: deptId,
                        parkId: parkId
                    }
                }
            });
            modal.result.then(function (data) {
                if (data) {
                    var params = {
                        unitIds: ids,
                        execId: data.execId,
                        assistanceIds: data.assistanceIds,
                        manageId: data.manageId,
                        remark: data.remark
                    };

                    $http.post("/ovu-pcos/pcos/workunit/distributeWorkUnit.do", params, fac.postConfig).success(function (resp) {
                        if (resp.success) {
                            msg("派单成功!");
                            $scope.find(1);
                        } else {
                            alert(resp.error);
                        }
                    })
                }
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };


        // $http.get('/ovu-pcos/pcos/equipment/bigScreen/queryMessage?parkNo=04201110001CYTD').then((res) => {
        //     console.log(res.data.data);
        //     $scope.msgList = res.data.data.msgList;
        //
        // });


        $scope.pageModel2 = {};
        $scope.search2 = {
            parkNo: '04201110001CYTD',
        };
        //查询未处理消息
        $scope.find2 = function (pageNo) {

            $.extend($scope.search2, {
                currentPage: pageNo || $scope.pageModel2.currentPage || 1,
                pageSize: $scope.pageModel2.pageSize || 10
            });

            fac.getPageResult('/ovu-pcos/pcos/equipment/bigScreen/queryMessage', $scope.search2, function (res) {
                $scope.pageModel2 = res;
            })
        }
        $scope.find2(1);



        $scope.showDetail = function (id) {
            console.log(id);

            $http.get(`/ovu-pcos/pcos/equiphouse/daping/detail?parkNo=04201110001CYTD&equipId=${id.id}`).then((res) => {
                console.log(res);

                $uibModal.open({
                    animation: false,
                    templateUrl: '../view/scenario/ws/modal.getEqRoom2.html',
                    size: 'lg',
                    controller: 'getAnFangModalCtrl', //114.321749, 30.470118
                    resolve: {
                        data: {
                            workinfo: {
                                id: '',
                                workunit_name: id.msg,
                                regi_code: '',
                                eqId: id.id

                            },
                            data: {
                                params0: true,
                                personList: res.data.data.personList,
                                longitude: id.longitude_,
                                latitude: id.latitude_,

                            },
                            name: '设备'
                        }
                    }
                });
            });


        }


    });

    //人脸识别
    app.controller('faceTrack', function ($scope, $rootScope, $http, $filter, $uibModal, $interval, fac) {

        $scope.name = '人脸识别';
        $scope.search_text = '';
        let OrignScreenList = [];
        $scope.search00 = function () {
            let str = $.trim($scope.search_text);
            if (str == '') {
                $scope.screenList = OrignScreenList;
                return;
            }
            let newScreenList = [];
            $scope.screenList.forEach(v => {
                if (v.name.match(str)) {
                    newScreenList.push(v);
                }
            });
            $scope.screenList = newScreenList;
        };

        $scope.screenList = [];

        //摄像头经纬度定义
        var cameraPoint = {

            "4": {
                "lnglat": [114.32345752194333, 30.472256051036187],
            }, //一层入口摄像头
            "5": {
                "lnglat": [114.32332604574744, 30.472219157440378],
            }, //一层电梯口摄像头
            "19": {
                "lnglat": [114.32335662160693, 30.472119017454983],
            }, //1楼北门
            "22": {
                "lnglat": [114.32347892504498, 30.47203732435905],
            }, //1楼南门
            "24": {
                "lnglat": [114.32328018195817, 30.47214009953312],
            }, //6楼北门
            "26": {
                "lnglat": [114.32334744884909, 30.47203732435905],
            }, //6楼北摄像头
            "10": {
                "lnglat": [114.32341777332597, 30.472032053834354],
            }, //10层北门
            "23": {
                "lnglat": [114.32335356402099, 30.472063676978117],
            }, //10楼南门
        };

        $http.get('/ovu-pcos/api/face/stranger/screen').then((res) => {
            console.log(res.data.data);
            res.data.data.screenList.forEach(v => {
                if (cameraPoint[v.id + '']) {
                    let lnglat = cameraPoint[v.id + ''].lnglat;
                    v.lnglat = lnglat;
                    OrignScreenList.push(v);
                }
            });
            $scope.screenList = OrignScreenList;
        });


        $scope.showDetail = function (item) {
            $http.get(`/ovu-pcos/api/face/stranger/notify/detail?id=${item.id}&parkNo=04201110001CYTD`).then((res) => {
                $uibModal.open({
                    animation: false,
                    templateUrl: '../view/scenario/ws/modal.getFaceTrack.html',
                    size: 'lg',
                    controller: 'getFaceTrackModalCtrl',
                    resolve: {
                        data: {
                            data: res.data.data,
                            screen: item,
                            name: '人脸识别'
                        }
                    }
                });
            });
        }
    });


    app.controller('getFaceTrackModalCtrl', function ($scope, $rootScope, $http, $filter, $timeout, $uibModalInstance, $uibModal, fac, $interval, data) {
        $scope.name = data.name;
        $scope.personList = data.data.nearbyPersonList;
        $scope.imgUrlsIndex = 0;

        $scope.imgUrls = data.data.strangerPhotoList;

        $scope.selphoto = function (val) {

            let index = $scope.imgUrlsIndex;
            index += val;
            if (index < 0)
                index = 0;
            if (index > $scope.imgUrls.length - 1)
                index = $scope.imgUrls.length;
            $scope.imgUrlsIndex = index;
        };

        //地图配置
        var mapCenter = [114.321749, 30.470118];
        //左侧大地图
        $scope.mainMapOptions = {
            toolbar: true,
            // map-self config
            resizeEnable: true,
            // ui map config
            uiMapCache: false,
            zoom: 15,
            //精简模式
            liteStyle: true,
            expandZoomRange: true,
        }
        $timeout(function () {
            $scope.mainMap.setCenter(mapCenter);
            $scope.mainMap.add(addMark(data.screen.lnglat[0], data.screen.lnglat[1]))
        }, 200)
        $scope.mainMap = new AMap.Map('mainMap', {
            center: mapCenter,
            zooms: [4, 18], //设置地图级别范围
            zoom: 17
        });


        function addMark(longitude, latitude) {

            var marker = new AMap.Marker({
                position: [longitude, latitude],
            });
            return marker
        }


        //通知
        $scope.tell = function (personId) {
            $http.post("/ovu-pcos/api/face/stranger/notify", {
                personId: personId,
                screenName: data.screen.name
            }, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    msg(resp.msg)
                } else {
                    alert(resp.msg);
                }
            })
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });
    //会议室管理
    app.controller('meetingCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $interval, fac) {
        $scope.name = '会议室管理';
        $scope.pageModel = {};
        $scope.search = {
            parkId: "af98a32c9b4d490297cadc2d85faf797",
            boardroomName: ''
        };
        //查询会议室预定列表
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });

            fac.getPageResult('/ovu-park/backstage/operate/officeReserve/findOfficeReserveList', $scope.search, function (res) {
                $scope.pageModel = res;
            })
        }
        $scope.find(1);

        //新增预定
        $scope.addMeeting = function () {

            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: 'scenario/ws/modal.addMeeting.html',
                controller: 'addMeetingCtrl',
                resolve: {}
            });
            modal.result.then(function (data) {
                $scope.find(1);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
    });
    app.controller('addMeetingCtrl', function ($scope, $rootScope, $http, $filter, $timeout, $uibModalInstance, $uibModal, fac, $interval) {
        $scope.centerUlList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
        $scope.staffList = [];
        $scope.meetingList = [];
        $scope.orderParam={}
        $scope.currentDate = new Date().format('yyyy-MM-dd');
        $scope.meeting = {
            allTime: {
                "8:30": 0,
                "9:00": 0,
                "9:30": 0,
                "10:00": 0,
                "10:30": 0,
                "11:00": 0,
                "11:30": 0,
                "12:00": 0,
                "12:30": 0,
                "13:00": 0,
                "13:30": 0,
                "14:00": 0,
                "14:30": 0,
                "15:00": 0,
                "15:30": 0,
                "16:00": 0,
                "16:30": 0,
                "17:00": 0,
                "17:30": 0,
                "18:00": 0
            },
            allTimeCopy: {
                "8:30": 0,
                "9:00": 0,
                "9:30": 0,
                "10:00": 0,
                "10:30": 0,
                "11:00": 0,
                "11:30": 0,
                "12:00": 0,
                "12:30": 0,
                "13:00": 0,
                "13:30": 0,
                "14:00": 0,
                "14:30": 0,
                "15:00": 0,
                "15:30": 0,
                "16:00": 0,
                "16:30": 0,
                "17:00": 0,
                "17:30": 0,
                "18:00": 0
            },
            left: '',
            right: '',
            flag: false
        }
        $scope.getFocus = function () {
            document.getElementById('focusShow').focus()
        }
        //查询1号楼已发布的会议室
        $scope.getMeetingList = function () {
            $http.get("/ovu-park/backstage/operate/officeReserve/findOfficeListForFirstBuild").success(function (res) {
                if (res.code === 0) {
                    $scope.meetingList = res.data;
                } else {
                    alert(res.message);
                }

            })
        }
        $scope.getMeetingList();

        //查询预订人
        $scope.getExistStaffInfo = function (e) {
            if ($scope.getExistStaffInfoStatus) {
                return;
            }
            var param = {
                "name": $scope.orderParam.contactMan
            };
            $http.get('/ovu-park/backstage/operate/officeReserve/findStaffListForFirstBuild', {
                params: param
            }).success(function (response) {
                if (response && response.code == 0) {
                    if (response.data.totalCount == 1) {
                        $scope.getExistStaffInfoStatus = true;
                    }
                    $scope.staffList = response.data.data;
                }
            })

        }
        $scope.setName = function (name) {
            console.log(name)
            if (!name) {
                return
            }
            $scope.getExistStaffInfoStatus = false;
            var param = {
                "name": name
            };
            $http.get('/ovu-park/backstage/operate/officeReserve/findStaffListForFirstBuild', {
                params: param
            }).success(function (response) {
                if (response && response.code == 0) {
                    $scope.staffList = response.data.data;
                    for (var i = 0; i < $scope.staffList.length; i++) {
                        if ($scope.staffList[i].name == $scope.orderParam.contactMan) {
                            $scope.orderParam.contactPhone = $scope.staffList[i].phone;
                        }
                    }
                }

            })
        }

        $scope.chooseOp = function (data) {
            console.log(data)
        }

        //查询指定日期的会议室预订情况
        $scope.getOrderInfo = function () {
            console.log("======")
            if (!$scope.orderParam.boardroomId) {
                return
            }
            if (!$scope.orderParam.orderDate) {
                return
            }
            var param = {
                choosedDay: $scope.orderParam.orderDate,
                officeId: $scope.orderParam.boardroomId,
            }
            $http.get("/ovu-park/backstage/operate/officeReserve/getOrderListByIdAndDay", {
                params: param
            }).success(function (response) {

                if (response && response.code == 0) {
                    $scope.meeting.allTime = angular.copy(response.data);
                    $scope.meeting.allTimeCopy = angular.copy(response.data);
                    $scope.meeting.left = '';
                    $scope.meeting.right = '';
                    $scope.meeting.flag = false;
                }

            })

        }
        var timePointTransform = function (timeStr) {
            switch (timeStr) {
                case 1:
                    return "08:30";
                    break;
                case 2:
                    return "09:00";
                    break;
                case 3:
                    return "09:30";
                    break;
                case 4:
                    return "10:00";
                    break;
                case 5:
                    return "10:30";
                    break;
                case 6:
                    return "11:00";
                    break;
                case 7:
                    return "11:30";
                    break;
                case 8:
                    return "12:00";
                    break;
                case 9:
                    return "12:30";
                    break;
                case 10:
                    return "13:00";
                    break;
                case 11:
                    return "13:30";
                    break;
                case 12:
                    return "14:00";
                    break;
                case 13:
                    return "14:30";
                    break;
                case 14:
                    return "15:00";
                    break;
                case 15:
                    return "15:30";
                    break;
                case 16:
                    return "16:00";
                    break;
                case 17:
                    return "16:30";
                    break;
                case 18:
                    return "17:00";
                    break;
                case 19:
                    return "17:30";
                    break;
                case 20:
                    return "18:00";
                    break;
            }
        }

        var setTimeGridBG = function (itemObj, item, interval, direction) {
            var timeList = itemObj.time.split(':');
            var hour = parseInt(timeList[0]);
            var min = timeList[1];
            if (min == "00") {
                min = 0;
            } else if (min == '30') {
                min = 0.5;
            }
            if (direction == 'right') {
                for (var i = 0; i < interval; i++) {
                    var time = timeTransform(hour + min - i / 2);
                    item.allTimeCopy[time] = 1;
                }
            } else if (direction == 'left') {
                for (var i = 0; i < interval; i++) {
                    var time = timeTransform(hour + min + i / 2);
                    item.allTimeCopy[time] = 1;
                }
            } else if (direction == 'reduceRight') {
                for (var i = 1; i <= interval; i++) {
                    var time = timeTransform(hour + min + i / 2);
                    item.allTimeCopy[time] = 0;
                }
            } else if (direction == 'reduceLeft') {
                for (var i = 1; i <= interval; i++) {
                    var time = timeTransform(hour + min - i / 2);
                    item.allTimeCopy[time] = 0;
                }
            }
        }
        $scope.selectTime = function (flag, timeObj, item) {

            if (flag) {
                return
            } else {
                if (item.left == '' && item.right == '') {
                    item.left = timeObj.number;
                    item.allTimeCopy[timeObj.time] = 1;
                } else if (item.left != '' && item.right != '') {
                    var currentNum = timeObj.number;
                    if (currentNum < item.left) { //在原有选择的基础上又往左选了
                        var flag = checkSelectedStatus(item.left, item.left - currentNum, timeObj, item, 'left');
                        if (!flag) {
                            var interval = item.left - currentNum;
                            item.left = currentNum;
                            setTimeGridBG(timeObj, item, interval, 'left');
                        }
                    } else if (currentNum > item.right) { //在原有选择的基础上又往右选了
                        var flag = checkSelectedStatus(item.left, currentNum - item.left, timeObj, item, 'right');
                        if (!flag) {
                            var interval = currentNum - item.left;
                            item.right = currentNum;
                            setTimeGridBG(timeObj, item, interval, 'right');
                        }
                    } else if ((item.right > item.left) && (currentNum == item.right || currentNum == item.left)) { //在原有选择的基础上一个个取消选择的情况
                        item.allTimeCopy[timeObj.time] = 0;
                        if (item.right - item.left > 1) {
                            if (currentNum == item.right && currentNum != item.left) {
                                item.right = currentNum - 1;
                            } else if (currentNum != item.right && currentNum == item.left) {
                                item.left = currentNum + 1;
                            }
                        } else {
                            if (currentNum == item.right && currentNum != item.left) {
                                item.right = '';

                            } else if (currentNum != item.right && currentNum == item.left) {
                                item.left = angular.copy(item.right);
                                item.right = '';
                            }
                        }
                    } else { //选择了（已选一段）中间的某个
                        var intervalRight = item.right - currentNum;
                        var intervalLeft = currentNum - item.left;
                        if (intervalRight == intervalLeft) { //选择的是正中间，则取消该点到左边点之间选择的点
                            var interval = item.right - currentNum;
                            item.left = currentNum;
                            setTimeGridBG(timeObj, item, interval, 'reduceLeft');
                        } else if (intervalRight > intervalLeft) { //选择的点离左边近，则取消该点到左边点之间选择的点
                            var interval = currentNum - item.left;
                            item.left = currentNum;
                            setTimeGridBG(timeObj, item, interval, 'reduceLeft');
                        } else if (intervalRight < intervalLeft) { //选择的点离右边近，则取消该点到右边点之间选择的点
                            var interval = item.right - currentNum;
                            item.right = currentNum;
                            setTimeGridBG(timeObj, item, interval, 'reduceRight');
                        }
                    }

                } else if (item.left != '' && item.right == '') { //已有一个起始点，又选择了一个结束点
                    if (timeObj.number == item.left) { //选择同一个，取消该选择
                        item.allTimeCopy[timeObj.time] = 0;
                        item.left = '';
                    } else { //没有选同一个
                        if (timeObj.number > item.left) {
                            var flag = checkSelectedStatus(item.left, timeObj.number - item.left, timeObj, item, 'right');
                            if (!flag) {
                                item.right = timeObj.number;
                                var interval = timeObj.number - item.left;
                                setTimeGridBG(timeObj, item, interval, 'right');
                            }
                        } else if (timeObj.number < item.left) {
                            var flag = checkSelectedStatus(item.left, item.left - timeObj.number, timeObj, item, 'left');
                            if (!flag) {
                                var temp = angular.copy(item.left);
                                item.left = timeObj.number;
                                item.right = temp;
                                var interval = item.right - item.left;
                                setTimeGridBG(timeObj, item, interval, 'left');
                            }
                        }
                    }
                }
                if (item.left != '' || item.right != '') {
                    item.flag = true;
                } else {
                    item.flag = false;
                }
            }
        }
        //判断是否可以连续选
        var checkSelectedStatus = function (leftNum, interval, timeObj, item, direction) {
            var flag = false;
            var timeList = timeObj.time.split(':');
            var hour = parseInt(timeList[0]); //当前点击的时间--时
            var min = timeList[1];
            if (min == "00") {
                min = 0;
            } else if (min == '30') {
                min = 0.5;
            }
            if (direction == 'right') {
                for (var i = 0; i < interval; i++) {
                    var time = timeTransform(hour + min - i / 2);
                    if (item.allTime[time] == 1) {
                        flag = true;
                    }
                }
            } else if (direction == 'left') {
                for (var i = 0; i < interval; i++) {
                    var time = timeTransform(hour + min + i / 2);
                    if (item.allTime[time] == 1) {
                        flag = true;
                    }
                }
            }
            return flag;
        }
        var timeTransform = function (timeStr) {
            switch (timeStr) {
                case 8.5:
                    return "8:30";
                    break;
                case 9.0:
                    return "9:00";
                    break;
                case 9.5:
                    return "9:30";
                    break;
                case 10.0:
                    return "10:00";
                    break;
                case 10.5:
                    return "10:30";
                    break;
                case 11.0:
                    return "11:00";
                    break;
                case 11.5:
                    return "11:30";
                    break;
                case 12.0:
                    return "12:00";
                    break;
                case 12.5:
                    return "12:30";
                    break;
                case 13.0:
                    return "13:00";
                    break;
                case 13.5:
                    return "13:30";
                    break;
                case 14.0:
                    return "14:00";
                    break;
                case 14.5:
                    return "14:30";
                    break;
                case 15.0:
                    return "15:00";
                    break;
                case 15.5:
                    return "15:30";
                    break;
                case 16.0:
                    return "16:00";
                    break;
                case 16.5:
                    return "16:30";
                    break;
                case 17.0:
                    return "17:00";
                    break;
                case 17.5:
                    return "17:30";
                    break;
                case 18.0:
                    return "18:00";
                    break;
            }

        }
        var setBookingTimeRange = function () {
            if ($scope.meeting.left != '') {
                $scope.bookingBegin = timePointTransform($scope.meeting.left)
                if ($scope.meeting.right == '') {
                    $scope.bookingEnd = timePointTransform($scope.meeting.left + 1);
                    $scope.meeting.right = $scope.meeting.left + 1

                } else {
                    $scope.bookingEnd = timePointTransform($scope.meeting.right + 1);

                }
            }
        }
        //保存预定
        $scope.saveOrder = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                layui.use('layer', function () {
                    var layer = layui.layer;
                    layer.open({
                        title: '提示',
                        content: '请完成必填项！'
                    });
                });
                return;
            }
            /****验证手机号*/
            var reg = new RegExp("^0?(13[0-9]|14[5-9]|15[012356789]|166|17[0135678]|18[0-9]|19[89])[0-9]{8}$");
            if (!reg.test($scope.orderParam.contactPhone)) {
                layui.use('layer', function () {
                    var layer = layui.layer;
                    layer.open({
                        title: '提示',
                        content: '请输入正确的手机号！'
                    });
                });
                return false;
            }
            if (!$scope.meeting.flag) {
                layui.use('layer', function () {
                    var layer = layui.layer;
                    layer.open({
                        title: '提示',
                        content: '请选择预定会议室的时间段！'
                    });
                });
                return false;
            }
            setBookingTimeRange()
            $scope.param = {
                beginDuration: $scope.meeting.left,
                endDuration: $scope.meeting.right,
                beginTime: $scope.orderParam.orderDate + " " + $scope.bookingBegin + ":00",
                endTime: $scope.orderParam.orderDate + " " + $scope.bookingEnd + ":00",
                contactMan: $scope.orderParam.contactMan,
                contactPhone: $scope.orderParam.contactPhone,
                boardroomId: $scope.orderParam.boardroomId,
                orderDate: $scope.orderParam.orderDate,
                createTime: new Date().format('yyyy-MM-dd hh:mm:ss'),
                theme: $scope.orderParam.theme,
                peopleNum: $scope.orderParam.peopleNum,
                remark: $scope.orderParam.remark
            }
            $scope.param.conferenceType = "";
            if ($scope.orderParam.priceType1) {
                $scope.param.conferenceType = $scope.param.conferenceType + "1,";
            }
            if ($scope.orderParam.priceType2) {
                $scope.param.conferenceType = $scope.param.conferenceType + "2,";
            }
            if ($scope.orderParam.priceType3) {
                $scope.param.conferenceType = $scope.param.conferenceType + "3,";
            }
            $scope.param.isHasConference = $scope.param.conferenceType === "" ? 0 : 1;
            $scope.staffList.forEach((v, i) => {
                if (v.name == $scope.orderParam.contactMan) {
                    $scope.param.personId = v.personId;
                    // $scope.param.customerUserId = v.loginId;
                    $scope.param.deptName = v.deptName
                }
            })
            // if (!$scope.param.personId) {
            //     alert("请选择联系人！")
            //     return false;
            // }
            $http.get("/ovu-park/backstage/operate/officeReserve/saveOrEdit", {
                params: $scope.param
            }).success(function (response) {
                if (response && response.code == 0) {
                    window.msg("会议室预定提交成功!")
                    $uibModalInstance.close();
                } else {
                    window.error(response.message)
                }
            })
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });
    //
    // 通知上级
    app.controller('noticeLeaderCtrl', function ($scope, $rootScope, $http, $filter, $timeout, $uibModalInstance, $uibModal, fac, $interval, data) {
        $scope.pageModel = [];
        $scope.personsSelected = [];
        $scope.search = {};
        $scope.item = {}
        /**
         * 判断人员是否在已选人员列表中
         */
        function isInArray(arr, value) {
            //debugger;
            var f = -1;
            arr.forEach(function (p, i) {
                if (p.personName === value.personName) {
                    f = i;
                }
            });
            return f;
        }
        //查看上级
        $scope.find = function () {

            $http.get("/ovu-pcos/pcos/sceneMessage/getLeader/" + data.msgId).success(function (resp) {
                if (resp.code == 0) {
                    $scope.pageModel = resp.data


                }
            })
        };
        $scope.find()
        $scope.checkAll = function (data) {
            if (data.onlineStatus == 'online') {
                data.checked = !data.checked;
                data.forEach(function (n) {
                    n.checked = data.checked
                    var isSelected = false;
                    $scope.personsSelected && $scope.personsSelected.forEach(function (person) {
                        if (n.personName == person.personName) {
                            isSelected = true;
                        }

                    })
                    //在编辑状态下如果在编辑前没有被选中的才加入
                    if (!isSelected) {
                        $scope.personsSelected.push(n);
                    }
                    if (!n.checked && isSelected) {
                        var i = 0;
                        $scope.personsSelected.forEach(function (v) {
                            i++;
                            if (v.personName == n.personName) {
                                $scope.personsSelected.splice(i - 1, 1);
                            }
                        })

                    }


                });
            }
        };

        $scope.selectPersonItem = function (person, data) {
            //标记是否选择
            person.checked = !person.checked;
            if (data) {
                data.checked = data.every(function (v) {
                    return v.checked;
                });
            }
            //加入选择组
            var i = isInArray($scope.personsSelected, person);
            if (!person.checked && i !== -1) {
                $scope.personsSelected.splice(i, 1);
                $scope.pageModel.checked = false
            } else if (person.checked && i === -1) {
                var personItem = {
                    personName: person.personName
                };
                $scope.personsSelected.push(personItem);
            }
        };
        $scope.delSelectedPersonItem = function (personItem) {
            var f = -1;
            $scope.pageModel.forEach(function (person) {
                if (personItem.personName == person.personName) {
                    person.checked = false
                    $scope.pageModel.checked = false
                }
            })
            $scope.personsSelected.forEach(function (p, i) {
                if (p.personName === personItem.personName) {
                    f = i;
                }
            });
            if (f !== -1) {
                $scope.personsSelected.splice(f, 1);
                // $scope.find();
            }
        };


        //保存通知
        $scope.saveNotice = function (form) {
            var params = {}
            if ($scope.personsSelected.length === 0) {
                alert("请选择人员！");
            } else {
                var personNameList = []
                var personId = []
                $scope.personsSelected.forEach(person => {
                    personNameList.push(person.personName)
                    personId.push(person.personId)
                })
                var str = personNameList.join(',')
                params = {
                    msgId: data.msgId,
                    opType: '2',
                    opContent: '通知了' + str,
                    personId: personId.join(',')

                }
                $http.post("/ovu-pcos/pcos/sceneMessage/edit", params, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        $uibModalInstance.close();
                        msg(resp.msg);
                    } else {
                        alert(resp.error);
                    }
                })


            }
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });

    // 联系本人
    app.controller('noticePersonCtrl', function ($scope, $rootScope, $http, $uibModalInstance, fac, data) {
        $scope.pageModel = [];
        $scope.personsSelected = [];
        $scope.search = {};
        $scope.item = {}
        var personNameList = data.personName.split(',') || []
        var personPhoneList = data.phone.split(',') || [];
        personPhoneList.forEach((phone, index) => {
            personNameList.forEach((name, i) => {
                if (index == i) {
                    $scope.pageModel.push({
                        phone: phone,
                        name: name
                    })
                }
            })
        })

        /**
         * 判断人员是否在已选人员列表中
         */
        function isInArray(arr, value) {
            //debugger;
            var f = -1;
            arr.forEach(function (p, i) {
                if (p.name === value.name) {
                    f = i;
                }
            });
            return f;
        }


        $scope.checkAll = function (data) {
            data.checked = !data.checked;
            data.forEach(function (n) {
                n.checked = data.checked
                var isSelected = false;
                $scope.personsSelected && $scope.personsSelected.forEach(function (person) {
                    if (n.name == person.name) {
                        isSelected = true;
                    }

                })
                //在编辑状态下如果在编辑前没有被选中的才加入
                if (!isSelected) {
                    $scope.personsSelected.push(n);
                }
                if (!n.checked && isSelected) {
                    var i = 0;
                    $scope.personsSelected.forEach(function (v) {
                        i++;
                        if (v.name == n.name) {
                            $scope.personsSelected.splice(i - 1, 1);
                        }
                    })

                }


            });
        };

        $scope.selectPersonItem = function (person, data) {
            //标记是否选择
            person.checked = !person.checked;
            if (data) {
                data.checked = data.every(function (v) {
                    return v.checked;
                });
            }
            //加入选择组
            var i = isInArray($scope.personsSelected, person);
            if (!person.checked && i !== -1) {
                $scope.personsSelected.splice(i, 1);
                $scope.pageModel.checked = false
            } else if (person.checked && i === -1) {
                var personItem = {
                    name: person.name
                };
                $scope.personsSelected.push(personItem);
            }
        };
        /**
         * 删除已选的
         * @param personItem
         */
        $scope.delSelectedPersonItem = function (personItem) {
            var f = -1;
            $scope.pageModel.forEach(function (person) {
                if (personItem.name == person.name) {
                    person.checked = false
                    $scope.pageModel.checked = false
                }
            })
            $scope.personsSelected.forEach(function (p, i) {
                if (p.name === personItem.name) {
                    f = i;
                }
            });
            if (f !== -1) {
                $scope.personsSelected.splice(f, 1);
                // $scope.find();
            }
        };

        /**
         * 确定
         */
        $scope.save = function () {
            var params = {}
            if ($scope.personsSelected.length === 0) {
                alert("请选择人员！");
            } else {
                params = {
                    msgId: data.msgId,
                    opType: '1',
                    opContent: $scope.item.opContent
                }
                $http.post("/ovu-pcos/pcos/sceneMessage/edit", params, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        $uibModalInstance.close();
                        msg(resp.msg);
                    } else {
                        alert(resp.error);
                    }
                })


            }
        };

        /**
         * 取消
         */
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };


    });
    //显示一键处理
    app.controller('dealModalCtrl', function ($scope, $http, $uibModalInstance, $filter, $timeout, fac, param) {
        $scope.item = {
            score: '1'
        }


        //根据任务Id 获取巡查项列表  insItemList
        //        $scope.status=param.status;
        //    var pm={insPointId:param.insPointId}



        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            $uibModalInstance.close($scope.item);
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });

    app.controller('elevatorctrl', function ($scope, $http, $uibModal, $filter, $timeout, fac) {

        var parkNo = '04201110001CYTD';
        $scope.name = 'equipment';
        $scope.pageModel = {};

        $scope.search = {
            parkNo: '04201110001CYTD',
            name: '',
            types: "3",
        };



        // 电梯台账数据
        /* $scope.pageModel0 = {

               data:[

                 {deviceName:'四期白班8高南侧垃圾桶周围有杂物需要清理',cusName:'1号高层楼梯',number:39},
                 {deviceName:'四期白班8高南侧垃圾桶周围有杂物需要清理2',cusName:'1号高层楼梯2',number:40},
                 {deviceName:'四期白班8高南侧垃圾桶周围有杂物需要清理3',cusName:'1号高层楼梯3',number:41}

               ]

         }  */

        $scope.pageModel = {};
        $scope.search0 = {
            mode: 'list-mode',
            useSence: 'all',
            showCnt: true,
            preSetEquipType: 'elevator',
            deptId: '74c6071187dd44d68eac5b7a295f65fd'
        };

        //查询  电梯台账数据
        $scope.find0 = function (pageNo) {
            $.extend($scope.search0, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            http:
                fac.getPageResult('/ovu-pcos/pcos/equipment/queryByPage.do', $scope.search0, function (res) {
                    console.log('res=', res)
                    $scope.pageModel = res;
                    // if (res.code == 0) {
                    //
                    //     $scope.pageModel.totalPage = res.data.pageTotal;
                    //     $scope.pageModel.currentPage = res.data.pageIndex;
                    //     $scope.pageModel.totalRecord=res.data.totalCount
                    // } else {
                    //     alert(res.msg)
                    // }
                })
        }
        $scope.find0(1)


        // 未处理工单
        /* $scope.pageModelycf1 = {
               data:[

                 {orderName:'四期白班8高南侧垃圾桶周围有',ordrrStatus:'已派发',currentNode:'马六敏',beicuiNum:3,time:'2019-02-09'},
                 {orderName:'四期白班8高南侧垃圾桶周围有2',ordrrStatus:'已派发',currentNode:'马六敏',beicuiNum:2,time:'2019-02-'},
                 {orderName:'四期白班8高南侧垃圾桶周围有3',ordrrStatus:'已派发',currentNode:'马六敏',beicuiNum:6,time:'2019-02-11'}
               ]
         }   */

        $scope.search = {
            equipmentTypeCode: 'SBDT',
            types: 3,
            parkNo: '04201110001CYTD'
        };
        //查询未处理工单
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            http:
                fac.getPageResult('/ovu-pcos/pcos/workunitExt/list', $scope.search, function (res) {
                    console.log('res=', res)
                    $scope.pageModel = res;
                    // if (res.code == 0) {
                    //
                    //     $scope.pageModel.totalPage = res.data.pageTotal;
                    //     $scope.pageModel.currentPage = res.data.pageIndex;
                    //     $scope.pageModel.totalRecord=res.data.totalCount
                    // } else {
                    //     alert(res.msg)
                    // }
                })
        }
        $scope.find(1)

        //未处理工单里的 通知上级
        $scope.noticeLeader = function (item) {

            var param = {
                workunitId: item.id,
                parkNo: $scope.search.parkNo
            }
            $http.get('/ovu-pcos/pcos/workunitExt/noticeLeader', {
                params: param
            }).success(function (res) {
                if (res.code == 0) {
                    msg("通知成功！")
                } else {
                    alert("通知失败！")
                }
            })
        }


        //未处理工单里的 派发
        $scope.distributeModal = function (ids, deptId, parkId) {
            var modal = $uibModal.open({
                animation: false,
                size: "",
                templateUrl: 'scenario/ws/myworkunit.distribute.html',
                controller: 'personUnitSelectorCtrl',
                resolve: {
                    data: {
                        deptId: deptId,
                        parkId: parkId
                    }
                }
            });
            modal.result.then(function (data) {
                if (data) {
                    var params = {
                        unitIds: ids,
                        execId: data.execId,
                        assistanceIds: data.assistanceIds,
                        manageId: data.manageId,
                        remark: data.remark
                    };

                    $http.post("/ovu-pcos/pcos/workunit/distributeWorkUnit.do", params, fac.postConfig).success(function (resp) {
                        if (resp.success) {
                            msg("派单成功!");
                            $scope.find(1);
                        } else {
                            alert(resp.error);
                        }
                    })
                }
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };



        //未处理消息
        $scope.pageModel2 = {};
        $scope.search2 = {
            parkNo: '04201110001CYTD',
            equipmentTypeCode: 'SBDT'
        };
        //查询未处理消息
        $scope.find2 = function (pageNo) {

            $.extend($scope.search2, {
                currentPage: pageNo || $scope.pageModel2.currentPage || 1,
                pageSize: $scope.pageModel2.pageSize || 10
            });

            fac.getPageResult('/ovu-pcos/pcos/equipment/bigScreen/queryMessage', $scope.search2, function (res) {
                $scope.pageModel2 = res;
            })
        }
        $scope.find2(1);


        //  未处理消息里的 查看详情
        $scope.showDetail = function (id) {
            console.log(id);

            $http.get(`/ovu-pcos/pcos/equiphouse/daping/detail?parkNo=04201110001CYTD&equipId=${id.id}`).then((res) => {
                console.log(res);

                $uibModal.open({
                    animation: false,
                    templateUrl: '../view/scenario/ws/modal.getEqRoom2.html',
                    size: 'lg',
                    controller: 'getAnFangModalCtrl', //114.321749, 30.470118
                    resolve: {
                        data: {
                            workinfo: {
                                id: '',
                                workunit_name: id.msg,
                                regi_code: '',
                                eqId: id.id

                            },
                            data: {
                                params0: true,
                                personList: res.data.data.personList,
                                longitude: id.longitude_,
                                latitude: id.latitude_,

                            },
                            name: '设备'
                        }
                    }
                });
            });

        }

        //未处理消息
        /*
           $scope.pageModelycf2 = {

                data:[

                  {messOrder:'四期白班8高南侧',createTime:'2019-09-09'},
                  {messOrder:'四期白班8高南侧2',createTime:'2019-09-09'},
                  {messOrder:'四期白班8高南侧3',createTime:'2019-09-09'}

                ]
          }   */

    })

    //会议室使用
    app.controller('meetUseCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $interval, fac) {
        $scope.name = '会议室使用';
        var curTime = new Date();
        $scope.search = {};
        $scope.search.orderDate = $filter('date')(curTime, 'yyyy-MM-dd');
        let meeting_data = {
            "code": 0,
            "message": null,
            "data": [{
                    "roomReserveList": [],
                    "roomName": "1号楼6楼7号会议室",
                    "hasShadow": true
                },
                {
                    "roomReserveList": [],
                    "roomName": "1号楼7楼6号会议室",
                    "hasShadow": true
                },
                {
                    "roomReserveList": [],
                    "roomName": "1号楼8楼3号会议室",
                    "hasShadow": true
                },
                {
                    "roomReserveList": [],
                    "roomName": "1号楼8楼5号会议室",
                    "hasShadow": false
                },
                {
                    "roomReserveList": [],
                    "roomName": "1号楼9楼1号会议室",
                    "hasShadow": true
                },
                {
                    "roomReserveList": [],
                    "roomName": "1号楼9楼2号会议室",
                    "hasShadow": true
                },
            ],
            "success": true
        };

        $scope.meeting_data = meeting_data.data;
        $scope.find = function (date) {
            let params = {
                desDate: date
            }
            $http.get('/ovu-park/enterprise/service/getOneHighReserve', {
                params: params
            }).success((res) => {
                if (res.code == 0) {
                    $scope.meeting_data = res.data;
                } else {
                    window.alert(res.message);
                }
            })
        }
        $scope.find($scope.search.orderDate);
    });

})();
