/**
 * 巡查项管理控制器
 */
(function() {
		var app = angular.module("angularApp");
		app.controller('insItemCtl', function ($scope,$rootScope, $http,$filter,$uibModal,fac) {
            document.title ="巡查项管理";
			$scope.config = {edit:true};
			//项目id
			$scope.pageModel = {};
            $scope.search = {};
			$scope.insItemTypeId = {};
			$scope.find = function(pageNo,insItemTypeId){
                if(!fac.hasOnlyPark($scope.search)){
                    return;
				}
				if(angular.isDefined(insItemTypeId)){
					$scope.search.insItemTypeId =insItemTypeId;
				}
				
				$.extend($scope.search,{currentPage:pageNo||1,pageSize:$scope.pageModel.pageSize||10});
				fac.getPageResult("/ovu-pcos/pcos/quality/insitem/list.do",$scope.search,function(data){
					$scope.pageModel = data;
				});
			};

			$scope.findAll = function () {
                //树数据
                $http.get("/ovu-pcos/pcos/quality/insitemtype/tree.do?parkId="+$scope.search.parkId).success(function(data){
                    $scope.insTreeData  = data || [];
                    !$scope.insTreeData[0] && ($scope.pageModel={});
                    $scope.insTreeData[0] && $scope.selectNode( $scope.insTreeData[0]);
                });
            }
            //初始化方法
            app.modulePromiss.then(function(){
                fac.initPage($scope, function() {
                    $scope.findAll();
                },function () {
                    $scope.find();
                });

            })

			//显示新增修改弹出框
			$scope.showModal = function(id){
				if(!fac.hasOnlyPark($scope.search)){
	                    return;
	            }
				var param={insItemTypeId:$scope.search.insItemTypeId,insItemId:id,parkId:$scope.search.parkId};
				var modal = $uibModal.open({
					animation: false,
					templateUrl: '/view/quality/insitem/modal.quality.insItem.html',
					controller: 'insItemrAddOrEditModalCtrl',
					resolve: {
						param: param
					}
				});
				modal.result.then(function () {
                    $scope.findAll();
				});
			}

			//删除巡查标准
			$scope.del= function(item){
				confirm("确定删除 "+item.name,function(){
					$http.post("/ovu-pcos/pcos/quality/insitem/delete.do",{insItemId: item.insItemId},fac.postConfig).success(function(resp){
						if(resp.success){
                            $scope.findAll();
                    }else {
                        alert(resp.msg)
						}
					});
				})
			};

			//**下方为左侧树
			//新增根节点
			$scope.addTopNode = function(){
				$scope.insTreeData.push({state:{edit:true},copy:{}});
			}

			//新增子节点
			$scope.addSon= function(node){
				node.nodes = node.nodes||[];
				node.state = node.state||{};
				node.state.expanded = true;
				node.nodes.push({parentId:node.id,state:{edit:true},copy:{parentId:node.id}});
			}
			//选择该节点
			$scope.selectNode= function (node) {
				if($scope.curNode != node){
					$scope.curNode && $scope.curNode.state &&($scope.curNode.state.selected = false);
				}
				node.state = node.state||{};
				node.state.selected = !node.state.selected;
				if(node.state.selected){
					$scope.curNode = node;
					$scope.find(1,$scope.curNode.id);
				}else{
					delete $scope.curNode;
				}
			}
			//删除节点
			$scope.delNode = function(node){
				if(node.nodes && node.nodes.length){
					alert("此节点有下级节点,不能删除！")
				}else{
					confirm("确定删除 "+node.text,function(){
						$http.post("/ovu-pcos/pcos/quality/insitemtype/delete.do",{insItemTypeId: node.id},fac.postConfig).success(function(resp){
							if(resp.success){
								if($scope.curNode == node){
									delete $scope.curNode;
								}
								var parent = node.parentId && fac.getNodeById($scope.insTreeData,node.parentId);
								if(parent){
									parent.nodes.splice(parent.nodes.indexOf(node),1)
								}else{
									$scope.insTreeData.splice($scope.insTreeData.indexOf(node),1)
								}
							}
						});
					})
				}
			}
			//保存节点
			$scope.save = function(node){
				if(fac.isNotEmpty(node.copy.text)){
					var insItemType = {};
					insItemType.name = node.copy.text;
					insItemType.insItemTypeId = node.copy.id;
					insItemType.parentId = node.copy.parentId;
					insItemType.parkId = $scope.search.parkId;
					$http.post("/ovu-pcos/pcos/quality/insitemtype/edit.do",insItemType,fac.postConfig).success(function(resp){
						if(resp.success){
							msg("保存成功！");
							node.id=resp.data.insItemTypeId;
							node.parentId=resp.data.parentId;
							node.text=resp.data.name;
							node.state.edit= false;
						}else{
							alert();
						}
					});
				}
			}
			//撤销
			$scope.undo = function(node){
				if(node.id){
					node.state.edit = false;
				}else{
					//获取父节点
					var parent = node.parentId && fac.getNodeById($scope.insTreeData,node.parentId);
					//如果有父节点，则从父节点的子list中删除
					if(parent){
						parent.nodes.splice(parent.nodes.indexOf(node),1)
					}else{
						$scope.insTreeData.splice($scope.insTreeData.indexOf(node),1)
					}
				}
			}
			//修改节点
			$scope.editNode = function(node){
				node.copy = angular.extend({},node);
				node.state = node.state||{};
				node.state.edit = true;

			}
		});

		app.controller('insItemrAddOrEditModalCtrl', function($scope,$http,$uibModalInstance,$filter,fac,param) {
			$scope.item={insItemTypeId:param.insItemTypeId,checkType:1};
			//如果是修改，则查询
			if(fac.isNotEmpty(param.insItemId)){
				$http.get("/ovu-pcos/pcos/quality/insitem/get.do?insItemId="+param.insItemId).success(function (data, status, headers, config) {
					if (fac.isNotEmpty(data)) {
						$scope.item = data;
					} else {
						alert();
					}
				})
			}

			$scope.save = function (form, item) {
				form.$setSubmitted(true);
				if (!form.$valid) {
					return;
				}
				if(fac.isEmpty(param.insItemId)){
					item.parkId = param.parkId;
				}
				delete  item.createTime;
				delete  item.modifyTime;
				$http.post("/ovu-pcos/pcos/quality/insitem/edit.do", item, fac.postConfig).success(function (data, status, headers, config) {
					if (data.success) {
						$uibModalInstance.close();
						msg("保存成功!");
					} else {
						alert();
					}
				})
			}
			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};

		});
})();
