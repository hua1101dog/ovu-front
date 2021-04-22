(function() {
    var app = angular.module("angularApp");
    app.controller('activityCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    	 document.title ="OVU-活动管理";
        angular.extend($rootScope,fac.dicts);
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
            fac.getPageResult("/ovu-park/backstage/operate/activity/list", $scope.search, function(resp){
           	 $scope.pageModel = resp;
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

        //审核活动
        $scope.approve= function(activity,activityType){
            confirm("确定审核 "+activity.title,function(){
                $http.post("/ovu-park/backstage/operate/activity/updateActivityType",{id: activity.id,activityType:activityType},fac.postConfig).success(function(resp){
                    if(resp.code == 0){
                        window.msg("审批成功！");
                        $scope.find();
                    }else{
                    	alert(resp.message);
                    }
                });
            })
        }
        
        //删除实体项目
        $scope.del= function(activity){
            confirm("确定删除活动	["+activity.title+"]?",function(){
                $http.post("/ovu-park/backstage/operate/activity/remove",{ids: activity.id},fac.postConfig).success(function(resp){
                    if(resp.code == 0){
                        window.msg("删除成功！");
                        $scope.find();
                    }else{
                    	alert(resp.message);
                    }
                });
            })
        }

        $scope.showNews = function (activity) {
        	if (!app.park) {
				windows.error("请先选择一个项目！");
				return false;
			}
        	activity = activity || {creatorId : app.user.id, creatorName : app.user.nickname};
        	activity.parkId = app.park.parkId;
        	activity.updatorId = app.user.id;
    		activity.pubishType="1";
            var um;
            var E;
            var editor;
            var copy = angular.extend({},activity);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/operationManage/activityManage/modal.editActivity.html',
                controller: 'editActivity'
                , resolve: {activity: copy}
            });
            modal.rendered.then(function(){
                //初始化UM
                E = window.wangEditor;
                editor = new E('#editor');
                editor.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片
                editor.create();
                if(activity.content){
                    editor.txt.html(activity.content);
                }
            });
            modal.result.then(function () {
                $scope.find(1);
            }, function () {
                /*console.info('Modal dismissed at: ' + new Date());*/
            });
        }

        $scope.showModal = function (activity) {
            activity = activity || {};
            var um;
            var copy = angular.extend({},activity);

            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                backdrop: 'static',
                keyboard: true,
                templateUrl:'/view/operationManage/activityManage/modal.showActivity.html',
                controller: 'lookModalCtrl'
                , resolve: {activity: copy}
            });
        };
        // 查看活动详情,主要是人数
        $scope.showDetail = function (activity) {
            activity = activity ||angular.extend({},$scope.search);
            if(activity.creatorName==null){
                activity.creatorName='admin';
            }
            var copy = angular.extend({},activity);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/operationManage/activityManage/activityEnroll.html',
                controller: 'details'
                , resolve: {activity: copy}
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
    app.controller('details',function($scope, $http, $uibModalInstance, $filter, fac,activity){
        $scope.search = {};
        $scope.pageModel = {};

        $scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;
            $scope.search.id = activity.id;
            fac.getPageResult("/ovu-park/backstage/operate/activity/getEnrollById",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };
        $scope.find();

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.item = activity;
    });

    app.controller('lookModalCtrl',function($scope, $http, $uibModalInstance, $filter, fac,activity, $uibModal){
        $scope.item = activity;
        $scope.item.applyRange = $scope.item.applyRange == 1 ? '不限范围' : '企业内部可见';
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    
    app.controller('editActivity',function($scope, $http, $uibModalInstance, $filter, fac,activity){
    	$scope.item = activity;
    	
    	$scope.item.pics = $scope.item.photo ?  $scope.item.photo.split(",") : [];
    	
        $scope.saveActivity = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return false;
            }

            
            if (item.maxPeople<item.countPeople) {
            	window.msg("修改的最大参与人数小于已报名人数，请确认后再修改！");
                return false;
            }
            if(item.pics.length > 1){
                window.msg("最多只能上传1张图片, 请删除多余的图片！");
                return false;
            }
            if(item.endTime<=item.beginTime){
                alert("活动结束时间不能早于开始时间！")
                return false;
            }
            if(item.deadline>item.beginTime){
                alert("报名截止时间不能晚于活动开始时间！")
                return false;
            }
            item.photo = item.pics.join(",");
            
            var content = $(".w-e-text").html()+"";
            $scope.item.content = content;
            // if(!$(".w-e-text").text()){
            //     window.alert("活动内容不能为空！");
            //     return false;
            // }
            var loading = layer.load(2, {
                shade: [0.1,'#fff'] //0.1透明度的白色背景
              });
            if(item.id){
                $.post("/ovu-park/backstage/operate/activity/saveOrEdit",{
                    parkId: item.parkId,
                    id: item.id,
                    creatorName: item.creatorName,
                    creatorId: item.creatorId,
                    updatorId: item.updatorId,
                    title: item.title,
                    sponsor: item.sponsor,
                    beginTime: item.beginTime,
                    endTime: item.endTime,
                    deadline: item.deadline,
                    maxPeople: item.maxPeople,
                    price: item.price,
                    place: item.place,
                    content: $scope.item.content,
                    photo: item.photo,
                    pubishType: "1"
                },function(resp){
                    layer.close(loading);
                    if(resp.code == 0){
                    	window.msg("修改成功！");
                        $uibModalInstance.close();
                    }else{
                        window.alert(resp.message);
                        /* UM.getEditor('myContent').destroy(); */
                       
                    }
                });
            }
            if(!item.id){
                $.post("/ovu-park/backstage/operate/activity/saveOrEdit",{
                    parkId: item.parkId,
                    creatorName: item.creatorName,
                    creatorId: item.creatorId,
                    updatorId: item.updatorId,
                    title: item.title,
                    sponsor: item.sponsor,
                    beginTime: item.beginTime,
                    endTime: item.endTime,
                    deadline: item.deadline,
                    maxPeople: item.maxPeople,
                    price: item.price,
                    place: item.place,
                    content: $scope.item.content,
                    photo: item.photo,
                    pubishType: "1"
                },function(resp){
                    layer.close(loading);
                    if(resp.code == 0){
                    	  window.msg("新增成功！");
                    	  $uibModalInstance.close();
                    }else{
                    	window.alert(resp.message);
                        /* UM.getEditor('myContent').destroy(); */
                       
                    }
                });
            }
        }

        $scope.cancel = function () {
            /* UM.getEditor('myContent').destroy(); */
            $uibModalInstance.dismiss('cancel');
        };
    });

    app.filter('trustHtml', function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
    });
})()