/**
 * 400投诉统计表.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('complaintListCtrl', function ($scope, $rootScope, $uibModal, $location, $http, $filter, fac) {
        $scope.search = {};
        document.title = "400投诉统计表";
        $scope.pageModel = {};
        app.modulePromiss.then(function () {
            $scope.find(1);

        })


        //分页
        $scope.find = function (pageNo) {
            if ($scope.parks.length !== 0) {
                var ids = $scope.parks.reduce(function (ret, n) {
                    ret.push(n.id);
                    return ret
                }, []);
                $scope.search.parkId = ids.join(",");
            }
            var ids = $scope.parks.reduce(function (ret, n) {
                ret.push(n.id);
                return ret
            }, []);
            $scope.search.parkId = ids.join(",");
            angular.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10,

            })
            $scope.search.startTime && ($scope.search.startTime=$scope.search.startTime+" 00:00:00");
            $scope.search.endTime && ($scope.search.endTime = $scope.search.endTime+" 23:59:59");
            fac.getPageResult('/ovu-pcos/pcos/reportstat/other/statComplainWorkUnit.do', $scope.search, function (data) {
                $scope.pageModel = data
            });

        }
        $scope.parks = [];
       $scope.parksList=[];
      $scope.choosePark = function () {
        if(!$scope.parks==[]){
            $scope.parks=[];    
         }
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/common/modal.select.parks.html',
                controller: 'parksSelectorCtrl'
                , resolve: { data: function () { return {}; } }
            });
            modal.result.then(function (data) {
                if ($scope.parks && $scope.parks.length > 0) {
                    data.forEach(function (part) {
                        $scope.parks.forEach(function (item) {
                            if (part.id == item.id) {
                                part.isExist = true;
                            }
                        });
                    });
                }
                data.forEach(function (part) {
                    if (!part.isExist) {
                        $scope.parks.push({ id: part.id, parkName: part.parkName });
                      
                    }
                });
             if($scope.parks.length>3){
                $scope.parkList= $scope.parks.slice(0,3);
             }else{
                $scope.parkList=$scope.parks;
             }
            });
        };
        $scope.show=""
        $scope.getmore=function(){
            $scope.parkList=$scope.parks;
            $scope.show=true;
        }
        $scope.getless=function(){
            $scope.parkList=$scope.parks.slice(0,3);
             $scope.show=false;
        }
        $scope.delpark = function (parks, p) {
            if($scope.parkList.length<=3){
               parks.splice(parks.indexOf(p), 1); 
               $scope.parkList= parks.slice(0,3);
               $scope.show=""
            }else{
                parks.splice(parks.indexOf(p), 1);
            }
        };        
        /**
      * 批量导出
      * @param item
      */
        $scope.export = function () {
            var elemIF = document.createElement("iframe");
            var param = encodeURIComponent(encodeURIComponent(JSON.stringify($scope.search)));
            elemIF.src = "/ovu-pcos/pcos/reportstat/export/complainworkunit.do?json=" + param;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
        }

        // 评价
        $scope.evaluateModal = function (workunit) {
            var evaluate = {
                WORKUNIT_ID: workunit.id,
                WORKUNIT_NAME: workunit.workUnitName,
                EXEC_DATE: workunit.createTime,
                // PERSON_ID: $scope.search.userId
            }

            /*
             目前只能管理人评价了。
             if($scope.search.userId == workunit.SOURCE_PERSON) {
             //发起人评论
             evaluate.EVALUATE_TYPE = "1";
             }*/
            if ($rootScope.user.personId == workunit.managePersonId) {
                //管理人评论
                evaluate.EVALUATE_TYPE = "2";
            } else {
                alert("评论类型无法判断,有错误!");
                return;
            }
            var modal = $uibModal.open({
                animation: false,
                size: "",
                templateUrl: '/view/stat/modal.workunitEvaluate.html',
                controller: 'workunitEvaluateModalCtrl',
                resolve: { evaluate: function () { return evaluate } }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        }
    });
    app.controller('workunitEvaluateModalCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $filter, fac, evaluate) {
        $scope.item = evaluate;
        evaluate.photos = evaluate.PICTURE ? (evaluate.PICTURE.split(",")) : [];

        evaluate.temp_score = evaluate.EVALUATE_SCORE;
        $scope.hoveringOver = function (value) {
            evaluate.temp_score = value;
        }
        $scope.save = function (form, item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            if (!evaluate.EVALUATE_SCORE) {
                alert("请评分！");
                return;
            }
            item.PICTURE = item.photos.join(",");
            $http.post("/ovu-pcos/pcos/workunit/workunitevaluate/save.do", item, fac.postConfig).success(function (resp, status, headers, config) {
                if (resp.success) {
                    $uibModalInstance.close();
                } else {
                    alert(resp.error);
                }
            })
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        //添加工单详情
        var workunit = $scope.detail = { ID: evaluate.WORKUNIT_ID };

        function getWorkunitTask(WORKUNIT_ID) {
            $http.get("/ovu-pcos/pcos/workunit/getWorkunitTask.do?WORKUNIT_ID=" + WORKUNIT_ID).success(function (resp) {
                if (resp.success) {
                    $scope.task = resp.data;
                    var stepOperList = [];
                    if ($scope.task.DESCRIPTION_ID) {
                        stepOperList = JSON.parse($scope.task.DESCRIPTION);
                    }
                    $scope.task.stepChild.forEach(function (n) {
                        if (n.OPERATION_TYPE == 3) {
                            //选择
                            n.options = n.OPTIONS_LIST.split(/[,，]/);
                        }
                        n.oper = stepOperList.find(function (m) { return m.id == n.WORKSTEP_ID }) || { id: n.WORKSTEP_ID };
                    });
                } else {
                    alert(resp.error);
                }
            })
        }
        var workUnitPromise = $http.get("/ovu-pcos/pcos/workunit/getWorkunit.do?id=" + workunit.ID).then(function (resp) {
            var ret = resp.data;
            if (ret.success) {
                angular.extend(workunit, ret.data);
                workunit.evaluates && workunit.evaluates.forEach(function (n) {
                    n.photos = n.PICTURE ? (n.PICTURE.split(",")) : [];
                })
                //应急工单
                if (workunit.WORKUNIT_TYPE == 1) {
                    getWorkunitTask(workunit.ID);
                } else {
                    workunit.pictures = workunit.PICTURE ? workunit.PICTURE.split(",") : [];
                    workunit.photos = workunit.PHOTO ? workunit.PHOTO.split(",") : [];
                }
            } else {
                alert(ret.error);
            }
        });
    });
})();