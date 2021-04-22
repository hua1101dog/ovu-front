(function(angular, document, win) {
    document.title = "报装巡检任务工单";

    var app = angular.module('angularApp');

    app.controller('inspCheckWorkUnitCtrl', ['$scope', '$rootScope', '$http', '$uibModal', 'fac', function($scope, $rootScope, $http, $uibModal, fac) {
        $scope.search = {};
        // $scope.search.isGroup = fac.isGroupVersion();
		document.title = "报装巡检任务工单";
        $scope.pageModel = {};

        $scope.showWorkUnitDetail = $rootScope.showWorkUnitDetail;

        $scope.unitStatusDict = $rootScope.unitStatusDict;

        // 会话验证 判断是否需要登录
        app.modulePromiss.then(function() {
            /*if (app.park) {
                $scope.parkId = app.park.ID;
                $scope.search.parkId = app.park.ID;
            }
            $scope.search = {
                unit_status: 5
            };
            $scope.search.isGroup = fac.isGroupVersion();

            fac.initPage($scope, function() {
                // console.log($scope);
                $scope.find();
            }, function() {
                $scope.find();
            });*/
           //集团版、项目版合并，监控部门变化
            $scope.$watch('dept', function (deptO, oldValue) {
            	if(!$scope.search){
            		$scope.search = {};
            	}
            	$scope.search = {
                	unit_status: 5
            	};
            	var deptCopy = angular.copy(deptO);
                if(deptCopy.id != $scope.search.deptId){
                	$scope.search.deptId = deptCopy.id;
                	$scope.search.parkId = deptCopy.parkId;
                }
                if($scope.search.deptId){
                	$scope.find();
                }else{
                	//清空表格
                	$scope.pageModel.totalCount = 0;
                	$scope.pageModel.totalPage1;
                	$scope.pageModel.data = [];
                }
            },true)
        });
        // 搜索
        $scope.find = function(searchObj) {
        	if(!$scope.search.deptId){
        		alert("请选择部门！");
        		return;
        	}
            var search = {};
            search.pageSize = $scope.search.pageSize || 10;
            search.pageIndex = $scope.search.pageIndex || 0;
        //    search.parkId = $scope.search.parkId;
            search.deptId = $scope.search.deptId;
            search.decorationType = 2;
            search.unitStatus = $scope.search.unit_status;
            
            if (searchObj) {
                search.workUnitName = searchObj.workunit_name;
                search.startTime = searchObj.start_time&&searchObj.start_time+" 00:00:00";
                search.endTime = searchObj.end_time&&searchObj.end_time+" 23:59:59";
               
                
            }
            if(search.unitStatus=="9"){
            	search.unitStatus =null;
            }
            $http.post('/ovu-pcos/decoration/decorationApply/getOrderList.do', search, fac.postConfig).then(function(res) {

                $scope.pageModel = res.data;
				if(!$scope.search.deptId){
					$scope.pageModel.data = [];
				}
                $scope.pageModel.currentPage = $scope.pageModel.pageIndex + 1;
                $scope.pageModel.numPerPage = $scope.pageModel.pageSize;

                if ($scope.search.operateType == 11) {
                    $scope.search.findWork = true;
                } else {
                    $scope.search.findWork = false;
                }
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
            //    templateUrl: '../common/modal.select.personUnit.html',
            	templateUrl:'workunit/myworkunit.distribute.html',
                controller: 'personUnitSelectorCtrl',
                resolve: {
                    data: {
                        parkId: $scope.search.parkId ? $scope.search.parkId : '',
                        deptId: $scope.search.deptId ? $scope.search.deptId : ''
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
            confirm("确认接收工单：" + item.workUnitName + " 吗?", function() {
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
                WORKUNIT_NAME: workunit.workUnitName,
                EXEC_DATE: workunit.execDate,
                PERSON_ID: $scope.search.userId
            }

            /*
             目前只能管理人评价了。
             if($scope.search.userId == workunit.SOURCE_PERSON) {
             //发起人评论
             evaluate.EVALUATE_TYPE = "1";
             }*/

            if ($rootScope.user.personId == workunit.managePersonId) {
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
                    starHalf: '/res/img/star-half.png',
                    starOff: '/res/img/star-off.png',
                    starOn: '/res/img/star-on.png',
                    score: evaluate.EVALUATE_SCORE,
                    click: function(score, evt) { //点击事件更改score值
                        evaluate.EVALUATE_SCORE = score;
                    }
                });
            });
        };

    }]);

})(angular, document, window);