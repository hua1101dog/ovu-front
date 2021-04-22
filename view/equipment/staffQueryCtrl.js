(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.service('AppService', function ($http, fac) {
        var that = this;
        this.park = { parkNo: '', parkName: '' };
        //项目编号
        this.parkNo = '';
    });
    app.controller('staffQueryCtrl', function ($scope, $rootScope, $interval, $http, $filter, $uibModal, fac, AppService) {
        $scope.pageModel = {};
        $scope.search = {};
        $scope.staffList = [];
        $scope.find = function (pageNo) {
            console.log('pageNo :', pageNo);
            angular.extend($scope.search, { currentPage: pageNo || 0, pageSize: $scope.pageModel.pageSize || 10});
            fac.getPageResult(`/faceDiscern/staffManage/listByPage?pageIndex=${pageNo || 0}&pageSize=${$scope.pageModel.pageSize || 10}`, $scope.search, function (data) {
                console.log('data :', data);
                $scope.pageModel = data;
                let  datas = $scope.pageModel.data;
                for (let i = 0; i < datas.length; i++) {
                    datas[i].avatarPhoto = "http://192.168.6.100" + datas[i].avatar
                }
                $scope.staffList = datas;
            });
        };
        $scope.find(1);
        $scope.toRefresh = function (item) {//刷新
                item.showDetail = true;
                var modal = $uibModal.open({
                    animation: false,
                    size: 'lg',
                    templateUrl: '/view/equipment/component/editModel.html',
                    controller: 'editModelCtrl',
                    // resolve: { data: function () { return {}; } }
                    resolve: { data: item }
                });
                modal.result.then(function () {
    
                }, function () { //模态框关闭事件
                    
                })
            
        };
        
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
        
    });
    app.controller('editModelCtrl', function ($scope, $http, $uibModalInstance, $filter, $uibModal, fac, data) {
        $scope.search = {};
        $scope.pageModel = {};
        $scope.staffChildList = [];
        function formatDate(now) { 
            var year=now.getFullYear(); 
            var month=now.getMonth()+1; 
            var date=now.getDate(); 
            var hour=now.getHours(); 
            var minute=now.getMinutes(); 
            var second=now.getSeconds(); 
            return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second; 
       } 
       //如果记得时间戳是毫秒级的就需要*1000 不然就错了记得转换成整型
        $scope.find = function (pageNo) {
            console.log('pageNo :', pageNo);
            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10});
            fac.getPageResult(`/faceDiscern/staffManage/staffInfo?subjectId=${data.id}&pageIndex=${pageNo || 0}&pageSize=${$scope.pageModel.pageSize || 10}`, $scope.search, function (data) {
                console.log('data :', data);
                $scope.pageModel = data;
                let  datas = $scope.pageModel.data;
                for (let i = 0; i < datas.length; i++) {
                    datas[i].avatarPhoto = "http://192.168.6.100" + datas[i].photo;
                    if(datas[i].subject.entry_date == "") return;
                    datas[i].entryDate = formatDate(new Date(datas[i].subject.entry_date*1000));
                }
                $scope.staffChildList = datas;
            });
        };
        $scope.find(1);
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
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
})()

