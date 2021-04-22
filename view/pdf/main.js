/**
 *
 */
var app = angular.module('App', ['pdf']);
app.controller('DocCtrl', function ($scope, $timeout, myService) {
    var a = location.search.replace('?', '').split('=');
    if (a.indexOf('kb_id') != -1) {
        var param = a[1];
        myService.getPdf1(param).then(function (data) {
            if (data.success) {
                $scope.pdfUrl = '../../' + data.onlinePath;
            } else {
                $scope.loading = '操作失败,' + data.msg;
            }

        });
    } else if (a.indexOf('contractId') != -1) {
        var param = a[1];
        myService.getPdf2(param).then(function (data) {
            if (data.success) {
                $scope.pdfUrl = '../../' + data.onlinePath;
            } else {
                $scope.loading = '操作失败,' + data.msg;
            }
        });
    } else {
        var param = a[1];
        myService.getPdf3(param).then(function (data) {
            if (data.success) {
                $scope.pdfUrl = '../../' + data.onlinePath;
            } else {
                $scope.loading = '操作失败,' + data.msg;
            }
        });
    }

    $scope.pdfName = 'Relativity: The Special and General Theory by Albert Einstein';
    $scope.scroll = 0;
    $scope.loading = '加载中...';

    $scope.getNavStyle = function (scroll) {
        if (scroll > 100) return 'pdf-controls fixed';
        else return 'pdf-controls';
    }

    $scope.onError = function (error) {
        console.log(error);
    }

    $scope.onLoad = function () {
        $scope.loading = '';
    }

    $scope.onProgress = function (progressData) {
        console.log(progressData);
    };


});
app.service('myService', ['$http', function ($http) {
    this.getPdf1 = function (param) {
        return $http.get('/ovu-pcos/pcos/knowledge/read.do?kb_id=' + param).then(function (resp) {
            return resp.data;
        });
    }
    this.getPdf2 = function (param) {
        return $http.get('/ovu-pcos/pcos/contractManagement/read.do?contractId=' + param).then(function (resp) {
            return resp.data;
        });
    }
    this.getPdf3 = function (param) {
        return $http.get('/ovu-pcos/pcos/energy/read/read.do?importId=' + param).then(function (resp) {
            return resp.data;
        });
    }


}]);