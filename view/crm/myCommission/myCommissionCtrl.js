(function () {
    var app = angular.module("angularApp");
    app.controller('myCommissionCtrl', function ($rootScope,$scope, $http,  $filter,$uibModal, fac,$compile) {
        console.log('ppppp')
        $scope.search={}
        $scope.search.type=0//单选按钮
        //面积
        $scope.addN=1
        $scope.addNList=['a']
        $scope.search.area1=[]//面积1
        $scope.search.area2=[]//面积2
        $scope.search.areaCommission=[]//佣金
        //成交额
        $scope.volumeAddN=1
        $scope.volumeAddNList=['a']
        $scope.search.volume1=[]//面积1
        $scope.search.volume2=[]//面积2
        $scope.search.VolumeCommission=[]//佣金
        //页面信息list
        $scope.contentList=[]
        //面积 点击添加,删除操作
        $scope.areaAdd=function(){
            $scope.addN++
            $scope.addNList=[]
            for(var i=0;i<$scope.addN;i++){
                $scope.addNList.push(i)
            }
            console.log('nnnnnnnnnnnn',$scope.addNList)
            
        }
          $scope.volumeAdd=function(){
            $scope.volumeAddN++
            $scope.volumeAddNList=[]
            for(var i=0;i<$scope.volumeAddN;i++){
                $scope.volumeAddNList.push(i)
            } 
        }
        //删除
        $scope.areaDel=function(n){
            $scope.addN--
            $scope.addNList=[]
            for(var i=0;i<$scope.addN;i++){
                $scope.addNList.push(i)
            }
            $scope.search.area1.pop()
            $scope.search.area2.pop()
            $scope.search.areaCommission.pop()
        }
        $scope.volumeDel=function(n){
            $scope.volumeAddN--
            $scope.volumeAddNList=[]
            for(var i=0;i<$scope.volumeAddN;i++){
                $scope.volumeAddNList.push(i)
            }
            $scope.search.volume1.pop()
            $scope.search.volume2.pop()
            $scope.search.volumeCommission.pop()
        }
        $scope.areaInputBlur1=function(n){
            if((!$scope.search.area2[n-1]||!$scope.search.area1[n-1])&&n!=0){
                window.alert('请按顺序填写')
                $scope.search.area1[n]=''
            }
        }
        $scope.volumeInputBlur1=function(n){
            console.log('aaaaaaaaaaaaa',$scope.search.volume1,$scope.search.volume2)
            if((!$scope.search.volume2[n-1]||!$scope.search.volume1[n-1])&&n!=0){
                window.alert('请按顺序填写')
                $scope.search.volume1[n]=''
            }
        }
        $scope.areaInputBlur2=function(n){
            console.log('bbbbbbbbbb',$scope.search.volume1,$scope.search.volume2)
            if((!$scope.search.area2[n-1]||!$scope.search.area1[n-1])&&n!=0){
                window.alert('请按顺序填写')
                $scope.search.area2[n]=''
                return 
            }
            if($scope.search.area2[n]&&$scope.search.area1[n]){
                if($scope.search.area1[n]>=$scope.search.area2[n]){
                    window.alert('请输入合理的范围')
                    $scope.search.area2[n]=''
                }else if($scope.search.area1[n]<$scope.search.area2[n-1]){
                    window.alert(`面积范围中${$scope.search.area1[n-1]}~${$scope.search.area2[n-1]}和${$scope.search.area1[n]}~${$scope.search.area2[n]}范围冲突`)
                    $scope.search.area1[n]=$scope.search.area2[n]=''
                }
            }
        } 
        $scope.volumeInputBlur2=function(n){
            console.log('bbbbbbbbbb',$scope.search.volume1,$scope.search.volume2)
            if((!$scope.search.volume2[n-1]||!$scope.search.volume1[n-1])&&n!=0){
                window.alert('请按顺序填写')
                $scope.search.volume2[n]=''
                return 
            }
            if($scope.search.volume2[n]&&$scope.search.volume1[n]){
                if($scope.search.volume1[n]>=$scope.search.volume2[n]){
                    window.alert('请输入合理的范围')
                    $scope.search.volume2[n]=''
                }else if($scope.search.volume1[n]<$scope.search.volume2[n-1]){
                    window.alert(`面积范围中${$scope.search.volume1[n-1]}~${$scope.search.volume2[n-1]}和${$scope.search.volume1[n]}~${$scope.search.volume2[n]}范围冲突`)
                    $scope.search.volume1[n]=$scope.search.volume2[n]=''
                }
            }
        }   
        //选择园区
        $scope.$watch('project.id', function (projectId, oldValue) {
            if (projectId) {
                $scope.search={}
                $scope.search.type=''
                $scope.addN=1
                $scope.addNList=['a']
                $scope.search.area1=[]//面积1
                $scope.search.area2=[]//面积2
                $scope.search.areaCommission=[]//佣金
                $scope.volumeAddN=1
                $scope.volumeAddNList=['a']
                $scope.search.volume1=[]//面积1
                $scope.search.volume2=[]//面积2
                $scope.search.VolumeCommission=[]//佣金
                //佣金查询
                $http.get(`/ovu-crm/backstage/crmCommissionSetting/select?parkId=${$rootScope.project.parkId}`).success(function(resp){
                    if(resp.code == 0){
                        $scope.contentList=resp.data
                        $scope.search.type=$scope.contentList[0].type
                        if($scope.search.type==1){//固定用金比 
                            $scope.search.commissionRatio=$scope.contentList[0].commissionRatio
                        }else if($scope.search.type==2){//面积
                            for(var i=1;i<$scope.contentList.length;i++){
                                $scope.addN++
                                $scope.addNList.push(i)
                            }
                            $scope.contentList.forEach((item,index)=>{
                                $scope.search.area1[index]=item.start
                                $scope.search.area2[index]=item.end
                                $scope.search.areaCommission[index]=item.commissionRatio
                            })
                        }else if($scope.search.type==3){//成交额
                            for(var i=1;i<$scope.contentList.length;i++){
                                $scope.volumeAddN++
                                $scope.volumeAddNList.push(i)
                            }
                            $scope.contentList.forEach((item,index)=>{
                                $scope.search.volume1[index]=item.start
                                $scope.search.volume2[index]=item.end
                                $scope.search.volumeCommission[index]=item.commissionRatio
                            })
                        }
                    }else{
                        
                    }
                });
            }
        })
        //保存
        $scope.save=function(){
            let saveParams={}
            let settingsList=[]
            saveParams.parkId=$rootScope.project.parkId
            saveParams.type=$scope.search.type
            if($scope.search.type==1){
                settingsList=[{'commissionRatio':$scope.search.commissionRatio}]
                saveParams.settings=JSON.stringify(settingsList)
            }else if($scope.search.type==2){
                console.log("oooooo",$scope.search.area1)
                $scope.search.area1.forEach((item,index)=>{
                    settingsList.push({'start':item,'end':$scope.search.area2[index],'commissionRatio':$scope.search.areaCommission[index]})
                })
                saveParams.settings=JSON.stringify(settingsList)
            }else if($scope.search.type==3){
                debugger
                console.log('pppppppp',$scope.search.volume1)
                $scope.search.volume1.forEach((item,index)=>{
                    settingsList.push({'start':item,'end':$scope.search.volume2[index],'commissionRatio':$scope.search.volumeCommission[index]})
                })
                saveParams.settings=JSON.stringify(settingsList)
            }
            console.log('传的参数',saveParams)
            $.post(`/ovu-crm/backstage/crmCommissionSetting/save`,saveParams).success(function(resp){
                if(resp.code == 0){
                    window.msg('保存成功')
                }else{
                    window.alert(resp.msg)
                }
            });
        }
        
       
    });
})()