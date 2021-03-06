/**
 * Created by Cx on 2019/4/9.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");

    app.controller('holidaySettingCtrl', function ($scope, $rootScope, $uibModal, $state, $http, $filter, fac) {
        document.title = 'OVU-排班计划';
        $scope.search = {jobStatus:'1'};
        $scope.selected={}
        $scope.maxDay=moment().format('YYYY-MM-DD') //最大值
        $scope.minDay=moment().subtract(1, "months").format('YYYY-MM-DD') //最小值
        // $scope.minDay='2020-04-28'
        // console.log( $scope.minDay)
        $scope.arrangeMonth= $scope.minDay + ' - '+ moment().format('YYYY-MM-DD');

        
        $scope.weekList=[]
        $scope.pageModel = {};
        $scope.auth = {}

        app.modulePromiss.then(function () {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.deptId = deptId;
                        loadDeptTree()                       
                    } else {
                        if($rootScope.pages.active=='/view/checkin/importPlan.html'){
                            alert('请选择跟项目关联的部门');
                        }
                        $scope.deptId && delete $scope.deptId


                    }

                }
            })

        })
        $scope.$watch('selected.value', function (newV, oldV) {
            if (newV) {
               if(newV.length>0){
                $scope.search.personId = $scope.selected.value.reduce(function (ret, n) {
                    ret.push(n.id);
                    return ret;
                }, []).join(',');
               }else{
                $scope.search.personId &&  delete $scope.search.personId
               }
            }
        })
        $scope.changeStatu=function(value){
            if(value){
                $scope.search.jobStatus && delete $scope.search.jobStatus
            }else{
                $scope.search.jobStatus='1'
            }
            $scope.find(1)
        }
        function getAuth(deptId){
            
            $http.get('/ovu-pcos/pcos/arrange/auth/getAuthPersonIds?deptId=' + deptId).success(function (resp) {
               $scope.isAuth=resp.data
            });
            var param = {};
            $.extend(param, {
                currentPage: 1,
                pageSize: 10000000,
                deptId: deptId,
               
            });
            fac.getPageResult(
                "/ovu-base/pcos/person/findPerson_mute.do",
                param,
                function (data) {
                    $scope.personListBlock = data.data;
                }
            );
            //获取该部门下的人员
            
        }  
        $scope.getAuth=function(search,node){
            if(!node){
             
               return
            }
            $scope.search.deptId=node.id
            getAuth(node.id)
          
           
        }
      

        function loadDeptTree() {
            if ($scope.deptId) {
                $http.get('/ovu-base/system/dept/tree.do?deptId=' + $scope.deptId).success(function (data) {
                    $scope.searchDeptTree=[]
                    data[0] && data[0].nodes && data[0].nodes.forEach(function(v){
                        $scope.searchDeptTree.push(v);
                        // v.nodes && delete v.nodes

                    })
                    if(!data[0].nodes){
                        $scope.searchDeptTree.push(data[0]);
                    }
                    $scope.auth.deptId= $scope.searchDeptTree[0].id;
                    $scope.auth.deptName=$scope.searchDeptTree[0].deptName
                    $scope.find(1);
                    $scope.getAuth($scope.auth,$scope.searchDeptTree[0])
                });
            } else {
                $scope.searchDeptTree = [];
            }
        }
        $scope.choosePerson = function () {
            loadPerson($scope.auth.deptId)
        }

        function loadPerson(dept) {
            if (dept) {
                $http.get('/ovu-pcos/pcos/arrange/auth/getAuthPersonIds?deptId=' + dept).success(function (data) {
                    $scope.personList = data;
                   
                });
            } else {
                $scope.personList = [];
            }
        }
      
        $scope.find = (pageNo) => {
            if($scope.arrangeMonth){
                var date=$scope.arrangeMonth
               var dateArr= date.split(' - ')
               $scope.search.arrangeDateFrom=dateArr[0]
               $scope.search.arrangeDateTo=dateArr[1]
                
             var num=$rootScope.datedifference($scope.search.arrangeDateFrom,$scope.search.arrangeDateTo) //开始值和结束值相差的天数
             if(num>31){
                 alert('开始日期和结束日期相差不得大于31天')
                 return

             }
            }
            $scope.search.deptId=$scope.auth.deptId;
            getAuth($scope.search.deptId)
            if(!$scope.search.deptId){
               alert('请选择部门')
               return
            }
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
           
            $scope.search.pageIndex = $scope.search.currentPage && $scope.search.currentPage - 1;
            $http.post('/ovu-pcos/pcos/arrange/plan/list', $scope.search, fac.postConfig).success(function (data, status, headers, config) {
                if (angular.isString(data)) {
                    //返回的是页面，直接显示登录页面
                    location.href = "/login.html";
                    return;
                }
                if (!isNaN(data.code)) {
                    //zg 后台返回值，code为0表示成功，-1失败
                    //if (data.code == 1) {
                    if (data.code == 0) {
                        data = data.data;
                    } else {
                        alert("获取列表异常" );
                        return;
                    }
                }
                $scope.pageData=data
                if(!data.list){
                    $scope.pageModel=[]
                    return
                   }
                $scope.pageModel=data.list
                
                $scope.pageModel.currentPage =  $scope.pageModel.pageIndex + 1;
                $scope.pageModel.totalPage =  $scope.pageModel.pageTotal;
                 $scope.pageModel.totalRecord =  $scope.pageModel.totalCount;
                if ( $scope.pageModel.data &&  $scope.pageModel.data.length >= 0) {
                    $scope.pageModel.list =  $scope.pageModel.data;
                }
                var list = [1,  $scope.pageModel.currentPage - 1,  $scope.pageModel.currentPage,  $scope.pageModel.currentPage + 1,  $scope.pageModel.totalPage];
                var pages = [];
                var hash = {};
                list.forEach(function (v) {
                    if (!hash[v] && v <=  $scope.pageModel.totalPage && v > 0) {
                        hash[v] = true;
                        pages.push(v);
                    }
                })
                if (pages.length > 2 && pages.indexOf(2) == -1) {
                    pages.splice(1, 0, '······');
                }
                if (pages.length > 2 && pages.indexOf( $scope.pageModel.totalPage - 1) == -1) {
                    pages.splice(pages.length - 1, 0, '······');
                }
                $scope.pageModel.pages = pages;
                $scope.autoRemark=data.autoRemark || undefined
                $scope.importRemark=data.importRemark || undefined
            })

        }
       
        // 下载模板
        $scope.downloadFile = function (depId) {
            var deptId=depId || $scope.deptId
            var auth=angular.copy($scope.auth)
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/checkin/importPlan/modal.exportSelect.html',
                controller: 'outputTemplateCtrl',
                resolve: {
                    data: () => {
                        return {
                            deptId,auth
                        }
                    }
                }
            });
            modal.result.then(function () {

            });

        }
        $scope.showModal = function (depId) {
            var deptId=depId || $scope.deptId
            var auth=angular.copy($scope.auth)
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/checkin/importPlan/modal.addPlan.html',
                controller: 'addPlanCtrl',
                resolve: {
                    data: () => {
                        return {
                            deptId,auth
                        }
                    }
                }
            });
            modal.result.then(function () {
                $scope.find(1);
            });
        }
        //修改排班
        $scope.editSchedule=function (item,day) {
          
            var deptId=$scope.search.deptId || $scope.deptId
          
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/checkin/importPlan/modal.edit.schedule.html',
                controller: 'editScheduleCtrl',
                resolve: {
                    data: () => {
                        return {
                            item,day,deptId
                        }
                    }
                }
            });
            modal.result.then(function () {
                $scope.find(1);
            });
        }

        //导出排班计划
        $scope.exportPlans = function(){
            if(!$scope.pageModel.data || $scope.pageModel.data.length == 0){
                alert("无可导出数据");
                return;
            }
            var url = "/ovu-pcos/pcos/arrange/plan/arrangePlanExport?1=1";
            if($scope.search.deptId){
                url += "&deptId=" + $scope.search.deptId;
            }
            if( $scope.search.arrangeDateFrom){
               
                url += "&arrangeDateFrom=" + $scope.search.arrangeDateFrom+'&arrangeDateTo='+ $scope.search.arrangeDateTo;
            }
            
            if($scope.search.personId){
               
                url += "&personId=" + $scope.search.personId
            }
             window.location.href = url;
        }

    });
    app.controller('outputTemplateCtrl', function ($scope, $http, $uibModal, $uibModalInstance, $filter, fac, data) {
        $scope.auth = data.auth;
        $scope.selected={}
        $http.get('/ovu-base/system/dept/tree.do?deptId=' + data.deptId).success(function (res) {
            $scope.searchDeptTree=[]
           
            if(res[0] && !res[0].parkId){
                res[0] && res.forEach(function(v){
                    $scope.searchDeptTree.push(v);
                })
            }else if(res[0] && res[0].parkId){
                res[0].nodes && res[0].nodes.forEach(function(v){
                    $scope.searchDeptTree.push(v);
                  

                })
            }
           
        });
        $scope.$watch('selected.value', function (newV, oldV) {
            if (newV) {
              
               if(newV.length>0){
                $scope.personId = $scope.selected.value.reduce(function (ret, n) {
                    ret.push(n.id);
                    return ret;
                }, []).join(',');
               }else{
                $scope.personId &&  delete $scope.personId
               }
            }
        })
        $scope.getPerson=function(){
            if(!$scope.auth.deptId){
               alert('请选择部门')
               $scope.personListBlock=[]
               $scope.selected.value=[]
               return
            }
           var params={
            currentPage: 1,
            pageSize: 10000000,
            deptId: $scope.auth.deptId,
            jobStatus:1,
        }
            fac.getPageResult(
                "/ovu-base/pcos/person/findPerson_mute.do",
                params,
                function (data) {
                    $scope.personListBlock = data.data;
                }
            );
        }
        $scope.getPerson()
        $scope.confirm = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            
               var url='/ovu-pcos/pcos/arrange/plan/exportTemplate?deptId=' + $scope.auth.deptId + '&dayFrom=' + $scope.search.dayFrom + '&dayTo=' + $scope.search.dayTo;
               if($scope.personId){
                url += "&personId=" + $scope.personId
               }
            window.location.href =url 
            $uibModalInstance.close();

        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });
    app.controller('addPlanCtrl', function ($scope, $http, $uibModal, $uibModalInstance, $filter, fac, data) {
        $scope.auth = data.auth || {};
        $scope.item = {};
        $scope.item.readWay = 1;
        $scope.classList=[];
      
        $scope.accepts = [ ".xlsx",'.xls'];
        $http.get('/ovu-base/system/dept/tree.do?deptId=' + data.deptId).success(function (res) {
            $scope.searchDeptTree=[]
            if(res[0] && !res[0].parkId){
                res[0] && res.forEach(function(v){
                    $scope.searchDeptTree.push(v);
                })
            }else if(res[0] && res[0].parkId){
                res[0].nodes && res[0].nodes.forEach(function(v){
                    $scope.searchDeptTree.push(v);
                  

                })
            }
           
          
           
        });
      
      
        $scope.selectClass=function(dept){
            var deptId = dept.deptId;
            $http.post('/ovu-pcos/pcos/arrange/rule/getEnableRuleByDeptId', {deptId:deptId},fac.postConfig).success(function (res) {
                $scope.classList=res.data.classes || [];
             
            });
        }
        $scope.selectClass( data)
        $scope.upLoadExcel=function(){
            upload({
                url: "/ovu-pcos/pcos/arrange/plan/importPlan",
                params: $scope.item,
                accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            }, function(resp) {
                if (resp) {
                    msg(resp)
                    $uibModalInstance.close();
                } else {
                    alert(resp);
                }
            });

            function upload(options, fn) {
                if (typeof(options.params) != "object") {
                    options.params = {};
                }
                if (!options.url) {
                    options.url = '/ovu-pcos/upload/img.do';
                }
                var index;
                if (options.nowait) {
                    options.onSubmit = function() {};
                } else {
                    options.onSubmit = function() {
                        index = layer.load(1, {
                            shade: [0.2, '#000'] //0.1透明度的白色背景
                        });
                    };
                }
                options.onComplate = function(data) {
                    layer.close(index);
                    if (Array.isArray(data.data)) {
                        fn && fn(data.data);
                    } else if ("object" == typeof data.data) {
                        if (data.code==0) {
                            fn && fn(data.data);
                        } else {
                            layer.alert(data.error || "上传发生错误!", { btn: ['ok'], title: false });
                        }
                    } else if ("string" == typeof data.data) {
                        // data = JSON.parse(data.data);
                        if (data.code==0) {
                            fn && fn(data.data);
                        } else {
                            layer.alert("上传发生错误!", { btn: ['ok'], title: false });
                        }
                    } else {
                        layer.alert("发生错误:" + data, { btn: ['ok'], title: false });
                    }
                };
                // 上传方法
                $.upload(options);
            }
        }
        $scope.confirm = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            
            var url='';
            var param={}
            url='/ovu-pcos/pcos/arrange/plan/autoArrange',
            param={year:$scope.item.year,deptId:$scope.auth.deptId,scheduleName:$scope.item.scheduleName}
            $http.post(url, param,fac.postConfig).success(function (data) {
                if (data.code == 0) {
                    msg(data.msg);
                    $uibModalInstance.close();
                } else {
                    alert(data.msg);
                  
                }
            });

        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });
    app.controller('editScheduleCtrl', function ($scope, $http, $uibModal, $uibModalInstance, $filter, fac, data) {
          
        $scope.item = {isRest:1};
    
        $scope.classList=[];
         $http.get('/ovu-pcos/pcos/arrange/rule/listByDeptId?deptId='+data.deptId).success(function (res) {
                    $scope.classList=res.data || [];
                    // item.plans[w.day].scheduleName
                    if(data.item.plans[data.day.day] && data.item.plans[data.day.day].scheduleName){
                        $scope.classList.length && $scope.classList.forEach(v=>{
                            if(v.scheduleName==data.item.plans[data.day.day].scheduleName){
                                $scope.item.arrangeRuleId=v.id
                            }
                        })
                    }
                 
                });
       
        $scope.confirm = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            
            var url='';
            var param={}
           
            url='/ovu-pcos/pcos/arrange/plan/updateArrangePlan'
            if($scope.item.isRest==1){
              
            }else{
               $scope.item.arrangeRuleId=null
            }
            param={personId:data.item.personId,arrangeDate:data.day.day,arrangeRuleId: $scope.item.arrangeRuleId,deptId:data.deptId}
           
            $http.post(url, param,fac.postConfig).success(function (data) {
                if (data.code == 0) {
                    msg(data.msg);
                    $uibModalInstance.close();
                } else {
                    alert(data.msg);
                  
                }
            });

        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });
})();
