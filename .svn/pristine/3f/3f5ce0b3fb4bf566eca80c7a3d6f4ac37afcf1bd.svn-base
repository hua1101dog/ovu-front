(function(angular, win) {
    var app = angular.module('angularApp');
    app.component('decoration.ConfirmModal', {
        templateUrl: '/view/decoration/common/confirmModal/view.html',
        bindings: {
            close: '&',
            dismiss: '&',
            resolve: '<'
        },
        controller: function() {
            var $ctrl = this;
            $ctrl.$onInit = function() {
                // 深拷贝 防止模态框变化引起table同步变化
                $ctrl.item = angular.copy($ctrl.resolve.item);
                $ctrl.msg = $ctrl.resolve.msg;
            };
            $ctrl.ok = function(form) {
                $ctrl.close({
                    $value: ''
                });
            };
            $ctrl.cancel = function() {
                $ctrl.dismiss({
                    $value: $ctrl.item
                });
            };
        }
    });
})(angular, window);