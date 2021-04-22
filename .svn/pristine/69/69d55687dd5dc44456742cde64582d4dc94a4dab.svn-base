/**
 * Created by Zn on 2017/11/17.
 */
(function(angular) {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('checkFormManageCtrl', function($scope, $rootScope, $uibModal, $state, $http, $filter, fac) {
        document.title='抄表管理';
        $scope.search = {

        };
        $scope.fn=function () {
            selectClassify();
            $scope.find();
        }
        $scope.pageModel = {};
        app.modulePromiss.then(function() {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId;
                        $scope.search.parkName = $scope.dept.parkName;
                        $scope.fn();
                    } else {
                        alert('请选择跟项目关联的部门');
                        $scope.search.parkId &&  delete $scope.search.parkId
                        $scope.search.parkName &&  delete $scope.search.parkName;
                    }

                }

            })
        })
        function selectClassify() {
            $http.get("/ovu-energy/energy/classify/list.do").success(function (data) {
                $scope.measureCategory=data.data;
            });
        }
        $scope.download = function(item) {
            window.location.href = '/ovu-energy/energy/read/download?importId=' + item.importId;
        };
        $scope.del = function(item) {
            confirm("是否删除？", function() {
                $http.post('/ovu-energy/energy/read/delete', { importId: item.importId }, fac.postConfig).success(function(data) {
                    if (data.code==0) {
                        msg(data.msg);
                        $scope.find();
                    } else {
                        alert(data.msg);
                    }
                });
            })
        }
        $scope.find = function(pageNo) {
            if (!$rootScope.dept || !$rootScope.dept.id) {
                alert("请选择部门！");
                return false;
            }
            if(!$scope.search.personName){
                delete $scope.search.personId;
            }
            $.extend($scope.search, { currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult("/ovu-energy/energy/read/list", $scope.search, function(data) {
                $scope.pageModel = data;
            });
        };
        $scope.outputTemplate = function(type) {
            var param = {
                type: type,
                parkId: $scope.search.parkId
            };
            $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/energy/checkFormManage/modal.outputTemplate.html',
                controller: 'outputTemplateModalCtrl',
                resolve: {
                    param: function() {
                        return param;
                    }
                }
            });
        };
        $scope.inputFile = function(type) {
            var modal = $uibModal.open({
                animation: false,
                size: 'md',
                templateUrl: '/view/energy/checkFormManage/modal.inputSelect.html',
                controller: 'inputModalCtrl',
                resolve: {
                    type: type
                }
            });
            modal.result.then(function() {
                $scope.find();
            });
        };
        $scope.selectedPerson=function(item,search){
            search.personId=item.id;
         }
    });

    app.controller('outputTemplateModalCtrl', function($scope, $http, $uibModal, $uibModalInstance, $filter, fac, param) {
        var read = '';
        $scope.item = {
            parkId: param.parkId,
            readWay: read,
            importType: param.type
        };
        $http.get("/ovu-energy/energy/classify/list.do").success(function (data) {
            $scope.measureCategory=data.data;
        });
        $scope.confirm = function() {
            $scope.item.readWay = read;
            if($scope.item.classifyId===undefined){
                alert("请选择计量分类");
                return;
            }
            if($scope.item.readWay==''){
                alert('请选择抄表方式');
                return;
            }
            window.location.href = '/ovu-energy/energy/read/template?parkId=' + $scope.item.parkId + '&classifyId=' + $scope.item.classifyId + '&readWay=' + $scope.item.readWay + '&importType=' + $scope.item.importType;
            $uibModalInstance.close();

        }
        $scope.allCheck = false;
        $scope.handCheck = false;
        $scope.autoCheck = false;
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.clickAll = function() {
            $scope.handCheck = $scope.allCheck;
            $scope.autoCheck = $scope.allCheck;
            $scope.handCheck && $scope.autoCheck ? $scope.readType = '1,2' : $scope.readType = '';
            read = $scope.readType;
        };
        $scope.clickSingle = function() {
            $scope.allCheck = $scope.handCheck && $scope.autoCheck;
            if ($scope.allCheck) {
                $scope.readType = '1,2';
            } else if ($scope.handCheck) {
                $scope.readType = '1';
            } else if ($scope.autoCheck) {
                $scope.readType = '2';
            } else {
                $scope.readType = '';
            }
            read = $scope.readType;
        };
    });
    app.controller('inputModalCtrl', function($scope, $rootScope, $http, $uibModal, $uibModalInstance, $filter, fac, type) {
        $scope.item = {
            /*file:'11.xlsx',
            date:'2011-1-1'*/
            importType: type
        }
        $scope.uploadSpace = function() {

            uploadExcel($scope.item, function(resp) {
                $uibModal.open({
                    animation: false,
                    size: 'lg',
                    templateUrl: '/view/energy/checkFormManage/modal.inputCounts.html',
                    controller: 'inputCountsModalCtrl',
                    resolve: {
                        param: resp
                    }
                });
            });
        }

        function uploadExcel(params, fn) {
            upload({
                url: "/ovu-energy/energy/read/import.do",
                params: params,
                accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            }, function(resp) {
                if (resp.success) {

                    fn && fn(resp);
                    $uibModalInstance.close();
                } else {
                    alert(resp.error);
                }
            });

            function upload(options, fn) {
                if (!$scope.item.selectTime) {
                    alert("请先选择时间");
                    return;
                }
                if (typeof(options.params) != "object") {
                    options.params = {};
                }
                if (!options.url) {
                    options.url = '/ovu-pcos/upload/img.do';
                }
                var index;
                if (options.nowait) {
                    options.onSubmit = function() {};
                } else {
                    options.onSubmit = function() {
                        index = layer.load(1, {
                            shade: [0.2, '#000'] //0.1透明度的白色背景
                        });
                    };
                }
                options.onComplate = function(data) {
                    layer.close(index);
                    if (Array.isArray(data.data)) {
                        fn && fn(data.data);
                    } else if ("object" == typeof data.data) {
                        if (data.code==0) {
                            fn && fn(data.data);
                        } else {
                            layer.alert(data.error || "上传发生错误!", { btn: ['ok'], title: false });
                        }
                    } else if ("string" == typeof data.data) {
                        data = JSON.parse(data.data);
                        if (data.code==0) {
                            fn && fn(data.data);
                        } else {
                            layer.alert("上传发生错误!", { btn: ['ok'], title: false });
                        }
                    } else {
                        layer.alert("发生错误:" + data, { btn: ['ok'], title: false });
                    }
                };
                // 上传方法
                $.upload(options);
            }
        }
        /*$scope.save=function () {

            console.log($scope.item);
           /!* $http.post("/ovu-pcos/pcos/readFormRecord/recordImport",$scope.item, fac.postConfig).success(function (data) {
                if(data.success){
                    $uibModalInstance.close();
                    msg("保存成功!");
                }
                else {
                    alert("失败");
                }
            });*!/
        };*/
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    });
    app.controller('inputCountsModalCtrl', function($scope, $rootScope, $http, $uibModal, $uibModalInstance, $filter, fac, param) {
        $scope.item = param;
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.download = function() {
            window.location.href = '/ovu-energy/energy/read/downloadErrorData?fileName=' + param.fileName;
        }
    });
})(angular)
