/**
 * Created by Cx on 2019/4/9.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");

    app.controller('arrangeAuthCtrl', function ($scope, $rootScope, $uibModal, $state, $http, $filter, fac) {
        document.title='OVU-排班导入权限设置';
        $scope.search={};
    
        app.modulePromiss.then(function () {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.deptId = deptId;
                        $scope.find()
                    } else {
                        if($rootScope.pages.active=='/view/checkin/arrangeAuth.html'){
                            alert('请选择跟项目关联的部门');
                        }
                        $scope.search.deptId &&  delete $scope.search.deptId
                       
                      
                    }

                }
            })
            
        })
        
        $scope.find =  () =>{
            $http.post('/ovu-pcos/pcos/arrange/auth/getList', {deptId: $scope.search.deptId}, fac.postConfig).success(function (data) {
               $scope.authList=data.data
            });
        };
       
       
        $scope.del = function (item) {
            confirm("是否删除该权限？", function () {
                $http.post('/ovu-pcos/pcos/arrange/auth/del', {deptId: item.deptId}, fac.postConfig).success(function (data) {
                    if (data.code==0) {
                        msg(data.msg);
                        $scope.find();
                    } else {
                        alert(data.msg);
                    }
                });
            })
        }
        $scope.showModal =(item)=> {
            var copy=item || {}
          copy=angular.extend(copy,{searchDeptId: $scope.search.deptId})
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/checkin/arrangeAuth/modal.arrangeAuth.html',
                controller: 'arrangeAuthModalCtrl',
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
       
    });

    app.controller('arrangeAuthModalCtrl', function ($scope, $rootScope,$http, $uibModal, $uibModalInstance, $timeout, $filter, fac, param) {
     
        $scope.search = param;
        $scope.personList=[];
        $scope.item={};
        $scope.auth={};
        $scope.personIds=param.personIds || ''
        if(fac.isNotEmpty(param.personIds)){
          
            $scope.auth.deptId=param.deptId
            $scope.auth.deptName=param.deptName;
          
            
            param.persons.forEach((v) => {
                $scope.personList.push({user:{id:v.id,userId:v.userId,deptName:v.deptName,name:v.name}})
              
            });
            
         
          }
        function loadDeptTree(){
            if(param.searchDeptId){
                $http.get('/ovu-base/system/dept/tree.do?deptId='+param.searchDeptId).success(function (data) {
                    $scope.searchDeptTree=data;
                });
            }else{
                $scope.searchDeptTree=[];
            }
        }
        loadDeptTree();
       
       
   
        $scope.addPerson=function(){
          $scope.personList.push({user:$scope.item.user})
        }
        $scope.delItem=function(i){
            $scope.personList.splice($scope.personList.indexOf(i), 1);
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
             if($scope.personList.length==0){
                alert('请选择人员')
                return

             }
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            var ids=[];
            $scope.personList.forEach((v) => {
                if(v.user && v.user.id){
                    ids.push(v.user.id+'-'+v.user.deptId)
                }
                
            });
           
         if(isRepeat(ids)){
             alert('人员重复')
             return
         }          
            $http.post('/ovu-pcos/pcos/arrange/auth/save', {personIds:ids.join(','),deptId:$scope.auth.deptId}, fac.postConfig).success(function (data) {
              
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
