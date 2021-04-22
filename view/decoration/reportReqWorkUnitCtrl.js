(function(angular, document, win) {
    // deprecated 不需要这个界面了
    document.title = "报装申请工单";

    var app = angular.module('angularApp');

    app.controller('reportReqWorkUnitCtrl', ['$scope', '$rootScope', '$http', '$uibModal', 'fac', function($scope, $rootScope, $http, $uibModal, fac) {
		document.title = "报装申请工单";

        $scope.showWorkUnitDetail = $rootScope.showWorkUnitDetail;

        // $scope.search = {};
        // $scope.search.isGroup = fac.isGroupVersion();

        $scope.pageModel = {};

        $scope.unitStatusDict = $rootScope.unitStatusDict;

        // 会话验证 判断是否需要登录
        app.modulePromiss.then(function() {
            if (app.park) {
                $scope.parkId = app.park.ID;
            }
            $scope.search = {
                workUnitStatus: 5
            };
            $scope.search.isGroup = fac.isGroupVersion();

            fac.initPage($scope, function() {
                $scope.find();
            }, function() {
                $scope.find();
            });


        });

        // 搜索
        $scope.find = function(searchobj) {
            var search = {};
            search.pageSize = $scope.search.pageSize || 10;
            search.pageIndex = $scope.search.pageIndex || 0;
            search.park_id = $scope.search.parkId;
            search.decoration_type = 1; //报装申请 1
            search.unit_status = $scope.search.workUnitStatus;
            if (searchobj) {
                search.workunit_name = searchobj.workUnitName;
                search.start_time = searchobj.start_time;
                search.end_time = searchobj.end_time;
                search.unit_status = searchobj.workUnitStatus;
            }
            $http.post('/ovu-pcos/decoration/decorationApply/getOrderList.do', search, fac.postConfig).then(function(res) {

                var pageModel = res.data;
                pageModel.currentPage = pageModel.pageIndex + 1;
                pageModel.numPerPage = pageModel.pageSize;
                $scope.pageModel = pageModel;

            });
        };
        // $scope.find();

        $scope.refresh = $scope.find;

        // 选择每页（？）多少条数据
        $scope.numSelect = function($event) {
            $scope.search.pageSize = $event.nowSelected;
            $scope.search.pageIndex = 0;
            $scope.find();
        };

        // 页码改变
        $scope.pageChanged = function(e) {
            if (e.currentPage) {
                $scope.search.pageIndex = e.currentPage - 1;
                $scope.find();
            }
        };

        // 派发
        $scope.distributeAll = function() {
            var ids = $scope.pageModel.list.reduce(function(ret, n) {
                n.checked && ret.push(n.ID);
                return ret
            }, []);
            ids.length && $scope.distributeModal(ids.join());
        };

        $scope.distributeModal = function(ids) {
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: '../common/modal.select.personUnit.html',
                controller: 'personUnitSelectorCtrl',
                resolve: {
                    data: {
                        parkId: $scope.search.parkId ? $scope.search.parkId : ''
                    }
                }
            });
            modal.result.then(function(data) {
                if (data) {
                    var params = {
                        unitIds: ids,
                        execId: data.execId,
                        assistanceIds: data.assistanceIds,
                        manageId: data.manageId,
                        remark: data.remark
                    };
                    $http.get("/ovu-pcos/pcos/workunit/distributeWorkUnit.do", {
                        params: params
                    }).success(function(resp) {
                        if (resp.success) {
                            msg("派单成功!");
                            $scope.find();
                        } else {
                            alert(resp.error);
                        }
                    })
                }
            }, function() {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        // 接单
        $scope.acceptWork = function(item) {
            confirm("确认接收工单：" + item.workunit_NAME + " 吗?", function() {
                $http.post("/ovu-pcos/pcos/workunit/acceptWork.do", {
                    "id": item.id
                }, fac.postConfig).success(function(resp) {
                    if (resp.success) {
                        $scope.find();
                    } else {
                        alert(resp.error);
                    }
                });
            });
        };

        // 执行
        $scope.showExecModal = function(workunit_id) {
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: '../view/workunit/modal.workunitExec.html',
                controller: 'workUnitExecModalCtrl',
                resolve: {
                    workunit: function() {
                        return {
                            ID: workunit_id
                        }
                    }
                }
            });
            modal.result.then(function() {
                $scope.find();
            }, function() {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        // 评价
        $scope.evaluateModal = function(workunit) {
            // debugger;
            var evaluate = {
                WORKUNIT_ID: workunit.id,
                WORKUNIT_NAME: workunit.workunit_NAME,
                EXEC_DATE: workunit.exec_DATE,
                // EXEC_DATE: workunit.EXEC_DATE,
                PERSON_ID: $scope.search.userId
            }

            /*
             目前只能管理人评价了。
             if($scope.search.userId == workunit.SOURCE_PERSON) {
             //发起人评论
             evaluate.EVALUATE_TYPE = "1";
             }*/

            if ($rootScope.user.personId == workunit.manage_PERSON_ID) {
                //管理人评论
                evaluate.EVALUATE_TYPE = "2";
            } else {
                alert("评论类型无法判断,有错误!");
                return;
            }
            var modal = $uibModal.open({
                animation: false,
                size: "",
                templateUrl: '../view/workunit/modal.workunitEvaluate.html',
                controller: 'workunitEvaluateCtrl',
                resolve: {
                    evaluate: function() {
                        return evaluate
                    }
                }
            });
            modal.result.then(function() {
                $scope.find();
            }, function() {
                console.info('Modal dismissed at: ' + new Date());
            });
            modal.rendered.then(function() {
                $("#star").raty({
                    number: 5,
                    readOnly: false,
                    starHalf: '/ovu-pcos/res/img/star-half.png',
                    starOff: '/ovu-pcos/res/img/star-off.png',
                    starOn: '/ovu-pcos/res/img/star-on.png',
                    score: evaluate.EVALUATE_SCORE,
                    click: function(score, evt) { //点击事件更改score值
                        evaluate.EVALUATE_SCORE = score;
                    }
                });
            });
        };
    }]);

})(angular, document, window);