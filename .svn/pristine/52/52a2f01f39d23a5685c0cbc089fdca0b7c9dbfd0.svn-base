(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('housePersonCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "房屋人员管理";
        $scope.search = {};
        $scope.pageModel = {};
        app.modulePromiss.then(function () {
            
            $scope.$watch('dept', function (dept, oldValue){
                $scope.search.parkId = dept.parkId;
                $scope.deptName = dept.deptName;
                $scope.find();
            },true)
            
          
        })
        //分页
        $scope.find = function (pageNo) {
            if(!$scope.search.parkId && !("丽岛物业" == $scope.deptName)){
                alert("请选择项目节点！");
                return;
            }
            
            angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult('/ovu-base/ownerPerson/list', $scope.search, function (data) {
                data.data && data.data .forEach(function(v){
                    if (!v.role) {
                        v.role = [];
                    } else {
                        v.role = v.role.split(",") || [];
                        
                        
                    }
                    if (!v.address) {
                        v.address = [];
                    } else {
                        v.address = v.address.split(",") || [];
                        
                        
                    }
                    
                    //处理长度
                    if(v.roleParkHouseList){
                    	for(var key in v.roleParkHouseList){
                    		v[key] = 0;
                    		for(var key1 in v.roleParkHouseList[key]){
                    			v[key] = v[key] + v.roleParkHouseList[key][key1].length;
                    		}
                    	}
                    }
                })
                $scope.pageModel=data;

            })
        }
        //添加人员，弹出模态框
        $scope.showAddModal = function (task) {
            var copy = angular.extend({ parkId: $scope.search.parkId }, task);
            var modal = $uibModal.open({
                animation: false,
                templateUrl: '../view/owner/modal.housePerson.add.html',
                size: 'md',
                controller: 'housePersonAddModalCtrl',
                controllerAs: 'vm',
                resolve: {
                    task: copy
                }
            });
            modal.result.then(function () {
                // $scope.find();
            }, function () {
                // $scope.find();
            })
        }
       
        //角色，弹出模态框
        $scope.showEditModal = function (task,list) {
            var copy = angular.extend({ parkId: $scope.search.parkId, isGroup:$scope.search.isGroup,treeData:list}, task);
            var modal = $uibModal.open({
                animation: false,
             //   templateUrl: '../view/owner/modal.housePerson.edit.html',
             //	templateUrl: '../view/owner/modal.housePerson.editnew.html', //新编辑模板，引入车辆管理改造 2018/10/09
             templateUrl: '../view/owner/modal.housePerson.showDetail.html', //只做查看 2020/08/26 cx
                size: 'lg',
             //  controller: 'housePersonEditModalCtrl',
             	controller: 'housePersonEditNewModalCtrl', ////新编辑模板，引入车辆管理改造 2018/10/09
                controllerAs: 'vm',
                resolve: {
                    task: copy
                }
            });
            modal.result.then(function () {
                // $scope.find();
            }, function () {
              
            })
        }
        //批量删除人员
        $scope.delAll = function () {
            var flag = true
            $scope.selectList = $rootScope.getCheckData($scope.pageModel.data)
            for (var i = 0; i < $scope.selectList.length; i++) {
                if ($scope.selectList[i].roleParkHouseList) {
                    flag = false
                    break;
                }

            }
            if (!flag) {
                alert('只可删除无角色信息的数据')
                return
            }
            var ids = $scope.pageModel.list.reduce(function (ret, n) { n.checked && ret.push(n.id); return ret }, []);
            del(ids);
        };
        //删除人员
        $scope.del = function (item) {
            del([item.id]);

        }
        function del(ids) {
            confirm("确认删除选中的" + ids.length + "条记录?", function () {
                $http.post("/ovu-base/ownerPerson/delete.do", { "ids": ids.join() }, fac.postConfig).success(function (resp) {
                    if (resp.code == "0") {
                        $scope.find();
                        msg(resp.msg);
                    } else {
                        alert(resp.msg);
                    }
                })
            });
        }

    });
    //添加人员
    app.controller('housePersonAddModalCtrl', function ($scope, $uibModal, $uibModalInstance, $http, fac, task) {
        var vm = $scope.vm = this;
        $scope.item={};
        if (fac.isNotEmpty(task.id)) {
            $http.get('/ovu-base/ownerPerson/getBasicInfo', { params: { id: task.id } }).success(function (res) {
                angular.extend($scope.item, res.data);
            })
        }
        vm.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return
            }
            angular.extend(item, { parkId: task.parkId })
            delete item.createTime;
            delete item.modifyTime;
            $http.get('/ovu-base/ownerPerson/add.do', { params: item }).success(function (res) {
                if (res.code == '0') {
                    $uibModalInstance.close();
                    msg("操作成功!");
                } else {
                    alert("操作失败!");
                    $uibModalInstance.close();
                }
            })
        }
        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    })
  
	//新版编辑人员
	//加入车辆信息维护
	//2018-10-09
	app.controller('housePersonEditNewModalCtrl', function ($scope, $uibModal, $uibModalInstance, $http, fac, task) {
        var vm = $scope.vm = this;
        vm.owner = [];
        vm.relative = [];
        vm.tenant = [];
        vm.isGroup=task.isGroup;
         $scope.search={};
	    
	    var selectedIndex;
	    
	    $scope.changeIndex = function (index) {
			selectedIndex = index;
	    };
        
	    //集团版, 用于选择项目
	    $scope.findPark = function (search) {
	        var modal = $uibModal.open({
	            animation: false,
	            size: "lg",
	            templateUrl: '/common/modal.select.parks.html',
	            controller: 'parksSelectorCtrl',
	            resolve: {
	                data: function () {
	                    return { isOnly: true }
	                }
	            }
	        });
	       
	        modal.result.then(function (data) {
	            search = search || {};
	            search.parkName = data.fullPath;
	            search.parkId = data.id;
	            search.stageId=null;
	            search.floorId=null;
	            search.unitNum=null;
	            search.treeData=[];
	            $http.post("/ovu-base/system/park/stageList.do", {
	                parkId: search.parkId,
	            }, fac.postConfig).success(function (res) {
	                search.treeData = res.data;
	    
	            });
	        });
	        
	    }
	        //获取楼栋
        $scope.ownergeneBuild = function (task) {
            if (!task || !task.stageId) {
                task.buildList = [];
                return;
            }
            var param = {
                stageId: task.stageId.id || task.stageId
            }
            $http.get("/ovu-base/system/parkBuild/getBuilds.do", { params: param }).success(function (res) {
                task.buildList = res;
            });
        }
        $scope.relativegeneBuild = function (task) {
            if (!task || !task.stageId) {
                task.buildList1 = [];
                return;
            }
            var param = {
                stageId: task.stageId.id || task.stageId
            }
            $http.get("/ovu-base/system/parkBuild/getBuilds.do", { params: param }).success(function (res) {

                task.buildList1 = res;

            });
        }
        $scope.tenantgeneBuild = function (task) {
            if (!task || !task.stageId) {
                task.buildList2 = [];
                return;
            }
            var param = {
                stageId: task.stageId.id || task.stageId
            }
            $http.get("/ovu-base/system/parkBuild/getBuilds.do", { params: param }).success(function (res) {

                task.buildList2 = res;

            });
        }
        //获取单元
        $scope.ownergeneUnit = function (task) {

            if (!task || !task.buildId) {
                task.unitList = [];
                return;
            }
            var param = {
                pageSize: 1000,
                pageIndex: 0,
                buildId: task.buildId.id || task.buildId
            };
            $http.get("/ovu-base/system/parkHouse/listUnitNo_mute.do", { params: param }).success(function (resp) {
                task.unitList = resp.data;
      })
        }
        $scope.relativegeneUnit = function (task) {
            if (!task || !task.buildId) {
                task.unitList1 = [];
                return;
            }
            var param = {
                pageSize: 1000,
                pageIndex: 0,
                buildId: task.buildId.id || task.buildId
            };
            $http.get("/ovu-base/system/parkHouse/listUnitNo_mute.do", { params: param }).success(function (resp) {
                task.unitList1 = resp.data;

            })
        }
        $scope.tenantgeneUnit = function (task) {
            if (!task || !task.buildId) {
                task.unitList2 = [];
                return;
            }
            var param = {
                pageSize: 1000,
                pageIndex: 0,
                buildId: task.buildId.id || task.buildId
            };
            $http.get("/ovu-base/system/parkHouse/listUnitNo_mute.do", { params: param }).success(function (resp) {
                task.unitList2 = resp.data;

            })
        }
        //获取楼层
        $scope.ownergeneGround = function (task) {

            if (!task || !task.buildId || !task.unitNo) {
                task.groundList = [];
                return;
            }
            var param = {
                pageSize: 1000,
                pageIndex: 0,
                buildId:task.buildId.id || task.buildId,
                unitNo: task.unitNo
            };
            $http.get("/ovu-base/system/parkHouse/listGroundNo_mute.do", { params: param }).success(function (resp) {
                task.groundList = resp.data;

            })
        }
        $scope.relativegeneGround = function (task) {

            if (!task || !task.buildId || !task.unitNo) {
                task.groundList1 = [];
                return;
            }
            var param = {
                pageSize: 1000,
                pageIndex: 0,
                buildId: task.buildId.id || task.buildId,
                unitNo: task.unitNo
            };
            $http.get("/ovu-base/system/parkHouse/listGroundNo_mute.do", { params: param }).success(function (resp) {
                task.groundList1 = resp.data;

            })
        }
        $scope.tenantgeneGround = function (task) {

            if (!task || !task.buildId || !task.unitNo) {
                task.groundList2 = [];
                return;
            }
            var param = {
                pageSize: 1000,
                pageIndex: 0,
                buildId: task.buildId.id || task.buildId,
                unitNo: task.unitNo
            };
            $http.get("/ovu-base/system/parkHouse/listGroundNo_mute.do", { params: param }).success(function (resp) {
                
                task.groundList2 = resp.data;

            })
        }
        $scope.ownergetHouseList = function (task) {
            if(!task.groundNo){
                task.houseList = [];
                return
            }
            
            if (task.groundNo) {
                $http.post("/ovu-base/system/parkHouse/getHouses.do",
                    {
                        buildId: task.buildId.id || task.buildId,
                        unitNo: task.unitNo,
                        groundNo: task.groundNo,
                        //商业用房也支持新增
                        // roomCategory: "FW12,FW16,FW11"
                    }, fac.postConfig).success(function (list) {
                        task.houseList = list.data;

                    })
            }

        }
        $scope.relativegetHouseList = function (task) {
            
            if(!task.groundNo){
                $scope.houseList1 = [];
                return
            }
            if (task.groundNo) {
                $http.post("/ovu-base/system/parkHouse/getHouses.do",
                    {
                        buildId: task.buildId.id || task.buildId,
                        unitNo: task.unitNo,
                        groundNo: task.groundNo,
                        // roomCategory: "FW12,FW16,FW11"
                    }, fac.postConfig).success(function (list) {
                        task.houseList1 = list.data;

                    })
            }

        }
        $scope.tenantgetHouseList = function (task) {
          if(!task.groundNo){
                $scope.houseList2 = [];
                return
            }
            if (task.groundNo) {
                $http.post("/ovu-base/system/parkHouse/getHouses.do",
                    {
                        buildId: task.buildId.id || task.buildId,
                        unitNo: task.unitNo,
                        groundNo: task.groundNo,
                        // roomCategory: "FW12,FW16,FW11"
                    }, fac.postConfig).success(function (list) {
                    task.houseList2 = list.data;

                    })
            }

        }
        $http.get('/ovu-base/ownerPerson/detail.do', { params: { id: task.id } }).success(function (res) {
            angular.extend(vm.owner, res.data.owner);
            angular.extend(vm.relative, res.data.relative);
            angular.extend(vm.tenant, res.data.tenant);
            vm.owner && vm.owner.forEach(function (v) {
                if (v.stageId) {
                    $http.post("/ovu-base/system/park/stageList.do", {
                        parkId: v.parkId,
                    }, fac.postConfig).success(function (res) {
                        v.treeData = res.data;
                        v.stageId = v.treeData.find(function (n) { return n.id == v.stageId }) || v.stageId ;
                    });
                   
                    if (v.buildId) {
                        var param = {
                            stageId: v.stageId.id ||v.stageId
                        }
                        $http.get("/ovu-base/system/parkBuild/getBuilds.do", { params: param }).success(function (res) {
                            v.buildList = res;
                            v.buildId = v.buildList.find(function (n) { return n.id == v.buildId })

                        });
                        $scope.ownergeneUnit(v);
                        $scope.ownergeneGround(v);
                        $scope.ownergetHouseList(v);

                    }
                }
            })
            vm.relative && vm.relative.forEach(function (v) {
                if (v.stageId) {
                    $http.post("/ovu-base/system/park/stageList.do", {
                        parkId: v.parkId,
                    }, fac.postConfig).success(function (res) {
                        v.treeData = res.data;
                        v.stageId = v.treeData.find(function (n) { return n.id == v.stageId }) || v.stageId ;
                    });
                    if (v.buildId) {
                        var param = {
                            stageId: v.stageId.id || v.stageId
                        }
                        $http.get("/ovu-base/system/parkBuild/getBuilds.do", { params: param }).success(function (res) {
                            v.buildList1 = res;
                            v.buildId = v.buildList1.find(function (n) { return n.id == v.buildId })

                        });
                        $scope.relativegeneUnit(v);
                        $scope.relativegeneGround(v);
                        $scope.relativegetHouseList(v);

                    }
                }
            })
            vm.tenant && vm.tenant.forEach(function (v) {
                if (v.stageId) {
                    $http.post("/ovu-base/system/park/stageList.do", {
                        parkId: v.parkId,
                    }, fac.postConfig).success(function (res) {
                        v.treeData = res.data;
                        v.stageId = v.treeData.find(function (n) { return n.id == v.stageId }) || v.stageId ;
                    });
                    if (v.buildId) {
                        var param = {
                            stageId: v.stageId.id || v.stageId
                        }
                        $http.get("/ovu-base/system/parkBuild/getBuilds.do", { params: param }).success(function (res) {

                            v.buildList2 = res;
                            v.buildId = v.buildList2.find(function (n) { return n.id == v.buildId })

                        });
                        $scope.tenantgeneUnit(v);
                        $scope.tenantgeneGround(v);
                        $scope.tenantgetHouseList(v);

                    }
                }
                v.beginTime=v.beginTime.substring(0, 10)
                    v.endTime=v.endTime.substring(0, 10)
            })

        })
        //添加业主
        vm.addOwner = function () {
            vm.owner.push({});
        }
       
        //单个删除业主
        vm.delOwner = function (item) {
            vm.owner.splice(vm.owner.indexOf(item), 1);

        }
        //添加亲属
        vm.addRelative = function () {
            vm.relative.push({});
        }
        //单个删除亲属
        vm.delRelative = function (item) {
            vm.relative.splice(vm.relative.indexOf(item), 1);

        }
        //添加租户
        vm.addTenant = function () {
            vm.tenant.push({status:'1'});
        }
        //单个删除租户
        vm.delTenant = function (item) {
            vm.tenant.splice(vm.tenant.indexOf(item), 1);

        }
        
        //车辆新增删除
        //begin
        vm.addOwnerCar = function(item){
        	if(!item.ownerCars){
        		item.ownerCars = [];
        	}
        	item.ownerCars.push({});
        }
        vm.delOwnerCar = function(item,car){
        	item.ownerCars.splice(vm.tenant.indexOf(car), 1);
        }
        //end
        
        vm.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {   
                return
            }
            
            //车辆校验
            //begin
            var cars = [];
            var carNos = [];
            var carExistedFlag = false;
            var repeatCarNo ;
            vm.owner && vm.owner.forEach(function(v){
            	v.ownerCars && v.ownerCars.forEach(function(u){
            		u.parkId = v.parkId;
            		cars.push(u);
            		if(vm.contains(carNos,u.carNo+"||"+v.parkId)){
            			carExistedFlag = true;
            			repeatCarNo = u.carNo;
            		}else{
            			carNos.push(u.carNo+"||"+v.parkId);
            		}
            	})
            })
            vm.relative && vm.relative.forEach(function(v){
            	v.ownerCars && v.ownerCars.forEach(function(u){
            		u.parkId = v.parkId;
            		cars.push(u);
            		if(vm.contains(carNos,u.carNo+"||"+v.parkId)){
            			carExistedFlag = true;
            			repeatCarNo = u.carNo;
            		}else{
            			carNos.push(u.carNo+"||"+v.parkId);
            		}
            	})
            })
            vm.tenant && vm.tenant.forEach(function(v){
            	v.ownerCars && v.ownerCars.forEach(function(u){
            		u.parkId = v.parkId;
            		cars.push(u);
            		if(vm.contains(carNos,u.carNo+"||"+v.parkId)){
            			carExistedFlag = true;
            			repeatCarNo = u.carNo;
            		}else{
            			carNos.push(u.carNo+"||"+v.parkId);
            		}
            	})
            })
            if(carExistedFlag){
            	alert("车牌号'"+repeatCarNo+"'重复！");
            	return;
            }
            $http.post('/ovu-base/owner/car/checkCar', {"cars":cars,"id":task.id}).success(function (res) {
                if (res.code == "-1") {
                    alert(res.msg);
                } else {
		            //判断是否有重复值
		            var arr=vm.owner.concat(vm.relative, vm.tenant);
		            var arr1=[];
		            arr && arr.forEach(function(v){
		                arr1.push(v.houseId)
		            })
		            
		            function repeat(arr)
		            {
		               return /(\x0f[^\x0f]+)\x0f[\s\S]*\1/.test("\x0f"+arr.join("\x0f\x0f") +"\x0f");
		            }
		            if(repeat(arr1)){
		                alert('房屋信息重复');
		               return
		            }
		            vm.owner && vm.owner.forEach(function (n) {
		                if (n.stageId.id) {
		                    n.stageId = n.stageId.id
		                }
		                if (n.buildId.id) {
		                    n.buildId = n.buildId.id
		                }
		                angular.extend(n, { role: "1", id: task.id , parkId: n.parkId});
		                // n.treeData && delete n.treeData
		                // n.houseList && delete n.houseList
		                // n.unitList && delete n.unitList
		                // n.groundList && delete n.groundList
		                // n.buildList && delete n.buildList
		            });
		            vm.relative && vm.relative.forEach(function (n) {
		                if (n.stageId.id) {
		                    n.stageId = n.stageId.id
		                }
		                if (n.buildId.id) {
		                    n.buildId = n.buildId.id
		                }
		                // n.treeData1 && delete n.treeData1
		                // n.houseList1 && delete n.houseList1
		                // n.unitList1 && delete n.unitList1
		                // n.groundList1 && delete n.groundList1
		                // n.buildList1 && delete n.buildList1
		                angular.extend(n, { role: "2", id: task.id, parkId: n.parkId })
		            });
		            vm.tenant && vm.tenant.forEach(function (n) {
		                if (n.stageId.id) {
		                    n.stageId = n.stageId.id
		                }
		                if (n.buildId.id) {
		                    n.buildId = n.buildId.id
		                }
		                // n.treeData2 && delete n.treeData2
		                // n.houseList2 && delete n.houseList2
		                // n.unitList2 && delete n.unitList2
		                // n.groundList2 && delete n.groundList2
		                // n.buildList2 && delete n.buildList2
		                angular.extend(n, { role: "3", id: task.id, parkId: n.parkId })
		            });
		            if((vm.owner.length==0) &&(vm.relative.length==0) && (vm.tenant.length==0) ){
		                alert('请填写数据');
		               return
		            }
		            var param = {
		                owner: vm.owner,
		                relative: vm.relative,
		                tenant: vm.tenant,
		                id:task.id,
		            };
		            $http.post('/ovu-base/ownerPerson/edit.do', param).success(function (res) {
		                if (res.code == "0") {
		                    $uibModalInstance.close();
		                    // msg("操作成功!");
		                    msg(res.msg);
		                } else {
		                    // msg("操作失败!");
		                    alert(res.msg);
		                    $uibModalInstance.close();
		                }
		            })
                }
            })
        }
        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
        
        vm.contains = function(carNos,carNo){
        	if(!carNos || !carNo){
        		return false;
        	}
        	var ret = false;
        	for(let i=0;i<carNos.length;i++){
        		if(carNos[i] == carNo){
        			ret = true;
        			break;
        		}
        	}
        	return ret;
        }
    })
})();