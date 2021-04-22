/**
 * 巡查任务计划控制器
 */
(function () {
    var app = angular.module("angularApp");
    // app.directive('wdatePicker', function () {
    //     return {
    //         restrict: "A",
    //         require: '?ngModel',
    //         //  scope: {},
    //         link: function (scope, element, attrs, ngModel) {
    //             if (!ngModel) return;
    //             element.bind('click', function () {
    //                 window.WdatePicker({
    //                     dateFmt : "HH:mm",
    //                     onpicked: function () { element.change() },
    //                     oncleared: function () { element.change() }
    //                 })
    //             });
    //             element.on("blur",function () {
    //                 var val = this.value;
    //                 scope.$apply(function () {
    //                     ngModel.$setViewValue(val);
    //                 });
    //             })
   
    //         }
    //     }
    // });
    app.controller('instaskCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "巡查任务计划";
        
        $scope.pageModel = {};
        $scope.search = {};
        $scope.insItemTypeId = {};
        // $scope.search.date=moment().format('YYYY-MM-DD')
      
        $scope.find = function (pageNo, insItemTypeId) {
            
            if (angular.isDefined(insItemTypeId)) {
                $scope.search.insItemTypeId = insItemTypeId;
            }

            $.extend($scope.search, {
                currentPage: pageNo || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-pcos/pcos/inspection/instask/select.do", $scope.search, function (data) {
                $scope.pageModel = data;
                  $scope.pageModel.data  &&  $scope.pageModel.data.forEach(function(v,index){
                     
                      v.lng=0
                   v.insTaskParamBo && v.insTaskParamBo.forEach(function(t){
                    v.lng+=t.insTaskList.length
                   })
                });
               
               

            });
        };
        //初始化方法
        app.modulePromiss.then(function () {
            function getPostion() {
                var position = []
    
                function getNode(nodes) {
                    nodes && nodes.forEach(function (n) {
                        if (n.id == $scope.dept.parkId) {
                            position = n
                        } else {
                            if (n.nodes && n.nodes.length) {
                                getNode(n.nodes)
                            }
                        }
                    })
                }
                getNode($rootScope.parkTree)
                return position
            };
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if(!$scope.node.parkId){
                    // alert('请选择叶子节点');
                    $scope.isPark=false
                }else{
                    $scope.isPark=true 
                }
                if(deptId){
                        $scope.park = getPostion();
                          $scope.search.deptId=deptId            
                          fac.setInsitemtypeTree().then(function (insTreeData) {
                            if (insTreeData && insTreeData[0]) {
                                $scope.search.insItemTypeId = $scope.insTreeData[0].id;
                                $scope.insTreeData[0] && ($scope.insTreeData[0].state={}) && ($scope.insTreeData[0].state={selected:true}) && $scope.selectNode('',$scope.insTreeData[0]);
                            }
                        });
                    }
               
               
               
            })


        })

        //设置巡查点弹出框
        $scope.showModal = function (item) {
            if(!$scope.isPark){
                alert('请选择叶子节点');
                return
            }
            var copy = angular.extend({park:$scope.park}, item);
            copy = angular.extend(copy, {
                deptId: $scope.search.deptId,

            });
            var modal = $uibModal.open({
                animation: false,
                templateUrl: '/view/inspection/instask/modal.inspection.instask.html',
                controller: 'insInstaskEditModalCtrl',
                size: 'lg',
                resolve: {
                    param: copy
                }
            });
            modal.result.then(function () {
                fac.setEquipTypeTree();
                $scope.find()
            },function () {
                fac.setEquipTypeTree();
                $scope.find()
            });
        }



        //选择该节点
        $scope.selectNode = function (search,node) {
          
            if (node.state.selected) {
                
                $scope.find(1, node.id);
            } 
        }



    });

    app.controller('insInstaskEditModalCtrl', function ($scope, $http, $uibModalInstance, $uibModal, $filter, fac, param) {
        $scope.item = {};
        $scope.pageModel = {}
        $scope.search = {
            deptId: param.deptId
        }
        $scope.insItemName = param.insItemName
        $scope.description = param.description;
        $scope.patrolTimeList = []
        if (param.insTaskParamBo) {
            $scope.patrolTimeList = param.insTaskParamBo;
            // param.insTaskParamBo && param.insTaskParamBo.forEach(function (v, i) {
            //     v.name = v.insPointName;
            //     var list = []
            //     v.insTaskList && v.insTaskList.forEach(function (n, i) {
            //         list.push(n.insTime);
            //         v.beginData1 = list[0] || '';
            //         v.beginData2 = list[1] || '';
            //         v.beginData3 = list[2] || '';
            //         v.beginData4 = list[3] || '';
            //         v.beginData5 = list[4] || '';

            //     })
                
            // })
           

        }
  

        //查询巡查点列表
        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-pcos/pcos/inspection/inspoint/page.do", $scope.search, function (data) {
                $scope.pageModel = data;
                //分页回选
                $scope.pageModel.data && $scope.pageModel.data.forEach(function (v) {
                    $scope.patrolTimeList && $scope.patrolTimeList.forEach(function (n) {
                        if (n.insPointId == v.insPointId) {
                            v.checked = true;
                        }
                    })
                })

            });
        }
        $scope.find(1);

        //选择巡查点
        $scope.checkOne = function (item, data) {
            item.checked = !item.checked;
            if (data && data.data) {
                data.checked = data.data.every(function (v) {
                    return v.checked;
                });
            };
            if (item.checked) {
                var isSelected = false;
                $scope.patrolTimeList && $scope.patrolTimeList.forEach(function (v) {
                    if (v.insPointId == item.insPointId) {
                        isSelected = true;
                    }

                })
                //在编辑状态下如果在编辑前没有被选中的才加入
                if (!isSelected) {
                    $scope.patrolTimeList.push(item);
                }

            } else {
                //否则取消
                var i = 0;
                $scope.patrolTimeList && $scope.patrolTimeList.forEach(function (v) {
                    if (v.insPointId == item.insPointId) {
                        $scope.patrolTimeList.splice(i, 1);
                        return;

                    }
                    i++;
                })
            }

        }
        //选择所有巡查点
        $scope.checkAll = function (data) {
            data.checked = !data.checked;
            data.data.forEach(function (n) {
                n.checked = data.checked
                var isSelected = false;
                $scope.patrolTimeList && $scope.patrolTimeList.forEach(function (item) {
                    if (n.insPointId == item.insPointId) {
                        isSelected = true;
                    }

                })
                //在编辑状态下如果在编辑前没有被选中的才加入
                if (!isSelected) {
                    $scope.patrolTimeList.push(n);
                }
                if (!n.checked && isSelected) {
                    var i = 0;
                    $scope.patrolTimeList.forEach(function (v) {
                        i++;
                        if (v.insPointId == n.insPointId) {
                            $scope.patrolTimeList.splice(i - 1, 1);
                        }
                    })

                }


            });


        }
        //删除某一项巡查点
        $scope.delTodoItem = function (item) {
            $scope.patrolTimeList.splice($scope.patrolTimeList.indexOf(item), 1);
            $scope.pageModel.data.forEach(function (v, i) {
                if (v.insPointId == item.insPointId) {
                    v.checked = false;
                    $scope.pageModel.checked = false;
                }
            })

        }
        //复制第一行的所有巡查时间
        // $scope.copyTime=function(item){
        //     confirm("是否复制巡查时间?", function () {
        //         $scope.patrolTimeList.forEach(function(v,i){
        //             if(i!==0){
        //                v.beginData1 = item.beginData1 || ''
        //                v.beginData2 = item.beginData2 || ''
        //                v.beginData3 = item.beginData3 || ''
        //                v.beginData4 = item.beginData4 || ''
        //                v.beginData5 = item.beginData5 || ''
                       
       
        //             }
        //          })

        //          $scope.$apply();
        //     });
        
        // }
        //查看位置
        $scope.showLocation = function (item) {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/quality/point/modal.point.getLocation.html',
                controller: 'GetLocationController',
                resolve: {
                    param: {
                        latitude: item.latitude,
                        longitude: item.longitude,
                        park:param.park
                    }
                }
            });
            modal.result.then(function () {
                $scope.find();
            });
        }

        $scope.save = function (form, item) {
            var flag=true;
            var list = [];
            if ($scope.patrolTimeList.length == 0) {
                alert('请选择巡查点');
                return
            }
            
            $scope.patrolTimeList && $scope.patrolTimeList.forEach(function (v) {
                v.deptId = param.deptId;
                v.insItemId = param.insItemId
                v.arr = [];
                 var ids=[];
                 
                
                // v.beginData1 && v.arr.push(v.beginData1);
                // v.beginData2 && v.arr.push(v.beginData2);
                // v.beginData3 && v.arr.push(v.beginData3);
                // v.beginData4 && v.arr.push(v.beginData4);
                // v.beginData5 && v.arr.push(v.beginData5);
                

                // v.insTime = v.arr.join(',');
                // if(repeat(v.arr)){
                //     flag=false
                //     alert('巡查信息重复');
                //    return
                // }
                // function repeat(arr)
                // {
                //    return /(\x0f[^\x0f]+)\x0f[\s\S]*\1/.test("\x0f"+arr.join("\x0f\x0f") +"\x0f");
                // }
                
                // // v.ids=ids;
                // // if(ids.length<=arr.length){
                // //        ids=ids
                // // }else{
                // //      ids=ids.splice(0,arr.length)
                // // }
                // if (v.insTime) {
                //     list.push({
                //         insItemId: v.insItemId || '',
                //         insPointId: v.insPointId || '',
                //         insTime: v.insTime || '',
                //         // id: v.ids
                //     });
                // } else {
                //     flag=false;
                //     alert('请给巡查项填写对应的巡查时间');
                // }
               

            });
           
           
            var params = {
                insTaskBo: list,
                deptId: param.deptId,
                insItemId: param.insItemId,
            }
            
           if(flag){
            $http.post("/ovu-pcos/pcos/inspection/instask/save.do", params).success(function (data, status, headers, config) {
                if (data.code == "0") {
                    msg(data.msg);
                    $uibModalInstance.close();

                } else {
                    alert(data.msg);

                }
            })
           }
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
            
            
        };

    });
   
})();
