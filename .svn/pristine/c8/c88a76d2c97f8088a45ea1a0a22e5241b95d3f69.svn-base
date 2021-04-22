(function() {
		var app = angular.module("angularApp");
		app.controller('ecoAdvertisingListCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
			angular.extend($rootScope,fac.dicts);
			document.title ="OVU-广告图片管理";
			$scope.search = {"imgType":""};
			$scope.statusModel = [
				{"name":"--全部--","id":""},
				{"name":"轮播","id":0},
				{"name":"静态","id":1},
				{"name":"热销","id":2}
			];
			$scope.pageModel = {};
			$scope.find = function(pageNo){
				$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
				$scope.search.pageIndex = $scope.search.currentPage-1;
				$scope.search.totalCount = $scope.pageModel.totalCount||0;
				$scope.search.UrlKey = $rootScope.UrlKey;
				fac.getPageResult("/ovu-park/backstage/ecommerce/billBoardManage/getBillboardListsByGrid",$scope.search,function(data){
					$scope.pageModel = data;
				});
			};
			
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
	        
	        $scope.deleteAdvertising = function(aid){
	        	confirm("确认删除吗?",function(){
			    	var param = {};
			    	param.UrlKey = $rootScope.UrlKey;
			    	param.id = aid;
		            $http.post("/ovu-park/backstage/ecommerce/billBoardManage/delBillboardListsByID", param,fac.postConfig).success(function(response){
		               if(response && response.code == 0) {
		               		$scope.find(1);
	            			msg("删除成功！");
		               }
		            });
	            })
		    };
	       
	        $scope.showApproveModal = function (advertising) {
	        	advertising = advertising || {};
	            var copy = angular.extend({}, advertising);

	            var modal = $uibModal.open({
	            	animation:true,
	                size: 'md',
	                templateUrl: '/view/ecommerce/advertising/modalDetails.html',
	                controller: 'viewAdvertisingCtrl',
	                resolve: {advertising: copy},
	                backdrop: 'static',
	                keyboard: false
	            });
	            
	            modal.result.then(function (data) {
	            	if(data.code == 0){
	            		$scope.find(1);
	            		msg("提交成功！");
	            	}
	            }, function () {
	                console.info('Modal approveDemandCtrl dismissed at: ' + new Date());
	            });
	        };
			
			!function(){
				$scope.find(1);
			}();
		});
		
		app.controller('viewAdvertisingCtrl',function($scope,$rootScope, $http, $uibModalInstance, $filter,$uibModal, fac, advertising){
	        $scope.item = advertising;  
	        if(!$scope.item.imgType){
	        	$scope.item.imgType = "0";
	        }
	        $scope.imageList =[];
	        $scope.goods = {};
	        if($scope.item.prodName){
	        	$scope.goods.prodName = $scope.item.prodName;
	        }
	        if($scope.item.imgUrl){
	        	$scope.imageList.push($scope.item.imgUrl);
	        }
	        // 图片上传 
		    $scope.addFile =function(imgArr){
		        $rootScope.addPhoto(imgArr,0);
		    };
		    
		    $scope.showApproveModal = function () {
	        	advertising = advertising || {};
	            var copy = {};

	            var modal = $uibModal.open({
	            	animation:true,
	                size: 'md',
	                templateUrl: '/view/ecommerce/advertising/modalGoods.html',
	                controller: 'viewGoodsListCtrl',
	                resolve: {advertising: copy},
	                backdrop: 'static',
	                keyboard: false
	            });
	            
	            modal.result.then(function (data) {
	            	if(data){
	            		$scope.goods = data;
	            	}
	            }, function () {
	                console.info('Modal approveDemandCtrl dismissed at: ' + new Date());
	            });
	        };

		    $scope.saveAdvertising = function(){
		    	if($scope.item.imgType === undefined || $scope.item.imgType === null){
		    		alert("请选择图片类型！");
                	return;
		    	}
		    	if(!$scope.item.adContent){
		    		alert("请填写图片名称！");
                	return;
		    	}
		    	if($scope.item.adSort === undefined || $scope.item.adSort === null){
		    		alert("请填写排序！");
                	return;
		    	}
		    	if($scope.imageList.length === 0){
		    		alert("请上传图片！");
                	return;
		    	}
		    	if($scope.goods.id){
		    		$scope.item.prodId = $scope.goods.id;
		    		$scope.item.price = $scope.goods.price;
		    	}
		    	if(!$scope.item.prodId){
		    		alert("请选择商品！");
                	return;
		    	}
		    	var param = angular.copy($scope.item);
		    	param.UrlKey = $rootScope.UrlKey;
		    	param.imgUrl = $scope.imageList[0];
				param.createId = $rootScope.user.LOGIN_NAME;
	            $http.post("/ovu-park/backstage/ecommerce/billBoardManage/saveOrEdit", param,fac.postConfig).success(function(response){
	               if(response && response.code == 0) {
	            	    msg('操作成功');
	               		$uibModalInstance.close({"code":response.code});
	               }else{
	            	   alert(response.message);
	               }
	            });
	        };
		    
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
	    
	    app.controller('viewGoodsListCtrl',function($scope,$rootScope, $http, $uibModalInstance, $filter,$uibModal, fac, advertising){
	        angular.extend($rootScope,fac.dicts);
			$scope.search = {"status":1,"prodStatus":1};
			$scope.selGoods = {};
			$scope.statusModel = [
				{"name":"待审核","id":2},
				{"name":"已审核","id":1},
				{"name":"未通过","id":0}
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
			
			$scope.setSelGoods = function(goods){
				$scope.selGoods = goods;
			}
			
			$scope.submitGoods = function(){
				$uibModalInstance.close($scope.selGoods);
			}
	        !function(){
				$scope.find(1);
			}();
	        
	        $scope.cancel = function () {
	            $uibModalInstance.dismiss('cancel');
	        };
	    });
	})()
	
	