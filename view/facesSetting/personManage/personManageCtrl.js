(function () {
    var app = angular.module("angularApp");

    app.controller('personManageCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {

        document.title = "OVU-人员管理";

        angular.extend($rootScope, fac.dicts);
        $scope.search = {};
        $scope.moveFlag = false;
        $scope.tags = "";
        $scope.rules = {};
        $scope.pageModel = {};
        $scope.pageModel2 = {};
        $scope.tableTitle = '';
        $scope.types = [];
        //获取员工和访客人员列表
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            $scope.search.parkId = app.park.parkId;
            if ($scope.searchAllowed) {
                $scope.search.allowed = parseInt($scope.searchAllowed);
            }
            if ($scope.search.tag != null) {
                if ($scope.search.tag === 0) {
                    $scope.search.type = 1;
                    fac.getPageResult("/ovu-park/daping/realName/getProfilesList", $scope.search, function (resp) {
                        resp.recordList = resp.list;
                        $scope.pageModel = resp;
                        if($scope.search.tag == undefined){ 
                            $scope.pageModel = [];
                            return;
                        };
                        $scope.pageModel.data = resp.recordList
                        // console.log(resp)
                        $scope.getTypeList();
                    });
                } else {
                    fac.getPageResult("/ovu-park/daping/realName/getPersonList", $scope.search, function (resp) {
                        $scope.pageModel.data = [];
                        $scope.pageModel = resp;
                        console.log('$scope.search.tag :',$scope.search.tag );
                        $scope.pageModel.data = resp.recordList
                        // console.log(resp)
                    });
                }
            }
            if ($scope.search.ruleIds != null) {
                fac.getPageResult("/ovu-park/daping/nonRealName/queryPersonAnalysisRecordList", $scope.search, function (resp) {
                    $scope.pageModel = resp;
                    // console.log(resp)
                });
            }
        };
      
        app.modulePromiss.then(function () {
            fac.initPage($scope, function() {
                $scope.find(1);
            }, function() {
                $scope.find(1);
            });
        });

        $scope.filterType = function(e, id) {
            e.preventDefault();
            $scope.search.ruleIds = id;
            $scope.find(1);
        };

        $scope.getTypeList = function() {
            $http.post('/ovu-park/daping/personAnalysisRules/queryRulesList',null,{ params: {
                parkId: app.park.parkId
            }}).success(function (res) {
                // console.log(res)
                $scope.types = res.data;
            })
        };
        $scope.getTypeList();

        $scope.classifyLsit = [
            {
                tag: 0,
                name: '员工用户'
            },
            {
                tag: 1,
                name: '访客用户'
            },
        ]
        $scope.getRealList = function (tag, title) {
            $scope.tags = tag;
            console.log('tag, title :', tag, title);
            $scope.search = {};
            $scope.moveFlag = false
            $scope.search.tag = tag
            $scope.tableTitle = title
            $scope.find(1)
        }
        //初始选择员工列表
        $scope.getRealList(0, '员工用户')

        $scope.getUnrealList = function (ruleIds, title) {
            $scope.tags = ruleIds;
            console.log('ruleIds, title :', ruleIds, title);
            $scope.search = {};
            // $scope.getUnrealName(1, ruleIds)
            $scope.search.ruleIds = ruleIds
            $scope.tableTitle = title
            $scope.moveFlag = true
            $scope.find(1)
        }
        // $scope.searchInfo = function () {
        //     console.log($scope.search)
        // }

        $scope.move = function (x, item) {
            $scope.moveObj = {}
            $scope.moveObj.ids = item.id
            $scope.moveObj.ruleIds = x.id
            $scope.moveObj.parkId = app.park.parkId;
            window.confirm('确定要移动到' + x.name + '中吗',
                function () {
                    //请求移动接口 成功的回调中重新请求数据
                    $http.post("/ovu-park/daping/nonRealName/updateRuleIdsByArtificial", $scope.moveObj, fac.postConfig).success(function (resp) {
                        // console.log('==================================')
                        // console.log(resp)
                        if (resp.code == 0) {
                            layer.msg(resp.msg, { icon: 1, time: 500 });
                            // $scope.find();
                            $scope.getUnrealList(item.ruleIds)
                        } else {
                            alert(resp.msg);
                        }
                    })

                }
            );

        }
        //删除
        // $scope.del = function (id) {
        //     console.log(id)
        //     window.confirm('单击"确定"删除该数据。单击"取消"停止',
        //         function () {
        //             //请求删除接口 成功的回调中重新请求数据
        //             // $http.post("/ovu-pcos/pcos/govcloud/news/delete.do", {
        //             //     "newsIds": ids.join()
        //             // }, fac.postConfig).success(function (resp) {
        //             //     if (resp.success) {
        //             //         $scope.find();
        //             //     } else {
        //             //         alert(resp.error);
        //             //     }
        //             // })
        //             layer.msg('删除成功', { icon: 1, time: 500 });
        //         }
        //     );
        // }

        $scope.showBigImg = function (url) {
            var img = "<img  src=" + url + " style='width:300px;height:300px' />"
            layui.use('layer', function () {
                layer = layui.layer
                layer.open({
                    type: 1,
                    title: '照片',
                    content: img //这里content是一个普通的String
                });
            })
        }
        $scope.addPerson = function (type) {
            var modal = $uibModal.open({
                animation: false,
                size: 'max',
                templateUrl: '/view/facesSetting/personManage/modal.addPerson.html',
                controller: 'modal.addPersonCtrl',
                // resolve: { data: function () { return {}; } }    //点击查看详情 传递人员的Id
                resolve: { data: {} }
            });
            modal.result.then(function (data) {
                // console.log(data)
            });
        };

        $scope.getDetail = function (item) {
            var modal = $uibModal.open({
                animation: false,
                size: 'max',
                templateUrl: '/view/facesSetting/StrangerMamage/modal.strangerPath.html',
                controller: 'modal.strangerPathCtrl',
                resolve: { data: Object.assign(item, { tag: $scope.search.tag }) }
            });
            modal.result.then(function (data) {
                // console.log(data)
            })
        }

    })

    app.controller('modal.strangerPathCtrl', function ($scope, $http, $uibModalInstance, $filter, $uibModal, fac, data) {
        var day2 = new Date();
        day2.setTime(day2.getTime());
        var s2 = day2.getFullYear()+"-" + ((day2.getMonth()+1)<10?'0'+(day2.getMonth()+1):(day2.getMonth()+1)) + "-" + (day2.getDate()<10 ?  '0'+day2.getDate() : day2.getDate())+" "+(day2.getHours()<10 ?  '0'+day2.getHours() : day2.getHours())+":"+(day2.getMinutes()<10 ?  '0'+day2.getMinutes() : day2.getMinutes())+":"+(day2.getSeconds()<10 ?  '0'+day2.getSeconds() : day2.getSeconds());
        var $ctrl = this;

        $scope.search = {};
        $scope.pageModel = {};
        $scope.search.profileId = data.profileId
        $scope.detailFlag = false
        $ctrl.$onInit = function () {
            // console.log(data)
            $scope.initData = data
            $scope.find(1)
            $scope.itemList = []
        };
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                // pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            $scope.search.parkId = app.park.parkId;
            // if ($scope.searchAllowed) {
            //     $scope.search.allowed = parseInt($scope.searchAllowed);
            // }
            if (!$scope.search.startTime) {
                $scope.search.startTime = $filter('date')(Date.now(), 'yyyy-MM') + '-01 00:00:00';
                $scope.search.endTime = s2;
            }
            fac.getPageResult("/ovu-park/daping/realName/getDateForProfilesDetail", $scope.search, function (resp) {
                $scope.pageModel.data = resp.map(value => {
                    return {
                        date: value,
                        paths: []
                    };
                });
            });
        };

        $scope.getPath = function(e, item, index) {
            e.preventDefault();
            $http.post('/ovu-park/daping/realName/getProfilesDetailGroupByDate', null, {
                params: {
                    date: item.date,
                    profileId: data.profileId,
                    parkId: app.park.parkId
                }
            }).success(res => {
                $scope.itemList = res.data;
                $scope.pageModel.data[index].paths = res.data;
            });
        };

        $scope.charge = function (item) {
            item.checked = !item.checked
            // console.log(item.checked)
            // console.log(item)
            $scope.itemList = []
            $scope.pageModel.recordList.forEach((item) => {
                if (item.checked) {
                    $scope.itemList.push(item)
                }
            })
            // console.log($scope.itemList)
        }

        $scope.showDetail = function (item) {
            item.detailFlag = !item.detailFlag
        }

        $scope.drawPath = function (paths) {
            $scope.$broadcast('sendChild', paths);
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $('.collapse').collapse()
    })
    // app.controller('modal.addPersonCtrl', function ($scope, $http, $uibModalInstance, $filter, $uibModal, fac, data) {
    //     var $ctrl = this;

    //     $ctrl.$onInit = function () {
    //         console.log(data)

    //     }
    //     $scope.cancel = function () {
    //         $uibModalInstance.dismiss('cancel');
    //     };
    // })
})()