(function () {
    var app = angular.module("angularApp");
    app.controller('homeInspectionCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-移动验房";
        angular.extend($rootScope, fac.dicts);

        $scope.search = {
            parkId: ''
        };
        $scope.pageModel = {

        };

        // 页面初始化
        app.modulePromiss.then(function () {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId
                        $scope.find();
                    } else {
                        $scope.search.parkId && delete $scope.search.parkId
                        alert('请选择跟项目关联的部门');
                        $scope.find();
                        return
                    }

                }
            })
        })

        $scope.status = [{
                text: "整改中",
                value: 1
            },
            {
                text: "验收完成",
                value: 2
            }
        ]

        // 查询列表
        $scope.find = function (pageNo) {
            if (!$scope.search.parkId) {
                // alert("请选择项目关联的部门")
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

            fac.getPageResult("/ovu-park/backstage/checkHouse/selectByPage", $scope.search, function (data) {
                $scope.pageModel = data;
                console.log('$scope.pageModel', $scope.pageModel)
            })

        };

        $scope.find()

        $scope.showUpload = function () {

        }
        // 文件上传
        $scope.showUpload = function (item) {
            var modal = $uibModal.open({
                animation: true,
                size: 'xl',
                templateUrl: '/view/operationManage/homeInspection/model.homeUpload.html',
                controller: 'homeUploadCtrl',
                resolve: {
                    item: item
                }
            });
            modal.result.then(function () {
                // $scope.find()
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        // 详情
        $scope.showDetail = function (item) {
            var modal = $uibModal.open({
                animation: true,
                size: 'xl',
                templateUrl: '/view/operationManage/homeInspection/model.homeDetail.html',
                controller: 'homeDetailCtrl',
                resolve: {
                    item: item
                }
            });
            modal.result.then(function () {
                // $scope.find()
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
    })

    //弹出验收文件上传控制器
    app.controller('homeUploadCtrl', function ($scope, $http, $uibModal, $uibModalInstance, $filter, fac, item) {
        document.title = "OVU-验收文件上传";
       $scope.item = item;
       $scope.item.pics = []
        var params = {
            houseId:item.houseId
        }
        $scope.pageModel = {
        
        };
        
        $http.get("/ovu-park/backstage/checkHouse/view",{params:params}).success(function(resp){
            $scope.pageModel = resp.data
            $scope.item.pics = resp.data.checkFinishImg.split(',')||[]
            console.log("$scope.pageModel",$scope.pageModel)
        })


        $scope.toWorkOrder = function (x){
            var modal = $uibModal.open({
                animation: true,
                size: 'md',
                templateUrl: '/view/operationManage/homeInspection/model/model.workOrderFind.html',
                controller: 'workOrderCtrl',
                resolve: {
                    item: x
                }
            });
            modal.result.then(function (){
                // $scope.find()
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };


        $scope.saveUpload = function (form, item) {
            confirm("确认保存吗?(保存后不可修改)",function(){
                $scope.count = 2;
                form.$setSubmitted(true);
                if (!form.$valid) {
                    $scope.count = 1;
                    return false;
                }
                if (item.pics.length > 3) {
                    $scope.count = 1;
                    window.msg("巡检照片最多只能上传3张图片, 请删除多余的图片！");
                    return false;
                }
    
                item.checkFinishImg = item.pics.join(",");
                // item.brandImg = item.brandPics.join(",");
                // item.inspectionType = 2;
                var params = {
                    checkFinishImg:item.pics.join(","),
                    id:item.id
                }
                var loading = layer.load(2, {
                    shade: [0.1, '#fff'] //0.1透明度的白色背景
                });
                console.log("params",params)
                $.post("/ovu-park/backstage/checkHouse/uploadImg", params, function (resp) {
                    if (resp.code == 0) {
                        window.msg("保存成功！");
                        layer.close(loading);
                        $uibModalInstance.close();
                    } else {
                        window.alert(resp.message);
                        $scope.count = 1;
                        layer.close(loading);
                    }
                });
            })
            
        };
        // $scope.save = function () {
        //     $uibModalInstance.close();
        // }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })



    //弹出验收详情控制器
    app.controller('homeDetailCtrl', function ($scope, $uibModal, $http, $uibModalInstance, $filter, fac, item) {
        document.title = "OVU-验收详情";
        var params = {
            houseId:item.houseId
        }
        $scope.pageModel = {};

        $http.get("/ovu-park/backstage/checkHouse/view",{params:params}).success(function(resp){
            $scope.pageModel = resp.data
            console.log("$scope.pageModel",$scope.pageModel)
        })





        $scope.toWorkOrder = function (x) {
            var modal = $uibModal.open({
                animation: true,
                size: 'md',
                templateUrl: '/view/operationManage/homeInspection/model/model.workOrderFind.html',
                controller: 'workOrderCtrl',
                resolve: {
                    item: x
                }
            });
            modal.result.then(function () {
                // $scope.find()
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };




        $scope.save = function () {
            $uibModalInstance.close();
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })

    //弹出工单详情控制器
    app.controller('workOrderCtrl', function ($scope, $http, $uibModalInstance, $filter, fac, item) {
        document.title = "OVU-验收详情";
        $scope.item = item
        $scope.pageModel = {}
        $http.get('/ovu-pcos/pcos/workunit/getWorkunit.do?id=' + item.workunitId).success(function(resp){
            $scope.pageModel = resp.data
            console.log("$scope.pageModel",$scope.pageModel)
        })


        $scope.save = function () {
            $uibModalInstance.close();
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })

})()
