(function () {
    var app = angular.module("angularApp");
    app.controller('energyAllocationanalysisCtrl', function ($scope, $rootScope, $http, $sce, $filter, $uibModal, fac) {
        document.title = "能源分析配置";
        $scope.search = { isGetPointData: false };
        $scope.pageModel = {};
        $scope.search.classifyType = '';  //分析分类（1，2,3）
        // $scope.search.classifyId='' ; //水电气id
        $scope.search.pointType = 1; //水电气
        $scope.config = {
            edit: true
        }

        //水气电对应的id
        var selectedIndex;
        $scope.treeData = [];
        app.modulePromiss.then(function () {

            $scope.findTypes();
            // fac.initPage($scope, function () {
            //     $scope.init();
            // })
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId;
                        $scope.init();
                    } else {
                        alert('请选择跟项目关联的部门');
                        $scope.search.parkId &&  delete $scope.search.parkId

                    }

                }
            })
        });
        $scope.findTypes = function () {
            $http.get('/ovu-energy/energy/classify/list').success(function (res) {
                if (res.code == 0) {
                    $scope.classifyList = res.data;
                } else {
                    alert(res.msg);
                }
            })
        }
        //选择分类
        $scope.checkTypes = function (item) {
            $scope.treeData = [];
            $scope.pageModel = {}
            $scope.search.nodeId = '';
            $scope.search.id = '';
            $scope.CalculateTypeList = [];
            $scope.search.pointType = item.type;
            $scope.search.classifyId = item.classifyId;
            $scope.loadEnergyTree();

        }
        $scope.changeIndex = function (index,nodeId) {
            if(!nodeId){
                $scope.loadEnergyTree();
            }
            if (index == 0) {
                $scope.find(1,nodeId);
            }
            var copy = angular.extend({}, copy);
            angular.extend(copy, {
                isGroup: $scope.search.isGroup,
                parkId: $scope.search.parkId,
                parkName: $scope.search.parkName,
                classifyType: index + 1,
                pointType: $scope.search.pointType,
                classifyId: $scope.search.classifyId,
                nodeId:nodeId

                // stageId:$scope.search.stageId ,
                // buildId:$scope.search.buildId,
                // unitNo:$scope.search.unitNo,
                // groundNo:$scope.search.groundNo
            })
            $scope.search.classifyType = copy.classifyType
            $scope.$broadcast('index' + index, copy);
            selectedIndex = index;
           
        };
        $scope.init = function () {
            $scope.loadEnergyTree();
            $scope.changeIndex(selectedIndex);
        }
        //查询
        $scope.find = function (pageNo,nodeId) {
            $.extend($scope.search, { nodeId:nodeId,currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10, findType: 3 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-energy/energy/energyanalysis/getEnergyPointList", $scope.search, function (data) {
                var pageModel = data;
                if (pageModel.data != undefined) {
                    pageModel.data = pageModel.data.map(function (item) {
                        item.spaceName = item.spaceName && $sce.trustAsHtml(item.spaceName.split(",").map(function (v, i) {
                            return (i + 1) + '.' + v;
                        }).join('<br>'));
                        return item;
                    })
                }
                $scope.pageModel = pageModel;
            });
        };
        //新增编辑配置
        $scope.editNode = $scope.addTopNode = function (node) {
            if (!$scope.search.parkId) {
                alert('请选择项目');
                return
            }
            // var type = node ? { id: node.id, nodeName: node.text, parentId: node.parentId, ptext: node.ptext,pids:pids} : {};
            if(node){
                if(node.level==0){
                    node.level=1;
                }
            }
            var type = node ? { id: node.id, nodeName: node.text, parentId: node.parentId, ptext: node.ptext,level:node.level-1} : {};
            if ($scope.search.classifyType == 1 || $scope.search.classifyType == 2) {
                var modal = $uibModal.open({
                    animation: false,
                    size: 'lg',
                    templateUrl: 'energy/energyAllocationanalysis/modal.analysisInfoType.html',
                    controller: 'analysisInfoTypeModalCtrl'
                    , resolve: {
                        type: function () {
                            return angular.extend({
                                parkId: $scope.search.parkId,
                                classifyType: $scope.search.classifyType,
                                pointType: $scope.search.pointType,
                                classifyId: $scope.search.classifyId || $scope.classifyList[0].classifyId,
                            }, type);
                        }
                    }
                });
                modal.result.then(function (data) {
                    $scope.loadEnergyTree();
                    // $scope.find();

                   data.text=data.name
                    if (node) {
                        node.state = node.state || {};
                        node.state.expanded = true;
                        node.nodes = node.nodes || [];
                        node.state.edit = true;
                        node.nodes.push(data);

                    } else if (!$scope.treeData) {
                        $scope.treeData = [];
                        node.state = node.state || {};
                        node.state.edit = true;
                    } $scope.treeData.push(data);
                }, function () {
                    console.info('Modal dismissed at: ' + new Date());
                });
            } else {
                if (node) {
                    node.copy = angular.extend({}, node);
                    node.state = node.state || {};
                    node.state.edit = true;
                    isLeaf: true

                } else {
                    $scope.search.text='';
                    $scope.treeData.push({
                        state: { edit: true },
                        copy:{
                            nodeName:$scope.search.text,
                            parkId:$scope.search.parkId,
                            pointType:$scope.search.pointType,
                            classifyType:$scope.search.classifyType,
                        },
                        isLeaf: true
                    })
                }

            }

        };
        $scope.addSon = function (node) {
            if (!$scope.search.parkId) {
                alert('请选择项目');
                return
            }
            /*
            var pids=''
            if(!node.parentId=='0'){
                node.pids=node.pids+','+node.id
            }else{
                pids=node.id
            }
            var type = node ? { parentId: node.id, ptext: node.text,pids:pids } : {};
            */

            var type = node ? { parentId: node.id, ptext: node.text} : {};
            if ($scope.search.classifyType == 1 || $scope.search.classifyType == 2) {

                if (node.level == 5) {
                    alert('最多只可加至5级')
                    return
                }
                if(node.level==0){
                    node.level=1;
                }
                var modal = $uibModal.open({
                    animation: false,
                    size: 'lg',
                    templateUrl: 'energy/energyAllocationanalysis/modal.analysisInfoType.html',
                    controller: 'analysisInfoTypeModalCtrl'
                    , resolve: {
                        type: function () {
                            return angular.extend({
                                parkId: $scope.search.parkId,
                                classifyType: $scope.search.classifyType,
                                pointType: $scope.search.pointType,
                                classifyId: $scope.search.classifyId || $scope.classifyList[0].classifyId,
                                level:node.level
                            }, type);
                        }
                    }
                });
                modal.result.then(function (data) {
                    $scope.loadEnergyTree();
                    // $scope.find();

                    if (node) {
                        node.state = node.state || {};
                        node.state.expanded = true;
                        node.nodes = node.nodes || [];
                        // node.nodes.push(data);
                        angular.extend(node, data)
                    } else if (!$scope.treeData) {
                        $scope.treeData = [];
                    }
                }, function () {
                    console.info('Modal dismissed at: ' + new Date());
                });
            } else {
                if (node) {
                    node.copy = angular.extend({}, node);
                    node.state = node.state || {};

                } else {
                    $scope.treeData.push({
                        state: { edit: true },
                        copy: $scope.search,

                    })
                }

            }
        }
        $scope.undo = function (node) {
            if (node.id) {
                node.state.edit = false;
            } else {
                var parent = getNodeById(node.parentId);
                if (parent) {
                    parent.nodes.splice(parent.nodes.indexOf(node), 1)
                } else {
                    $scope.treeData.splice($scope.treeData.indexOf(node), 1)
                }
            }
        }
        function getNodeById(did) {
            if (!did) {
                return false;
            }
            var list = getAllNodes($scope.treeData);
            return list.find(function (n) {
                return n.id == did
            })
        }
        //获取当前所有节点
        function getAllNodes(nodes) {
            var list = [];
            list.push.apply(list, nodes);

            nodes.forEach(function (n) {
                if (n.nodes && n.nodes.length) {
                    list.push.apply(list, getAllNodes(n.nodes));
                }
            })
            return list;
        }


        //选中节点
        $scope.selectNode = function (search,node) {
            if (!$scope.search.parkId) {
                alert('请选择项目');
                return
            }
           
           

           
            if (node.state.selected) {
               
                $scope.changeIndex(selectedIndex, node.id);
            } 

          
        };
        //删除配置
        $scope.delNode = function (node) {
            if (!$scope.search.parkId) {
                alert('请选择项目');
                return
            }
            var num;

            if (node.nodes && node.nodes.length > 0) {
                alert('该分类下还有子分类，不能删除！');
                return;
            }
            if($scope.search.classifyType == 1 || $scope.search.classifyType == 2){
                $http.post("/ovu-energy/energy/energyanalysis/getClassifyPoints", { id: node.id, parkId: $scope.search.parkId }).success(function (res) {
                    if (res.code == '0') {
                        num = res.data;
                        confirm("该分组下关联能耗仪表数" + num + ",确认删除分类" + node.text + "吗?", function () {
                            $http.post("/ovu-energy/energy/energyanalysis/delete", { id: node.id }).success(function (data) {
                                if (data.code == '0') {
                                    
                                    var list = fac.treeToFlat($scope.treeData);
                                    var parent = list.find(function (n) { return n.id == node.parentId });
                                    if (parent) {
                                        parent.nodes.splice(parent.nodes.indexOf(node), 1)
                                    } else {
                                        $scope.treeData.splice($scope.treeData.indexOf(node), 1)
                                    }
                                    $scope.changeIndex(selectedIndex);
                                    msg(data.msg);
                                } else {
                                    alert(data.msg);
                                }
                            });
                        })
                    }

                })
            }else{
                confirm("确认删除该计算类型吗?", function () {
                    $http.post("/ovu-energy/energy/energyanalysis/delete", { id: node.id }).success(function (data) {
                        if (data.code == '0') {
                           
                            var list = fac.treeToFlat($scope.treeData);
                            var parent = list.find(function (n) { return n.id == node.parentId });
                            if (parent) {
                                parent.nodes.splice(parent.nodes.indexOf(node), 1)
                            } else {
                                $scope.treeData.splice($scope.treeData.indexOf(node), 1)
                            }
                            msg(data.msg);
                            $scope.changeIndex(selectedIndex);
                        } else {
                            alert(data.msg);
                        }
                    })
                });
            }
        };
        //保存类型

        $scope.save = function (node) {
            if (!node.copy.text) {
                alert('名称不能为空');
                return;
            }

            var filterData; //需要过滤的数据
            if (node.parentId && node.parentId != 0) {
                //子分类(在同级节点是否重复)
                var pnode = fac.treeToFlat($scope.treeData).find(function (n) {
                    return (n.id == node.parentId)
                });
                filterData = pnode.nodes;
            } else {
                //第一级
                filterData = $scope.treeData;
            }
            var findData = filterData.find(function (n) {
                return (n.id != node.copy.id && n.text == node.copy.text)
            });
            if (findData) {
                alert('分类名称已存在');
                return;
            }


            var item = {};
            item.id = node.copy.id;
            item.classifyType = node.copy.classifyType;
            item.pointType = node.copy.pointType;
            item.nodeName = node.copy.text;
            item.parkId = node.copy.parkId;
            var url = "/ovu-energy/energy/energyanalysis/edit";

            $http.post(url, item).success(function (resp) {
                if (resp.code == 0) {

                    msg(resp.msg);
                    node.id = resp.data.id;
                    node.text = resp.data.nodeName;
                    node.classifyType = resp.data.classifyType;
                    node.parentId = resp.data.parentId;
                    node.level = resp.data.level;
                    node.pointType = resp.data.pointType;
                    node.createrId = resp.data.createrId;
                    node.domainId= resp.data.domainId;

                    node.parkId= resp.data.parkId || '';
                    node.state.edit = false;


                } else {
                    alert(resp.msg);
                }
            });

        }
        $scope.loadEnergyTree = function () {
            delete $scope.search.nodeId;
            delete $scope.search.id;
            $http.post("/ovu-energy/energy/energyanalysis/tree", $scope.search, fac.postConfig).success(function (data) {
                if (data.code == 0 && $scope.search.classifyType == 3) {
                    data.data && data.data.forEach(function (v) {
                        v.isLeaf = true
                    })

                }
                $scope.treeData = data.data || [];
            });

        };

    });
    //新增编辑配置
    app.controller('analysisInfoTypeModalCtrl', function ($scope, $rootScope, $http, $sce, $uibModalInstance, $uibModal, $filter, $q, fac, type) {
        $scope.item = type || {};
        $scope.parentId=type.parentId;

        $scope.search = { parkId: type.parkId, classifyType: type.classifyType, classifyId: type.classifyId }

        $scope.pageModel = {};
        $scope.pointIdSelected = [];
        //查看计量点列表
        var findType;
        if (type.classifyType == 2) {
            findType = 5
        } else {
            findType = 1
        }
        $scope.find = function (pageNo) {
            $.extend($scope.search, { currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10, findType: findType });
            $scope.search.pageIndex = $scope.search.currentPage - 1;

            type.id && ($scope.search.nodeId = type.id)
            fac.getPageResult("/ovu-energy/energy/energyanalysis/getEnergyPointList", $scope.search, function (data) {
                var pageModel = data;
                if (pageModel.data != undefined) {
                    pageModel.data = pageModel.data.map(function (item) {
                        item.spaceName =item.spaceName &&  $sce.trustAsHtml(item.spaceName.split(",").map(function (v, i) {
                            return (i + 1) + '.' + v;
                        }).join('<br>'));
                        return item;
                    })
                }
                $scope.pageModel = pageModel;
                $scope.pageModel.data && $scope.pageModel.data.forEach(function (v) {
                    $scope.pointIdSelected.forEach(function (n) {
                        if (n.pointId == v.pointId) {
                            v.checked = true;
                        }
                    })
                })
            });
        };
        $scope.find();
        //分项列表
        $http.post("/ovu-energy/energy/item/list", { classifyId: type.classifyId }, fac.postConfig).success(function (data) {
            $scope.fenXiangList = data.data;
        });
        var findType;
        if (fac.isNotEmpty(type.id)) {
            $http.post('/ovu-energy/energy/energyanalysis/get.do?', { id: type.id }).success(function (res) {
                if (res.code == '0') {
                    angular.extend($scope.item, res.data.data);
                    res.data.pointList && res.data.pointList.forEach(function (v) {
                        if (v.pointId) {
                            $scope.pointIdSelected.push({ pointId: v.pointId, pointName: v.pointName, parentPointId: v.parentPointId })
                        }

                    })

                } else {
                    alert(res.msg);
                }
            })

        }

        function isInArray(arr, value) {
            var f = -1;
            arr.forEach(function (p, i) {
                if (p.pointId === value.pointId
                ) {
                    f = i;
                }
            });
            return f;
        }

        /**
         * 分页查询
         * @param pageNo
         */


        // 选择表
        $scope.checkPoint = function (n, arr) {
            //标记是否选择
            n.checked = !n.checked;
            var arrList = arr.data.reduce(function (ret, n) {
                n.checked && ret.push(n);
                return ret
            }, [])
            if (arr && arr.data) {
                if (arr.data.length == arrList.length) {
                    arr.checked = true
                } else {
                    arr.checked = false
                }
            }
            //加入选择组
            var i = isInArray($scope.pointIdSelected, n);
            if (!n.checked && i !== -1) {
                $scope.pointIdSelected.splice(i, 1);
            } else if (n.checked && i === -1) {
                if (type.classifyType == 2) {
                    if(type.parentId){
                        if ( type.parentId!=='0'  && !n.parentPointId) {
                            n.checked = false
                            arr.checked=false
                            alert('请选择关联上级仪表');
                            return
                        }
                    }

                }
                var pointItem = { pointId: n.pointId, pointName: n.pointName, parentPointId: n.parentPointId };
                $scope.pointIdSelected.push(pointItem);
            }
        }
        //选中本页所有表
        $scope.checkPointAll = function (arr) {
            arr.checked = !arr.checked;
            if (arr.checked) {
                $scope.pageModel.data.map(function (n) {
                    n.checked = true;

                    var i = isInArray($scope.pointIdSelected, n);
                    if (i === -1) {
                        if (type.classifyType == 2) {
                            if(type.parentId){
                                if ( type.parentId!=='0'  && !n.parentPointId) {
                                    n.checked = false
                                    arr.checked=false
                                    alert('请选择关联上级仪表');
                                    return
                                }
                            }
                        }
                        var pointItem = { pointId: n.pointId, pointName: n.pointName, parentPointId: n.parentPointId };
                        $scope.pointIdSelected.push(pointItem);
                    }
                    return n;

                });
            } else {
                $scope.pageModel.data.map(function (n) {
                    n.checked = false;
                    var i = isInArray($scope.pointIdSelected, n);
                    if (i !== -1) {
                        $scope.pointIdSelected.splice(i, 1);
                    }
                    return n;

                })
            }
        }
        $scope.delSelectedPoint = function (PointItem) {
            var f = -1;
            $scope.pointIdSelected.forEach(function (p, i) {
                if (p.pointId === PointItem.pointId) {
                    f = i;
                }
            });
            if (f !== -1) {
                $scope.pointIdSelected.splice(f, 1);
                $scope.find();
            }
        };
        //选择上联仪表设备

        $scope.chooseParent = function (item) {
            var pid = type.parentId;
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: 'energy/energyAllocationanalysis/modal.ParentClassify.html',
                controller: 'ParentClassifyModalCtrl'
                , resolve: { data: function () { return angular.extend({ classifyId: type.classifyId, nodeId: type.id, classifyType: type.classifyType, parkId: type.parkId, pid: pid,level:type.level }, item); } }
            });
            modal.result.then(function (data) {
                item.parentPointName = data.pointName,
                    item.parentPointId = data.parentPointId
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        /**
         * 确定
         */
        $scope.save = function (form) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            if ($scope.pointIdSelected == '') {
                alert("请选择表！");
                return;
            }
            var pointList = $scope.pointIdSelected.reduce(function (ret, n) {
                n.pointId && ret.push({ pointId: n.pointId, nodeId: type.id, parentPointId: n.parentPointId });
                return ret
            }, [])
            // angular.extend($scope.item,{pointList:pointList})
            $scope.item.pointList = pointList;

            var url = '/ovu-energy/energy/energyanalysis/edit';
            $http.post(url, $scope.item).success(function (resp) {
                if (resp.code == 0) {
                    msg(resp.msg);
                    $uibModalInstance.close({name:$scope.item.nodeName});
                } else {
                    alert(resp.msg);
                    $uibModalInstance.close();
                }
            })

        };

        /**
         * 取消
         */
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    //层级配置
    app.controller('layeredConfigurationCtrl', function ($scope, $rootScope, $http, $sce, $filter, $uibModal, fac) {
        $scope.pageModel = {};
        //
        $scope.$on('index1', function (event, data) {
            $scope.search.parentPointName && delete $scope.search.parentPointName
            $scope.find(1, data);
        });
       
      
        $scope.find = function (pageNo, data) {
            // $scope.search.nodeId =nodeId;
            angular.extend($scope.search, {currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10, findType: 3 }, data);

            fac.getPageResult("/ovu-energy/energy/energyanalysis/getEnergyPointList", $scope.search, function (data) {
                var pageModel = data;
                if (pageModel.data != undefined) {
                    pageModel.data = pageModel.data.map(function (item) {
                        item.spaceName =item.spaceName &&  $sce.trustAsHtml(item.spaceName.split(",").map(function (v, i) {
                            return (i + 1) + '.' + v;
                        }).join('<br>'));
                        return item;
                    })
                }
                $scope.pageModel = pageModel;
                $scope.pageModel.data.forEach(function (v) {
                    $scope.pointIdSelected && $scope.pointIdSelected.forEach(function (n) {
                        if (n.pointId == v.pointId) {
                            v.checked = true;
                        }
                    })
                })
            });
        };

    });
    //选择上联仪表配置
    app.controller('ParentClassifyModalCtrl', function ($scope, $rootScope, $http, $sce, $filter, $uibModalInstance, fac, data) {
        $scope.pageModel = {};

        $scope.search = {};
        $scope.level=data.level
        $scope.find = function (pageNo) {
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,
                findType: 4,
                classifyType: data.classifyType,
                // nodeId: data.nodeId,
                classifyId: data.classifyId,
                parkId: data.parkId,
                // parentId: data.pid
                nodeId: data.pid
            });
            fac.getPageResult("/ovu-energy/energy/energyanalysis/getEnergyPointList", $scope.search, function (data) {
                var pageModel = data;
                if (pageModel.data != undefined) {
                    pageModel.data = pageModel.data.map(function (item) {
                        item.spaceName =item.spaceName &&  $sce.trustAsHtml(item.spaceName.split(",").map(function (v, i) {
                            return (i + 1) + '.' + v;
                        }).join('<br>'));
                        return item;
                    })
                }
                $scope.pageModel = pageModel;
            });
        };
        $scope.find();
        $scope.checkOne = function (item, data) {
            item.checked = !item.checked;
            if (data) {
                item.checked = data.data.every(function (v) {
                    return !v.checked;
                });
                item.checked = item.checked;
            }
            $scope.pointId = item.pointId
            $scope.pointCode = item.pointCode;
            $scope.pointName = item.pointName;
        }
        /**
        * 确定
        */

        $scope.save = function (form) {
            var obj = { parentPointId: $scope.pointId, pointCode: $scope.pointCode, pointName: $scope.pointName }
            if (!$scope.pointId) {
                alert("请选择表！");
            } else {
                $uibModalInstance.close(obj);
            }
        };

        /**
         * 取消
         */
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    //异常情况表配置
    app.controller('abnormalSituationCtrl', function ($scope, $rootScope, $http, $sce, $filter, $uibModal, fac) {
        $scope.$on('index2', function (event, data) {

            $scope.findAbnormal(data);
        });

        $scope.findAbnormal = function (data) {
           var params={}
            var param={parkId:$scope.search.parkId,classifyType:$scope.search.classifyType,pointType:$scope.search.pointType};
            if(data){
                params=angular.extend({id:data.nodeId},param)
            }else{
                params=param
            }
            $http.post("/ovu-energy/energy/energyanalysis/getCalculateType", params).success(function (resp) {
                $scope.CalculateTypeList = resp.data;
            });
        }
        //计算公式
        $scope.showEditModal = function (type) {
            if (!$scope.search.parkId) {
                alert('请选择项目');
                return
            }
            var modal = $uibModal.open({
                animation: false,
                size: 'max',
                templateUrl: 'energy/energyAllocationanalysis/modal.layeredInfoType.html',
                controller: 'layeredInfoTypeModalCtrl'
                , resolve: { type: function () { return angular.extend({ parkId: $scope.search.parkId, classifyType: $scope.search.classifyType }, type); } }
            });
            modal.result.then(function (data) {
                $scope.findAbnormal();
            });
        }

    });
    //计算公式
    app.controller('layeredInfoTypeModalCtrl', function ($scope, $rootScope, $http, $sce, $uibModalInstance, $uibModal, $filter, $q, fac, type) {
        $scope.item = type || {};
        // $scope.item.val_type=$scope.item.val_type?$scope.item.val_type:1;
        // $scope.item.value=$scope.item.value?Number($scope.item.value):null;
        $scope.item.formulaText = $scope.item.formulaText ? $scope.item.formulaText : '';
        $scope.item.formula = $scope.item.formula ? $scope.item.formula : '';
        // $scope.variables = [];
        app.modulePromiss.then(function () {
            $scope.config = {
                edit: false,
                showCheckbox: true
            }

            loadTree();
        });


        /*
        //选中分组
        $scope.check = function (node) {
            if ($scope.curNode != node) {
                $scope.curNode && $scope.curNode.state && ($scope.curNode.state.checked = false);
            }
            node.state = node.state || {};
            node.state.checked = !node.state.checked;
            if (node.state.checked) {
                $scope.curNode = node;
                $scope.analysisDefined.push(node)
            } else {
                var index = $scope.analysisDefined && $scope.analysisDefined.findIndex(function (v) {
                    return node.id == v.id
                })
                $scope.analysisDefined.splice(index, 1);
                delete $scope.curNode;
            }


        };
         //编辑配置
        $scope.edit = function (item) {
            var modal = $uibModal.open({
                animation: false,
                size: 'max',
                templateUrl: 'energy/energyAllocationanalysis/modal.analysisInfoType.html',
                controller: 'layModalCtrl'
                , resolve: { type: function () { return angular.extend({ parkId: type.parkId, pointType: type.pointType }, item); } }
            });
            modal.result.then(function (data) {
                loadTree();
                item.pointList = data;
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        */
        //选中分组
        $scope.check = function (node) {
            if ($scope.curNode != node) {
                $scope.curNode && $scope.curNode.state && ($scope.curNode.state.checked = false);
            }
            node.state = node.state || {};
            node.state.checked = !node.state.checked;
            if (node.state.checked) {
                $scope.curNode = node;
                if ($scope.item.formula && !checkFormulaOper()) {
                    alert('请选择运算符！');
                    return false;
                }
                node.checked = !node.checked;
                $scope.item.formulaText += " " + node.text;
                $scope.item.formula += " " + node.id;
            } else {

                // var str=$scope.item.formulaText.replace(node.text,'');
                // $scope.item.formulaText=str
                delete $scope.curNode;
            }


        };
        //清空公式
        $scope.clear = function () {
            $scope.item.formulaText = '';
            $scope.item.formula = '';
            // $scope.analysisDefined.forEach(function (v) {
            //     v.checked = false;
            // });
            $scope.analysisCalculate.forEach(function (v) {
                v.checked = false;
            })
            $scope.analysisGroup.forEach(function (v) {
                v.checked = false;
            })
            $scope.analysisLevel.forEach(function (v) {
                v.checked = false;
            })
        };

        //选中变量参数
        /*
        $scope.checkVariable = function (v) {
            if ($scope.item.formula && !checkFormulaOper()) {
                alert('请选择运算符！');
                return false;
            }
           v.checked = !v.checked;

            $scope.item.formulaText += ($scope.item.formulaText ? " " + v.text : v.text);
            $scope.item.formula += ($scope.item.formula ? " " + v.id : v.id);
        };
        */

        //点击运算符
        $scope.clickOper = function (o) {
            if (!$scope.item.formula) {
                alert('请先选择变量！');
                return false;
            }
            if (!checkFormulaOper()) {
                $scope.item.formulaText += " " + formateO(o);
                $scope.item.formula += " " + formateO(o);
            } else {
                alert('请先选择变量！');
            }
        };
        $scope.checkError = function (node) {
            if ($scope.item.formula && !checkFormulaOper()) {
                alert('请选择运算符！');
                return false;
            }
            if ($scope.curNode != node) {
                $scope.curNode && $scope.curNode.state && ($scope.curNode.state.checked = false);
            }
            node.state = node.state || {};
            node.state.checked = !node.state.checked;
            if (node.state.checked) {
                $scope.curNode = node;
                $scope.item.formulaText += ($scope.item.formulaText ? " " + node.text : node.text);
                $scope.item.formula += ($scope.item.formula ? " " + node.id : node.id);
            }
        }


        function addClassifyType(v, num) {
            if (v.nodes) {
                v.nodes.forEach(function (va) {
                    va.classifyType = num;
                })
            }

            addClassifyType();
        }

        function loadTree() {
            $http.post("/ovu-energy/energy/energyanalysis/getAllEnergyClassify", { parkId: type.parkId, pointType: type.pointType, id: type.id }).success(function (res) {
                if (res.code == 0) {

                    $scope.analysisGroup = res.data.analysisGroup || []; //分组配置
                    $scope.analysisGroup && $scope.analysisGroup.forEach(function (v) {
                        v.classifyType = 1

                    })
                    $scope.analysisLevel = res.data.analysisLevel || []; //层级配置
                    $scope.analysisLevel && $scope.analysisLevel.forEach(function (v) {
                        v.classifyType = 2

                    })
                    $scope.analysisCalculate = res.data.analysisCalculate || []; //异常配置
                    $scope.analysisDefined = res.data.analysisDefined || []; //自定义配置
                }


            });
        };


        function formateO(o) {
            var ot = '';
            if (o == 1) {
                ot = '+';
            } else if (o == 2) {
                ot = '-';
            } if (o == 3) {
                ot = '×';
            } if (o == 4) {
                ot = '÷';
            }
            return ot;
        }

        function checkFormulaOper() {
            var lc = $scope.item.formula.charAt($scope.item.formula.length - 1);
            return (lc == '+' || lc == '-' || lc == '×' || lc == '÷');
        }
        //删除
        $scope.delNode = function (item) {
            var index = $scope.analysisDefined.findIndex(function (v) {
                return v.id == item.id
            });
            $scope.analysisDefined.splice(index, 1);
        }
        //保存
        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }


            var param = {
                parkId: $scope.item.parkId, formula: $scope.item.formula.trim(),
                formulaText: $scope.item.formulaText.trim(), pointType: $scope.item.pointType,
                classifyType: $scope.item.classifyType, id: $scope.item.id
            }
            $http.post("/ovu-energy/energy/energyanalysis/saveFormula", param).success(function (data) {
                if (data.code == 0) {
                    $uibModalInstance.close();
                    msg(data.msg);
                } else {
                    alert(data.msg);
                }
            })
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

    //编辑配置layModalCtrl

    app.controller('layModalCtrl', function ($scope, $rootScope, $http, $sce, $uibModalInstance, $uibModal, $filter, $q, fac, type) {
        $scope.item = type || {};
        $scope.item.nodeName = type.text
        $scope.search = {},
            $scope.pageModel = {},
            $scope.formIsshow = true;
        //查询
        $scope.find = function (pageNo) {
            $scope.search.nodeId = type.id;
            $scope.search.classifyId = type.pointType;
            $scope.search.classifyType = type.classifyType;
            $.extend($scope.search, { currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10, findType: 3 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-energy/energy/energyanalysis/getEnergyPointList", $scope.search, function (data) {
                var pageModel = data;
                if (pageModel.data != undefined) {
                    pageModel.data = pageModel.data.map(function (item) {
                        item.spaceName =item.spaceName &&  $sce.trustAsHtml(item.spaceName.split(",").map(function (v, i) {
                            return (i + 1) + '.' + v;
                        }).join('<br>'));
                        return item;
                    })
                }
                $scope.pageModel = pageModel;
            });
        };
        $scope.find(1);
        //保存
        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            var pointList = []
            $scope.pageModel.data && $scope.pageModel.data.forEach(function (v) {
                v.checked && pointList.push(v)
            })
            $uibModalInstance.close(pointList);
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

})()
