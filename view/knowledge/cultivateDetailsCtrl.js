(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('culCtrl', function ($scope, $rootScope, $http, $filter, $uibModal,fac) {
        document.title = "培训发放详情";
        $scope.pageModel = {};
        $scope.search = {};
       
        $scope.show=false
       
        app.modulePromiss.then(function () {

            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    $scope.search.deptId = deptId
                    $scope.search.coursewareName && delete $scope.search.coursewareName
                    $scope.find(1)
                }
               
            })
        })

       $scope.find=function(pageNo){
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10});
        fac.getPageResult("/ovu-pcos/pcos/newknowledge/train/themeList",$scope.search,function (data) {
            $scope.pageModel =data;

        });
        }
        //编辑
        $scope.showEditModal=function(item){
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: './knowledge/modal.editcultivate.html',
                controller: 'editcultivateCtrl',
                resolve: {
                    copy: item
                }
            });
            modal.result.then(function () {
                $scope.find(1)
            });
        }
        //查看课件
        $scope.showCourseware=function(course){
          
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: './knowledge/modal.showCourse.html',
                controller: 'showCourseCtrl',
                resolve: {
                    course: course
                }
            });
            modal.result.then(function () {

            });
        }
        
     
        //查看人群
        $scope.showPerson = function (sub,title) {
             if(title=='培训人群'){
                 var url=''
                url='/ovu-pcos/pcos/newknowledge/train/themePerson/'+sub.id   
             }else{
              url='/ovu-pcos/pcos/newknowledge/train/viewdThemePerson/'+sub.id  
             }
             $http.get(url).success(function(resp){
           
                if(resp.code==0){
                    var personList=resp.data
                    personList.length && personList.forEach(v=>{
                        v.jobCode=v.jobCode || v.code
                    })
                    var copy = angular.extend({textRecord:$scope.textRecord,
                        show:$scope.show,showTitle:title,personList:personList}, sub);
                        copy.type = 0;
                        copy.step = 1;
                        var modal = $uibModal.open({
                            animation: false,
                            size: 'lg',
                            templateUrl: './knowledge/showPerson.html',
                            controller: 'showknowledgePersonCtrl',
                            resolve: {
                                sub: copy,
                               
                            }
                        });
                       
                }else{
                   
                }
               }); 
         
            
        }

        //浏览记录
        $scope.showViewd = function (sub) {
         
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: './knowledge/cultivateDetailsModal.html',
                controller: 'checkDetailsCtrl',
                resolve: {
                    sub: sub
                }
            });
            modal.result.then(function () {

            });
        
           
        }     
        //发放和撤回
        $scope.releaseStatus=function(id,flag,item){
              
            var url=''
            var str=''
            if(flag){
                let end = new Date(item.endTime)
                let start = new Date(item.endTime)
                let endTime = end.getTime(end) 
                let startTime = start.getTime(start) 
                var timestamp=new Date().getTime()
                 
                  if(endTime<timestamp && startTime<timestamp ){
                      alert('培训时间必须大于当前时间')
                      return
                  }
                url='/ovu-pcos/pcos/newknowledge/train/releaseStatus/'+id
                str='发放'
           
            }else{
                url='/ovu-pcos/pcos/newknowledge/train/fallbackStatus/'+id
                str='撤回'
            }
          
            confirm("确定" + str + "该条数据吗?", function() {
                $http
                    .get(
                        url
                    )
                    .success(function(resp) {
                        if (resp.code == 0) {
                            $scope.find(1)
                        } else {
                         
                            alert(resp.msg);
                        }
                    });
               
            });
        }  
    });
    //查看课件
    app.controller('showCourseCtrl', function ($scope, $http, fac, $uibModal, $uibModalInstance, course) {
        $http.get("/ovu-pcos/pcos/newknowledge/train/trainList?id="+course.id).success(function(resp){
          
          $scope.courseware=resp.data
          $scope.courseware && $scope.courseware.forEach(v=>{
              v.personListNew=v.personList
              delete v.personList
              
          })
       
        
        })
        $scope.personList=course.personList
        $scope.showPerson = function (sub,title) {
             if(title=='查看人群'){
                sub.personList=sub.viewedPersonList
             }else{
                sub.personList=sub.personListNew 
             }
         
            var copy = angular.extend({textRecord:$scope.textRecord,
            show:$scope.show,showTitle:title}, sub);
            copy.type = 0;
            copy.step = 1;
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: './knowledge/showPerson.html',
                            controller: 'showknowledgePersonCtrl',
                resolve: {
                    sub: copy
                }
            });
            modal.result.then(function () {});
        }
         //浏览记录
         $scope.showViewd = function (sub) {
               
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: './knowledge/cultivateDetailsModal.html',
                controller: 'vieweDetailsCtrl',
                resolve: {
                    sub: sub
                }
            });
            modal.result.then(function () {

            });
        
           
        } 
 
       
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    //浏览记录
    app.controller('checkDetailsCtrl', function ($scope, $http, fac, $uibModal, $uibModalInstance, sub) {
 
        
          $scope.pageModel = {};
        $scope.search = {};
       
          $.extend($scope.search, { currentPage: $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 , id:sub.id});
          fac.getPageResult("/ovu-pcos/pcos/newknowledge/train/viewedThemeList",$scope.search,function (data) {
              $scope.pageModel =data;
  
          });
 
        
       
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    //浏览记录
    app.controller('vieweDetailsCtrl', function ($scope, $http, fac, $uibModal, $uibModalInstance, sub) {
        $scope.pageModel = {};
        $scope.search = {};
       
          $.extend($scope.search, { currentPage: $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 , id:sub.id,coursewareId:sub.coursewareId});
          fac.getPageResult("/ovu-pcos/pcos/newknowledge/train/viewedList",$scope.search,function (data) {
              $scope.pageModel =data;
  
          });
 
        
       
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    
    app.controller("chooseCourseCtrl", function(
        $scope,
        $http,
        fac,
        $uibModalInstance,
        $uibModal,
        course,
        $rootScope
    ) {
     
       

        $scope.config = {
            edit: false,
            showCheckbox: false
        };

        $scope.pageModel = {};
        $scope.search = {};
        $scope.treeData = [];
        $scope.types = [];
        $scope.arr = course.coursewareList || [];
 //列表查询
 $scope.find = function(pageNo) {
   
    $.extend($scope.search, {
        currentPage: pageNo || $scope.pageModel.currentPage || 1,
        pageSize: $scope.pageModel.pageSize || 10,
       
        deptId: $rootScope.dept.id,
        isCopy:0
    });
    if (!$scope.search.cultivateName) {
        $scope.search.ids && delete $scope.search.ids;
    }
    fac.getPageResult(
        "/ovu-pcos/pcos/newknowledge/courseware/list",
        $scope.search,
        function(data) {
            $scope.pageModel = data;
           
            if(course.coursewareList && course.coursewareList.length){
                course.coursewareList.forEach(course=>{
                    $scope.pageModel.data && $scope.pageModel.data.length && $scope.pageModel.data.forEach(v=>{
                     
                        if(course.isCopy==0 && course.id==v.id){
                            v.checked=true
                        }
                        if(course.isCopy==1 && course.parentId==v.id){
                            v.checked=true
                        }
                    })
                })

            }
        }
    );
};
        getParkTree();

        function getParkTree(pageNo, node) {
           
            $http
                .post(
                    "/ovu-pcos/pcos/newknowledge/hierarchy/list",
                    fac.postConfig
                )
                .success(function(res) {
                    $scope.treeClass = res.data;
                    $scope.find(1);
                });
            
            
        }

        $scope.selectNode = function(search, node) {
            if (node.state.selected) {
                $scope.search.ids = node.id;
            } else {
                delete $scope.curNode;
            }
            
          
            $scope.find(1);
        };

       

        //选中所有题目
        $scope.checkAll = function(data) {
            data.checked = !data.checked;
            data.data.forEach(function(n) {
                n.checked = data.checked;
               
            });
            if(data.checked){
                  $scope.arr=data.data
            }else{
                $scope.arr=[]
            }
        };
        //选中课件
        $scope.checkOne = function(item) {
            item.checked = !item.checked;
            if (item.checked) {
                $scope.arr.push(item);
            } else {
                var index = $scope.arr.findIndex(v => {
                    return v.id == item.id;
                });
                $scope.arr.splice(index, 1);
            }
        };

       
      
       
        

      
        
       


        //保存发放课件
        $scope.save = function() {
            if($scope.arr.length==0){
                alert('请选择课件')
                return

            }
            $uibModalInstance.close($scope.arr);
       
        };

        $scope.cancel = function() {
            $uibModalInstance.close();
        };
    });
    app.controller("editcultivateCtrl", function(
        $scope,
        $http,
        fac,
        $uibModalInstance,
        $uibModal,
        copy
    ) {
        $scope.search = {};
        $scope.show = copy.show;
    
       
        $scope.groupIds = [];
        $scope.takeInPersonIds = [];
        $scope.personIds=[]
        var ids =''
        
        $http
        .get(
            "/ovu-pcos/pcos/newknowledge/train/detail/"+copy.id,)
        .success(function(resp) {
            $scope.item=resp.data
          var arr = resp.data.groupList && resp.data.groupList.length && resp.data.groupList.reduce(function(ret, n) {
                 ret.push(n.id);
                return ret;
            }, []) || [];
            $scope.groupIds=arr
            ids=arr.join(',')
            $scope.selectGroud()
            $scope.takeInPersonList=resp.data.personList
        });

        //选择分组
        $scope.selectGroud = function() {
            $http
                .post(
                    "/ovu-pcos/pcos/newknowledge/group/list",
                    {
                        deptId: $scope.item.deptId
                    },
                    fac.postConfig
                )
                .success(function(resp) {
                    if (resp.code == 0) {
                        
                        $scope.groupList = resp.data;
                        $scope.groupList.forEach(v=>{
                            if(ids.indexOf(v.id)!==-1){
                                v.checked=true
                            }
                        })

                    } else {
                        alert(resp.msg);
                    }
                });
        };
        $scope.checkOne = function(item) {
            item.checked = !item.checked;
            if (item.checked) {
                $scope.groupIds.push(item.id);
            } else {
                var index = $scope.groupIds.findIndex(v => {
                    return item.id == v;
                });
                $scope.groupIds.splice(index, 1);
            }
             console.log($scope.groupIds)
            
        };
        //选择课件
        $scope.addCourse=function(item){
            var arr = angular.copy(item.coursewareList)
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: './knowledge/modal.chooseCourse.html',
                controller: 'chooseCourseCtrl',
                resolve: {
                    course: item
                }
            });
            modal.result.then(function (data) {
                // 
                  if(!data){
                      //如果点击取消 则勾选无效
                    item.coursewareList=arr
                  }else{
                    if(item.coursewareList.length){
                        var ids = item.coursewareList.reduce(function(ret, n) {
                            ret.push(n.id);
                           return ret;
                       }, []).join(',');
                       //拷贝的课件
                       var copyId= item.coursewareList.reduce(function(ret, n) {
                        n.isCopy==1 && ret.push(n.parentId);
                       return ret;
                   }, []).join(',');
                    
                       data.forEach(v=>{
                           if(ids.indexOf(v.id)==-1 && copyId.indexOf(v.id)==-1){
                               //如果选中的课件的id 不在之前的数组里面，并且不在拷贝的数据的父id里面
                            item.coursewareList.push(v)
                           }
                       })
                    }else{
                        item.coursewareList=data
                    }
                   
                  }
               
               

            },function() {
                console.info("Modal dismissed at: " + new Date());
            });
        }

       

       

        //下载模板
        $scope.downloadFile = function() {
            var url = "/ovu-pcos/pcos/newknowledge/examine/downloadExcel";
            getBlankTmpl(url);
        };

        function getBlankTmpl(url, type) {
            var elemIF = document.createElement("iframe");
            elemIF.src = url + "?type=" + type;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
        }

        //导入
        $scope.uploadText = function() {
            uploadExcel(function(resp) {
                if (resp.passCode == 0) {
                    $scope.takeInPersonList = resp.data;
                    $scope.takeInPersonList.forEach(v => {
                        $scope.takeInPersonIds.push(v.id);
                    });
                    rtmsg();
                }
            });

            function rtmsg() {
                $scope.workcopyMsg = "导入成功！";
                msg("导入成功！");
                $scope.$apply();
            }
        };

        function uploadExcel(fn) {
            fac.upload(
                {
                    url: "/ovu-pcos/pcos/newknowledge/examine/importPerson",
                    accept:
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                },
                function(resp) {
                    if (resp.success) {
                        fn && fn(resp);
                    } else {
                        alert(resp.error);
                    }
                }
            );
        }

        //保存发放课件
        $scope.save = function(form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
             if($scope.takeInPersonList && $scope.takeInPersonList.length){
                $scope.personIds= $scope.takeInPersonList.reduce(function(ret, n) {
                    ret.push(n.id);
                    return ret;
                }, []);
             } 
            
           
            if ($scope.personIds == "" && !$scope.groupIds.length) {
                alert("请选择人员！");
                return;
            }
             if(!$scope.item.coursewareList || !$scope.item.coursewareList.length){
                alert("请选择课件！");
                return;
            }
            var end = new Date($scope.item.endTime)
           
            var endTime = end.getTime(end) 
           
            var timestamp=new Date().getTime()
             
              if(endTime<timestamp ){
                  alert('培训时间必须大于当前时间,请重新选择')
                  $scope.item.endTime=''
            
                  return
              }
            
           var coursewareId= $scope.item.coursewareList.reduce(function(ret, n) {
                ret.push(n.id);
                return ret;
            }, []);
            
            var params = {
                title: $scope.item.title,
                content: $scope.item.content,
                startTime: $scope.item.startTime,
                endTime: $scope.item.endTime,
                personIds: $scope.personIds.join(","),
                coursewareIds: coursewareId.join(","),
               
                deptId: $scope.item.deptId,
                groupIds: $scope.groupIds.join(","),
                id:copy.id
            };
           

           
            $http
                .post(
                    "/ovu-pcos/pcos/newknowledge/train/edit",
                    params,
                    fac.postConfig
                )
                .success(function(resp) {
                    if (resp.code == "0") {
                        $uibModalInstance.close();
                        $scope.ids = [];
                        msg(resp.msg);
                    } else {
                        alert(resp.msg);
                    }
                });
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
    });
   
   

 
})()
