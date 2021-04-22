(function () {
    var app = angular.module('angularApp');
    app.controller('videoReportCtrl', function ($scope, $rootScope, $uibModal, $http, $filter, fac, $log,$sce) {
        document.title = "视频巡查报告";
        $scope.pageModel = {};
        $scope.search = {
            
            time: $filter('date')(new Date(), 'yyyy-MM-dd'),
            score: 0,
            type:2,
            insPointType:''
        }
        // 存储路线列表
        $scope.insWayList = [];
        app.modulePromiss.then(function () {
            // fac.initPage($scope, function () {
            //     $scope.findDept();
            //     $scope.find();
            // });
            $scope.$watch('dept.id', function (deptId, oldValue) {
                // if(!$scope.node.parkId){
                //     alert('请选择叶子节点');
                //     return
                // }
                if(deptId){
                      $scope.search.deptId=deptId          
                      $scope.init(); 
                   }
            })
        })
        $scope.init=function(){
            // $scope.find();
            $scope.findAllWay();
        }
         // 查询路线列表
         $scope.findAllWay = function () {
            var params={pdeptId:$scope.search.deptId,insType:1}
            $http.post('/ovu-pcos/pcos/inspection/insway/list.do?', params, fac.postConfig).success(function (data) {
                if (data.code == 0) {
                 $scope.insWayList=data.data|| [];
                } else {
                    alert(data.msg);
                }
            })
        };
        // 查询视频问题结果列表
        $scope.find = function (pageNo,id) {
           
            // if(!id) {
            //     $scope.search.insWayIds = ''
            // } else {
            //     $scope.search.insWayIds = id;
            // }
            $.extend($scope.search, {currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10});
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-pcos/pcos/inspection/insvideo/resultList1.do", $scope.search, function (data) {
                $scope.pageModel = data;
                // $scope.pageModel.totalPage = $scope.pageModel.totalCount;
                // $scope.pageModel.data && $scope.pageModel.data.forEach(function(v){
                //     v.feedback && (v.feedback=v.feedback.split('%'));
                // })
                $scope.pageModel && $scope.pageModel.forEach(e=>{
                    e.insItemName=[]
                    e.itemList && e.itemList.forEach(v=>{
                        e.insItemName.push(v.name)
                    })
                    e.insItemName= e.insItemName && $sce.trustAsHtml(e.insItemName.map(function (v, i) {
                        return (i + 1) + '.' + v;
                    }).join('<br>'))
                })
            });
        };
        // 导出文件
        $scope.exportFile = function () {
            if(!$scope.search.time){
                alert('请选择巡查时间');
                return
             }
            $scope.search.domainId = $rootScope.user.domainId;
            $scope.search.type = 2;
                window.location.href='/ovu-pcos/pcos/inspection/export/exportInsResult?pagesize='+ $scope.search.pageSize+"&time="+$scope.search.time+"&type="+$scope.search.type+"&domainId="
                +$scope.search.domainId+"&deptId="+$scope.search.deptId+"&insPointType="+$scope.search.insPointType+"&score="+$scope.search.score+"&insWayId="+$scope.search.insWayId;
           
           
        }
        // 展示所有图片
        $scope.showPictures = function (data) {
            data = data || "/res/img/detail.png";
            var urls = data.split(",");
            var modalInstance = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/inspection/report/modal.showPictures.html',
                controller: 'showPicCtrl', 
                resolve: {
                    task: function () {
                        return urls;
                    } 
                }
            });
            // 弹出框确认和取消后的回调函数
            modalInstance.result.then(function () {
          
            }, function () {
               
            });
        }
    })

    // 图片显示框的控制器
    app.controller("showPicCtrl", function($scope, $rootScope, $uibModal, $http, $filter, fac, $log, $uibModalInstance, task) {
        $scope.images = task;
        var index = 0;
        $scope.currentUrl = $scope.images[index];
        // 切换图片到上一张
        $scope.prevImage = function() {
            index--;
            if(index < 0) {
                index = $scope.images.length
            }
            $scope.currentUrl = $scope.images[index];
        }
        // 切换到下一张
        $scope.nextImage = function() {
            index++;
            if(index>$scope.images.length) {
                index = 0;
            }
            $scope.currentUrl = $scope.images[index];
        }
        $scope.save = function(data) {
            $uibModalInstance.close();
        }
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }
    })
})()