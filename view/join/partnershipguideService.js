(function(){
    "use strict";
    var app = angular.module("angularApp");
    app.service('guideService', ['$http', '$q', 'fac', function ($http, $q, fac) {
        var getGuideUrl = '/ovu-pcos/join/guide/getJoinGuide',
            editGuideUrl = '/ovu-pcos/join/guide/edit';

        this.getGuide = function (deptId) {
            return $http.post(getGuideUrl, { deptId: deptId }, fac.postConfig);
        };
        this.editGuide = function (data) {
            return $http.post(editGuideUrl,  data, fac.postConfig);
            // return $q(function (resolve, reject) {
            //     sessionStorage.setItem(data.parkId, JSON.stringify({ title: data.title, content: data.content }));
            //     resolve({ success: true });
            // });
        }
    }]);
})() 

