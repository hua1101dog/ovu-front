(function () {
    "use strict";
    var app = angular.module("angularApp");
    //var parkId;
    var deptId;
    app.service('houseService', ['$http', '$q', 'fac', function ($http, $q, fac) {
        var getGuideUrl = '/ovu-pcos/join/checkroom/list',
            getDetailsGuideUrl = '/ovu-pcos/join/checkroomresult/getDetails',
            editGuideUrl = '/ovu-pcos/join/checkroomresult/edit';

        this.getHouseGuide = function (data) {
            return $q(function (resolve, reject) {
                fac.getPageResult(getGuideUrl, data, function (pageModel) {
                    resolve(pageModel);
                })
            })
            // return $http.post(getGuideUrl, data, fac.postConfig);
        };
        this.getDetailGuide = function (data) {
            return $http.post(getDetailsGuideUrl, data, fac.postConfig);
        };
        this.editHouseGuide = function (data) {
            return $http.post(editGuideUrl, data, fac.postConfig);
        }
    }]);
    //入伙验房反馈ctrl
    app.controller("partnershiphouseCtrl", function ($scope, $rootScope, $uibModal, $http, $state, $filter, fac, houseService) {
        document.title = "入伙验房反馈";
        $scope.pageModel = {};
        $scope.search = {};

        //项目版 查询当前项目的parkId
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
            [0, '未处理'],
            [1, '已处理']
        ];

        //分页 渲染
        $scope.find = function (pageNo) {
        	if(!$scope.search.deptId){
        		alert("请选择部门");
        		return;
        	}
            $.extend($scope.search, { currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;

            houseService.getHouseGuide($scope.search).then(function (result) {
                if (result) {
                    $scope.pageModel = result;
                }
            })

        };

        //查看处理详情模态窗口
        $scope.showModal = function (item) {
            item.isHandle == 1 ? item.ss = '查看处理意见' : item.ss = '处理';
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/join/partnershiphouse/modal.housedispose.html',
                controller: 'edithousedisposeCtrl',
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

    app.controller("edithousedisposeCtrl", function ($scope, $http, $uibModal, $uibModalInstance, $filter, fac, item, houseService) {
        $scope.item = item;

        //查看详情
        if (item.ss == '查看处理意见') {
            houseService.getDetailGuide({ checkroomId: item.id }).then(function (res) {
                //console.log('result处理结果',res);
                if (res.data.success) {
                    $scope.result = res.data.joinCheckRoomResult.result;
                } else {
                    alert("查看处理结果失败");
                }
            })
        }

        //保存
        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            console.log($scope.result);
            if($scope.result == undefined){
                alert('请输入内容')
            }else if($scope.result.length > 600){
                alert('您输入的内容超过最大字数600！')
            }else {
                houseService.editHouseGuide({ deptId: deptId, result: $scope.result, checkroomId: item.id }).then(function (res) {
                    if (res.data.success) {
                        $uibModalInstance.close();
                        $scope.find();
                        msg("保存成功！");
                    } else {
                        alert("保存失败");
                    }
                })

            }
            // houseService.editHouseGuide({ parkId: parkId, result: $scope.result, checkroomId: item.id }).then(function (res) {
            //     if (res.data.success) {
            //         $uibModalInstance.close();
            //         $scope.find();
            //         msg("保存成功！");
            //     } else {
            //         alert("保存失败");
            //     }
            // })

        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        };
    });

    
})();
