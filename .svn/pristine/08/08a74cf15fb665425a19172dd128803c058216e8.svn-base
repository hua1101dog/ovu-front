(function () {
    var app = angular.module("angularApp");
    app.controller('groupCustomServiceCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        angular.extend($rootScope, fac.dicts);
        document.title = "OVU-客服管理";
        $scope.search = {};
        $scope.pageModel = {};
        $scope.isShow = true;
        fac.loadSelect($scope, "SERVICE_SCOPE");

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
            fac.getPageResult("/ovu-park/backstage/solution/customerService/list", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        /*app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	$scope.find();
            })
        });*/
        $scope.find();
        
        //获取客服服务类型名称
        $scope.getServiceScopeName = function(serviceScopeCode){
        	var serviceScopeName = "--";
        	angular.forEach($scope.serviceScopeList,function(serviceScopeObj){
   			 if(serviceScopeCode == serviceScopeObj.dicVal){
   				serviceScopeName = serviceScopeObj.dicItem;
   			 }
   		 });
        	return serviceScopeName;
        }
        
        //删除实体项目
        $scope.del = function (news) {
            confirm("确定删除 " + news.name, function () {
                $http.post("/ovu-park/backstage/solution/customerService/remove", { ids: news.id }, fac.postConfig).success(function (resp) {
                    if (resp) {
                        window.msg("删除成功!");
                        $scope.find();
                    }
                });
            })
        }


        //新增/编辑
        $scope.showItem = function (news) {
            if(news){
                news.serviceScopeList = $scope.serviceScopeList;
            }else{
            	news = {"serviceScopeList":$scope.serviceScopeList};
            }
           
            var copy = angular.extend({}, news);
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/operationManage/groupCustomService/modal.html',
                controller: 'A2',
                resolve: {news: copy}
            });
            modal.result.then(function () {
                if ($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1) {
                    $scope.pageModel.currentPage = $scope.pageModel.currentPage - 1;
                }
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

    });
    app.controller('A2', function ($scope, $http, $uibModalInstance, $filter, fac, news) {
        $scope.item = news;
        
        
        $scope.item.serviceScopeList = news.serviceScopeList;
        $scope.item.phoneTypeList = [
                                     {"id":1,"name":"固定电话"},
                                     {"id":2,"name":"移动电话"}
                                     ]
        
        $scope.saveNews = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            if(item.phoneType == 1){
            	item.landlineTelephone = item.landlineTelephone;
            	delete item.mobilePhone;
            }
            if(item.phoneType == 2){
            	delete item.landlineTelephone;
            	item.mobilePhone = item.mobilePhone;
            }
            if (item.id) {
                fac.getResult("/ovu-park/backstage/solution/customerService/saveOrEdit", item, function (code) {
                    window.msg("修改成功!");
                    $uibModalInstance.close();
                });
            }
            if (!item.id) {
                fac.getResult("/ovu-park/backstage/solution/customerService/saveOrEdit", item, function (code) {

                    window.msg("新增成功!");
                    $uibModalInstance.close();

                });
            }
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})();
