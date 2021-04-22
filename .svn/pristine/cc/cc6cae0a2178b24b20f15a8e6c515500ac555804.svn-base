/**
 * Created by wangheng on 2017/9/19.
 * 系统管理控制器
 */
(function() {
    "use strict";
    var app = angular.module("app");

    //预警事件控制器
    app.controller('SystemCtrl', SystemCtrl);
    function SystemCtrl($scope, $http) {
        document.title = "系统管理";
        var vm = this;

        //查询邮件设置
        $http.get('/ovu-pcos/pcos/system/sysconfig/getEmail').success(function (data) {
            vm.item = data || {};
        })

        //保存
        vm.save = function (form,item) {
            $http.post('/ovu-pcos/pcos/system/sysconfig/updateEmail',
                item,
                {headers: {"Content-Type": "form"}}
                ).success(function (data) {
                if(data.success){
                    msg('操作成功');
                }else {
                    alert();
                }
            })
        }

        //测试邮件
        vm.test = function (form,item) {
            $http.post('/ovu-pcos/pcos/system/sysconfig/checkoutMail',
                item,
                {headers: {"Content-Type": "form"}}
            ).success(function (data) {
                if(data.success){
                    vm.isTest = true;
                    msg('测试成功');
                }else {
                    alert();
                }
            })
        }

    }

})();