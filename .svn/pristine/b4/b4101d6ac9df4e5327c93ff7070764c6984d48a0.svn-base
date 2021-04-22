(function() {
    var app = angular.module("angularApp");
    app.controller('derateExamineCtrl', ['$scope', '$rootScope', '$http', '$filter', '$uibModal', 'fac', '$location', '$timeout', function ($scope, $rootScope, $http, $filter, $uibModal, fac, $location, $timeout) {
        $scope.finacialObj = $rootScope.pages.params;
        var curPage;
        setTimeout(function () {
            curPage = $rootScope.getCurTabPage($rootScope.pages.active, $rootScope.pages);
        })
        // 获取列表
         $scope.dolist = function(){
             $.post("/ovu-park/backstage/rental/relief/detail?id=" + $scope.finacialObj.id, function (data) {
                 $timeout(function () {
                     $scope.list = data.data.reliefHead;
                     $scope.pageModel = data.data.reliefItemList;
                 }, 1)
                 $scope.id = data.data.reliefHead.id;

                 
                 $scope.billPriceTotal = 0.00;
                 $scope.lastReceiveAmountTotal = 0.00;
                 $scope.lastReliefAmountTotal = 0.00;
                 $scope.lastUnreceiveAmountTotal = 0.00;
                 $scope.reliefTotal = 0.00;
                 for (var i = 0; i < data.data.reliefItemList.length; i++) {
                     $scope.billPriceTotal += data.data.reliefItemList[i].billPrice;
                     $scope.lastReceiveAmountTotal += data.data.reliefItemList[i].lastReceiveAmount;
                     $scope.lastReliefAmountTotal += data.data.reliefItemList[i].lastReliefAmount;
                     $scope.lastUnreceiveAmountTotal += data.data.reliefItemList[i].lastUnreceiveAmount;
                     $scope.reliefTotal += data.data.reliefItemList[i].reliefAmount;
                 }
 			});
         };
        //是否为查看页面
         $scope.check = $scope.finacialObj.check;

        //通过、驳回
         $scope.pass = function (num) {
             if (!$scope.remark) {
                 $scope.remark = null
             }
             $scope.param = {
                 "id": $scope.id,
                 "auditFlag": num ? "1" : "0",
                 "remark": $scope.remark
             };
             var comfi = "";
             if (num) {
                 comfi = '通过'
             } else {
                 comfi = '驳回'
             };
             confirm("确定" + comfi + "当前减免单吗？", function () {
                 $http.post("/ovu-park/backstage/rental/relief/audit", $scope.param, fac.postConfig).success(function (resp) {
                     if (resp.code==0) {
                         window.msg("状态保存成功");
                         $timeout(function () {
                            //  $location.url('/rental/home/rent');
                            $scope.$emit('needToClose', curPage);
                         }, 1)
                     } else {
                         window.alert(resp.message);
                     }
                 });
             })
             //if (num) {
             //    $.post("/ovu-park/backstage/rental/relief/audit", $scope.param, function (data) {
             //        if (data.code) {
             //            $timeout(function () {
             //                $location.url('/rental/home/rent')
             //            }, 1)
             //        } else {
             //            alert(data.message)
             //        }
             //    });
             //} else {
             //    var modal = $uibModal.open({
             //        animation: false,
             //        size: '',
             //        templateUrl: '/view/rental/finacial/modal.reject.html',
             //        controller: 'viodCtrl',
             //        resolve: { "param": $scope.param }
             //    });
             //    modal.result.then(function (data) {
             //        if (data) {
             //            $location.url('/rental/home/rent')
             //        }
             //    }, function () {
             //    });
             //}
         };
        //返回
         $scope.back = function () {
            //  $location.url('/rental/home/rent');
            $scope.$emit('needToClose', curPage);
         };
        //关闭
         $scope.cancel = function () {
            //  $location.url('/rental/finacial/derateFinacial');
            $scope.$emit('needToClose', curPage);
         };
         app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.dolist()
            })
        });
    }]);
    // 确认驳回
    //app.controller('viodCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, param) {
    //    $scope.save = function (obj) {
    //        param.remark = obj;
    //        $.post("/ovu-park/backstage/rental/relief/audit",param, function (data) {
    //            if (data.code) {
    //                $uibModalInstance.close("1");
    //            } else {
    //                alert(data.message)
    //            }
    //        });
    //    }
    //    $scope.cancel = function () {
    //        $uibModalInstance.dismiss('cancel');
    //    }
    //});
    
})()
