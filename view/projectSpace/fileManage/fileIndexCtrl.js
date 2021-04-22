(function() {
    var app = angular.module("angularApp");
    app.controller('fileCtl', function ($scope,$rootScope, $http,$filter,$uibModal,fac) {
    	document.title ="OVU-空间文件管理";
        angular.extend($rootScope,fac.dicts);
        $rootScope.config = {edit:false};
        $scope.isAuthor = '';
        $scope.search = {
           'fileSpaceType':'2'
        };
        $scope.pageModel = {};
        $http.post("/ovu-base/system/dictionary/get",{"item":'FILE_TYPE'},fac.postConfig).success(function(data){
            $scope.fileTpye = angular.fromJson(data.dic_VAL);
        });

        $scope.find = function(pageNo){
            $scope.search.parkId = app.park.ID;
            if(!hasActivePark()){
                return;
            }
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;
            fac.getPageResult("/ovu-base/system/fileResource/listByPage",$scope.search,function(data){
                $scope.pageModel = data;
            });

        };
        
        app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	$scope.find();
            })
        });
        
        $scope.getType = function(obj,value){
            var text = '';
            angular.forEach(obj,function(data,index,array) {
                if(value == data.value) {
                    text = data.text;
                }
            });
            return text;
        }
        
        $scope.getSpace = function(fileSpaceType){
        	var r = "";
        	if (fileSpaceType == 1) {
        		r = "楼栋";
        	} else if (fileSpaceType == 2) {
        		r = "房间";
        	} else if (fileSpaceType == 3) {
        		r = "楼层";
        	} 
        	return r;
        }

        $scope.getFileType=["","建筑","电气","弱电","给排水","暖通空调","装修","BIM","室内地图","房屋平面图","楼层平面图"];

        //空间选择
        $scope.chooseHouseType = function(type){
            var modal = $uibModal.open({
                animation: true,
                size:'lg',
                templateUrl: '/view/projectSpace/fileManage/modal.spaceChoice.html',
                controller: 'spaceChoiceCtrl'
                , resolve: {
                    isCheck:function(){
                        return type;
                    }
                }
            });
            modal.result.then(function (result) {
                $scope.search.spaceResult = result.spaceResult;
                $scope.search.spaceId = result.id;
                if ($scope.search.fileSpaceType == 3) { // 如果切换的是楼层平面图
            		$http.post("/ovu-base/system/parkFloor/findGroundNoList", {"floorId":result.id}, fac.postConfig).success(function (resp) {
                    	if(resp.code){
                    		$scope.groundList = resp.data;
                    		$scope.showGround = true;
                    	} else {
                    		alert(resp.message);
                    	}
                    });
            	}
            }, function (reason) {
                console.info('Modal ChoosePerson dismissed at: ' + new Date());
            });
        };
        
        //清空选择
        $scope.clear = function(){
        	delete $scope.search.spaceResult;
        	delete $scope.search.spaceId;
        	delete $scope.search.groundNo;
        	$scope.showGround = false;
        }
        
        
        //新增
        $scope.edit = $scope.addNewFile = function(action, item) {
        	
        	if (!item){
        		item = {};
        	}
        	
        	item.action = action;
            var modal = $uibModal.open({
                animation: true,
                templateUrl: '/view/projectSpace/fileManage/modal.addNewFile.html',
                controller: 'addNewFileCtrl'
                , resolve: {
                    data:function() {
                        return item;
                    }
                }
            });
            modal.result.then(function (result) {	//关闭
                $scope.search.fileSpaceType = result;
                $scope.search.fileType = '';
                $scope.search.fileAreaType = ''
                $scope.search.spaceResult = '';//置空
                $scope.search.spaceId = '';
                $scope.find();
            }, function (reason) {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        //授权
        $scope.authorize = function(event,id,index) {
            $http.post("/ovu-base/system/fileResource/authorizeFile",{"id":id,"userId":app.user.ID},fac.postConfig).success(function(data){
                if(data.success){
                    msg('授权成功！');
                    console.log(event.target)
                    event.target.style="display:none";
                }else{
                    alert();
                }
            });
        }
        
        //删除
        $scope.delFile = function(id) {
            confirm("确认删除该空间吗?",function(){
                $http.post("/ovu-base/system/fileResource/removeFile",{"id":id,"userId":app.user.ID},fac.postConfig).success(function(data){
                    if(data.code==1){
                        msg('删除成功！');
                        $scope.find();
                    }else{
                        alert();
                    }
                });
            })

        }
        
        function hasActivePark() {
            if (!$scope.search.parkId) {
                alert("请选择项目！");
                return false;
            } else {
                return true;
            }
        }
    });
    
    app.controller('spaceChoiceCtrl', function($scope,$http,$rootScope,fac,$uibModal,$uibModalInstance,isCheck) {
    	$scope.rightSpaceShow=false;
        fac.loadSelect($scope,"HOUSE_TYPE");
        $scope.check = isCheck;
        $scope.park={};
        $scope.search = {};
        $scope.pageModel = {};
        if ($scope.check == 2) { // 1-楼栋 2-房间 3-楼层
	        $scope.find = function(pageNo){
	            $scope.search.parkId=app.park.ID;
	            if(!hasActivePark()){
	                return;
	            }
	            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
	            $scope.search.pageIndex = $scope.search.currentPage-1;
	            $scope.search.totalCount = $scope.pageModel.totalCount||0;
	
	            fac.getPageResult("/ovu-base/system/parkHouse/listByGridForPark",$scope.search,function(data){
	                $scope.pageModel = data;
	            });
	        };
        }
        
        function loadHouseTree(parkId){
            $http.post("/ovu-base/system/parkStage/tree", {
                parkId : parkId,
                onlyFloor:true
            },fac.postConfig).success(function(treeData){
                $rootScope.flatData = fac.treeToFlat(treeData);
                $rootScope.flatData.forEach(function(n){
                    n.floorId?(n.isLeaf = true):(n.isLeaf = false);
                })
                $rootScope.treeData = treeData;
            });
        }

        loadHouseTree(app.park.ID);

        $scope.findPark = function(){
            modalPark.open({
                callback:function(node){
                    $scope.park = node;
                    loadHouseTree(node.ID);
                    modalPark.close();
                    $scope.find(1);
                }
                ,realStateOnly:true
                ,selectedId:app.park.ID
            });
        }
        
        $scope.getType = function(obj,value){
            var text = '';
            angular.forEach(obj,function(data,index,array) {
                if(value == data.value) {
                    text = data.text;
                }
            });
            return text;
        }
        
        $scope.selectNode= function (node) {
            if($scope.curNode != node){
                $scope.curNode && $scope.curNode.state &&($scope.curNode.state.selected = false);
            }
            node.state = node.state||{};
            node.state.selected = !node.state.selected;
            if(node.state.selected){
                $scope.curNode = node;
                $scope.search.STAGE_ID = node.stageId;
                $scope.search.FLOOR_ID = node.floorId;
                if(node.floorId){//选中楼栋
                	$scope.floorName = node.text;
                	if ($scope.check == 1) {
                		$scope.spaceResult = $scope.floorName;
                		$scope.id = node.floorId;
                	} else if ($scope.check == 3) { // 1-楼栋 2-房间 3-楼层
                		 $scope.spaceResult = $scope.floorName;
                		 $scope.id = node.floorId;
                		 $http.post("/ovu-base/system/parkFloor/findGroundNoList", {"floorId":node.floorId}, fac.postConfig).success(function (resp) {
                         	if(resp.code){
                         		$scope.groundList = resp.data;
                         	} else {
                         		alert(resp.message);
                         	}
                         });
                	} else if ($scope.check == 2) { // 1-楼栋 2-房间 3-楼层
                		$scope.rightSpaceShow=true;
                        $scope.unitList = [];
                        /*if(node.unitNum){
                            for(var i=1;i<=node.unitNum;i++){
                                $scope.unitList.push(i);
                            }
                        }*/
                        $http.post("/ovu-base/system/parkFloor/findUnitNoList", {"floorId":node.floorId}, fac.postConfig).success(function (resp) {
                        	if(resp.code){
                        		$scope.unitList = resp.data;
                        	} else {
                        		alert(resp.message);
                        	}
                        });
                        /*$scope.groundList = [];
                        if(node.ugroundNum){
                            for(var i=1;i<=node.ugroundNum;i++){
                                $scope.groundList.push(i);
                            }
                        }
                        if(node.cgroundNum){
                            for(var i=1;i<=node.ugroundNum;i++){
                                $scope.groundList.push(i*-1);
                            }
                        }*/
                        $http.post("/ovu-base/system/parkFloor/findGroundNoList", {"floorId":node.floorId}, fac.postConfig).success(function (resp) {
                        	if(resp.code){
                        		$scope.groundList = resp.data;
                        	} else {
                        		alert(resp.message);
                        	}
                        });
                        $scope.find();
                	}
                }else{//选中分期
                    delete $scope.unitList;
                    delete $scope.groundList;
                }
            }else{
                delete $scope.curNode;
                delete $scope.search.FLOOR_ID;
                delete $scope.search.STAGE_ID;
                delete $scope.unitList;
                delete $scope.groundList;
            }
        }

        $scope.affirm = function () {
        	if ($scope.check == 2) { // 1-楼栋 2-房间 3-楼层
	            var spaceList = $scope.pageModel.list.filter(function(n){return n.checked});
	            if(spaceList.length>1){
	                alert("空间只能选择一个！");
	                return;
	            }
	            if(spaceList.length == 0 && $scope.floorName) {
	                $scope.spaceResult = $scope.floorName;
	                $scope.id = $scope.search.FLOOR_ID;
	            }else if(!$scope.floorName && spaceList.length == 0){
	                alert("请选择空间！");
	                return;
	            }
	            if(spaceList.length==1) {
	                $scope.spaceResult = spaceList[0].FLOOR_NAME + '-' +spaceList[0].HOUSE_NAME;
	                $scope.id = spaceList[0].ID;
	
	            }
        	}
        	
        	var backData = {};
        	if(isCheck == 3){
        		backData = {spaceResult:$scope.spaceResult,id:$scope.id,groundList:$scope.groundList}
        	} else {
        		backData = {spaceResult:$scope.spaceResult,id:$scope.id}
        	}
        	
            $uibModalInstance.close(backData);
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        
        function hasActivePark() {
            if (!$scope.search.parkId) {
                alert("请选择项目！");
                return false;
            } else {
                return true;
            }
        }
    });

    app.controller('addNewFileCtrl', function($scope,$http,$uibModal,$uibModalInstance,fac,$rootScope,data) {
    	$scope.newFileData = {};
        $scope.park={};
        $scope.search = {};
        $scope.pageModel = {};
        
        /**
         * 加载文件类型
         * */
        $scope.loadFileType = function(){
        	$http.post("/ovu-base/system/dictionary/get",{"item":'FILE_TYPE'},fac.postConfig).success(function(data){
        		$scope.fileTpyes = angular.fromJson(data.dic_VAL);
	        });
        }
        $scope.loadFileType();
        
    	if ("edit" == data.action && data && data.fileType == 10 && data.fileSpaceType == 3) { //  当空间类型为楼层,文件为楼层平面图时
    		$scope.showGround = true; // 将楼层回显出来
    		// 拿到楼层的信息
    		$http.post("/ovu-base/system/parkFloor/findGroundNoList", {"floorId":data.spaceId}, fac.postConfig).success(function (resp) {
             	if(resp.code){
             		$scope.groundList = resp.data;
             	} 
             });
    	} else {
    		$scope.showGround = false; // 将楼层回显出来
    	}
    	
    	
    	$scope.getFileTypes = function (n) {
    		var fileNums=[];
        	$scope.t = [];
        	if (n) {
        		if (n == 1) { // 1-楼栋 2-房间 3-楼层
            		fileNums.push(8);
            		fileNums.push(9);
            		fileNums.push(10);
            	} else if (n == 2) {
            		fileNums.push(10);
            	} else if (n == 3) {
            		fileNums.push(1);
            		fileNums.push(2);
            		fileNums.push(3);
            		fileNums.push(4);
            		fileNums.push(5);
            		fileNums.push(6);
            		fileNums.push(7);
            		fileNums.push(8);
            		fileNums.push(9);
            	}         	
            	for (var i = 0; i < $scope.fileTpyes.length; i++) {
            		var curNum = $scope.fileTpyes[i].value;
            		if (fileNums.indexOf(parseInt(curNum)) != -1) {
            			continue;
            		}
            		$scope.t.push($scope.fileTpyes[i]);
    			}
        	}
        	return $scope.t;
        }
    	
    	if(data && "edit" == data.action){
            $http.post("/ovu-base/system/fileResource/findById",{"id":data.id},fac.postConfig).success(function(resp){
            	var ob = {};
                if(resp.code==1) {
                	angular.copy(resp.data.dataObj, ob);
                    ob.spaceResult = resp.data.spaceName;
                    ob.fileSpaceType = ob.fileSpaceType.toString();
                    ob.fileType = ob.fileType.toString();
                    angular.copy(ob, $scope.newFileData);
                    
                    $http.post("/ovu-base/system/dictionary/get",{"item":'FILE_TYPE'},fac.postConfig).success(function(data){
            			$scope.fileTpyes = angular.fromJson(data.dic_VAL);
            			$scope.theFileTypes = $scope.getFileTypes($scope.newFileData.fileSpaceType);
        	        });
                }else{
                    alert();
                }
            });
        };

        $scope.find = function(pageNo){
            $scope.search.parkId=app.park.ID;
            if(!hasActivePark()){
                return;
            }
            
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            $scope.search.pageIndex = $scope.search.currentPage-1;
            $scope.search.totalCount = $scope.pageModel.totalCount||0;
            fac.getPageResult("/ovu-base/system/parkHouse/listByGrid",$scope.search,function(data){
                $scope.pageModel = data;
            });
        };

        function loadHouseTree(parkId){
            $http.post("/ovu-base/system/parkStage/tree", {
                parkId : parkId,
                onlyFloor:true
            },fac.postConfig).success(function(treeData){
                $rootScope.flatData = fac.treeToFlat(treeData);
                $rootScope.flatData.forEach(function(n){
                    n.floorId?(n.isLeaf = true):(n.isLeaf = false);
                })
                $rootScope.treeData = treeData;
            });
        }

        loadHouseTree(app.park.ID);
        $scope.find();

        $scope.findPark = function(){
            modalPark.open({
                callback:function(node){
                    $scope.park = node;
                    loadHouseTree(node.ID);
                    modalPark.close();
                    //$scope.$apply();
                    $scope.find(1);
                }
                ,realStateOnly:true
                ,selectedId:app.park.ID
            });
        }
        
        //空间选择
        $scope.chooseHouseType = function(type){
            if(!$scope.newFileData.fileSpaceType){
                alert('请择空间类型！');
                return
            }
            var modal = $uibModal.open({
                animation: true,
                size:'lg',
                templateUrl: '/view/projectSpace/fileManage/modal.spaceChoice.html',
                controller: 'spaceChoiceCtrl'
                , resolve: {
                    isCheck:function(){
                        return type;
                    }
                }
            });
            modal.result.then(function (result) {
            	if (3 == parseInt($scope.newFileData.fileSpaceType)) { // 1-楼栋 2-房间 3-楼层)
            		$scope.groundList = result.groundList;
            		$scope.newFileData.spaceResult = result.spaceResult;
            		$scope.newFileData.spaceId = result.id;
            	} else {
            		$scope.newFileData.spaceResult = result.spaceResult;
            		$scope.newFileData.spaceId = result.id;
            	}
            }, function (reason) {
                console.info('Modal ChoosePerson dismissed at: ' + new Date());
            });
        };
        
      //清空选择
        $scope.clear = function(){
        	delete $scope.newFileData.spaceResult;
        	delete $scope.newFileData.spaceId;
        }

        $scope.selectNode= function (node) {
            if($scope.curNode != node){
                $scope.curNode && $scope.curNode.state &&($scope.curNode.state.selected = false);
            }
            node.state = node.state||{};
            node.state.selected = !node.state.selected;
            if(node.state.selected){
                $scope.curNode = node;
                $scope.search.STAGE_ID = node.stageId;
                $scope.search.FLOOR_ID = node.floorId;
                if(node.floorId){//选中楼栋
                    $scope.unitList = [];
                    /*if(node.unitNum){
                        for(var i=1;i<=node.unitNum;i++){
                            $scope.unitList.push(i);
                        }
                    }*/
                    
                    $http.post("/ovu-base/system/parkFloor/findUnitNoList", {"floorId":node.floorId}, fac.postConfig).success(function (resp) {
                    	if(resp.code){
                    		$scope.unitList = resp.data;
                    	} else {
                    		alert(resp.message);
                    	}
                    });
                    /*$scope.groundList = [];
                    if(node.ugroundNum){
                        for(var i=1;i<=node.ugroundNum;i++){
                            $scope.groundList.push(i);
                        }
                    }
                    if(node.cgroundNum){
                        for(var i=1;i<=node.ugroundNum;i++){
                            $scope.groundList.push(i*-1);
                        }
                    }*/
                    $http.post("/ovu-base/system/parkFloor/findGroundNoList", {"floorId":node.floorId}, fac.postConfig).success(function (resp) {
                    	if(resp.code){
                    		$scope.groundList = resp.data;
                    	} else {
                    		alert(resp.message);
                    	}
                    });
                }else{//选中分期
                    delete $scope.unitList;
                    delete $scope.groundList;
                }
                $scope.find();

            }else{
                delete $scope.curNode;
                delete $scope.search.FLOOR_ID;
                delete $scope.search.STAGE_ID;
                delete $scope.unitList;
                delete $scope.groundList;
            }
        }

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.addFile =function(type){
            if(!$scope.newFileData.fileType) {
                alert('请选择文件类型！');
                return;
            }
            
            var accepts = [];
            if(type == 'originalFile'){
            	if (data.fileType == 9 || data.fileType == 10) { // 1-建筑 2-电气 3-弱电 4-给排水 5-暖通空调 6-装修 7-BIM 8-室内地图 9-房屋平面图 10-楼层平面图
            		accepts.push(".jpg"); // JPG、JPEG、PNG、GIF
            		accepts.push(".jpeg");
            		accepts.push(".png");
            		accepts.push(".gif");
            		$rootScope.addLimitFile($scope.newFileData,'originalFilePath','originalFileName',accepts);
            	} else {
            		$rootScope.addFile($scope.newFileData,'originalFilePath','originalFileName');
            	}
            	$scope.newFileData.originalFileName = $scope.newFileData.nameField;
                $scope.newFileData.originalFilePath = $scope.newFileData.urlField;
            }else if(type == 'pdfFile'){
            	accepts.push(".pdf");
            	$rootScope.addLimitFile($scope.newFileData,'pdfPath','pdfFileName',accepts);
            	$scope.newFileData.pdfFileName = $scope.newFileData.nameField;
                $scope.newFileData.pdfPath = $scope.newFileData.urlField;
            }
            
        };

        $scope.delFile = function(type)	{
        	 if(type == 'originalFile'){
        		 $scope.newFileData.originalFileName = '';
                 $scope.newFileData.originalFilePath = '';
             }else if(type == 'pdfFile'){
            	 $scope.newFileData.pdfFileName = '';
                 $scope.newFileData.pdfPath = '';
             }
        	 msg('删除成功！');
        };
        
 /*       $scope.delFile = function(url,bo)	{
            $http.post("/ovu-base/system/fileResource/deleteResource",{"filePath":url},fac.postConfig).success(function(data){
                if(data.code) {
                    if(bo){
                        $scope.newFileData.originalFileName = '';
                        $scope.newFileData.originalFilePath = '';
                    }else{
                        $scope.newFileData.pdfFileName = '';
                        $scope.newFileData.pdfPath = '';
                    }
                    msg('删除成功！');
                }else{
                    alert();
                }
            });
        };*/

       
        
        /**
         * 切换空间类型
         * 1-建筑 2-电气 3-弱电 4-给排水 5-暖通空调 6-装修 7-BIM 8-室内地图 9-房屋平面图 10-楼层平面图
         * 清空空间选择 和 文件类型
         * */
        $scope.changeSpaceType = function(){
        	var n = $scope.newFileData.fileSpaceType;
        	$scope.theFileTypes = $scope.getFileTypes(n);
        	delete $scope.newFileData.spaceResult;
        	delete $scope.newFileData.fileType;
        }
        
        
        
        $scope.save = function(form,data) {
        	
        	/*form.$setSubmitted(true);
        	if(!form.$valid){
                return;
            }*/
        	
        	if (!data) {
        		data = {};
        	}
        	if (!data.fileSpaceType) {
        		alert("请指定空间类型");
        		return;
        	}
        	
        	if (!data.fileType) {
        		alert("请指定文件类型");
        		return;
        	}
        	
        	if (!data.groundNo && $scope.showGround) {
        		alert("请指定楼层");
        		return;
        	}
        	
        	if(!data.spaceId){
        		alert("请指定空间");
        		return;
        	}
        	
        	// 1-室外公共区域 2-室内区域
        	$scope.newFileData.fileAreaType = 2; // 这个属性目前先定死,暂时没有什么用处
        	
            if($scope.newFileData.createTime) {
                $scope.newFileData.createTime = new Date($scope.newFileData.createTime);
            }
            if($scope.newFileData.updateTime){
                $scope.newFileData.updateTime = new Date($scope.newFileData.updateTime);
            }
            $scope.newFileData.parkId = app.park.ID;
            $scope.newFileData.userId = app.user.ID;
            $http.post("/ovu-base/system/fileResource/saveResource",$scope.newFileData,fac.postConfig).success(function(data){
                if(data.code) {
                    msg("保存成功");
                    $uibModalInstance.close($scope.newFileData.fileSpaceType);
                }else {
                    alert(data.message);
                }
            });
        }

        /**
         * 控制是否显示楼层的下拉选框
         * */
        $scope.changeType = function(value) {
        	data.fileType = value;
        	$scope.showGround=false;
        	if(value == 7) {
                $scope.fileType = 'bim';
	        } else if (value == 8){
                $scope.fileType = 'innerHouseMap';
            } else if(value == 10) {
            	$scope.showGround=true;
            	$scope.fileType = 'groundImg';
            } else {
                $scope.fileType = 'attachment';
            }
        };
        
        function hasActivePark() {
            if (!$scope.search.parkId) {
                alert("请选择项目！");
                return false;
            } else {
                return true;
            }
        }
    });

})();
