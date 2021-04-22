
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('houseSearchCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $timeout, fac) {
        document.title = "房屋查询";
        $scope.pageModel_own = {};
        $scope.search = {};
        $scope.config={};
        $scope.config.edit=false
        var selectedIndex;
        app.modulePromiss.then(function () {

			initDeptWatch();

            $scope.houseSearchtreeData = [];
            fac.initPage($scope, function () {
          
                fac.loadSelect($scope, "HOUSE_STATUS")
             
              
     
            })
        });
        
        //集团版、项目版合并，监控部门变化
		function initDeptWatch(){
            $scope.$watch('dept', function (dept, oldValue) {
            	// if(!$scope.search){
            	// 	$scope.search = {};
                // }
                $scope.search = {};
                if(dept.id != $scope.search.deptId){
                	$scope.search.parkId = dept.parkId;
                	$scope.search.deptId = dept.id;
                	
                	delete $rootScope.houseSearchtreeData;
                	delete $scope.houseSearchtreeData;
                	delete $scope.search.parkName;
                	delete $scope.search.houseId;
					delete $scope.search.houseNo;
					delete $scope.search.groundNo ;
					
                }
                if($scope.search.parkId){
                	$http.post("/ovu-base/system/park/getWithPath",{ids:$scope.search.parkId},fac.postConfig).
                		success(function(resp){
                			if(resp.data && resp.data.length>0){
                				$scope.search.parkName = resp.data[0].fullPath;
                			}
                		})
                	$scope.loadHouseTree();
                }
                $scope.search.spaceName && delete  $scope.search.spaceName 
                //刷新表格
                $scope.changeIndex(selectedIndex);
            },true)
		}
        
        $scope.init = function () {
            $scope.loadHouseTree();
            delete $scope.houseNos;
			delete $scope.search.houseId;
			delete $scope.search.houseNo;
			delete $scope.search.groundNo ;
		
        
            fac.loadSelect($scope, "HOUSE_STATUS")
        }
        $scope.findOwn = function (pageNo) {
		
                if(!$scope.search.deptId){
                    $scope.pageModel_own.totalCount = 0;
                    $scope.pageModel_own.totalPage = 1;
                    $scope.pageModel_own.data = [];
                    return;
                }
                angular.extend($scope.search, { currentPage: pageNo || $scope.pageModel_own.currentPage || 1, pageSize: $scope.pageModel_own.pageSize || 10 });
                fac.getPageResult("/ovu-base/owner/list3.do", $scope.search, function (data) {
                  
                    data.data && data.data.forEach(function(v){
                      
                        v.name && (v.name=v.name.split(','));
                        v.idCard && (v.idCard=v.idCard.split(','));
                        v.ownerUnit && (v.ownerUnit=v.ownerUnit.split(','));
                        v.phone && (v.phone=v.phone.split(','));
    
                    })
                    $scope.pageModel_own = data;
    
                });
            //  }
        };
        $scope.loadHouseTree = function () {
            $http.post("/ovu-base/system/parkStage/treeNew.do", {

                parkId: $scope.search.parkId,
                level: "4",
            }, fac.postConfig).success(function (treeData) {
                $scope.flatData = fac.treeToFlat(treeData);
                $scope.flatData.forEach(function (n) {
                    // n.floorId ? (n.isLeaf = true) : (n.isLeaf = false);
                    n.buildNo ? (n.isLeaf = true) : (n.isLeaf = false);
                });
                $scope.houseSearchtreeData = treeData;
                if($scope.houseSearchtreeData && $scope.houseSearchtreeData.length){
                    $scope.houseSearchtreeData[0].state={
                        selected:true
                    }
                    $scope.selectNode( $scope.houseSearchtreeData[0],$scope.houseSearchtreeData[0])
                }
                

/*                if ($scope.search.deptId) {
                    $scope.find();
                }*/
            });

        }

        $scope.selectNode = function (search,node) {
            if ($scope.curNode != node) {
                $scope.curNode && $scope.curNode.state && ($scope.curNode.state.selected = false);
            }
            node.state = node.state || {};
        //    node.state.selected = !node.state.selected;
            if (node.state.selected) {
                $scope.curNode = node;
            if (node.level == 1) {
                $scope.search.buildId && delete $scope.search.buildId;
                $scope.search.unitNo && delete $scope.search.unitNo;
                $scope.search.groundNo && delete  $scope.search.groundNo;

                $scope.search.stageId = node.id;

            } else if (node.level == "2") {
                $scope.search.unitNo && delete $scope.search.unitNo;
                $scope.search.groundNo && delete  $scope.search.groundNo;
                $scope.search.stageId = node.parentId;
                $scope.search.buildId = node.id;
            } else if (node.level == "3") {
                $scope.search.groundNo && delete $scope.search.groundNo;
                var build = $scope.getNode({id:node.parentId});
                if(build){
               
                	$scope.search.stageId = build.parentId;
                }
                $scope.search.buildId = node.parentId;
                $scope.search.unitNo = node.data.unitNo;

            	} else if (node.level == "4") {
                  $scope.search.groundNo = node.textNo;	

                  var parent= $scope.getNode({id:node.parentId})
                  $scope.search.buildId = parent.data.buildId;
                  $scope.search.unitNo = parent.data.unitNo;
                  var grandfather=$scope.getNode({id:parent.parentId})
                  $scope.search.stageId=grandfather.parentId
            
            }
        } else {
                delete $scope.search.stageId;
                delete $scope.search.buildId;
                delete $scope.search.unitNo;
                delete $scope.search.groundNo;
                $scope.search.houseNo &&   delete $scope.search.houseNo;
                $scope.search.houseId && delete $scope.search.houseId;
                
            }
            
            //如果选中楼栋节点，更新楼层下拉选项值
            if($scope.search.groundNo){
            	$scope.getHouses(node.id);
            }else{
            	
            	delete $scope.search.groundNo ;
            }
            //删除房屋信息
            delete $scope.houseNos;
            delete $scope.search.houseNo;
            delete $scope.search.houseId;
            
            $scope.changeIndex(selectedIndex);
        }

		/**
		 * 房屋查询 
		 * 数据改造start
		 */
		//在只知道节点id下，获取节点完整信息
        $scope.getNode = function(node){
        	var ret;
        	var flag = false;
        	//使用array模拟栈
        	var stack = new Array();
        	var nodes = $scope.houseSearchtreeData;
        	for(let i=0;i<nodes.length;i++){
        		stack.push(nodes[i]);
        	}
        	while(stack.length>0 && !flag){
        		//出栈
        		var curNode = stack.pop();
        		if(curNode.id === node.id){
        			ret = curNode;
					flag = true;
					break;
        		}
        		if(!flag && curNode.nodes && curNode.nodes.length>0){
        			for(let j=0;j<curNode.nodes.length;j++){
        				stack.push(curNode.nodes[j]);
        			}
        		}
        	}
        	return ret;
        }
	
		//单元修改
		$scope.getHouses = function(id){
			if(!$scope.search.groundNo){
				delete $scope.houseNos;
				delete $scope.search.houseId;
				delete $scope.search.houseNo;
				delete $scope.search.groundNo ;
				return;
			}

			$http.post("/ovu-base/system/parkHouse/getHousesByFloor?floorId="+id).success(function(res){
				if(res.code == 0){
					$scope.houseNos = res.data;
				}
			})
		}
		
		//房屋修改
		//修改后需要将数据发布到子controller
		$scope.houseNoChange = function(){
			//选择楼层时，不更新表格
			$scope.changeIndex(selectedIndex);
		}
		/**
		 *end 
		 */

       


      
        //查看亲属
        $scope.showRelative = function (task) {
            var copy = angular.extend({}, task);
            copy.isGroup = $scope.search.isGroup;
            if (!copy.PARK_ID) {
                angular.extend(copy, { PARK_ID: $scope.search.parkId })
            }
            var modal = $uibModal.open({
                animation: false,
                templateUrl: '/view/houseSearch/ownerInfo/own/modal.Relative.html',
                size: 'lg',
                controller: 'relativesEditNewCtrl',
                controllerAs: 'vm',
                resolve: { task: copy }
            });
           

        }
        //查看租户
        $scope.showTanant = function (task) {
            var copy = angular.extend({}, task);
            copy.isGroup = $scope.search.isGroup;
            if (!copy.PARK_ID) {
                angular.extend(copy, { PARK_ID: $scope.search.parkId })
            }
            var modal = $uibModal.open({
                animation: false,
                templateUrl: '/view/houseSearch/ownerInfo/own/modal.Tanant.html',
                size: 'lg',
                controller: 'tanantEditNewCtrl',
                controllerAs: 'vm',
                resolve: { task: copy }
            });
            
        }
        //删除业主

        //批量删除业主

        $scope.delAll = function () {
            var ids = $scope.pageModel.list.reduce(function (ret, n) { n.checked && ret.push(n.id); return ret }, []);
            delGroup(ids);
        };
        $scope.del = function (item) {
            delGroup([item.id]);
        }

        function delGroup(ids) {
            confirm("确认删除选中的" + ids.length + "条记录?", function () {
                $http.post("/ovu-base/owner/delete.do", { "ownerIds": ids.join() }, fac.postConfig).success(function (resp) {
                    if (resp.code=="0") {
                        $scope.find();
                        msg(resp.msg);
                    } else {
                        msg(resp.msg);
                    }
                })
            });
        }


        $scope.changeIndex = function (index) {
            if (index == 0) {
                $scope.findOwn(1);
            }
            
            $scope.$broadcast('index' + index);
            selectedIndex = index;
            $scope.selectedIndex=selectedIndex
        };


    });
   
    //编辑亲属模块
    app.controller("relativesEditNewCtrl", function ($scope, $uibModal, $uibModalInstance, $http, fac, task) {
        //获取亲属列表
        var vm = $scope.vm = this;
        $scope.search = {};

        $scope.pageModel = {};
        //获取亲属列表
        if (fac.isNotEmpty(task.id)) {
            $scope.find = function (pageNo) {
                $.extend($scope.search, {
                    currentPage: pageNo || $scope.pageModel.currentPage || 1,
                    pageSize: $scope.pageModel.pageSize || 10,
                    houseId: task.id
                });
                fac.getPageResult("/ovu-base/owner/relative/list.do", $scope.search, function (data) {
                    $scope.pageModel = data;

                });
            };
            $scope.find();
        }
        //禁用/启用亲属
        $scope.unAuthorise = function (item) {

            var alt = ""
            if (item.status == '1') {
                alt = "禁用"
            } else {
                alt = "启用"
            }
            authorise([item.id], "确认" + alt + "亲属 " + item.relationName + " 吗?", item.status);
        }
        //批量禁用/启用亲属
        $scope.unAuthoriseAll = function () {
            var ids = $scope.pageModel.list.reduce(function (ret, n) { n.checked && ret.push(n.id); return ret }, []);
            authorise(ids, "确认禁用 " + ids.length + " 个亲属吗?");
        }

        function authorise(ids, msg, status) {
            confirm(msg, function () {
                $http.get("/ovu-pcos/pcos/newowner/relative/forbid.do", { params: { ids: ids.join(), status: status } }).success(function (resp) {
                    if (resp.success) {
                        $scope.find();
                    } else {
                        alert("操作失败");
                    }
                })
            });
        }

        //点击取消
        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    //编辑租户模块
    app.controller("tanantEditNewCtrl", function ($scope, $uibModal, $uibModalInstance, $http, fac, task) {
        var vm = $scope.vm = this;
        $scope.search = {};


        $scope.pageModel = {};
        //获取租户列表
        if (fac.isNotEmpty(task.id)) {
            $scope.find = function (pageNo) {
                $.extend($scope.search, {
                    currentPage: pageNo || $scope.pageModel.currentPage || 1,
                    pageSize: $scope.pageModel.pageSize || 10,
                    houseId: task.id
                });
                fac.getPageResult("/ovu-base/owner/tenant/list.do", $scope.search, function (data) {
                    $scope.pageModel = data;
                });
            }
            $scope.find();
        }


        //禁用租户
        $scope.unAuthorise = function (item) {
            authorise([item.id], "确认禁用租户 " + item.tenantName + " 吗?");
        }
        //批量禁用租户
        $scope.unAuthoriseAll = function () {
            var ids = $scope.pageModel.list.reduce(function (ret, n) { n.checked && ret.push(n.id); return ret }, []);
            authorise(ids, "确认禁用 " + ids.length + " 个租户吗?");
        }
        function authorise(ids, msg) {
            confirm(msg, function () {
                $http.get("/ovu-pcos/pcos/newowner/tanant/forbid.do", { params: { ids: ids.join() } }).success(function (resp) {
                    if (resp.success) {
                        $scope.find();
                    } else {
                        alert("操作失败");
                    }
                })
            });
        }

        //点击取消
        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })
    //工单模块 报事查询
    app.controller("workunitCtrl", function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        $scope.pageModel = {};
    //    
        $scope.$on('index4', function (event, data) {
            $scope.changeWorkUnit(3)
        });
        $scope.search={};
       
        var url='';
        
        $scope.find = function (pageNo) {
            $scope.$parent.search.pageSize && delete   $scope.$parent.search.pageSize
            $scope.$parent.search.currentPage && delete   $scope.$parent.search.currentPage
             delete   $scope.$parent.search.pageIndex
            $scope.$parent.search.totalCount && delete   $scope.$parent.search.totalCount
            angular.extend($scope.search,{currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 }, $scope.$parent.search);
            if(!$scope.search.deptId){
        		$scope.pageModel.totalCount = 0;
        		$scope.pageModel.totalPage = 1;
        		$scope.pageModel.data = [];
        		alert("请选择部门");
        		return;
        	}
            var search = angular.copy($scope.search);
            delete search.deptId ;
            if($scope.workUnitIndex==1){
                 url='/ovu-pcos/pcos/building_search/workunit/sourceunit/queryList.do'
            }else if($scope.workUnitIndex==2){
                url='/ovu-pcos/pcos/building_search/workunit/decoration/queryList.do'
            }else{
                url='/ovu-pcos/pcos/building_search/workunit/workunitSearche/queryList.do'
            }
            fac.getPageResult(url, search, function (res) {
                $scope.pageModel = res;
            });

        };
        $scope.changeWorkUnit=function(index){
            $scope.search.unitStatus && delete   $scope.search.unitStatus
            $scope.search.params && delete   $scope.search.params
            $scope.search.workunitType && delete   $scope.search.workunitType
            $scope.search.pageSize && delete   $scope.search.pageSize
            $scope.search.currentPage && delete   $scope.search.currentPage
            $scope.search.pageIndex && delete   $scope.search.pageIndex
            $scope.search.totalCount && delete   $scope.search.totalCount
          
            $scope.workUnitIndex=index
            $scope.find(1)
        }
              // 显示报装证件
              $scope.showReportCertif = function (item) {
                var modal = $uibModal.open({
                    animation: false,
                    templateUrl: '/view/houseSearch/ownerInfo/workunit/modal.reportCertif.html',
                    size: 'lg',
                    controller: 'ReportCertifCtrl',
                    controllerAs: 'vm',
                    resolve: { item: item }
                });
    
    
    
            };
           

    })
  
    // 报装证件
    app.controller('ReportCertifCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $uibModalInstance, fac, item) {
        var vm = $scope.vm = this;
        vm.item = item;
        vm.showPhoto = $rootScope.showPhoto;
        vm.processImgUrl = $rootScope.processImgUrl;

        // 请求所有的报装文件
        $http.post('/ovu-pcos/pcos/presFile/list.do', {
            pageIndex: 0,
            pageSize: 100
        }, fac.postConfig).then(function (res) {
            var data = res.data.data;

            if (!item.certificateUrl || !item.certificateId) {
                msg('该报装请求没有报装证件');
            } else {
                var arr = item.certificateUrl.split(',');

                var ids = item.certificateId.split(',');
                arr = arr.map(function (url, index) {
                    var file = data.filter(function (v) {
                        return v.id === parseInt(ids[index]);
                    })[0];
                    if (file) {
                        return [file.fileName, url];
                    } else {
                        return ['该类文件已删除', ''];
                    }
                }).filter(function (v) {
                    return v[1];
                });
                if (!arr.length) {
                    msg('该报装请求没有报装证件');
                    return;
                }
                // 默认显示第一张图片
                arr[0].active = true;
                vm.imgUrl = vm.processImgUrl(arr[0][1]);
                
                //展示多张图片 2018/09/12
                var urls = arr[0][1].split(";");
                vm.imgUrls = []
                urls.forEach(function(v){
                	vm.imgUrls.push(vm.processImgUrl(v));
                })
                vm.imgUrlsActive = vm.imgUrls[0];
                
                vm.certifList = arr;

                console.log('0====>', vm.imgUrl)
                //vm.certifList = arr;

            }
        });

		vm.switchImage = function(item){
        	vm.imgUrlsActive = item.item;
        };

        /*vm.clickPicTitle = function (item, list) {
            list.forEach(function (v) {
                v.active = false;
            });
            item.active = true;
            vm.imgUrl = vm.processImgUrl(item[1]);

        };*/
        
        vm.clickPicTitle = function(item, list) {
            list.forEach(function(v) {
                v.active = false;
            });
            item.active = true;
            vm.imgUrl = vm.processImgUrl(item[1]);
            
            //展示多张图片 2018/09/12
            var urls = item[1].split(";");
            vm.imgUrls = []
            urls.forEach(function(v){
            	vm.imgUrls.push(vm.processImgUrl(v));
            })
            vm.imgUrlsActive = vm.imgUrls[0];
            
            console.log('1====>', vm.imgUrl)
        };
        
        vm.cancel = function () {

            $uibModalInstance.dismiss('cancel');
        };
    })

    
    //设备模块
    app.controller("equipmentCtrl", function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        $scope.eq_pageModel = {};
        $scope.search={};
        $scope.$on('index5', function (event) {
            $scope.find(1);
        });
     
        $scope.find = function (pageNo) {
            $scope.$parent.search.pageSize && delete   $scope.$parent.search.pageSize
            $scope.$parent.search.currentPage && delete   $scope.$parent.search.currentPage
             delete   $scope.$parent.search.pageIndex
            $scope.$parent.search.totalCount && delete   $scope.$parent.search.totalCount
            angular.extend($scope.search,{ currentPage: pageNo || $scope.eq_pageModel.currentPage || 1, pageSize: $scope.eq_pageModel.pageSize || 10 }, $scope.$parent.search);
            if(!$scope.search.deptId){
        		$scope.eq_pageModel.totalCount = 0;
        		$scope.eq_pageModel.totalPage = 1;
        		$scope.eq_pageModel.data = [];
        		alert("请选择部门");
        		return;
        	}
            fac.getPageResult("/ovu-pcos/pcos/building_search/equip_search/queryList.do", $scope.search, function (res) {
                $scope.eq_pageModel = res;
            });
        };
    })
    
     //亲属模块
    app.controller("relativeCtrl", function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        $scope.relative_pageModel = {};
       
        $scope.$on('index1', function (event) {
            $scope.search={};
            $scope.find(1);
        });
      
        $scope.find = function (pageNo) {
            $scope.$parent.search.pageSize && delete   $scope.$parent.search.pageSize
            $scope.$parent.search.currentPage && delete   $scope.$parent.search.currentPage
             delete   $scope.$parent.search.pageIndex
            $scope.$parent.search.totalCount && delete   $scope.$parent.search.totalCount
         
            angular.extend($scope.search,{ currentPage: pageNo || $scope.relative_pageModel.currentPage || 1, pageSize: $scope.relative_pageModel.pageSize || 10 }, $scope.$parent.search);
            if(!$scope.search.deptId){
        		$scope.relative_pageModel.totalCount = 0;
        		$scope.relative_pageModel.totalPage = 1;
        		$scope.relative_pageModel.data = [];
        		alert("请选择部门");
        		return;
        	}
            fac.getPageResult("/ovu-base/owner/relative/list1", $scope.search, function (data) {
            	
            	data.data && data.data.forEach(function(v){
                    v.ownerName && (v.ownerName=v.ownerName.split(','));
                    v.ownerPhone && (v.ownerPhone=v.ownerPhone.split(','));
                })
            	
                $scope.relative_pageModel = data;
            });
        };
    })
    
    //租户模块
    app.controller("tenantCtrl", function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        $scope.tenant_pageModel = {};
    
        $scope.$on('index2', function (event) {
            $scope.search={};
            $scope.find(1);
        });
       
        $scope.find = function (pageNo) {
            $scope.$parent.search.pageSize && delete   $scope.$parent.search.pageSize
            $scope.$parent.search.currentPage && delete   $scope.$parent.search.currentPage
             delete   $scope.$parent.search.pageIndex
            $scope.$parent.search.totalCount && delete   $scope.$parent.search.totalCount
            angular.extend($scope.search,{ currentPage: pageNo || $scope.tenant_pageModel.currentPage || 1, pageSize: $scope.tenant_pageModel.pageSize || 10 }, $scope.$parent.search);
            if(!$scope.search.deptId){
        		$scope.tenant_pageModel.totalCount = 0;
        		$scope.tenant_pageModel.totalPage = 1;
        		$scope.tenant_pageModel.data = [];
        		alert("请选择部门");
        		return;
        	}
            
            fac.getPageResult("/ovu-base/owner/tenant/list1", $scope.search, function (data) {
            	
            	data.data && data.data.forEach(function(v){
                    v.ownerName && (v.ownerName=v.ownerName.split(','));
                    v.ownerTel && (v.ownerTel=v.ownerTel.split(','));
                })
            	
                $scope.tenant_pageModel = data;
            });
        };
    })
    
        //车辆模块
    app.controller("carCtrl", function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        $scope.car_pageModel = {};
    
        $scope.$on('index3', function (event) {
            $scope.search={};
            $scope.find(1);
        });
        
        $scope.find = function (pageNo) {
            $scope.$parent.search.pageSize && delete   $scope.$parent.search.pageSize
            $scope.$parent.search.currentPage && delete   $scope.$parent.search.currentPage
             delete   $scope.$parent.search.pageIndex
            $scope.$parent.search.totalCount && delete   $scope.$parent.search.totalCount
            angular.extend($scope.search,{ currentPage: pageNo || $scope.car_pageModel.currentPage || 1, pageSize: $scope.car_pageModel.pageSize || 10 }, $scope.$parent.search);
            
            if(!$scope.search.deptId){
        		$scope.car_pageModel.totalCount = 0;
        		$scope.car_pageModel.totalPage = 1;
        		$scope.car_pageModel.data = [];
        		alert("请选择部门");
        		return;
        	}
            fac.getPageResult("/ovu-base/owner/car/list", $scope.search, function (res) {
                $scope.car_pageModel = res;
            });
        };
    })
    //投诉模块
    app.controller("complaintsCtrl", function ($scope, $rootScope, $http, $filter, $uibModal,$location,fac) {
        $scope.complaint_pageModel = {};
       
        $scope.complainType=1
        $scope.$on('index6', function (event) {
            $scope.search={};
            $scope.find(1);
        });
      
        var url=''
        $scope.find = function (pageNo) {
        
            // $scope.$parent.search.houseId='a2c4035013e348f6846655efed87255a'
            // $scope.$parent.search.houseId='c86badef9e054e94895b210d22c1d3f4'
            
            if(!$scope.$parent.search.deptId){
        		$scope.complaint_pageModel.totalCount = 0;
        		$scope.complaint_pageModel.totalPage = 1;
        		$scope.complaint_pageModel.data = [];
        		alert("请选择部门");
        		return;
            }
            if(!$scope.$parent.search.houseId){
        		
        		 if($location.$$url=='/houseSearch/houseSearch'){
                    alert("请选择房号");
                 }
        		return;
            }
            if(!$scope.complainType){
                if($location.$$url=='/houseSearch/houseSearch'){
                    alert("请选择投诉类型");
                 }
        		
        		return;
            }
          
            $scope.search.communityId=$scope.$parent.search.parkId
            $scope.search.houseId=$scope.$parent.search.houseId
         
            if($scope.complainType==1){
                $scope.search.communityId=$scope.$parent.search.parkId
                $scope.search.pageSize && delete   $scope.search.pageSize
                $scope.search.currentPage && delete   $scope.search.currentPage
                angular.extend($scope.search,{ page: pageNo-1, rows: $scope.complaint_pageModel.pageSize || 10,type:1 });
                url='/ovu-pcos/api/ilidao/getComplain'
            }else{
                $scope.search.rows && delete   $scope.search.rows
                $scope.search.page && delete   $scope.search.page
                angular.extend($scope.search,{ currentPage: pageNo || $scope.complaint_pageModel.currentPage || 1, pageSize: $scope.complaint_pageModel.pageSize || 10 });
                url='/ovu-pcos/pcos/reportstat/other/statComplainWorkUnit'
            }
           
            fac.getPageResult(url, $scope.search, function (res) {
                $scope.complaint_pageModel = res;
             
            });
             //是否显示工单
             $scope.isShowWorkUnit=function(flag,id){
                if(flag==1){
                        return
                }else{
                    $rootScope.showWorkUnitDetail(id)
                }
            }
        };
    })
    //邻里模块
    app.controller("neighborhoodCtrl", function ($scope, $rootScope, $http, $filter, $uibModal,$location,fac) {
        $scope.nei_pageModel = {};
      
        $scope.$on('index7', function (event) {
            $scope.search={};
            $scope.find(1);
        });
       
        $scope.find = function (pageNo) {
            // $scope.$parent.search.houseId='c86badef9e054e94895b210d22c1d3f4'
            if(!$scope.$parent.search.deptId){
        		$scope.nei_pageModel.totalCount = 0;
        		$scope.nei_pageModel.totalPage = 1;
        		$scope.nei_pageModel.data = [];
        		alert("请选择部门");
        		return;
        	}
            if(!$scope.$parent.search.houseId){
        		
                if($location.$$url=='/houseSearch/houseSearch'){
                    alert("请选择房号");
                 }
        		return;
            }
           
            $scope.search.communityId=$scope.$parent.search.parkId
            $scope.search.houseId=$scope.$parent.search.houseId
            angular.extend($scope.search,{ page: pageNo-1, rows: $scope.nei_pageModel.pageSize || 10 });
            
            fac.getPageResult("/ovu-pcos/api/ilidao/getRelation", $scope.search, function (res) {
                $scope.nei_pageModel = res;
            });
        };
    })
    //活动模块
    app.controller("activeCtrl", function ($scope, $rootScope, $http, $filter, $uibModal,$location,fac) {
        $scope.active_pageModel = {};
      
        $scope.$on('index8', function (event) {
            $scope.search={};
            $scope.find(1);
        });
        
        $scope.find = function (pageNo) {
            // $scope.$parent.search.houseId='8f331759e4a2450a8159ba66c54bd110'
            if(!$scope.$parent.search.deptId){
        		$scope.active_pageModel.totalCount = 0;
        		$scope.active_pageModel.totalPage = 1;
        		$scope.active_pageModel.data = [];
        		alert("请选择部门");
        		return;
        	}
            if(!$scope.$parent.search.houseId){
        		
                if($location.$$url=='/houseSearch/houseSearch'){
                    alert("请选择房号");
                 }
        		return;
            }
            $scope.search.communityId=$scope.$parent.search.parkId
            $scope.search.houseId=$scope.$parent.search.houseId
            angular.extend($scope.search,{ page: pageNo-1, rows: $scope.active_pageModel.pageSize || 10 });
          
            fac.getPageResult("/ovu-pcos/api/ilidao/getActivity", $scope.search, function (res) {
                $scope.active_pageModel = res;
            });
        };
    })
    //满意度模块
    app.controller("satisfactionCtrl", function ($scope, $rootScope, $http, $filter, $uibModal,$location,fac) {
        $scope.satisfac_pageModel = {};
     
        $scope.$on('index9', function (event) {
            $scope.search={};
            $scope.find(1);
        });
       
        $scope.find = function (pageNo) {
            // $scope.$parent.search.houseId='c86badef9e054e94895b210d22c1d3f4'
            if(!$scope.$parent.search.deptId){
        		$scope.satisfac_pageModel.totalCount = 0;
        		$scope.satisfac_pageModel.totalPage = 1;
        		$scope.satisfac_pageModel.data = [];
        		alert("请选择部门");
        		return;
        	}
            if(!$scope.$parent.search.houseId){
        		
                if($location.$$url=='/houseSearch/houseSearch'){
                    alert("请选择房号");
                 }
        		return;
            }
            $scope.search.communityId=$scope.$parent.search.parkId
            $scope.search.houseId=$scope.$parent.search.houseId
           
            angular.extend($scope.search,{ page: pageNo-1, rows: $scope.satisfac_pageModel.pageSize || 10 });
            fac.getPageResult("/ovu-pcos/api/ilidao/getSpvote", $scope.search, function (res) {
                $scope.satisfac_pageModel = res;
              
            });
        };
          //查看详情
          $scope.showDetail = function (item) {
            var copy = angular.extend({}, item);
            copy.communityId = $scope.search.communityId
            copy.houseId = $scope.$parent.search.houseId
           
            var modal = $uibModal.open({
                animation: false,
                templateUrl: '/view/houseSearch/ownerInfo/modal.SatisfaDetai.html',
                size: 'lg',
                controller: 'showSatisfaDetailCtrl',
                controllerAs: 'vm',
                resolve: { item: copy }
            });
            
        }
    })
      //查看满意度调查
      app.controller("showSatisfaDetailCtrl", function ($scope, $uibModal, $uibModalInstance, $http, fac, item) {
          
          $http.get('/ovu-pcos//api/ilidao/getSpvoteAll',{params:item}).success((res)=>{
              $scope.dataList=res.data
          })
      
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };



    })
     //备忘录模块
     app.controller("ownermemoCtrl", function ($scope, $rootScope, $http, $filter, $uibModal,$location,fac) {
        $scope.pageModel_memo = {};
     
        $scope.$on('index10', function (event) {
            $scope.search={};
            $scope.find(1);
        });
       
        $scope.find = function (pageNo) {
            // $scope.$parent.search.houseId='939e7e5cc37a4709850ec038a8e59f5f'
            if(!$scope.$parent.search.deptId){
        		$scope.pageModel_memo.totalCount = 0;
        		$scope.pageModel_memo.totalPage = 1;
        		$scope.pageModel_memo.data = [];
        		alert("请选择部门");
        		return;
        	}
            if(!$scope.$parent.search.houseId){
        		
                if($location.$$url=='/houseSearch/houseSearch'){
                    alert("请选择房号");
                 }
        		return;
            }
            $scope.search.communityId=$scope.$parent.search.parkId
            $scope.search.houseId=$scope.$parent.search.houseId
            
            angular.extend($scope.search,{ currentPage: pageNo || $scope.pageModel_memo.currentPage || 1, pageSize: $scope.pageModel_memo.pageSize || 10 });
            fac.getPageResult("/ovu-base/ownermemo/page", $scope.search, function (res) {
                $scope.pageModel_memo = res;
              
            });
        };
        // 新增or 编辑
          $scope.showMemoEditModal = function (item) {
            var copy = angular.extend({}, item);
            
            if (!copy.houseId) {
                angular.extend(copy, { houseId: $scope.search.houseId })
            }
           
           
            var modal = $uibModal.open({
                animation: false,
                templateUrl: '/view/houseSearch/ownerInfo/modal.ownermemo.html',
                size: 'md',
                controller: 'showOwnermemoCtrl',
                controllerAs: 'vm',
                resolve: { item: copy }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                
            });
            
        }
        $scope.delete=function(id){
            confirm("确认删除该条记录吗?", function () {
                $http.get("/ovu-base/ownermemo/delete/"+id).success(function (res) {
                    if (res.msg) {
                        $scope.find();
                    }
                });
            })
        }
    })
     //新增编辑备忘录
     app.controller("showOwnermemoCtrl", function ($scope, $uibModal, $uibModalInstance, $http, fac, item) {
          
         //保存
         $scope.item=item 
        $scope.save = function(form){
            form.$setSubmitted(true);
            if(!form.$valid){
                return;
            }
            
           

            $http.post("/ovu-base/ownermemo/edit",$scope.item).success(function(resp){
                if(resp.code == 0){
                    msg(resp.msg);
                    $uibModalInstance.close();
                }
            })
        }
      $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
      };



 
     


   
     

  })
})();
