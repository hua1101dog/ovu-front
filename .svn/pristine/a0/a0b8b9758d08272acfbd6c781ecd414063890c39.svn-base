
(function() {
    "use strict";
    var app = angular.module("angularApp");
   
    app.controller('worktypeCtl', function ($scope,$rootScope, $http,$filter,$uibModal,fac) {
        document.title ="OVU-工作标准";
        $scope.search = {withWorkitem:false};
        $scope.pageModel = {data:[]};

        $scope.find = function(pageNo){
            $.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
            fac.getPageResult("/ovu-pcos/pcos/workunit/queryWorkitem",$scope.search,function(data){
                $scope.pageModel = data;
                $scope.pageModel.data && $scope.pageModel.data.length && $scope.pageModel.data.forEach(v=>{
                    if(v.PARK_NAME){
                        var arr=v.PARK_NAME.split(',')
                        if(arr.length>2){
                            v.parks=arr[1]+','+arr[2]+'...等'+arr.length+'个项目'
                         }else{
                            v.parks=v.PARK_NAME
                         }
                    }
                   
                    
                })
            });
        };
        $scope.find(1);

        //新增、编辑事项
        $scope.showEditModal = function(workitem){
            if(!workitem && $scope.curNode && !$scope.curNode.nodes){
                var node = $scope.curNode;
                workitem = {WORKTYPE_ID:$scope.curNode.id,WORKTYPE_NAME:(node.ptexts?node.ptexts+">":"")+node.text}
            }
            var modal = $uibModal.open({
                animation: false,
                size:'lg',
                templateUrl: '/view/workunit/modal.workitem.html',
                controller: 'workitemModalCtrl'
                ,resolve: {workitem: angular.extend({},workitem)}
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        //清除频次
        $scope.clearFrequency=function(item){
            confirm("是否确认删除该事项的频次?", function () {
                $http.get('/ovu-pcos/pcos/workfrequency/delete?workItemId='+item.ID).success(res=>{
                    if(res.code==0){
                       msg('操作成功')
                       $scope.find(1);
                    }else{
                        alert(res.msg)
                    }
                })
            });
        }

        //选中分类项
        $scope.selectNode= function (search,node) {
            if(node.state.selected){
                $scope.curNode = node;
                $scope.find(1);
            }else{
                delete $scope.curNode;
            }
        }
        $scope.choosePark = function (item) {
            var parks=[]
            var parkIds=[]
            var parkNames=[]
           
            if (item.PARK_IDS && item.PARK_NAME) {
                parkIds =item.PARK_IDS.split(',');
                parkNames=item.PARK_NAME.split(',');
                parkIds.forEach((v,i)=>{
                    parks.push({
                        id:v,
                        parkName:parkNames[i]
                    })
                })
            }
           
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/common/modal.select.parks.html',
                controller: 'parksSelectorCtrl',
                resolve: {
                    data: function () {
                        return {
                            parks:parks,
                            unNeed:true
                        };
                    }
                }
            });
            modal.result.then(function (data) {
               
                var arr=[]
                data.forEach(function (park) {
                    arr.push(park.id);
                });
                 var params={
                    ID:item.ID
                 }
                var PARK_IDS=arr.join(',')
                  if(PARK_IDS){
                    params.PARK_IDS=PARK_IDS
                  }
               
                $http.post('/ovu-pcos/pcos/workunit/savepark',params).success(res=>{
                    if(res.code==0){
                        $scope.find(1)
                      
                    }else{
                        alert(res.msg)
                    }
                })
              
              
            });
        };
        //选择人员
        $scope.choosePerson=function(item){
            if(item.manage_person_name){
                item.per_Id=item.MANAGE_PERSON
                item.per_Name=item.manage_person_name
            }
            var modal = $uibModal.open({
                animation: false,
                size:'lg',
           
                templateUrl: '/common/modal.select.person.workType.html',
           
                controller: 'personWorkTypeSelectorCtrl'
           
                ,resolve: {data: angular.extend({onlyOne:true,unNeed:true,url:'/ovu-pcos/pcos/wrokTaskNew/person'},item)}
            });
            modal.result.then(function (data) {
               
                $http.post('/ovu-pcos/pcos/workunit/savemanager',{ID:item.ID,MANAGE_PERSON:data.per_Id}).success(res=>{
                    if(res.code==0){
                        msg('操作成功')
                        $scope.find(1)
                      
                    }else{
                        alert(res.msg)
                    }
                 })
               
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        //设置频次
        $scope.setFrequency=function(item){
            var modal = $uibModal.open({
                animation: false,
                size:'max',
                templateUrl: '/view/workunit/modal.setFrequency.html',
                controller: 'setFrequencyModalCtrl'
                ,resolve: {item: angular.extend({},item)}
            });
            modal.result.then(function () {
                $scope.find(1)
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }

        $scope.delAll = function(){
            var ids = $scope.pageModel.list.reduce(function(ret,n){n.checked && ret.push(n.ID);return ret},[]);
            var hasPark = $scope.pageModel.list.find(function (n) {
                return n.PARK_IDS && n.checked;
            });
            if(hasPark){
                alert('当前事项授权给了项目,不可删除!')
                return
            }
            del(ids,"确认删除选中的 "+ids.length+" 条事项吗?");
        };
        $scope.del = function(item){
            if(item.PARK_IDS){
                alert('当前事项授权给了项目,不可删除!')
                return
            }
            del([item.ID],"确认删除事项["+item.WORKITEM_NAME+"]吗?");
        }

        function del(ids,msg){
            confirm(msg,function(){
                $http.post("/ovu-pcos/pcos/workunit/delWorkitem.do",{"ids":ids.join()},fac.postConfig).success(function(resp){
                    if(resp.success){
                        $scope.find(1);
                    }else{
                        alert(resp.error);
                    }
                })
            });
        }


    });
    app.controller('workitemModalCtrl', function($scope,$http,$uibModalInstance,$filter,fac,workitem) {
        //用于获取步骤列表
        workitem.steps = [];
        $scope.item = workitem;
        $scope.item.execCycle=workitem.exec_cycle
        workitem.ID && $http.get("/ovu-pcos/pcos/workunit/getWorkSteps.do?workitemId="+workitem.ID).success(function(steps) {
            workitem.steps = steps;
        })


        $scope.delStep=function(steps,step){
            confirm("确定删除此步骤吗?",function(){
                steps.splice(steps.indexOf(step),1);
                $scope.$apply();
            })
        };


        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            var flag=true //如果操作类型为选择，则选项里面必须包含','
              if(!item.steps || !item.steps.length){
                alert('请添加步骤!')
                return

              }
            item.steps && item.steps.forEach(function(v){
              if(v.OPERATION_TYPE=='3' && (v.OPTIONS_LIST.indexOf("，") == -1)){
                flag=false;
                return

              }
            })
            if(!flag){
                alert('选项里面必须包含"，"请正确填写选项')
               return
            }
           
            $http.post("/ovu-pcos/pcos/workunit/saveWorkitem.do", {data:JSON.stringify(item)},fac.postConfig).success(function (resp, status, headers, config) {
                if (resp.success) {
                    $uibModalInstance.close();
                    msg("保存成功!");
                } else {
                    alert(resp.error);
                }
            })
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    app.controller('setFrequencyModalCtrl', function($scope,$http,$uibModalInstance,$filter,fac,$timeout,item) {
    
        //获取选中的数组长度
        $scope.getSelectData=function(data){
            var arr=[]
            data.forEach(ele => {
                    if(ele.isSelected==true){
                        arr.push(ele)
                    }
                });
                return arr
        }
        
        $scope.item = item;
         $scope.exec_cycle=item.exec_cycle
        $scope.item.exec_cycle=item.exec_cycle || 1
        $scope.item.execDate=item.exec_date
        $scope.item.sendTime=item.send_time
        var copyItem=Object.assign({},item)
        var copySendTime= item.send_time || item.sendTime;
        var copyexec_num= item.execNum ;
        $scope.frelist=[]
            var execDateList= []
            item.exec_date && (execDateList=item.exec_date.split(','))
           
       
        $scope.dayList=[
            {value:'周一',isSelected:false},
            {value:'周二',isSelected:false},
            {value:'周三',isSelected:false},
            {value:'周四',isSelected:false},
            {value:'周五',isSelected:false},
            {value:'周六',isSelected:false},
            {value:'周日',isSelected:false},
         
        ]
      
        $scope.getList=function(){
            $http.get("/ovu-pcos/pcos/workfrequency/list",{params:{cycle:$scope.item.exec_cycle,id:item.ID}}).success(function(res) {
                $scope.frelist = res.data || [];
                $scope.frelist.length && $scope.frelist.forEach(v=>{
                     if(v.execDate){
                        v.execDateList=v.execDate.split(',')
                     }else{
                        v.execDateList=[]
                     }
                   
                })
                
                
            })
         }
       
         $scope.$watch('item.exec_cycle',function(newV,oldV){
            if(newV && newV!==oldV && !$scope.msgFlag){
                $scope.item.execNum  && delete $scope.item.execNum 
                $scope.item.sendTime && delete  $scope.item.sendTime
                $scope.item.exec_num  && delete $scope.item.exec_num 
            }
           
           
         })
        $scope.changeFre=function(value){
            $scope.item.exec_cycle=value
         
         
            if(value==1){
                $scope.dayList = [ {value:'周一',isSelected:false},
                {value:'周二',isSelected:false},
                {value:'周三',isSelected:false},
                {value:'周四',isSelected:false},
                {value:'周五',isSelected:false},
                {value:'周六',isSelected:false},
                {value:'周日',isSelected:false},];
               
                 $scope.isHide=false
            }else if(value==2){
                $scope.dayList = Array.from({length:28}, (v,k) =>
                k={value:k+1+'日',isSelected:false}
                );
                $scope.isHide=false
                // $scope.dayList = Array.from({length:28}, (v,k) => k+1+'日');
            }else if(value==3){
                $scope.dayList = Array.from({length:12}, (v,k) =>
                k={value:k+1+'月',isSelected:false}
                );
                $scope.isHide=false
               
            }else{
                $scope.isHide=true
               
             
               
            }
            $scope.getList()
        }
        $scope.changeFre($scope.item.exec_cycle)
         if(execDateList.length){
            $scope.dayList.forEach((v,i)=>{
                if(execDateList.indexOf(i+1+'')!==-1){
                    v.isSelected=true
                   
                }
             })
         }
  
    $scope.selectOne=function(d){
        d.isSelected= !d.isSelected
        var execDate = $scope.dayList.reduce(function(ret,n,i){n.isSelected &&  ret.push(i+1);return ret},[]);
        $scope.item.exec_num=execDate.length
        
     
     }
     $scope.$watch('item.exec_num',function(newV,oldV){
      if(newV==$scope.dayList.length ){
        $scope.dayList.forEach(v=>{
            v.isSelected=true
        })
      }
     })
      
    


        $scope.save = function (form, item) {
           
            var execDate = $scope.dayList.reduce(function(ret,n,i){n.isSelected &&  ret.push(i+1);return ret},[]);
         
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            
           if(execDate.length && $scope.item.exec_num){
            if(execDate.length!==$scope.item.exec_num){
                alert('频次必须与设置的日期一致')
                return
              }
           }
           var params={
            workItemId:$scope.item.ID,
            id:$scope.item.frequencyId,
            execCycle:$scope.item.exec_cycle+ '',
            sendTime:$scope.item.sendTime
           }
           
           $scope.item.exec_num && (params.execNum=$scope.item.exec_num+'')
           execDate && execDate.length && (params.execDate=execDate.join(','))
           $scope.sendTime && (params.sendTime=$scope.sendTime)
           if(!$scope.item.exec_cycle){
            delete params.execCycle
            delete params.execDate
            delete params.execNum
       }
            $http.post("/ovu-pcos/pcos/workfrequency/save",params).success(function (resp, status, headers, config) {
                if (resp.code==0) {
                    $uibModalInstance.close();
                    msg("保存成功!");
                } else {
                    // alert(resp.msg);
                    layer.alert(resp.msg, {
                             
                        icon: 5,
                    },function(index){
                   
                        
                       
                        layer.close(index);
                       
                        $timeout(function(){
                            $scope.item.exec_num = copyexec_num;
                            $scope.item.exec_cycle =copyItem.exec_cycle;
                            $scope.item.sendTime = copySendTime
                            
                             var execDateList=[]
                            execDateList = copyItem.execDate.split(",")
                          
                            if ( $scope.item.exec_cycle == 1) {
                                $scope.dayList=[
                                    {value:'周一',isSelected:false},
                                    {value:'周二',isSelected:false},
                                    {value:'周三',isSelected:false},
                                    {value:'周四',isSelected:false},
                                    {value:'周五',isSelected:false},
                                    {value:'周六',isSelected:false},
                                    {value:'周日',isSelected:false},
                                 
                                ]
                            } else if ( $scope.item.exec_cycle == 2) {
                                $scope.dayList = Array.from(
                                    { length: 28 },
                                    (v, k) =>
                                        (k = { value: k + 1 + "日", isSelected: false })
                                );
                            } else {
                                $scope.dayList = Array.from(
                                    { length: 12 },
                                    (v, k) =>
                                        (k = { value: k + 1 + "月", isSelected: false })
                                );
                            }
                         
                            $scope.dayList.forEach((v, i) => {
                              
                                if (execDateList.indexOf(i + 1 + "") !== -1) {
                                    v.isSelected = true;
                                }
                            });
                            $scope.$apply()
                        },200)
                      })
                }
            })
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    app.controller('chooseManagePModalCtrl', function($scope,$http,$uibModalInstance,$filter,fac,workitem) {
        $scope.data = workitem;
        $scope.search = {
          
           
        };
        $scope.pageModel = {
           
        };


      
        $scope.managePerson = workitem.managePerson || {}; //管理人
       
        function find(pageNo, search, pageModel) {
            $.extend(search, {
                currentPage: pageNo || pageModel.currentPage || 1,
                pageSize: pageModel.pageSize || 10,
                deptName: '创意天地服务中心',
              authDeptId: '74c6071187dd44d68eac5b7a295f65fd'

            });
            fac.getPageResult("/workunit/sys/queryPerson_mute", search, function (data) {
                angular.extend(pageModel, data);
            });
        }
        //查询本部门相关的人员
        $scope.find0 = function (pageNo) {
            find(pageNo, $scope.search, $scope.pageModel);
        };
        

      
      
       

       

        //添加管理人（单人、!=执行人）
        $scope.setManagePerson = function (item) {
            if ($scope.exePerson && $scope.exePerson.id == item.id) {
                $scope.exePerson = {};
            }
            $scope.managePerson = item;
        };

       
      

       
        $scope.delMngPerson = function () {
            $scope.managePerson = {};
        };

        //确定
        $scope.save = function () {
            if (!$scope.managePerson.id) {
                alert("请选择管理人！");

            } else {
                
                $uibModalInstance.close({
                  
                  
                    manageId: $scope.managePerson.id,
                
                });
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    //选择人员
    app.controller('personWorkTypeSelectorCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, data) {
        $scope.config = {
            edit: false
        };

        fac.setPostDict($scope);
        $scope.search = {};
        $scope.oriList = [];
        $scope.pageModel = {};
        $scope.persons = [];
        $scope.currDeptName = ''; //当前节点部门
        $scope.onlyOne = data.onlyOne || false; //是否单选
        $scope.unNeed = data.unNeed || false; //是否必填 默认为false必填  true 不必填
      

        if (data.per_Id && data.per_Name) { //初始化加载
            var ids = data.per_Id.split(',');
            var names = data.per_Name.split(',');
            for (var i = 0; i < ids.length; i++) {
                $scope.persons.push({
                    id: ids[i],
                    name: names[i]
                });
            }
        }

        //查询
        $scope.find = function (pageNo) {
            if (!$scope.search.deptId) {
                return;
            }
          
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
            });
            fac.getPageResult("/ovu-pcos/pcos/wrokTaskNew/person", $scope.search, function (data) {
                data.data && data.data.length && data.data.forEach(function (n) {
                    n.postList = [];
                    n.mrList = [];
                    if (n.postIds) {
                        var deptpost = n.postIds.split(",");
                        n.postList = deptpost.map(function (m) {
                            return m.indexOf("-") > 0 ? (m.split("-")) : (null)
                        });

                        delete n.postIds;
                    }
                });
                $scope.pageModel = data;
            });
        };

        //选中节点
        $scope.selectNode = function (node) {
            if ($scope.curNode != node) {
                $scope.curNode && $scope.curNode.state && ($scope.curNode.state.selected = false);
            }
            node.state = node.state || {};
            node.state.selected = !node.state.selected;
            if (node.state.selected) {
                $scope.curNode = node;
                $scope.search.deptId = node.id;
            }
            $scope.find(1);
        };
         //加载组织树
       if (data.parkId) {
        //传入deptId，获取deptId下所有子节点组织树
        $http.get("/ovu-base/system/dept/tree?parkId=" + data.parkId).success(function (tree) {
            $scope.treeData = tree;
            $scope.search.deptId = $scope.treeData[0].id;
            $scope.selectNode($scope.treeData[0]);
            $scope.oriList = fac.treeToFlat($scope.treeData);
           
        })
    } else {
        //物业公司，默认是全局的组织树
        $scope.treeData = fac.getGlobalTree();
        $scope.search.deptId = $scope.treeData[0].id;
        $scope.selectNode($scope.treeData[0]);
        $scope.oriList = fac.treeToFlat($scope.treeData);
     
    }

        //添加
        $scope.addPersonItem = function (person) {
            var is_exist = false;

            if ($scope.onlyOne) { //单选
                $scope.persons = [];
                $scope.persons.push({
                    id: person.id,
                    name: person.name
                });
            }

            $scope.persons.forEach(function (item) {
                if (person.id == item.id) {
                    is_exist = true;
                }
            });
            if (!is_exist) {
                $scope.persons.push({
                    id: person.id,
                    name: person.name
                });
            }
        };

        //删除
        $scope.del = function (persons, person) {
            persons.splice(persons.indexOf(person), 1);
        };


        //确定
        $scope.save = function () {

            if($scope.unNeed){
                var ids = [],
                        names = [];
                    $scope.persons.length && $scope.persons.forEach(function (item) {
                        ids.push(item.id);
                        names.push(item.name);
                    });
    
                    $uibModalInstance.close({
                        per_Id: ids.join(),
                        per_Name: names.join()
                    });
            }else{
                if ($scope.persons.length == 0) {
                    alert("请选择人员！");
                } else {
                    var ids = [],
                        names = [];
                    $scope.persons.forEach(function (item) {
                        ids.push(item.id);
                        names.push(item.name);
                    });
    
                    $uibModalInstance.close({
                        per_Id: ids.join(),
                        per_Name: names.join()
                    });
                }
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
       
    });
     
})();
