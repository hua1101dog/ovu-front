/**
 * Created by wangheng on 2017/9/19.
 * 通知
 */
(function() {
    "use strict";
    var app = angular.module("app");

    //数据控制器
    app.controller('UserDetailCtrl', UserDetailCtrl);
    function UserDetailCtrl($scope, $http,$stateParams, fac) {
        var vm = this;
        vm.search={};

        if($stateParams.userData){
            vm.user = $stateParams.userData;
        }

        vm.find = function(){
            $http.get("/ovu-base/pcos/person/getPersonInfoByName.do",{params:vm.search}).success(function(data) {
                if(fac.isNotEmpty(data)){
                    vm.user = data;
                }else{
                    alert('请输入正确的查询条件!');
                }
            }).error(function () {
                alert("请输入正确的查询条件!");
            })
        };


    }

})();
