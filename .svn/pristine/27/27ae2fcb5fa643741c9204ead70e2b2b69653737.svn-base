(function () {
    var app = angular.module("angularApp");
    app.directive('wdatePicker', function () {
        return {
            restrict: "A",
            link: function (scope, element, attr) {
                element.bind('click', function () {
                    window.WdatePicker({
                        onpicked: function () { element.change() },
                        oncleared: function () { element.change() }
                    })
                });
            }
        }
    });
    app.controller('addAgreementCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac, $location) {
        var curPage;
        setTimeout(function () {
            curPage = $rootScope.getCurTabPage($rootScope.pages.active, $rootScope.pages);
        })
        var pageParams = $rootScope.pages.params;
        $scope.user = app.user;
        // 新增步骤
        $scope.currentStep = 1;
        // 租金模式
        $scope.rentalModalList = [
            { value: 1, text: "固定租金" },
            { value: 2, text: "抽成租金" },
            { value: 3, text: "比例抽成" }
        ];
        // 乙方类型
        $scope.secondTypeList = [
            { value:1, text: "个人" },
            { value:2, text: "企业" }
        ];
        // 支付方式
        $scope.payWay = [
            { value: 1, text: "月付" },
            { value: 2, text: "季付" },
            { value: 3, text: "年付" }
        ]
        // 免租期
        $scope.freeTime = [
            { value: 1, text: "一个月" },
            { value: 2, text: "两个月" },
            { value: 3, text: "三个月" }
        ]
        // 月天数
        $scope.monthCount = [
            { value: 1, text: "固定天数30天/月" },
            { value: 2, text: "自然月" }
        ]
        // 已租赁空间
        $scope.hasRentedHouseTree = function (id) {
            var dataObj = { "id": id };
            $http.post("/ovu-park/backstage/rental/contract/getRentHouseTree ", dataObj, fac.postConfig).success(function (resp) {
                if (resp.code==0) {
                    var tree = resp.data.tree;
                    var rentList = resp.data.rentList;
                    $rootScope.treeData = tree;
                    $rootScope.flat = fac.treeToFlat(tree);
                    $rootScope.ownerChooseIds = [];//合同已关联的空间id
                    if (rentList && rentList.length > 0) {
                        rentList.forEach(function (n) {
                            var treeNode;
                            var data = $scope.flat.find(function (m) {
                                treeNode = m;
                                return m.houseId == n.id;
                            });
                            data && (n.fullPath = data.fullPath);
                            n.fullPath = treeNode.stageName + ">" + treeNode.buildName + ">" + treeNode.houseName;
                            $rootScope.ownerChooseIds.push(n.houseId);
                        })
                        $scope.rentHouses = rentList.filter(function (n) { return n.fullPath });
                        $scope.rentHouses.forEach(function (n) {
                            if (!n.houseId){
                                n.houseId = n.id;
                            }
                        })
                    }
                }
            });
        }
        // 获取 合同类型 新增 or 编辑
        $scope.getConteactType = function () {
            var params = {
                "parkId": app.park.parkId,
                "isInvest": "0" //0:非招商, 1:招商
            }
            $http.post("/ovu-park/backstage/rental/contractType/listAll", params, fac.postConfig).success(function (resp) {
                if (resp.code ==0) {
                    $scope.typeList = resp.data;
                    // 编辑 or 新增 合同 
                    if (pageParams && pageParams.id) {
                        $scope.addStatus = false;
                        $scope.contractId = pageParams;
                        $scope.edit = true;
                        $scope.contactType = "";
                        $scope.baseMsg = {};
                        $scope.conditionMsg = {};
                        $scope.billStandard = {};
                        // 获取关联空间
                        $scope.hasRentedHouseTree($scope.contractId.id);
                        // 获取合同信息
                        $http.post("/ovu-park/backstage/rental/contract/getInfoById", $scope.contractId, fac.postConfig).success(function (resp) {
                            if (resp.code==0) {
                                // 合同类型
                                $scope.contactType = resp.data.contractTypeId;
                                $scope.contactTypeCache = resp.data.contractTypeId;
                                $scope.checkOne($scope.contactType);
                                // 基本资料
                                $scope.baseMsg.id = resp.data.id;
                                $scope.baseMsg.name = resp.data.name;
                                $scope.baseMsg.code = resp.data.code;
                                $scope.baseMsg.secondPartyType = resp.data.secondPartyType;
                                $scope.baseMsg.secondPartyId = resp.data.secondPartyId;
                                $scope.baseMsg.secondPartyName = resp.data.secondPartyName;
                                $scope.baseMsg.rentalModal = resp.data.rentalModal;
                                $scope.baseMsg.signDate = resp.data.signDate;
                                $scope.baseMsg.contractArea = resp.data.contractArea;
                                $scope.contactFileList = resp.data.contractFileList||[];
                                $scope.baseMsg.contractFiles = resp.data.contractFileList
                                $scope.baseMsg.contractHouseIds = resp.data.contractHouseIds;
                                $scope.baseMsg.contractHouseList = resp.data.contractHouseList;
                                $scope.baseMsg.firstPartyName = resp.data.firstPartyName;
                                $scope.baseMsg.contractArea = resp.data.contractArea;
                                $scope.baseMsg.initMonthRental = resp.data.initMonthRental;
                                $scope.baseMsgCache = {};
                                angular.copy($scope.baseMsg, $scope.baseMsgCache)
                                // 签约 条件
                                $scope.conditionMsg.id = resp.data.id;
                                $scope.conditionMsg.creatorId = $scope.user.personId;
                                $scope.conditionMsg.leaseStart = resp.data.leaseStart;
                                $scope.conditionMsg.leaseEnd = resp.data.leaseEnd;
                                var start = new Date($scope.conditionMsg.leaseStart);
                                var end = new Date($scope.conditionMsg.leaseEnd);
                                var months;
                                months = (end.getFullYear() - start.getFullYear()) * 12;
                                months -= start.getMonth();
                                months += end.getMonth();
                                if (start.getDate() >= end.getDate()) {
                                    months == 0 ? 0 : months;
                                } else {
                                    months == 0 ? 1 : months + 1;
                                }
                                $scope.conditionMsg.leaseTotal = months;
                                $scope.conditionMsg.enterDate = resp.data.enterDate;
                                $scope.conditionMsg.monthDays = resp.data.monthDays;
                                $scope.conditionMsg.rentFreePeriod = resp.data.rentFreePeriod;
                                // expenditureCodes 收费项目code
                                $scope.conditionMsg.expenditureList = resp.data.expenditureList;
                                $scope.conditionMsg.expenditureNames=[];
                                $scope.conditionMsg.expenditureIds = [];
                                $scope.conditionMsg.expenditureCodes = {};
                                angular.forEach($scope.conditionMsg.expenditureList,function(n) {
                                        n.check = true;
                                        if (n.name!="履约保证金") {
                                            $scope.conditionMsg.expenditureCodes += n.code+",";
                                            $scope.conditionMsg.expenditureNames.push(n.name);
                                            $scope.conditionMsg.expenditureIds.push(n.code);
                                        }
                                });
                                // increaseRateCode  递增率code
                                $scope.conditionMsg.increaseRateCode = resp.data.increaseRate?resp.data.increaseRate.code:"";
                                $scope.conditionMsg.increaseRate = resp.data.increaseRate;
                                // $scope.conditionMsg.increaseRateId = resp.data.increaseRate?resp.data.increaseRate.code:"";
                                $scope.conditionMsg.payType = resp.data.payType;
                                $scope.conditionMsgCache = {};
                                angular.copy($scope.conditionMsg,$scope.conditionMsgCache)
                                // 费用标准
                                $scope.billStandard.depositDay = resp.data.depositDay;
                                $scope.billStandard.deposit = resp.data.deposit;
                                $scope.billStandard.id =  resp.data.id;
                                $scope.billStandardCache = {};
                                angular.copy($scope.billStandard, $scope.billStandardCache);
                            } else {
                                window.alert(resp.message);
                            }
                        });
                    } else {
                        $scope.addStatus = true;
                        $scope.contactType = "";
                        $scope.baseMsg = {};
                        $scope.contactFileList = [];
                    }
                } else {
                    window.alert(resp.message);
                }
            });
        }
        // 获取 递增率列表
        $scope.getRate = function(){
            $http.post("/ovu-park/backstage/rental/increaseRate/listAll",{parkId:app.park.parkId},fac.postConfig).success(function(resp){
                if(resp.code==0){
                    $scope.rateList = resp.data;
                }else{
                    window.alert(resp.message);
                }
            });
        }
        // 选择 合同类型
        $scope.checkOne = function (id) {
            for (var i in $scope.typeList) {
                if (id === $scope.typeList[i].id) {
                    $scope.typeList[i].checked = !$scope.typeList[i].checked;
                } else {
                    $scope.typeList[i].checked = false;
                }
            }
            $scope.contactType = id;
        }

        $scope.blurBox = 0;
        $scope.selCustomer = function(x){
            $scope.secondPartyName = x.customerName;
            $scope.baseMsg.secondPartyId = x.customerId;
            $scope.baseMsg.secondPartyName = x.customerName;
            $scope.baseMsg.secondPartyType = x.userType;
            console.log($scope.baseMsg.secondPartyType);
            $scope.blurBox = 0;   
        }


        // ----------------------------------------------------------
        //添加费项
            $scope.openExpenditureList = function () {
                var modal = $uibModal.open({
                    animation: false,
                    size: '',
                    templateUrl: '/view/rental/rentAgreement/modal.expenditure.html',
                    controller: 'rentExpenditureCtrl',
                    resolve: { expenditureList: function () { return $scope.expenditureList; },expenditureCodes:function () { return $scope.conditionMsg.expenditureIds; }}
                });
                modal.result.then(function (data) {
                    $scope.conditionMsg.expenditureCodes = data.expenditureCodes;
                    $scope.conditionMsg.expenditureNames = data.expenditureNames;
                    $scope.conditionMsg.expenditureIds = data.expenditureIds;
                    $scope.blurBox = 0;
                }, function () {
                });
            }
        // 获取 所有费项列表
        $scope.expenditureListAll = function () {
            var params = {
                status: "1",
                parkId: app.park.parkId,
            }
            $http.post("/ovu-park/backstage/rental/expenditure/listAll", params, fac.postConfig).success(function (resp) {
                $scope.expenditureList = [];
                if (resp.code ==0) {
                    resp.data.forEach(function (n) {
                        if (n.category == "02" && n.name =="租金"){
                            $scope.expenditureList.push(n);
                        }
                        if (n.category == "03"){
                            $scope.expenditureList.push(n);
                        }
                    });
                } else {
                    window.alert(resp.message);
                }
            });
        }
        // 上传合同
        var accepts = ['.doc','.docx', '.pdf','.xls', '.xlsx'];
        
        $scope.uploadFile = function () {
            var params = {};
            $rootScope.addLimitFiles2($scope.contactFileList, 'url', 'name', accepts, 5);
            
        }
        // 删除合同文档
        $scope.delContactFile = function (index) {
            $scope.contactFileList.splice(index,1);
        }
        // 添加空间
        $scope.openRentHouseModal = function (houses, contactId) {
            if (houses == undefined) {
                houses = {};
            }
            var modal = $uibModal.open({
                animation: false,
                size:'lg',
                templateUrl: '/view/rental/rentAgreement/modal.houseMulti.html',
                controller: 'rentHouseModalCtrl',
                resolve: { houses: function () { return angular.extend([], houses) }, contact: { "id": contactId, "parkId": app.park.parkId } }
            });
            modal.result.then(function (data) {
                $scope.rentHouses = data.houses;
                // 房屋id拼接的字符串
                $scope.newChooseIds = data.newChooseIds;
                var params = {
                    'contractHouseIds':$scope.newChooseIds.join(',')
                };
                $http.post("/ovu-park/backstage/rental/contract/calculateRental", params, fac.postConfig).success(function(resp){
                    if(resp.code==0){
                        $scope.baseMsg.contractArea = resp.data.totalArea;
                        $scope.baseMsg.initMonthRental = resp.data.initMonthRental;
                    }else{
                    	 delete $scope.baseMsg.contractArea;
                    	 delete $scope.baseMsg.initMonthRental;
                        window.alert(resp.message)
                    }
                })
            }, function () {
            });
        }
        // 添加乙方
        $scope.openRentHouseParty = function () {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/rental/rentAgreement/modal.houseParty.html',
                controller: 'rentHousePartyCtrl',
                resolve: {  }
            });
            modal.result.then(function (data) {
                $scope.secondPartyName = data.secondParty.name;
                $scope.baseMsg.secondPartyName = data.secondParty.name;
                $scope.baseMsg.secondPartyId = data.secondParty.personId;
                $scope.baseMsg.secondPartyType = data.secondParty.userType;
                if ($scope.baseMsgCache) {
                    $scope.baseMsgCache.secondPartyId = $scope.baseMsg.secondPartyId;
                    $scope.baseMsgCache.secondPartyName = $scope.baseMsg.secondPartyName;
                    $scope.baseMsgCache.secondPartyType = $scope.baseMsg.secondPartyType;
                }
                console.log($scope.baseMsg.secondPartyType);
                $scope.blurBox = 0;
            }, function () {
            });
        }
        //设置费用标准
        $scope.openSetCost = function (index,item) {
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '/view/rental/rentAgreement/modal.setCost.html',
                controller: 'setCostCtrl1',
                resolve: { expenditure: item,index: index}
            });
            modal.result.then(function (data) {
                var index = data.index;
                $scope.pageModel[index] = data.expenditure;
                $scope.blurBox = 0;
            }, function () {
            });
        }
        // 设置计费方式
        $scope.setConst = function () {
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '/view/rental/rentAgreement/modal.setCost.html',
                controller: 'rentSetCostCtrl',
                resolve: { houses: function () { return angular.extend([], houses) }, contact: { "id": contactId, "parkId": app.park.parkId } }
            });
            modal.result.then(function (data) {
                
                $http.post("").success(function (resp) {
                   
                })
            }, function () {
            });
        }
        
        // 费用分页列表
        $scope.pageModel = {};
        $scope.pageModelCache = {};
        $scope.search = {};
        $scope.searchCache = {};
        // 储存所有定价
        $scope.forFind = function () {
            // 储存 费项 列表数据
            $scope.searchCache.contractId = $scope.baseMsg.id;
            fac.getPageResult("/ovu-park/backstage/rental/contract/contractExpenditure/listByContractId", $scope.searchCache , function (data) {
                $scope.pageModelCache = data;
                angular.forEach($scope.pageModelCache, function (data, index, array) {
                    var x = index;
                    $scope.billStandard.contractExpenditureList[x] = {
                        averageUnitPrice: array[index].averageUnitPrice,
                        id: array[index].id
                    }
                });
            });
            // console.log($scope.billStandard.contractExpenditureList);
        };
        $scope.find = function () {
            $scope.search.contractId = $scope.baseMsg.id;
            fac.getPageResult("/ovu-park/backstage/rental/contract/contractExpenditure/listByContractId", $scope.search, function (data) {
                $scope.pageModel = [];
                data.forEach(function (n) {
                    if (n.firstPrice != null && n.firstPrice!= 0){
                        n.yesOrNo = "1";
                    } else {
                        n.yesOrNo = "0";
                    }
                    var t = n.payTime;
                    n.payTime = parseInt(t);
                    if(n.name!="租金"){
                        n.payType="11";
                    }
                    if (n.name!="履约保证金"){
                        $scope.pageModel.push(n);
                    }
                });
            });
        };
        //计算租期
        $scope.getLeaseMonth = function (leaseStart, leaseEnd) {
            var start = new Date(leaseStart);
            var end = new Date(leaseEnd);
            var months;
            months = (end.getFullYear() - start.getFullYear()) * 12;
            months -= start.getMonth();
            months += end.getMonth();
            if (start.getDate() >= end.getDate()) {
                months == 0 ? 0 : months;
            } else {
                months == 0 ? 1 : months + 1;
            }
            $scope.conditionMsg.leaseTotal = months
        }
        $scope.pageModel = [];
        //监听“是否按首期”选项，调整首期金额的值
        $scope.$watch("pageModel",function (newVal,oldVa1) {
            for (var i=0;i<newVal.length;i++) {
                if (newVal[i].yesOrNo=="0"){
                    newVal[i].firstPrice=0;
                }
            }
        },true);
        // 点击下一步 
        $scope.nextStep = function (form) {
            // 保存合同类型
            if ($scope.currentStep === 1) {
                if (!$scope.contactType) {
                    window.msg("请选择合同类型");
                    return;
                }
                var params = {
                    contractTypeId: $scope.contactType,
                    parkId: app.park.parkId,
                    creatorId: app.user.personId,
                    creatorName:app.user.nickname!=null?app.user.nickname:app.user.loginName,
                    code:$scope.baseMsg.code,
                    name:$scope.baseMsg.name,
                    firstPartyName:$scope.baseMsg.firstPartyName
                };
                params.id = $scope.contractId?$scope.contractId.id:"";
                if ($scope.contactTypeCache && ($scope.contactTypeCache === $scope.contactType)) {
                    ++$scope.currentStep;
                } else {
                    $scope.contactTypeCache = $scope.contactType;
                    $http.post("/ovu-park/backstage/rental/contract/saveOrEdit", params, fac.postConfig).success(function (resp) {
                        if (resp.code==0) {
                            window.msg("合同类型保存成功");
                            ++$scope.currentStep;
                            if (resp.data) {
                                $scope.baseMsg.id = resp.data.id;
                                $scope.baseMsg.creatorId = $scope.user.personId;
                                $scope.baseMsg.code = resp.data.code;
                                $scope.baseMsg.name = resp.data.name;
                                $scope.baseMsg.contractTypeId = resp.data.contractTypeId;
                                $scope.baseMsg.status = resp.data.status;
                                $scope.baseMsg.firstPartyName = resp.data.firstPartyName;
                                var d = new Date();
                                $scope.baseMsg.signDate = d.format("yyyy-MM-dd");
                            }
                        } else {
                            window.alert(resp.message);
                        }
                    });
                }
            }
            // 保存基本资料
            else if ($scope.currentStep === 2) {
                if (!form.$valid || !$scope.contactFileList || !$scope.rentHouses) {
                    window.alert('请完成必填项！');
                    return false;
                }
                $scope.rentHouses.forEach(function (n) {
                    if (!n.houseId){
                        n.houseId = n.id;
                    }
                })

                $scope.baseMsg.updatorId = $scope.user.personId;
                $scope.baseMsg.updatorName = $scope.user.nickname!=null?$scope.user.nickname:$scope.user.loginName;
                $scope.baseMsg.contractHouses = JSON.stringify($scope.rentHouses);
                $scope.baseMsg.contractFiles = JSON.stringify($scope.contactFileList); 
                if($scope.baseMsgCache){
                    $scope.baseMsgCache.updatorId = $scope.baseMsg.updatorId;
                    $scope.baseMsgCache.updatorName = $scope.baseMsg.updatorName;
                    $scope.baseMsgCache.contractHouses = JSON.stringify($scope.rentHouses);
                    $scope.baseMsgCache.contractFiles = JSON.stringify($scope.contactFileList); 
                }
                //$scope.chooseHouse = "";
                if (angular.equals($scope.baseMsg, $scope.baseMsgCache)) {
                    ++$scope.currentStep;
                } else {
                   
                    $http.post("/ovu-park/backstage/rental/contract/basicInfo/saveOrEdit", $scope.baseMsg, fac.postConfig).success(function (resp) {
                        if (resp.code==0) {
                            window.msg("基本资料保存成功");
                            $scope.conditionMsg = {};
                            $scope.expenditureListAll();
                            ++$scope.currentStep;
                        } else {
                            window.alert(resp.message);
                        }
                    });
                }
            }
            // 保存签约条件
            else if ($scope.currentStep === 3) {
                if (!form.$valid) {
                    window.alert('请完成必填项！');
                    return false;
                }
                if($scope.conditionMsg.leaseStart>$scope.conditionMsg.leaseEnd){
                    window.alert('租期终止时间要大于租期起始时间');
                    return false;
                }
                if($scope.conditionMsg.enterDate>$scope.conditionMsg.leaseEnd||$scope.conditionMsg.enterDate<$scope.conditionMsg.leaseStart){
                    window.alert('进场时间要在租期范围内');
                    return false;
                }
                if (angular.equals($scope.conditionMsg,$scope.conditionMsgCache)) {
                    ++$scope.currentStep;
                    // 费项固定租金列表
                    $scope.billStandard.contractExpenditureList = [];
                    $scope.contractBillListCache = [];
                    $scope.find();
                    $scope.forFind(1);

                } else{
                    $scope.conditionMsg.updatorId = $scope.user.personId;
                    $scope.conditionMsg.updatorName = $scope.user.nickname!=null?$scope.user.nickname:$scope.user.loginName;
                    $scope.conditionMsg.id = $scope.baseMsg.id;
                    angular.copy($scope.conditionMsg, $scope.conditionMsgCache);
                    $http.post("/ovu-park/backstage/rental/contract/conditions/saveOrEdit", $scope.conditionMsg, fac.postConfig).success(function (resp) {
                        if (resp.code==0) {
                            window.msg("签约条件保存成功");
                            $scope.pageModel = {};
                            $scope.pageModelCache = {};
                            $scope.search = {};
                            $scope.searchCache = {};
                            $scope.billStandard = {};
                            $scope.billStandard.id = $scope.baseMsg.id;
                            // 费项固定租金列表
                            $scope.billStandard.contractExpenditureList = [];
                            $scope.billStandard.deposit="";
                            $scope.billStandard.depositDay="";
                            $scope.contractBillListCache = [];
                            $scope.find();
                            $scope.forFind(1);
                            ++$scope.currentStep;
                        } else {
                            window.alert(resp.message);
                        }
                    });
                }
            }
        }
        // 上一步
        $scope.backStep = function () {
            --$scope.currentStep
        }
        // 保存合同 
        $scope.save = function (form) {
            if (!$scope.billStandard.deposit||!$scope.billStandard.depositDay) {
                window.alert('请正确填写必填并完成所有项！');
                return false;
            }
            if ($scope.billStandard.deposit<=0) {
                window.alert('履约保证金不能小于等于0！');
                return false;
            }
            if ($scope.billStandard.depositDay<0) {
                window.alert('履约保证金付款日期不能小于0！');
                return false;
            }
            var invild = true;
            $scope.pageModel.forEach(function(n){
                if (n.name !="履约保证金" && (n.payType==null || n.payType=="")) {
                    window.alert('付费方式不能为空！');
                    invild = false;
                }
                if (n.firstPrice !=null && n.firstPrice<0) {
                    window.alert('首期租金不能小于0！');
                    invild = false;
                }
                if (n.payTime ==null || n.payTime<=0) {
                    window.alert('付款日期不能小于等于0！');
                    invild = false;
                }
                if (n.firstPrice !=null && n.firstPrice<0) {
                    window.alert('首期租金不能小于0！');
                    invild = false;
                }
                if (n.payType=='3' && (n.proportion ==null || n.proportion <=0)) {
                    window.alert(n.name+'营业额不能小于等于0！');
                    invild = false;
                }
                if (n.payType=='2' && (n.amountStandard==null || n.amountStandard <=0)) {
                    window.alert(n.name+'抽成金额不能小于等于0！');
                    invild = false;
                }
                if (n.payType == '11' && n.category!="02"  && (n.amountStandard==null || n.amountStandard <0)) {
                    window.alert(n.name+'价格不能小于0！');
                    invild = false;
                }
            });
            if (!invild){
                return false;
            }

            $scope.pageModel.forEach(function (n) {
                if(n.yesOrNo=="0"){
                    n.firstPrice=0;
                }
            });
            $scope.billStandard.contractExpenditureList[0] = {
                name:"履约保证金",
                firstPrice:0.00,
                payTime:$scope.billStandard.depositDay,
                payType:null,
                amountStandard:$scope.billStandard.deposit,
                averageUnitPrice: null,
                id: null
            }
            angular.forEach($scope.pageModel, function (data, index, array) {
                var x = index+1;
                $scope.billStandard.contractExpenditureList[x] = {
                    name : array[index].name,
                    firstPrice:array[index].firstPrice,
                    payTime:array[index].payTime,
                    payType:array[index].payType,
                    amountStandard:array[index].amountStandard,
                    averageUnitPrice: array[index].averageUnitPrice,
                    id: array[index].id,
                    proportion: array[index].proportion,
                    remark:array[index].remark
                }
            });

            // if ($scope.billStandard.contractExpenditureList.length != $scope.pageModel.totalCount) {
            //     window.alert('请填写完所有费用单价！');
            //     return false;
            // }
            $scope.billStandardCache = {};
            $scope.billStandard.updatorId = $scope.user.personId;
            $scope.billStandard.updatorName = $scope.user.nickname!=null?$scope.user.nickname:$scope.user.loginName;
            angular.copy($scope.billStandard, $scope.billStandardCache);
            $scope.billStandardCache.contractExpenditureList = JSON.stringify($scope.billStandard.contractExpenditureList);
            $http.post("/ovu-park/backstage/rental/contract/billStandard/saveOrEdit", $scope.billStandardCache, fac.postConfig).success(function (resp) {
                if (resp.code==0) {
                    // ++$scope.currentStep
                    window.msg("合同保存成功");
                    // $location.url("/rental/rentAgreement/rentAgreement");
                    $scope.$emit("needToClose", curPage);
                } else {
                    window.alert(resp.message);
                }
            });
        }
        app.modulePromiss.then(function () {
            $scope.getConteactType();
            $scope.expenditureListAll();
            $scope.getRate();
        });
    }
    );
    // 添加空间
    app.controller('rentHouseModalCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, houses, contact) {
        $scope.item = contact;
        $rootScope.treeData = null;
        $rootScope.flatData = null;
        $scope.config = { edit: false, showCheckbox: true }

        $scope.newChooseIds = [];//编辑租赁资源，已选定，即将要关联的空间id
        var dataObj = {
            "id": $scope.item.id,
            "parkId": $scope.item.parkId
        }

        $http.post("/ovu-park/backstage/rental/contract/getContractHouseTree", dataObj, fac.postConfig).success(function (treeData) {
            $rootScope.treeData = treeData.data;
            $rootScope.flatData = fac.treeToFlat(treeData.data);
            $scope.rightList = [];
            houses.forEach(function (house) {
                debugger;
                var node = $scope.flatData.find(function (n) { return n.did == house.id });
                if(node != undefined){
                	node.state = node.state || {};
                    node.state.checked = true;
                    expandFather(node);
                    node.fullPath = node.stageName + ">" + node.buildName + ">" + node.houseName;
                    $scope.rightList.push(node);
                    $scope.newChooseIds.push(node.houseId);
                }
            });
        });

        function expandFather(node) {
            var father = $scope.flatData.find(function (n) { return n.did == node.pdid });
            if (father) {
                father.state = father.state || {};
                father.state.expanded = true;
                expandFather(father);
            }
        }

        var obj = {};
        $scope.validChooseHids = [];//用于收集已勾选的房屋id
        $scope.reduceHis = [];//用于收集取消勾选的房屋id
        $scope.check = function (node) {
            node.state = node.state || {};
            node.state.checked = !node.state.checked;
            function checkSons(node, status) {
                node.state = node.state || {};
                node.state.checked = status;
                if (node.nodes && node.nodes.length) {
                    node.nodes.forEach(function (n) {
                        if (node.state.checked) {//当选中的时候
                            if ($scope.validChooseHids.indexOf(n.houseId) === -1) {//只有不包含当前房屋的id时，才加入
                                $scope.validChooseHids.push(n.houseId);
                            }
                        }
                        checkSons(n, status);
                    });
                } else {
                    if (node.state.checked) {//当选中的时候
                        if ($scope.validChooseHids.indexOf(node.houseId) === -1) {//只有不包含当前房屋的id时，才加入
                            $scope.validChooseHids.push(node.houseId);
                        }
                    } else {//当未选中的时候
                        $scope.validChooseHids.splice($scope.validChooseHids.indexOf(node.houseId), 1);
                        $scope.reduceHis.push(node.houseId);
                    }
                }
            }
            function uncheckFather(node) {
                var father = $scope.flatData.find(function (n) { return n.did == node.pdid });
                if (father) {
                    father.state = father.state || {};
                    father.state.checked = false;
                    uncheckFather(father);
                }
            }
            if (node.state.checked) {
                checkSons(node, true);
            } else {
                checkSons(node, false);
                uncheckFather(node);
            }
            $scope.rightList = $scope.flatData.filter(function (n) { return n.state && n.state.checked == true && n.pdid != null && n.houseName != null })
            //console.info(angular.toJson($scope.rightList));
            $scope.newChooseIds = [];
            for (var i = 0; i < $scope.rightList.length; i++) {
                var rightObj = $scope.rightList[i];
                var fullPath = rightObj.stageName + ">" + rightObj.buildName + ">" + rightObj.houseName;
                $scope.rightList[i].fullPath = fullPath;
                $scope.newChooseIds.push(rightObj.houseId);
            }
            if($scope.rightList.length == 0){
            	 $scope.newChooseIds = [];
            }
        }
        $scope.save = function () {
            var houses=[];
            angular.copy($scope.rightList,houses);
            angular.forEach(houses,function(value,key ){
                houses[key].id = value.did;
                houses[key].parkName = app.park.name;
                houses[key].parkId = app.park.parkId;
                houses[key].houseType = "1";
            })
            // var houses = $scope.rightList.map(function (n) { return { ID: n.did, HOUSE_NAME: n.text, fullPath: n.fullPath } });
            // var houses = $scope.rightList;
            $uibModalInstance.close({ houses: houses, newChooseIds: $scope.newChooseIds });
            $scope.reduceHis = [];//清空
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    });
    
    // 添加乙方
    app.controller('rentHousePartyCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac) {
        $scope.search = {};
        $scope.personPageModel = {};
        $scope.companyPageModel = {};
        // 获取 乙方人员列表
        $scope.searchCustomers1 = function (pageNo) {
            $scope.search.parkId = app.park.parkId;
            $.extend($scope.search, { currentPage: pageNo || $scope.personPageModel.currentPage || 1, pageSize: $scope.personPageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.personPageModel.totalCount || 0;

            $http.post("/ovu-park/backstage/rental/contract/getPersonInfo",  $scope.search, fac.postConfig).success(function (resp) {
                if (resp.code==0) {
                    $scope.personList = resp.data.data;
                    $scope.personPageModel = resp.data;
                    $scope.personPageModel.currentPage = $scope.personPageModel.pageIndex + 1;
                    var pages = [];
                    var hash = {};
                    var list = [1, $scope.search.currentPage - 1, $scope.search.currentPage, $scope.search.currentPage + 1, $scope.personPageModel.pageTotal];
                    list.forEach(function (v) {
                        if (!hash[v] && v <= $scope.personPageModel.pageTotal && v > 0) {
                            hash[v] = true;
                            pages.push(v);
                        }
                    })
                    if (pages.length > 2 && pages.indexOf(2) == -1) {
                        pages.splice(1, 0, '······');
                    }
                    if (pages.length > 2 && pages.indexOf($scope.personPageModel.pageTotal - 1) == -1) {
                        pages.splice(pages.length - 1, 0, '······');
                    }
                    $scope.personPageModel.pages = pages;
                } else {
                    window.alert(resp.message);
                }
            });
        }

        // 获取 乙方企业列表
        $scope.searchCustomers2 = function (pageNo) {
            $scope.search.parkId = app.park.parkId;
            $.extend($scope.search, { currentPage: pageNo || $scope.companyPageModel.currentPage || 1, pageSize: $scope.companyPageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.companyPageModel.totalCount || 0;
            $http.post("/ovu-park/backstage/rental/contract/getCompanyInfo", $scope.search, fac.postConfig).success(function (resp) {
                if (resp.code==0) {
                    $scope.companyList = resp.data.data;
                    $scope.companyPageModel = resp.data;
                    $scope.companyPageModel.currentPage = $scope.companyPageModel.pageIndex + 1;
                    var pages = [];
                    var hash = {};
                    var list = [1, $scope.search.currentPage - 1, $scope.search.currentPage, $scope.search.currentPage + 1, $scope.companyPageModel.pageTotal];
                    list.forEach(function (v) {
                        if (!hash[v] && v <= $scope.companyPageModel.pageTotal && v > 0) {
                            hash[v] = true;
                            pages.push(v);
                        }
                    })
                    if (pages.length > 2 && pages.indexOf(2) == -1) {
                        pages.splice(1, 0, '······');
                    }
                    if (pages.length > 2 && pages.indexOf($scope.companyPageModel.pageTotal - 1) == -1) {
                        pages.splice(pages.length - 1, 0, '······');
                    }
                    $scope.companyPageModel.pages = pages;
                } else {
                    window.alert(resp.message);
                }
            });
        }
        // 选中乙方
        $scope.selectSecondPart = function (event,x) {
            $scope.secondParty = x;
            if(event.target.tagName.toLowerCase() != "td" && event.target.tagName.toLowerCase() != "tr"){
                return false;
            }
            $(event.target).parent().parent().children("tr").removeClass("success");
            $(event.target).parent().addClass("success");
        }
        // 保存
        $scope.save = function () {
            $uibModalInstance.close({ secondParty: $scope.secondParty});
            $scope.reduceHis = [];//清空
        }
        // 取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

        app.modulePromiss.then(function () {
            $scope.searchCustomers1();
            $scope.searchCustomers2();
        });
    });

    //添加费项
    app.controller('rentExpenditureCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac,expenditureList,expenditureCodes) {
        if (expenditureList!=null && expenditureCodes != null)
        {
            expenditureList.forEach(function (expenditure) {
                var judge = true;
                expenditureCodes.forEach(function (code) {
                    if (judge) {
                        if (expenditure.code==code) {
                            expenditure.checked = true;
                            judge = false;
                        }else {
                            expenditure.checked = false;
                        }
                    }
                });
            });
        }
        $scope.expendituretem = {};
        $scope.expendituretem.data = expenditureList;
        $scope.expendituretem.list = expenditureList;
        // 选中费项
        $scope.selectExpenditure = function (event,x) {
            if(event.target.tagName.toLowerCase() != "td" && event.target.tagName.toLowerCase() != "tr"){
                return false;
            }
            $(event.target).parent().parent().children("tr").removeClass("success");
            $(event.target).parent().addClass("success");
        }
        // 保存
        $scope.expenditureCodes = {};
        $scope.expenditureNames = [];
        $scope.expenditureIds = [];
        $scope.save = function (expenditures) {
            expenditures.data.forEach(function(n) {
                if (n.checked || n.name=="租金"){
                    $scope.expenditureCodes += n.code+",";
                    $scope.expenditureNames.push(n.name);
                    $scope.expenditureIds.push(n.code);
                }
            });

            $uibModalInstance.close({ expenditureCodes: $scope.expenditureCodes,
                expenditureNames:$scope.expenditureNames,
                expenditureIds:$scope.expenditureIds});
            $scope.reduceHis = [];//清空
        }
        // 取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

    });


    //设置费用标准
    app.controller('setCostCtrl1', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac,expenditure,index) {
        $scope.expenditure = expenditure;
        $scope.index = index;
        $scope.view = false;
        // 保存
        $scope.save = function () {
            if (expenditure.payType=='3' && expenditure.proportion <=0) {
                window.alert('营业额不能小于等于0！');
                return false;
            }
            if (expenditure.payType=='2' && expenditure.amountStandard <=0) {
                window.alert('抽成金额不能小于等于0！');
                return false;
            }
            if (expenditure.payType == '11'  && expenditure.amountStandard <0) {
                window.alert('价格不能小于0！');
                return false;
            }
            $uibModalInstance.close({ expenditure: $scope.expenditure,index:$scope.index});
            $scope.reduceHis = [];//清空
        }
        // 取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

    });

})()
