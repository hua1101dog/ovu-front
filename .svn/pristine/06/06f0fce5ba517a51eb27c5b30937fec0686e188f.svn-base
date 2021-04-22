(function () {
    var app = angular.module("angularApp");
    app.controller('customerManageCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "客户台账";
        app.modulePromiss.then(function(){
            $scope.search={
            };
            $scope.selCount=0;
            $scope.pageModel = {};
            // $scope.isSync=true
            // $scope.checkSyncBtn()
            $scope.$watch('project.id', function (projectId, oldValue) {
                if (projectId) {
                    $scope.search.parkId=""
                    $scope.search.stage_id=""
                    $scope.search.build_id=""
                    $scope.search.parkId = $rootScope.project.parkId;
                    $rootScope.project.stageId&&($scope.search.stage_id= $rootScope.project.stageId);
                    $rootScope.project.buildId&&($scope.search.build_id= $rootScope.project.buildId);
                    $scope.find(1)
                }
            })

        });
       
        $scope.find = function (pageNo) {
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult("/ovu-crm/backstage/crmCustomer/manage/queryByPage", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
        //新增or编辑客户窗口
        $scope.showCustomer = function (item) {
            console.log('000000000',item)
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/investmentSystem/customerManage/modal.showCustomer.html',
                controller: 'showCustomerCtrl',
                resolve: { customerObj: item }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
        //删除客户
        $scope.delete = function (item) {
            confirm("确定删除客户	["+item.name+"]?",function(){
                $http.post("/ovu-park/backstage/sale/person/delete",{id: item.id},fac.postConfig).success(function(resp){
                    if(resp.code == 0){
                        window.msg("删除成功！");
                        $scope.find();
                    }else{
                    	alert(resp.msg);
                    }
                });
            })

        };   
    });
    //新增or编辑客户
    app.controller('showCustomerCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, customerObj) {
        $scope.curIndex = 1;
        $scope.contactList = []
        $scope.contactParam={}
        $scope.dictionary={}
        $scope.industryList=[]
        $scope.customerInfo = {
            id:customerObj?customerObj.id:'',
            type:2
            // isHighTech: "0",
            // isListed: "0"
        }

         //获取下拉框字典
         $http.post('/ovu-base/system/dictionary/get').success(function(resp){
            if(resp.code == 0){
                console.log('获取意向级别',resp)
                $scope.dictionary=resp.data
            }else{
                
            }
        });
        //行业下拉数据
        $http.post('/ovu-base/ovupark/backstage/industry/queryIndustryTwoLevelList').success(function(resp){
            if(resp.code == 0){
                console.log('行业下拉数据',resp)
                $scope.industryList=resp.data
                console.log('$scope.industryList',$scope.industryList)
            }else{
                
            }
        });

        //意向项目
        $http.post(`/ovu-park/backstage/sale/saleparkhouse/getStageIdByParkId?parkId=${$rootScope.project.parkId}`).success(function(resp){
            console.log('获取意向项目接口------',resp)
            if(resp.code == 0){
                console.log('行业下拉数据',resp)
                $scope.projectSelectList=resp.data
                console.log($scope.projectSelectList,'======')
            }else{
                
            }
        });
        $scope.fatherIndustryChange=function(item){//item model的id
            $scope.industryList.forEach(i=>{
                if(i.industryCode==item){
                    $scope.sonList=i.node
                    console.log('$scope.sonList',$scope.sonList)
                }
            })  
        }
        var initData = function () {
            if ($scope.customerInfo.id) {//编辑
                console.log('编辑----------')
                //根据id查询详情
                let param = {id:$scope.customerInfo.id};
                console.log('param',param)
                $http.get(`/ovu-crm/backstage/crmCustomer/manage/queryByPrimaryKey/${$scope.customerInfo.id}`).success(function(resp){
                    console.log('根据id查询详情',resp)
                    if(resp.code == 0){
                        $scope.customerInfo = resp.data
                        console.log('$scope.customerInfo',$scope.customerInfo)
                        $scope.customerInfo.registeredCapital=$scope.customerInfo.registeredCapital?$scope.customerInfo.registeredCapital/10000:''
                        $scope.contactList = $scope.customerInfo.contactList?$scope.customerInfo.contactList:[];
                        $scope.customerInfo.isHighTech=$scope.customerInfo.isHighTech==''?'0':$scope.customerInfo.isHighTech
                        $scope.customerInfo.isListed=$scope.customerInfo.isListed==''?'0':$scope.customerInfo.isListed
                        let len = $scope.contactList.length;
                        for (var i = 0; i < 5 - len; i++) {
                            $scope.contactList.push({})
                        }
                        $scope.industryList.forEach(i=>{
                            // debugger
                            i.node.forEach(item=>{
                                if(item.industryCode==$scope.customerInfo.industry){
                                    $scope.sonList=i.node
                                    $scope.fatherIndustry=i.industryCode
                                }
                            })
                        }) 
                    }else{
                        window.alert(resp.msg);
                    }
                });
                //根据id查询修改记录
                //http://localhost/ovu-base/system/log/list
                $scope.pageModel = {};
                
                $scope.findLog = function (pageNo) {
                    let key = ",\\\"id\\\":" + $scope.customerInfo.id + ",";
                    let logParams = {subSystem: "LST003003",
                                     params: key}
                    $.extend(logParams, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
                    fac.getPageResult("/ovu-base/system/log/list",logParams, function (data) {
                        $scope.pageModel = data;
                    });
                };
                $scope.findLog(1);
            } else {//新增
                console.log('新增----------')
               
                for (var i = 0; i < 5; i++) {
                    $scope.contactList.push({})
                }
               
                
            }
        }
        initData()
      
        $scope.radioChange=function(i){
            if(i==1){//个人
                console.log('选择的个人')
            }else if(i==2){//企业
                console.log('选择的企业')
            }
        }
        //手机号相同校验
        $scope.phoneBlur=function(val){
            console.log('手机输入框失去焦点事件',val)
            if(val&&val.length>10){
                $.post("/ovu-crm/backstage/crmCustomer/manage/checkPhoneNum",{phone:val,parkId:$rootScope.project.parkId},function(resp){
                    if(resp.code == 0 && resp.data.status==1){
                        let content
                        console.log('=========',resp.data.prompt)
                        // content = resp.data.prompt.replace(/n/g, "<br/>");
                        console.log('-----------',content)
                        layer.confirm(resp.data.prompt,{ title:''},function(index){
                            console.log('pppppp')
                            layer.close(index)
                        },
                        function(index){
                            console.log('点击取消---')
                        })
                        $scope.customerInfo.phone=''
                    }else{
                         
                    }
                });
            }
            
        }
        // 保存
        $scope.save = function (form,param,type) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return false;
            }
            //var param=angular.copy($scope.customerInfo)
            let contactList =[];
            $scope.contactList.forEach(v => {
                  if(v.contactName){
                    delete v.$$hashKey;
                    contactList.push(v);
                  }
            });
            console.log('ppppppppppp',contactList)
            delete param.sex;
            delete param.birthDate;
            param.contactList=[];
            param.parkId=$rootScope.project.parkId;
            if($scope.customerInfo.id){//编辑
                console.log('pppp',param)
                $http.post("/ovu-crm/backstage/crmCustomer/manage/update",param).success(function(resp){
                    if(resp.code == 0){
                        window.msg("修改成功！");
                         //crm保存联系人
                         let contactList =[];
                         $scope.contactList.forEach(v => {
                             if(v.contactName){
                                 delete v.$$hashKey;
                                 contactList.push(v);
                             }
                         });
                        //  param.contactListStr = JSON.stringify(contactList);
                         $scope.contactParam.id=resp.data
                         $scope.contactParam.contactListStr=JSON.stringify(contactList)
                        //  $scope.contactParam.contactListStr=encodeURIComponent(contactList)
                         console.log('canshu---',$scope.contactParam)
                        // const formData = new FormData();
                        //     Object.keys($scope.contactParam).forEach((key) => {
                        //     formData.append(key, $scope.contactParam[key]);
                        // });
                         $.post('/ovu-park/backstage/sale/person/edit',$scope.contactParam,function(resp){
                             if(resp.code == 0){
                                 window.msg("修改成功！");
                             }else{
                                 window.alert(resp.msg); 
                             }
                         });
                    	if(type){
                    	    $uibModalInstance.dismiss('cancel');
                        }
                    }else{
                        window.alert(resp.msg); 
                    }
                });

            }else{//新增
                delete param.id;
                
                // let paramJson=function(){
                //     var objData = {};
                //     param.forEach((value, key) => objData[key] = value);
                //     return JSON.parse(objData);
                // }
                $http.post("/ovu-crm/backstage/crmCustomer/manage/save",param).success(function(resp){
                    if(resp.code == 0){
                    	window.msg("新增成功！");
                        // $scope.customerInfo.id = resp.data;
                        // param.id = resp.data;
                        //crm保存联系人
                        let contactList =[];
                        $scope.contactList.forEach(v => {
                            if(v.contactName){
                                delete v.$$hashKey;
                                contactList.push(v);
                            }
                        });
                        $scope.contactParam.id=resp.data
                        //  $scope.contactParam.contactListStr=JSON.stringify(contactList)
                        $scope.contactParam.contactListStr=JSON.stringify(contactList)
                        console.log('canshu---',$scope.contactParam)
                        $.post('/ovu-park/backstage/sale/person/add',$scope.contactParam,function(resp){
                            if(resp.code == 0){
                                window.msg("修改成功！");
                                
                            }else{
                                window.alert(resp.msg); 
                            }
                        });
                    	// if(type){
                    	//     $uibModalInstance.close();
                        // }
                        if(type){
                            $uibModalInstance.dismiss('cancel');
                        }
                    }else{
                        window.alert(resp.msg); 
                    }
                });

            }
        }

        // 取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    


    });

})();
