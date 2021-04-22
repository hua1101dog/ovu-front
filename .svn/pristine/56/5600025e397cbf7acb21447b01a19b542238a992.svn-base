(function() {
	var app = angular.module("angularApp");
	app.controller('commodityReleaseCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
		angular.extend($rootScope,fac.dicts);
		document.title ="OVU-商品发布管理";
		$scope.search = {};
		$scope.statusModel = [
			{"name":"待审核","id":0},
			{"name":"已审核","id":1},
			{"name":"未通过","id":2}
		];
		$scope.pageModel = {};
		
		$scope.find = function(pageNo){
			$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
			$scope.search.pageIndex = $scope.search.currentPage-1;
			$scope.search.totalCount = $scope.pageModel.totalCount||0;
			$scope.search.UrlKey = $rootScope.UrlKey;
			fac.getPageResult("/ovu-park/backstage/ecommerce/publishGoods/getPublishGoodsByGrid",$scope.search,function(data){
				$scope.pageModel = data;
			});
		};
		
		$scope.shopEditStatus = function(commodity,state){
			confirm('确定要审核吗！', function () {
				var loading = layer.load(2, {
				  shade: [0.1,'#fff'] //0.1透明度的白色背景
				});
				var param = {
					"UrlKey":$rootScope.UrlKey,
					"id":commodity.id,
					"status":state
				};
				$.post("/ovu-park/backstage/ecommerce/publishGoods/updateEditStuat", param, function(resp){
	                if(resp.code == 0){
	                	commodity.status = state;
            			$scope.$apply();
	                	msg("提交成功！");
	                }else{
	                	alert(resp.message);
	                }
	                layer.close(loading);
	            });
			});
        }
		/**
		 * 设置需求行业
		 */
        $scope.getStatus = function(sid){
        	var name = "";
        	var len = $scope.statusModel.length;
        	for(var i = 0; i < len; i++){
        		var temp = $scope.statusModel[i];
        		if(sid == temp.id){
        			name = temp.name;
        		}
        	}
        	return name;
        }
        
        /**
         * 查看订单
         */
        $scope.showApproveModal = function (commodity) {
        	commodity = commodity || {};
        	commodity.statusName = $scope.getStatus(commodity.status);
            var copy = angular.extend({}, commodity);

            var modal = $uibModal.open({
            	animation:true,
                size: 'md',
                templateUrl: '/view/ecommerce/commodity/modalDetails.html',
                controller: 'viewCommodityCtrl',
                resolve: {commodity: copy},
                backdrop: 'static',
                keyboard: false
            });
            modal.result.then(function () {
            	
            }, function () {
                console.info('Modal approveDemandCtrl dismissed at: ' + new Date());
            });
        };
			$scope.find(1);
	});
	app.controller('viewCommodityCtrl',function($scope, $http, $uibModalInstance, $filter, fac, commodity, $uibModal){
        $scope.item = commodity;  
		$scope.item.picList = [];
		$scope.item.contentList = [];
		if(commodity.imageUrl && commodity.imageUrl.split(',').length>0){
			$scope.item.picList = commodity.imageUrl.split(',');
		}
		if(commodity.content && commodity.content.split(',').length>0){
			$scope.item.contentList = commodity.content.split(',');
		}
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        
        $scope.pimg= function($event){ 
	        var _this = $($event.target);//将当前的pimg元素作为_this传入函数    
	        imgShow("#outerdiv", "#innerdiv", "#bigimg", _this);    
	    };    
	
	    
	    function imgShow(outerdiv, innerdiv, bigimg, _this){    
		    var src = _this.attr("src");//获取当前点击的pimg元素中的src属性    
		    $(bigimg).attr("src", src);//设置#bigimg元素的src属性    
		    
		        /*获取当前点击图片的真实大小，并显示弹出层及大图*/    
		    $("<img/>").attr("src", src).load(function(){    
		        var windowW = $(window).width();//获取当前窗口宽度    
		        var windowH = $(window).height();//获取当前窗口高度    
		        var realWidth = this.width;//获取图片真实宽度    
		        var realHeight = this.height;//获取图片真实高度    
		        var imgWidth, imgHeight;    
		        var scale = 0.8;//缩放尺寸，当图片真实宽度和高度大于窗口宽度和高度时进行缩放    
		            
		        if(realHeight>windowH*scale) {//判断图片高度    
		            imgHeight = windowH*scale;//如大于窗口高度，图片高度进行缩放    
		            imgWidth = imgHeight/realHeight*realWidth;//等比例缩放宽度    
		            if(imgWidth>windowW*scale) {//如宽度扔大于窗口宽度    
		                imgWidth = windowW*scale;//再对宽度进行缩放    
		            }    
		        } else if(realWidth>windowW*scale) {//如图片高度合适，判断图片宽度    
		            imgWidth = windowW*scale;//如大于窗口宽度，图片宽度进行缩放    
		                        imgHeight = imgWidth/realWidth*realHeight;//等比例缩放高度    
		        } else {//如果图片真实高度和宽度都符合要求，高宽不变    
		            imgWidth = realWidth;    
		            imgHeight = realHeight;    
		        }    
		                $(bigimg).css("width",imgWidth);//以最终的宽度对图片缩放    
		            
		        var w = (windowW-imgWidth)/2;//计算图片与窗口左边距    
		        var h = (windowH-imgHeight)/2;//计算图片与窗口上边距    
		        $(innerdiv).css({"top":h/2, "left":w/2.8});//设置#innerdiv的top和left属性    
		        $(outerdiv).fadeIn("fast");//淡入显示#outerdiv及.pimg    
		    });    
		        
		    $(outerdiv).click(function(){//再次点击淡出消失弹出层    
		        $(this).fadeOut("fast");    
		    });    
		}
    });
})()
	
	