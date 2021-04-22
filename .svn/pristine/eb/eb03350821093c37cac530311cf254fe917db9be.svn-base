(function() {
        var app = angular.module("angularApp");
        //项目架构ctl
        app.controller('personalContr', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        	document.title ="OVU-个人信息管理";
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
            	$rootScope.search.parkId = app.park.ID;

                $.extend($rootScope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
                $rootScope.search.pageIndex = $rootScope.search.currentPage-1;
                $rootScope.search.totalCount = $scope.pageModel.totalCount||0;
                if($scope.SEARCH_ALLOWED){
                	$rootScope.search.isAlloted_EQ = parseInt($scope.SEARCH_ALLOWED);
                }
                fac.getPageResult("/ovu-base/ovupark/backstage/personal/listByPage", $rootScope.search, function(data){
                    //console.log(data);
                    $scope.pageModel = data;
                });
            };

            $scope.del = function (item) {
                confirm("确认删除该客户信息吗?", function () {
                    $.post("/ovu-base/ovupark/backstage/personal/delPerson", {"personalId": item.ID}, function (resp) {
                    	if(resp.code){
                    		$scope.find();
                    	}else{
                    		window.alert(resp.message);
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
            $scope.showEditModal = function(item){
            	if(!app.park || !app.park.ID){
    				window.msg("请先选择一个项目!");
    				return false;
    			}

                var copy = angular.extend({},item);
                copy.parkId = app.park.ID;
                var modal = $uibModal.open({
                    animation: false,
                    templateUrl: '/view/parkCustomerManage/personalInfo/modal.addPersonal.html',
                    controller: 'addPersonalContr',
                    resolve: {personalFac: copy}
                });
                modal.result.then(function () {
                    $scope.find();
                }, function () {
                    console.info('Modal dismissed at: ' + new Date());
                });
            };

            $scope.showAccountAssign = function(personal){
            	if(!app.park || !app.park.ID){
    				window.msg("请先选择一个项目!");
    				return false;
    			}
            	personal.parkId = app.park.ID;
                var copy = angular.extend({}, personal);
                //----------------------添加园区管家------------------
                var queryPS = {parkId : app.park.ID};
                if(copy.ID != null && copy.ID.trim() != ''){
                    queryPS.cusId = copy.ID.trim();
                }
                $.post('/ovu-base/ovupark/backstage/personal/queryMySteward', queryPS, function(resp){
                	if(resp.data.myParkSteward && resp.data.myParkSteward.length > 0){
                        copy.myParkSteward = resp.data.myParkSteward[0].id;
                    }
                    copy.allParkSteward = resp.data.allParkSteward;
                    //copy.indus = backData.data.industryList;
                    //console.info(copy);
                    var modal = $uibModal.open({
                        animation: false,
                        templateUrl: '/view/parkCustomerManage/personalInfo/modal.assignPersonal.html',
                        controller: 'assignPersonalContr',
                        resolve: {personFac: copy}
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
                    return "1000以上";
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

        app.filter("sexFilter",function(){
            return function(value){
                if(value === 0){
                    return "男";
                }else if(value === 1){
                    return "女";
                }
            }
        });

        app.controller('addPersonalContr', function($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, personalFac) {
            $scope.item = personalFac;
            $scope.loadIndustry = function(){
                $http.post("/ovu-base/ovupark/backstage/industry/tree",{}, fac.postConfig).success(function (data) {
                    $scope.industryList = data;
                });
            }
            $scope.loadIndustry();

            $scope.save = function (form) {
                form.$setSubmitted(true);
                if (!form.$valid) {
                    return;
                }
                //console.info($scope.item);
                $http.post("/ovu-base/ovupark/backstage/personal/managePersonInfos", {"body":angular.toJson($scope.item)}, fac.postConfig)
                .success(function (resp) {
                    if (resp.code) {
                        msg("保存成功");
                        $uibModalInstance.close();
                    }else {
                        msg(resp.message);
                    }
                });
            }
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.checkSex = function(sex){
                $scope.item.SEX = sex;
            }
        });

        app.controller('assignPersonalContr', function($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, personFac) {
            $scope.item = personFac;
            dataObj = {
                    "userType":"personal",
                    "accecptId":personFac.ID,
                    "parkId":$rootScope.search.parkId
            };
            $http.post("/ovu-base/system/parkHouse/getMyHouseTree",dataObj,fac.postConfig).success(function(resp){
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
                    $scope.houses2 = myLeaseHouses.filter(function(n){return n.fullPath});
                }
            });


            $scope.save = function (form, item) {
                form.$setSubmitted(true);
                if (!form.$valid) {
                    return;
                }
                //如果是未分配，那么把状态值改为已分配（做系统分配处理）
                if(!item.ALLOWED || item.ALLOWED == 0){
                    $scope.item.ALLOWED=1;
                }
                item.CREATE_TIME = new Date(item.CREATE_TIME);

                //console.info($rootScope.houseIdTypes);
                $scope.chooseHouse = $rootScope.houseIdTypes;
                var leaseHouseIdStr = $scope.chooseHouse.lease;
                var saleHouseIdStr = $scope.chooseHouse.sale;
                var requestData = item;
                requestData.chooseBody = angular.toJson($scope.chooseHouse);
                requestData.loginId = app.user.ID;
                //console.info(requestData.chooseBody);
                $http.post("/ovu-base/ovupark/backstage/personal/allotAccForPersonal",requestData, fac.postConfig).success(function (backData) {
                    if (backData.code) {
                        $uibModalInstance.close();
                        msg("操作成功");
                    } else {
                        msg("操作失败");
                    }
                })
            }

            $scope.openSeleHouseModal = function(houses,type){
                if(type === 1){
                    personFac.state = "sale"
                }else if(type === 2){
                    personFac.state = "lease"
                }
                var modal = $uibModal.open({
                    animation: false,
                    size:'',
                    templateUrl: '/view/parkCustomerManage/personalInfo/modal.houseMulti.html',
                    controller: 'personalHouseMultiModalCtrl'
                    ,resolve: {houses:function(){return angular.extend([],houses)},personFac:personFac}
                });
                modal.result.then(function (data) {
                    $scope.reduceHis = data.reducesHouseIds;
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

        app.controller('personalHouseMultiModalCtrl', function($scope, $rootScope, $http,$uibModalInstance,$filter,fac,houses,personFac) {
        	$scope.item = personFac;
            $rootScope.treeData = null;
            $rootScope.flatData = null;
            $scope.config = {edit:false,showCheckbox:true}
            var hasChooseIds;
            if(personFac.state === 'lease'){
                hasChooseIds = $rootScope.houseIdTypes.sale;
            }else if(personFac.state === 'sale'){
                hasChooseIds = $rootScope.houseIdTypes.lease;
            }
            var dataObj = {
                    "parkId":$rootScope.search.parkId,
                    "userType":'personal',
                    "accecptId":$scope.item.ID,
                    "state":personFac.state,
                    "hasChooseIds":hasChooseIds
            }

            $http.post("/ovu-base/system/parkHouse/getSombodyOwnHouseTree",dataObj,fac.postConfig).success(function(treeData){
                $rootScope.treeData = treeData;
                $rootScope.flatData = fac.treeToFlat(treeData);
                var tmpList = [];
                $scope.rightList = [];
                houses.forEach(function(house){
                    var node = $scope.flatData.find(function(n){return n.houseId == house.ID});
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

            var obj = {};
            $scope.saleHids = [];
            $scope.leaseHids = [];
            $scope.validChooseHids=[];

            if(personFac.state === 'lease'){
                $scope.validChooseHids = $scope.leaseHids;
            }else if(personFac.state === 'sale'){
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
                                houses.push(node);
                            }
                        }else{//当未选中的时候
                            $scope.validChooseHids.splice($scope.validChooseHids.indexOf(node.houseId),1);
                        }
                    }

                    if($rootScope.houseIdTypes.hasOwnProperty(personFac.state)){
                        var tmpList = $rootScope.houseIdTypes[personFac.state].split(",");
                        if(node.state.checked){
                            if(tmpList.indexOf(node.houseId) == -1){
                                tmpList.push(node.houseId);
                            }
                        }else {
                            tmpList.splice(tmpList.indexOf(node.houseId),1);
                            $scope.reduceHis.push(node.houseId);

                        }
                        $rootScope.houseIdTypes[personFac.state] = tmpList.join(",");
                        //console.info($rootScope.houseIdTypes.reduceHis);
                    }else {
                        $rootScope.houseIdTypes[personFac.state] = $scope.validChooseHids.join(",");
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
                var houses = $scope.rightList.map(function(n){return {id: n.did,HOUSE_NAME: n.text,fullPath:n.fullPath}});
                $uibModalInstance.close({houses:houses,reducesHouseIds:$scope.reduceHis.join(",")});
                $scope.reduceHis = [];//清空
            }
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        });
    })()
