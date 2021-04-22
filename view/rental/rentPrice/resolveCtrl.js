/*  1、前端计算  标准 > 计划 ；
    2、待分解和无需分解              
*/
                
(function() {
    var app = angular.module("angularApp");
    app.controller('rentResolveCtrl', function ($scope, $rootScope, $http, $uibModal,$location, fac,$timeout,$window) {		
        var pageParams = $rootScope.pages.params;
        var curPage;
        setTimeout(function () {
            curPage = $rootScope.getCurTabPage($rootScope.pages.active, $rootScope.pages);
        }) 
        $scope.itemId = pageParams.id;
        $scope.params = {
            'id': pageParams.id,
            'stageId': pageParams.stageId
        }
        $scope.editStatus = pageParams.status===0?false:true;
        $scope.rentalHousesMsg=[];
        $scope.houseList = [];
        $scope.$watch('window.innerWidth', function () {
            $scope.width = $window.innerWidth - 230;
            $scope.width = {
                "width": $window.innerWidth - 290
            }
        });
        // 获取房屋列表
        $http.post("/ovu-park/backstage/rental/project/getHousesByStageId",$scope.params,fac.postConfig).success(function(resp){
            if(resp.code==0){
                $scope.rentalHousesMsg = resp.data;
                console.log(resp)
                // 当前tab页
                $scope.currentBulid = $scope.rentalHousesMsg.floorList[0];
                //房屋列表数据结构
                $scope.houseList = $scope.rentalHousesMsg.houseList;
                console.log($scope.houseList);
                // 检查房屋是否控制
                var voidHouse = false;
                $scope.selectTotle();
            }else{
                window.alert(resp.message);
            }
        });
        // 切换楼栋
        $scope.selBuliding = function(x){
            $scope.currentBulid = x;
        }
        // 保存单个房屋租金定价
        $scope.timer = null;
        $scope.saveHousePrice = function(house,houseId,rentalPrice,area){
            $timeout.cancel($scope.timer);
            $scope.timer = $timeout(function(){
                if (!area){
                    window.alert("空间面积为空，无法定价，请联系管理员完善空间面积");
                    return;
                }
                if(rentalPrice){
                    house.requiredFlag = false;
                    var cache = area*rentalPrice*12/10000;
                    var params = {
                        projectId:$scope.itemId,
                        houseId:houseId,
                        rentalPrice:rentalPrice.toFixed(2),
                        totalPrice:cache.toFixed(2),
                        updatorId:app.user.personId
                    }
                    $http.post("/ovu-park/backstage/rental/projectHouse/saveOneHouseRent",params,fac.postConfig).success(function(resp){
                        if(resp.code==0){
                            window.msg("定价成功！");
                            $scope.selectTotle();
                        }else{
                            window.alert(resp.message);
                        }
                    });
                }else{
                    house.requiredFlag = true;
                    window.alert("租金单价为最多两位小数的正数，请重新填写！");
                }
            },800);
        }
        // 保存全部 status 0:保存待提交，1：提交待审批
        $scope.saveAll = function(status){
            if(status===1 && $scope.rentalHousesMsg.project.plannedAnnualRent > $scope.actualRentalPrice){
                window.alert("您的标准年租金小于计划年租金，无法进行提交，请重新分解");
                return false;
            }
            // 重组房屋  待分解  的 标准年租金 
            var actualRents = [];
            angular.forEach($scope.houseList,function(value1,key1){
                angular.forEach(value1,function(value2,key2){
                    angular.forEach(value2,function(value3,key3){
                        if($scope.itemId==value3.validProjectId){
                            var price = value3.area*value3.validRentPrice/10000*12;
                            if(value3.validRentPrice){
                                actualRents.push(price.toFixed(2));
                            }
                        }
                    })
                })
            })
            var params = {
                actualRents:actualRents.join(","),
                id:pageParams.id,
                updatorId:app.user.personId,
                status:status,
            }
            $http.post("/ovu-park/backstage/rental/project/saveStageHousesRent",params,fac.postConfig).success(function(resp){
                if(resp.code==0){
                    window.msg(status?"成功提交":"保存成功");
                    $location.url('/rental/rentPrice/rentPrice')
                }else{
                    window.alert(resp.message);
                }
            });
        };
        // 返回
        $scope.back = function(){
            $scope.$emit("needToClose", curPage);
        }
        // 计算标准年租金标准年租金
        $scope.selectTotle = function(){
            $scope.actualRentalPrice = 0;
            angular.forEach($scope.houseList,function(value1,key1){
                angular.forEach(value1,function(value2,key2){
                    angular.forEach(value2,function(value3,key3){
                        if($scope.itemId==value3.validProjectId&&value3.area){
                            var p = (value3.area*value3.validRentPrice*12/10000).toFixed(2);
                            $scope.actualRentalPrice = parseFloat($scope.actualRentalPrice+parseFloat(p));
                        }
                    });
                });
            })
            $scope.actualRentalPrice = $scope.actualRentalPrice.toFixed(2);
        }
        app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
            	
            });
        });
    });	
})()
