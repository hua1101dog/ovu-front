(function(angular, win) {
    var app = angular.module('angularApp');
    app.component('decorationPagination', {
        templateUrl: '/view/decoration/common/pagination/view.html',
        bindings: {
            simple: '@', // 简化分页
            totalCount: '<',
            currentPage: '<',
            numPerPage: '<',
            onSelectChange: '&',
            onPageChanged: '&'
        },
        controller: ['decoration.pageService', function(pageService) {
            var vm = this;

            vm.$onInit = function() {
                // 最多显示1 2 3 4 5 5个页面按钮
                vm.maxSize = 3;
                // 到（）页  [1,2,3....]
                vm.selectablePages = pageService.getSelectablePages(vm.totalCount, vm.numPerPage);
                // 当前显示(0|第11|1-10)条
                vm.currentDisplay = pageService.getCurrentDisplay(vm.totalCount, vm.numPerPage, vm.currentPage);
                // console.log('init.....................');
                // console.log(vm.currentPage);
            };
            vm.$onChanges = function(changes) {
                // 更新 selectablePages
                vm.selectablePages = pageService.getSelectablePages(vm.totalCount, vm.numPerPage);
                // 更新 currentDisplay
                vm.currentDisplay = pageService.getCurrentDisplay(vm.totalCount, vm.numPerPage, vm.currentPage);
            };
            // 每页 条 变化时  改变numPerPage
            vm.selectChange = function() {
                // 更新每页条数 后 currentPage 设置1
                vm.currentPage = 1;
                // 更新 selectablePages
                vm.selectablePages = pageService.getSelectablePages(vm.totalCount, vm.numPerPage);
                // 更新 currentDisplay
                vm.currentDisplay = pageService.getCurrentDisplay(vm.totalCount, vm.numPerPage, vm.currentPage);
                vm.onSelectChange({
                    $event: {
                        nowSelected: vm.numPerPage
                    }
                });
            };

            //当前页码变化时  改变 currentPage
            vm.pageChanged = function() {
                // 更新 currentDisplay
                // 页码改变 当totalCount == 0  时  currentPage = null
                if (!vm.currentPage) {
                    return;
                }
                vm.currentDisplay = pageService.getCurrentDisplay(vm.totalCount, vm.numPerPage, vm.currentPage);
                vm.onPageChanged({
                    $event: {
                        currentPage: vm.currentPage
                    }
                })
            };

        }],
        controllerAs: 'vm'
    });
    app.service('decoration.pageService', function() {
        // 根据总的数据条数totalCount=11  每页数据条数numPerPage=5  得到pageList = [1,2,3]
        this.getSelectablePages = function(totalCount, numPerPage) {
            var pageList = [];
            var pageCount = Math.ceil(totalCount / numPerPage);
            for (var i = 0; i < pageCount; i++) {
                pageList.push(i + 1);
            }
            return pageList;
        };
        // 根据 数据总条数 每页多少条 当前页码 计算 《共(?)条 当前显示(0|第11|1-10)条》
        this.getCurrentDisplay = function(totalCount, numPerPage, currentPage) {
            // 当前显示的开始项目 编号
            var from = (currentPage - 1) * numPerPage + 1;
            // 当前显示的结束项目 编号
            var to = currentPage * numPerPage > totalCount ? totalCount : currentPage * numPerPage;

            // 显示内容
            var currentDisplay = '';
            if (parseInt(to) === 0) {
                currentDisplay = '0';
            } else if (parseInt(from) === parseInt(to)) {
                currentDisplay = '第' + from;
            } else {
                currentDisplay = from + '-' + to;
            }
            return currentDisplay;
        };
    });

})(angular, window);