
(function() {
    "use strict";
    var app = angular.module("angularApp");
    app.controller("univerBanerCtl", function(
        $scope,
        $rootScope,
        $http,
        $filter,
        $timeout,
        $uibModal,
        fac
    ) {
        document.title = "Banner管理";
       

      

        $scope.pageModel = {};
        $scope.search = {};
     
       

        app.modulePromiss.then(function() {
            $scope.$watch("dept.id", function(deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.deptId = deptId;
                        $scope.search.parkId = $scope.dept.parkId;
                       
                    } else {
                        // alert('请选择跟项目关联的部门');
                        // $scope.search.deptId &&  delete $scope.search.deptId
                        $scope.search.parkId=$rootScope.getParks()
                      
                    }
                    $scope.find(1)
                }
            });
        });

       
        var newList
        //列表查询
        $scope.find = function(pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
               
            });
           
            fac.getPageResult(
                "/ovu-university/university/banner/page",
                $scope.search,
                function(data) {
                    $scope.pageModel = data;
                    newList = $scope.pageModel.data.slice()
                }
            );
        };
        $scope.toDelAll = function() {
            
            var arr=$rootScope.getCheckData($scope.pageModel.data)
             var ids = arr.reduce(function (ret, n) { n.checked && ret.push(n.id); return ret }, []);
             
             confirm("是否删除选中的数据？", function() {
                 $http.get('/ovu-university/university/banner/delete?ids='+ids).success(function(data) {
                     if (data.code==0) {
                         msg(data.msg);
                         $scope.find(1);
                     } else {
                         alert(data.msg);
                     }
                 });
             })
         };
         //下架
         $scope.shelves=function(){
            var flag = true
         
            var arr = $rootScope.getCheckData($scope.pageModel.data)
              for (var i = 0; i < arr.length; i++) {
                  if ( arr[i].status == 0) {
                      flag = false
                      break;
                  }
  
              }
              if (!flag) {
                  alert('请选择已上架的数据')
                  return
              }
              
         
            var ids = arr.reduce(function (ret, n) { n.checked && ret.push(n.id); return ret }, []);
            confirm("是否下架选中数据？", function() {
                $http.get('/ovu-university/university/banner/out?ids='+ids).success(function(data) {
                    if (data.code==0) {
                        msg(data.msg);
                        $scope.find(1);
                    } else {
                        alert(data.msg);
                    }
                });
            })
         }
         var beforeId
         var afterId
         var beforeObj={}
         var foward
         var idx
         var index
         
         $scope.clickEle=function(){
             return false
             console.log(1)
         }
         $scope.sortableOptions = {
            //拖拽开始
            start:function(e, ui){
            
            beforeId=ui.item.sortable.model.id
            idx = $scope.pageModel.data.indexOf(ui.item.sortable.model); //原来数据的下标
            },
          // 数据有变化
            update: function(e, ui) {
                console.log(beforeId);
            
            
                
                //需要使用延时方法，否则会输出原始数据的顺序，可能是BUG？
                $timeout(function() {
                    var resArr = [];
                 
                   
                    for (var i = 0; i < $scope.pageModel.data.length; i++) {
                        resArr.push($scope.pageModel.data[i].id);
                       
                    }
                    
                     index= resArr.indexOf(beforeId); //现在的下标
                     console.log(index + '现在的index')
                     console.log(idx + '原来的index')
                     console.log($scope.pageModel.data)
                     console.log(newList)
                    afterId=newList[index].id
                    if(idx > index){
                        foward=1
                      }else{
                        foward=2
                      }
                     $http
          .get("/ovu-university/university/banner/sort",{params:{
            beforeId:beforeId,
            afterId: afterId,
            // foward:foward
          }})
          .success(function(data) {
             if(data.code==0){
               $scope.find(1)
             }
          });
                   
                })
                //   beforeId  obj.id 当前移动数据的id
        // foward 1向上 2向下
         //   afterId  $scope.pageModel.data[index].id 要移动地方的id
        
                
                
                 
              

            },

            // 完成拖拽动作
            stop: function(e, ui) {
                //do nothing
              
              
            },
            items: 'tr'
        }
        $scope.dropComplete = function (index, obj, event) {
            // index : 表示拖动的数据所落的元素的下标
            // obj : 被拖动的数据对象
            //重新排序
            event.event.stopPropagation()
            event.event.preventDefault()
            console.log(event)
          
          if(event.event.target.className.indexOf('bj')>=0){
              //如果点击的是编辑,那么直接return
            return
          } 
         
        
      
          console.log(obj)
          var idx = $scope.pageModel.data.indexOf(obj); //原来数据的下标
        
        
          console.log(index +'目标index')
          console.log(idx +'原来的index')
          if(idx == index){
               return
          }
         
          
        
        

        };
       

     

        //新增、编辑
        $scope.showModal = function($event,item) {
           
            if(!item && (!$scope.search.parkId || $scope.search.parkId.indexOf(',')!==-1)){
                alert('请选择项目');
                return
            }
            $event.stopPropagation()
            $event.preventDefault()
          
            var copy = angular.extend(
                {
                  
                },
                item
            );
             if(!item){
                copy.parkId=$scope.search.parkId
             }
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "/view/university/banner.edit.modal.html",
                controller: "bannerAddModalCtrl",
                resolve: {
                    copy: copy
                }
            });
            modal.result.then(function() {
                $scope.find(1);
            });
        };
      
      

    });
    app.controller("bannerAddModalCtrl", function(
        $scope,
        $http,
        fac,
        $uibModalInstance,
        $uibModal,
        copy
    ) {
        $scope.item =  copy;
       
        if(copy.id){
            $http
            .get("/ovu-university/university/banner/query?id="+copy.id)
            .success(function(data) {
                $scope.item=data.data
            });
        }
        $scope.item.bannerRange=$scope.item.bannerRange || 0

       


        //保存
        $scope.save = function(form) {
           
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            if(!$scope.item.picture){
                alert('请上传图片')
                return
            }
            if(moment().format('YYYY-MM-DD')>$scope.item.endTime){
                alert('结束日期不得大于今天')
                return
            }
             var url=''
             if(!copy.id){
                 url='/ovu-university/university/banner/insert'
             }else{
                url='/ovu-university/university/banner/edit'
             }
            $http
            .get(url, {params:$scope.item})
            .success(function(data) {
                if (data.code == 0) {
                  
                    msg("保存成功!");
                    $uibModalInstance.close();
                } else {
                    alert(data.msg);
                }
            });
        }
        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
    });
  
   
})();
