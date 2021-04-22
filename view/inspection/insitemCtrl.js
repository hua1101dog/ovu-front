/**
 * 巡查项管理控制器
 */
(function () {
    var app = angular.module("angularApp");
 
    app.controller('insItemCtl', function ($scope, $rootScope, $http, $filter, $uibModal,  $sce, fac) {
        document.title = "巡查项管理";
     
        //项目id
        $scope.pageModel = {};
        $scope.search = {};
        $scope.insItemTypeId = {};
        $scope.insTreeData=[]
        $scope.find = function (pageNo, insItemTypeId) {

            if (angular.isDefined(insItemTypeId)) {
                $scope.search.insItemTypeId = insItemTypeId;
            }

            $.extend($scope.search, {
                currentPage: pageNo || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-pcos/pcos/inspection/insitem/page.do", $scope.search, function (data) {
                $scope.pageModel = data;
                $scope.pageModel.data && $scope.pageModel.data.length && $scope.pageModel.data.forEach(v=>{
                    v.trustHtml = $sce.trustAsHtml(v.description)
                })
            });
        };

      
     
        //初始化方法
        app.modulePromiss.then(function () {
          if(app.user.adminType=='domain_admin'){
            $scope.search.deptId && delete  $scope.search.deptId
            getTree()
          }else{
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId){
                        $scope.search.deptId=deptId 
                        getTree({deptId:$scope.search.deptId})
                    }else{
                        $scope.search.deptId && delete $scope.search.deptId;
                        $scope.insTreeData=[];
                        $scope.search.text=''
                    }
                    
                }else{
                    $scope.search.deptId && delete  $scope.search.deptId
                  
                }

            })
          }
           
           
            

        })

        function getTree(params){
            fac.setInsitemtypeTree(params).then(function (insTreeData) {
                $scope.insTreeData=insTreeData
                if (insTreeData && insTreeData.length) {
                    // $scope.search.insItemTypeId = $scope.insTreeData[0].id;
                    insTreeData.forEach(element => {
                        if(element.data && element.data.permission=='c,u,d'){
                            element.isCUR=true
                          }else{
                            element.isCUR=false
                          }
                          function getNode(node) {
                            if (node.nodes && node.nodes.length) {
                                node.nodes.forEach(function (n) {
                                    if(n.data && n.data.permission=='c,u,d'){
                                        if($scope.hasPower('新增') || $scope.hasPower('编辑')){
                                            n.isCUR=true
                                        }
                                      }else{
                                        n.isCUR=false
                                      }
                                    getNode(n);
                                })
                            }
                        }
                        getNode(element)
                    });
                    $scope.insTreeData[0].state={selected:true}
                    $scope.selectNode($scope.search,$scope.insTreeData[0])
                }
              
           
            });
           
        }

        //显示新增修改弹出框
        $scope.showModal =(id,item)=> {
            var param = {
                insItemTypeId: $scope.search.insItemTypeId,
                insItemId: id,
            };
            var modal = $uibModal.open({
                animation: false,
                templateUrl: '/view/inspection/insitem/modal.inspection.insItem.html',
                controller: 'insItemrAddOrEditModalCtrl',
                resolve: {
                    param: param
                }
            });
            modal.result.then(function () {
              
                $scope.find()
              
            });
           
    
           
        }

        //删除巡查标准
        $scope.del = function (item) {
            confirm("确定删除 " + item.name, function () {
                $http.post("/ovu-pcos/pcos/inspection/insitem/delete.do", {
                    insItemId: item.insItemId
                }, fac.postConfig).success(function (resp) {
                    if (resp.code == "0") {
                        msg(resp.msg);
                       
                        $scope.find()
                    } else {
                        alert(resp.msg)
                    }
                });
            })
        };

        //**下方为左侧树
        //新增根节点
        $scope.addTopNode = function () {
           if(app.user.adminType!=='domain_admin'){
            if(!$scope.search.deptId){
                alert('请选择项目下的部门')
                return
            }
           }
           $scope.insTreeData=$scope.insTreeData || []
            $scope.insTreeData.push({
                state: {
                    edit: true
                },
                copy: {}
            });
        }

        //新增子节点
        $scope.addSon = function (node) {
            node.nodes = node.nodes || [];
            node.state = node.state || {};
            node.state.expanded = true;
           
            node.nodes.push({
                parentId: node.id,
                state: {
                    edit: true
                },
                copy: {
                    parentId: node.id
                }
            });
        }
        //选择该节点
        $scope.selectNode = function (search,node) {
          
            if (node.state.selected) {
                  $scope.curNode=node
                $scope.find(1, node.id);
                if(node.data && node.data.permission=='c,u,d'){
                    $scope.isAdd=true
                }else{
                    $scope.isAdd=false
                }
            }else{
                $scope.isAdd=false
                $scope.curNode={}
            }
        }
        //删除节点
        $scope.delNode = function (node) {
          
            if (node.nodes && node.nodes.length) {
                alert("此节点有下级节点,不能删除！")
            } else {
                confirm("确定删除 " + node.text, function () {
                    $http.post("/ovu-pcos/pcos/inspection/insitemtype/delete.do", {
                        insItemTypeId: node.id
                    }, fac.postConfig).success(function (resp) {
                        if (resp.code == 0) {
                            if ($scope.curNode == node) {
                                delete $scope.curNode;
                            }
                            var parent = node.parentId && fac.getNodeById($scope.insTreeData, node.parentId);
                            if (parent) {
                                parent.nodes.splice(parent.nodes.indexOf(node), 1)
                            } else {
                                $scope.insTreeData.splice($scope.insTreeData.indexOf(node), 1)
                            }
                            msg(resp.msg)
                        }else{
                            alert(resp.msg)
                        }
                    });
                })
            }
        }
        //保存节点
        $scope.save = function (node) {
            if (fac.isNotEmpty(node.copy.text)) {
                var insItemType = {};
                insItemType.name = node.copy.text;
                insItemType.insItemTypeId = node.copy.id;
                insItemType.parentId = node.copy.parentId;
                insItemType.deptId = $scope.search.deptId || undefined
                $http.post("/ovu-pcos/pcos/inspection/insitemtype/edit.do", insItemType, fac.postConfig).success(function (resp) {
                    if (resp.code == "0") {
                        msg(resp.msg);
                        node.id = resp.data.insItemTypeId;
                        node.parentId = resp.data.parentId;
                        node.text = resp.data.name;
                        node.state.edit = false;
                        node.isCUR =true;
                        node.data={permission: "c,u,d"}
                       
                    } else {
                        alert(resp.msg);
                    }
                });
            }
        }
        //撤销
        $scope.undo = function (node) {
            if (node.id) {
                node.state.edit = false;
            } else {
                //获取父节点
                var parent = node.parentId && fac.getNodeById($scope.insTreeData, node.parentId);
                //如果有父节点，则从父节点的子list中删除
                if (parent) {
                    parent.nodes.splice(parent.nodes.indexOf(node), 1)
                } else {
                    $scope.insTreeData.splice($scope.insTreeData.indexOf(node), 1)
                }
            }
        }
        //修改节点
        $scope.$parent.editNode = function (node) {
            node.copy = angular.extend({}, node);
            node.state = node.state || {};
            node.state.edit = true;

        }
    });

    app.controller('insItemrAddOrEditModalCtrl', function ($scope, $http, $uibModalInstance,$timeout, $filter, fac, param) {
        $scope.config={
            toolbar: [
                'bold italic underline strikethrough | superscript subscript | forecolor backcolor | removeformat |',
                'insertorderedlist insertunorderedlist | selectall cleardoc paragraph | fontfamily fontsize',
                '| justifyleft justifycenter justifyright justifyjustify |',
                '| horizontal  |preview fullscreen', 
            ]
        };
        $timeout(function(){
             $scope.showUm=true
        },100)
        $scope.item = {
            insItemTypeId: param.insItemTypeId,
            checkType: 1,
        };
        //如果是修改，则查询
        if (fac.isNotEmpty(param.insItemId)) {
            $http.get("/ovu-pcos/pcos/inspection/insitem/get.do?insItemId=" + param.insItemId).success(function (data, status, headers, config) {
                if (fac.isNotEmpty(data.data)) {
                    $scope.item = data.data;
                    
                } else {
                    alert();
                }
            })
        }

        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            delete item.createTime;
            delete item.modifyTime;
            $http.post("/ovu-pcos/pcos/inspection/insitem/edit.do", item, fac.postConfig).success(function (data, status, headers, config) {
                if (data.code == "0") {
                    $uibModalInstance.close();
                    msg("保存成功!");
                } else {
                    alert();
                }
            })
        }
        $scope.cancel = function () {
           
            $uibModalInstance.dismiss('cancel');
        };

    });
})();
