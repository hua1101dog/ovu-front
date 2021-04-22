(function() {
    var app = angular.module("angularApp");
    app.controller('inspectReportCtrl', ['$scope', '$rootScope', '$uibModal', '$http', '$filter', 'fac', '$log', '$window',function ($scope, $rootScope, $uibModal, $http, $filter, fac, $log, $window) {
        document.title = "巡查调度报告";
        $scope.pageModel = {};
        $scope.search = {
            isOpen:1,
            time: $filter('date')(new Date(), 'yyyy-MM-dd'),
            status: ''
        };
        app.modulePromiss.then(function () {
            // fac.initPage($scope, function () {
            //     $scope.find();
            // });
            $scope.$watch('dept.id', function (deptId, oldValue) {
                // if(!$scope.node.parkId){
                //     alert('请选择叶子节点');
                //     return
                // }
                if (deptId) {
                    $scope.search.deptId=deptId
                    $scope.find(1);
                }
            })
        })
        // 查询报告列表
        $scope.find = function (pageNo, status) {
           
            if(status == 1) {
                $scope.search.status = 1;
            } else if(status == 0) {
                $scope.search.status = 0;
            } else {
                $scope.search.status = '';
            }
            $.extend($scope.search, {currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10, deptId: $scope.dept.deptId});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            fac.getPageResult("/ovu-pcos/pcos/inspection/inscommandresult/list.do", $scope.search, function(data) {
                $scope.pageModel = data;
            })
        };

        // 导出文件
        $scope.exportFile = function () {
            if(!$scope.search.time){
                alert('请选择调度时间');
                return
             }
            $scope.search.pagesize = 2;
            window.location.href="/ovu-pcos/pcos/inspection/export/inscommand.do?pagesize="+$scope.search.pageSize+"&status="+$scope.search.status+"&time="+$scope.search.time;
        }

        // 处理反馈
        $scope.processFeedback = function(id, feedback) {
            var proMsg = {
                id: id,
                feedback: feedback
            }
            var modalInstance = $uibModal.open({
                animation: false,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                size: 'lg',
                templateUrl: '/view/inspection/report/modal.inspectReport.html',
                controller: 'modalInspectCtrl',
                resolve: {
                    task: function () {
                        return proMsg;
                    } 
                }
            });
            // 弹出框确认和取消后的回调函数
            modalInstance.result.then(function () {
                $scope.find();
            }, function () {
              
                $scope.find();
            });
        }
    }])

    // 处理反馈弹出框的控制器
    app.controller("modalInspectCtrl", function($scope, $rootScope, $uibModal, $http, $filter, fac, $log, $uibModalInstance, task) {
        $scope.message = task;
        $scope.alertMessage = false;
        $scope.save = function() {
            // 保存处理内容
            if($scope.message.feedback) {
                $http.get("/ovu-pcos/pcos/inspection/inscommandresult/update?id="+$scope.message.id+"&feedback="+ $scope.message.feedback).success(function(data) {
                    if(data.code == 0) {
                      msg(data.msg)
                    }
                })
                $uibModalInstance.close($scope.message);
            } 
            $scope.alertMessage = true;
            
        }
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }
    })
})()