(function() {
    var app = angular.module("angularApp");
    app.controller('ecoManageCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        angular.extend($rootScope,fac.dicts);
        document.title ="OVU-商品类型管理";
        $scope.productTypeData = [];
		$scope.productTypeList = [];
		$scope.productTypeSelect = [];
		$scope.newTypeArr = [];
		$scope.getTypeListsByList = function(){
			var param = {"UrlKey":$rootScope.UrlKey};
			$http.post("/ovu-park/backstage/ecommerce/ecprodtype/getTypeListsByList", param,fac.postConfig).success(function(response){
				if(response.code == 0&& response.data) {
					$scope.productTypeData = response.data;
					$scope.getLevelType("top",0);
				}
            });
		};
		$scope.getLevelType = function(parentId,level,selectType){
			if(selectType){
				if($scope.productTypeSelect[level-1] === selectType){ //点击已选中项
					return;
				}
				if(level-1 < $scope.productTypeSelect.length-1){
					$scope.productTypeSelect.splice(level-1, $scope.productTypeSelect.length-(level-1));
				}
				$scope.productTypeSelect[level-1] = selectType;  //对应的层级选中的项
				
				if(selectType.lastStage !== 1){ //没有下一级
					$scope.productTypeList.splice(level, $scope.productTypeList.length-level);
					$scope.productTypeList[level] = [];
					return;
				}
			}
			
			var typeArr = [];
			angular.forEach($scope.productTypeData, function(data, index, array) {
				if(data.parentId == parentId){
					data.lastStage = 0;
					angular.forEach($scope.productTypeData, function(d, i, arr) {
						if(data.id == d.parentId){
							data.lastStage = 1;
						}
					});
					typeArr.push(data);
				}
			});

			if(level < $scope.productTypeList.length-1){
				$scope.productTypeList.splice(level, $scope.productTypeList.length-level);
			}
			$scope.productTypeList[level] = typeArr;
		};
		
		$scope.addItem = function(i,list){
			if(list.length>=11&&list[0].parentId == 'top'){
				alert("最多只能有11个一级产品类型");
				return;
			}
			if($scope.newTypeArr[i]){
				var isRepetition = false;
				angular.forEach(list, function(data, index, array) {
					if(data.cateName == $scope.newTypeArr[i]){
						isRepetition = true;
					}
				});
				if(isRepetition){
					alert("此类型已存在,请勿重复添加！");
					return;
				}
				var loading = layer.load(2, {
				  shade: [0.1,'#fff'] //0.1透明度的白色背景
				});
				var parentId = "top";
				if(i > 0){
					parentId = $scope.productTypeSelect[i-1].id;
				}
				var param = {"cateId":"","cateName":$scope.newTypeArr[i],"parentId":parentId,"grade":i+1,"isleaf":"0","UrlKey":$rootScope.UrlKey,"lastStage":0};
				$http.post("/ovu-park/backstage/ecommerce/ecprodtype/saveOrEdit", param,fac.postConfig).success(function(response){
					if(response && response.code == 0 && response.data) {
						param.id = response.data.id;
						$scope.productTypeData.push(param);
						list.push(param);
						$scope.newTypeArr[i] = "";
						msg("添加成功！");
					}else{
						alert(response.message);
					}
					layer.close(loading);
	            });
			}
		};
		
		$scope.showEditModal = function(item,list,nowIndex){
			var copy = angular.extend({}, item);
			copy.list = list;
            var modal = $uibModal.open({
            	animation:true,
                size: 'md',
                templateUrl: '/view/ecommerce/commodityType/modalDetails.html',
                controller: 'commodityTypeEditCtrl',
                resolve: {demand: copy},
                backdrop: 'static',
                keyboard: false
            });
            modal.result.then(function (newData) {
            	if(newData){
            		if(newData.type == "edit"){
            			item.cateName = newData.cateName;
						msg("编辑成功！");
						$scope.getTypeListsByList();
            		}
            		if(newData.type == "delete"){
            			list.splice(list.indexOf(item), 1);
            			$scope.productTypeList.splice(nowIndex+1, $scope.productTypeList.length-(nowIndex+1));
            			var i = -1;
            			angular.forEach($scope.productTypeData, function(data, index, array) {
							if(data.id == item.id){
								i = index;
							}
						});
						if(i>= 0){
							$scope.productTypeData.splice(i, 1);
						}
						msg("删除成功！");
            		}
            	}
            }, function () {
                console.info('Modal approveDemandCtrl dismissed at: ' + new Date());
            });
		};
		
		$scope.getTypeListsByList();
    });

    app.controller('commodityTypeEditCtrl',function($scope,$rootScope, $http, $uibModalInstance, $filter, fac, demand, $uibModal){
        $scope.item = demand;
		$scope.imageUrlList = [];
        if(fac.isNotEmpty($scope.item.imageUrl)){
        	 $scope.imageUrlList.push($scope.item.imageUrl);
        }
        $scope.editName = function () {
        	var param = {"id": $scope.item.id, "cateName": $scope.item.cateName,"UrlKey":$rootScope.UrlKey};
        	if($scope.item.grade == 3){
        		$scope.item.imageUrl = $scope.imageUrlList[$scope.imageUrlList.length - 1];
        		if($scope.item.cateName){	
        			var typeIsRepetition = false;
            		var urlIsRepetition = false;
    				angular.forEach($scope.item.list, function(data, index, array) {
    					if(data.cateName == $scope.item.cateName){
    						typeIsRepetition = true;
    					}
    					if(data.imageUrl == $scope.item.imageUrl){
    						urlIsRepetition = true;
    					}
    				});
    				if(typeIsRepetition && urlIsRepetition){
    					alert("此类型和图片已存在！");
    					return;
    				}else{
    					param.imageUrl = $scope.item.imageUrl;
    				}
        		}
        	}else{
        		if($scope.item.cateName){
            		var isRepetition = false;
    				angular.forEach($scope.item.list, function(data, index, array) {
    					if(data.cateName == $scope.item.cateName){
    						isRepetition = true;
    					}
    				});
    				if(isRepetition){
    					alert("此类型已存在！");
    					return;
    				}
        		}
        	}
    		var loading = layer.load(2, {
			  shade: [0.1,'#fff'] //0.1透明度的白色背景
			});
        	$http.post("/ovu-park/backstage/ecommerce/ecprodtype/saveOrEdit", param,fac.postConfig).success(function(response){
				layer.close(loading);
				if(response && response.code == 0) {
					$uibModalInstance.close({"type":"edit","cateName":$scope.item.cateName});
				}
	        });
        }
        
        $scope.delItem = function () {
        	confirm("确认删除吗?",function(){
	        	var loading = layer.load(2, {
				  shade: [0.1,'#fff'] //0.1透明度的白色背景
				});
	        	var param = {"id": $scope.item.id,"UrlKey":$rootScope.UrlKey};
	        	$http.post("/ovu-park/backstage/ecommerce/ecprodtype/delTypeListsByID", param,fac.postConfig).success(function(response){
					layer.close(loading);
					if(response && response.code == 0) {
						$uibModalInstance.close({"type":"delete"});
					}
		        });
	        })
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})()