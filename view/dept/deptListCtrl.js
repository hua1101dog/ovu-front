(function() {
	document.title ="OVU-组织架构";
	var app = angular.module("angularApp");
	app.controller('deptCtl', function ($scope,$rootScope, $http,$filter,$uibModal,fac) {
		$scope.config={edit:true,moveOper: true};
		$scope.pageModel = {};
        $scope.search={};

        //刷新组织机构
        $scope.refresh = function(){
            fac.reloadGlobalDept($scope);
           
        };

		//选中节点
		$scope.selectNode= function (node) {
			if($scope.curNode != node){
				$scope.curNode && $scope.curNode.state &&($scope.curNode.state.selected = false);
			}
			node.state = node.state||{};
			node.state.selected = !node.state.selected;
			if(node.state.selected){
				$scope.curNode = node;
			}else{
				delete $scope.curNode;
			}
		};

        //新增组织
        $scope.addSon= $scope.addTopNode = function(node){
            var modal = $uibModal.open({
                animation: false,
                size:'lg',
                templateUrl: '/view/dept/modal.dept.html',
                controller: 'deptModalCtrl'
                ,resolve: {dept: {parentId:node?node.id:''}}
            });
            modal.result.then(function (data) {
                data.text=data.deptName;
                data.pid=data.parentId;
                if(node){
                    node.state = node.state || {};
                    node.state.expanded = true;
                    node.nodes = node.nodes || [];
                    node.nodes.push(data);
                }else{
                    $scope.deptTree.push(data);
                }
               
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        //移动组织
        $scope.moveNode = function(node){
            let deptTreeCopy = $.extend(true,[],$scope.deptTree);
            let copy = fac.getNodeById(deptTreeCopy,node.id);

            if(deptTreeCopy.indexOf(copy)>-1){
                deptTreeCopy.splice(deptTreeCopy.indexOf(copy),1);
            }else{
                let pnode = fac.getNodeById(deptTreeCopy,copy.pid);
                pnode.nodes.splice(pnode.nodes.indexOf(copy),1);
            }
            var modal = $uibModal.open({
                animation: false,
                size:'',
                templateUrl: 'dept/modal.moveDept.html',
                controller: 'moveDeptModalCtrl'
                ,resolve: {item: function(){return copy;},deptTree:function(){return deptTreeCopy}}
            });
            modal.result.then(function (data) {
                // $scope.refresh();
             
                data.text=data.deptName;
                var onode = fac.getNodeById($scope.deptTree,node.id);
                if (onode.pid!=0 && fac.getNodeById($scope.deptTree,onode.pid)) {
                    var pnode=fac.getNodeById($scope.deptTree,onode.pid);
                    pnode.nodes.splice(pnode.nodes.indexOf(onode), 1)
                } else {
                    $scope.deptTree.splice($scope.deptTree.indexOf(onode), 1)
                }
                let copy = fac.getNodeById($scope.deptTree,data.parentId);
                 
            
                copy.state = copy.state || {};
                copy.state.expanded = true;
                copy.nodes = copy.nodes || [];
              
                copy.nodes.push(data);
             
               
              
             
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        //编辑组织
        $scope.editNode = function(node){
            var dept=node || {};
            var modal = $uibModal.open({
                animation: false,
                size:'lg',
                templateUrl: '/view/dept/modal.dept.html',
                controller: 'deptModalCtrl'
                ,resolve: {dept: dept}
            });
            modal.result.then(function (data) {
                data.text=data.deptName;
                angular.extend(node,data);

               
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
        //删除组织
        $scope.delNode = function(node){
            if(node.nodes && node.nodes.length>0){
                alert('该组织下还有子组织，不能删除！');
                return;
            }

            confirm("确认删除组织["+node.text+"]吗?",function(){
                $http.post("/ovu-base/system/dept/remove.do",{id:node.id},fac.postConfig).success(function(data){
                    if(data.code==0){
                        if ($scope.curNode == node) {
                            delete $scope.curNode;
                        }
                        delNode(node.id);

                       
                        msg('删除成功！');
                    }else{
                        alert(data.msg);
                    }
                });
            })

            function delNode(id){
                var onode = fac.getNodeById($scope.deptTree,id);
                if (onode.pid!=0 && fac.getNodeById($scope.deptTree,onode.pid)) {
                    var pnode=fac.getNodeById($scope.deptTree,onode.pid);
                    pnode.nodes.splice(pnode.nodes.indexOf(onode), 1)
                } else {
                    $scope.deptTree.splice($scope.deptTree.indexOf(onode), 1)
                }
            }
        };

	});

	app.controller('deptModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$uibModal,$filter,fac,dept) {
        $rootScope.getDomainParkTree().then(function (data) {
            $scope.parkTree = data;
        });

		$scope.item = dept || {};

		if(dept.id){
            $http.post("/ovu-base/system/dept/get.do",{id:dept.id},fac.postConfig).success(function(resp){
                var data=resp.data;
                if(data){
                    $scope.item=data;
                    $scope.item.deptType=$scope.item.deptType!=undefined?parseInt($scope.item.deptType):'';
                    $scope.item.posts=$scope.item.posts || [];
                }
            });
        }

		//选择项目
        $scope.selectPark = function(node) {
            if (node && node.parkType == 1) {
                $scope.item.parkName=node.text;
                $scope.item.parkId=node.id;
                $scope.item.parkHover = $scope.item.parkFocus = false;
            } else {
                alert("请选择根节点项目！");
            }
        }

		//是否项目选择
		$scope.changeType=function(type){
			if(type && type==1){
				console.log(type);
			}else{
				$scope.item.parkName='';
				$scope.item.parkId='';
			}
		};

		//添加岗位
		$scope.addPostItem=function(){
			var modal = $uibModal.open({
				animation: false,
				size:'lg',
				templateUrl: '/common/modal.select.post.html',
				controller: 'postSelectorCtrl',
				resolve: {data:{}}
			});
			modal.result.then(function (data) {
                $scope.item.posts=$scope.item.posts || [];
				if($scope.item.posts.length>0){
					data.forEach(function(part){
						$scope.item.posts.forEach(function(item){
							if(part.id==item.id){
								part.isExist=true;
							}
						});
					});
				}

				data.forEach(function(part){
					if(!part.isExist){
						$scope.item.posts.push({id:part.id,postName:part.postName});
					}
				});
			});

		};
		//删除岗位
		$scope.delpost=function(posts,post){
			posts.splice(posts.indexOf(post),1);
		};

		//保存
		$scope.save = function(form, item) {
			form.$setSubmitted(true);
			if (!form.$valid) {
				return;
			}

			$http.post("/ovu-base/system/dept/save.do", item).success(function(data) {
				if (data.code==0) {
					$uibModalInstance.close(data.data);
					msg("保存成功!");
				} else {
					alert(data.msg);
				}
			})
		}
	});

    app.controller('moveDeptModalCtrl', function($scope,$http,$uibModalInstance,fac,item,deptTree) {
        $scope.item = item;
        $scope.deptTree = deptTree;
        $scope.save = function () {
            item.parentId=item.parentId||"0";
            $http.post("/ovu-base/system/dept/save.do", item).success(function (data, status, headers, config) {
                if (data.code === 0) {
                    $uibModalInstance.close(data.data);
                    msg("保存成功!");
                } else {
                    alert(data.msg);
                }
            })
        }
    });

})()
