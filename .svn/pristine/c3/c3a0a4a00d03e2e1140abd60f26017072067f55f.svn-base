(function () {
    var app = angular.module("angularApp");
    app.controller('moocManageCtrl', function ($scope, $rootScope, $state, $q, $http, $filter, $uibModal, fac) {
        document.title = "OVU-慕课信息";
        $scope.search = {
            parkId:'',
            parkUserId:'',
        };
        $scope.deptList=[]
        $rootScope.houseIdTypes = {};
        $scope.pageModel = {};
        //域名解析
        $scope.urlSlice = function (paraName) {
            var url = window.location.toString();
            var arrObj = url.split("?");
            if (arrObj.length > 2) {
                var arr = arrObj[2].split('=')
                if (arr != null && arr[0] == paraName) {
                    return arr[1];
                } else {
                    return "";
                }
            } else {
                return false
            }
        }
        $scope.isGlobal=$scope.urlSlice('global')
        $scope.find = function (pageNo) {
            if($scope.isGlobal){
                $scope.search.parkId&&delete $scope.search.parkId
            }else{
                if (!$scope.search.parkId) {
                    alert("请选择项目关联的部门")
                    $scope.pageModel = {};
                    return
                }
            }
            $.extend($scope.search, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            $scope.search.parkUserId=$scope.search.user?$scope.search.user.parkUserId:''
            $scope.search.companyId=$scope.search.company?$scope.search.company.id:''
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            fac.getPageResult("/ovu-mooc/backstage/mooc/watchrecord/recordByPage", $scope.search, function (resp) {
                $scope.pageModel = resp;
            });
        };
        //查看员工信息
        $scope.showStaffInfo = function (item) {
            var copy = angular.extend({}, item);
            copy.startDate=$scope.search.startDate
            copy.endDate=$scope.search.endDate
            var modal = $uibModal.open({
                animation: false,
                size: 'lg',
                templateUrl: '/view/operationManage/moocManage/modal.staffStudyDetail.html',
                controller: 'staffDetailCtrl',
                resolve: {
                    staffDetail: copy
                }
            });
            modal.result.then(function () {
                $scope.find();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };
          /**
         * 批量导出
         * @param item
         */
        $scope.exportMooc = function () {
            var elemIF = document.createElement("iframe");
            let str=[]
            for(var p in $scope.search){
                if(p=='companyId'||p=='deptId'||p=='parkUserId'||p=='parkId'||p=='startDate'||p=='endDate'){
                    if($scope.search[p]){
                        str.push(encodeURIComponent(p) +"="+encodeURIComponent($scope.search[p]));
                    }
                }
            }
            elemIF.src = "/ovu-mooc/backstage/mooc/watchrecord/export?" + str.join("&");
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
        }
        //  //公司模糊搜索
         $scope.searchCompany = function (val) {
            var param = {
                searchName:val,
                limit:10,
                parkId: $scope.search.parkId,
            };
            return $http.post("/ovu-mooc/backstage/mooc/watchrecord/companies", param, fac.postConfig).then(function (resp) {
                if(resp.data.data&&resp.data.data.length>0&&$scope.search.company){
                    if(resp.data.data[0].id==$scope.search.company.id){
                        return []
                    }
                }
                return resp.data.data;
            })
        }
        //公司搜索输入框变化
        $scope.changeExecVal= function () {
            if(!$scope.search.company){
                $scope.search.user&&delete $scope.search.user
                $scope.search.id&&delete $scope.search.id
                $scope.search.text&&delete $scope.search.text
                $scope.search.deptId&&delete $scope.search.deptId
                $scope.deptList=[]
            }
        }

        //部门列表
        $scope.searchDept= function () {
            $.get("/ovu-mooc/backstage/mooc/watchrecord/depts?companyId=" +$scope.search.company.id).success(function (resp) {
                if (resp.code == 0) {
                    $scope.deptList= resp.data
                } else {
                    $scope.deptList=[]
                }
            });
        }
        $scope.clickDept= function () {
            if(!$scope.search.company){
                alert("请先选择一个企业！")
            }
        }
        //选择部门树
        $scope.setDept = function(search,node){
            if(node&&node.id){
                $scope.search.deptId=node.id
                $scope.searchPerson();
            }else{
                $scope.search.user&&delete $scope.search.user
                $scope.search.deptId&&delete $scope.search.deptId
            }
         }
         //人员模糊搜索
         $scope.searchPerson = function (val) {
            var param = {
                searchName:val,
                limit:10,
                deptId: $scope.search.deptId,
                parkId: $scope.search.parkId,
            };
            return $http.post("/ovu-mooc/backstage/mooc/watchrecord/staffs", param, fac.postConfig).then(function (resp) {
                let personList=resp.data.data
                if(personList&&personList.length>0&&$scope.search.user){
                    if(personList[0].parkUserId==$scope.search.user.parkUserId){
                        return []
                    }
                }
                personList&&personList.forEach(v=>{
                    if(v.jobCode){
                        v.fullName=v.name+'('+v.jobCode+')'
                    }else{
                        v.fullName=v.name
                    }
                })
                return personList;
            })
        }
          // 页面初始化
          app.modulePromiss.then(function () {
            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId
                        $scope.find();
                    } else {
                        $scope.search.parkId && delete $scope.search.parkId
                        $scope.find();
                        return
                    }
                }else{
                    $scope.find();
                }
            })
        })

    });
    //查看员工
    app.controller('staffDetailCtrl', function ($scope, $rootScope, $http, $uibModalInstance, $uibModal, fac, staffDetail) {
        $scope.item = staffDetail;
        $scope.pageModel = {};
        var param = {
            "parkUserId":$scope.item.parkUserId,
            "startDate":$scope.item.startDate,
            "endDate": $scope.item.endDate
        };

        //查询
        $scope.find = function (pageNo) {
            $.extend(param, {
                currentPage: pageNo || $scope.pageModel.currentPage || 1,
                pageSize: $scope.pageModel.pageSize || 10
            });
            param.pageIndex = param.currentPage - 1;
            param.totalCount = $scope.pageModel.totalCount || 0;
            fac.getPageResult("/ovu-mooc/backstage/mooc/watchrecord/detail", param, function (data) {
                $scope.pageModel = data;
                $scope.pageModel.data&&$scope.pageModel.data.forEach(v=>{
                    let moocName=v.moocName
                    let timeLengthStr=v.timeLengthStr
                    angular.extend(v, $scope.item);
                    v.moocName=moocName
                    v.timeLengthStr=timeLengthStr
                })
                console.log($scope.pageModel)
            });
        };
        $scope.find(1);
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
    app.directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    });
})();
