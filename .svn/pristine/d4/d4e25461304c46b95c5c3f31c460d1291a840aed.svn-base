(function () {
    var app = angular.module("angularApp");
    app.controller('operationBillCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-运营账单";
        $scope.current = 1;
        // angular.extend($rootScope, fac.dicts);
        $scope.search = {
            parkId: '',
            global: ''
        };
        $scope.pageModel = {};
        $scope.comType = [];

        $scope.moneyRange = [{
                value: 1,
                text: "100元以下",
                min: 0,
                max: 10000,
            },
            {
                value: 2,
                text: "100-200元",
                min: 10000,
                max: 20000,
            },
            {
                value: 3,
                text: "200-500元",
                min: 20000,
                max: 50000,
            },
            {
                value: 4,
                text: "500-1000元",
                min: 50000,
                max: 100000,
            },
            {
                value: 5,
                text: "1000元以上",
                min: 100000
            },
        ]

        $scope.find = function (pageNo) {
            if($scope.search.global != true &&
                $scope.search.global != 'true' &&
                !$scope.search.parkId)
            {
                alert("请选择项目关联的部门")
                $scope.pageModel = {};
                return
            }

            if ($scope.pageModel.currentPage) {
                delete $scope.pageModel.currentPage;
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            fac.getPageResult("/ovu-park/backstage/backpaymentbill/page", $scope.search, function (resp) {
                $scope.pageModel = resp;
            });
        };


        // 页面加载
        $scope.init = function () {
            setTimeout(function(){
                $scope.search.global = $scope.urlSlice('global')
                if ($scope.search.global) {
                    $scope.search.parkId = '' 
                } else {
                    $scope.search.parkId = $scope.dept.parkId
                }
                $scope.find()
            },100) 
        }

        $scope.urlSlice = function (paraName) {
            var url = window.location.toString();
            // console.log('url', url)
            var arrObj = url.split("?");
            if (arrObj.length > 2) {
                // console.log('arrObj', arrObj)
                var arr = arrObj[2].split('=')
                if (arr != null && arr[0] == paraName) {
                    return arr[1];
                } else {
                    return "";
                }
            } else {
                return false
            }
        }

        //页面初始化
        app.modulePromiss.then(function () {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {

                        $scope.search.parkId = $scope.dept.parkId
                        $scope.init();

                    } else {
                        $scope.search.parkId && delete $scope.search.parkId
                       
                        $scope.init();
                        return
                    }

                }
            })
        })

        $scope.init()

        $scope.query = function () {
            if ($scope.selMoneyRange) {
                var sel = $scope.moneyRange.find(v => {
                    return v.value == $scope.selMoneyRange
                })
                switch (sel.value) {
                    case 0:
                        $scope.search.maxAmount = '';
                        $scope.search.minAmount = '';
                        break;
                    case 1:
                        $scope.search.minAmount = 0;
                        $scope.search.maxAmount = 10000;
                        break;
                    case 2:
                        $scope.search.minAmount = 10000;
                        $scope.search.maxAmount = 20000;
                        break;
                    case 3:
                        $scope.search.minAmount = 20000;
                        $scope.search.maxAmount = 50000;
                        break;
                    case 4:
                        $scope.search.minAmount = 50000;
                        $scope.search.maxAmount = 100000;
                        break;
                    case 5:
                        $scope.search.minAmount = 100000;
                        $scope.search.maxAmount = '';
                        break;
                }
            } else {
                if ($scope.search.maxAmount)
                    delete $scope.search.maxAmount
                if ($scope.search.minAmount)
                    delete $scope.search.minAmount
            }
            $scope.find(1);
        }


        //点击商户类别



        $scope.typeDetail = function (type) {

            $scope.search.mType = type

            $scope.find()

            var navList = $(".typeDetailList span")
            for (let i = 0; i < navList.length; i++) {
                let li = navList[i]
                li.onclick = function () {
                    index = i
                    for (let j = 0; j < navList.length; j++) {
                        navList[j].className = ""
                    }
                    navList[index].className = "selected"
                }
            }
        }

        //选择订单类型（自营or第三方）
        $scope.searchType = function (type) {
            $scope.search.global = $scope.urlSlice('global')
            var params = {
                global:$scope.search.global
            }
            if (type == "1") {
                $http.get("/ovu-park/backstage/backpaymentbill/getMTyte?orderType=1").success(function (resp) {
                    $scope.comType = resp.data
                    $scope.search.orderType = 1
                    $scope.search.mType = ''
                }).then(()=>{
                    $scope.find()
                })
            } else if (type == "2") {
                $http.get("/ovu-park/backstage/backpaymentbill/getMTyte?orderType=2",{params:params}).success(function (resp) {
                    
                    $scope.comType = resp.data.others.concat(resp.data.jdTypes)
                    
                    $scope.search.orderType = 2
                    $scope.search.mType = ''
                }).then(()=>{
                    $scope.find()
                })
            } else {
                $scope.search.orderType = ''
                $scope.search.mType = ''
                $scope.comType = []
                $scope.find()
            }
            
        }

        $scope.findRef = function () {
            $scope.search = {
                parkId: $scope.dept.parkId
            };
            $scope.pageModel = {};
            $scope.selMoneyRange = "";
            $scope.comType = [];
            $scope.search.mType = "";


            $scope.find()

            $("#orderType_3").attr('checked', false)
            $("#orderType_4").attr('checked', false)
            // window.location.reload()
        }


        //查看详情页
        $scope.showDetail = function (data) {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: "/view/operationBill/model/modal.orderInfo.html",
                controller: "orderInfoCtrl",
                resolve: {
                    items: function () {
                        return data;
                    }
                }
            });
            modal.result.then(function () {

            }, function () {

            })
        }

    });
    //查看详情弹出框控制器
    app.controller("orderInfoCtrl", function ($scope, $rootScope, $uibModalInstance, $http, items, fac) {
        $scope.pageModel = items;
        console.log("$scope.pageModel", $scope.pageModel)
        // $scope.time = (new Date()).getTime();
        // $scope.pageModel = {}
        // $scope.search = {
        //     id: $scope.curItem,
        //     parkId: $scope.dept.parkId
        // }


        $scope.save = function () {
            console.log("close")
            $uibModalInstance.close();
        }
        $scope.cancel = function () {
            console.log("cancel")
            $uibModalInstance.dismiss('cancel');
        }
    })

})()
