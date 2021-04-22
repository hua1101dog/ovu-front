/*
     -1:草稿
     0:待提交,              编辑  提交  合同预览
     1:待审批,              审批        合同预览
     2:审批通过,执行中 ,      终止       合同预览
     3:已驳回,              编辑  提交  合同预览
     4:合同终止,            合同预览
     5:合同结束                                 合同预览
*/

(function() {
    var app = angular.module("angularApp");
    app.controller('rentAgreementCtrl', function ($scope, $rootScope, $http, $filter, $uibModal , $location, fac) {	
        var index = $rootScope.pages.length;
        var curPage = $rootScope.pages[index-1];	
    	document.title = "OVU-租赁合同";
    	$scope.contractStatus = [
            {name:"草稿",id:"-1"},
            {name:"待提交",id:"0"},
            {name:"待审批",id:"1"},
            {name:"执行中",id:"2"},
            {name:"已驳回",id:"3"},
            {name:"已终止",id:"4"},
            {name:"已结束",id:"5"}
        ]
        $scope.search = {};
        $scope.pageModel = {};
        $scope.find = function (pageNo) {
            $.extend($scope.search, { currentPage: pageNo || $scope.pageModel.currentPage || 1, pageSize: $scope.pageModel.pageSize || 10 });
            $scope.search.pageIndex = $scope.search.currentPage - 1;
            $scope.search.totalCount = $scope.pageModel.totalCount || 0;
            fac.getPageResult("/ovu-park/backstage/rental/contract/list", $scope.search, function (data) {
                console.log(data);
                $scope.pageModel = data;
            });
        };
         // 新增、合同
         $scope.addAgreement = function(){
            // $location.url('/rental/rentAgreement/addAgreement');
            $rootScope.target("/rental/rentAgreement/addAgreement", "新增租赁合同", false, '');
        }
        // 编辑合同
        $scope.editContract = function(id){
            // $location.url('/rental/rentAgreement/addAgreement');
            // $location.search({"id":id});
            $rootScope.target("/rental/rentAgreement/addAgreement", "编辑租赁合同", false, '', {"id":id});
        }
        // 合同审批
        $scope.examAgreement = function(id,status){
            // $location.url('/rental/rentAgreement/examAgreement');
            // $location.search({'id':id,"status":status});
            $rootScope.target("/rental/rentAgreement/examAgreement", "审批合同", false, '', {'id':id,"status":status});
        }
        // 合同预览
        $scope.lookAgreement = function(id){
            // $location.url('/rental/rentAgreement/lookAgreement');
            // $location.search({'id':id});
            $rootScope.target("/rental/rentAgreement/lookAgreement", "预览合同", false, '', {"id":id});
        }
        // 终止合同
        $scope.endAgreement = function(id){
            // $location.url('/rental/rentAgreement/endAgreement')
            // $location.search({'id':id});
            $rootScope.target("/rental/rentAgreement/endAgreement", "终止合同", false, '', {"id":id});
        }
        // 提交合同
        $scope.submitContract = function(id){
            confirm("确认提交该合同审批", function () {
                $.post("/ovu-park/backstage/rental/contract/submit", {id:id}, function (resp) {
                    if(resp.code==0){
                        window.msg("成功提交该合同");
                        $scope.find();
                    }else{
                        window.alert(resp.message);
                    }
                });
            })
        }
        // 删除合同
        $scope.delAgreement = function(id){
            confirm("确认删除该合同", function () {
                $.post("/ovu-park/backstage/rental/contract/remove", {'id':id}, function (resp) {
                    if(resp.code==0){
                        window.msg("成功删除合同");
                        $scope.find();
                    }else{
                        window.alert(resp.message);
                    }
                });
            })
        }
        app.modulePromiss.then(function () {
            fac.initPage($scope, function () {
                $scope.find();
            })
        });
    });
    // 状态
    app.filter("contractStatus", function () {
        return function (status) {
            switch (status) {
                case '-1':
	                return '草稿';
	                break;
                case '0':
                    return '待提交';
                    break;
                case '1':
                    return '待审批';
                    break;
                case '2':
                    return '执行中';
                    break;
                case '3':
                    return '已驳回';
                    break;
                case '4':
                    return '已终止';
                    break;
                case '5':
                    return '已结束';
                    break;
            }
        }
    })

    // 支付方式
    app.filter("payType", function () {
        return function (status) {
            switch (status) {
                case '1':
                    return '月付';
                    break;
                case '2':
                    return '季付';
                    break;
                case '3':
                    return '年付';
                    break;
            }
        }
    })
    
    // 租金模式
    app.filter("rentalModal", function () {
        return function (status) {
            switch (status) {
                case '1':
                    return '固定租金';
                    break;
                case '2':
                    return '固定抽成';
                    break;
                case '3':
                    return '比例抽成';
                    break;
            }
        }
    })
    
    // 合同来源
    app.filter("contractSource", function () {
        return function (status) {
            switch (status) {
                case 1:
                    return '标准租赁';
                    break;
                case 2:
                    return '租房申请';
                    break;
            }
        }
    })
    
    // 创建时间-格式化
    app.filter("formateDate", function () {
        return function (createTime) {
            var date = new Date(createTime);
            return date;
        }
    })
    
})()
