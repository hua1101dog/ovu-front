(function() {
    var app = angular.module("angularApp");
    app.controller('groupNewsCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        angular.extend($rootScope,fac.dicts);
        document.title ="OVU-新闻管理";
        $scope.search = {};
        $scope.pageModel = {};
        $scope.isShow = true;

        $scope.find = function(pageNo){
        	if($scope.pageModel.currentPage){
                delete $scope.pageModel.currentPage;
            }
     		$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;
            fac.getPageResult("/ovu-park/backstage/group/operate/news/list",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };
        $scope.find();
        //删除实体项目
        $scope.del= function(news){
            confirm("确定删除 "+news.title,function(){
                $http.post("/ovu-park/backstage/group/operate/news/remove",{ids: news.id},fac.postConfig).success(function(resp){
                	if(resp.code == 0){
                        window.msg("删除成功!");
                        $scope.find();
                    }else{
                    	alert(resp.message);
                    }
                });
            })
        }
        
        //是否集团官网展示
        $scope.approve = function (news, status) {
        	var str = "";
        	if (status == 1) {
				str = "确定在官网展示  [";
			}else {
				str = "确定在官网隐藏  ["
			}
        	confirm(str + news.title + "]",function(){
                $http.post("/ovu-park/backstage/group/operate/news/updateStatus",{id: news.id,status:status},fac.postConfig).success(function(resp){
                    if(resp.code == 0){
                        window.msg("操作成功!");
                        $scope.find();
                    }else{
                    	alert(resp.message);
                    }
                });
            })
        }
        
        
        //新增/编辑新闻
        $scope.showNews = function (news) {
        	news = news || {creatorId : app.user.id, creatorName : app.user.nickname};
        	news.updatorId = app.user.id;
            var copy = angular.extend({},news);
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/operationManage/groupNewsManage/modal.editNewsCenter.html',
                controller: 'AAAA'
                , resolve: {news: copy}
            });
            modal.result.then(function () {
                if($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1){
                    $scope.pageModel.currentPage = $scope.pageModel.currentPage -1;
                }
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

    });
    app.controller('AAAA',function($scope, $http, $uibModalInstance, $filter, fac,news){
    	$scope.item = news;
    	$scope.item.pics = $scope.item.photo ?  $scope.item.photo.split(",") : [];
    	
        $scope.saveNews = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            if(item.pics.length < 1){
                window.msg("请上传图片!")
                return false;
            }
            if(item.pics.length > 1){
                window.msg("最多只能上传1张图片, 请删除多余的图片!")
                return false;
            }
            item.photo = item.pics.join(",");
            
            if(item.id){
                $.post("/ovu-park/backstage/group/operate/news/saveOrEdit",item,function(resp){
                    if(resp.code == 0){
                         window.msg("修改成功!");
                         $uibModalInstance.close();
                    }else{
                        alert("操作 失败!");
                        $scope.cancel();
                    }
                });
            }
            if(!item.id){
                $.post("/ovu-park/backstage/group/operate/news/saveOrEdit",item,function(resp){
                	if(resp.code == 0){
                         window.msg("新增成功!");
                         $uibModalInstance.close();
                   }else{
                       alert("操作 失败!");
                       $scope.cancel();
                   }
                });
            }
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})();