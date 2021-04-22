(function () {
    "use strict";
    var app = angular.module("angularApp");

    app.service('contentService', ['$http', '$q', 'fac', function ($http, $q, fac) {
        var getGuideContentUrl = '/ovu-pcos/join/gang/list',
            passGuideUrl = '/ovu-pcos/join/gang/isPass',
            editGuideUrl = '/ovu-pcos/join/gang/getDetails', //参数joinId
            contentGuideUrl = '/ovu-pcos/newowner/relative/queryList';

        //批量通过审批接口
        this.passGuide = function (data) {
            return $http.post(passGuideUrl, data, fac.postConfig);
        };
        //保存
        this.editContentGuide = function (data) {
            return $http.post(editGuideUrl, data, fac.postConfig);
        };
        //业主亲属信息接口
        this.contentGuide = function (data) {
            return $http.post(contentGuideUrl, data, fac.postConfig);
        }
        //主页面分页
        this.getContentGuide = function (info) {
            return $q(function (resolve, reject) {
                fac.getPageResult(getGuideContentUrl, info, function (pageModel) {
                    resolve(pageModel);
                })
            })
        };
    }])
})();