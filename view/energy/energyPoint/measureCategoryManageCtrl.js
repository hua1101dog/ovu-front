/**
 * Created by Zn on 2017/11/16.
 */
(function (angular) {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('measureCategoryManageCtrl', function ($scope, $rootScope, $uibModal, $http, $filter, fac) {
        document.title = '计量分类分项管理';
        $scope.msg={};
        $scope.search = {};
        $scope.TimeList=[];  //时间段设置项list
        $scope.dataList=[];    //数据段设置项list
        $scope.isshow=false; //是否展示分项
        $scope.show=true;
        $scope.formShow=true; //是否展示数据项设置
        $scope.treeData =[];
      $scope.config={
          edit:false
      };
       // 页面初始化
       app.modulePromiss.then(function () {
        $scope.initTreeData()

    })
   
        $scope.initTreeData=function () {
             
            $http.get("/ovu-energy/energy/classify/tree.do").success(function (data) {
                $scope.treeData = data.data;
                // $scope.treeData && $scope.selectNode( $scope.treeData[0])
                if($scope.treeData.length){
                    $scope.search.id = $scope.treeData[0].id;
                }
               
            
            });
        }
       
       
      
        var itemData;
       
        var initStart=function () {
            
            itemData={
                parentId:'0'
            };
        }
        initStart();
        // //点击一级菜单默认修改一级菜单
        $scope.clickMainMenu = function () {
            $scope.isshow=false;
            $scope.formShow=true;
        };
        // //点击二级菜单默认修改二级菜单
        $scope.clickSubMenu = function () {
           $scope.isshow=true;
        };
        var itemId;
        var classId;
        $scope.selectNode = function (search,item) {
            $scope.dataList=[];
            $scope.TimeList=[];
            if(item.state.selected){
                if (item.parentId==0) {
                
                    $scope.clickMainMenu();
                    itemData = item;
                    classId=item.id;
                    $scope.show=false;
                    $http.post('/ovu-energy/energy/classify/get',{classifyId:classId},fac.postConfig).success(function (data) {
                        $scope.msg=data.data
                    
    
                      data.data.policyList.forEach(function(v){
                        if(v.policyType =="1"){
                            $scope.TimeList.push(v);
                        }else{
                            $scope.dataList.push(v);
                        }
                      })
                      $scope.TimeList.forEach(function(n){
                        
                     })
                      $scope.dataList.forEach(function(v){
                         v.beginData=v.beginData-0;
                         v.endData=v.endData-0;
                      })
                    })
                }
                else {
                    $scope.show=true;
                    $scope.clickSubMenu();
                    itemData = item;
                    itemId=item.id;
                    classId=item.parentId
                    $http.post('/ovu-energy/energy/item/get',{
                        itemId:itemId
                    },fac.postConfig).success(function (data) {
                        $scope.msg=data.data;
                       
                    });
                }
            }
           
            
        };
        $scope.addFenXiang = function () {
            // $scope.initTitle = "分项";
            // $scope.doChange = "新增";
            $scope.show=false;
            $scope.isshow=true;
            $scope.msg.name='';
            $scope.msg.description='';
            itemData={
                classifyId:classId
            };
        };
     
        //添加时间段设置项
        $scope.addTimerSet=function(){
            
             $scope.TimeList.push({policyType:'1',beginData:'',endData:'',policyName:''})
        }
       
        //添加数据段设置项
        $scope.addDataSet=function(){
            
            $scope.dataList.push({policyType:'2',beginData:'',endData:'',policyName:''})
        }
        $scope.addCategory = function () {
          
            $scope.msg.name='';
            itemData={
                parentId:'0'
            };
        };
      
        //删除时间段设置项
        $scope.delTimeItem=function(item){
            $scope.TimeList.splice($scope.TimeList.indexOf(item), 1);
        }
        //删除数据段设置项
        $scope.delDataItem=function(item){
            $scope.dataList.splice($scope.dataList.indexOf(item), 1);
        }
        //获取时间段说明
        $scope.getTimeInfo=function(){
             $scope.isTimeInfo=true
        }
         //获取数据段说明
         $scope.getDataInfo=function(){
            $scope.isDataInfo=true
       }
       //关闭时间段说明
        $scope.closeTimeInfo=function(){
            $scope.isTimeInfo=false
        }
        //关闭数据段说明
        $scope.closeDataInfo=function(){
            $scope.isDataInfo=false
        }
        $scope.save = function (form) {
            form.$setSubmitted(true);
            
            if (!form.$valid) {
                return;
            }
            var i=0;
            $scope.TimeList.forEach(function(n){
              
            });
            $scope.dataList.forEach(function(n){
                if(n.endData<n.beginData){
                   
                    i++;
                  
                }
           
            })
            if(i>0){
                alert('开始值不能大于结束值');
               
                return; 
            }
           var policyList= $scope.TimeList.concat($scope.dataList);
           var param={};
           var url=''
           //新增分类
            if(itemData.parentId==0){
                param={
                    classifyId:classId,
                    name:$scope.msg.name,
                    unit:$scope.msg.unit,
                    policyList:policyList
                   }
                   url='/ovu-energy/energy/classify/edit' 
            }else{
              
                param={
                    classifyId:classId,
                    name:$scope.msg.name,
                    description:$scope.msg.description,
                    itemId:$scope.msg.itemId
                   }
                   url='/ovu-energy/energy/item/edit' 
            }

            $http.post(url,param).success(function(res){
                if(res.code==0){
                /*if(classId){
                    msg('修改后次月生效');
                   }else{
                    msg(res.msg);
                   }*/
                
                if(!$scope.isshow){
                    msg('修改后次月生效')  
                    
                }else{
                    msg(res.msg);
                } 
                
                    $scope.initTreeData();
                    ($scope.treeData[0]) && ($scope.treeData[0].state={})&& ($scope.treeData[0].state.selected=true) && ($scope.selectNode('',$scope.treeData[0]))

                    $scope.isshow=false
                    $scope.msg='';
                    $scope.formShow=true,
                    $scope.show=false,
                    initStart();
                }else{
                    alert(res.msg);
                }

            })
        };
        $scope.del=function () {
            if(itemData.parentId==0){
                confirm("是否删除该分类？",function () {
                    $http.post('/ovu-energy/energy/classify/delete',{
                        classifyId:itemData.id
                    },fac.postConfig).success(function (data) {
                        if(data.code==0){
                            msg(data.msg);
                            $scope.initTreeData();
                            ($scope.treeData[0]) && ($scope.treeData[0].state={})&& ($scope.treeData[0].state.selected=true) && ($scope.selectNode('',$scope.treeData[0]))
                            $scope.msg.name='';
                            initStart();
                            $scope.isshow=false;
                          
                            $scope.msg=''
                           
                        }
                        else{
                            alert(data.msg);
                        }
                    });
                })
            }
            else {
                confirm("是否删除该分项？",function () {
                    $http.post('/ovu-energy/energy/item/delete',{
                        itemId:itemData.id
                    },fac.postConfig).success(function (data) {
                        if(data.code==0){
                            msg(data.msg);
                            $scope.msg.name='';
                            $scope.msg.description='';
                            initStart();
                            $scope.initTreeData();
                            ($scope.treeData[0]) && ($scope.treeData[0].state={})&& ($scope.treeData[0].state.selected=true) && ($scope.selectNode('',$scope.treeData[0]))

                            $scope.isshow=false
                            $scope.msg=''
                        }
                        else{
                            alert(data.msg);
                        }
                    });
                })
            }
        };

    });
})(angular)
