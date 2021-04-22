// 访客管理

(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.controller('visitorCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "访客管理";
        $scope.pageModel = {};
        $scope.search={};
        app.modulePromiss.then(function(){
            $rootScope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    var parkDept=fac.getParkDept(null,deptId);
                    if(parkDept){
                        $scope.search.parkId=parkDept.parkId;
                        $scope.search.parkName=parkDept.parkName;
                    }
                    $scope.find(1);
                }
            })
        });

        //列表查询
        $scope.find = function (pageNo) {
            //项目判断
            if(!fac.hasSpecialPark($scope.search)){
                $scope.pageModel = {};
                return;
            }
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10});
            fac.getPageResult("/ovu-pcos/face/list.do", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };

        $scope.findParkCallback=function () {
            $scope.find(1);
        }

        $scope.disableAdd=function(search){
            if(fac.hasSpecialPark(search)){
                return false;
            }
            return true;
        }

        //批量删除访客
        $scope.delAll = function () {
            var ids = $scope.pageModel.list.reduce(function (ret, n) { n.checked && ret.push(n.id); return ret }, []);
            if(ids.length==0){
                alert('请选择删除的访客！');
                return;
            }
            del(ids.join());
        };
        //删除访客
        $scope.del = function (item) {
            del(item.id);

        }
        function del(ids) {
            confirm("确认删除选中的访客?", function () {
                $http.post("/ovu-pcos/face/delete", {id: ids }, fac.postConfig).success(function (resp) {
                    if (resp.code ==0) {
                        $scope.find();
                        msg('删除成功');
                    } else {
                        alert(resp.msg);
                    }
                })
            });
        }

        //新增、编辑
        $scope.showEditModal = function (sub) {
            //项目判断
            if(!fac.hasOnlyPark($scope.search) || !fac.hasSpecialPark($scope.search)){
                return;
            }

            var copy = angular.extend({}, sub);
            if(!copy.id){
                var modal = $uibModal.open({
                    animation: false,
                    size: '',
                    templateUrl: 'validatePhone.html',
                    controller: 'validatePhoneCtrl'
                });
                modal.result.then(function (data) {
                    copy=data;
                    openModal();
                }, function () {
                    console.info('Modal dismissed at: ' + new Date());
                });
            }else{
                copy.isEdit=true;
                openModal();
            }


            function openModal() {
                var modal = $uibModal.open({
                    animation: false,
                    size: 'lg',
                    templateUrl: './face/modal.visitor.html',
                    controller: 'editVisitorCtrl'
                    , resolve: { sub: copy }
                });
                modal.result.then(function () {
                    $scope.find();
                }, function () {
                    console.info('Modal dismissed at: ' + new Date());
                });
            }
        }

        $scope.showLog=function(item){
            var copy = angular.extend({}, item);
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: './face/modal.showLog.html',
                controller: 'showLogCtrl'
                , resolve: { sub: copy }
            });
        }

    });
    app.controller('editVisitorCtrl', function ($scope, $http, fac, $uibModal,$uibModalInstance, sub) {
        $scope.item = sub || {};
        $scope.item.photos=$scope.item.photos || [];
        $scope.subjectTypes=[[1,'普通访客'],[2,'VIP访客']];

        if(!sub.id){
            $scope.item.startTime=moment().format('YYYY-MM-DD HH:mm'),
            $scope.item.endTime=moment().add('hours',2).format('YYYY-MM-DD HH:mm')
        }
        if (sub.id && sub.isEdit){
            $http.post("/ovu-pcos/face/get", {id: sub.id }, fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    $scope.item=resp.data;
                } else {
                    alert('获取详情失败！');
                }
            })
        }

        $scope.setAvatar = function (item,field) {
            fac.upload({url: "/ovu-pcos/face/uploadAvatar.do"}, function (resp) {
                if (resp.code==0) {
                    item[field] = resp.data.url;
                    $scope.$apply();
                } else {
                    alert(resp.msg);
                }
            })
        }
        $scope.setPhotos = function (picList, limit) {
            if (limit && picList.length >= limit) {
                alert('上传图片限制为' + limit + '张!');
                return;
            }
            fac.upload({ url: "/ovu-pcos/face/uploadPhoto.do"}, function (resp) {
                if (resp.code==0) {
                    var data=resp.data;
                    picList.push({id:data.id,url:data.url});

                    $scope.$apply();
                } else {
                    alert(resp.msg);
                }
            })
        }

        $scope.save = function (form,item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }
            if(item.photos.length==0){
                alert('请上传识别照片！');
                return;
            }
            if(!fac.isPhoneNumber(item.phone)){
                alert('请输入正确的手机号码！');
                return;
            }

            item.photo_ids=[];
            item.photos && item.photos.forEach(function (detail) {
                item.photo_ids.push(detail.id);
            });
            $http.post("/ovu-pcos/face/save", item).success(function (resp) {
                if (resp.code == 0) {
                    msg('保存成功！');
                    $uibModalInstance.close();
                } else {
                    alert(resp.msg);
                }
            })
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    app.controller('validatePhoneCtrl', function ($scope, $http, fac, $uibModalInstance) {
        $scope.item = {};

        $scope.save = function (form,item) {
            form.$setSubmitted(true);
            if (!form.$valid) {
                return;
            }

            if(!fac.isPhoneNumber(item.phone)){
                alert('请输入正确的手机号码！');
                return;
            }

            $http.post("/ovu-pcos/face/validate", {name:item.name,phone:item.phone},fac.postConfig).success(function (resp) {
                if (resp.code == 0) {
                    if(resp.data){
                        $scope.item=resp.data;
                    }else{
                        msg('该访客还未登记！');
                    }
                    $uibModalInstance.close($scope.item);
                } else {
                    alert(resp.msg);
                }
            })
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    app.controller('showLogCtrl', function ($scope, $http, fac, $uibModalInstance, sub) {
        $scope.item = sub || {};

        $scope.subjectTypes=[[1,'普通访客'],[2,'VIP访客']];
        $scope.pageModel = {};
        $scope.search={subject_id:sub.id};

        //列表查询
        $scope.find = function (pageNo) {
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10});
            fac.getPageResult("/ovu-pcos/face/visitorHistory", $scope.search, function (data) {
                $scope.pageModel = data;
            });
        };
        $scope.find(1);

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });

})();
