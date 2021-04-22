/**
 * Created by Cx on 2019/4/9.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");  
    
    app.controller('arrangeRuleCtrl', function ($scope, $rootScope, $uibModal, $state, $http, $filter, fac) {
        document.title='OVU-排班规则设置';
        $scope.search={};
    
        app.modulePromiss.then(function () {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.deptId = deptId;
                        $scope.find()
                    } else {
                        if($rootScope.pages.active=='/view/checkin/arrangeRule.html'){
                            alert('请选择跟项目关联的部门');
                        }
                       
                        $scope.search.deptId &&  delete $scope.search.deptId
                       
                      
                    }

                }
            })
            
        })
        
        
        $scope.find =  () =>{
            $http.post('/ovu-pcos/pcos/arrange/rule/list', {deptId: $scope.search.deptId}, fac.postConfig).success(function (data) {
               $scope.classList=data.data
            });
        };
       
       
        $scope.del = function (item,deptId) {
            confirm("是否删除该规则？", function () {
                $http.post('/ovu-pcos/pcos/arrange/rule/del', {deptId: deptId,groupId:item.groupId}, fac.postConfig).success(function (data) {
                    if (data.code==0) {
                        msg(data.msg);
                        $scope.find();
                    } else {
                        alert(data.msg);
                    }
                });
            })
        }
        $scope.showModal =(s,item)=> {
            var copy=s || {};
            var param={}
            if(item){
                param={deptId:item.deptId,deptName:item.deptName}
            }
          copy=angular.extend(copy,{searchDeptId: $scope.search.deptId},param)
         
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/checkin/arrangeRule/modal.arrangeRule.html',
                controller: 'arrangeRuleModalCtrl',
                resolve: {
                    param: copy
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
           
        };
        //启用 && 禁用
        $scope.enable=(s,item)=>{
            var flag='';
            var url=''
            if(s.enable){
                flag='禁用';
                url='/ovu-pcos/pcos/arrange/rule/disenable'
            }else{
                flag='启用'
                url='/ovu-pcos/pcos/arrange/rule/enable'
            }
            var str='是否'+flag+'该规则？'
            confirm(str, function () {
                $http.post(url, {deptId: item.deptId,groupId:s.groupId}, fac.postConfig).success(function (data) {
                    if (data.code==0) {
                        msg(data.msg);
                        $scope.find();
                    } else {
                        alert(data.msg);
                    }
                });
            })
        }
       
    });

    app.controller('arrangeRuleModalCtrl', function ($scope, $rootScope,$http, $uibModal, $uibModalInstance, $timeout, $filter, fac, param) {
        
        $scope.search = param;
        $scope.classesList=[];
        $scope.item=param || {};
        $scope.auth={};
         $scope.setValue=function(target){
           console.log(target)
         }
        if(fac.isNotEmpty(param.groupId)){
            $scope.auth.deptId=param.deptId
            $scope.auth.deptName=param.deptName;
            var arr=generateBig();
             for(var i in param){
                 if(arr.indexOf(i)>-1){
                     var timeFrom=param[i].split('-')[0];
                     var timeTo=param[i].split('-')[1]
                     $scope.classesList.push({timeFrom:timeFrom,timeTo:timeTo,scheduleName:i})
                 }
             }
           $scope.classesList.forEach(item=>{
                let id=arr.indexOf(item.scheduleName);
                item.sortId=id
             })  
             $scope.classesList.sort(function(x,y) {return x.sortId - y.sortId});
               
          }
          //获取26个大写字母
          function generateBig(){
            var ch_big = 'A';
            var str_big = '';
            for(var i=0;i<26;i++){
                str_big += String.fromCharCode(ch_big.charCodeAt(0)+i)+'班'+',';
            }
            return str_big.slice(0,str_big.length-1);
        }
        function loadDeptTree(){
            if(param.searchDeptId){
                $http.get('/ovu-base/system/dept/tree.do?deptId='+param.searchDeptId).success(function (data) {
                    $scope.searchDeptTree=[]
                    data[0] && data[0].nodes && data[0].nodes.forEach(function(v){
                        $scope.searchDeptTree.push(v);
                        v.nodes && delete v.nodes

                    })
                    if(!data[0].nodes){
                        $scope.searchDeptTree.push(data[0]);
                    }
                   
                    
                    
                });
            }else{
                $scope.searchDeptTree=[];
            }
        }
        loadDeptTree();
       
      
        var arr=generateBig().split(',');
        $scope.addClasses=function(){
            if($scope.classesList.length>25){
                alert('最多可设置26个班次')
               return
            }
         
          $scope.classesList.push({timeFrom:'',timeTo:'',scheduleName:arr[$scope.classesList.length]})
        }
        $scope.delItem=function(i){
            $scope.classesList.splice($scope.classesList.indexOf(i), 1);
            $scope.classesList.forEach(function(v,i){
              v.scheduleName=arr[i]
            })
          
        }
        //判断是否有重复值
        function isRepeat(arr){
            var hash = {};
            
            for(var i in arr) {
            
            if(hash[arr[i]]) //hash 哈希
            
            return true;
            
            hash[arr[i]] = true;
            
            }
            
            return false;
            
            }
        $scope.save = function (form) {
            
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            
            
            $http.post('/ovu-pcos/pcos/arrange/rule/save', {deptId:$scope.auth.deptId,classes:$scope.classesList,groupId:param.groupId}).success(function (data) {
                if (data.code==0) {
                    msg(data.msg);
                    $uibModalInstance.close();
                }
                else {
                    alert(data.msg);
                }
            })
        }
        $scope.cancel = function () {
        
            $uibModalInstance.close();
        };

    });
})();
