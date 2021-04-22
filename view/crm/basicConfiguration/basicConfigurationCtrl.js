(function () {
    var app = angular.module("angularApp");
app.controller('overdueCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {   
    app.modulePromiss.then(function () {
        fac.initPage($scope, function () {
            $scope.find();
        })
    });    
    $scope.find = function (pageNo) {
        $scope.search = {
           
        };
            $http.post("/ovu-crm/backstage/crmConfigSetting/querySetting",{ parkId:app.park.parkId},fac.postConfig ).success(function (resp) {
                if (resp.code == 0) {
                    console.log(resp)
                    resp.data.forEach(ele => {
                        if(ele.code=='OVERDUE_DAY'){
                            $scope.search.overdueDay=parseInt(ele.value)
                            $scope.search.id=ele.id
                        }
                    });
                } else {
                    alert(resp.msg);
                }
            });
    }
    $scope.find()
    // 逾期设置解释说明
    $scope.explain1 = function () {
        layer.alert("1、针对客户设置一定的保护期，如果超过保护期置业顾问还未对客户做跟进，则该客户逾期。逾期客户视作置业顾问跟客的异常情况,可由销售经理重新分配。<br>2、客户的默认下次跟进时间为当前时间 + 相应的保护期。<br>3、新增客户或新增跟进时,逾期保护期天数为客户下次跟进时间，例如，直接设置为10，则所有客户的下次跟进日期从当前日期算起为10天;")
    };
    
    //保存/编辑
    $scope.save=function(item){
        console.log(item,'iddddd')
        item=[{
            code:'OVERDUE_DAY',
            value:$scope.search.overdueDay,
            parkId:app.park.parkId,
            id:item.id
        }]
        $http.post("/ovu-crm/backstage/crmConfigSetting/update",item).success(function (resp) {
            if (resp.code == 0) {
                msg("保存成功！");
                $scope.find();
                $uibModalInstance.close();
                

            } else {
                alert(resp.msg);
            }
        });
    }

});
 //回收
app.controller('recyclingCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    app.modulePromiss.then(function () {
        fac.initPage($scope, function () {
            $scope.find();
        })
    }); 
    $scope.find=function(){
        $scope.search = {
            parkId:app.park.parkId
        }; 
        $http.post("/ovu-crm/backstage/crmConfigSetting/querySetting",$scope.search,fac.postConfig ).success(function (resp) {
            if (resp.code == 0) {
                resp.data.forEach(ele => {
                    if(ele.code=='RECOVERY'){
                        $scope.search.Recycling=ele.value
                        $scope.search.RecyclingId=ele.id
                       
                    }
                    if(ele.code=="RECOVERY_OVERDUE"){
                        $scope.search.recovery_overdue=parseInt(ele.value)
                        $scope.search.recovery_overdueId=ele.id
                      
                    }
                    if(ele.code=="RECOVERY_RECOMMEND"){
                        $scope.search.recovery_distribute=parseInt(ele.value)
                        $scope.search.recovery_distributeId=ele.id
                      
                    }
                    if(ele.code=="RECOVERY_COORDINATION"){
                        $scope.search.recovery_coordination=parseInt(ele.value)
                        $scope.search.recovery_coordinationId=ele.id
                      
                    }
                    if(ele.code=="RECOVERY_INVALID"){
                        $scope.search.recovery_invalid=parseInt(ele.value)
                        $scope.search.recovery_invalidId=ele.id
                      
                    }
                    if(ele.code=="RECOVERY_AUTO_LEAVE"){
                        $scope.search.recovery_leave=parseInt(ele.value)
                        $scope.search.recovery_leaveId=ele.id
                       
                    }
                });
            } else {
                alert(resp.msg);
            }
        });
    }
    $scope.find();
    $scope.Recycling=function(val){
            if(val==0){
            $scope.disabled=true
           
        }else{
            $scope.disabled=false           
        }
       }
   
  
    // 回收设置解释说明
    $scope.explain2 = function () {
        layer.alert("根据案场实际情况设置客户是否需要自动回收：<br>1、客户回收后，将变为公共客户，销售经理可以重新对其分配。<br>2、以逾期回收为例：若设置逾期保护期为N天，则含义为某客户逾期后，再过N+1天后系统才会自动将此客户回收至公共客户（如今天逾期，设置1天，则会在后天回收）;若设置为0,则表示逾期后第二天回收。<br>3、如果所有规则均不勾选，客户将不会自动回收。")
    };
    //保存/编辑
    $scope.save=function(search){
        console.log(search)
        if($scope.search.Recycling==0 || !$scope.search.Recycling){
            item=[
                {
                    id:'RECOVERY',
                    value:0,
                    parkId:app.park.parkId,
                    id:search.RecyclingId
                }
            ]
        }else{
            item=[
                {
                    code:'RECOVERY',
                    value:1,
                    parkId:app.park.parkId,
                    id:search.RecyclingId
                },
                {
                    code:"RECOVERY_OVERDUE",
                    value:$scope.search.recovery_overdue,
                    parkId:app.park.parkId,
                    id:search.recovery_overdueId
                },
                {
                    code:"RECOVERY_RECOMMEND",
                    value:$scope.search.recovery_distribute,
                    parkId:app.park.parkId,
                    id:search.recovery_distributeId
                },
                {
                    code:"RECOVERY_COORDINATION",
                    value:$scope.search.recovery_coordination,
                    parkId:app.park.parkId,
                    id:search.recovery_coordinationId
                },
                {
                    code:"RECOVERY_INVALID",
                    value:$scope.search.recovery_invalid,
                    parkId:app.park.parkId,
                    id:search.recovery_invalidId
                },
                {
                    code:"RECOVERY_AUTO_LEAVE",
                    value:$scope.search.recovery_leave,
                    parkId:app.park.parkId,
                    id:search.recovery_leaveId
                }
            ]
        }
     
        $http.post("/ovu-crm/backstage/crmConfigSetting/update",item).success(function (resp) {
            if (resp.code == 0) {
               
                msg("保存成功！");
                $scope.find();
                $uibModalInstance.close();
                

            } else {
                alert(resp.msg);
            }
        });
    }
});
 //公共客户
 app.controller('publicCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    app.modulePromiss.then(function () {
        fac.initPage($scope, function () {
            $scope.find();
        })
    }); 
    $scope.find=function(){
        $scope.search = {
            parkId:app.park.parkId
        };
        $http.post("/ovu-crm/backstage/crmConfigSetting/querySetting",$scope.search,fac.postConfig ).success(function (resp) {
            if (resp.code == 0) {
               
                resp.data.forEach(ele => {
                    if(ele.code=="PUBLIC"){
                        $scope.search.public=parseInt(ele.value)
                        $scope.search.publicId=ele.id
                    }
                    
                });
            } else {
                alert(resp.msg);
            }
        });
    }
    $scope.find();
    //保存/编辑
    $scope.save=function(search){
      
        if($scope.search.public==0){
            item=[
                {
                    code:"PUBLIC",
                    value:0,
                    parkId:app.park.parkId,
                    id:search.publicId
                }
            ]
        }else{
            item=[
                {
                    code:"PUBLIC",
                    value:1,
                    parkId:app.park.parkId,
                    id:search.publicId
                }
            ]
        }
       
        $http.post("/ovu-crm/backstage/crmConfigSetting/update",item).success(function (resp) {
            if (resp.code == 0) {
              
                msg("保存成功！");
                $scope.find();
                $uibModalInstance.close();               
            } else {
                alert(resp.msg);
            }
        });
    }
   
});
 //权限设置
 app.controller('permissionsCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    app.modulePromiss.then(function () {
        fac.initPage($scope, function () {
            $scope.find();
        })
    }); 
    $scope.find=function(){
        $scope.search = {
            parkId:app.park.parkId
        };
        $http.post("/ovu-crm/backstage/crmConfigSetting/querySetting",$scope.search,fac.postConfig ).success(function (resp) {
            if (resp.code == 0) {
              
                resp.data.forEach(ele => {
                    if(ele.code=='AUTHORIZATION_MARKETCONTROL'){
                        $scope.search.jurisdiction_control=parseInt(ele.value)
                        $scope.search.jurisdiction_controlId=ele.id
                     
                    }
                    if(ele.code=='NOAUTHORITY_SEE'){
                        $scope.search.jurisdiction_view_deal=parseInt(ele.value)
                        $scope.search.jurisdiction_view_dealId=ele.id
                    }
                    if(ele.code=='NOAUTHORITY_UPDATE'){
                        $scope.search.jurisdiction_modify_phone=parseInt(ele.value)
                        $scope.search.jurisdiction_modify_phoneId=ele.id
                    }
                    
                });
            } else {
                alert(resp.msg);
            }
        });
    }
    $scope.find();
    //保存/编辑
    $scope.save=function(search){
    
       
            item=[
                {
                    code:'AUTHORIZATION_MARKETCONTROL',
                    value:$scope.search.jurisdiction_control,
                    parkId:app.park.parkId,
                    id:search.jurisdiction_controlId
                },
                {
                    code:'NOAUTHORITY_SEE',
                    value:$scope.search.jurisdiction_view_deal,
                    parkId:app.park.parkId,
                    id:search.jurisdiction_view_dealId
                },
                {
                    code:'NOAUTHORITY_UPDATE',
                    value:$scope.search.jurisdiction_modify_phone,
                    parkId:app.park.parkId,
                    id:search.jurisdiction_modify_phoneId
                },
            ]
      
        $http.post("/ovu-crm/backstage/crmConfigSetting/update",item).success(function (resp) {
            if (resp.code == 0) {
               
                msg("保存成功！");
                $scope.find();
                $uibModalInstance.close();               
            } else {
                alert(resp.msg);
            }
        });
    }
});
 //待办事项配置
 app.controller('todoCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
    
    // 今日待回访解释说明
    $scope.explain3 = function () {
        layer.alert("今日待回访【最近一次跟进客户时选择的下次跟进日期<=今天】的未成交客户为今日待回访的客户")
    };
    // 逾期未跟进解释说明
    $scope.explain4 = function () {
        layer.alert("逾期未跟进：已截止到下次跟进时间还未跟进，在逾期保护天数内的未成交客户")
    };
    // 新分配客户解释说明
    $scope.explain5 = function () {
        layer.alert("新分配：销售经理、团队经理刚分配给置业顾问的客户")
    };
    // // 新推荐客户解释说明
    // $scope.explain6 = function () {
    //     layer.alert("今日待回访【最近一次跟进客户时选择的下次跟进日期<=今天】的未成交客户为今日待回访的客户")
    // };
    // // 新协同客户解释说明
    // $scope.explain7 = function () {
    //     layer.alert("今日待回访【最近一次跟进客户时选择的下次跟进日期<=今天】的未成交客户为今日待回访的客户")
    // };
    // 逾期未签约解释说明
    $scope.explain8 = function () {
        layer.alert("逾期未签约：超过认购失效日期还未签约的客户（从销售系统中获取认购失效日信息）")
    };
    // 逾期未交款解释说明
    $scope.explain9 = function () {
        layer.alert("逾期未交款：超过应收时间还未缴清贷款类和非贷款类房款的客户（从销售系统中获取应收时间信息）")
    };
});
})()
