/**
 * Created by huangyuan 2018-09-06
 */
(function() {
	"use strict";
    var app = angular.module("angularApp");
    app.controller('parkBlueprintCtl', function($scope, $rootScope, $http, $filter, $uibModal, $timeout,$q, fac,$sce) {
    	document.title = "OVU-图纸管理";
    	$scope.search={};
    	$scope.config = {edit:true};
    	$scope.item = {};
    	//保存按钮是否可操作
    	$scope.saveBtnStatus = false;
    	
    	 app.modulePromiss.then(function() {
            /*$http.post("/ovu-base/system/dictionary/get",{},fac.postConfig).success(function(resp) {
                $rootScope.houseTypeTree =resp.data.HOUSE_TYPE;
                $rootScope.dicData=resp.data;
                //此代码写在外面会和该接口一样为异步操作，如果先执行该代码，此时并没有dicData会错误
                fac.initPage($scope, function() {
                    $scope.loadTree();
                })
                //当前版本是否为项目版
                $scope.isGroup = app.curModule.isGroup === 2;
            });*/
            initDeptWatch();
       });
       
       function initDeptWatch(){
            $scope.$watch('dept', function (dept, oldValue) {
            	if(!$scope.search){
            		$scope.search = {};
            	}
                if(dept.id != $scope.search.deptId){
                	$scope.search.parkId = dept.parkId;
                	$scope.search.deptId = dept.id;
                	$scope.search.deptName = dept.deptName;
                	delete $rootScope.BlueprintTree;
                	delete $scope.BlueprintTree;
                }
                if($scope.search.deptId){
					getTree()
                	
                }
            },true)
		}
		function getTree(){
			$scope.item=[]
			fac.setParkBlueprint({
				parkId: $scope.search.parkId,deptId:$scope.search.deptId
			},$scope);
		}
    	
    	//树增删改
    	//////////////////////////////////////////////////
    	$scope.addTopNode = function(){
    		if(!$scope.search.deptId){
    			alert("请选择部门！");
    			return;
    		}
    		var item = {};
    		item.parkId = $scope.search.parkId;
    		item.deptId = $scope.search.deptId;
    		item.pid = '0';
    		item.pids = '0';
        	if(!$scope.search.deptId){
        		console.log("调用链错误");
        	}
        	$scope.addOrEditNode(item);
    	}
    	
    	$scope.addSon = function(node){
    		var item = {};
    		item.pid = node.id;
    		item.parkId = node.data.parkId;
    		item.deptId = node.data.deptId;
    		item.pids = node.data.pids + "," + node.id;
    		
    		$scope.addOrEditNode(item);
    	}
    	
    	$scope.editNode = function(node){
    		var item = node.data;
    		
    		$scope.addOrEditNode(item);
    	}
    	
    	$scope.addOrEditNode = function(item){
    		if(!item){//新增一级节点
    			return;
    		}
    		item.parkName = $scope.search.parkName;
    		var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: 'space/modal.editBlueprint.html',
                controller: 'editBlueprintCtrl',
                resolve: {
                    item: function () {
                        if (item) {
                            // return angular.extend({}, stage);
                            return angular.extend({ parkId: $scope.search.parkId,
                            	deptId:$scope.search.deptId,deptName: $scope.search.deptName}, item);
                        } else {
                            return { parkId: $scope.search.parkId ,deptId:$scope.search.deptId};
                        }
                    }
                }
            });
            modal.result.then(function (data) {
                getTree()
                if (item) {
				
					angular.extend(item, data)
				
				
					
					console.log(item)
                } else {
                    if (!$scope.BlueprintTree) {
                        $scope.BlueprintTree = [];
                    }
                    $scope.BlueprintTree.push(data);
                }
                delete $scope.curNode;
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
    	}
    	
    	$scope.delNode = function(node){
    		if(node.nodes && node.nodes.length>0){
    			alert("此节点下存在子节点，无法删除！");
    		}else if(node.data && node.data.url){
    			alert("此节点关联图纸，无法删除！");
    		}
    		else {
    			confirm("是否确定删除 " + node.text, function () {
                     $scope.del(node);   
                });
    		}
    	}
    	//////////////////////////////////////////////////
    	//节点增删改查（接口）
    	$scope.editOne = function(item){
    		$http.post("/ovu-base/system/parkBlueprint/edit",item).success(function(result){
    			if(result.code == 0){
    				if(item.id){
    					msg("编辑成功！");
    				}else{
    					msg("新增成功！");
    				}
    			}else{
    				alert(result.msg);
    			}
    		})
    	}
    	
    	$scope.getOne = function(item){
    		$http.post("/ovu-base/system/parkBlueprint/get",item).success(function(resp){
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
    	
    	$scope.del = function(node){
    		$http.post("/ovu-base/system/parkBlueprint/del", { ids: node.id },fac.postConfig).success(function (ret) {
                //if (ret == "success") {
                if (ret.code == 0) {
                    getTree();
                    msg("删除成功！");
//                  $scope.$apply();
                } else {
                    alert('删除失败！');
//                              alert(ret.msg);
                }
            })
    	}
    	
    	$scope.getparentNode = function(node){
    		var stack = new Array();
    		for(let i=0;i<$scope.BlueprintTree.length;i++){
    			stack.push($scope.BlueprintTree[i]);
    		}
    		var iter;
    		var ret;
    		while(stack.length>0){
    			iter = stack.pop();
    			if(iter.id == node.parentId){
    				ret = iter;
    				break;
    			}
    			if(iter.nodes && iter.nodes.length>0){
    				for(let i=0;i<iter.nodes.length;i++){
    					stack.push(iter.nodes[i]);
    				}
    			}
    		}
    		return ret;
    	}
    	
    	$scope.changeNodeUrl = function(node){
    		var stack = new Array();
    		for(let i=0;i<$scope.BlueprintTree.length;i++){
    			stack.push($scope.BlueprintTree[i]);
    		}
    		var iter;
    		var ret;
    		while(stack.length>0){
    			iter = stack.pop();
    			if(iter.id == node.id){
    				iter.data.url = node.url;
    			}
    			if(iter.nodes && iter.nodes.length>0){
    				for(let i=0;i<iter.nodes.length;i++){
    					stack.push(iter.nodes[i]);
    				}
    			}
    		}
    	}
    	////////////////////////////////////////////////////
    	$scope.selectNode = function(item,node) {
    		//切换时，保存按钮置灰
    		$scope.saveBtnStatus = false;
    		if ($scope.curNode != node) {
                $scope.curNode && $scope.curNode.state && ($scope.curNode.state.selected = false);
            }
            node.state = node.state || {};
        //    node.state.selected = !node.state.selected;
            if($scope.curNode != node){
            	 $scope.curNode = node;
            	 
            	 $scope.item = {};
            	 $scope.item.id = node.id;
            	 $scope.item.text = node.data.text;
            	 $scope.item.pid = node.data.pid;
            	 $scope.item.pids = node.data.pids;
            	 $scope.item.url = node.data.url;
            	 $scope.imgType();
            }else{
            	delete $scope.curNode;
            	delete $scope.item ;
            }
    	}
        
   
        
        $scope.addPositionPic = function() {
        	if(!$scope.curNode){
        		alert("请选择节点！");
        		return;
        	}
        	
            fac.upload({ url: "/ovu-base/uploadFile" }, function(resp) {
                if (resp.success) {           
                    var respData = resp.data;
                    if(!$scope.judgeUrlType(respData.url)){
                		alert("文件类型只能为jpg或pdf!");
                		return;
                	}
                    $scope.item.url = respData.url;
                    $scope.imgType(true);
                    
                    $scope.saveBtnStatus = true;
                    $scope.$apply();
                 //   $scope.save();
                } else {
                    alert(resp.error);
                }
            });
        }
        
        $scope.save = function(){
        	if(!$scope.item.url){
        		alert("无有效图片信息");
        		return;
        	}
        	$http.post("/ovu-base/system/parkBlueprint/edit",$scope.item).success(function(result){
    			if(result.code == 0){
					msg("保存成功！");
					$scope.changeNodeUrl(result.data);
					
					$scope.saveBtnStatus = false;
    			}else{
    				alert(result.msg);
    			}
    		})
        }
        
        $scope.clear = function(){
        	confirm("是否确定删除 " + $scope.item.text + "节点图纸", function () {
                $scope.item.url = "";  
                $http.post("/ovu-base/system/parkBlueprint/edit",$scope.item).success(function(result){
	    			if(result.code == 0){
						msg("删除成功！");
						delete $scope.item.url ;
						$scope.item.showImg = false;
						$scope.changeNodeUrl(result.data);
	    			}else{
	    				alert(result.msg);
	    			}
    			})
            });
        }
        
        $scope.imgType = function(flag){
        	if($scope.item.url){
        		$scope.item.showImg = $scope.item.url.substring($scope.item.url.length-4,
        			$scope.item.url.length) == '.pdf' ?
        			true:false;
        	}
        	if($scope.item.showImg && !flag){
        		$scope.item.url = $sce.trustAsResourceUrl($scope.item.url);
        	}
        }
        
        //集团版切换项目
        $scope.getBlueprint = function(){
        	$scope.item = {};
        	$scope.item.parkId = $scope.search.parkId;
        	$scope.item.deptId = $scope.search.deptId;
        	
			getTree();
        
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

	app.controller('editBlueprintCtrl', function($scope, $rootScope, $http,$filter, $uibModalInstance, fac,item) {
		$scope.item = item;
		
		$scope.save = function(form){
			form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            
            $http.post("/ovu-base/system/parkBlueprint/existName",item).success(function(ret){
            	if(ret.data){
            		alert("现层级下已存在同名节点！");
            	}else{
            		$scope.editOne($scope.item);
            	}
            })
		}
		
		$scope.editOne = function(item){
    		$http.post("/ovu-base/system/parkBlueprint/edit",item).success(function(result){
    			if(result.code == 0){
    				if(item.id){
    					msg("编辑成功！");
    				}else{
    					msg("新增成功！");
    				}
    				var ret = {
                        parkId: result.data.parkId,
                        deptId: result.data.deptId,
                        pid: result.data.pid,
                        pids: result.data.pids,
                        text: result.data.text
                    };
                    $uibModalInstance.close(ret);
    			}else{
    				alert(result.msg);
    			}
    		})
    	}
		
		$scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
	})
})()