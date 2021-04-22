(function (angular) {
    var app = angular.module('angularApp');
    app.controller('artificialReportCtrl', ['$scope', '$rootScope', '$uibModal', '$http', '$filter', 'fac', '$log', '$sce',function($scope, $rootScope, $uibModal, $http, $filter, fac, $log,$sce) {
        document.title = '人工巡查报告';
        $scope.pageModel = {};
        $scope.search = {
            time: $filter('date')(new Date(), 'yyyy-MM-dd'),
            score: 0,
            type:1,
            insPointType:'',
          

        }
        $scope.childTree=[]
        app.modulePromiss.then(function () {
            $scope.$watch("dept.id", function (deptId, oldValue) {
              
                if (deptId) {
                    if (!$scope.dept.parkId) {
                        alert("请选择项目下的部门");
                        $scope.search.parkId && delete $scope.search.parkId;
                        $scope.search.parkName && delete $scope.search.parkName;
                        $scope.childTree=[]
                        $scope.postList=[]
                        return
                   
                    }
                    $scope.childTree=[]
                    $scope.search.postList=[]
                    $scope.search.deptId=deptId
                    $scope.search.nodeText=''
                  
                    $rootScope.execTreeNode($rootScope.deptTree, function(
                        node
                    ) {
                       
                        if (node.id && (node.id==deptId)) {
                         
                          $scope.childTree=node.nodes || []
                        }
                        
                    });
                    $http.get("/ovu-base/pcos/person/getPost?id="+$scope.search.deptId).success(function(res){
                        $scope.search.postList = res;
                       })
                
                    $scope.findAllWay($scope.search.deptId);
                  
                    
                }

               

            
            });
          
               
      
           

        })
        // 存储路线列表
        $scope.insWayList = [];
         // 查询路线列表
         $scope.findAllWay = function (deptId,id) {
            var params={pdeptId:deptId,insType:2,postId:id}
            $http.post('/ovu-pcos/pcos/inspection/insway/list.do?', params, fac.postConfig).success(function (data) {
                if (data.code == 0) {
                 $scope.insWayList=data.data|| [];
                
                } else {
                    alert(data.msg);
                }
            })
        };
      
        $scope.setDept = function(search,node){
            if(node){
                $scope.search.deptId = node.id;
           }else{
            $scope.search.deptId = $scope.dept.id;
           }
           $http.get("/ovu-base/pcos/person/getPost?id="+$scope.search.deptId).success(function(res){
            $scope.search.postList = res;
           })
    
        $scope.findAllWay($scope.search.deptId);
      }
       
        
        // 查询报告列表
        $scope.find = function (pageNo, id) {
            
           
            $scope.search.personName = $scope.search.user?$scope.search.user.name:undefined;
            $.extend($scope.search, {currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10});
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-pcos/pcos/inspection/insvideo/resultList1.do", $scope.search, function (data) {
                $scope.pageModel = data;
                // $scope.pageModel.totalPage = $scope.pageModel.totalCount;
                $scope.pageModel && $scope.pageModel.forEach(e=>{
                    e.insItemName=[]
                    e.itemList && e.itemList.forEach(v=>{
                        e.insItemName.push(v.name)
                    })
                    e.insItemName= e.insItemName && $sce.trustAsHtml(e.insItemName.map(function (v, i) {
                        return (i + 1) + '.' + v;
                    }).join('<br>'))
                  
                   
                })
            });
        };

        // 导出文件
        $scope.exportFile = function () {
            if(!$scope.search.time){
               alert('请选择巡查时间');
               return
            }
            
            $scope.search.domainId = $rootScope.user.domainId;
            $scope.search.type = 1;
                window.location.href='/ovu-pcos/pcos/inspection/export/exportInsResult?pagesize='+ $scope.search.pageSize+"&time="
                +$scope.search.time+"&type="+$scope.search.type+"&domainId="+$scope.search.domainId+"&deptId="
                +$scope.search.deptId+"&insPointType="+$scope.search.insPointType+"&score="+$scope.search.score+"&insWayId="+$scope.search.insWayId;
            
            
            
        }
        // 展示所有图片
        $scope.showPictures = function (data) {
            data = data || "/res/img/detail.png";
            var urls = data.split(",");
            var modalInstance = $uibModal.open({
                animation: false,
                size: 's',
                templateUrl: '/view/inspection/report/modal.showPictures.html',
                controller: 'showPicCtrl', 
                resolve: {
                    task: function () {
                        return urls;
                    } 
                }
            });
            // 弹出框确认和取消后的回调函数
            modalInstance.result.then(function () {
                // $scope.find();
            }, function () {
                // $scope.find();
            });
        }
    }])

    // 图片显示框的控制器
    app.controller("showPicCtrl", function($scope, $rootScope, $uibModal, $http, $filter, fac, $log, $uibModalInstance, task) {
        $scope.images = task;
        var index = 0;
        $scope.currentUrl = $scope.images[index];
        // 切换图片到上一张
        $scope.prevImage = function() {
            index--;
            if(index < 0) {
                index = $scope.images.length
            }
            $scope.currentUrl = $scope.images[index];
        }
        // 切换到下一张
        $scope.nextImage = function() {
            index++;
            if(index>$scope.images.length) {
                index = 0;
            }
            $scope.currentUrl = $scope.images[index];
        }
        $scope.save = function() {
            $uibModalInstance.close();
        }
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }
    })
})(angular)