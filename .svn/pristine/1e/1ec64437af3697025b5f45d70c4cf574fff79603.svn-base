/**
 * Created by Administrator on 2017/7/20.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");
    //项目架构ctl
    app.controller('equipmentTypeTreeCtrl', function ($scope, $rootScope, $timeout, $http, $filter, $uibModal, fac) {
        document.title = "设备分类";

        function getEmtTree(){
            $http.get("/ovu-pcos/pcos/equipment/getEmtTree").success(function (resp) {
                if (resp.success) {
                    var tree = resp.data || [];
                    fac.copyTreeState($scope.equipTypeTree,tree);
                    $scope.equipTypeTree = tree;
                }
            })
        }

        function showEditModal(equipType){
            var modal = $uibModal.open({
                animation: true,
                size: 'lg',
                templateUrl: '/view/sys/dictManage/equipmentType.modal.html',
                controller: 'equipmentTypeCtrl',
                resolve: {
                    equipType: function () {
                        return equipType;
                    }
                }
            });
            modal.result.then(function (data) {
                getEmtTree();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        getEmtTree();


        //一级分类
        $scope.addTopNode = function () {
            showEditModal({});
        }


        //下级分类
        $rootScope.addSon = function (node) {
            var equipType = {
                ptexts: (node.ptexts ? node.ptexts + ">" : "") + node.text,
                pid: node.id,
                pids: (node.pids ? node.pids + "," : "") + node.id
            }
            showEditModal(equipType);
        }

        //编辑分类
        $scope.editNode = function (node, pnode) {
            var equipType = angular.extend({pEquipType:pnode?pnode.equipType:''}, node);
            showEditModal(equipType);
        }

        //选中分类节点
        $scope.selectNode = function (node) {
            var curNode = fac.getSelectedNode($scope.equipTypeTree);
            if (curNode && curNode != node) {
                curNode.state.selected = false;
            }
            node.state = node.state || {};
            node.state.selected = !node.state.selected;
        }

        //删除分类
        $scope.delNode = function (node) {
            if (node.nodes && node.nodes.length) {
                alert("此节点有下级节点,不能删除！")
            } else {
                confirm("确定删除 " + node.text, function () {
                    $http.post("/ovu-pcos/pcos/equipment/equipType/del.do", {
                        ids: node.id
                    }, fac.postConfig).success(function (resp) {
                        if (resp.success) {
                            getEmtTree();
                        } else {
                            alert(resp.error);
                        }
                    });
                })
            }
        }

    });

    app.controller('equipmentTypeCtrl', function ($scope, $rootScope, $http, $uibModal, $uibModalInstance, $filter, fac, equipType) {
        $scope.item = equipType;
        equipType.defs = equipType.defs || [];
        equipType.faultTypeTree = equipType.faultTypeTree || [];
        equipType.params = equipType.params || []; //检测参数定义
        if (equipType.pids && equipType.pids.split(",").length == 3) {
            equipType.canUploadLogo = true;
        }
        $scope.readOnly = false; //名称是否只读

        //如果是传感器的子类，且传感器协议列表为空，则获取传感器协议列表
        if(equipType.pEquipType == 'sensor' && !$rootScope.sensorTypeTree){
            fac.setSensorTypeTree();
        }
        if (equipType.id) {
            $scope.readOnly = true;
            $scope.hasNodes = equipType.nodes && equipType.nodes.length > 0;

            $http.get("/ovu-pcos/pcos/equipment/equipType/get.do?id=" + equipType.id).success(function (resp) {
                if (resp.success) {
                    angular.extend(equipType, resp.data);
                } else {
                    alert(resp.error);
                }
            })
            $http.get("/ovu-pcos/pcos/equipment/getFaultTypeTreeDirect.do?equipTypeId=" + equipType.id).success(function (resp) {
                if (resp.code == 0) {
                    equipType.faultTypeTree = resp.data;
                } else {
                    alert(resp.msg);
                }
            })
        }
        //选择工作类型
        $scope.selectNode = function (node, param) {
            function _choose() {
                param.worktype_id = node.id;
                param.worktype_name = (node.ptexts ? node.ptexts + " > " : "") + node.text;
            }
            if (node.id && node.id != param.worktype_id) {
                _choose();
                param.worktypeHover = param.worktypeFocus = false;
            }
            // console.log(node);
        }
        $scope.clearWorkType = function (param) {
            delete param.worktype_name;
            delete param.worktype_id;
        }

        //选择参数
        $scope.selectDetectParam = function (item) {
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '/view/equipment/selector.detectParam.html',
                controller: 'selectDetectParamModalCtrl',
                resolve: {
                    detectParams: function () {
                        return angular.extend([], item.params)
                    }
                }
            });
            modal.result.then(function (data) {
                data.params.forEach(function (n) {
                    var temp = item.params.find(function (m) {
                        return m.detect_param_id == n.detect_param_id
                    });
                    angular.extend(n, temp);
                });
                item.params = data.params;
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        //保存
        $scope.saveType = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            delete item.state;
            $http.post("/ovu-pcos/pcos/equipment/equipType/save.do", item).success(function (resp, status, headers, config) {
                if (resp.success) {
                    $uibModalInstance.close(resp.data);
                    msg("保存成功!");
                } else {
                    alert(resp.error);
                }
            })
        }

        $scope.save = function(node){
            if (!node.copy.text) {
                alert('名称不能为空');
                return;
            }
            node.text = node.copy.text;
            node.state.edit = false;
        }
        $scope.addTopNode = function () {
            equipType.faultTypeTree.push({
                state: {edit: true},
                copy: {
                }
            });
        }

        $scope.addSon = function (node) {
            node.nodes = node.nodes || [];
            node.state = node.state || {};
            node.state.expanded = true;
            node.nodes.push({
                pid: node.id,
                state: {edit: true},
                copy: {}
            });
        }
        //删除项目分类
        $scope.delNode = function (node) {
            if (node.nodes && node.nodes.length) {
                alert("此节点有下级节点,不能删除！");
            } else {
                confirm("确定删除 " + node.text + "?", function () {
                    var flatTree = fac.treeToFlat(equipType.faultTypeTree);
                    var parent = flatTree.find(function(n){return n.nodes && n.nodes.indexOf(node>-1)});
                    if (parent) {
                        parent.nodes.splice(parent.nodes.indexOf(node), 1)
                    } else {
                        equipType.faultTypeTree.splice(equipType.faultTypeTree.indexOf(node), 1)
                    }
                })
            }
        }
        $scope.undo = function (node) {
            if (node.id) {
                node.state.edit = false;
            } else {
                var flatTree = fac.treeToFlat(equipType.faultTypeTree);
                var parent = flatTree.find(function(n){return n.nodes && n.nodes.indexOf(node>-1)});
                if (parent) {
                    parent.nodes.splice(parent.nodes.indexOf(node), 1)
                } else {
                    equipType.faultTypeTree.splice(equipType.faultTypeTree.indexOf(node), 1)
                }
            }
        }
        $scope.editNode = function (node) {
            node.copy = angular.extend({}, node);
            node.state = node.state || {};
            node.state.edit = true;
        }
    });

    app.controller('selectDetectParamModalCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, detectParams) {

        $scope.config = {
            edit: false,
            showCheckbox: true
        }
        $scope.rightList = [];

        $http.get("/ovu-pcos/pcos/sensor/getSensorTree.do?withDetectParam=true").success(function (resp) {
            if (resp.success) {
                $scope.detectParamTree = resp.data;
                $scope.flatData = fac.treeToFlat($scope.detectParamTree);

                detectParams.forEach(function (param) {
                    var node = $scope.flatData.find(function (n) {
                        return n.detect_param_id == param.detect_param_id
                    });
                    node.state = node.state || {};
                    node.state.checked = true;
                    //                        expandFather(node);
                    $scope.rightList.push(node);
                })
            }
        })

        function expandFather(node) {
            var father = $scope.flatData.find(function (n) {
                return n.id === node.pid
            });
            if (father) {
                father.state = father.state || {};
                father.state.expanded = true;
                expandFather(father);
            }
        }

        $scope.check = function (node) {

            node.state = node.state || {};
            node.state.checked = !node.state.checked;

            function checkSons(node, status) {
                node.state = node.state || {};
                node.state.checked = status;
                if (node.nodes && node.nodes.length) {
                    node.nodes.forEach(function (n) {
                        checkSons(n, status);
                    })
                }
            }

            function uncheckFather(node) {
                if (!node.pid) return;
                var father = $scope.flatData.find(function (n) {
                    return n.id == node.pid
                });
                if (father) {
                    father.state = father.state || {};
                    father.state.checked = false;
                    uncheckFather(father);
                }
            }
            if (node.state.checked) {
                checkSons(node, true);
            } else {
                checkSons(node, false);
                uncheckFather(node);
            }
            $scope.rightList = $scope.flatData.filter(function (n) {
                return n.state && n.state.checked == true && n.detect_param_id
            })
        }
        $scope.save = function () {
            $scope.rightList.forEach(function (n) {
                n.id = n.params_id
            });
            $uibModalInstance.close({
                params: $scope.rightList
            });
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

})();
