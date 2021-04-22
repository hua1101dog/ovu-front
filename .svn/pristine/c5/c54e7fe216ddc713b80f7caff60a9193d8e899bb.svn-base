(function () {
    var app = angular.module("angularApp");

    app.controller('strangermamageCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {

        document.title = "OVU-陌生人管理";

        angular.extend($rootScope, fac.dicts);

        //分页执行的方法
        $scope.search = {};
        $scope.pageModel = {};
        //分页查询的方法
        $scope.find = function (pageNo) {
            // $scope.search.companyId = $scope.id;
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            $scope.search.parkId = app.park.parkId;
            // if ($scope.search.type == 2) {
            //     fac.getPageResult("/ovu-park/daping/realName/getProfilesList", $scope.search, function (data) {
            //         $scope.pageModel = data;
            //         console.log(data)
            //     });
            // } else {
            fac.getPageResult("/ovu-park/daping/nonRealName/queryPersonAnalysisRecordList", $scope.search, function (data) {
                $scope.pageModel = data;
                console.log(data)
            });
            // }
        }
        // $scope.getStrangerList = function () {
        //     $scope.search = {};
        //     $scope.search.type = 2
        $scope.find(1)

        app.modulePromiss.then(function () {
            fac.initPage($scope, function() {
                $scope.find(1);
            }, function() {
                $scope.find(1);
            });
        });
        // }
        // $scope.getStrangerList()

        //查询的方法;
        $scope.query = function () {
            // $scope.search.type = null
            // console.log($scope.search)
            $scope.find(1);
            // fac.initPage($scope, function () {
            //     $scope.find(1);
            // })
        }

        //选中一个;
        $scope.selectOneCheck = function (x, item) {
            $scope.moveObj = {};
            $scope.moveObj.ids = item.id || item.profileId;
            $scope.moveObj.ruleIds = x.id;
            $scope.moveObj.parkId = app.park.parkId;
            // console.log($scope.moveObj)
            window.confirm('确定要移动到' + x.name + '中吗',
                function () {
                    //请求移动接口 成功的回调中重新请求数据
                    $http.post("/ovu-park/daping/nonRealName/updateRuleIdsByArtificial", $scope.moveObj, fac.postConfig).success(function (resp) {
                        // console.log('==================================')
                        // console.log(resp)
                        if (resp.code === 0) {
                            layer.msg(resp.msg, { icon: 1, time: 500 });
                            $scope.find(1);
                            // $scope.getUnrealList(item.ruleIds)
                        } else {
                            alert(resp.error);
                        }
                    })

                }
            );

        }

        //批量选中;
        $scope.selectAllCheck = function (x) {
            var personArray = [];
            $scope.pageModel.list.forEach(item => {
                if (item.checked == true) {
                    personArray.push(item.id || item.profileId);
                }
            });
            // console.log(personArray)
            // console.log(x.id)
            if (personArray.length == 0) {
                alert("请选择前面复选框中选择需要移动的人群");
            } else {
                var idString = personArray.join();
                // console.log(idString)
                $scope.moveAllObj = {};
                $scope.moveAllObj.ids = idString;
                $scope.moveAllObj.ruleIds = x.id;
                $scope.moveAllObj.parkId = app.park.parkId;
                window.confirm('确定要移动到' + x.name + '中吗',
                    function () {
                        //请求移动接口 成功的回调中重新请求数据
                        $http.post("/ovu-park/daping/nonRealName/updateRuleIdsByArtificial", $scope.moveAllObj, fac.postConfig).success(function (resp) {
                            // console.log(resp)
                            if (resp.code === 0) {
                                layer.msg(resp.msg, { icon: 1, time: 500 });
                                $scope.find(1);
                                $scope.all_Charge = false
                                // $scope.getUnrealList(item.ruleIds)
                            } else {
                                alert(resp.error);
                            }
                        })
                    }
                );
            }

        }
        //疑似人群
        $scope.getRulesList = function () {
            $http.post('/ovu-park/daping/personAnalysisRules/queryRulesList',null,{ params: {
                parkId: app.park.parkId
            }}).success(function (res) {
                $scope.rulesList = res;
            })
        };
        $scope.getRulesList();
        //模拟下拉菜单的值
        $scope.SnapPosition = [
            { id: 1, name: "一高" },
            { id: 2, name: "二高" },
            { id: 3, name: "三高" },
            { id: 4, name: "四高" },
            { id: 5, name: "五高" },
            { id: 6, name: "六高" },
            { id: 7, name: "七高" },
            { id: 8, name: "八高" }
        ];



        //单选按钮 $scope.pageModel.pageSize
        // $scope.checkedList = []
        $scope.charge = function (item) {
            item.checked = !item.checked
            $scope.checkedList = []
            $scope.pageModel.list.forEach((item) => {
                if (item.checked) {
                    $scope.checkedList.push(item.id)
                }
                if ($scope.checkedList.length == $scope.pageModel.pageSize) {
                    $scope.all_Charge = true
                } else {
                    $scope.all_Charge = false
                }
            })
        }

        $scope.all_Charge = false

        //全选按钮
        $scope.allCharge = function () {
            $scope.all_Charge = !$scope.all_Charge
            $scope.pageModel.list.forEach(item => {
                item.checked = $scope.all_Charge
            });
        }

        $scope.getStrangerDetail = function (item) {
            var modal = $uibModal.open({
                animation: false,
                size: 'max',
                templateUrl: '/view/facesSetting/StrangerMamage/modal.strangerPath.html',
                controller: 'modal.strangerPathCtrl',
                resolve: { data: item }
            })
            modal.result.then(function (data) {
                // console.log(data)
            })
        }

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
    })

    app.controller('modal.strangerPathCtrl', function ($scope, $http, $uibModalInstance, $filter, $uibModal, fac, data) {
        var day2 = new Date();
        day2.setTime(day2.getTime());
        var s2 = day2.getFullYear()+"-" + ((day2.getMonth()+1)<10?'0'+(day2.getMonth()+1):(day2.getMonth()+1)) + "-" + (day2.getDate()<10 ?  '0'+day2.getDate() : day2.getDate())+" "+(day2.getHours()<10 ?  '0'+day2.getHours() : day2.getHours())+":"+(day2.getMinutes()<10 ?  '0'+day2.getMinutes() : day2.getMinutes())+":"+(day2.getSeconds()<10 ?  '0'+day2.getSeconds() : day2.getSeconds());
        var $ctrl = this;
        console.log('data :', data);
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
            console.log('$scope.search :', $scope.search);
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
})()