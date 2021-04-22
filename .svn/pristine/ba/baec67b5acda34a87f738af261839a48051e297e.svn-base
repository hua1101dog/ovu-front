(function () {
    var app = angular.module("angularApp");
    app.directive('wdatePicker', function () {
        return {
            restrict: "A",
            link: function (scope, element, attr) {
                element.bind('click', function () {
                    window.WdatePicker({
                        onpicked: function () {
                            element.change()
                        },
                        oncleared: function () {
                            element.change()
                        }
                    })
                });
            }
        }
    });
    app.controller('supplierLibraryCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, $location, fac) {
        $scope.typeList = []
        $scope.pageModel = {};
        $scope.search = {};

        $scope.find = function (pageNo) {
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-park/backstage/supplier/supplierInfo/selectByPage", $scope.search, function (resp) {
                console.log(resp)
                $scope.pageModel = resp;
                $scope.pageModel.data.forEach((value, index) => {
                    value.status = false;
                });
            });
        }
        $scope.query = function () {
            if (!fac.checkPark($scope)) {
                return
            } else {
                $scope.find(1);
            }
        };
        // 新增&编辑
        $scope.edit = function (type, item) {
            let editList = item || {};
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/supplierManage/supplierLibrary/modal.libraryEdit.html',
                controller: 'libraryEditCtrl',
                resolve: {
                    item: function () {
                        return $.extend({}, editList, {
                            type: type,
                            typeList: $scope.typeList,
                            parkId: $scope.search.parkId
                        });
                    }
                }
            });
            modal.result.then(function (data) {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
        // 删除
        $scope.cancel = function (item) {
            let params = {
                id: item.id
            }
            var layerIndex = layer.confirm('确认删除吗？', {
                btn: ['确定', '取消'], //按钮
                // shade: false //不显示遮罩
            }, function () {
                $http.post("/ovu-park/backstage/supplier/supplierInfo/delete", params, fac.postConfig).success(function (resp) {
                    if (resp.code === 0) {
                        $scope.find();
                        window.msg(resp.msg);
                        layer.close(layerIndex);
                    } else {
                        window.alert(resp.msg);
                        layer.close(layerIndex);
                    }
                })
            }, function () {
                console.log('取消了');
            });
        }
        $scope.chooseOne = function () {

        }
        // 批量删除
        $scope.batchCancel = function () {
            let chooseItem = [];
            let arrId = [];
            let params;
            chooseItem = $scope.pageModel.data.filter((value, index) => {
                return value.status;
            })
            if (chooseItem.length === 0) {
                window.alert("请选择要删除的供应商!");
                return false;
            }
            chooseItem.forEach((value, index) => {
                arrId.push(value.id);
            })
            params = {
                ids: arrId.join()
            }
            var layerIndex = layer.confirm('确认删除吗？', {
                btn: ['确定', '取消'], //按钮
                // shade: false //不显示遮罩
            }, function () {
                $http.post("/ovu-park/backstage/supplier/supplierInfo/deleteList", params, fac.postConfig).success(function (resp) {
                    if (resp.code === 0) {
                        $scope.find();
                        window.msg(resp.msg);
                        layer.close(layerIndex);
                    } else {
                        window.alert(resp.msg);
                        layer.close(layerIndex);
                    }
                })
            }, function () {
                console.log('取消了');
            });
        }
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.pageModel = {};
                getCompanys();
                $scope.$watch('dept.id', function (deptId, oldValue) {
                    if (deptId) {
                        var parkDept = fac.getParkDept(null, deptId);
                        if (parkDept) {
                            $scope.search.parkId = parkDept.parkId;
                            $scope.search.parkName = parkDept.parkName;
                            $scope.find(1);
                        } else {
                            $scope.pageModel = {};
                            $scope.search = {};
                        }
                    } else {
                        $scope.pageModel = {};
                        $scope.search = {};
                    }
                })
            })
        });
        // 获取供应商类型
        function getCompanys(params) {
            $http.get("/ovu-park/backstage/supplier/supplierTypeInfo/select").success(function (resp) {
                if (resp.code === 0) {
                    $scope.typeList = resp.data;
                }
            })
        }
    });
    // 新增&编辑
    app.controller('libraryEditCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, item) {
        $scope.introductionLength = 400;
        $scope.mainProductLength = 400;
        $scope.search = item;
        $scope.typeList = $scope.search.typeList;
        $scope.curChooseCompany = '';
        if ($scope.search.type === 1) {
            $scope.search.pics = [];
            $scope.search.isSelect = '0';
            $scope.search.isVisible = '1';
        } else if ($scope.search.type === 2) {
            $scope.search.pics = $scope.search.logo.split();
            $scope.introductionLength = 400 - $scope.search.introduction.length;
            $scope.mainProductLength = 400 - $scope.search.mainProduct.length;
        }

        $scope.setName = function (name) {
            $scope.curChooseCompany = name;
            if (!name) {
                $scope.search.pics = [];
                $scope.search.phone = null;
                return false;
            }
            var params = {
                "pageSize": 10,
                "pageIndex": 0,
                "name": name
            };
            $http.post("/ovu-park/backstage/billManage/depositsBillManage/getUserByName", params, fac.postConfig).success(function (response) {
                console.log(response);
                if (response && response.code == 0) {
                    $scope.staffList = response.data;
                    console.log('$scope.staffList',$scope.staffList)
                    if ($scope.staffList && $scope.staffList.data && $scope.staffList.data.length === 1 && $scope.curChooseCompany==$scope.staffList.data[0].name) {
                        $scope.search.pics[0] = $scope.staffList.data[0].userIcon;
                        $scope.search.phone = $scope.staffList.data[0].phone;
                    }
                }
            })

        }

        $scope.setName2 = function (name) {
            console.log('222')
            if (!name) {
                $scope.search.pics = [];
                $scope.search.phone = null;
                return false;
            }
            var params = {
                "pageSize": 10,
                "pageIndex": 0,
                "name": name
            };
            $http.post("/ovu-park/backstage/billManage/depositsBillManage/getUserByName", params, fac.postConfig).success(function (response) {
                console.log(response);
                if (response && response.code == 0) {
                    $scope.staffList = response.data;
                    console.log('$scope.staffList',$scope.staffList)
                    if ($scope.staffList && $scope.staffList.data && $scope.staffList.data.length === 1) {
                        $scope.search.pics[0] = $scope.staffList.data[0].userIcon;
                        $scope.search.phone = $scope.staffList.data[0].phone;
                    }
                }
            })

        }

        // 控制企业简介和主要产品输入字数
        $scope.contentLength = function (content, type) {
            let length = content ? content.length : 0;
            if (type === 1) {
                $scope.introductionLength = 400 - length;
            } else if (type === 2) {
                $scope.mainProductLength = 400 - length;
            }

        }
        $scope.chooseOp = function (data) {
            console.log(data)
        }
        // 保存
        $scope.save = function (form) {
            if (!form.$valid) {

                if (!(/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/.test($scope.search.phone))) {
                    window.alert("手机号码有误，请重填!");
                    return false;
                }
                window.alert("请完成必填项目!");
                return false;
            }
            if ($scope.search.pics.length > 2) {
                window.alert("最多只能上传2张图片, 请删除多余的图片!")
                return false;
            }
            $scope.search.logo = $scope.search.pics.join(',');
            $scope.typeList.forEach((value, index) => {
                if (value.id === $scope.search.typeId) {
                    $scope.search.type = value.type;
                }
            })
            $http.post("/ovu-park/backstage/supplier/supplierInfo/save", $scope.search, fac.postConfig).success(function (resp) {
                if (resp.code === 0) {
                    window.msg(resp.msg);
                    $uibModalInstance.close();
                } else {
                    window.alert(resp.msg);
                }
            })
        }
        // 取消
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }

        // 验证空数组和空对象
        function isEmpty(obj) {
            //检验null和undefined
            if (!obj && obj !== 0 && obj !== '') {
                return true;
            }
            //检验数组
            if (Array.prototype.isPrototypeOf(obj) && obj.length === 0) {
                return true;
            }
            //检验对象
            if (Object.prototype.isPrototypeOf(obj) && Object.keys(obj).length === 0) {
                return true;
            }
            return false;
        }

    });
})()
