(function () {
    var app = angular.module("angularApp");
    //项目架构ctl
    app.controller('infoReleaseIndexCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-信息发布统计";

        angular.extend($rootScope, fac.dicts);

        $scope.search = {

        };

        $scope.usetime = ''
        $scope.pageModel = {};
        // 发布时间

        // 发布状态
        $scope.infoType = [
            {text: "产业投资", value: "产业投资"},
            {text: "规划建设", value: "规划建设"},
            {text: "招商运营", value: "招商运营"},
            {text: "企业服务", value: "企业服务"},
        ];

        $scope.resetParams=function(){
            $scope.search = {

            }

            fac.initPage($scope, function () {
                $scope.find(1);
            })
        }

        $scope.query = function () {
            if($scope.usetime){
                $scope.search.publishEndTime = $scope.usetime.split('-')[1].trim()
                $scope.search.publishStartTime = $scope.usetime.split('-')[0].trim()
            }else {
                delete $scope.search.publishEndTime
                delete $scope.search.publishStartTime
            }
            fac.initPage($scope, function () {
                $scope.find(1);
            })
        }

        $scope.showDetail = function (item) {
            $http.get("/ovu-park/backstage/operate/information/get/" + item.infoId).success(function (resp) {
                if (resp.code == 0) {
                    console.log(resp.data)
                    var modal = $uibModal.open({
                        size: 'lg',
                        animation: true,
                        templateUrl: '/view/operationManage/releaseManage/modal.infodetail.html',
                        controller: 'showInfodetailCtrl',
                        resolve: {data: resp.data}
                    });
                }
            });
        }

        $scope.releaseInfo = function (item) {
            $http.get("/ovu-park/backstage/operate/information/publish/" + item.infoId).success(function (resp) {
                if (resp.code == 0) {
                    window.msg("操作成功!");
                    $scope.find();
                }
            });
        }

        $scope.find = function (pageNo) {
            if ($scope.pageModel.currentPage) {
                delete $scope.pageModel.currentPage;
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            fac.getPageResult("/ovu-park/backstage/operate/information/page", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find(1);
            })
        });
    });

    app.controller('showInfodetailCtrl', function ($scope, $http, $uibModalInstance, fac, data) {
        $scope.data = data
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

})()
