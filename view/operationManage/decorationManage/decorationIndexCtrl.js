(function() {
    var app = angular.module("angularApp");
    app.controller('decorationCtr', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    	document.title ="OVU-装修申请管理";
        angular.extend($rootScope,fac.dicts);
        $scope.search = {
            applyType:1,
            parkId:app.park.ID
        };
        $scope.pageModel = {};
        $scope.isShow = true;

        $scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;
            if($scope.pageModel.currentPage){
                delete $scope.pageModel.currentPage;
            }
            $(".div-panel").removeClass("div-active");
            if($scope.search.applyStatus == undefined){
            	$(".div-group").find("div").eq(0).addClass("div-active");
            }else if( $scope.search.applyStatus == 0){
            	$(".div-group").find("div").eq(1).addClass("div-active");
            }else if($scope.search.applyStatus == 1){
            	$(".div-group").find("div").eq(2).addClass("div-active");
            }else if($scope.search.applyStatus == 2){
            	$(".div-group").find("div").eq(3).addClass("div-active");
            }
            var param = angular.copy($scope.search);
            if(!fac.isEmpty($scope.search.startCreateTime)){
            	param.startCreateTime = $scope.search.startCreateTime+" 00:00:00";
     	    }
        	if(!fac.isEmpty($scope.search.endCreateTime)){
        		param.endCreateTime = $scope.search.endCreateTime+" 23:59:59";
     	    }
            fac.getPageResult("/ovu-park/backstage/occupationApply/list",param,function(data){
                $scope.pageModel = data;
            });
        };

        $scope.searchByTab = function(event,type){
            $(".div-panel").removeClass("div-active");
            $(event.target).addClass("div-active");
            delete $scope.pageModel.currentPage;
            if("request"==type){
                $scope.search.applyStatus=0;
            }else if("sured"==type){
                $scope.search.applyStatus=1;
            }else if("passed"==type){
            	$scope.search.applyStatus=2;
            }else if("all" == type){
                $scope.search.applyStatus=undefined;
            }
            app.modulePromiss.then(function() {
                fac.initPage($scope,function(){
                	$scope.find();
                })
            });
        }

        /**
         确认
         */
        $scope.sured = function(id,type){
            var obj = {
            		id:id,
            		applyStatus:type,
            		updatorId:app.user.ID
            }
            $.ajax({
                type:'post',
                url:'/ovu-park/backstage/occupationApply/updateApplyStatus',
                data:obj,
                success:function(responseData){
                    if(responseData.code){
                    	window.msg(responseData.message);
                        $scope.find();
                    }else{
                    	window.alert(responseData.message);
                    }
                }
            })
        }

        /**
         获得该申请的状态
         */
        $scope.getApplyStatus = function(param){
            var str = "";
            if(0==param){
                str = "审核中";
            }else if(1==param){
                str = "通过";
            }else if(2==param){
                str = "不通过";
            }
            return str;
        }

        app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	$scope.find();
            })
        });

        //0-审核中 1-通过 2-不通过
        $scope.applyStatus = [{
            text:"审核中",
            value:0
        },{
            text:"通过",
            value:1
        },{
            text:"不通过",
            value:2
        }];
    });
})()
