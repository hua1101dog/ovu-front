/**
 * Created by Ahuangyuan 2018-08-24
 */
(function() {
	"use strict";
    var app = angular.module("angularApp");
    app.controller('parkDrawingCtl', function($scope, $rootScope, $http, $filter, $uibModal, $timeout, fac,$sce) {
    	document.title = "OVU-图纸管理";
    	$scope.search={};
    	$scope.config = {edit:false};
    	$scope.item = {};
    	 app.modulePromiss.then(function() {
            $http.post("/ovu-base/system/dictionary/get",{},fac.postConfig).success(function(resp) {
                $rootScope.houseTypeTree =resp.data.HOUSE_TYPE;
                $rootScope.dicData=resp.data;
                //此代码写在外面会和该接口一样为异步操作，如果先执行该代码，此时并没有dicData会错误
                fac.initPage($scope, function() {
                    $scope.loadHouseTree();
                })
                //当前版本是否为项目版
                $scope.isGroup = app.curModule.isGroup === 2;
            });
            delete $rootScope.treeData1;
       });

    	$scope.selectNode = function(node) {
    		if ($scope.curNode != node) {
                $scope.curNode && $scope.curNode.state && ($scope.curNode.state.selected = false);
            }
            node.state = node.state || {};
            node.state.selected = !node.state.selected;

            if (node.state.selected) {
            	$scope.item = {};
            	$scope.curNode = node;
            	var level = node.level;
                switch(level){
                	case 1 :
                		$scope.item.stageId = node.id;
                		$scope.item.drawingType = 2;
                		break;
                	case 2 :
                		$scope.item.buildId = node.id;
                		$scope.item.drawingType = 3;
                		break;
                	case 3 :
                		let unitId = node.id;
                		let unitIds = unitId.split("_");
                		$scope.item.buildId = unitIds[1];
                		$scope.item.unitNo = unitIds[2];
                		$scope.item.drawingType = 4;
                		break;
                	case 4 :
                		let id = node.id;
                		let ids = id.split("_");
                		$scope.item.buildId = ids[1];
                		$scope.item.unitNo = ids[2];
                		$scope.item.groundNo = ids[3];
                		$scope.item.drawingType = 5;
                		break;
                }
                $scope.getOne($scope.item);
            } else {
                delete $scope.curNode;
                $scope.item = {};
            }
    	}




    	$scope.loadHouseTree = function() {
			$scope.item = {};
            $http.post("/ovu-base/system/parkStage/treeNew", {
                parkId: $scope.search.parkId,
                level:4
            }, fac.postConfig).success(function(treeData) {
                $rootScope.flatData = fac.treeToFlat(treeData);
                $rootScope.flatData.forEach(function(n) {
                    //n.floorId ? (n.isLeaf = true) : (n.isLeaf = false);
                    n.level===4 ? (n.isLeaf = true) : (n.isLeaf = false);
                });
                $rootScope.treeData1 = treeData;
                //没有这行代码，首次创建用户创建分期时点击node展示的结构和刷新后展示的结构不一致，导致多处逻辑错误
                $scope.treeData1 = treeData;
            });
        };

        $scope.addPositionPic = function() {
        	if(!$scope.curNode && !$scope.isGroup){
        		alert("请选择节点！");
        		return;
        	}
        	if($scope.isGroup){
        		if($scope.search.parkId && !$scope.item.id){
	        		$scope.item.parkId = $scope.search.parkId;
	        		$scope.item.drawingType = 1;
	        	}else if(!$scope.item.id){
	        		alert("请选择项目！");
	        		return;
	        	}
        	}


            fac.upload({ url: "/ovu-base/uploadFile" }, function(resp) {
                if (resp.success) {
                    var respData = resp.data;
                    if(!$scope.judgeUrlType(respData.url)){
                		alert("文件类型只能为jpg或pdf!");
                		return;
                	}
                    $scope.item.drawingUrl = respData.url;
                    $scope.imgType(true);
                    $scope.$apply();
                 //   $scope.save();
                } else {
                    alert(resp.error);
                }
            });
        }

        $scope.getOne = function(item){
    		$http.post("/ovu-base/system/parkDrawing/get",$scope.item).success(function(resp){
            	if(resp.code == 0){
            		if(resp.data){
            			$scope.item = resp.data;
            			$scope.imgType();
            		}
            	}else{
            		alert(resp.msg);
            	}
//          	$scope.$apply();
            })
    	}

        $scope.save = function(){
        	if(!$scope.item.drawingUrl){
        		alert("无有效图片信息");
        		return;
        	}
        	$http.post("/ovu-base/system/parkDrawing/save",$scope.item).success(function(resp){
            	if(resp.code == 0){
            		msg("保存成功");
            	}else{
            		alert(resp.msg);
            	}
            })
        }

        $scope.imgType = function(flag){
        	if($scope.item.drawingUrl){
        		$scope.item.showImg = $scope.item.drawingUrl.substring($scope.item.drawingUrl.length-4,
        			$scope.item.drawingUrl.length) == '.pdf' ?
        			true:false;
        	}
        	if($scope.item.showImg && !flag){
        		$scope.item.drawingUrl = $sce.trustAsResourceUrl($scope.item.drawingUrl);
        	}
        }

        //集团版切换项目
        $scope.getParkDrawing = function(){
        	$scope.item = {};
        	$scope.item.parkId = $scope.search.parkId;
        	$scope.item.drawingType = 1;

        	$scope.getOne($scope.item);
        }

        //判断图片类型
        $scope.judgeUrlType = function(url){
        	if(url && (url.substring(url.length-4,url.length) == ".jpg" ||
        		url.substring(url.length-4,url.length) == ".pdf")
        	)
        	{
        		return true;
        	}
        	return false;
        }
    })
})()
