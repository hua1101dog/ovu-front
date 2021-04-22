(function () {
    var app = angular.module("angularApp");
    app.controller('videoInsManageCtrl', function ($scope, $rootScope, $window, $timeout, $uibModal, $http, $filter, fac) {
        document.title = "视频巡查处理";
        $scope.pageModel = {};
        $scope.search = {};
        $scope.search.type = 2
        // $scope.search.status = 0;
        $scope.checkedList=[]
        $scope.search = {
            createTime:moment().format('YYYY-MM-DD')
        };
        $scope.isNext=true
        $scope.isBefore=true
        $scope.img={}
        app.modulePromiss.then(function () {

            // fac.initPage($scope, function () {
            //     $scope.init();

            // }, function () {
            //     $scope.init();
            // });
            $scope.$watch('dept.id', function (deptId, oldValue) {
                // if(!scope.node.parkId){
                //     alert('请选择叶子节点');
                //     return

                // }
                if(deptId){
                      $scope.search.deptId=deptId
                      $scope.init();
                   }
            })

        })
            $scope.init=function(){
                $scope.findAllWay();


            }
       // 查询路线列表
       $scope.findAllWay = function () {
        $http.get('/ovu-pcos/pcos/inspection/insway/list?pdeptId=' + $scope.search.deptId+'&insType=1').success(function (resp) {
            if (resp.code == 0) {
             $scope.isnWayList=resp.data|| [];
             if($scope.isnWayList.length>0){
                $scope.search.insWayIds=$scope.isnWayList[0].insWayId
                $scope.find(1,0);
             }

            }
        })
    };

        //查询处理列表
        $scope.find = function (pageNo,flag) {
                if(!$scope.search.insWayIds){
                    alert('请选择路线')
                    return
                }
               

            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            // if($scope.search.status==0){
            //      url='/ovu-pcos/pcos/inspection/insvideo/list.do'
            // }else{
            //      url='/ovu-pcos/pcos/inspection/insvideo/resultList.do'
            // }
            url='/ovu-pcos/pcos/inspection/insvideo/list.do'
            fac.getPageResult(url, $scope.search, function (data) {
                $scope.pageModel = data;
                $scope.pageModel.data = data.data || [];
                  $scope.pageModel.data && $scope.pageModel.data.forEach(function(v){
                  
                    v.imgPaths && (v.imgPaths=v.imgPaths.split(','));
                   
                    if(v.score == undefined){
                        v.score=1
                    }
                   
                    v.captureTimes && (v.captureTimes=v.captureTimes.split(','));
                    v.handles && (v.handles=v.handles.split(','));
                    v.insResultId && (v.insResultId=v.insResultId.split(','));
                    v.newList=[];
                    v.imgPaths && v.imgPaths.forEach(function(img,i){
                        v.newList.push({img:img,insResultId:v.insResultId[i],handles:v.handles[i]})
                    })
                  
                })
             


            });

        };
          //点击图片右下角
        $scope.chooseItem=function(item){
            
        
            if(item.handles=='1' || item.handles=='2'){
                item.handles='0'
                var index =  $scope.checkedList.findIndex((v,i)=>{
                    return item==v
                 })
                 $scope.checkedList.splice(index,1)
            }else{
                item.handles='2'
                $scope.checkedList.push(item)
            }
          
            
        }
       //查看巡查内容及标准

        $scope.showModal = function (id) {
            var copy = angular.extend({}, {insPointId:id});
            // copy = angular.extend(copy, {
            //     deptId: $scope.search.deptId
            // });
            var modal = $uibModal.open({
                animation: false,
                templateUrl: '/view/inspection/videoInsManage/modal.inspection.videoInsManage.html',
                controller: 'showModalCtrl',
                size: 'lg',
                resolve: {
                    data: copy

                }
            });
        }
           // //显示图片
           $scope.showPhoto = function (src, imgList) {
            $("#sImg").attr('src', src);
            var src = event.srcElement.getAttribute("src") || src;
            if (src && src.indexOf("?imageView2") > -1) {
                src = src.substr(0, src.indexOf("?imageView2"));
            }
           
          
            var index = imgList.findIndex((v,i)=>{
                return src==v.img
             })
               $scope.img.handles=imgList[index].handles
            $scope.curPic = {
                url: src,
                on: true
            };
            //下一张图片
            if(imgList.length==1){
                $scope.isNext=false
                $scope.isBefore=false
            }else if(index==0){
                $scope.isBefore=false
                $scope.isNext=true
            }else if(index==imgList.length-1){
                $scope.isNext=false
                $scope.isBefore=true
            }else{
                $scope.isNext=true
                $scope.isBefore=true
            }


            $scope.next = function () {
                index++
                $scope.curPic = {
                    url: imgList[index].img,
                    on: true
                }
                $scope.img.handles=imgList[index].handles

                    if (index == imgList.length - 1) {
                      $scope.isNext=false
                      $scope.isBefore=true
                        return
                    }
                    $scope.isNext=true
                    $scope.isBefore=true

                },
                $scope.before = function () {
                    index--
                    $scope.img.handles=imgList[index].handles
                    $scope.curPic = {
                        url: imgList[index].img,
                        on: true
                    }
                    $scope.isNext=true
                    $scope.isBefore=true
                    if (index == 0) {
                        $scope.isBefore=false
                        $scope.isNext=true
                        return
                    }


                }
                 //点击图片详情之后 点击右下角
        $scope.chooseBigItem=function(){
            if($scope.img.handles=='1' || $scope.img.handles=='2'){
                $scope.img.handles='0'
                imgList[index].handles='0'
                var index1 = $scope.checkedList.findIndex((v,i)=>{
                    return imgList[index]==v
                 })
                 $scope.checkedList.splice(index1,1)
            }else{
                $scope.img.handles='2'
                imgList[index].handles='2'
                $scope.checkedList.push(imgList[index])
            }
        }


        }
        //用户点击否弹出框
        $scope.showUnqualified = function (item) {
            var copy = angular.extend({}, item);
            copy = angular.extend(copy, {
               deptId: $scope.search.deptId,
               status:$scope.search.status
            });
            var modal = $uibModal.open({
                animation: false,
                templateUrl: '/view/inspection/videoInsManage/modal.inspection.Unqualified.html',
                controller: 'UnqualifiedModalCtrl',
                size: 'md',
                resolve: {
                    param: copy

                }
            });
            modal.result.then(function (data) {
                angular.extend(item, {resultList:data})
            });
        }
       
        //一键保存
        $scope.save = function () {
            //弹出一键处理弹出框
           
            // copy = angular.extend(copy, {
            //    deptId: $scope.search.deptId,
            //    status:$scope.search.status
            // });
            var params={};
            var insResultIdList=[]
          
            var modal = $uibModal.open({
                animation: false,
                templateUrl: '/view/inspection/videoInsManage/modal.inspection.deal.html',
                controller: 'dealModalCtrl',
                size: 'md',
                resolve: {
                    param: function(){
                        return $scope.checkedList
                    }

                }
            });
            modal.result.then(function (data) {
                // angular.extend(item, {resultList:data})
                params=data
              
                $scope.checkedList.forEach(function(v){
                    v.deptId=$scope.search.deptId;
                    if(v.handles=='2'){
                        v.handles='1'
                    }
                    for(var k in data){
                         v[k]=data[k]
                    }
                   })
               
                   save($scope.checkedList)
            });
            
            //    $scope.pageModel.data.forEach(function(v){
            //     arr.push({
            //         insResultId:v.insResultId, //巡查任务id,
            //         score:v.score,
            //         deptId: $scope.search.deptId,
            //         resultList:v.resultList || []
            //     })

            //    })
             
            function save(param){
           $http.post("/ovu-pcos/pcos/inspection/insvideo/save", param).success(function (data, status, headers, config) {
                if (data.code == 0) {
                    msg(data.msg);
                    $scope.find();
                    $scope.checkedList=[]
                } else {
                    alert(data.msg);


                }
            })
            }


           
        }

    });



    //显示巡查内容及标准
    app.controller('showModalCtrl', function ($scope, $http, $uibModalInstance, $filter, $timeout, fac, data) {

        $http.get('/ovu-pcos/pcos/inspection/insvideo/getDescription', {
            params: data
        }).success(function (resp) {
            if (resp.code == 0) {
                $scope.content = resp.data;

            }
        })
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });
     //显示问题描述
     app.controller('UnqualifiedModalCtrl', function ($scope, $http, $uibModalInstance, $filter, $timeout, fac, param) {
         $scope.item={}
         $scope.item.resultList=[];
         angular.extend($scope.item,param);

        //根据任务Id 获取巡查项列表  insItemList
            $scope.status=param.status;
        var pm={insPointId:param.insPointId}

        if($scope.status==1){
            $http.get('/ovu-pcos/pcos/inspection/insvideo/getFeedBack', {
                params: {insResultId:param.insResultId}
            }).success(function (resp) {
                if (resp.code == 0) {
                    $scope.item.resultList = resp.data || [];
                    // $scope.insItemList &&  $scope.insItemList.forEach(function(v){
                    //     $scope.item.resultList.forEach(function(item){
                    //          if(item.insItemName==v.name){
                    //             item.insItemId=v.insItemId
                    //          }
                    //     })
                    // });

                }
            })
        }else{
            $http.get('/ovu-pcos/pcos/inspection/insvideo/getDescription', {
                params: pm
            }).success(function (resp) {
                if (resp.code == 0) {
                    $scope.insItemList = resp.data;

                }
            })
        }
        //添加评价
        $scope.addEva=function(){
            $scope.item.resultList.push({})
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.Delete=function(item){
            $scope.item.resultList.splice( $scope.item.resultList.indexOf(item), 1);
        }
        $scope.save=function(form,item){
            form.$setSubmitted(true);
                    if (!form.$valid) {
                        return;
            }

            $uibModalInstance.close($scope.item.resultList);
        }

    });
     //显示一键处理
     app.controller('dealModalCtrl', function ($scope, $http, $uibModalInstance, $filter, $timeout, fac,param) {
        $scope.item={score:'1'}
       

       //根据任务Id 获取巡查项列表  insItemList
    //        $scope.status=param.status;
    //    var pm={insPointId:param.insPointId}

   
      
       $scope.save=function(form,item){
           form.$setSubmitted(true);
                   if (!form.$valid) {
                       return;
           }

           $uibModalInstance.close($scope.item);
       }
       $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

   });

})()
