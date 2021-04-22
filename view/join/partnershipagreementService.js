(function () {
    "use strict";
    var app = angular.module("angularApp");

    app.service('agreementService', ['$http', '$q', 'fac', function ($http, $q, fac) {
        var getGuideUrl = '/ovu-pcos/join/agreement/list',
            editGuideUrl = '/ovu-pcos/join/agreement/edit',
            delGuideUrl = '/ovu-pcos/join/agreement/delete';

        this.getAgreementGuide = function (info) {
            return $q(function (resolve, reject) {
                fac.getPageResult(getGuideUrl, info, function (pageModel) {
                    resolve(pageModel);
                });
            });
        };
        this.editAgreementGuide = function (data) {
            return $http.post(editGuideUrl, data, fac.postConfig);
        };
        this.delAgreementGuide = function (data) {
            return $http.post(delGuideUrl, data, fac.postConfig);
        }
    }])
})();