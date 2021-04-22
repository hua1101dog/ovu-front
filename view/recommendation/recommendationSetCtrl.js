(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller("recommendationSetCtrl", function ($scope, $rootScope, $http, $uibModal, $filter, $timeout, fac) {
        // console.log("$rootScope", $rootScope)
        document.title = "OVU-产品推荐";
        angular.extend($rootScope, fac.dicts);
        // 存储列表信息
        $scope.search = {
            parkId:$scope.dept.parkId
        }
        $scope.pageModel = {};
        // 页面加载
        $scope.init = function () {
            $scope.find();
        }
        $scope.find = function (pageNo) {
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-park/backstage/productCommandation/listByPage", $scope.search, function (data) {
                $scope.pageModel = data;
                console.log($scope.pageModel)
            })
        }

        // 页面初始化
        app.modulePromiss.then(function () {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId){
                        
                        $scope.search.parkId = $scope.dept.parkId
                        $scope.init();

                    } else {
                        $scope.search.parkId && delete $scope.search.parkId
                        alert('请选择跟项目关联的部门');
                        return
                    }

                }
            })
        })
        // 调用加载页面的函数
        // $scope.init();

        $scope.findPage = function(){
            if ($scope.dept.parkId){
  
                $scope.find();

            } else {
                $scope.search.parkId && delete $scope.search.parkId
                alert('请选择跟项目关联的部门');
                return
            }
        }

        //单个删除
        $scope.del = function (id) {
            $.get("/ovu-park/backstage/productCommandation/del?id=" + id).success(function (resp) {
                if (resp.code == 0) {
                    window.msg("删除成功!");
                    $scope.find();
                } else {
                    window.alert(resp.message);
                }
            });
        }

        //变更启用，禁用
        $scope.enableStatus = function (id, statu) {
            var params = {
                id: id,
                status: statu
            }
            $.get("/ovu-park/backstage/productCommandation/enable", params).success(function (resp) {
                if (resp.code == 0) {
                    window.msg("变更成功!");
                    $scope.find();
                } else {
                    window.alert(resp.message);
                }
            });

        }

        //详情页
        $scope.showRecommedDetail = function (data) {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: "/view/recommendation/recommendModel/recommendationDetail.html",
                controller: "recommendationDetailCtrl",
                resolve: {
                    items: function () {
                        return data;
                    }
                }
            });
            modal.result.then(function () {

            }, function () {

            })
        }


        //编辑页
        $scope.showRecommedEdit = function (data) {

            if ($scope.dept.parkId) {
                var modal = $uibModal.open({
                    animation: false,
                    size: 'lg',
                    templateUrl: "/view/recommendation/recommendModel/recommendationEdit.html",
                    controller: "recommendationEditCtrl",
                    resolve: {
                        items: function () {
                            return data
                        }
                    }
                });
                modal.result.then(function () {
                    $scope.search.proRecommandName = ""
                    $scope.init()
                }, function () {

                })
            } else {
                $scope.search.parkId && delete $scope.search.parkId
                alert('请选择跟项目关联的部门');
                return
            }




        }

    })

    //查看详情弹出框控制器
    app.controller("recommendationDetailCtrl", function ($scope, $rootScope, $uibModalInstance, $http, items, fac) {
        $scope.curItem = items;
        console.log("$scope.curItem", $scope.curItem)
        // $scope.time = (new Date()).getTime();
        $scope.pageModel = {}
        $scope.search = {
            id: $scope.curItem,
            parkId:$scope.dept.parkId
        }
        $scope.detail = {

        }
        $scope.toDetail = function () {
            $http.get('/ovu-park/backstage/productCommandation/get?id=' + $scope.curItem).success(function (data) {
                if (data.code == 0) {
                    $scope.detail = data.data
                    $rootScope.pushDetail = data.data
                    console.log("$scope.detail", $scope.detail)
                }
            })
        }
        $scope.find = function (pageNo) {
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-park/backstage/productCommandation/pushHistoryByPage", $scope.search, function (data) {
                $scope.pageModel = data;
                console.log("$scope.pageModel", $scope.pageModel)
            })
        }

        $scope.find();

        $scope.toDetail();


        $scope.save = function () {
            console.log("close")
            $uibModalInstance.close();
        }
        $scope.cancel = function () {
            console.log("cancel")
            $uibModalInstance.dismiss('cancel');
        }
    })

    //编辑弹出框控制器
    app.controller("recommendationEditCtrl", function ($window, $scope, $rootScope, $uibModal, $uibModalInstance, $http, items) {
        $scope.pageModel = items
        $scope.delList = []
        $scope.ids = []
        $scope.idsData = []
      
        $scope.delProList = $(".proList tr a")
        console.log("$scope.pageModel", $scope.pageModel)

        if ($scope.pageModel) {
            $scope.getProDetail = function (items) {
                $http.get('/ovu-park/backstage/productCommandation/get?id=' + $scope.pageModel.id).success(function (data) {
                    if (data.code == 0) {
                        $scope.proDetail = data.data
                        $scope.ids = $scope.proDetail.supplierInfoIds
                        console.log("$scope.proDetail", $scope.proDetail)
                    }
                })
            }
            $scope.getProDetail()
        }

        //删除供应商
        $scope.delPro = function (item) {
            
            if ($scope.pageModel.id){
                console.log("item",item)
                console.log("$scope.pageModel.id",$scope.pageModel.id)
                var indexPro = $scope.ids.indexOf(item.id)
                $scope.ids.splice(indexPro,1)

                var indexIdsData = $scope.proDetail.supplierInfos.indexOf(item)
                $scope.proDetail.supplierInfos.splice(indexIdsData, 1)

                console.log("$scope.ids", $scope.ids)
                console.log("$scope.proDetail.supplierInfos", $scope.proDetail.supplierInfos)
            }else{
                console.log("item",item)
                var indexIdsData = $scope.idsData.indexOf(item)
                $scope.idsData.splice(indexIdsData, 1)

                var indexPro = $scope.ids.indexOf(item.id)
                $scope.ids.splice(indexPro, 1)

                console.log("$scope.ids", $scope.ids)
                console.log("$scope.idsData", $scope.idsData)
            }


        }

        //选择供应商
        $scope.chooseProvider = function () {
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: "/view/recommendation/recommendModel/modelChildren/chooseProvider.html",
                controller: "chooseProviderCtrl",
                resolve: {
                    items: function () {
                        return {};
                    }
                }
            });
            modal.result.then(function (data) {
                //供应商ID去重
                function func1(array) {
                    var temp = [];
                    for (var i = 0; i < array.length; i++) {
                        if (temp.indexOf(array[i]) === -1)
                            temp.push(array[i]);
                    }
                    return temp;
                }
                var idsOld = $scope.ids.concat(data.ids)
                var idsNew = func1(idsOld)
                $scope.ids = idsNew


                //供应商显示列表去重
                function func4(objArray) {
                    var result = [];
                    var temp = {};
                    for(var i=0;i<objArray.length;i++){  
                        var myname = objArray[i].id;
                        if(temp[myname]){
                            continue;
                        }  
                        temp[myname] = true;
                        result.push(objArray[i])
                    }  
                    return result;  
                }


                if($scope.proDetail){
                    var idsDataOld = $scope.proDetail.supplierInfos.concat(data.idsData)
                    var idsDataNew = func4(idsDataOld)
                    $scope.proDetail.supplierInfos = idsDataNew
                    console.log(" $scope.proDetail.supplierInfos", $scope.proDetail.supplierInfos)
                }else{
                    var idsDataOld = $scope.idsData.concat(data.idsData)
                    var idsDataNew = func4(idsDataOld)
                    $scope.idsData = idsDataNew
                    // $scope.idsData = $scope.idsData.concat(data.idsData)
                    console.log("$scope.idsData", $scope.idsData)
                }


                console.log("$scope.ids", $scope.ids)


                
                // console.log("$scope.proDetail.supplierInfos", $scope.proDetail.supplierInfos)
            }, function () {

            })
        }

        //编辑、新增
        $scope.save = function (form, pageModel) {

            form.$setSubmitted(true);
            if (!form.$valid) {
                return false;
            }
            if (!pageModel.proRecommandName) {
                window.alert("请输入产品名称")
                return false;
            }
            if (!pageModel.introduction) {
                window.alert("简介不能为空")
                return false;
            }
            if (pageModel.beforeSettled < 0 || pageModel.beforeSettled >= 1000) {
                window.alert("请输入0-1000以内的数字")
                return false;
            }
            if (pageModel.inSettled < 0 || pageModel.inSettled >= 1000) {
                window.alert("请输入0-1000以内的数字")
                return false;
            }
            if (pageModel.afterSettled < 0 || pageModel.afterSettled >= 1000) {
                window.alert("请输入0-1000以内的数字")
                return false;
            }
            // console.log("form", form)
            // console.log('pageModel', pageModel)
            // if (!$scope.ids){
            //     window.alert("请选择供应商")
            //     return false;
            // }

            if (pageModel.id) {
                var ulList = $(".datelist li input")
                var dateArr = []
                for (var i = 0; i < ulList.length; i++) {
                    var proContent = ulList[i]
                    dateArr.push(proContent.value)
                }

                var dateList = dateArr.join()


                if (!pageModel.beforeSettled && !pageModel.inSettled && !pageModel.afterSettled && !dateList) {
                    window.alert("至少选择一种推送方式")
                    return false;
                }
                if ($scope.ids == false) {
                    window.alert("请选择供应商")
                    return false;
                }


                console.log("dateListEdit", dateList)
                var proObj = {
                    supplierInfoIds: $scope.ids
                }
                var proDateObj = {
                    inDates: dateList
                }
                Object.assign(pageModel, proDateObj, proObj)

                $.post({
                    url: "/ovu-park/backstage/productCommandation/save",
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(pageModel),
                    success: function (resp) {
                        if (resp.code == 0) {
                            window.msg("修改成功！");
                            $uibModalInstance.close();

                        } else {
                            window.alert(resp.message);
                            /* UM.getEditor('myContent').destroy(); */
                        }
                    }
                })

            }
            if (!pageModel.id) {
                var ulList = $(".datelist li input")
                var dateArr = []
                for (var i = 0; i < ulList.length; i++) {
                    var proContent = ulList[i]
                    dateArr.push(proContent.value)
                }
                var dateList = dateArr.join()
                // console.log("111",$scope.ids)
                if (!pageModel.beforeSettled && !pageModel.inSettled && !pageModel.afterSettled && !dateList) {
                    window.alert("至少选择一种推送方式")
                    return false;
                }

                if ($scope.ids == false) {
                    window.alert("请选择供应商")
                    return false;
                }

                var proObj = {
                    supplierInfoIds: $scope.ids
                }

                var proDateObj = {
                    inDates: dateList
                }
                var parkIdObj = {
                    // parkId: $rootScope.park.parkId
                    parkId:$scope.dept.parkId
                }
                // Object.assign(pageModel, proDateObj, parkIdObj)
                Object.assign(pageModel, proDateObj, parkIdObj, proObj)
                // console.log("pageModel",pageModel)
                $.post({
                    url: "/ovu-park/backstage/productCommandation/save",
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(pageModel),
                    success: function (resp) {
                        if (resp.code == 0) {
                            window.msg("新增成功！");
                            setTimeout(function () {
                                $uibModalInstance.close();
                                // $window.location.reload()
                            }, 1000)
                        } else {
                            window.alert(resp.message);
                            /* UM.getEditor('myContent').destroy(); */
                        }
                    }
                })
            }

            // $uibModalInstance.close();
        }
        $scope.cancel = function () {
            console.log("cancel")
            $uibModalInstance.dismiss('cancel');
        }

        //删除日期
        $scope.delDate = function () {
            $scope.delList = $(".datelist li a")
            for (var i = 0; i < $scope.delList.length; i++) {
                $scope.delList[i].onclick = function () {
                    $(this).parent().remove();
                }

            }
            // var indexDate = $scope.delList.indexOf(item)
            // $scope.delList.splice(indexDate,1)
        }
        $scope.delDate()

        //添加日期
        $scope.addDate = function () {
            var li = $(`<li style="height: 30px;overflow: hidden;line-height: 30px;margin: 10px 10px 10px 0;">
            <input type="datetime" class="form-control Wdate" ng-model="" onchange=""
            onclick="javascript:WdatePicker({dateFmt:'MM-dd'})"
            style="width: 150px;float: left;">
          <a href="javascript:;"
       style="float: left;height: 20px;line-height: 20px;margin-top: 5px;margin-left: 10px;font-size: 12px;"
       ng-click="delDate()" class="btn btn-xs delDate"><span
      class="fa fa-trash"></span>删除</a>
             </li>`)
            $(".datelist").append(li);
            $scope.delList = $(".datelist li a")
            $scope.delDate()
            // console.log(" $scope.delList", $scope.delList)
        }


    })

    // 选择供应商弹出控制器
    app.controller("chooseProviderCtrl", function ($scope, $window, $uibModalInstance, $http, items, fac) {
        $scope.pageModel = {}
        $scope.ids = []
        $scope.idsData = []
        $scope.search = {
            companyName: '',
            typeId: '',
            parkId:$scope.dept.parkId
        }
        $scope.find = function (pageNo, callback) {
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            fac.getPageResult("/ovu-park/backstage/supplier/supplierInfo/selectByPage", $scope.search, function (data) {
                $scope.pageModel = data;
                console.log("$scope.pageModel", $scope.pageModel)
            })
        }
        $scope.find()


        $scope.send = function (ids) {
            $scope.ids = $scope.ids.concat(ids)
        };

        $scope.save = function (pageModal) {
            var ids = [];
            var idsData = []
            var datas = pageModal.data;
            for (var i = 0; i < datas.length; i++) {
                // if (datas[i].checked && datas[i].sendStatus != 1) { //过滤掉已发送的通知
                if (datas[i].checked) {
                    // ids += datas[i].id;
                    ids.push(datas[i].id);
                    idsData.push(datas[i])

                }
            }
            if (ids == "") {
                window.alert("没有添加的供应商!");
                return false;
            }
            $scope.send(ids);
            $scope.idsData = $scope.idsData.concat(idsData)
            $uibModalInstance.close({
                ids: $scope.ids,
                idsData: $scope.idsData
            });
            // $window.location.reload()
        }
        $scope.cancel = function () {
            console.log("cancel")
            $uibModalInstance.dismiss('cancel');
        }
    })
})()
