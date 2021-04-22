(function() {
    document.title ="OVU-空间历史";
    var app = angular.module("angularApp");
    app.controller('historyCtl', function ($stateParams,$state,$scope, $http,fac) {
        fac.loadSelect($scope,"HOUSE_TYPE");
        fac.loadSelect($scope,"HOUSE_IS_DECORATION");
        $scope.curHouseId = $stateParams.params;
        //console.log($scope.newestItem.data)
        $scope.search = {'houseId':$scope.curHouseId};
        $scope.pageModel = {};

        $scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;
            $http.post("/ovu-base/system/parkHouse/getHouseUnionInfo",{houseId:$scope.curHouseId},fac.postConfig).success(function(resp){
                if(resp.code){
                   $scope.detail = resp.data;
                   if($scope.detail.HOUSE_NO.length>30){
                	   var houseNo = $scope.detail.HOUSE_NO;
                	   $scope.detail.oldHouseNo = houseNo;
                	   $scope.detail.HOUSE_NO = houseNo.substring(0,31);
                   }
                }
            });
            
            fac.getPageResult("/ovu-base/system/houseHistory/findHouseHistory.do",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };
        app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	$scope.find();
            })
        });
        $http.post("/ovu-base/system/dictionary/get.do",{"item":'HISTORY_ACTION'},fac.postConfig).success(function(data){
            $scope.historyAction = angular.fromJson(data.dic_VAL);
        });

        $scope.getType = function(obj,value){
            var text = '';
            angular.forEach(obj,function(data,index,array) {
                if(value == data.value) {
                    text = data.text;
                }
            });
            return text;
        }

        // 回到空间维修主页面
        $scope.goSpace = function () {
            $state.go('three',{ folder: "projectSpace",catalogue: "spaceMaintain", page: "spaceIndex"})
        }

        /**
         跳转到工位历史详情页面
         */
        $scope.goPositionDetail = function(url,historyId){
            //$(".right_col").load(url,{'spaceId':historyId,"spaceType":"currentHistory"});
            $http.post(url,{'spaceId':historyId,"spaceType":"currentHistory"},fac.postConfig).success(function(resp){
                if(resp.code){
                    var resultList = resp.data;
                    $state.go('three', { folder: "projectSpace",catalogue: "spaceDetail", page: "spaceDetail" ,params:angular.toJson(resultList)});
                }
            });
        }
    });
})()