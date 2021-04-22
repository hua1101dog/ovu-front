 (function() {    
        var cancleHouseId;
        var app = angular.module("angularApp");
        //项目架构ctl
        app.controller('custContr', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        	document.title ="OVU-企业信息管理";
            angular.extend($rootScope,fac.dicts);
            $rootScope.search = {};
            $rootScope.houseIdTypes = {};
            $scope.pageModel = {};
           
            //查询
            $scope.find = function(pageNo){
            	if(!app.park || !app.park.ID){
    				window.msg("请先选择一个项目!");
    				return false;
    			}
            	$rootScope.search.PARK_ID = app.park.ID;
    			
                $.extend($rootScope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
                $rootScope.search.pageIndex = $rootScope.search.currentPage-1;
                $rootScope.search.totalCount = $scope.pageModel.totalCount||0;
                //console.log($rootScope.search);
                if($scope.SEARCH_ALLOWED){
                	$rootScope.search.ALLOWED = parseInt($scope.SEARCH_ALLOWED);
                }
                fac.getPageResult("/ovu-base/ovupark/backstage/customer/listCompanyByGrid", $rootScope.search, function(data){
                	console.info(data);
                    $scope.pageModel = data;
                });
            }           
            
            $scope.del = function (item) {
                confirm("确认删除该客户信息吗?", function () {
                    $.post("/ovu-base/ovupark/backstage/customer/remove", {"ids": item.ID}, function (resp) {
                    	if(resp.code){
                    		$scope.find();
                    	}else{
                    		window.msg(resp.message);
                    	}
                    });
                });
            };
            
            app.modulePromiss.then(function() {
                fac.initPage($scope,function(){
                	$scope.find();
                })
            });
            
            //添加/修改
            $scope.showEditModal = function(company){
            	if(!app.park || !app.park.ID){
    				window.msg("请先选择一个项目!");
    				return false;
    			}
            	$rootScope.search.PARK_ID = app.park.ID;
            	
                company = company || {
                    CUS_TYPE: 1, SEX: 1
                };
                var copy = angular.extend({}, company);
                copy.PARK_ID = app.park.ID;
                
                //----------------------添加我的园区管家------------------
                var queryPS = {parkId : app.park.ID, cityCode : app.park.CITY_CODE};
                if(copy.ID != null && copy.ID.trim() != ''){
                    queryPS.cusId = copy.ID.trim();
                }
                $.post('/ovu-base/ovupark/backstage/customer/getParkStewardAndIndustrys', queryPS, function(resp){
                	if(resp.code){
                		if(resp.data.myParkSteward && resp.data.myParkSteward.length > 0){
                            copy.myParkSteward = resp.data.myParkSteward[0].id;
                        }
                        copy.allParkSteward = resp.data.allParkSteward;
                        copy.indus = resp.data.industryList;
                        copy.allCustomerCity = resp.data.allCustomerCity;
                	}else{
                		console.log(resp.message);
                	}
                    
                    var modal = $uibModal.open({
                        animation: false,
                        size:'lg',
                        templateUrl: '/view/parkCustomerManage/companyInfo/modal.editCompany.html',
                        controller: 'editCompanyModalContr',
                        resolve: {company: copy}
                    });
                    modal.result.then(function () {
                        $scope.find();
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    });
                });
            };                      
            
            $scope.showAccountAssign = function(company){
            	if(!app.park || !app.park.ID){
    				window.msg("请先选择一个项目!");
    				return false;
    			}
            	$rootScope.search.PARK_ID = app.park.ID;
            	
                var copy = angular.extend({},company);
                copy.PARK_ID = app.park.ID;
                //----------------------添加我的园区管家------------------
                var queryPS = {parkId : app.park.ID, cityCode : app.park.CITY_CODE};
                if(copy.ID != null && copy.ID.trim() != ''){
                    queryPS.cusId = copy.ID.trim();
                }
                $.post('/ovu-base/ovupark/backstage/customer/getParkStewardAndIndustrys', queryPS, function(resp){
                	if(resp.code){
	                    if(resp.data.myParkSteward && resp.data.myParkSteward.length > 0){
	                        copy.myParkSteward = resp.data.myParkSteward[0].id;
	                    }
	                    copy.allParkSteward = resp.data.allParkSteward;
	                    copy.indus = resp.data.industryList;
	                    copy.allCustomerCity = resp.data.allCustomerCity;
                	}else{
                		console.log(resp.message);
                	}
	                var modal = $uibModal.open({
	                    animation: false,
	                    templateUrl: '/view/parkCustomerManage/companyInfo/modal.accountAssign.html',
	                    controller: 'accountAssignContr',
	                    resolve: {company: copy}
	                });
	                modal.result.then(function () {
	                    $scope.find();
	                }, function () {
	                    console.info('Modal dismissed at: ' + new Date());
	                });
                });
            };
        });
        
        app.filter("convertCompanySize",function(){//转换企业规模数字
            return function(value) {
                if(value == "1"){
                    return "50人以内";
                } else if(value == "2"){
                    return "50~100人";
                } else if(value == "3"){
                    return "100-300人";
                } else if(value == "4"){
                    return "300-500人";
                } else if(value == "5"){
                    return "500-1000人";
                } else if(value == "6"){
                     return "1000~5000人";
                } else if(value == "7"){
                    return "5000~10000人";
                } else if(value == "8"){
                    return "10000人及以上";
                } else {
                    return "--";
                }
            }
        });
        
        app.filter("convertCompanyAssign",function(){//转换企业分配账号状态
            return function(value) {
                if(value == 1 || value == "1"){
                    return false;
                } else {
                    return true;
                }
            }
        });
        app.controller('editCompanyModalContr', function($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, company) {
            if(company.MONEY_TYPE){
                company.MONEY_TYPE = company.MONEY_TYPE+"";
            }
            if(company.STATUS){
                company.STATUS = company.STATUS+"";
            }
            if(company.city){
                company.city = company.city+"";
            }
            if(company.job){
                company.job = company.job+"";
            }
            if(company.REG_ADDR_TYPE){
                company.REG_ADDR_TYPE = company.REG_ADDR_TYPE+"";
            }
            if(company.ENTERPRISE_NATURE_ID){
                company.ENTERPRISE_NATURE_ID = company.ENTERPRISE_NATURE_ID+"";
            }
            if(company.SIZE){
                company.SIZE = company.SIZE+"";
            }
            if(company.INDUSTRY){
                company.INDUSTRY = company.INDUSTRY+"";
            }
            if(company.REG_ADDR_DOMAIN){
                company.REG_ADDR_DOMAIN = company.REG_ADDR_DOMAIN+"";
            }
            if(company.ENTER_STATUS){
                company.ENTER_STATUS = company.ENTER_STATUS+"";
            }
            $scope.item = company;
            
            /*恢复使用 注册园区内,外 的功能*/
            //分期，楼栋，楼层三级联动
            $scope.findAllStage = function(){
                if($scope.item.REG_ADDR_TYPE == 1){
                    $scope.show = true;
                    $scope.loadStage();
                }else if($scope.item.REG_ADDR_TYPE == 2){
                    $scope.show = false;
                }
            }
            
            //根据园区ID获得分期列表
            $scope.loadStage = function(){
                $scope.stageList = [];
                $http.post("/ovu-base/system/parkStage/findStagesByParkId", {parkId : app.park.ID}, fac.postConfig).success(function(resp){
                    if(resp.code){
                    	$scope.stageList = resp.data;
                    	
                    	$scope.builds = [];
                    	$scope.houseList = [];
                    }
                });
            }
            
            //根据分期ID获得楼栋信息
            $scope.selectStage = function (){
                console.info($scope.item.curStageId);
                $scope.houseList = [];
                $scope.stage = {
                    stageId : $scope.item.curStageId
                }
                $http.post("/ovu-base/system/parkFloor/findFloorsByStageId", $scope.stage, fac.postConfig).success(function(resp){                    
                	if(resp.code){
                		$scope.builds = resp.data;
                	}
                });
            }
            
            //根据楼栋ID获得房屋信息
            $scope.selectBuild = function () {
                $scope.build = { "buildId":$scope.item.curBuildId}
                $http.post("/ovu-base/system/parkHouse/getHouseByBuildId", $scope.build, fac.postConfig).success(function(resp){
                	if(resp.code){
                		$scope.houseList = resp.data;
                	}         
                });     
            }
            
            $scope.backShowSpaceInfo = function(){
                var houseId = company.curHouseId;
                var buildId = company.curBuildId;
                var stageId = company.curStageId;
                var obj = {
                    "curStageId":stageId,
                    "curBuildId":buildId
                }
                $http.post("/ovu-base/system/parkHouse/getCascadeSpaceList", {"body" : angular.toJson(obj)}, fac.postConfig).success(function(resp){
                    //console.info("========");
                    //console.info(angular.toJson(resp));
                	if(resp.code){
	                    var backData = resp.data;   
	                    $scope.stageList = backData.stageList;
	                    $scope.builds = backData.buildList;
	                    $scope.houseList = backData.houseList;
                	}
                });
            }
            
            if(company.REG_ADDR_TYPE == "" || company.REG_ADDR_TYPE == 1){                  
                $scope.show = true; 
                //初始化查询空间信息，包括分期、楼栋、房屋
                $scope.backShowSpaceInfo();
            }                    
            
            $scope.selectHouse = function(){                
                $scope.spaceId = $scope.item.curHouseId;
            }
            

            $scope.changePhone = function (item) {
                if(item.MOBILE != undefined){
                    item.phoneChange = true;
                }   
            }
            
            $scope.checkEmployeeNum = function (item) {
                if(item.staff_count && item.SIZE){
                    switch(item.SIZE)
                    {
                    case "1":
                    	if(item.staff_count > 50){
                    		window.alert("请填写跟人数相匹配的员工人数!");
                    		return false;
                    	}
                    	return true;
                    	break;
                    case "2":
                    	if(item.staff_count < 50 || item.staff_count > 100){
                    		window.alert("请填写跟人数相匹配的员工人数!");
                    		return false;
                    	}
                    	return true;
                    	break;
                    case "3":
                    	if(item.staff_count < 100 || item.staff_count > 300){
                    		window.alert("请填写跟人数相匹配的员工人数!");
                    		return false;
                    	}
                    	return true;
                    	break;
                    case "4":
                    	if(item.staff_count < 300 || item.staff_count > 500){
                    		window.alert("请填写跟人数相匹配的员工人数!");
                    		return false;
                    	}
                    	return true;
                    	break;
                    case "5":
                    	if(item.staff_count < 500 || item.staff_count > 1000){
                    		window.alert("请填写跟人数相匹配的员工人数!");
                    		return false;
                    	}
                    	return true;
                    	break;
                    case "6":
                    	if(item.staff_count < 1000 || item.staff_count > 5000){
                    		window.alert("请填写跟人数相匹配的员工人数!");
                    		return false;
                    	}
                    	return true;
                    	break;
                    case "7":
                    	if(item.staff_count < 5000 || item.staff_count > 10000){
                    		window.alert("请填写跟人数相匹配的员工人数!");
                    		return false;
                    	}
                    	return true;
                    	break;
                    case "8":
                    	if(item.staff_count < 10000){
                    		window.alert("请填写跟人数相匹配的员工人数!");
                    		return false;
                    	}
                    	return true;
                    	break;
                    }
                }   
            } 
            
            $scope.save = function (form, item) {
                form.$setSubmitted(true);
                if(item.REG_CAPITAL>99999999999){
                	alert("注册资本最大位数为11位！");
                	 return;
                }
                if (!form.$valid) {
                    return;
                } 
                
              /*  if(!$scope.checkEmployeeNum(item)){
                	return false;
                }*/
                item.spaceId = $scope.item.curHouseId;
                console.log(item);
                $http.post("/ovu-base/ovupark/backstage/customer/save", item, fac.postConfig).success(function (resp) {
                    if (resp.code) {
                        //--------------------添加园区管家关联-----------------
                        $http.post("/ovu-base/ovupark/backstage/parkSteward/saveCustomerParkSteward", {"cusId" : resp.data.cusId, "psId" : item.myParkSteward},fac.postConfig)
                        	 .success(function(resp2){
                            if(resp2.code){
                            	window.msg("操作成功!");
                            }else{
                                window.alert("添加园区管家关联失败!");
                            }
                        });
                        $uibModalInstance.close();
                    } else {
                        msg(resp.message);
                    }
                });
            }
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };              
        });
        
        app.controller('accountAssignContr', function($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, company) {
            $scope.item = company;
            /* $http.get("/ovu-base/ovupark/backstage/customer/getHouseTree ?PARK_ID=" + $rootScope.search.PARK_ID).success(function(treeData){            
                $scope.flat = fac.treeToFlat(treeData);
                $http.get("/ovu-base/ovupark/backstage/customer/get_sale_house ?ID="+company.ID).success(function(houses){
                    if(houses && houses.length>0){
                        houses.forEach(function(n){
                            var data = $scope.flat.find(function(m){return m.houseId == n.id});
                            data && (n.fullPath = data.fullPath);
                        })
                        $scope.houses1 =houses.filter(function(n){return !!n.fullPath});
                    }
                })
                $http.get("/ovu-base/ovupark/backstage/customer/get_rent_house ?ID="+company.ID).success(function(houses){
                    if(houses && houses.length>0){
                        houses.forEach(function(n){
                            console.info(n);
                            var data = $scope.flat.find(function(m){return m.houseId == n.id});
                            data && (n.fullPath = data.fullPath);
                        })
                        $scope.houses2 =houses.filter(function(n){return !!n.fullPath});
                    }
                })
            }) */
            
            
            dataObj = {
                    "userType" : "company",
                    "accecptId" : company.ID,
                    "parkId" : $rootScope.search.PARK_ID
            };
            $http.post("/ovu-base/system/parkHouse/getMyHouseTree ",dataObj, fac.postConfig).success(function(resp){
                if(resp.code){
                    var tree = resp.data.tree;
                    var myLeaseHouses = resp.data.myLeaseHouses;
                    var mySaleHouse = resp.data.mySaleHouse;
                    $rootScope.treeData = tree;
                    $rootScope.flat = fac.treeToFlat(tree);
                }
                //console.info(angular.toJson(resp));
                
                if(mySaleHouse && mySaleHouse.length>0){
                    mySaleHouse.forEach(function(n){
                        var treeNode;
                        var data = $scope.flat.find(function(m){
                            treeNode = m;
                            return m.houseId == n.ID;
                        });
                        data && (n.fullPath = data.fullPath);
                        n.fullPath = treeNode.stageName+">"+treeNode.floorName+">"+treeNode.houseName;
                    })
                    $scope.houses1 =mySaleHouse.filter(function(n){return n.fullPath});
                }
                
                if(myLeaseHouses && myLeaseHouses.length>0){
                    myLeaseHouses.forEach(function(n){
                        var treeNode;
                        var data = $scope.flat.find(function(m){
                            treeNode = m;
                            return m.houseId == n.ID;
                        });
                        data && (n.fullPath = data.fullPath);
                        n.fullPath = treeNode.stageName+">"+treeNode.floorName+">"+treeNode.houseName;
                    })
                    $scope.houses2 =myLeaseHouses.filter(function(n){return n.fullPath});
                }
            });
            
            $scope.save = function (form, item) {
                form.$setSubmitted(true);
                if (!form.$valid) {
                    return;
                }
                //如果是未分配，那么把状态值改为已分配（做系统分配处理）
                if($scope.item.PASSWORD==null||$scope.item.PASSWORD.length==6||$scope.item.PASSWORD.length==0){
                    $scope.item.ALLOWED=1;
                }
                
                //console.info($rootScope.houseIdTypes);
                $scope.chooseHouse = $rootScope.houseIdTypes;
                $scope.reduceHis = $rootScope.houseIdTypes.reduceHis;
                var leaseHouseIdStr = $scope.chooseHouse.lease;
                var saleHouseIdStr = $scope.chooseHouse.sale;
                var requestData = item;
                $scope.chooseHouse.reduceHouseIds = cancleHouseId;
                requestData.chooseBody = angular.toJson($scope.chooseHouse);
                //console.info(requestData.chooseBody);
                $http.post("/ovu-base/ovupark/backstage/customer/allowed", item, fac.postConfig).success(function (resp) {
                    if (resp.code) {
                        var houses="";
                        /* var houses1="";
                        var houses2="";
                        $scope.houses1 && $scope.houses1.forEach(function(n,index,list){
                            houses1 += n.HOUSE_ID+(index==list.length-1?"":",");
                        });
                        $scope.houses2 && $scope.houses2.forEach(function(n,index,list){
                            houses2 += n.HOUSE_ID+(index==list.length-1?"":",");
                        }); */
                        requestData.cusId = resp.data.cusId;
                        requestData.loginId = app.user.ID;
                        //$http.post("/ovu-base/ovupark/backstage/customer/save_relative_house ",{"cusId":data.cusId,"houses1":houses1,"houses2":houses2},fac.postConfig).success(function(resp2){
                        $http.post("/ovu-base/ovupark/backstage/customer/save_relative_house", requestData, fac.postConfig).success(function(resp2){
                            if(resp2.code){
                               
                            }else{
                                window.alert(resp2.message);
                            }
                        });
                        //--------------------添加园区管家关联-----------------
                        $http.post("/ovu-base/ovupark/backstage/parkSteward/saveCustomerParkSteward",{cusId : resp.data.cusId, psId:item.myParkSteward}, fac.postConfig)
                        .success(function(resp3){
                            if(resp3.code){
                                
                            }else{
                                alert(resp3.message);
                            }
                        });
                        
                        $uibModalInstance.close();
                    } else {
                        alert(resp.message);
                    }
                })
            }
            
            $scope.openSeleHouseModal = function(houses,type,item){
            	cancleHouseId = "";
                if(type === 1){
                    company.state = "sale"
                }else if(type === 2){
                    company.state = "lease"
                }
                var modal = $uibModal.open({
                    animation: false,
                    size:'',
                    templateUrl: '/view/parkCustomerManage/companyInfo/modal.houseMulti.html',
                    controller: 'companyHouseMultiModalCtrl'
                    ,resolve: {houses:function(){return angular.extend([],houses)},company:company}
                });
                modal.result.then(function (data) {
                    $scope.reduceHis = data.reducesHouseIds;
                    item.reduceHouseIds = data.reducesHouseIds;
                    var tmpList = $scope.reduceHis.split(",");
                    if(1==type){
                        var tmpHouse1 = [];
                        var resultHouse1 = data.houses;
                        if(tmpList.length>0&&$scope.houses1){
                            for(var i = 0;i<$scope.houses1.length;i++){
                                if(tmpList.indexOf($scope.houses1[i].ID)){
                                    continue;
                                }
                                tmpHouse1.push($scope.houses1[i]);
                            } 
                        }
                        $scope.houses1 = tmpHouse1.concat(resultHouse1);
                    }
                    if(2==type){
                        var tmpHouse2 = [];
                        var resultHouse2 = data.houses;
                        if(tmpList.length>0&&$scope.houses2){
                            for(var i = 0;i<$scope.houses2.length;i++){
                                if(tmpList.indexOf($scope.houses2[i].ID)){
                                    continue;
                                }
                                tmpHouse2.push($scope.houses2[i]);
                            } 
                        }
                        $scope.houses2 = tmpHouse2.concat(resultHouse2);
                    }
                }, function () {
                    console.info('Modal dismissed at: ' + new Date());
                });
                }
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
                $rootScope.houseIdTypes = {};//清空
            };
        });

        app.controller('companyHouseMultiModalCtrl', function($scope, $rootScope, $http,$uibModalInstance,$filter,fac,houses,company) {
            /* $rootScope.treeData = null;
            $rootScope.flatData = null;
            $scope.config = {edit:false,showCheckbox:true}      
            $http.get("/ovu-base/ovupark/backstage/customer/getHouseTree ?PARK_ID=" + $rootScope.search.PARK_ID).success(function(treeData){
                $rootScope.treeData = treeData;
                $rootScope.flatData = fac.treeToFlat(treeData); 
                $scope.rightList = [];
                houses.forEach(function(house){
                    var node = $scope.flatData.find(function(n){return n.did == house.id});
                    node.state = node.state||{};
                    node.state.checked =true;
                    expandFather(node);
                    $scope.rightList.push(node);
                    console.info($scope.rightList);
                });
            }); */
            $scope.item = company;
            $rootScope.treeData = null;
            $rootScope.flatData = null;
            $scope.config = {edit:false,showCheckbox:true}
            var hasChooseIds;
            if(company.state === 'lease'){
                hasChooseIds = $rootScope.houseIdTypes.sale;
            }else if(company.state === 'sale'){
                hasChooseIds = $rootScope.houseIdTypes.lease;
            }
            var dataObj = {
                    "parkId":$rootScope.search.PARK_ID,
                    "userType":'company',
                    "accecptId":$scope.item.ID,
                    "state":company.state,
                    "hasChooseIds":hasChooseIds
            }
            
            $http.post("/ovu-base/system/parkHouse/getSombodyOwnHouseTree ",dataObj,fac.postConfig).success(function(treeData){
                $rootScope.treeData = treeData;
                $rootScope.flatData = fac.treeToFlat(treeData); 
                //console.log(angular.toJson($rootScope.flatData));
                //console.log(angular.toJson(houses));
                $scope.rightList = [];
                houses.forEach(function(house){
                    var node = $scope.flatData.find(function(n){return n.did == house.ID});
                    node.state = node.state||{};
                    node.state.checked =true;
                    expandFather(node);
                    node.fullPath =  node.stageName+">"+node.floorName+">"+node.houseName;
                    $scope.rightList.push(node);
                });
            });
            
            function expandFather(node){
                var father = $scope.flatData.find(function(n){return n.did == node.pdid});
                if(father){
                    father.state = father.state||{};
                    father.state.expanded = true;
                    expandFather(father);
                }
            }
            
            /**
             * 获得某个节点的方法
             * */
            /*$scope.findNode = function(treeData, house){
            	var floorId = house.FLOOR_ID;
            	for (var i = 0; i < treeData.length; i++) {
					var stages = treeData[i].nodes;
					for (var j = 0; j < stages.length; j++) {
						var builds = stages[j].nodes;
						for (var int = 0; int < array.length; int++) {
							
						}
					}
				}
            }*/
            
            
            var obj = {};
            $scope.saleHids = [];
            $scope.leaseHids = [];
            $scope.validChooseHids=[];
            if(company.state === 'lease'){
                $scope.validChooseHids = $scope.leaseHids;
            }else if(company.state === 'sale'){
                $scope.validChooseHids = $scope.saleHids;
            }
            
            $scope.reduceHis = [];//用于收集取消勾选的房屋id
            $scope.check = function(node){
                node.state = node.state||{};
                node.state.checked = !node.state.checked;
                function checkSons(node,status){
                    node.state = node.state||{};
                    node.state.checked = status;
                    if(node.nodes && node.nodes.length){
                        node.nodes.forEach(function(n){
                            if(node.state.checked){//当选中的时候
                                if($scope.validChooseHids.indexOf(n.houseId) === -1){//只有不包含当前房屋的id时，才加入
                                    $scope.validChooseHids.push(n.houseId);
                                }
                            }
                            checkSons(n,status);
                        });
                    }else{
                        if(node.state.checked){//当选中的时候
                            if($scope.validChooseHids.indexOf(node.houseId) === -1){//只有不包含当前房屋的id时，才加入
                                $scope.validChooseHids.push(node.houseId);
                            }
                        }else{//当未选中的时候
                            $scope.validChooseHids.splice($scope.validChooseHids.indexOf(node.houseId),1);
                        }
                    }
                    if($rootScope.houseIdTypes.hasOwnProperty(company.state)){
                        var tmpList = $rootScope.houseIdTypes[company.state].split(",");
                        if(node.state.checked){
                            if(tmpList.indexOf(node.houseId) == -1){
                                tmpList.push(node.houseId);
                            }
                        }else {
                            tmpList.splice(tmpList.indexOf(node.houseId),1);
                            $scope.reduceHis.push(node.houseId);
                        }
                        $rootScope.houseIdTypes[company.state] = tmpList.join(",");
                        //$rootScope.houseIdTypes.reduceHis = $scope.reduceHis;
                    }else {
                        $rootScope.houseIdTypes[company.state] = $scope.validChooseHids.join(",");
                    } 
                    //console.info(angular.toJson($rootScope.houseIdTypes));
                }
                function uncheckFather(node){
                    var father = $scope.flatData.find(function(n){return n.did == node.pdid});
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
                $scope.rightList = $scope.flatData.filter(function(n){return n.state&& n.state.checked == true&& n.pdid!=null&& n.houseName!=null})
                //console.info(angular.toJson($scope.rightList));
                for(var i=0;i<$scope.rightList.length;i++){
                    var rightObj = $scope.rightList[i];
                    var fullPath = rightObj.stageName+">"+rightObj.floorName+">"+rightObj.houseName;
                    $scope.rightList[i].fullPath = fullPath;
                }
            }
            $scope.save= function(){
            	cancleHouseId = $scope.reduceHis.join(",");
                var houses = $scope.rightList.map(function(n){return {ID: n.did,HOUSE_NAME: n.text,fullPath:n.fullPath}});
                $uibModalInstance.close({houses:houses,reducesHouseIds:$scope.reduceHis.join(",")});
                $scope.reduceHis = [];//清空
            }
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');    
            }
        });
    })()