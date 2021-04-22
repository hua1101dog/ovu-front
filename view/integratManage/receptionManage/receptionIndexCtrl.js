(function () {
    var app = angular.module("angularApp");
    app.controller('receptionIndexCtrl', function ($scope, $rootScope, $state, $q, $http, $filter, $uibModal, fac) {
        document.title = "OVU-接待管理";
        $scope.search = {
            parkId: ''
        };
        $scope.pageModel = {};
        app.modulePromiss.then(function(){
            fac.initPage($scope, function () {
                $scope.find(1);
            })
            
        });
        $scope.find = function (pageNo) {
            if (!$scope.search.parkId) {
                alert("请选择项目关联的部门")
                $scope.pageModel = {};
                return
            }
            $scope.search.admitDate=$scope.search.deadline?$scope.search.deadline.substring(0,10):''
            $scope.search.time=$scope.search.deadline?$scope.search.deadline.substring(11):''
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            fac.getPageResult("/ovu-park/enterprise/service/sixAdmint/queryByPage", $scope.search, function (resp) {
                $scope.pageModel = resp;
            });
        };
        //投屏
        $scope.throwingScreen=function(item){
            confirm("确定投屏吗？",function(){
                $http.post('/ovu-park/enterprise/service/sixAdmint/operate',{"id":item.id},fac.postConfig).success(function(resp){
                    if(resp.code==0) {
                        window.msg("投屏成功！");
                        $scope.find(1)
                    }else{
                        alert(resp.msg);
                    }

                });
            });
        }
         //删除
         $scope.delectRec=function(item){
            confirm("确定删除该接待吗？",function(){
                $http.get("/ovu-park/enterprise/service/sixAdmint/delete?id="+item.id).success(function(res){
                    if(res.code==0) {
                        window.msg("删除成功！");
                        $scope.find(1)
                    }else{
                        alert(res.msg);
                    }

                });
            });
        }
        //新增/编辑企业
        $scope.addEditModal = function (item) {
            if (!fac.checkPark($scope)) {
                return
            }
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/integratManage/receptionManage/modal.editReception.html',
                controller: 'addEditRecCtrl',
                resolve: {
                    params: {
                        id:item?item.id:'',
                        parkId:$scope.search.parkId
                    }
                }
            });
            modal.result.then(function () {
                $scope.find(1);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

    });
    app.controller('addEditRecCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, params) {
        $scope.item = params;
        $scope.item.deadline=moment().format('YYYY-MM-DD HH:mm')
        if($scope.item.id){
            $http.get("/ovu-park/enterprise/service/sixAdmint/queryById?id="+$scope.item.id).success(function(res){
                if(res.code==0&& res.data){
                    angular.extend($scope.item, res.data);
                    $scope.item.num=parseInt($scope.item.num)
                }
                
            })
        }
        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            // 根据保存的注册地址删减传参数  1:园区内 2：园区外
           var params=angular.extend({},item);
           params.admitDate=params.deadline.substring(0,10);
           params.time=params.deadline.substring(11);
           if(!$scope.item.id){//新增
            $http.post("/ovu-park/enterprise/service/sixAdmint/save", params, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    window.msg("新增成功!");
                    $uibModalInstance.close();
                } else {
                    alert(resp.msg);
                }
            });

           }else{//编辑
            $http.post("/ovu-park/enterprise/service/sixAdmint/update", params, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    window.msg("修改成功!");
                    $uibModalInstance.close();
                } else {
                    alert(resp.msg);
                }
            });

           }
           
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})();
