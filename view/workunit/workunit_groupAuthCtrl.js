(function() {
	var app = angular.module("angularApp");
	app.controller('workunitGroupAuthCtl', function ($scope,$rootScope,$uibModal, $http,$filter,fac) {
        document.title ="应急工单派发授权";
		$scope.pageModel = {};
        $scope.search = {};

		$scope.find = function(pageNo){
            if(!fac.initDeptId($scope.search)){
                return;
            }
            $scope.search.userId = $scope.search.user?$scope.search.user.userId:undefined;
			$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
			fac.getPageResult("/ovu-pcos/pcos/workunit/workunit_auth/list.do",$scope.search,function(data){
				$scope.pageModel = data;
			});
		};

		app.modulePromiss.then(function(){
            $rootScope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    $scope.find(1);
                }
            })
		});

      /*  $scope.selectPerson = function(item,search){
            if(item){
                search.userId = item.id;
            }
        }*/
        /**
         * 删除所有
         */
		$scope.delAll = function(){
			var userIds = $scope.pageModel.list.reduce(function(ret,n){n.checked && ret.push(n.userId);return ret},[]);
            var parkIds = $scope.pageModel.list.reduce(function(ret,n){n.checked && ret.push(n.parkId);return ret},[]);
            delGroup(userIds,parkIds);
		};

        /**
         * 删除
         * @param item
         */
		$scope.del = function(item){
			delGroup([item.userId],[item.parkId]);
		}

		function delGroup(userIds,parkIds){
			confirm("确认删除选中的"+userIds.length+"条记录?",function(){
				$http.get("/ovu-pcos/pcos/workunit/workunit_auth/groupDel.do",{params:{"userIds":userIds,"parkIds":parkIds}}).success(function(resp){
					if(resp.code == 0){
						$scope.find();
					}else{
						alert(resp.msg);
					}
				})
			});
		}

        //新增、编辑
		$scope.editModal = function(item) {
            item = item || {};
            var modal = $uibModal.open({
                animation: false,
                size:'',
                templateUrl: '/view/workunit/workunitAuth.modal.html',
                controller: 'workunitAuthCtrl'
                ,resolve: {auth:angular.extend({},item)}
            });
            modal.result.then(function (data) {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
		};
	});

    //派单授权
    app.controller('workunitAuthCtrl', function($scope,$http,$uibModalInstance,$filter,fac,auth) {
        $scope.item = auth;
        $scope.$watch('item.user',function(newV,oldV){
           
            $scope.selectPerson(newV)
         })

        //工作分类树
        /*if($scope.item.worktypeIds){
            var ss=$scope.item.worktypeIds.split(',');
            ss.forEach(function(typeId){
                var node = $scope.worktypeTreeFlat.find(function(n){return n.id == typeId});
                if(node){
                    node.state = node.state||{};
                    node.state.checked =true;
                    expandFather(node);
                }
            })
        }else{
            $scope.worktypeTreeFlat.forEach(function(node){
                node.state = node.state||{};
                node.state.checked =false;});
        }*/

        //选择人员
        $scope.selectPerson = function(user){
            if(!user.userId){
                alert("此用户“"+user.name+"”未分配系统账号！");
                return;
            }
            $scope.item.userId = user.userId;
            $http.get("/ovu-base/system/dept/rightTree.do?userId="+user.userId).success(function(resp){
                if(resp.code == 0) {
                    $scope.userDeptTree = resp.data;
                }
            })
        };

        if(auth.userId){
            auth.user = {userId:auth.userId,name:auth.personName};
            $http.get("/ovu-base/system/dept/rightTree.do?userId="+auth.userId).success(function(resp){
                if(resp.code == 0) {
                    $scope.userDeptTree = resp.data;
                    if(auth.deptId){
                        var node = fac.getNodeById($scope.userDeptTree,auth.deptId);
                        node &&(auth.deptName = node.text) ;
                    }
                }
            })
            if(auth.worktypeIds){
                var worktypeIdList = auth.worktypeIds.split(",");
                $scope.emerWorkTypeTreeFlat.forEach(function(n){
                    n.state = n.state||{};
                    worktypeIdList.indexOf(n.id)>-1?(n.state.checked =true):(n.state.checked =false);
                });
            }
        }

        //保存
        $scope.save = function(form,item){
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            var worktypeIds = [];
            fac.getCheckedIds(worktypeIds,$scope.emerWorkTypeTree);
            if(worktypeIds.length ==0){
                alert('请勾选应急工作分类！');
                return;
            }
            item.worktypeIds = worktypeIds.join();
            $http.post("/ovu-pcos/pcos/workunit/workunit_auth/groupSave.do",item,fac.postConfig).success(function(ret){
                if(ret.code == 0){
                    $uibModalInstance.close();
                    msg("授权成功!");
                }else{
                    alert(ret.msg);
                }
            })
        }

    });

})()
