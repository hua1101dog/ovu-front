(function () {

    var app = angular.module("angularApp");
    app.service('manageService', manageService);
    function manageService() {
        this.del = function (item, list) {
            list.splice(list.indexOf(item), 1);
        }

        this.batchDel = function (list) {
            var i = list.length;
            while (i--) {
                var obj = list[i];
                obj.checked && list.splice(list.indexOf(obj), 1);
            }
        }
    }

    //项目架构ctl
    app.controller('ruleController', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-规则设置";
        angular.extend($rootScope, fac.dicts);
        $rootScope.houseIdTypes = {};
        $scope.pageModel = {};
        $scope.search = {};
        //$scope.isShow = false;
        $scope.beListeds = [
            { value: 1, text: "是" },
            { value: 2, text: "否" }
        ];
        // 点击编辑/保存按钮 
        $scope.strEdit = function (item1) {
            console.log(item1)
            item1.showDetail = false;
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/facesSetting/ruleSetting/modal.addRule.html',
                controller: 'modal.addRuleCtrl',
                // resolve: { data: function () { return {}; } }
                resolve: { data: item1 }
            })
            modal.result.then(function () {
                $scope.find(1)
            }, function () { //模态框关闭事件

            })

        }



        //删除
        $scope.del = function (item) {
            confirm("确认删除项目吗？", function () {
                $http.get("/ovu-park/daping/personAnalysisRules/deleteRule?id=" + item.id + `&parkId=${app.park.parkId}`).success(function (resp) {
                    if (resp.code === 0) {
                        $scope.find();
                        msg(resp.data);
                    } else {
                        alert(resp.msg);
                    }
                })
            });

        }

        // 删除按钮
        //$scope.strDel = function(item){

        // manageService.del(item,$scope.pageModel.data);

        //}
        // 新增按钮
        $scope.addStr = function () {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/facesSetting/ruleSetting/modal.addRule.html',
                controller: 'modal.addRuleCtrl',
                // resolve: { data: function () { return {}; } }
                resolve: { data: { showDetail: false } }
            })
            modal.result.then(function (result) {
                $scope.find(1)
            }, function () { //模态框关闭事件

            })

        }
        //查看详情
        $scope.getRuleDetail = function (item) {
            item.showDetail = true
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/facesSetting/ruleSetting/modal.addRule.html',
                controller: 'modal.addRuleCtrl',
                // resolve: { data: function () { return {}; } }
                resolve: { data: item }
            })
            modal.result.then(function () {

            }, function () { //模态框关闭事件

            })

        }

        // 查询
        $scope.find = function (pageNo) {
            var pag = {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            };
            delete $scope.search["totalCount"]
            delete $scope.search["currentPage"]
            $.extend($scope.search, pag);
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.parkId = app.park.parkId;
            // $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            fac.getPageResult("/ovu-park/daping/personAnalysisRules/getRulesListByPage", $scope.search, function (data) {
                console.log('data=', data)
                if (data != undefined) {
                    data.data.forEach(function (item, index) {
                        if (item.id == 1) {
                            item.unDel = true
                        }
                    })
                }
                $scope.pageModel = data;
                if ($scope.pageModel.data.length > 0) {
                    //  layer.msg('success', { icon: 1, time: 1000 });
                } else {
                    layer.msg('暂无记录', { icon: 2, time: 1000 });
                }
            });
        };
        app.modulePromiss.then(function () {
            fac.initPage($scope, function() {
                $scope.find(1);
            }, function() {
                $scope.find(1);
            });
        });


    });
    //angularJs 复选框必须勾选一个
    app.controller('modal.addRuleCtrl', function ($scope, $http, $uibModalInstance, $filter, $uibModal, fac, data, manageService) {
        
        var $ctrl = this;
        console.log(data)
        $scope.submit = data
        $scope.timeRules = []
        if (data.id > 0) {
            $scope.timeRules = data.timeRules
            $scope.ruleTitle = '编辑规则'
        } else {
            $scope.timeRules = []
            $scope.ruleTitle = '新增规则'
        }
        $scope.addTimeRule = function (tag) {
            $scope.timeRules.push({ tag: tag })
        }

        $scope.delTimeRule = function (item) {
            console.log($scope.timeRules)
            manageService.del(item, $scope.timeRules);
        }

        $scope.submitRule = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                layer.msg("请完成必填项!", { icon: 0, time: 500 });
                return;
            }
            if ($scope.timeRules.length == 0) {
                layer.msg("请添加时间规则!", { icon: 0, time: 500 });
                return;
            }
            if ($scope.timeRules.some(data => {   
                return !data.monday &&
                  !data.tuesday &&
                  !data.wednesday &&
                  !data.thursday &&
                  !data.friday &&
                  !data.saturday &&
                  !data.sunday
            })) {
                layer.msg("工作日必须选择!", { icon: 0, time: 2000 });
                return
            }
            $scope.submit.personListStr = JSON.stringify($scope.timeRules)
            delete $scope.submit.createTime;
            delete $scope.submit.updateTime;
            $scope.submit.parkId = app.park.parkId;
            $http.post('/ovu-park/daping/personAnalysisRules/editRule', $scope.submit, fac.postConfig).success(function (resp) {
                console.log(resp)
                if (resp.code === 0) {
                    $uibModalInstance.close('关闭');
                }
            })
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })
})()
