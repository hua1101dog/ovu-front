/**
 * Created by Administrator on 2017/7/20.
 */
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('takingApproveCtrl', function ($scope, $http,$uibModal,fac,$location) {
        document.title ="承接立项";
        $scope.attrs=[];
        $scope.project={};

        //从多项目跳转过来
        if ($location.search().projectId) {
          $scope.project.id=$location.search().projectId;
          $scope.project.name=$location.search().projectName;
        }

        function loadData(){
            $http.get("/ovu-pcos/taking/type/tree.do").success(function(data) {
                $scope.attrs=data;
            });
        };
        loadData();

        $scope.clickBox=function(attr){
            attr.checked=!attr.checked;
        };

        $scope.selectProject=function(){
            var modal = $uibModal.open({
                animation: true,
                size: '',
                templateUrl: '/common/modal.project.html',
                controller: 'selectProjectCtrl'
                , resolve: {}
            });
            modal.result.then(function (data) {
                $scope.project=data;
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.export = function () {
            var ids = $scope.attrs.reduce(function(ret,n){n.checked && ret.push(n.id);return ret},[]);
            if(ids.length==0){
                alert('请选择专业！');
                return;
            }

            var elemIF = document.createElement("iframe");
            elemIF.src = "/ovu-pcos/taking/approve/export.do?ids="+ids.join();
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
        };

        $scope.import = function(){
            if(!$scope.project.id){
                alert('请选择项目！');
                return;
            }
            fac.upload({url:"/ovu-pcos/taking/approve/import.do",params:{projectId:$scope.project.id},
                accept:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"},function(resp){
                if(resp.success){
                    $scope.msg = "导入成功！";
                    msg("导入成功！");
                    $scope.$apply();
                }else{
                    alert(resp.error);
                }
            })
        };
    });
})();
