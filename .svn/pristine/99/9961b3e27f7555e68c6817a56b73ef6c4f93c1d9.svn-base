(function() {
    var app = angular.module("angularApp");
    app.controller('statisticIndexCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        angular.extend($rootScope,fac.dicts);
        var vm =  $scope.vm = this;
        document.title ="OVU-账号统计";
        $scope.search = {};
        if (fac.isEmpty($scope.search.userType)) {
            $scope.search.userType = '1';
        }
        $scope.pageModel = {};
        $scope.find = function(pageNo){
        	if($scope.pageModel.currentPage){
                delete $scope.pageModel.currentPage;
            }
     		$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;
            var params = angular.copy($scope.search);
            if(!fac.isEmpty(params.startTime)){
            	params.startTime = params.startTime+" 00:00";
            }
            if(!fac.isEmpty(params.endTime)){
            	params.endTime = params.endTime+" 23:59";
            }
            fac.getPageResult("/ovu-base/ovupark/backstage/customerUser/accountStatic",params,function(data){
                $scope.pageModel = data;
            });
        };
         $scope.find(1);
         vm.query = function(){
        	 $scope.find();
         }
         vm.getAllParkarea = function(){
         	$.post('/ovu-base/system/park/listAvaibleParkList', $scope.search, function(resp){
         		$scope.parkList = resp.data;
             });
         }
         vm.changeAccountType = function(){
         	$scope.search.parkId = '';
         }
    });
})();