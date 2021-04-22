	(function() {
		var app = angular.module("angularApp");

		app.controller('noticeCtl', function ($scope,$rootScope,$uibModal, $http,$filter,fac) {
            document.title ="OVU-通知管理";
			var USER_ID=null;
			$scope.pageModel = {};
            $scope.search = {};

			app.modulePromiss.then(function(){
				$scope.search = {
					isGroup: fac.isGroupVersion()
				};
				if(app.user){
					USER_ID = app.user.id;
				}
                $rootScope.$watch('dept.id', function (deptId, oldValue) {
                    if (deptId) {
                        $scope.find(1);
                    }else{
                        $scope.pageModel = {};
                    }
                })
			});


			//查询
			$scope.find = function(pageNo){
				if(!fac.initDeptId($scope.search)){
					return;
				}
				$.extend($scope.search,{currentPage:pageNo||1,pageSize:$scope.pageModel.pageSize||10});
				fac.getPageResult("/ovu-pcos/pcos/message/list.do",$scope.search,function(data){
					data.list && data.list.forEach(function(item){
						if(item.SENDER_ID==USER_ID && item.DATA_STATE==0){
							item.self=true;
						}else{
							item.self=false;
						}
						item.DEPT_NAMES=item.DEPT_NAMES?item.DEPT_NAMES:'';
						item.PERSON_NAMES=item.PERSON_NAMES?item.PERSON_NAMES:'';
					});
					$scope.pageModel = data;
				});
			};

			//批量删除
			$scope.delAll = function(){
				var ids = $scope.pageModel.list.reduce(function(ret,n){n.checked && ret.push(n.ID);return ret},[]);
				if(ids.length==0){
					alert("请选择要删除的通知！");
					return;
				}
				dodel(ids);
			};
			$scope.del = function(item){
				dodel([item.ID]);
			}
			function dodel(ids){
				confirm("确认删除选中的"+ids.length+"条通知?",function(){
					$http.post("/ovu-pcos/pcos/message/delete.do",{id:ids.join()},fac.postConfig).success(function(resp){
						if(resp.success){
							$scope.find();
						}else{
							alert('删除失败');
						}
					})
				});
			}

			//批量发送
			$scope.sendAll = function(){
				var ids = $scope.pageModel.list.reduce(function(ret,n){n.checked && n.DATA_STATE==0 && ret.push(n.ID);return ret},[]);
				if(ids.length==0){
					alert("仅有未发送的通知可以发送！");
					return;
				}

				dosend(ids);
			};
			$scope.send = function(item){
				dosend([item.ID]);
			}
			function dosend(ids){
				confirm("确认发送选中的"+ids.length+"条通知?",function(){
					$http.post("/ovu-pcos/pcos/message/send.do",{id:ids.join()},fac.postConfig).success(function(resp){
						if(resp.success){
							$scope.find();
						}else{
							alert('发送失败');
						}
					})
				});
			}

			$scope.showEditModal = function(group,readOnly){
				if(!fac.initDeptId($scope.search)){
					return;
				}
				group = group||{};
				var modal = $uibModal.open({
					animation: false,
					size:'lg',
					templateUrl: readOnly?'/view/notice/notice.show.html':'/view/notice/notice.modal.html',
					controller: 'noticeModalCtrl'
					,resolve: {group: $.extend(true,{},group)}
				});
				modal.result.then(function () {
					$scope.find();
				}, function () {
					console.info('Modal dismissed at: ' + new Date());
				});
			}


		});
		app.controller('noticeModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$uibModal,$filter,fac,group) {

			$scope.item = group;
            group.pics = group.PHOTOS?group.PHOTOS.split(","):[];
			$scope.opr=group.ID?'修改':'新建';

			//选择部门
			$scope.chooseDept = function(){
                $scope.parks = [];
                if(group.DEPT_NOS){
                    var vs=group.DEPT_NOS.split(',');
                    var vs2=group.DEPT_NAMES.split(',');
                    for (var i=0;i<vs.length;i++){
                        var park={};
                        park.id=vs[i];
                        park.name=vs2[i];
                        $scope.parks.push(park);
                    }
                }
                //弹出选择框
                openModal();

				function openModal(){
					var modal = $uibModal.open({
						animation: false,
						size:'',
						templateUrl: '/common/modal.deptMulti.html',
						controller: 'noticeMultiDeptModalCtrl'
						,resolve: {parks:function(){return angular.extend([],$scope.parks)}}
					});
					modal.result.then(function (data) {
						$scope.parks = data.parks;
						var deptIds=[];
						var deptNames=[];
						$scope.parks.forEach(function(item){
							deptIds.push(item.id);
							deptNames.push(item.name);
						});
						group.DEPT_NOS=deptIds.join();
						group.DEPT_NAMES=deptNames.join();

					}, function () {
						console.info('Modal dismissed at: ' + new Date());
					});
				}
			}

			//选择人员
			$scope.choosePerson = function(){
				var modal = $uibModal.open({
					animation: false,
					size:'lg',
					templateUrl: '/common/modal.select.person.html',
					controller: 'personSelectorCtrl'
					,resolve: {data:{
                        per_Id:group.PERSON_NOS,//人员id
                        per_Name:group.PERSON_NAMES//人员名字
					}}
				});
				modal.result.then(function (data) {
					if(data){
						group.PERSON_NOS = data.per_Id;
						group.PERSON_NAMES = data.per_Name;
					}
				}, function () {
					console.info('Modal dismissed at: ' + new Date());
				});
			}

            //保存
            $scope.save = function(form,item){
                form.$setSubmitted(true);
                if(!form.$valid){
                    return;
                }

                if((item.DEPT_NAMES==null || item.DEPT_NAMES=='')
                    &&(item.PERSON_NAMES==null || item.PERSON_NAMES=='')){
                    alert('请至少选择一个部门或人员');
                    return;
                }

                item.PHOTOS = item.pics.join(",");
                $http.post("/ovu-pcos/pcos/message/save.do",item,fac.postConfig).success(function(data, status, headers, config) {
                    if(data.success){
                        $uibModalInstance.close();
                        msg("保存成功!");
                    } else {
                        alert("保存失败");
                    }
                })
            }
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

			// 编辑框第二次加载
			$scope.$on('$destroy', function() {

			});
		});

		app.controller('noticeMultiDeptModalCtrl', function($scope,$rootScope,$http,$uibModalInstance,$filter,fac,parks) {

			$scope.config = {edit:false,showCheckbox:true};
			$scope.rightList = [];

            $scope.treeData = fac.getGlobalTree();
            $scope.flatData = fac.treeToFlat($scope.treeData);
            $scope.flatData.forEach(function (item) {
                if(item.state){
                    delete item.state.selected;
                }
            });

			function expandFather(node){
				var father = $scope.flatData.find(function(n){return n.id == node.pid});
				if(father){
					father.state = father.state||{};
					father.state.expanded = true;
					expandFather(father);
				}
			}
			parks.forEach(function(park){
				var node = $scope.flatData.find(function(n){return n.id == park.id});
				node.state = node.state||{};
				node.state.checked =true;
				expandFather(node);
				$scope.rightList.push(node);
			})

			$scope.check = function(node){

				node.state = node.state||{};
				node.state.checked = !node.state.checked;
				function checkSons(node,status){
					node.state = node.state||{};
					node.state.checked = status;
					if(node.nodes && node.nodes.length){
						node.nodes.forEach(function(n){checkSons(n,status);})
					}
				}
				function uncheckFather(node){
					var father = $scope.flatData.find(function(n){return n.id == node.pid});
					if(father){
						father.state = father.state||{};
						father.state.checked = false;
						uncheckFather(father);
					}
				}
				if(node.state.checked){
					checkSons(node,true);
				}else{
					checkSons(node,false);
					uncheckFather(node);
				}
				$scope.rightList = $scope.flatData.filter(function(n){return n.state&& n.state.checked == true})
			}
			$scope.save= function(){
				var parks = $scope.rightList.map(function(n){return {id: n.id,name: n.text}});
				$uibModalInstance.close({parks:parks});
			}
			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};
		});
	})()
