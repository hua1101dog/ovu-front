(function() {
    var app = angular.module("angularApp");
    app.controller('changePropertyCtr', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    	document.title ="OVU-产权变更管理";
        angular.extend($rootScope,fac.dicts);
        $scope.search = {}; 
        $scope.pageModel = {};
        $scope.isShow = true;
        $scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;
            if(!$scope.search.changeSpaceType){
                $scope.search.changeSpaceType = "house";
            }
            fac.getPageResult("/ovu-base/system/propertyChange/findPropertyChange",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };

        /**
         确认
         */
        $scope.sured = function(id,approveStatus,changeSpaceType){
            var param = {
                id:id,
                approveStatus:approveStatus,
                changeSpaceType:changeSpaceType,
                userId:app.user.ID
            }
            $.ajax({
                type:'post',
                url:'/ovu-base/system/propertyChange/checkChange',
                data:param,
                success:function(responseData){
                    if(responseData){
                        if(responseData.code){
                            window.msg(responseData.message);
                            $scope.find();
                        }else{
                            window.alert(responseData.message);
                        }
                    }
                }
            })
        }

        /**
         获得该审核的状态
         1-待审核 2-审核通过 3-驳回
         */
        $scope.getApproveStatus = function(param){
            var str = "";
            if(1==param){
                str = "待审核";
            }else if(2==param){
                str = "审核通过";
            }else if(3==param){
                str = "驳回";
            }
            return str;
        }


        /**
         获得该审核的状态
         1-房屋 2-车位 3-工位
         */
        $scope.getSpaceTypeName = function(param){
            var str = "";
            if(1==param){
                str = "房屋";
            }else if(2==param){
                str = "车位";
            }else if(3==param){
                str = "工位";
            }
            return str;
        }

        /**
         获得该审核的状态
         1-出租  2-出售
         */
        $scope.getRequestTypeName = function(param){
            var str = "";
            if(1==param){
                str = "出租";
            }else if(2==param){
                str = "出售";
            }
            return str;
        }

        app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	$scope.find();
            })
        });

    });
})();
