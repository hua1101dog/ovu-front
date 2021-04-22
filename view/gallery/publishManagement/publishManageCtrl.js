(function(){
	"use strict";
    var app = angular.module("angularApp");
	
	app.controller('puglishManageCtrl', function ($scope, $rootScope, $sce, $uibModal, $state, $http, $filter, fac) {
		document.title = '在线发布管理';
        $scope.pageModel = {};
        $scope.search = {};
        $scope.STATE = [{key:1,value:'有效'},{key:0,value:'失效'}]
        
        app.modulePromiss.then(function () {
        	$scope.$watch('dept', function (deptO, oldValue) {
            	var deptCopy = angular.copy(deptO);
                if(deptCopy.id != $scope.search.deptId){
                	$scope.search.deptId = deptCopy.id;
                //	$scope.search.parkId = deptCopy.parkId;
                }
            	$scope.init();
            },true)
        //    $scope.init();
        })
        
        $scope.init = function(){
        	$scope.find();
        }
        
        $scope.find = function (pageNo) {

            $.extend($scope.search, {
                currentPage: pageNo || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-gallery/publish/getPublishList", $scope.search, function (data) {
                var pageModel = data;
                $scope.pageModel = pageModel;
            });
        }
        
         // 新增，编辑
        $scope.showEditModal = function (item) {
            var copy = angular.extend({deptId:$scope.search.deptId}, item);
            
            var modal = $uibModal.open({
                animation: true,
                component: 'publishEditModel',
                size: 'lg',
                resolve: {
                    item: function() {
                        return copy;
                    }
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        
        $scope.del = function(item){
        	confirm("确认删除吗?", function () {
	        	$http.post("/ovu-gallery/publish/deletePublishInfo?ids="+item.id).success(function(result){
	        		if(result.code == 0){
	        			msg("删除成功！");
	        			$scope.find();
	        		}else{
	        			alert("删除失败！");
	        		}
		        })
	        })
        }
	});
    
    //新增编辑带富文本框
    app.component('publishEditModel', {
        templateUrl: '/view/gallery/publishManagement/modal.publishEdit.html',
        bindings: {
            close: '&',
            dismiss: '&',
            resolve: '<'
        },
        controller: function($scope,$rootScope, $uibModal,$http, $filter, fac) {
            var $ctrl = this;
            $ctrl.showPhoto = $rootScope.showPhoto;
            $ctrl.addPhotos = $rootScope.addPhotos;
            $ctrl.addPhoto = $rootScope.addPhoto;
            $ctrl.clearPhoto = $rootScope.clearPhoto;
            $ctrl.delPhoto = $rootScope.delPhoto;
            $ctrl.processImgUrl = $rootScope.processImgUrl;
            $ctrl.RESERVATIONCHANNEL = fac.dicts.reservationChannel;
            
            var um;
            $ctrl.$onInit = function() {
                // 深拷贝 防止模态框变化引起table同步变化
                $ctrl.item = angular.copy($ctrl.resolve.item);
                
                //记录旧logo,当logo更新时更新二维码
		        $ctrl.item.oldLogo = $ctrl.item.logoUrl;
		        $ctrl.item.oldChannel = $ctrl.item.channel;
                
                // 打开富文本编辑器
                um = UM.getEditor('myEditor', {
                    initialFrameWidth: '100%',
                    // 不要删除 这是umeditor默认的所有配置项
                    // toolbar: [
                    //     'source | undo redo | bold italic underline strikethrough | superscript subscript | forecolor backcolor | removeformat |',
                    //     'insertorderedlist insertunorderedlist | selectall cleardoc paragraph | fontfamily fontsize',
                    //     '| justifyleft justifycenter justifyright justifyjustify |',
                    //     'link unlink | emotion image video  | map',
                    //     '| horizontal print preview fullscreen', 'drafts', 'formula'
                    // ]
                    toolbar: [
                        'source | undo redo | bold italic underline strikethrough | superscript subscript | forecolor backcolor | removeformat |',
                        'insertorderedlist insertunorderedlist | selectall cleardoc paragraph | fontfamily fontsize',
                        '| justifyleft justifycenter justifyright justifyjustify |',
                        'link unlink | emotion ',
                        '| horizontal'
                    ]

                });
                um.setContent("");
                // 先清空编辑器
                // um.execCommand('cleardoc');
                // 设置左对齐
                // um.execCommand('justify', 'left');
                // 内容插入编辑器
                // um.execCommand('insertHtml', $ctrl.item.content);
                if ($ctrl.item.introduce) {
                    um.setContent($ctrl.item.introduce);
                }
                // 富文本 超链接 点击事件
                $('body').delegate('.UM-Editor  .edui-body-container a','click',function(){
                    window.open(this.href);
                });
            };
	
	        $ctrl.save = function (form, item) {
	
	            form.$setSubmitted(true);
	            if (!form.$valid) {
	                return;
	            }
	            //新增或则logo图片改变，重新生成二维码
	            if(item.oldLogo != item.logoUrl || !item.id ||
	            	item.channel != item.oldChannel){
	            	item.isUpdateLogo = 1;
	            }
	            
	            var content = um.getContent();
	            if(content){
	            	item.introduce = content;
	            }
	            
	            $http.post('/ovu-gallery/publish/editPublishInfo', item,fac.postConfig).success(function (data) {
	                if (data.code == 0) {
	                    msg(data.msg);
	                    um.destroy();
		                $ctrl.close({
		                    $value: $ctrl.item
		                });
	                } else {
	                    alert(data.msg);
	                }
	            });
	        }
	        $ctrl.cancel = function () {
	            $ctrl.dismiss({
                    $value: $ctrl.item
                });
                // 关闭编辑器
                // UM.delEditor('myEditor');
                um.destroy();
	        };
			//上传音频文件
			$ctrl.uploadMp3 = function(){
				$rootScope.addLimitFile($ctrl.item,"musicPath","musicName",[".mp3"]);
			}
			//上传视频文件
			$ctrl.uploadVideo = function(){
				$rootScope.addLimitFile($ctrl.item,"videoPath","videoName",[".mp4"]);
			}
			
			//从资料库中选择
			//type 1-图片,2-音频，3-视频
			$ctrl.selectFromDb = function(type,isLogo){
	            var modal = $uibModal.open({
	                animation: false,
	                size: 'lg',
	                templateUrl: '/view/gallery/publishManagement/modal.materialsSelect.html',
	                controller: 'materialsSelModelCtrl',
	                resolve: {
	                    Param: {type:type,deptId:$ctrl.item.deptId}
	                }
	            });
	            modal.result.then(function (data) {
	                if(type == 1){
	                	if(isLogo){
	                		$ctrl.item.logoUrl = data.filePath;
	                	}else{
	                		$ctrl.item.imagePath = data.filePath;
	                		$ctrl.item.imageName = data.fileName;
	                	}
	                	
	                }if(type == 2){
	                	$ctrl.item.musicPath = data.filePath;
	                	$ctrl.item.musicName = data.fileName;
	                	
	                }
	                if(type == 3){
	                	$ctrl.item.videoPath = data.filePath;
	                	$ctrl.item.videoName = data.fileName;
	                	
	                }
	            }, function () {
	                console.info('Modal dismissed at: ' + new Date());
	            });
			}
	    }
	  });
    
    //从资料库中选择
    app.controller('materialsSelModelCtrl', function ($scope,$rootScope, $http, $uibModal, $uibModalInstance, $filter, fac, Param) {
    	$scope.pageModel = {};
    	$scope.searchDbs = {};
    	$scope.search = {};
    	$scope.canSelect = true;
    	$scope.selectedFile ;
    	var param = Param.type;
    	
    	$scope.MATERIALTYPE = [{key:0,value:"图片"},{key:1,value:"画册"},{key:2,value:"音频"},
    		{key:3,value:"视频"},{key:4,value:"文档"}]
    	$scope.init = function(){
    		if(!param || param == 1){
    			$scope.matrialType = 0;
	    	}else if(param == 2){
	    		$scope.matrialType = 2;
	    	}else if(param == 3){
	    		$scope.matrialType = 3;
	    	}
	    	$scope.getMaterialDbs();
    	}
    	
    	app.modulePromiss.then(function(){
    		$scope.init();
    	})
    	
    	//获取资料库下拉
    	$scope.getMaterialDbs = function(pageNo){
    		
    		$.extend($scope.searchDbs, {
                currentPage: pageNo || 1,
                pageSize: $scope.pageModel.pageSize || 1000000
            });
            $scope.searchDbs.pageIndex = $scope.searchDbs.currentPage - 1;
            $scope.searchDbs.type = $scope.matrialType;
            $scope.searchDbs.deptId = Param.deptId;
            fac.getPageResult("/ovu-gallery/docs/getFolderList", $scope.searchDbs, function (data) {
                $scope.MATERIALDBS = data.data;
            });
            
    	}
    	
    	//获取资料
    	$scope.find = $scope.getMaterials = function(pageNo){
    		
    		$.extend($scope.search, {
                currentPage: pageNo || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            setType();
            fac.getPageResult("/ovu-gallery/docs/getFileList", $scope.search, function (data) {
                var pageModel = data;
                $scope.pageModel = pageModel;
            });
    	}
    	
    	//设置查询文件类型
    	function setType(){
    		if(!param || param == 1){
    			$scope.search.fileSuffix = 'jpg,png';
	    	}else if(param == 2){
	    		$scope.search.fileSuffix = 'mp3';
	    	}else if(param == 3){
	    		$scope.search.fileSuffix = 'mp4';
	    	}
    	}
    	
    	$scope.selectFile = function(o){
    		console.log(o.id);
    		$scope.selectedFile = o;
    	}
    	
    	$scope.save = function () {
    		if(!$scope.selectedFile || !$scope.selectedFile.id){
    			alert("请选择文件");
    			return;
    		}
			$uibModalInstance.close($scope.selectedFile);
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})()
