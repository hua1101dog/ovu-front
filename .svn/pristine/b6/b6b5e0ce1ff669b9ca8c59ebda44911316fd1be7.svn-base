// 巡查线路分配
(function () {
    var app = angular.module("angularApp");

    app.controller('assignedWayCtrl', function ($scope, $rootScope, $uibModal, $http, $filter, fac, $timeout) {
        document.title = "巡查路线分配";
        $scope.search = {};
        var params;
        $scope.postTree = []
        $scope.childTree=[]
        $scope.auth={}
        $scope.search={}
        app.modulePromiss.then(function () {
            $scope.$watch("dept.id", function (deptId, oldValue) {
              
                if (deptId) {
                    if (!$scope.dept.parkId) {
                        alert("请选择项目下的部门");
                        $scope.search.parkId && delete $scope.search.parkId;
                        $scope.search.parkName && delete $scope.search.parkName;
                        $scope.childTree=[]
                        $scope.postTree=[]
                         return
                   
                    }
                    $scope.childTree=[]
                    $scope.search.postTree=[]
                    $scope.search.deptId=deptId
                    $scope.auth.nodeText=''
                  
                    $rootScope.execTreeNode($rootScope.deptTree, function(
                        node
                    ) {
                       
                        if (node.id && (node.id==deptId)) {
                         
                         $scope.childTree=node.nodes || []
                        }
                        
                    });
                   
                    init({ deptId: $scope.search.deptId, showCnt: true })
                    $scope.search.postName =''
                    
                }

               

            
            });
          
               
      
           

        })
     
        function init(params) {
            fac.getPostTree(params).then(function (tree) {
               

                $scope.postTree = tree
                $rootScope.expandAll($scope.postTree)
            });

        }


        $scope.selectType = function (host, node) {
            if(node){
                $scope.search.deptId = node.id;
           }else{
            $scope.search.deptId = $scope.dept.id;
           }
          
            params = { deptId: $scope.search.deptId, showCnt: true }
            init(params);

            $scope.search.postName =''

        }
    

        //查询人员
        function getPerson() {
            if (!$scope.search.deptId) {
                return;
            }

            $scope.inswaytaskList = []
            $.extend($scope.search, { currentPage: 1, pageSize: 9999, jobStatus: '1,2' });
            fac.getPageResult("/ovu-base/pcos/person/listByGrid.do", $scope.search, function (data) {
                $scope.personList = data.list;
                if ($scope.personList.length == 1) {
                    $scope.personId = $scope.personList[0].id
                    $scope.personName = $scope.personList[0].name
                }
                //查询巡查点列表
                $http.post('/ovu-pcos/pcos/inspection/inswaytask/config/page', $scope.search, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        // setMapBounds(resp.data);
                        $scope.inswaytaskList = resp.data.data
                        $scope.inswaytaskList && $scope.inswaytaskList.forEach(function (n) {
                            n.taskList && n.taskList.forEach(e => {
                                // $scope.personList && $scope.personList.forEach(person=>{
                                //       if(person.name==e.personName){
                                //         e.personId= person.id
                                //       }
                                // })
                                if ($scope.personList.length == 1) {
                                    e.personId = $scope.personId
                                    e.personName = $scope.personName
                                } else {
                                    $scope.personList.forEach(v => {
                                        if (v.id == e.personId) {
                                            e.personId = v.id
                                            e.personName = v.name

                                        }
                                    })
                                }

                                e.timeList = []
                                // e.timeList = e.time.split(",") || [];
                                var t = e.time.split(",") || [];
                                t && t.forEach(time => {
                                    e.timeList.push({ time: time.replace(/-/g, " - ") })
                                })

                            })
                            if (!n.taskList || n.taskList.length == 0) {
                                n.taskList = [{ timeList: [] }]
                                if ($scope.personList.length == 1) {

                                    n.taskList = [{ timeList: [], personName: $scope.personName, personId: $scope.personId }]
                                }

                            }

                        })

                    } else {
                        alert(resp.msg);
                    }
                })

            });
        }

        // getPerson()

        //选择该节点
        $scope.selectNode = function (search, node) {
            $scope.search.postId && delete $scope.search.postId
            if (node.state.selected) {
                if (node.nodes) {
                    alert('请选择子节点')
                    return
                }
                $scope.search.postId = node.id
                getPerson()


            }
        }
        //添加时间段
        $scope.addTime = function (arr) {

            if (arr.length > 5) {
                alert('最多可设置6个')
                return
            }
            arr.push({ time: '' })
        }



        //删除任务
        var taskTimeList = []
        $scope.del = function (id, item, arr) {
            var param = {
                id: id
            }

            confirm("确认删除该任务?", function () {
                $http.post("/ovu-pcos/pcos/inspection/inswaytask/config/delete.do", param, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        msg(resp.msg);
                        getPerson();
                        fac.getPostTree(params)
                    } else {
                        alert(resp.msg);
                    }
                })
            });
        }


        function compare(arr) {
            var list = arr.split(' - ')
            return list[0] == list[1];
        };

        function calculate(str) {
            var list = str.split(' - ')
            var time1 = list[0].replace(":", "");
            var time2 = list[1].replace(":", "");
            return time1 > time2;
        }


        var flag = true
        var isCal = true
        var hasTime = true
        $scope.save = function (task, id) {

            if (!task.personId) {
                alert('请选择人员')
                return
            }


            var timeList = []
            taskTimeList = task.timeList
            // task.timeList.forEach(v=> {
            //     if(v.time){
            //         hasTime=true
            //         //对比开始时间是否等于结束时间
            //         if(compare(v.time)){

            //             flag=false
            //             break
            //            }else if(calculate(v.time)){
            //                //如果开始时间大于结束时间
            //             isCal=false
            //             break
            //            }else{
            //             flag=true
            //             isCal=true
            //           }
            //     }else{
            //         hasTime=false
            //         break

            //     }

            //  })


            try {

                task.timeList.forEach(function (v) {
                    if (v.time) {
                        hasTime = true
                        /*
                        if (compare(v.time)) {
                         //对比开始时间是否等于结束时间
                            flag = false
                            throw new Error("flag");//报错，就跳出循环
                        } else if (calculate(v.time)) {
                            //如果开始时间大于结束时间
                            isCal = false
                            throw new Error("isCal");//报错，就跳出循环
                        } else {
                            flag = true
                            isCal = true
                        } */
                        if (compare(v.time)) {
                            //对比开始时间是否等于结束时间
                               flag = false
                               throw new Error("flag");//报错，就跳出循环
                           }  else {
                               flag = true
                               isCal = true
                           }

                    } else {
                        throw new Error("hasTime");//报错，就跳出循环
                    }
                })
            } catch (e) {
                if (e.message == "hasTime" || e.message == "flag" || e.message == "isCal") {

                } else {

                }
            }

            if (!flag) {
                alert('巡查时间段一致')
                return
            }
            if (!hasTime) {
                alert('请选择巡查时间')
                return
            }

            if (!isCal) {
                alert('开始时间不能大于结束时间')
                return
            }

            task.timeList.forEach(v => {
                v.time = v.time.replace(/\s+/g, "")
                timeList.push(v.time)
            })
            timeList = timeList.join(',')
            if (timeList.length == 0) {
                alert('请设置巡查时间')
                return
            }
            var param = {
                insWayId: id,
                personId: task.personId,
                time: timeList,
                id: task.id
            }
            $http.post('/ovu-pcos/pcos/inspection/inswaytask/config/edit', param, fac.postConfig).success(function (data) {
                if (data.code == 0) {
                    msg(data.msg);
                    getPerson();
                    fac.getPostTree(params)
                } else {

                    task.timeList.forEach(v => {

                        v.time = v.time.replace(/-/g, " - ")
                    })
                    alert(data.msg);

                }
            })




        }



    });

})()
