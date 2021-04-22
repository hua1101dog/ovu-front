/**
 * Created by Zn on 2018/1/29.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");

    //合同备案管理ctrl
    app.controller("abandonedCtrl", function($scope, $rootScope, $uibModal, $http, $filter, fac, $sce, $state) {
        $scope.search = {
            compactStatus: sessionStorage.getItem('status'),
            compactInfoId: sessionStorage.getItem('id')
        };
        //合同查看
        $http.post('/ovu-pcos/pcos/compact/info/view', $scope.search, fac.postConfig).success(function(data) {
            $scope.inform = data.compactInfo;
            //$scope.itemList = data.itemList;
            $scope.itemList = data.itemList.map(function(v) {
                // return $sce.trustAsHtml(v.compactInfoData);
                return {
                    dataItemName: v.dataItemName,
                    compactInfoData: $sce.trustAsHtml(v.compactInfoData)
                }
            });
            $scope.content = $sce.trustAsHtml($scope.inform.compactDetail);
            // 新需求 20180316 begin
            $scope.remind = data.compactCall;
            // end
        });
        //退回流程列表
        $http.post('/ovu-pcos/pcos/compact/info/backFlowList', $scope.search, fac.postConfig).success(function(data) {
            $scope.stepList = data;
        });
        //合同废弃
        $scope.useless = function() {
            $http.post('/ovu-pcos/pcos/compact/info/discardPass', $scope.search, fac.postConfig).success(function(data) {

                if (data.status == 0) {
                    msg(data.desc);
                } else {
                    msg(data.desc);
                }
            })
        };
        //合同打印
        $scope.printpage = function() {
            var bdhtml = document.body.innerHTML;
            var sprnstr = "<!--startprint-->";
            var eprnstr = "<!--endprint-->";
            var prnhtml = bdhtml.substring(bdhtml.indexOf(sprnstr) + 17),
                prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr));
            window.document.body.innerHTML = prnhtml;
            window.print();
            //  window.document.body.innerHTML = bdhtml;
            window.location.reload();

        };

        //合同审批
        // $scope.passRecord = function(){
        //     $http.post('/ovu-pcos/pcos/compact/info/recordPass',$scope.search,fac.postConfig).success(function(data){
        //         if(data.status == 0){
        //             msg(data.desc);
        //         }else{
        //             msg(data.desc);
        //         }

        //     })
        // }
        $scope.back = function() {
            var backContent = sessionStorage.getItem('back');
            //返回到期合同管理
            if (backContent == 'expired') {
                $state.go('admin', { folder: 'agreement', page: 'expired' });
            } else if (backContent == 'discard') {
                $state.go('admin', { folder: 'agreement', page: 'discard' });
            } else if (backContent == 'library') {
                $state.go('admin', { folder: 'agreement', page: 'library' });
            } else if (backContent == 'record') {
                $state.go('admin', { folder: 'agreement', page: 'record' });
            }
            //$state.go('admin', { folder: 'agreement', page: 'discard' });
        }
    })
})()