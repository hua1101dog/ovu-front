(function () {
    var app = angular.module("angularApp");
    app.controller('mainUnitIndexCtrl', function ($scope, $rootScope, $state, $q, $http, $filter, $uibModal, fac) {
        document.title = "OVU-主力户型";
        $scope.unitFormList=[]
        //fac.loadSelect($scope, "DOOR_MODEL_TYPE")  //doorModelList
        $scope.search = {
            parkId: ''
        };
        $scope.getProjectInfo = function () {
            $http.get("/ovu-park/backstage/projectInfo/queryInfo?parkId="+$scope.search.parkId).success(function (res) {
                if(res.data&&res.data.industryCondition){
                    $scope.unitFormList=JSON.parse(res.data.industryCondition)
                }
                $scope.find(1);
            })
        };
      
        $scope.pageModel = {};
        app.modulePromiss.then(function(){
            fac.initPage($scope, function () {
                $scope.getProjectInfo()
                
            })
            
        });
        $scope.find = function (pageNo) {
            if (!$scope.search.parkId) {
                alert("请选择项目关联的部门")
                $scope.pageModel = {};
                return
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            fac.getPageResult("/ovu-park/backstage/roomModel/queryByTerm", $scope.search, function (resp) {
                $scope.pageModel = resp;
            });
        };
        //发布/撤回
        $scope.publishUnit=function(item){
            let title,publishStatus
            if(item.publishStatus==1){
                title='撤回'
                publishStatus=2
            }else{
                title='发布'
                publishStatus=1
            }
            confirm("确定"+title+"吗？",function(){
                $http.post('/ovu-park/backstage/roomModel/update',{"id":item.id,publishStatus:publishStatus},fac.postConfig).success(function(resp){
                    if(resp.code==0) {
                        window.msg(title+"成功！");
                        $scope.find(1)
                    }else{
                        alert(resp.msg);
                    }

                });
            });
        }
         //删除
         $scope.delectUnit=function(item){
            confirm("确定删除该户型吗？",function(){
                $http.get("/ovu-park/backstage/roomModel/update?id="+item.id+"&dataStatus="+0).success(function(res){
                    if(res.code==0) {
                        window.msg("删除成功！");
                        $scope.find(1)
                    }else{
                        alert(res.msg);
                    }

                });
            });
        }
        //新增/编辑户型
        $scope.addEditModal = function (item) {
            if (!fac.checkPark($scope)) {
                return
            }
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/projectSpace/mainUnit/modal.editUnit.html',
                controller: 'addEditUnitCtrl',
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
    app.controller('addEditUnitCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, params) {
        $scope.item = params;
        $scope.unitFormList=[]
        $scope.picArr=[]
        // fac.loadSelect($scope, "DOOR_MODEL_TYPE")  //doorModelList
        $scope.item.deadline=moment().format('YYYY-MM-DD HH:mm')
        $scope.getProjectInfo = function () {
            $http.get("/ovu-park/backstage/projectInfo/queryInfo?parkId="+$scope.item.parkId).success(function (res) {
                if(res.data&&res.data.industryCondition){
                    $scope.unitFormList=JSON.parse(res.data.industryCondition)
                }
            })
        };
        $scope.getProjectInfo()
        if($scope.item.id){
            $http.get("/ovu-park/backstage/roomModel/queryById?id="+$scope.item.id).success(function(res){
                if(res.code==0&& res.data){
                    angular.extend($scope.item, res.data);
                    if($scope.item.photo){
                        $scope.picArr=$scope.item.photo.split(",")
                    }
                    $scope.item.type&&($scope.item.type=$scope.item.type+'')
                    $scope.item.condition&&($scope.item.condition=$scope.item.condition+'')
                }
                
            })
        }
        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            if ($scope.picArr.length > 0) {
                item.photo=$scope.picArr.join(",")
            }else{
                item.photo=""
            }
           //var params=angular.extend({},item);
           if(!$scope.item.id){//新增
            $http.post("/ovu-park/backstage/roomModel/save", item, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    window.msg("新增成功!");
                    $uibModalInstance.close();
                } else {
                    alert(resp.msg);
                }
            });

           }else{//编辑
            $http.post("/ovu-park/backstage/roomModel/update", item, fac.postConfig).success(function (resp) {
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
