(function () {
    var app = angular.module("angularApp");
    app.controller('taxRateCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "税率";
        app.modulePromiss.then(function () {
            $scope.search = {};
            $scope.pageModel = {};
            $scope.$watch('project.id', function (projectId, oldValue) {
                if (projectId) {
                    $scope.search.parkId='';
                    $scope.search.stageId='';
                    $scope.search.buildId='';
                    $scope.search.parkId = $rootScope.project.parkId;
                    $rootScope.project.stageId && ($scope.search.stageId = $rootScope.project.stageId)
                    $rootScope.project.buildId && ($scope.search.buildId = $rootScope.project.buildId)
                    $scope.find(1)
                }
            })

        });

        $scope.find = function (pageNo) {
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            fac.getPageResult("/ovu-park/backstage/sale/saleTaxRate/list", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
        //编辑／新增模态窗口
        $scope.addTaxRate = function (id) {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/investmentSystem/projectPrepare/taxRate/modal.addPayment.html',
                controller: 'addTaxRateCtrl',
                resolve: { data: { taxRateId: id } }
            });
            modal.result.then(function () {
                $scope.find(1);
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

    });
    //新增税率
    app.controller('addTaxRateCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, $filter, fac, data) {

        $scope.item = {
            id: data.taxRateId
        }
        $scope.buildList=[]
        //页面信息
        $scope.taxRateInfo={}
        $scope.config = { edit: false, showCheckbox: true }
        $scope.paymentTree = angular.copy($rootScope.projectTree);
        var initDetail = function () {
            if ($scope.item.id) {
                $http.post(" /ovu-park/backstage/sale/saleTaxRate/getDetailsById", { id: $scope.item.id }, fac.postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        $scope.taxRateInfo=resp.data;
                        if($scope.taxRateInfo.parkName&&$scope.taxRateInfo.stageName){
                            $scope.scopeName=$scope.taxRateInfo.parkName+$scope.taxRateInfo.stageName
                        }else{
                            $scope.scopeName=''
                        }

                    } else {
                        alert(resp.msg);
                    }
                });
            }
        }
        initDetail()

        var delBuild = function (node) {
            if (node.nodes) {
                if (node.stageId) {
                    delete node.nodes
                } else {
                    node.nodes.forEach(function (n) { delBuild(n) })

                }

            }
        }
        delBuild($scope.paymentTree[0])
        $scope.treeArr = fac.treeToFlat($scope.paymentTree);
        $scope.buildList = []//选中的楼栋信息
        var temp;
        if ($rootScope.project.pid !== '') {
            if ($rootScope.project.buildId) {//选中的楼栋                
                temp= $scope.treeArr.find(function (n) { return n.id == $rootScope.project.pid })
            } else {//选中的分期
                temp = $scope.treeArr.find(function (n) { return n.id == $rootScope.project.id })
            }
            $scope.payment =angular.copy(temp)
            $scope.isSelBuild = false
        } else {
            $scope.payment = angular.copy($rootScope.project);
            $scope.payment.nodes&&(delete $scope.payment.nodes)
            $scope.isSelBuild = true
        }

        $scope.setStage = function (payment, node) {
            $scope.buildList=[];
            $scope.taxRateInfo.buildIds=''
            if (node) {
                payment.stageId=''
                angular.extend(payment,node);
                if (node.stageId) {
                    $scope.isSelBuild = false
                } else {
                    $scope.isSelBuild = true
                }
            }
        }
        $scope.openBuildModal = function () {
            if (!$scope.payment.stageId) {
                alert("请先选择分期！")
                return
            }
            var modal = $uibModal.open({
                animation: false,
                size: '',
                templateUrl: '/view/investmentSystem/projectPrepare/modal.selectRoom.html',
                controller: 'selectBuildModalCtrl',
                resolve: { stageObj: { stageTree: angular.copy($scope.payment), builds: angular.copy($scope.buildList) } }
            });
            modal.result.then(function (data) {
                console.log("data.builds:", data.builds)
                $scope.buildList=data.builds
                $scope.taxRateInfo.buildIds=data.newChooseIds.join(",")
                // angular.extend($scope.baseMsg, data.houses)

            }, function () {
            });
        }
        // 保存
        $scope.save = function (form,type) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return false;
            }

            if(!$scope.item.id){//新增

                if (!$scope.payment.stageId) {
                    alert("请先选择分期！")
                    return
                }
                $scope.taxRateInfo.parkId=$scope.payment.parkId
                $scope.taxRateInfo.stageId=$scope.payment.stageId
                if (type) {//保存并关闭
                    debugger
                    $http.post("/ovu-park/backstage/sale/saleTaxRate/add", $scope.taxRateInfo, fac.postConfig).success(function (resp) {
                        if (resp.code == 0) {
                            window.msg("保存成功！")
                            $uibModalInstance.close()
                        } else {
                            alert(resp.msg);
                            $scope.cancel()
                        }
                    });
                } else {//保存
                    $http.post("/ovu-park/backstage/sale/saleTaxRate/add", $scope.taxRateInfo, fac.postConfig).success(function (resp) {
                        if (resp.code == 0) {
                            window.msg("保存成功！")
                            $uibModalInstance.close()
                        } else {
                            alert(resp.msg);
                        }
                    });
                }
            }else{
                if (type) {//保存并关闭
                    $http.post("/ovu-park/backstage/sale/saleTaxRate/update", $scope.taxRateInfo, fac.postConfig).success(function (resp) {
                        if (resp.code == 0) {
                            window.msg("修改成功！")
                            $uibModalInstance.close()
                        } else {
                            alert(resp.msg);
                            $scope.cancel()
                        }
                    });
                } else {//保存
                    $http.post("/ovu-park/backstage/sale/saleTaxRate/update", $scope.taxRateInfo, fac.postConfig).success(function (resp) {
                        if (resp.code == 0) {
                            window.msg("保存成功！")
                            $uibModalInstance.close()
                        } else {
                            alert(resp.msg);
                        }
                    });
                }

            }
        }

        // 取消
        $scope.cancel = function () {
            $uibModalInstance.close();
        }
    });
    // 选择楼栋
    app.controller('selectBuildModalCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, stageObj) {
        $rootScope.treeData = null;
        $rootScope.flatData = null;
        $scope.config = { edit: false, showCheckbox: true }
        $scope.rightObj = '';
        var parkId = $rootScope.project.parkId
        $scope.newChooseIds = [];//编辑资源，已选定，即将要关联的空间id
        $scope.treeData = []
        $scope.treeData.push(stageObj.stageTree)
        var dataObj = {
            "stageId": stageObj.stageTree.id
        }

        $http.post("/ovu-park/backstage/sale/saleparkhouse/getBuildIdByStageId", dataObj, fac.postConfig).success(function (treeData) {
            if (treeData.code == 0) {
                $scope.treeData[0].nodes = []
                treeData.data.forEach(function (n) {
                    $scope.treeData[0].nodes.push({ id: n.buildId, buildId: n.buildId, text: n.buildName, buildName: n.buildName, parkName: n.parkName, parkId: n.parkId, pid: n.stageId, stageId: n.stageId, stageName: n.stageName })
                })
                $scope.flatData = fac.treeToFlat($scope.treeData);
                $scope.rightList = [];
                stageObj.builds.forEach(function (build) {
                    var node = $scope.flatData.find(function (n) { return n.id == build.id });
                    if (node != undefined) {
                        node.state = node.state || {};
                        node.state.checked = true;
                        expandFather(node);
                        node.fullPath = node.stageName + ">" + node.buildName;
                        $scope.rightList.push(node);
                        $scope.newChooseIds.push(node.buildId);
                    }
                });
            }
        });

        function expandFather(node) {
            var father = $scope.flatData.find(function (n) { return n.id == node.pid });
            if (father) {
                father.state = father.state || {};
                father.state.expanded = true;
                expandFather(father);
            }
        }
        $scope.validChooseHids = [];//用于收集已勾选的房屋id
        $scope.reduceHis = [];//用于收集取消勾选的房屋id
        $scope.check = function (node) {
            node.state = node.state || {};
            node.state.checked = !node.state.checked;
            function checkSons(node, status) {
                node.state = node.state || {};
                node.state.checked = status;
                if (node.nodes && node.nodes.length) {
                    node.nodes.forEach(function (n) {
                        if (node.state.checked) {//当选中的时候
                            if ($scope.validChooseHids.indexOf(n.buildId) === -1) {//只有不包含当前房屋的id时，才加入
                                $scope.validChooseHids.push(n.buildId);
                            }
                        }
                        checkSons(n, status);
                    });
                } else {
                    if (node.state.checked) {//当选中的时候
                        if ($scope.validChooseHids.indexOf(node.buildId) === -1) {//只有不包含当前房屋的id时，才加入
                            $scope.validChooseHids.push(node.buildId);
                        }
                    } else {//当未选中的时候
                        $scope.validChooseHids.splice($scope.validChooseHids.indexOf(node.buildId), 1);
                        $scope.reduceHis.push(node.buildId);
                    }
                }
            }
            function uncheckFather(node) {
                var father = $scope.flatData.find(function (n) { return n.id == node.pid });
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
            $scope.rightList = $scope.flatData.filter(function (n) { return n.state && n.state.checked == true && n.pid != null && n.buildName != null })
            //console.info(angular.toJson($scope.rightList));
           
            $scope.newChooseIds = [];
            for (var i = 0; i < $scope.rightList.length; i++) {
                var rightObj = $scope.rightList[i];
                var fullPath = rightObj.stageName + ">" + rightObj.buildName;
                $scope.rightList[i].fullPath = fullPath;
                $scope.newChooseIds.push(rightObj.buildId);
            }
            if ($scope.rightList.length == 0) {
                $scope.newChooseIds = [];
            }
        }
        $scope.save = function () {
            var builds = [];
            angular.copy($scope.rightList, builds);
            $uibModalInstance.close({ builds: builds, newChooseIds: $scope.newChooseIds });
            $scope.reduceHis = [];//清空
        }
        //copy======end
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    });

})();
