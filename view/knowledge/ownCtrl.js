(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('personScoreCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "考试记录";
        $scope.pageModel = {};
        $scope.search={};
        $scope.data={}
       
      
        app.modulePromiss.then(function () {

            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    $scope.search.deptId = deptId
                    $scope.search.text && delete $scope.search.text
                    $scope.find(1)
                }
                
            })
        })

        

        //查看人群
        $scope.showPerson = function (sub) {
        
            var copy = angular.extend({showTitle:'考试人群'}, sub);
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
            modal.result.then(function () {});
        }
       
        //列表查询
        $scope.find = function (pageNo) {
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10});
            fac.getPageResult("/ovu-pcos/pcos/newknowledge/examine/list", $scope.search, function (data) {
                $scope.pageModel = data;
              console.log(data)
            });
        };

        //考试结果
        $scope.testResultModal = function (sub) {
           
            var copy = angular.extend({examineId:sub.id,isSaveMaxScore:0}, sub);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: './knowledge/modal.testResultModal.html',
                controller: 'testResultModalCtrl1'
                , resolve: { sub: copy }
            });
            modal.result.then(function () {
                $scope.find()
            });
        }

       
    });
  
    //考试结果
    app.controller('testResultModalCtrl1', function ($scope, $http, fac,$uibModal, $uibModalInstance, sub) {
     
        $scope.search = {}
        $scope.item = sub || {};
        $scope.item.isSaveMaxScore=0 
        $scope.pageModel={}
        $scope.data={}
        $scope.find=function(pageNo,n,flag){
            $scope.n=n       
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10,examineId:sub.id,isSaveMaxScore:$scope.n,isSubmit:$scope.item.isSubmit});
            fac.getPageResult("/ovu-pcos/pcos/newknowledge/result/list",$scope.search,function (data) {
                if(!flag){
                    $scope.data=data
                    if(data.minScore==undefined){
                        data.minScore='-'
                    }
                    if(data.maxScore==undefined){
                        data.maxScore='-'
                    }
                    if(data.passCount==undefined){
                        data.passCount='-'
                    }
                    if(data.attendCount==undefined){
                        data.attendCount='-'
                    }
                }else{
                    $scope.data.isAllMark=data.isAllMark 
                }
                
              
                
                $scope.pageModel=data.pageResult
                $scope.pageModel.totalPage=$scope.pageModel.pageTotal
                $scope.pageModel.currentPage = $scope.pageModel.pageIndex + 1;
                $scope.pageModel.totalRecord =  $scope.pageModel.totalCount;
                
                var list = [1, $scope.pageModel.currentPage - 1, $scope.pageModel.currentPage, $scope.pageModel.currentPage + 1, $scope.pageModel.totalPage];
                var pages = [];
                var hash = {};
                list.forEach(function (v) {
                    if (!hash[v] && v <= $scope.pageModel.totalPage && v > 0) {
                        hash[v] = true;
                        pages.push(v);
                    }
                })
                if (pages.length > 2 && pages.indexOf(2) == -1) {
                    pages.splice(1, 0, '······');
                }
                if (pages.length > 2 && pages.indexOf($scope.pageModel.totalPage - 1) == -1) {
                    pages.splice(pages.length - 1, 0, '······');
                }
                $scope.pageModel.pages = pages;          
            });
        }
        $scope.find(1,0)

        //设置是否为最高分
        $scope.setIsSaveMaxScore=function(item,pageNo){    
            if(item==1){
                $scope.find(1,1,true)
        }else if(item==0){
            $scope.find(1,0,true)
        }
            }
            $scope.setIsSaveMaxScore($scope.item.isSaveMaxScore,1)
        //考试分析
        $scope.changeIndex=function(index,pageNo){
         
            $scope.hide=false
            if(index==1){
                $scope.hide=true
               
                if($scope.data.isAllMark==0){
                    //考试没有结束
                    alert('答题分析未公布！')
                    return

                }
            $.extend($scope.search, {currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10,examineId:sub.id});
            $http.post("/ovu-pcos/pcos/newknowledge/result/analyse",$scope.search,fac.postConfig).success(function(data){
           
                if(data.code==0){
                    $scope.pageModel1=data.data
                    
                }else{
                    alert(data.msg) 
                }
               });  
            }else{
                $scope.setIsSaveMaxScore($scope.item.isSaveMaxScore,1)
            }
        }
        
        //导出
         $scope.downloadFile = function(){
            var url="/ovu-pcos/pcos/newknowledge/result/export";
            getBlankTmpl(url);
        }
        function getBlankTmpl(url){
           
            var elemIF = document.createElement("iframe");
            elemIF.src = url+"?examineId="+$scope.item.id;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
        }
        //评分
        $scope.gradeModal = function (sub) {
            var copy = angular.extend({}, sub);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: './knowledge/modal.gradeModal.html',
                controller: 'gradeModalCtrl'
                , resolve: { sub: copy }
            });
            modal.result.then(function () {
                $scope.find()
            });
        }

    

        //查看详情
        $scope.showEditModal = function (sub) {
            if(sub.isSubmit!=1){
                return
            }
            var copy = angular.extend({}, sub);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: './knowledge/subjectDetail.html',
                controller: 'subjectDetailCtrl'
                , resolve: { sub: copy }
            });
            modal.result.then(function () {

            });
        }
        //关闭       
        $scope.cancel = function () { 
            $uibModalInstance.dismiss('cancel');
        };
    });

    app.controller('subjectDetailCtrl', function ($scope, $http, fac, $uibModal,$uibModalInstance, sub) {
        $scope.pageModel = {};
       $scope.item=sub||{}
  

       $http.post("/ovu-pcos/pcos/newknowledge/result/detail",{resultId:sub.id},fac.postConfig).success(function(data){
   
        if(data.code==0){
            
            $scope.pageModel=data.data
            $scope.pageModel && $scope.pageModel.subjectDetail.length && $scope.pageModel.subjectDetail.forEach((v ,i)=>{
                if(v.type==4){
                    //返回值 _$fffd$_$cffc$_
                    v.chooseCopy=v.choose.split('_$')  // ["", "fffd$", "cffc$_"]
                    v.chooseCopy=  v.chooseCopy.join(',') //,fffd$,cffc$_
                 
                    v.chooseCopy=v.chooseCopy.replace(/,/g,'') //fffd$cffc$_
                    v.chooseCopy=v.chooseCopy.replace(/_/g,'') //fffd$cffc$
                   
                     if(v.chooseCopy.lastIndexOf( "$" )==v.chooseCopy.length-1){
                         //截取末尾的 $
                        v.chooseCopy= v.chooseCopy.substr(0,v.chooseCopy.length-1)    //fffd$cffc
                        
                        
                     }
                     if(v.chooseCopy.indexOf( "$" )==0){
                         //截取开头的 $
                        v.chooseCopy= v.chooseCopy.substr(1,v.chooseCopy.length-1)    //fffd$cffc
                        
                     }
                   
                    v.chooseCopy=v.chooseCopy.split('$') //["fffd", "cffc"]
                    var arr=[]
                    v.chooseCopy.length &&  v.chooseCopy.forEach(cho=>{
                      cho='('+cho+')'
                     arr.push(cho)
                        
                    })
                    v.chooseNewArr=arr
                   
             
                }
              })
              
        }else{
            alert('获取详情失败！')
        }
       });    
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }); 

    //评分
    app.controller('gradeModalCtrl', function ($scope, $http, fac, $uibModalInstance, sub) {
        $scope.item = sub || {};
        $scope.subjectIds=[]
        $scope.score=[]
  
        $scope.pageModel=sub.subjectDetail
       


        $scope.getScore5=function(v,p){  
         
               
                if(v>p){
                    $scope.item.subjectDetail.forEach(n=>{
                        if(n.score==v){
                            n.score=''
                        }
                    })
                    alert('评分不得高于问答题分数！')                   
                    return;
                }                                      
        }
    
        $scope.save=function(sub){             
            $scope.score=[]
            $scope.subjectIds=[]
            sub.subjectDetail.forEach((n)=>{
                $scope.subjectIds.push(n.id),
                $scope.score.push(n.score)                    
            })
           $http.post("/ovu-pcos/pcos/newknowledge/result/marking",{ subjectIds:$scope.subjectIds.join(','),score:$scope.score.join(','),id:sub.id},fac.postConfig).success(function(data){
            if(data.code==0){
                msg('评分成功！')
                $uibModalInstance.close() 
            }else{
                alert('评分失败！')
            }
           });    
         
        } 

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
})();
