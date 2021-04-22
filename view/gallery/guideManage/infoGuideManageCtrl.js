(function(){
	"use strict";
    var app = angular.module("angularApp");

	app.controller('infoGuideManageCtrl', function ($scope, $rootScope, $sce, $uibModal, $state, $http, $filter, fac) {
		document.title = '信息导览管理';
        $scope.pageModel = {};
        $scope.search = {};

        app.modulePromiss.then(function () {
        	$scope.$watch('dept', function (deptO, oldValue) {
            	var deptCopy = angular.copy(deptO);
                if(deptCopy.id != $scope.search.deptId){
                	$scope.search.deptId = deptCopy.id;
                	$scope.search.parkId = deptCopy.parkId;
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
            fac.getPageResult("/ovu-gallery/guideScreen/getExhibitionList", $scope.search, function (data) {
                var pageModel = data;
                $scope.pageModel = pageModel;
            });
        }

        // 新增，编辑
        $scope.showEditModal = function (item) {
            var copy = angular.extend({deptId:$scope.search.deptId,parkId:$scope.search.parkId}, item);

            var modal = $uibModal.open({
                animation: true,
                component: 'infoGuideEditModal',
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
	        	$http.post("/ovu-gallery/guideScreen/deleteExhibition?ids="+item.id).success(function(result){
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

	app.component('infoGuideEditModal', {
        templateUrl: '/view/gallery/guideManage/infoGuideManage/modal.editInfoGuide.html',
        bindings: {
            close: '&',
            dismiss: '&',
            resolve: '<'
        },
        controller: function($scope,$rootScope, $http, $filter, fac) {
            var $ctrl = this;
            $ctrl.showPhoto = $rootScope.showPhoto;
            $ctrl.addPhotos = $rootScope.addPhotos;
            $ctrl.addPhoto = $rootScope.addPhoto;
            $ctrl.clearPhoto = $rootScope.clearPhoto;
            $ctrl.delPhoto = $rootScope.delPhoto;
            $ctrl.processImgUrl = $rootScope.processImgUrl;
            const MaxSize = 1000;
            var um;
            $ctrl.$onInit = function() {
                // 深拷贝 防止模态框变化引起table同步变化
                $ctrl.item = angular.copy($ctrl.resolve.item);
                //存储作品
                $ctrl.products = [];

                // 打开富文本编辑器
                um = UE.getEditor('myEditor', {
                    initialFrameWidth: '100%',
                    wordCount:true,
                    maximumWords : MaxSize,
                    toolbars: [
                        [
						'undo', //撤销
						'redo', //重做
						'bold', //加粗
						'indent', //首行缩进
						'italic', //斜体
						'underline', //下划线
						'strikethrough', //删除线
						'subscript', //下标
						'fontborder', //字符边框
						'superscript', //上标
						'formatmatch', //格式刷
						'pasteplain', //纯文本粘贴模式
						'selectall', //全选
						'horizontal', //分隔线
						'removeformat', //清除格式
						'time', //时间
						'date', //日期
						/*'insertrow', //前插入行
						'insertcol', //前插入列
						'mergeright', //右合并单元格
						'mergedown', //下合并单元格
						'deleterow', //删除行
						'deletecol', //删除列
						'splittorows', //拆分成行
						'splittocols', //拆分成列
						'splittocells', //完全拆分单元格
						'deletecaption', //删除表格标题
						'inserttitle', //插入标题
						'mergecells', //合并多个单元格
						'deletetable', //删除表格
						'cleardoc', //清空文档
						'insertparagraphbeforetable', //"表格前插入行"*/
						//'fontfamily', //字体
						//'fontsize', //字号
						//'paragraph', //段落格式
//						'edittable', //表格属性
//						'edittd', //单元格属性
						'justifyleft', //居左对齐
						'justifyright', //居右对齐
						'justifycenter', //居中对齐
						'justifyjustify', //两端对齐
						'forecolor', //字体颜色
						'backcolor', //背景色
						'insertorderedlist', //有序列表
						'insertunorderedlist', //无序列表
						'rowspacingtop', //段前距
						'rowspacingbottom', //段后距
						'imagecenter', //居中
						'lineheight', //行间距
						'edittip ', //编辑提示
						//'customstyle', //自定义标题
						'autotypeset', //自动排版
						'touppercase', //字母大写
						'tolowercase', //字母小写
//						'inserttable', //插入表格
						]
                    ]

                });
                um.placeholder("1000字以内！");
                um.addListener("ready", function () {
					um.setContent('');
					if ($ctrl.item.content) {
                    	um.setContent($ctrl.item.content);
                	}
				});
                // 先清空编辑器
                // um.execCommand('cleardoc');
                // 设置左对齐
                // um.execCommand('justify', 'left');
                // 内容插入编辑器
                // um.execCommand('insertHtml', $ctrl.item.content);
                // 富文本 超链接 点击事件
                $('body').delegate('.UM-Editor  .edui-body-container a','click',function(){
                    window.open(this.href);
                });
				initProducts();
				initSpaces();
            };

            //初始化products
            function initProducts(){
            	var names = [];
            	var paths = [];
            	if($ctrl.item.id){
                	if($ctrl.item.productName){
                		names = $ctrl.item.productName.split(",");
                	}
                	if($ctrl.item.productPath){
                		paths = $ctrl.item.productPath.split(",");
                	}
                	if(names.length != paths.length){
                		alert("作品数据错误");
                		return;
                	}
                	if(names.length==0){
                		return;
                	}
                	for(var i=0;i<names.length;i++){
                		$ctrl.products.push({productName:names[i],productPath:paths[i]})
                	}
            	}
            }

            $ctrl.spaceIds = [];
            //设置选择
            function initSpaceIds (){
            	if($ctrl.item.spaceId){
            		var ids = $ctrl.item.spaceId.split(",");
            		$(".ui-select2").select2().val(ids).trigger("change");
            	}
            }

            //获取选中值
            function getSpaceId(){
            	var spaceIds = $(".ui-select2").select2().val();
            	if(spaceIds){
            		return spaceIds.toString();
            	}
            	return "";
            }

            $ctrl.save = function(form) {
                 form.$setSubmitted(true);
	            if (!form.$valid) {
	                return;
	            }

	            if(!$ctrl.item.imgUrl){
	            	alert("请选择展览图片")
	            	return;
	            }
	            /*if(!$ctrl.item.photoUrl){
	            	alert("请选择艺术家照片")
	            	return;
	            }*/
	            var content = um.getContent();
	            if(!content || "<p>400字以内！</p>" == content){
	            	alert("请填写作品介绍")
	            	return;
	            }
	            var umText = um.getContentTxt();
	            if(umText && umText.length>MaxSize){
	            	alert("文本超出最大长度！");
	            	return;
	            }

	            $ctrl.item.spaceId = getSpaceId();

	            if(!$ctrl.item.spaceId){
	            	alert("请选择展览位置");
	            	return;
	            }

	            $ctrl.item.content = content;

	            var fileName = "";
	            var filePath = "";
	            $ctrl.products && $ctrl.products.forEach(function(item){
	            	fileName +=  item.productName + ",";
	            	filePath +=  item.productPath + ","
	            })
	            if(fileName){
	            	fileName = fileName.substring(0,fileName.length-1);
	            }
	            if(filePath){
	            	filePath = filePath.substring(0,filePath.length-1);
	            }

	            $ctrl.item.productName = fileName;
	            $ctrl.item.productPath = filePath;

	            $http.post('/ovu-gallery/guideScreen/editExhibition', $ctrl.item,fac.postConfig).success(function (data) {
	                if (data.code == 0) {
	                    msg(data.msg);
	                    // 关闭编辑器
		                // UM.delEditor('myEditor');
		                um.destroy();


		                $ctrl.close({
		                    $value: $ctrl.item
		                });
	                } else {
	                    alert(data.msg);
	                }
	            });
            };
            $ctrl.cancel = function() {
                $ctrl.dismiss({
                    $value: $ctrl.item
                });
                // 关闭编辑器
                // UM.delEditor('myEditor');
                um.destroy();
            };
            // 解绑代理事件
            $ctrl.$onDestroy = function(){
                $('body').undelegate();
            };

            //上传画册文件
			$ctrl.uploadFile = function(product){
				$rootScope.addLimitFile(product,"productPath","productName",[]);
			}

			$ctrl.moreFile = function(){
				if($ctrl.products.length>=2){
					alert("仅允许上传2张图片");
					return;
				}
        		$ctrl.products.push({productName:"",productPath:""});
	        }
	        $ctrl.delFile = function(product){
	        	$ctrl.products.splice($ctrl.products.indexOf(product), 1);
	        }
	        //初始化楼层位置
	        $(".ui-select2").select2({width:"resolve"});
	        //获取所有的楼层以及展厅
	        function initSpaces(){
	            if(!$ctrl.item.parkId){
	                return ;
	            }
	        	$http.post("/ovu-base/system/parkStage/treeNew",{parkId:$ctrl.item.parkId,level:5},fac.postConfig).success(function(ret){
	        		if(ret && ret.length>0){
	        			var builds = getBuilds(ret);
	        			var units = getFloors(builds);
	        			var floors = getFloors(units);
	        			var data = [];
	        			floors && floors.forEach(function(item){
	        				var node = {"id":item.id,"text":item.text,element:"HTMLOptGroupElement"};
	        				node.children = [];
	        				item.nodes && item.nodes.forEach(function(item1){
	        					if(item1.data.rmType == "FW1501"){
	        						node.children.push({"id":item1.id,"text":item1.text,element:"HTMLOptionElement"});
	        					}
	        				})
	        				if(node.children.length>0){
	        					data.push(node);
	        				}
	        			})
	        			$(".ui-select2").select2({data:data});
	        			initSpaceIds();
	        		}
	        	})
	        }

	        function getChildren(ret){
	        	var result = [];
	        	ret && ret.forEach(function(item){
	        		if(item.nodes && item.nodes.length>0){
	        			result = result.concat(item.nodes);
	        		}
	        	})
	        	return result;
	        }

	        function getBuilds(ret){
	        	return getChildren(ret);
	        }

	        function getFloors(ret){
	        	return getChildren(ret);
	        }

        }
    })
})()
