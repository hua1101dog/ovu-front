(function() {
    var app = angular.module("angularApp");
    app.controller('postingCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    	document.title ="OVU-留言管理";
        angular.extend($rootScope,fac.dicts);
        $scope.currentNum = 3;
        $scope.search = {};
        $scope.pageModel = {};

        $scope.find = function(pageNo){
        	if($scope.pageModel.currentPage){
                delete $scope.pageModel.currentPage;
            }
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;
            if($("#search_date1").val()){
                $scope.search.fromCreateTime = $("#search_date1").val() + " 00:00:00";
            }else{
                delete $scope.search.fromCreateTime;
            }
            if($("#search_date2").val()){
                $scope.search.toCreateTime = $("#search_date2").val()+ " 23:59:59";
            }else{
                delete $scope.search.toCreateTime;
            }
            fac.getPageResult("/ovu-park/backstage/posting/list", $scope.search,function(data){
                $scope.pageModel = data;
            });
        };
        app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	$scope.find(1);
            })
        });
        $scope.query = function(){
        	fac.initPage($scope, function () {
                $scope.find(1);
            })
        }
        //设置留言状态
        $scope.setCurrentNum=function(num){
            $scope.currentNum = num;
            if(num != 3){
                $scope.search.status = num + "";
            }else{
                delete $scope.search.status;
            }

            app.modulePromiss.then(function() {
                fac.initPage($scope,function(){
                	$scope.find(1);
                })
            });
        }

        //删除留言信息
        $scope.del = function(ids){
            $.post("/ovu-park/backstage/posting/remove",{ids: ids},function(resp){
                if(resp.code == 0){
                    window.msg("删除成功!");
                    $scope.find();
                }else{
                    window.alert(resp.message);
                }
            });
        };

        //批量操作
        $scope.batchOpt = function(pageModal, optType){
            var ids="";
            confirm("确定删除所选择留言吗?",function(){
                var datas = pageModal.data;
                for(var i=0; i<datas.length;i++){
                    if(datas[i].checked){//过滤掉已发送的通知
                        ids += datas[i].id;
                        if(i<datas.length-1){
                            ids += ",";
                        }
                    }
                }
                $scope.del(ids);
            });
        };

        //删除通知信息
        $scope.delItem= function(message){
            confirm("确定删除留言 ["+message.title+"]?",function(){
                $scope.del(message.id);
            });
        };
        
        $scope.showReplyModal = function (posting,replyStatus) {
            posting = posting || {};
            posting.parkId = app.park.parkId;
            posting.updatorId = app.user.id;
            posting.replyStatus = replyStatus;
            var copy = angular.extend({},posting);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/operationManage/messageBoard/modal.reply.html',
                controller: 'replyCtrl',
                resolve: {posting: copy},
                backdrop: 'static',
                keyboard: false
            });
            modal.rendered.then(function(){
                $(".preApprovePosting").html(copy.content);
            });
            modal.result.then(function () {
                $scope.find($scope.pageModel.currentPage);
            }, function () {
                console.info('Modal ApprovePostingCtrl dismissed at: ' + new Date());
            });
        };

    });

    app.filter("convertTitle",function(){//转换留言标题
    	 return function(title) {
         	if(angular.isUndefined(title) || title == ''){
         		title = '--';
         	}else{
         		if(title.length > 16){
                     title = title.substring(0, 16) + "...";
                 }
         	}
             return title;
         }
    });

    app.controller('replyCtrl',function($scope, $http, $uibModalInstance, $filter, fac,posting, $uibModal){
        $scope.item = posting;
        $scope.save = function () {
        	$scope.item.approverId = app.user.id;
        	var params = angular.copy($scope.item);
        	delete params.replyStatus;
            $.post("/ovu-park/backstage/posting/saveOrEdit", params, function(resp){
                if(resp.code == 0){
                	window.msg("操作成功!");
                    $uibModalInstance.close();
                }else{
                	 window.alert(resp.message);
                }
            });
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})()