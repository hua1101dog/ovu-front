(function() {
    var app = angular.module("angularApp");
    app.controller('finacialManagCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac, $timeout) {
    	document.title = "OVU-账单管理"; 
    	$scope.search = {
            enterItem: '1'
        }
        $scope.enterItemList = [
            {value:'1',name:'已出账'},
            {value:'2',name:'未出账'}
        ]
    	 $scope.status = [
    	            { value: "2", text: "欠缴" },
    	            { value: "1", text: "已缴" },
    	            { value: "0", text: "未缴" }
         ];
         $scope.renthouseList = [];
    	 
        // 排序状态值
        $scope.sorStatusCopy = {
            billDateSort: -1,
            dateReceivableSort: -1
        }
        $scope.sorStatus = {
            billDateSort: -1,
            dateReceivableSort: -1
        }
    	 // 获取列表
         $scope.pageModel ={};
         $scope.find = function(pageNo){
 			$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
 			$scope.search.parkId = app.park.parkId;
 			fac.getPageResult("/ovu-park/backstage/rental/contractBill/listV2", $scope.search, function (data) {
 			    $timeout(function () {
 			        $scope.pageModel = data;
 			    }, 1)
 			});
 			$.post("/ovu-park/backstage/rental/expenditure/listAll?parkId=" + app.park.parkId, function (resp) {
 			    $scope.expenditure = resp.data
 			});
         };
         
        $scope.finacialSort = function (key, value) {
            $scope.sorStatus = angular.copy($scope.sorStatusCopy);
            $scope.sorStatus[key] = value;
            delete $scope.search.billDateSort;
            delete $scope.search.dateReceivableSort;
            $scope.search[key] = value;
            $scope.find(1);
        }
        // 根据合同编号查询租赁空间
        $scope.getRentHouse = function (code) {
            $http.get("/ovu-park/backstage/rental/rentalContractHouseInfo/selectByContractCode?code="+code).success(function(response) {
                if (response.code === 0) {
                    $scope.renthouseList = response.data;
                } else {
                    $scope.renthouseList = [];
                }
            })
        }
        //计算月租金
        $scope.getMonthRent = function(averageUnitPrice, contractArea){
        	return parseInt(averageUnitPrice)*parseInt(contractArea);
        }
        //租金计算
        $scope.rentelCount = function (contactId) {
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '/view/rental/finacial/modal.count.html',
                controller: 'rentCountCtrl',
                resolve: {contact: { "id": contactId} }
            });
            modal.result.then(function (data) {
                if (data) {
                    $scope.find();
                }
            }, function () {
            });
         }
         // 欠缴提醒
        $scope.remind = function (item) {
            let params = {
                billId: item.id
            }
            $http.post("/ovu-park/backstage/rental/contractBill/remindBillPay", params, fac.postConfig).success(function(resp) {
                if (resp.code === 0) {
                    window.msg(resp.msg);
                } else {
                    window.alert(resp.msg);
                }
            })
        }
         app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find();
            })
        });
    });
    app.filter("finacialStatus", function () {
        return function (status) {
            switch (status) {
                case '0':
                    return '未缴';
                    break;
                case '1':
                    return '已缴';
                    break;
                case '2':
                    return '欠缴';
                    break;
                case '9':
                    return '作废';
                    break;
            }
        }
    })
    app.filter("text", function () {
        return function (text) {
            if (text) {
                return text + '-';
            } else {
                return
            }
            
        }
    })
    // 租金计算
    app.controller('rentCountCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, contact) {
        $http.post("/ovu-park/backstage/rental/contractBill/getBill4Calc?id=" + contact.id).success(function (resp) {
            $scope.secondPartyName = resp.data.secondPartyName;
            $scope.houseList = resp.data.houseList;
            $scope.proportion = resp.data.proportion;
            $scope.expenditureName = resp.data.expenditureName;
            $scope.billDateEnd = resp.data.billDateEnd;
            $scope.billDateStart = resp.data.billDateStart;
        })
        $scope.date = new Date();
        $scope.count = function (num) {
            if (num>=0) {
                $http.post("/ovu-park/backstage/rental/contractBill/calcBill?id=" + contact.id + "&turnover=" + $scope.inputcost).success(function (resp) {
                    $scope.billPrice = resp.data.billPrice;
                    $scope.billPriceTax = resp.data.billPriceTax;
                    $scope.tax = resp.data.tax;
                })
            } else {
                window.alert("最多两位小数的正数,且不大于999999999.99，请重新填写！");
            }
        }
        $scope.save = function () {
            var cost = '';
            if ($scope.inputcost>=0) {
                cost = $scope.inputcost;
            }
            $http.post("/ovu-park/backstage/rental/contractBill/saveCalcResult?id=" + contact.id + "&turnover=" + cost).success(function (resp) {
                if (resp.code==0) {
                    $uibModalInstance.close("1");
                } else {
                    alert(resp.message)
                }
               
            });
            
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    });
})()
