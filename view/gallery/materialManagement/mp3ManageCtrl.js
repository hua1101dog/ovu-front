(function(){
	"use strict";
    var app = angular.module("angularApp");
	
	app.controller('mp3ManageCtrl', function ($scope, $rootScope, $sce, $uibModal, $state, $http, $filter, fac) {
		document.title = '音频管理';
        $scope.pageModel = {};
        $scope.search = {};
        //是否显示文件【页面有两种状态，显示文件或者文件夹】
        $scope.isShowFiles = false;
        
        app.modulePromiss.then(function () {
        	$scope.$watch('dept', function (deptO, oldValue) {
            	var deptCopy = angular.copy(deptO);
                if(deptCopy.id != $scope.search.deptId){
                	$scope.search.deptId = deptCopy.id;
                //	$scope.search.parkId = deptCopy.parkId;
                }
                if($scope.isShowFiles){
                	$scope.return();
                }
            	$scope.init();
            },true)
        //    $scope.init();
        })
        
        $scope.init = function(){
        	$scope.find();
        }
        
        $scope.find = function (pageNo) {
			if($scope.isShowFiles){
            	$scope.fileFind(pageNo);
            	return;
            }
            $.extend($scope.search, {
                currentPage: pageNo || 1,
                pageSize: $scope.pageModel.pageSize || 100000
            });
            $scope.search.type = 2;
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-gallery/docs/getFolderList", $scope.search, function (data) {
                var pageModel = data;
                $scope.pageModel = pageModel;
            });
        }
        
        //鼠标上浮文件夹
        $scope.folderOn = function(o){
        	o.isOn = true;
        }
        
        //鼠标移开
        $scope.folderOff = function(o){
        	o.isOn = false;
        }
        
        //新增编辑文件夹
        $scope.createFolder = function(item){
        	var copy = angular.extend({deptId:$scope.search.deptId}, item);
        	if(copy.type == undefined || !copy.type == 2){
        		copy.type = 2;
        	}
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/gallery/materialManagement/mp3Manage/modal.addEditFolder.html',
                controller: 'mp3FolderEditModelCtrl',
                resolve: {
                    param: copy
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        
        //删除文件夹
        $scope.del = function(item){
        	confirm("该文件夹下文件将一并删除，确定删除吗?", function () {
	        	$http.post("/ovu-gallery/docs/deleteFolder?ids="+item.id).success(function(result){
	        		if(result.code == 0){
	        			msg("删除成功！");
	        			$scope.find();
	        		}else{
	        			alert("删除失败！");
	        		}
	        	})
	        })
        }
        
        $scope.return = function(){
        	$scope.isShowFiles = false;
        	$scope.curFolder = {};
        	$scope.checkedFiles = [];
        	$scope.find(1);
        }
        
        //显示文件夹中的文件
        $scope.filePageModel = {};
        $scope.fileSearch = {};
        $scope.curFolder;
        $scope.showFolderFiles = function(folder){
        	$scope.folderOff(folder);
        	$scope.pageModel = {};
        	$scope.fileSearch = {};
        	$scope.curFolder = folder;
        	$scope.isShowFiles = true;
        	$scope.fileFind();
        }
        
        //文件列表
        $scope.fileFind = function(pageNo){
        	$scope.fileSearch.folderId = $scope.curFolder.id
        	//获取文件
        	$.extend($scope.fileSearch, {
                currentPage: pageNo || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.fileSearch.pageIndex = $scope.fileSearch.currentPage - 1;
            fac.getPageResult("/ovu-gallery/docs/getFileList", $scope.fileSearch, function (data) {
                var pageModel = data;
                $scope.pageModel = pageModel;
            });
        }
        
        //鼠标上浮文件
        $scope.fileOn = function(o){
        	o.isOn = true;
        }
        
        //鼠标移开
        $scope.fileOff = function(o){
        	o.isOn = false;
        }
        
        //删除文件
        $scope.delFile = function(item){
        	confirm("确认删除文件吗?", function () {
	        	$http.post("/ovu-gallery/docs/deleteFile?ids="+item.id).success(function(result){
	        		if(result.code == 0){
	        			msg("删除成功！");
	        			$scope.fileFind();
	        		}else{
	        			alert("删除失败！");
	        		}
	        	})
	        })
        }
        
        //新增编辑文件
        $scope.editFile = function(item){
        	var copy = angular.extend({}, item);
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/gallery/materialManagement/mp3Manage/modal.editFile.html',
                controller: 'mp3FileModifyModelCtrl',
                resolve: {
                    param: copy
                }
            });
            modal.result.then(function () {
                $scope.fileFind();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        
        //上传文件
        $scope.createFile = function(){
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/gallery/materialManagement/mp3Manage/modal.addEditFile.html',
                controller: 'mp3FileEditModelCtrl',
                resolve: {
                    folder: $scope.curFolder
                }
            });
            modal.result.then(function () {
                $scope.fileFind();
            }, function () {
            	$scope.fileFind();
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        
        //展示pdf文件
        $scope.showFile = function(o){
        	var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/gallery/materialManagement/mp3Manage/modal.showFile.html',
                controller: 'mp3ShowFileModelCtrl',
                resolve: {
                    item: o
                }
            });
            modal.result.then(function () {
            	
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        
        //存储选中
        $scope.checkedFiles = [];
        //选中文件
        $scope.fileCheck = function($event,o){
        	var checkbox = $event.target ;
			var checked = checkbox.checked ;
        	if(checked){
        		$scope.checkedFiles.push(o);
        	}else{
        		$scope.checkedFiles.splice($scope.checkedFiles.indexOf(o),1);
        	}
        }
        
        //导出文件
        $scope.exportFiles = function(){
        	if($scope.checkedFiles.length == 0){
        		alert("请选择文件");
        		return;
        	}
        	var urls = "";
        	var names = "";
        	$scope.checkedFiles.forEach(function(file){
        		urls += file.filePath + ",";
        		let position = file.filePath.lastIndexOf(".");
        		let suff = file.filePath.substring(position,file.filePath.length);
        		let name = file.fileName.replace(/\./g,'');
        		names += name + suff + ",";
        	})
        	if(urls){
        		urls = urls.substring(0,urls.length-1);
        	}
        	if(names){
        		names = names.substring(0,names.length-1);
        	}
        	window.location.href="/ovu-gallery/docs/downloadBatch?urls=" + urls + 
        		"&names=" + names;
        }
	});
	
	// 新增编辑Controller
    app.controller('mp3FolderEditModelCtrl', function ($scope,$rootScope, $http, $uibModal, $uibModalInstance, $filter, fac, param) {
    	$scope.item = param || {};
    	
    	$scope.save = function (form, item) {

            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            if($scope.item.type == undefined){
            	alert("无有效类型");
            	return;
            }
            item.type = 2;
            $http.post('/ovu-gallery/docs/editFolder', item,fac.postConfig).success(function (data) {
                if (data.code == 0) {
                    msg(data.msg);
                    $uibModalInstance.close();
                } else {
                    alert(data.msg);
                    $uibModalInstance.close();
                }
            });
        }
    	
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    
    // 新增编辑Controller
    app.controller('mp3FileModifyModelCtrl', function ($scope,$rootScope, $http, $uibModal, $uibModalInstance, $filter, fac, param) {
    	$scope.item = param || {};
    	
    	$scope.save = function (form, item) {

            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            $http.post('/ovu-gallery/docs/updateFile', item,fac.postConfig).success(function (data) {
                if (data.code == 0) {
                    msg(data.msg);
                    $uibModalInstance.close();
                } else {
                    alert(data.msg);
                    $uibModalInstance.close();
                }
            });
        }
    	
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    
    //新增，编辑文件
    app.controller('mp3FileEditModelCtrl', function ($scope,$rootScope, $http, $uibModal, $uibModalInstance, $filter, fac, folder) {
    	$scope.items = [{fileName:"",filePath:""}]
    	
    	//上传文件
		$scope.uploadFile = function(item){
			$rootScope.addLimitFile(item,"filePath","fileName",[".mp3",".mp4"]);
		}
    	
    	$scope.save = function (form, item) {

            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            var param = {};
            param.type=2;
            param.folderId = folder.id;
            param.fileName = "";
            param.filePath = "";
            $scope.items && $scope.items.forEach(function(item){
            	param.fileName +=  item.fileName + ",";
            	param.filePath +=  item.filePath + ","
            })
            if(param.fileName){
            	param.fileName = param.fileName.substring(0,param.fileName.length-1);
            }
            if(param.filePath){
            	param.filePath = param.filePath.substring(0,param.filePath.length-1);
            }
            if(!param.fileName || !param.filePath){
            	alert("无有效文件");
            	return;
            }
            
            //文件必选
            var filePathArr = param.filePath.split(",");
            for(let index=0;index<filePathArr.length;index++){
                if(filePathArr[index] == '' || filePathArr[index] == undefined){
                    alert("第" + (index+1) +"组文件缺失！");
                    return;
                }
            }
            
            $http.post('/ovu-gallery/docs/addFile', param,fac.postConfig).success(function (data) {
                if (data.code == 0) {
                    dealRet(data.data);
                } else {
                    alert(data.msg);
                }
            });
        }
    	
    	//处理导入结果
    	function dealRet(data){
    		var retList = [];
			if(data.trueList){
        		var trueList = data.trueList;
        		trueList && trueList.forEach(function(file){
        			let obj = {};
        			obj.fileName = file;
        			obj.folderName = folder.folderName;
        			obj.state = "成功";
        			retList.push(obj);
        		})
        	}
        	if(data.falseList){
        		var falseList = data.falseList;
        		falseList && falseList.forEach(function(file){
        			let obj = {};
        			obj.fileName = file;
        			obj.folderName = folder.folderName;
        			obj.state = "失败";
        			retList.push(obj);
        		})
        	}
        	$scope.openRetPage(retList);
    	}
    	
    	//打开结果
    	$scope.openRetPage = function(retList){
            var modal = $uibModal.open({
                animation: true,
                component: 'mp3RetModelModal',
                size: 'lg',
                resolve: {
                    item: function() {
                        return retList;
                    }
                }
            });
            modal.result.then(function () {
                $scope.items = [{fileName:"",filePath:""}];
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
                $uibModalInstance.close();
            });
        }
    	
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        
        $scope.moreFile = function(){
        	$scope.items.push({fileName:"",filePath:""});
        }
        $scope.delFile = function(file){
        	$scope.items.splice($scope.items.indexOf(file), 1);
        }
    });
    
    //展示文件
    app.controller('mp3ShowFileModelCtrl', function ($scope,$rootScope, $http, $uibModal, $sce ,$uibModalInstance, $filter, fac, item) {
		$scope.mp3 = angular.copy(item);
		$scope.mp3.filePath = $sce.trustAsResourceUrl($scope.mp3.filePath);
		
    	$scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    });
    
    app.component('mp3RetModelModal', {
        templateUrl: '/view/gallery/materialManagement/common/addFileResult.html',
        bindings: {
            close: '&',
            dismiss: '&',
            resolve: '<'
        },
        controller: function($scope,$rootScope, $http, $filter, fac) {
        	var $ctrl = this;
        	$ctrl.retList = $ctrl.resolve.item;
        	
        	$ctrl.cancel = function() {
                $ctrl.dismiss({
                    $value: $ctrl.item
                });
            };
            
            $ctrl.confirm = function(){
            	$ctrl.close();
            }
        }
    })
})()
