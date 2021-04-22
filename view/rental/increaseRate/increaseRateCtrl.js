(function() {
    var app = angular.module("angularApp");
    app.controller('increaseRateCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {		
    	document.title = "OVU-递增率管理";
    	// 递增率列表
        $scope.find = function(){
            var search = {"parkId":app.park.parkId}
            $http.post("/ovu-park/backstage/rental/increaseRate/listAll",search,fac.postConfig).success(function(resp){
                if(resp.code==0){
                    $scope.list = resp.data;
                }else{
                    window.alert(resp.message);
                }
            });
        }
         // 新增、编辑费项 - 模态创
        $scope.editModal = function(item){
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/rental/increaseRate/modal.edit.html',
                controller: 'increaseRateEditCtrl',
                resolve:{increaseItem:item}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                // $scope.find();
            });
        }
        
        app.modulePromiss.then(function() {
            fac.initPage($scope,function(){
                $scope.find();
            })
        });
    });	 
    // 新增/编辑递增率 模态创
    app.controller('increaseRateEditCtrl', function ($scope, $rootScope, $http, $filter, $uibModalInstance, fac,increaseItem) {		
        // 年限
        $scope.item = increaseItem;
        $scope.editInc = increaseItem?true:false;
        if($scope.item){
            $scope.eidt = {
                parkId:app.park.parkId,
                increaseRate:$scope.item.increaseRate,
                code:$scope.item.code,
                id:$scope.item.id,
                name:$scope.item.name,
            }
        }else{
            $scope.eidt = {
                parkId:app.park.parkId,
            }
        }
        $scope.years= [
            {text:"一年",value:"1"},
            {text:"两年",value:"2"},
            {text:"三年",value:"3"},
            {text:"四年",value:"4"},
            {text:"五年",value:"5"}
        ] 
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        // 保存
        $scope.save = function(form){
            if(!form.$valid) {
                window.alert('请正确填写并完成所有必填项！');
                return false;
            }  
            if($scope.item&&$scope.item.increaseRate===$scope.eidt.increaseRate){
                $scope.cancel();
                return;
            }
            angular.forEach($scope.years,function(data,index,array){
                if(data.value === $scope.eidt.code){
                    $scope.eidt.name = data.text
                }
            })
            $http.post("/ovu-park/backstage/rental/increaseRate/saveOrEdit",$scope.eidt,fac.postConfig).success(function(resp){
                if(resp.code==0){
                    $scope.list = resp.data;
                    window.msg("保存成功");
                    $uibModalInstance.close();
                }else{
                    window.alert(resp.message);
                }
                
            });
        }
    });	
})()
