/**
 * 知识库管理
 */
(function() {
	'use strict';
	
	document.title = "日志权限设置";
	var app = angular.module("angularApp");
	
	app.controller('permissionsCtrl',permissionsCtrl);
	function permissionsCtrl($scope,$timeout,$uibModal,$http,fac){
		var vm = this;
        $scope.pageModel = {};
		$scope.search = {};

        app.modulePromiss.then(function(){
            fac.initPage($scope, function() {
                $scope.find();
            },function () {
                $scope.find();
            });

        })
 
        //分页表格
	    $scope.find = function(pageNo,ids){
            if(!fac.hasActivePark($scope.search)){
                return;
            }
            if(!$scope.search.deptName){
                delete $scope.search.personIds;
            }
	    	angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult("/ovu-pcos/pcos/worklogs/worklogpermission/list.do", $scope.search, function(data) {
                $scope.pageModel = data;
            });	
	    }
        $scope.selectedPerson=function(item,search){
            search.personIds=item.id;
        }
	    //新增修改弹出框
	    vm.showEditModal = function(id){
            var param={id:id,parkId:$scope.search.parkId};
	    	var modal = $uibModal.open({
				animation: false,
				templateUrl: '../view/log/permissions/modal.permissionsEdit.html',
				size : 'lg',
				controller: 'permissionsEditModalCtrl',
				resolve: {
                    param: param
				}
			});
			modal.result.then(function () {
				$scope.find();
			}, function () {
				console.info('Modal dismissed at: ' + new Date());
			});
	    }
	  
	    vm.del = function(id){
	    	confirm("确认删除该记录?",function(){
	    		$http.get("/ovu-pcos/pcos/worklogs/worklogpermission/delete.do?permissionId="+id).success(function (data, status, headers, config) {
					if (data.success) {
						$scope.find();
						msg();
					} else {
						alert(data.msg);
					}
				})
			});
	    }
	    
	}
	 //新增修改弹出框控制器
	app.controller('permissionsEditModalCtrl',repositoryEditModalCtrl);
	function repositoryEditModalCtrl($scope,$timeout,$uibModalInstance,$http,fac,param){
		var vm = $scope.vm = this;
        $scope.pageModel = {};
        $scope.search = {parkId:param.parkId};
        fac.setPostDict($scope);
        vm.type;
        var id = param.id;
        var parkId =  param.parkId;

		if(fac.isNotEmpty(id)){
			$http.get("/ovu-pcos/pcos/worklogs/worklogpermission/getSingle.do?permissionId="+id).success(function (data, status, headers, config) {
				if (fac.isNotEmpty(data)) {
					vm.leaders = [data.workLogPermission];
					vm.staffs = data.menberList || [];
                    vm.type = data.workLogPermission.level;
				}
			})
		}
		
		vm.save = function () {
			if(fac.isEmpty(vm.leaders) || fac.isEmpty(vm.staffs)){
				alert("请填写数据");
			}
            var personIdList = vm.staffs.map(function (obj) {
				return obj.personId;
			})
			var param= {personIdList:personIdList,type:vm.type,personId:vm.leaders[0].personId,permissionId:id,parkId:parkId};
			$http.post("/ovu-pcos/pcos/worklogs/worklogpermission/edit.do", param).success(function (data, status, headers, config) {
				if (data.success) {
					$uibModalInstance.close();
					msg("保存成功!");
				} else {
					alert();
				}
			})
		}
		
		//设置 主任还是主管
		vm.setPerson = function (type) {
			if(type == 3 && !vm.type){
				alert("请先设置主任或者主管");
				return;
			}
			if(!vm.type){
                vm.type = type;
			}
			if(vm.type == 1){
				if(type == 1){
                    vm.setLeader();
                }else if(type == 2){
					if(fac.isEmpty(vm.leaders)){
						alert("请先设置上级领导");
						return;
					}
                    vm.setStaff()
				}
			}else if(vm.type == 2){
                if(type == 2){
                    vm.setLeader();
                }else if(type == 3){
                    if(fac.isEmpty(vm.leaders)){
                        alert("请先设置上级领导");
                        return;
                    }
                    vm.setStaff();
                }
			}
        }
		
		//设为上一级
        vm.leaders=[];
        vm.setLeader= function () {
        	//员工已选择的id,这里是为了选择领导时避免和员工有相同的值
            var selectedIds=vm.staffs.reduce(function (ret,obj) {
                ret.push(obj.personId);
                return ret
            },[]);

            //当前列表已选择的人员
            var selectedPerson=$scope.pageModel.data.reduce(function (ret,obj) {
                obj.checked && selectedIds.indexOf(obj.id) == -1 &&  ret.push({name:obj.name,personId:obj.id});
                return ret
            },[]);
			if(selectedPerson.length == 1){
                vm.leaders = selectedPerson;
            }else{
				alert("上级领导只能选择一个,且不能与下级成员重复");
			}
        }
        //设为下一级
        vm.staffs=[];
        vm.setStaff = function () {
            var selectedIds=vm.staffs.reduce(function (ret,obj) {
				ret.push(obj.personId);
                return ret
            },[]);

            $scope.pageModel.data.forEach(function (obj,index) {
            	var param ={name:obj.name,personId:obj.id};
            	//过滤重复数据
                if (obj.checked && obj.id!=vm.leaders[0].personId  && selectedIds.indexOf(param.personId) == -1){
                    vm.staffs.push(param);
                }
            });
        }
        //删除下级
        vm.del=function(persons,person){
            persons.splice(persons.indexOf(person),1);
        };

        //删除上级
        vm.delLeader=function(persons,person){
            persons.splice(persons.indexOf(person),1);
            vm.type = null;
        };

        //人员列表
        $scope.find = function(pageNo){
            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult("/ovu-base/pcos/person/listByGrid.do", $scope.search, function(data) {
                data.list.forEach(function(n){
                    n.postList = [];
                    n.mrList = [];
                    if(n.postIds){
                        var deptpost = n.postIds.split(",");
                        n.postList = deptpost.map(function(m){return m.indexOf("^")>0?(m.split("^")):(null)})
                        delete n.postIds;
                    }
                    if(n.roleIds){
                        n.mrList = n.roleIds.split(',');
                    }
                })
                $scope.pageModel = data;
            });
        }

		//部门数
        $http.post("/ovu-base/system/dept/tree.do",{parkId:parkId},fac.postConfig).success(function(data){
            if(fac.isNotEmpty(data)){
                //默认查询第一个部门的人员
                data[0].state = {selected:true};
                $scope.search.deptId = data[0].id;
                $scope.find(1);

                // var $checkableTree = $('#dept_tree').treeview({
                //     data:  data,
                //     showIcon: false,
                //     showCheckbox: false,
                //     onNodeSelected: function(event, node) {
                //         if(node.did){
                //             $scope.search.DEPT_ID = node.did;
                //             $scope.find(1);
                //         }
                //     },
                //     onNodeUnchecked: function (event, node) {
                //         delete $scope.search.DEPT_ID;
                //         console.log(node.did);
                //     }
                // });
                $('#dept_tree').treeview({ data : data});
                var treeView = $("#dept_tree").data('treeview');
                $scope.oriList = treeView.getUnchecked();

                $('#dept_tree').on('nodeSelected', function(event, node) {
                    if(node.id){
                        $scope.search.deptId = node.id;
                        $scope.find(1);
                    }
                });
                $('#dept_tree').on('nodeUnselected', function(event, node) {
                    delete $scope.search.deptId;
                    console.log(node.id);
                });
            }
        });

		vm.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};

	}

})()
