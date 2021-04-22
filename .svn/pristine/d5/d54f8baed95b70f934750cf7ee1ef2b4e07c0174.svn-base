(function () {
    "use strict";
    var app = angular.module("angularApp");

    app.service('houseService', ['$http', '$q', 'fac', function ($http, $q, fac) {
        var getGuideUrl = '/ovu-pcos/join/checkroom/list',
            getDetailsGuideUrl = '/ovu-pcos/join/checkroomresult/getDetails',
            editGuideUrl = '/ovu-pcos/join/checkroomresult/edit';

        this.getHouseGuide = function (data) {
            return $q(function (resolve, reject) {
                fac.getPageResult(getGuideUrl, data, function (pageModel) {
                    resolve(pageModel);
                })
            })
            // return $http.post(getGuideUrl, data, fac.postConfig);
        };
        this.getDetailGuide = function (data) {
            return $http.post(getDetailsGuideUrl, data, fac.postConfig);
        };
        this.editHouseGuide = function (data) {
            return $http.post(editGuideUrl, data, fac.postConfig);
        }
    }]);
})();