/**
 * Created by Administrator on 2017/7/20.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('setPwdCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        $scope.search = {
            isClosed: 2,
            operateType: 1
        }
        $scope.pageModel = {};
        $scope.isShow = true;
        $scope.item = {};
        // app.modulePromiss.then(function() {
        //     $scope.$watch('dept.id', function (deptId, oldValue) {
        //         if (deptId && $scope.$parent.search.curTab == 'PWD') {
        //             // $scope.find(1);
        //         }
        //     })
        // })

        $scope.save = function (form) {
            if(!$scope.item.repeatPwd){
               alert('请输入密码')
               return
            }
           
            $http.post("/ovu-energy/energy/config/edit", {
                'type': $scope.item.type || 'operation_password',
                'value': $scope.item.repeatPwd
            }).success(function (data) {
                if (data.code == 0) {
                    $scope.dataList = data.data;
                    msg(data.msg);
                    $scope.item.repeatPwd=null;
                    $scope.item.passType=false

                    $http.get("/ovu-energy/energy/config/get").success((data) => {
                      
                        $scope.item.password = data.data[0].value;
                        $scope.item.type = data.data[0].type
                    })
                   
                } else {
                    alert(data.msg)
                }
            })
        }
       
        $scope.$on("PWD", function (event, data) {
            $scope.item.password = data.value;
            $scope.item.type = data.type

        });
    });
    app.controller('setBanlanceCtl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        $scope.priceList = [];
        $scope.item = {};
        $scope.item.setPrice=0;
        var type
        
        //添加余额
        $scope.addList = function () {
            var priceList=[]
            $scope.priceList.forEach((v) => {
                priceList.push(v.price-0)
            })
         
          if(priceList.indexOf($scope.item.setPrice)!==-1){
            alert('请勿添加重复值');
             return
          }
            if ($scope.priceList.length >= 5) {
                alert('最多只能设置5个报警余额');
                return
            }
            $scope.priceList.push({
                price: $scope.item.setPrice
            });
            $scope.item.setPrice = 0
           
        }
        //删除余额
        $scope.delSelected = function (item) {
            var index = $scope.priceList.findIndex((v) => {
                return v == item

            });
            $scope.priceList.splice(index, 1)

        }

        $scope.save = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            var list = []
             $scope.priceList.forEach((v) => {
                list.push(v.price)
            })
            $http.post("/ovu-energy/energy/config/edit", {
                'type': $scope.item.type || 'balance_threshold',
                'value': list.join(',')
            }).success(function (data) {
                if (data.code == 0) {
                    msg(data.msg);
                    $('#balance')[0].reset();
                    $scope.priceList=[];
                    $http.get("/ovu-energy/energy/config/get").success((data) => {

                        var arr = data.data[1].value && data.data[1].value.split(',') || [];
                        arr && arr.forEach((v) => {
                            $scope.priceList.push({
                                price: v
                            })
                        });
                        $scope.item.type = data.type
                    })
                    $scope.item.setPrice = 0
                } else {
                    alert(data.msg)
                }
            })
        }
        $scope.$on("Money", function (event, data) {
            $scope.priceList=[];
            var arr = data.value && data.value.split(',') || [];
            arr && arr.forEach((v) => {
                $scope.priceList.push({
                    price: v
                })
            });
            $scope.item.type = data.type
        });
    });


    app.controller('paramSetCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-能源参数设置";
        $scope.isLogin = false;
        $scope.search = {};
        $scope.infoList = [];
        var modal = $uibModal.open({
            animation: false,
            templateUrl: 'energy/modal.setPwd.html',
            size: 'md',
            controller: 'showPwdModalCtrl',
        });
        modal.result.then(function () {
            $scope.isLogin = true;
            $scope.isMoney=true
            $scope.$broadcast($scope.search.curTab, $scope.infoList);
            $scope.isShow = false;
        }, function () {
            console.info('Modal dismissed at: ' + new Date());
        });


        $scope.setCurTab = function (tab) {
            if ($scope.search.curTab != tab) {
                $scope.search.curTab = tab;
                $http.get("/ovu-energy/energy/config/get").success(function (data) {
                    if (data.code == 0) {
                        $scope.dataList = data.data;

                        if ($scope.search.curTab == 'PWD') {
                            $scope.infoList = $scope.dataList[0]
                        } else {
                            $scope.infoList = $scope.dataList[1]
                        }

                    }
                    $scope.$broadcast($scope.search.curTab, $scope.infoList);
                })


            }
        };
        //进入页面调取接口获取密码和余额信息


    });

    //输入密码
    app.controller('showPwdModalCtrl', function ($scope, $uibModalInstance, $http, fac) {
        //进入页面验证密码

        $(document).bind("keydown keypress", function (event) {
            if(event.which === 13) {
                if(!$scope.item.password){
                    alert('请输入密码')
                    return
                 }
                $http.get("/ovu-energy/energy/config/enter/" + $scope.item.password).success(function (data) {
                    if (data.code == 0) {
                        $uibModalInstance.close();
    
                    } else {
                        alert(data.msg)
                    }
                })
            }
        });
        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            $http.get("/ovu-energy/energy/config/enter/" + $scope.item.password).success(function (data) {
                if (data.code == 0) {
                    $uibModalInstance.close();

                } else {
                    alert(data.msg)
                }
            })
        };
        $scope.cancel=function(){
            $uibModalInstance.dismiss('cancel');
         
          
        }


    });

})();
