(function () {
    var app = angular.module("angularApp");
    app.controller('addContractCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac, $location) {
        $scope.user = app.user;
        // 新增步骤
        $scope.currentStep = 1;
        $scope.payType = ''
        if (!app.park) {
            window.history.back();
        }
        $scope.baseMsg={
            isDecorationMerge:0

        }
        var curPage;
        setTimeout(function () {
            curPage = $rootScope.getCurTabPage($rootScope.pages.active, $rootScope.pages);
        })
        // 选择房间
        $scope.openRentHouseModal = function () {

            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '/view/investmentMamage/contractManage/modal.selectHouse.html',
                controller: 'selectHouseModalCtrl',
                resolve: { houses: {houseId:$scope.baseMsg.houseId} , contact: { "parkId": app.park.parkId } }
            });
            modal.result.then(function (data) {
                angular.extend($scope.baseMsg, data.houses)
                if($scope.baseMsg.houseAmount>0){
                    $scope.baseMsg.areaMoney=($scope.baseMsg.houseAmount/parseFloat($scope.baseMsg.area)).toFixed(2)
                    $scope.baseMsg.areaSuMoney=($scope.baseMsg.houseAmount/parseFloat($scope.baseMsg.areaSu)).toFixed(2)
                   
                }
                if($scope.baseMsg.decorationPrice>0){
                    $scope.baseMsg.decorateCount=($scope.baseMsg.decorationPrice*parseFloat($scope.baseMsg.area)).toFixed(2);
                }
                $scope.calcuBalancePayment();
            }, function () {
            });
        }
        // 选择客户
        $scope.selectCustomer = function () {
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '/view/investmentMamage/contractManage/modal.selectCustomer.html',
                controller: 'selectCustomerCtrl',
                resolve: {}
            });
            modal.result.then(function (data) {
                $scope.baseMsg.secondPartyName = data.userinfo.name;
                $scope.baseMsg.secondPartyId = data.userinfo.personId;
                $scope.baseMsg.secondPartyPhone = data.userinfo.phone
                $scope.baseMsg.secondPartyType = data.userinfo.userType;
                console.log($scope.baseMsg.secondPartyType);
            }, function () {
            });
        }
        $scope.calculatedMoney=function () {
            if($scope.baseMsg.houseAmount>0){
                if($scope.baseMsg.area){
                    $scope.baseMsg.areaMoney=($scope.baseMsg.houseAmount/parseFloat($scope.baseMsg.area)).toFixed(2)
                }
                if($scope.baseMsg.areaSu){
                    $scope.baseMsg.areaSuMoney=($scope.baseMsg.houseAmount/parseFloat($scope.baseMsg.areaSu)).toFixed(2)
                }
            }else{
                $scope.baseMsg.areaMoney='';
                $scope.baseMsg.areaSuMoney=''
            }
          
        }
        $scope.calculatedDecorate=function () {
            if($scope.baseMsg.decorationPrice>0){
                $scope.baseMsg.decorateCount=($scope.baseMsg.decorationPrice*parseFloat($scope.baseMsg.area)).toFixed(2);
            }else{
                $scope.baseMsg.decorateCount='';
            }
          
        }
        $scope.checkType=function (type) {
            $scope.baseMsg.isDecorationMerge=type

        }
        //计算尾款金额
        $scope.calcuBalancePayment=function () {
            if($scope.baseMsg.downPayment>0){
                $scope.baseMsg.balancePayment=($scope.baseMsg.totalPrice-$scope.baseMsg.downPayment).toFixed(2)
            }
        }
        
        // 点击下一步 
        $scope.nextStep = function (form) {
            // 保存合同类型
            form.$setSubmitted(true);
            if ($scope.currentStep === 1) {
               
                if (!form.$valid) {
                    // window.alert('请完成必填项！');
                    return false;
                }
                if(!$scope.baseMsg.secondPartyName){
                    window.alert('请选择客户！');
                    return false;
                }
                if(!$scope.baseMsg.houseName){
                    window.alert('请选择房间！');
                    return false;
                }
                if($scope.baseMsg.isDecorationMerge==1){
                    if($scope.baseMsg.decorationPrice>0){
                        $scope.baseMsg.totalPrice=$scope.baseMsg.houseAmount+parseFloat($scope.baseMsg.decorateCount)
                    }else{
                        window.alert('请输入装修单价！');
                        return 
                    }
                }else{
                    $scope.baseMsg.totalPrice=$scope.baseMsg.houseAmount
                }
                $scope.calcuBalancePayment();
                $scope.baseMsg.priceNoRate=($scope.baseMsg.totalPrice*(1-$scope.baseMsg.rate/100)).toFixed(2);
                $scope.baseMsg.ratePrice=($scope.baseMsg.totalPrice*$scope.baseMsg.rate/100).toFixed(2);
                ++$scope.currentStep;
              
            }
            // 保存签约条件
            else if ($scope.currentStep === 2) {
               
                if (!form.$valid) {
                    window.alert('请完成必填项！');
                    return false;
                }
                ++$scope.currentStep;
            }
        }
        // 上一步
        $scope.backStep = function () {
            --$scope.currentStep
        }
        var addDate=function(date, days) {
            if (days == undefined || days == '') {
                return date
            }
            var date = new Date(date);
            date.setDate(date.getDate() + days);
            var month = date.getMonth() + 1;
            var day = date.getDate();
            return date.getFullYear() + '-' + getFormatDate(month) + '-' + getFormatDate(day);
        }
        function getFormatDate(arg) {
            if (arg == undefined || arg == '') {
                return '';
            }
        
            var re = arg + '';
            if (re.length < 2) {
                re = '0' + re;
            }
        
            return re;
        }
       
        // 保存合同 
        $scope.save = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return false;
            }
            if($scope.baseMsg.payMethod==2){
                if(!$scope.baseMsg.downPayment){
                    window.alert('请输入首款金额');
                    return false;
                }
                if(!$scope.baseMsg.downPaymentDate){
                    window.alert('请选择首款日期');
                    return false;
                }
                if(!$scope.baseMsg.balancePaymentDate){
                    window.alert('请选择尾款日期');
                    return false;
                }
                if($scope.baseMsg.downPayment>=$scope.baseMsg.totalPrice){
                    window.alert('首款金额不能超出总价！');
                    return false;
                }
                var signdate=addDate($scope.baseMsg.signDate,$scope.baseMsg.effectDay) 
                if($scope.baseMsg.downPaymentDate<signdate){
                    window.alert('首款日期不能早于生效日期！');
                    return false;
                }
                if($scope.baseMsg.balancePaymentDate<$scope.baseMsg.downPaymentDate){
                    window.alert('尾款日期不能早于首款日期！');
                    return false;
                }
                if($scope.baseMsg.balancePaymentDate==$scope.baseMsg.downPaymentDate){
                    window.alert('尾款日期不能和首款日期是同一天！');
                    return false;
                }
            }
            if($scope.baseMsg.selDay==0){
                $scope.baseMsg.effectDay=0;
            }
            var params=angular.extend({}, $scope.baseMsg);
            delete params.houseName;
            delete params.area;
            delete params.areaSu;
            delete params.recordNumber;
            delete params.areaMoney;
            delete params.areaSuMoney;
            delete params.decorateCount;
            delete params.totalPrice;
            delete params.priceNoRate;
            delete params.ratePrice;
            $http.post("/ovu-park/backstage/invest/saleContract/saveContract", params, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    // window.history.go(-1);
                    //$rootScope.target('/investmentMamage/contractManage/contractManage','合同管理')
                    window.msg("合同保存成功");
                    $scope.$emit("needToClose", curPage);
                } else {
                    window.alert(resp.message);
                }
            });
        }
     
    }
    );
    // 添加空间
    app.controller('selectHouseModalCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, houses, contact) {
        $scope.item = contact;
        $rootScope.treeData = null;
        $rootScope.flatData = null;
        $scope.config = { edit: false, showCheckbox: false }
        $scope.rightObj = '';
        $scope.newChooseIds = [];//编辑资源，已选定，即将要关联的空间id
        var dataObj = {
            "parkId": $scope.item.parkId
        }
        $http.post(" /ovu-park/backstage/invest/saleContract/getHouseTree", dataObj, fac.postConfig).success(function (treeData) {
            $rootScope.treeData = treeData.data;
            $rootScope.flatData = fac.treeToFlat(treeData.data);
            var node = $scope.flatData.find(function (n) { return n.did == houses.houseId });
            if (node != undefined) {
                node.state = node.state || {};
                node.state.selected = true;
                $scope.curNode=node
                expandFather(node);
                $scope.rightObj = node.stageName + ">" + node.buildName + ">" + node.houseName;

            }

        });

        function expandFather(node) {
            var father = $scope.flatData.find(function (n) { return n.did == node.pdid });
            if (father) {
                father.state = father.state || {};
                father.state.expanded = true;
                expandFather(father);
            }
        }
        // $scope.check = function (node) {
        //     node.state = node.state || {};
        //     node.state.checked = !node.state.checked;
        //     function checkSons(node, status) {
        //         node.state = node.state || {};
        //         node.state.checked = status;
        //         if (node.nodes && node.nodes.length) {
        //             node.nodes.forEach(function (n) {
        //                 if (node.state.checked) {//当选中的时候
        //                     if ($scope.validChooseHids.indexOf(n.houseId) === -1) {//只有不包含当前房屋的id时，才加入
        //                         $scope.validChooseHids.push(n.houseId);
        //                     }
        //                 }
        //                 checkSons(n, status);
        //             });
        //         } else {
        //             if (node.state.checked) {//当选中的时候
        //                 if ($scope.validChooseHids.indexOf(node.houseId) === -1) {//只有不包含当前房屋的id时，才加入
        //                     $scope.validChooseHids.push(node.houseId);
        //                 }
        //             } else {//当未选中的时候
        //                 $scope.validChooseHids.splice($scope.validChooseHids.indexOf(node.houseId), 1);
        //                 $scope.reduceHis.push(node.houseId);
        //             }
        //         }
        //     }
        //     function uncheckFather(node) {
        //         var father = $scope.flatData.find(function (n) { return n.did == node.pdid });
        //         if (father) {
        //             father.state = father.state || {};
        //             father.state.checked = false;
        //             uncheckFather(father);
        //         }
        //     }
        //     if (node.state.checked) {
        //         checkSons(node, true);
        //     } else {
        //         checkSons(node, false);
        //         uncheckFather(node);
        //     }
        //     $scope.rightList = $scope.flatData.filter(function (n) { return n.state && n.state.checked == true && n.pdid != null && n.houseName != null })
        //     //console.info(angular.toJson($scope.rightList));
        //     $scope.newChooseIds = [];
        //     for (var i = 0; i < $scope.rightList.length; i++) {
        //         var rightObj = $scope.rightList[i];
        //         var fullPath = rightObj.stageName + ">" + rightObj.buildName + ">" + rightObj.houseName;
        //         $scope.rightList[i].fullPath = fullPath;
        //         $scope.newChooseIds.push(rightObj.houseId);
        //     }
        //     if ($scope.rightList.length == 0) {
        //         $scope.newChooseIds = [];
        //     }
        // }

        $scope.selectNode = function (node) {
            //debugger
            // console.log("curNode",$scope.curNode)
            // if(node.state.selected){
            //     $scope.curNode = node;
            // }else{
            //     delete $scope.curNode;
            // }

            if ($scope.curNode != node) {
                $scope.curNode && $scope.curNode.state && ($scope.curNode.state.selected = false);
            }
            node.state = node.state || {};
            node.state.selected = !node.state.selected;
            if (node.state.selected) {
                $scope.curNode = node;
                if (node.houseId) {
                    $scope.rightObj = node.stageName + ">" + node.buildName + ">" + node.houseName;
                } else {
                    $scope.rightObj = '';
                }
            } else {
                $scope.rightObj = ''
            }
        }
        $scope.save = function () {
            if (!$scope.rightObj || !$scope.curNode) {
                alert("请选择房屋！");
                return;
            }
            var houses = {
                houseId: $scope.curNode.did,
                houseName: $scope.rightObj,
                area:$scope.curNode.area,
                areaSu:$scope.curNode.areaSu,
                recordNumber:$scope.curNode.recordNumber
            }

            $uibModalInstance.close({ houses: houses });
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    });

    // 选择客户
    app.controller('selectCustomerCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, $uibModal, fac) {
        $scope.search = {};
        $scope.personPageModel = {};
        $scope.companyPageModel = {};
        // 获取 乙方人员列表
        $scope.searchCustomers1 = function (pageNo) {
            $scope.search.parkId = app.park.parkId;
            $.extend($scope.search, { currentPage: pageNo || $scope.personPageModel.currentPage || 1, pageSize: $scope.personPageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.personPageModel.totalCount || 0;

            $http.post("/ovu-park/backstage/rental/contract/getPersonInfo", $scope.search, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
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
                if (resp.code == 0) {
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
        $scope.selectSecondPart = function (event, x) {
            $scope.userinfo = x;
            if (event.target.tagName.toLowerCase() != "td" && event.target.tagName.toLowerCase() != "tr") {
                return false;
            }
            $(event.target).parent().parent().children("tr").removeClass("success");
            $(event.target).parent().addClass("success");
        }
        //新增用户

        $scope.addUser = function () {
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: 'addPerson.html',
                controller: 'addPersonCtrl'
                , resolve: {}
            });
            modal.result.then(function (data) {
                $scope.userinfo = {
                    name: data.personName,
                    personId: data.personId,
                    phone: data.phone,
                    userType: data.userType
                }
                $uibModalInstance.close({ userinfo: $scope.userinfo });
            }, function () {
            });
        }
        // 保存
        $scope.save = function () {
            $uibModalInstance.close({ userinfo: $scope.userinfo });
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
    app.controller('addPersonCtrl', function ($scope, $http, $uibModalInstance, fac) {
        $scope.save = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            var reg = new RegExp("^[1][3|5|7|8|9][0-9]{9}$");
            if (!reg.test($scope.mobile)) {
                alert("请输入正确的联系电话！")
                return;
            }
            $http.post("/ovu-park/backstage/invest/saleContract/addParkUser", { name: $scope.name, phone: $scope.mobile }, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {

                    $uibModalInstance.close(resp.data);
                } else {
                    window.alert(resp.message);
                }
            });

        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

})()
