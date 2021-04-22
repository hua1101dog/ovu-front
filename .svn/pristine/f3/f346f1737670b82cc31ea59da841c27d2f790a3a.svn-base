 (function () {
    var app = angular.module("angularApp");
    //企业
    app.controller('materialApplyCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-物资管理";
        angular.extend($rootScope, fac.dicts);
        $scope.search = {
            status:'',
            startDate: moment().format('YYYY-MM-DD'),
            endDate:'' ,
        };
        $scope.pageModel = {};
        function isInteger(obj) {
            return obj%1 === 0
        }

         // 查询列表
         $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-park/backstage/nCov/goodsApply/page", $scope.search, function (data) {
                $scope.pageModel = data;
                let num=0
                $scope.pageModel.data&&$scope.pageModel.data.forEach( item=> {
                    var totalPrice=0;
                    item.indexNum=num
                    item.goodsList&&item.goodsList.forEach( good=> {
                        totalPrice=totalPrice+parseFloat(good.unitPrice)*parseInt(good.amount)
                    })
                    num++
                    item.totalPrice=isInteger(totalPrice)?totalPrice:(totalPrice).toFixed(1)
                });
            });
        }

        $scope.query = function () {
            if(!fac.checkPark($scope)){
        		return
        	}else{
        		$scope.find(1);
        	}
        };
        $scope.linkto= function (item) {
            if(item.status==1){
                return 
            }
            confirm("确认联系吗?", function () {
                $http.post('/ovu-park/backstage/nCov/goodsApply/status', { id: item.id,status:1 }, fac.postConfig).success(function(res) {
                    if (res.code==0) {
                        msg(res.msg);
                        $scope.find(1);
                    } else {
                        alert(res.msg);
                    }
                });
            })    
        };
         // 页面初始化
         app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find(1);
            })
        });
    });

     //员工
     app.controller('materialSetCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-物资管理";
        $scope.search = {};
        $scope.pageModel = {};
         // 查询列表
         $scope.find = function () {
            $http.post('/ovu-park/backstage/nCov/goodsstock/list',$scope.search, fac.postConfig).success(function(res) {
                if (res.code==0) {
                    $scope.pageModel = res.data;
                } else {
                    alert(res.msg);
                }
            });
        }
        $scope.saveSet = function () {
            var isTrue=true
            $scope.pageModel&&$scope.pageModel.forEach(el=>{
                if(el.amount==undefined||el.amount<0||el.purchaseQuota==undefined||el.purchaseQuota<0){
                    alert("库存管理和购买限额不能为空并且不能小于0！");
                    isTrue=false
                    return;
                }
                
            })
            if(!isTrue){
                return
            }
            $http.post('/ovu-park/backstage/nCov/goodsstock/save', { goodsStockList: $scope.pageModel }).success(function(res) {
                if (res.code==0) {
                    msg(res.msg);
                    $scope.find();
                } else {
                    alert(res.msg);
                }
            });
        }

        $scope.query = function () {
            if(!fac.checkPark($scope)){
        		return
        	}else{
        		$scope.find();
        	}
        };

         // 页面初始化
         app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find();
            })
        });
    });
    app.directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    });
})()
