(function() {
    "use strict";
    var app = angular.module("angularApp");

    //企业合同库管理ctrl
    app.controller("libraryCtrl", function($scope, $rootScope, $uibModal, $sce, $http, $filter, $state, fac) {
        document.title = "企业合同库";
        $scope.pageModel = {};
        $scope.search = {};


        //判断是集团版还是项目版
        app.modulePromiss.then(function() {
            $scope.search = { isGroup: fac.isGroupVersion() };
            if ($scope.search.isGroup) {
                ($scope.search.parkId == undefined || $scope.search.parkId == 'undefined' || $scope.search.parkId == null) ? $scope.search.parkId = '': $scope.search.parkId;
                $scope.find();
            } else {
                $scope.$watch('park', function(newValue, oldValue) {
                    if (newValue && newValue.id) {
                        $scope.search.parkId = newValue.id;
                        //$scope.search.PARK_NAME = newValue.PARK_NAME;
                        $scope.find();
                    } else {
                        alert("请先选定一个项目");
                    }
                });
            }
        });

        $scope.del = function(item) {
            confirm("确认删除吗？", function() {
                $http.post('/ovu-pcos/pcos/compact/info/remove', { compactInfoId: item.compactInfoId }, fac.postConfig).success(function(data) {
                    if (data.status) {
                        $scope.find();
                        msg(data.msg);
                    } else {
                        msg(data.msg);
                    }
                })
            })
        };

        $scope.find = function(pageNo) {
            $.extend($scope.search, { currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;

            var data = {};
            if (!fac.isEmpty($scope.pageDate)) {
                $scope.pageDate.forEach(function(v) {
                    // if(v.dataItemType==3){
                    data[v.dataItemCode] = v[v.dataItemCode];
                    // }

                })
                $scope.search.data = JSON.stringify(data);
            }


            //自定义搜素条件
            // if ($scope.pageDate) {
            //     for (var i = 0; i < $scope.pageDate.length; i++) {
            //         // data[$scope.pageDate[i].dataItemCode] = $scope.pageDate[i].dataItemCode;
            //         if ($scope.pageDate[i].Text) {
            //             data[$scope.pageDate[i].dataItemCode] = $scope.pageDate[i].Text;
            //             // values.push($scope.pageDate[i].Text);
            //         } else if ($scope.pageDate[i].money) {
            //             data[$scope.pageDate[i].dataItemCode] = $scope.pageDate[i].money;
            //             // values.push($scope.pageDate[i].money);
            //         } else if ($scope.pageDate[i].day) {
            //             data[$scope.pageDate[i].dataItemCode] = $scope.pageDate[i].day;
            //             // values.push($scope.pageDate[i].day);
            //         } else if ($scope.pageDate[i].futext) {
            //             data[$scope.pageDate[i].dataItemCode] = $scope.pageDate[i].futext;
            //             //    values.push($scope.pageDate[i].futext);
            //         }

            //         // keys.push($scope.pageDate[i].dataItemCode);
            //         //  if ($scope.pageDate[i].Text) {
            //         //     values.push($scope.pageDate[i].Text);
            //         // } else if ($scope.pageDate[i].money) {
            //         //     values.push($scope.pageDate[i].money);
            //         // } else if ($scope.pageDate[i].day) {
            //         //     values.push($scope.pageDate[i].day);
            //         // } else if ($scope.pageDate[i].futext) {
            //         //    values.push($scope.pageDate[i].futext);
            //         // }


            //         //data.push(keys[i]+':'+values[i]);
            //         // if ($scope.pageDate[i].Text) {
            //         //     menu[i].dataItemCode = $scope.pageDate[i].Text;
            //         // } else if ($scope.pageDate[i].money) {
            //         //     menu[i].dataItemCode = $scope.pageDate[i].money;
            //         // } else if ($scope.pageDate[i].day) {
            //         //     menu[i].dataItemCode = $scope.pageDate[i].day;
            //         // } else if ($scope.pageDate[i].futext) {
            //         //     menu[i].dataItemCode = $scope.pageDate[i].futext;
            //         // }

            //     }
            //     console.log(data);


            //     $scope.search.data = JSON.stringify(data);
            // }

            //分页，搜索
            console.log($scope.search);
            fac.getPageResult("/ovu-pcos/pcos/compact/info/queryAll", $scope.search, function(menu) {
                    $scope.pageModel = menu;
                    console.log("分页成功");
                    $scope.search.data = '';
                })
                //合同分类下拉加载
            $http.post('/ovu-pcos/pcos/compact/classify/loadClassifyList', { parkId: $scope.search.parkId }, fac.postConfig).success(function(data) {
                $scope.msg = data;

            })

        };


        //合同查看
        $scope.showInform = function(item) {
            sessionStorage.setItem('back', 'library');
            sessionStorage.setItem('status', 4);
            sessionStorage.setItem('id', item.compactInfoId);
            $state.go('three', { folder: 'agreement', catalogue: 'agreementdiscard', page: 'agreementabandoned' });
        }
        $scope.showProcess = function(item) {
            sessionStorage.setItem('back', 'library');
            sessionStorage.setItem('id', item.compactInfoId);
            sessionStorage.setItem('compactStatus', item.compactStatus);
            $state.go('three', { folder: 'agreement', catalogue: 'agreementdiscard', page: 'agreementprocess' });
        }
        $scope.remind = function(item) {
            sessionStorage.setItem('back', 'library');
            sessionStorage.setItem('id', item.compactInfoId);
            $state.go('three', { folder: 'agreement', catalogue: 'agreementdiscard', page: 'agreementremind' });
        }

        //自定义分类搜索
        $scope.selfFind = function() {
            var search = $scope.search;
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/agreement/agreementlibrary/modal.library.html',
                controller: 'selfFindCtrl',
                resolve: { search: search }
            });
            modal.result.then(function(item) {
                //$scope.find();

                //自定义查询回选在主页面
                //
                item.forEach(function(v) {
                    if (v.dataItemType == 3) {
                        v.minMoney = v[v.dataItemCode].split("/-")[0];
                        v.maxMoney = v[v.dataItemCode].split("/-")[1];
                    } else if (v.dataItemType == 2) {
                        v.startDate = v[v.dataItemCode].split("/-")[0];
                        v.deadDate = v[v.dataItemCode].split("/-")[1];
                        // v.startDate = v[v.dataItemCode].split("/-")[0];
                        // v.deadDate = v[v.dataItemCode].split("/-")[1];
                    } else if (v.dataItemType == 1) {
                        v.Text = v[v.dataItemCode];
                    } else if (v.dataItemType == 4) {
                        v.futext = v[v.dataItemCode];
                    }
                })
                $scope.pageDate = item;
                // for (var i = 0; i < item.length; i++) {
                //     if (item[i][item[i].dataItemCode]) {
                //         // $('.minMoney').eq(i).val(item[i].money.split("/-")[0]);
                //     //    $scopeMoney = item[i].money.split("/-")[0];
                //     //    item.bigMoney = item[i].money.split("/-")[1];
                //         $scope.minMoney = item[i][item[i].dataItemCode].split("/-")[0];
                //         $scope.maxMoney = item[i][item[i].dataItemCode].split("/-")[1];
                //         // $('.maxMoney').eq(i).val(item[i].money.split("/-")[1]);
                //     } else if (item[i].day) {
                //         $scope.startDate = item[i].day.split("/-")[0];
                //         $scope.deadDate = item[i].day.split("/-")[1];
                //     }
                // }

                console.log(item);
            });
            modal.rendered.then(function() {
                console.log("Modal rendered");
                //$scope.sel();
            });
            modal.opened.then(function() {
                console.log("Modal opened");
            });

        };

        // 显示富文本
        $scope.showRichText = function(title, richText) {
            console.log(112212.11012012021);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                component: 'libraryCtrl.richTextModal',
                resolve: {
                    title: function() {
                        return angular.copy(title);
                    },
                    richText: function() {
                        return angular.copy(richText);
                    }
                }
            });
            modal.result.then(function() {

            });
            modal.rendered.then(function() {
                // console.log("Modal rendered");
            });
            modal.opened.then(function() {
                // console.log("Modal opened");
            });
        };

    });


    app.controller("selfFindCtrl", function($scope, $http, $uibModal, $uibModalInstance, $timeout, $filter, fac, search) {
        $scope.pageModel = {};
        console.log(search);

        $scope.find = function(pageNo) {
            $.extend(search, { currentPage: pageNo || 1, pageSize: $scope.pageModel.pageSize || 10 });
            console.log(search);
            var infoMes = {
                    parkId: search.parkId,
                    currentPage: search.currentPage,
                    pageIndex: search.pageIndex,
                    pageSize: search.pageSize
                }
                //search.pageIndex = $scope.search.currentPage - 1;
            fac.getPageResult('/ovu-pcos/pcos/compact/dataitem/pageQuery', infoMes, function(data) {
                if (data.data) {
                    data.data.forEach(function(element) {
                        element.check = true;
                    });
                    $scope.pageModel = data;
                }
                // data.data.forEach(function (element) {
                //     element.check = true;
                // });
                // $scope.pageModel = data;

            });

        };
        $scope.find();





        var mainData = [];
        $scope.addFind = function(item) {
            console.log(item.check);
            if (item.dataItemType == 1) {
                //item[item.dataItemCode] = item[dataItemCode];
                item[item.dataItemCode] = item[item.dataItemCode];
            } else if (item.dataItemType == 2) {
                item[item.dataItemCode] = item.startDate + '/-' + item.deadDate + '/-2';
            } else if (item.dataItemType == 3) {
                item[item.dataItemCode] = item.minMoney + '/-' + item.maxMoney;
            } else if (item.dataItemType == 4) {
                //富文本型
                //item.futext = $('.fuText').eq(fuNum).val();
                item[item.dataItemCode] = item[item.dataItemCode];
            }
            console.log(item[item.dataItemCode]);
            if (item[item.dataItemCode] == undefined || item[item.dataItemCode] == 'undefined/-undefined' || item[item.dataItemCode] == 'undefined/-undefined/-2') {
                alert('请输入搜索条件！');
                return;
            } else {
                mainData.push(item);
                confirm("添加成功", function() {
                    $timeout(function() {
                        item.check = false;
                        console.log('item', item);
                    })
                });
            }

        };

        //确定
        $scope.save = function(form, item) {
            // form.$setSubmitted(true);
            // if (!form.$valid) {
            //     return;
            // }
            //传递自定义查询数据到主页面
            $uibModalInstance.close(mainData);
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
    });

    // 富文本模态框
    app.component('libraryCtrl.richTextModal', {
        templateUrl: '/view/agreement/agreementlibrary/modal.library.richtext.html',
        bindings: {
            close: '&',
            dismiss: '&',
            resolve: '<'
        },
        controller: ['$sce', function($sce) {
            var $ctrl = this;
            $ctrl.$onInit = function() {
                $ctrl.title = $ctrl.resolve.title;
                $ctrl.richText = $sce.trustAsHtml($ctrl.resolve.richText);
            };
            $ctrl.cancel = function() {
                $ctrl.dismiss();
            };
        }]
    });

})();