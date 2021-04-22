/**
 * Created by Cx on 2019/4/9.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");

    app.controller(
        "summaryCtrl",
        function (
            $scope,
            $rootScope,
            $uibModal,
            $state,
            $http,
            $filter,
            fac,
            $sce,
            $compile
        ) {
            document.title = "OVU-签到统计";
         
            $scope.search = {
                arrangeDateFrom: moment()
                    .subtract(1, "months")
                    .format("YYYY-MM-DD"),
                arrangeDateTo: moment().format("YYYY-MM-DD"),
                jobStatus:'1'
            };

            $scope.pageModel = {};
            $scope.auth = {};

            app.modulePromiss.then(function () {
                $scope.$watch("dept.id", function (deptId, oldValue) {
                    if (deptId) {
                        if ($scope.dept.parkId) {
                            $scope.deptId = deptId;
                            loadDeptTree();
                        } else {
                            if (
                                $rootScope.pages.active ==
                                "/view/checkin/summary.html"
                            ) {
                                alert("请选择跟项目关联的部门");
                            }
                            $scope.deptId && delete $scope.deptId;
                        }
                    }
                });
            });

            function loadDeptTree() {
                if ($scope.deptId) {
                    $http
                        .get(
                            "/ovu-base/system/dept/tree.do?deptId=" +
                                $scope.deptId
                        )
                        .success(function (data) {
                            $scope.searchDeptTree_1 = [];
                            data[0] &&
                                data[0].nodes &&
                                data[0].nodes.forEach(function (v) {
                                    $scope.searchDeptTree_1.push(v);
                                    // v.nodes && delete v.nodes
                                });
                            if (!data || !data[0] || !data[0].nodes) {
                                $scope.searchDeptTree_1.push(data[0]);
                            }
                            // $scope.auth.id= $scope.searchDeptTree_1[0].id;
                            // $scope.auth.deptName=$scope.searchDeptTree_1[0].deptName
                            $scope.find(1);
                        });
                } else {
                    $scope.searchDeptTree_1 = [];
                }
            }
            //选择部门回调
            $scope.selectDeptCall = function (host, node) {
                if (node && node.id) {
                    $scope.search.deptId = node.id;
                } else {
                    $scope.search.deptId = $rootScope.dept.id;
                }

                $scope.find(1);
            };

           
          

            $scope.find = (pageNo) => {
                $scope.search.personName = $scope.search.user
                    ? $scope.search.user.name
                    : undefined;
                if ($scope.auth.id) {
                    $scope.search.deptId = $scope.auth.id;
                } else {
                    $scope.search.deptId = $scope.deptId;
                }
                $.extend($scope.search, {
                    currentPage: pageNo || $scope.pageModel.currentPage || 1,
                    pageSize: $scope.pageModel.pageSize || 10,
                });
                $scope.search.pageIndex =
                    $scope.search.currentPage && $scope.search.currentPage - 1;
                $http
                    .post(
                        "/ovu-pcos/pcos/arrange/plan/statisticsList",
                        $scope.search,
                        fac.postConfig
                    )
                    .success(function (data, status, headers, config) {
                        if (angular.isString(data)) {
                            //返回的是页面，直接显示登录页面
                            location.href = "/login.html";
                            return;
                        }
                        if (!isNaN(data.code)) {
                            //zg 后台返回值，code为0表示成功，-1失败
                            //if (data.code == 1) {
                            if (data.code == 0) {
                                data = data.data;
                            } else {
                                alert("获取列表异常");
                                return;
                            }
                        }
                        if (!data.list) {
                            $scope.pageModel = [];
                            return;
                        }
                        $scope.pageModel = data.list;
                        $scope.pageData = data;

                        $scope.pageModel.currentPage =
                            $scope.pageModel.pageIndex + 1;
                        $scope.pageModel.totalPage = $scope.pageModel.pageTotal;
                        $scope.search.totalCount = $scope.pageModel.totalRecord =
                            $scope.pageModel.totalCount;
                        if (
                            $scope.pageModel.data &&
                            $scope.pageModel.data.length >= 0
                        ) {
                            $scope.pageModel.list = $scope.pageModel.data;
                        }
                        var list = [
                            1,
                            $scope.pageModel.currentPage - 1,
                            $scope.pageModel.currentPage,
                            $scope.pageModel.currentPage + 1,
                            $scope.pageModel.totalPage,
                        ];
                        var pages = [];
                        var hash = {};
                        list.forEach(function (v) {
                            if (
                                !hash[v] &&
                                v <= $scope.pageModel.totalPage &&
                                v > 0
                            ) {
                                hash[v] = true;
                                pages.push(v);
                            }
                        });
                        if (pages.length > 2 && pages.indexOf(2) == -1) {
                            pages.splice(1, 0, "······");
                        }
                        if (
                            pages.length > 2 &&
                            pages.indexOf($scope.pageModel.totalPage - 1) == -1
                        ) {
                            pages.splice(pages.length - 1, 0, "······");
                        }
                        $scope.pageModel.pages = pages;

                        $scope.pageModel.data &&
                            $scope.pageModel.data.forEach(function (v) {
                                for (var i in v.plans) {
                                    if (
                                        v.plans[i].signStatus == "1" ||
                                        v.plans[i].signStatus == "8"
                                    ) {
                                        v.plans[i].color = "green";
                                        //正常
                                    } else if (v.plans[i].signStatus == "5") {
                                        v.plans[i].color = "red";
                                        //缺勤
                                    } else if (
                                        v.plans[i].signStatus == "6" ||
                                        v.plans[i].signStatus == "7"
                                    ) {
                                        v.plans[i].color = "gray";
                                        //休息
                                    } else {
                                        v.plans[i].color = "purple";
                                        //异常
                                    }
                                    if (
                                        v.plans[i].signList &&
                                        v.plans[i].signList.length
                                    ) {
                                        var template =
                                            '<div   class="showRecord">' +
                                            '<p class="record_title">' +
                                            v.plans[i].arrangeDate +
                                            " </p>";
                                        v.plans[i].signList.forEach((sign) => {
                                            var str =
                                                sign.sIGN_TYPE == 1
                                                    ? "内勤"
                                                    : "外勤";
                                            var des = "";
                                            var img = "";
                                            if (sign.dESCRIPTION) {
                                                des =
                                                    "<div>备&nbsp;&nbsp; 注： " +
                                                    sign.dESCRIPTION +
                                                    "</div>";
                                            }
                                            if (sign.pICTURE) {
                                                // des='<div>备&nbsp;&nbsp; 注： '+sign.dESCRIPTION+'</div>'
                                                img = "<div>";
                                                var arr = sign.pICTURE.split(
                                                    ","
                                                );
                                                arr.forEach((v) => {
                                                    img =
                                                        img +
                                                        ' <img src="' +
                                                        v +
                                                        '"  style="width:100px;vertical-align: top;" />';
                                                });
                                                img = img + "</div>";
                                            }
                                            template =
                                                template +
                                                ' <div style="margin-bottom:10px">' +
                                                '<div class="inline_block record_left">' +
                                                str +
                                                "签到" +
                                                "  </div>" +
                                                ' <div class="inline_block record_right">' +
                                                "  <div> 签到时间： " +
                                                sign.sIGN_TIME +
                                                "</div>" +
                                                "  <div> 签到地点： " +
                                                sign.aDDRESS +
                                                "</div>" +
                                                "   <div>设备型号： " +
                                                sign.dEVICE_MODEL +
                                                "</div>" +
                                                des +
                                                img +
                                                "  </div>" +
                                                "   </div>";
                                            if (sign.sIGN_TYPE == 2) {
                                                v.plans[i].hasField = true; //有外勤签到记录
                                            }
                                        });
                                        v.plans[
                                            i
                                        ].htmlTooltip = $sce.trustAsHtml(
                                            template
                                        );
                                    } else {
                                        v.plans[i].htmlTooltip = "";
                                    }
                                }
                            });
                    });
            };
            $scope.changeStatu=function(value){
                if(value){
                    $scope.search.jobStatus && delete $scope.search.jobStatus
                }else{
                    $scope.search.jobStatus='1'
                }
                $scope.find(1)
            }

            function offset(element) {
                var pos = { left: 0, top: 0 };

                var parents = element.offsetParent;

                pos.left += element.offsetLeft;
                pos.top += element.offsetTop;

                while (parents && !/html|body/i.test(parents.tagName)) {
                    pos.left += parents.offsetLeft;
                    pos.top += parents.offsetTop;

                    parents = parents.offsetParent;
                }
                return pos;
            }

            $scope.changeShow = function (v, value, event) {
                event.preventDefault(); //阻止事件冒泡
                $scope.planHtmlTooltip = value;

                var top =
                    document.documentElement.scrollTop ||
                    document.body.scrollTop;
                $scope.planHtmlTooltipTop =
                    offset(event.target).top - top - 200 + 24 + "px";

                $scope.planHtmlTooltipLeft =
                    offset(event.target).left -
                    $("#summaryTab").scrollLeft() -
                    300 +
                    13 +
                    "px";
                $scope.plansShow = true;
            };

            //全局变量
            var x, y;
            $(document).mousemove(function (e) {
                x = e.pageX;
                y = e.pageY;
            });
            $("#summaryTab").mousemove(function () {
                var div = $("#summaryTab tbody"); //获取你想要的DIV
                var y1 = div.offset().top; //div上面两个的点的y值
                var y2 = y1 + div.height(); //div下面两个点的y值
                var x1 = div.offset().left; //div左边两个的点的x值
                var x2 = x1 + div.width(); //div右边两个点的x的值

                if (x < x1 || x > x2 || y < y1 || y > y2) {
                    // 鼠标不在该DIV中
                    var div1 = $(".showRecord");
                    if (!div1 || !div1.offset()) {
                        $(".showRecord").css("display", "none");
                        return;
                    }

                    var y11 = div1.offset().top; //div上面两个的点的y值
                    var y21 = y11 + div1.height(); //div下面两个点的y值
                    var x11 = div1.offset().left; //div左边两个的点的x值
                    var x21 = x11 + div1.width(); //div右边两个点的x的值
                    if (x < x11 || x > x21 || y < y11 || y > y21) {
                        // 不在盒子里
                        $(".showRecord").css("display", "none");
                    } else {
                        //在盒子里

                        $(".showRecord").css("display", "block");
                    }
                } else {
                    $(".showRecord").css("display", "block");
                }
            });

            // 导出
            $scope.downloadFile = function (deptId) {
                if (
                    !$scope.search.arrangeDateFrom ||
                    !$scope.search.arrangeDateTo
                ) {
                    alert("请选择时间");
                    return;
                }
                if (
                    !$scope.pageModel.data ||
                    $scope.pageModel.data.length == 0
                ) {
                    alert("无可导出数据");
                    return;
                }
                window.location.href =
                    "/ovu-pcos/pcos/arrange/plan/export?deptId=" +
                    deptId +
                    "&dayFrom=" +
                    $scope.search.arrangeDateFrom +
                    "&dayTo=" +
                    $scope.search.arrangeDateTo;
            };
            $scope.showModal = function (item) {
                if (!$scope.hasPower("新增")) {
                    return;
                }
                if (!item) {
                    return;
                }
                if (
                    item.signStatus == "1" ||
                    item.signStatus == "8" ||
                    item.signStatus == "0"
                ) {
                    // 0-初始化值，还未开始，1-正常，2-迟到，3-早退，4-迟到且早退，5-缺勤，6休息，7拟加班，8加班
                    return;
                }
                // if(item.punchIn==1){
                //     //疑似作弊
                //     return
                // }

                var copy = angular.extend({}, item);
                var modal = $uibModal.open({
                    animation: false,
                    size: "md",
                    templateUrl: "/view/checkin/summary/modal.addNote.html",
                    controller: "addNoteCtrl",
                    resolve: {
                        param: copy,
                    },
                });
                modal.result.then(function () {
                    $scope.find();
                });
            };
        }
    );

    app.controller(
        "addNoteCtrl",
        function (
            $scope,
            $http,
            $uibModal,
            $uibModalInstance,
            $filter,
            fac,
            param
        ) {
            $scope.auth = {};
            $scope.item = param || {};
            $scope.item.remark = $scope.item.remarkId || "";
            $scope.remarkList = [
                "调休",
                "病假",
                "年假",
                "婚假",
                "探亲假",
                "丧假",
                "事假",
            ];
            $scope.confirm = function (form) {
                form.$setSubmitted(true);
                if (!form.$valid) {
                    return;
                }
                if ($scope.item.status == "2") {
                    $scope.item.remark = "忘打卡";
                } else if ($scope.item.status == "0") {
                    $scope.item.remark = "加班";
                }
                $http
                    .post(
                        "/ovu-pcos/pcos/arrange/plan/edit",
                        $scope.item,
                        fac.postConfig
                    )
                    .success((resp) => {
                        if (resp.code == 0) {
                            msg(resp.msg);
                            $uibModalInstance.close();
                        } else {
                            alert(resp.msg);
                        }
                    });
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss("cancel");
            };
        }
    );
})();
