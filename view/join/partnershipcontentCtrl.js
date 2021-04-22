(function () {
    "use strict";
    var app = angular.module("angularApp");
    //var parkId;
    var deptId;
    //入伙内容管理ctrl
    app.controller("partnershipcontentCtrl", function ($scope, $rootScope, $uibModal, $http, $state, $filter, fac, contentService) {
        document.title = "入伙内容管理";
        $scope.pageModel = {};
        $scope.search = {};
        //$scope.search.status = 0;
        app.modulePromiss.then(function () {
            /*$scope.$watch('park', function (newValue, oldValue) {
                if (newValue && newValue.id) {
                    $scope.search.parkId = newValue.id;
                    //$scope.search.PARK_NAME = newValue.PARK_NAME;
                    //parkId 存起来
                    parkId = $scope.search.parkId;
                    $scope.find();
                } else {
                    alert("请先选定一个项目");
                }
            })*/
            //集团版、项目版合并，监控部门变化
            $scope.$watch('dept', function (dept, oldValue) {
            	if(!$scope.search){
            		$scope.search = {};
            	}
                if(dept.id != $scope.search.deptId){
                	$scope.search.deptId = dept.id;
                	deptId = dept.id;
                }
                if($scope.search.deptId){
                	$scope.find();
                }else{
                	$scope.pageModel.data = [];
                	$scope.pageModel.totalCount = 0;
                	$scope.pageModel.totalPage = 1;
                }
                /*else{
                	alert("请先选定一个部门");
                }*/
            },true)
        });

        $scope.msg = [
            [0, '待审核'],
            [1, '已通过'],
            [2, '已拒绝']
        ];


        //批量通过
        $scope.passAll = function () {
            var joinIds = $scope.pageModel.list.reduce(function (ret, n) {
                n.checked && ret.push(n.joinId);
                return ret
            }, []);
            if (joinIds.length == 0) {
                alert("请选择要审核的业主！");
                return;
            }
            dodel(joinIds.join());
        }
        //单个审批
        // $scope.del = function (item) {
        //     dodel(item.joinId);
        // }
        function dodel(joinIds) {
            confirm("确认通过审核吗?", function () {
                contentService.passGuide({ joinIds: joinIds, status: 1 }).then(function (result) {
                    if (result.data.success) {
                        $scope.find();
                    } else {
                        alert('审核失败');
                    }
                })
            })
        };
        //批量拒绝
        $scope.refuseAll = function () {
            var joinIds = $scope.pageModel.list.reduce(function (ret, n) {
                n.checked && ret.push(n.joinId);
                return ret
            }, []);
            if (joinIds.length == 0) {
                alert("请选择要审核的业主！");
                return;
            }
            refuse(joinIds.join());
        }
        function refuse(joinIds) {
            confirm("确认拒绝审核吗?", function () {
                contentService.passGuide({ joinIds: joinIds, status: 2 }).then(function (result) {
                    if (result.data.success) {
                        $scope.find();
                    } else {
                        alert('审核失败');
                    }
                })
            })
        };

        $scope.find = function (pageNo) {
			if(!$scope.search.deptId){
				alert("请选择部门");
				return;
			}
            $.extend($scope.search, { currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;

            contentService.getContentGuide($scope.search).then(function (result) {
                $scope.pageModel = result;
                //console.log($scope.search.status);
                //控制批量显示按钮
                if($scope.search.status == 0){
                    $scope.showBtn = true;
                }else{
                    $scope.showBtn = false;
                }

            })

        };


        //审核
        $scope.showModal = function (item) {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/join/partnershipcontent/modal.partnershipcheck.html',
                controller: 'modalpartnershipcheckCtrl',
                //resolve: { park: function(){ return copy; }}
                resolve: { item: item }
            });
            modal.result.then(function () {
                $scope.find();
            });
            modal.rendered.then(function () {
                console.log("Modal rendered");
            });
            modal.opened.then(function () {
                console.log("Modal opened");
            });
        };

        //查看详情
        $scope.checkModal = function (item) {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/join/partnershipcontent/modal.partnershipdetail.html',
                controller: 'editpartnershipdetailCtrl',
                //resolve: { park: function(){ return copy; }}
                resolve: { item: item }
            });
            modal.result.then(function () {
                $scope.find();
            });
            modal.rendered.then(function () {
                console.log("Modal rendered");
            });
            modal.opened.then(function () {
                console.log("Modal opened");
            });
        }

    });

    //入伙审核
    app.controller("modalpartnershipcheckCtrl", function ($scope, $http, $uibModal, $uibModalInstance, $filter, fac, item, contentService) {
        $scope.title = '入伙审核';
        $scope.item = item;

        var info = {
            ownerId: item.residentName,
            deptId: item.deptId
            //parkId: item.parkId
        }
        //获取业主亲属信息数据
        // contentService.contentGuide(info).then(function(res){
        //     if(res.data.success){

        //     }
        // })

        $scope.save = function (form, item) {
            console.log($scope.status);
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            if ($scope.status == undefined) {
                alert('请选择通过或拒绝!');
            } else {
                var data = {
                    joinIds: item.joinId,
                    status: $scope.status,
                    remark: $scope.remark
                }
                //通过或拒绝接口
                contentService.passGuide(data).then(function (res) {
                    if (res.data.success) {
                        $uibModalInstance.close();
                    //    $scope.find();
                        msg("保存成功！");
                    } else {
                        alert("保存失败");
                    }
                });
            }

        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        };
    });

    //查看入伙详情
    app.controller("editpartnershipdetailCtrl", function ($scope, $http, $uibModal, $uibModalInstance, $filter, fac, item, contentService) {
        $scope.title = '入伙详情';
        $scope.pageModel = {};
        $scope.item = item;

        //获取业主亲属信息数据
        // contentService.contentGuide(data).then(function(res){
        //     if(res.data.success){
        //         $scope.pageModel = res;
        //     }
        // });        

        //把备注信息显示出来
        contentService.editContentGuide({ joinId: item.joinId }).then(function (res) {
            if (res.data.success) {
                $scope.remark = res.data.JoinGang.remark;
                $scope.status = res.data.JoinGang.status;
            }
        });

        $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        };

    });

    app.service('contentService', ['$http', '$q', 'fac', function ($http, $q, fac) {
        var getGuideContentUrl = '/ovu-pcos/join/gang/list',
            passGuideUrl = '/ovu-pcos/join/gang/isPass',
            editGuideUrl = '/ovu-pcos/join/gang/getDetails', //参数joinId
            contentGuideUrl = '/ovu-pcos/newowner/relative/queryList';

        //批量通过审批接口
        this.passGuide = function (data) {
            return $http.post(passGuideUrl, data, fac.postConfig);
        };
        //保存
        this.editContentGuide = function (data) {
            return $http.post(editGuideUrl, data, fac.postConfig);
        };
        //业主亲属信息接口
        this.contentGuide = function (data) {
            return $http.post(contentGuideUrl, data, fac.postConfig);
        }
        //主页面分页
        this.getContentGuide = function (info) {
            return $q(function (resolve, reject) {
                fac.getPageResult(getGuideContentUrl, info, function (pageModel) {
                    resolve(pageModel);
                })
            })
        };
    }])
    

})();
