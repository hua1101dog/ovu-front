(function() {
    var app = angular.module("angularApp");
    app.controller('newsCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    	document.title ="OVU-新闻管理";
        angular.extend($rootScope,fac.dicts);
        $scope.search = {};
        $scope.pageModel = {};
        $scope.isShow = true;

        $scope.find = function(pageNo){
        	if(!app.park || !app.park.parkId){
 				window.msg("请先选择一个项目!");
 				return false;
 			}
     		if($scope.pageModel.currentPage){
                delete $scope.pageModel.currentPage;
            }
     		$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;
            fac.getPageResult("/ovu-park/backstage/operate/news/list",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };

        app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	$scope.find();
            })
        });
        
        //删除实体项目
        $scope.del= function(news){
            confirm("确定删除 "+news.title,function(){
                $http.post("/ovu-park/backstage/operate/news/remove",{ids: news.id},fac.postConfig).success(function(resp){
                    if(resp.code == 0){
                        window.msg("删除成功!");
                        $scope.find();
                    }else{
                    	alert(resp.message);
                    }
                });
            })
        };

        $scope.showNews = function (news) {
        	if (!app.park) {
				windows.error("请先选择一个项目!");
				return false;
			}
        	news = news || {creatorId : app.user.id, creatorName : app.user.nickname};
        	news.parkId = app.park.parkId;
        	news.updatorId = app.user.id;
            var copy = angular.extend({},news);
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/operationManage/newsManage/modal.editNewsCenter.html',
                controller: 'AAAA'
                , resolve: {news: copy}
            });
            modal.result.then(function () {
                if($scope.pageModel.data.length == 1 && $scope.pageModel.currentPage > 1){
                    $scope.pageModel.currentPage = $scope.pageModel.currentPage -1;
                }
                $scope.find(1);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
            /*modal.rendered.then(function(){
                console.log("Modal rendered");
                $("#avatar").dropzone({
                    url: "/ovu-park/upload/img.do",
                    acceptedFiles:".png,.jpg,.jpeg,.gif",
                    init: function() {
                        this.on("success", function(file,json) {
                            if(json && json.status==1){
                                copy.PHOTO = json.url;
                                $scope.$apply();
                            }else{
                                alert("上传失败！");
                            }
                        });
                    }
                });
            });*/
        }

    });
    app.controller('AAAA',function($scope, $http, $uibModalInstance, $filter, fac,news){
    	$scope.item = news;
    	$scope.item.pics = $scope.item.photo ?  $scope.item.photo.split(",") : [];
        $scope.item.type = news.type+"";
        $scope.saveNews = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            if(item.pics.length < 1){
                window.msg("请上传图片!");
                return false;
            }
            if(item.pics.length > 1){
                window.msg("最多只能上传1张图片, 请删除多余的图片!");
                return false;
            }
            item.photo = item.pics.join(",");
            // $uibModalInstance.close();
            if(item.id){
                $http.post("/ovu-park/backstage/operate/news/saveOrEdit",item,fac.postConfig).success(function(resp){
                    if(resp.code == 0){
                        $uibModalInstance.close();
                    	window.msg("修改成功!");
                       
                    }else{
                    	alert("操作 失败!");
                    }
                });
            }
            if(!item.id){
                $http.post("/ovu-park/backstage/operate/news/saveOrEdit",item,fac.postConfig).success(function(resp){
                    if(resp.code == 0){
                        $uibModalInstance.close();
                    	window.msg("新增成功!");
                    }else{
                    	alert("操作失败!");
                    }
                });
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})();
