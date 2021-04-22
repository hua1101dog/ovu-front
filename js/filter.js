(function () {
    "use strict";
    window.confirm = function (message, fn, noEncodeHtml) {
        if (!noEncodeHtml) {
            // 先转义HTML标签
            var htmlUtil = new HTMLUtil();
            message = htmlUtil.encodeHtml(message);
        }
        layer.confirm(
            message,
            {
                btn: ["确定", "取消"],
                title: false,
            },
            function (index) {
                fn && fn();
                layer.close(index);
            },
            function () {}
        );
    };
    window.msg = function (tip, noEncodeHtml) {
        tip = tip || "操作成功！";
        if (!noEncodeHtml) {
            // 先转义HTML标签
            var htmlUtil = new HTMLUtil();
            tip = htmlUtil.encodeHtml(tip);
        }
        layer.msg(tip, {
            time: 2000,
            icon: 1,
        });
    };
  
  
    window.alert = function (tip, noEncodeHtml) {
        if (tip && !noEncodeHtml) {
            // 先转义HTML标签
            var htmlUtil = new HTMLUtil();
            tip = htmlUtil.encodeHtml(tip);
        }
        layer.msg(tip || "操作失败！", {
            time: 2000,
            icon: 5,
        });
    };
    window.warn = function (tip,icon) {
        layer.alert(tip || "提示信息！", {
            icon: icon || 5,
        });
    };

    // 转义HTML 标签 的一个工具
    var HTMLUtil = function () {
        this.REGX_HTML_ENCODE = /"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g;

        this.REGX_HTML_DECODE = /&\w+;|&#(\d+);/g;

        this.REGX_TRIM = /(^\s*)|(\s*$)/g;

        this.HTML_DECODE = {
            "&lt;": "<",
            "&gt;": ">",
            "&amp;": "&",
            "&nbsp;": " ",
            "&quot;": '"',
            "&copy;": "",

            // Add more
        };

        this.encodeHtml = function (s) {
            s = s != undefined ? s : this.toString();
            return typeof s != "string"
                ? s
                : s.replace(this.REGX_HTML_ENCODE, function ($0) {
                      var c = $0.charCodeAt(0),
                          r = ["&#"];
                      c = c == 0x20 ? 0xa0 : c;
                      r.push(c);
                      r.push(";");
                      return r.join("");
                  });
        };

        this.decodeHtml = function (s) {
            var HTML_DECODE = this.HTML_DECODE;

            s = s != undefined ? s : this.toString();
            return typeof s != "string"
                ? s
                : s.replace(this.REGX_HTML_DECODE, function ($0, $1) {
                      var c = HTML_DECODE[$0];
                      if (c == undefined) {
                          // Maybe is Entity Number
                          if (!isNaN($1)) {
                              c = String.fromCharCode($1 == 160 ? 32 : $1);
                          } else {
                              c = $0;
                          }
                      }
                      return c;
                  });
        };

        this.trim = function (s) {
            s = s != undefined ? s : this.toString();
            return typeof s != "string" ? s : s.replace(this.REGX_TRIM, "");
        };

        this.hashCode = function () {
            var hash = this.__hash__,
                _char;
            if (hash == undefined || hash == 0) {
                hash = 0;
                for (var i = 0, len = this.length; i < len; i++) {
                    _char = this.charCodeAt(i);
                    hash = 31 * hash + _char;
                    hash = hash & hash; // Convert to 32bit integer
                }
                hash = hash & 0x7fffffff;
            }
            this.__hash__ = hash;

            return this.__hash__;
        };
    };

    //uEditor模拟placeholder效果
    if (window.UE) {
        UE.Editor.prototype.placeholder = function (justPlainText) {
            var _editor = this;
            _editor.addListener("focus", function () {
                var localHtml = _editor.getPlainTxt();
                if ($.trim(localHtml) === $.trim(justPlainText)) {
                    _editor.setContent("");
                }
            });
            _editor.addListener("blur", function () {
                var localHtml = _editor.getContent();
                if (!localHtml) {
                    _editor.setContent(justPlainText);
                }
            });
            _editor.ready(function () {
                _editor.fireEvent("blur");
            });
        };
    }

    var app = angular.module("angularApp");
    //用于状态由key 转为对应名称: 如1 指 草稿.
    app.filter("keyToValue", function () {
        return function (input, dictList, key, text) {
            if (!input && input != "0") return "";
            if (!dictList) return "";
            if (angular.isString(input) && input.indexOf(",") > -1) {
                var list = dictList.reduce(function (ret, n) {
                    input.indexOf(n[key]) > -1 && ret.push(n[text]);
                    return ret;
                }, []);
                return list && list.join("，");
            }
            if (angular.isArray(dictList[0])) {
                var pair =
                    dictList &&
                    dictList.find(function (n) {
                        return n[0] == input;
                    });
                if (pair) {
                    return pair[1];
                } else {
                    dictList[0][1];
                }
            } else {
                key = key || "ID";
                text = text || "TEXT";
                var obj = dictList.find(function (n) {
                    return n[key] == input;
                });
                return obj && obj[text];
            }
        };
    });
    app.filter("notIn", function () {
        return function (list, options, curItem) {
            if (!list) {
                return;
            }
            if (!options) {
                return list;
            }
            return list.filter(function (n) {
                return (
                    curItem.id == n.id ||
                    !options.find(function (m) {
                        return m.id == n.id;
                    })
                );
            });
        };
    });
    app.filter("convertCompanyNature", function () {
        //转换企业类型
        return function (value) {
            if (value == "1") {
                return "国有企业 ";
            } else if (value == "2") {
                return "集体企业";
            } else if (value == "3") {
                return "股份合作企业";
            } else if (value == "4") {
                return "联营企业 ";
            } else if (value == "5") {
                return "有限责任公司 ";
            } else if (value == "6") {
                return "股份有限公司";
            } else if (value == "7") {
                return "私营企业 ";
            } else if (value == "8") {
                return "其他企业";
            } else if (value == "9") {
                return "港、澳、台商投资企业 ";
            } else if (value == "10") {
                return "外商投资企业 ";
            } else if (value == "11") {
                return "行政机关 ";
            } else if (value == "12") {
                return "事业单位  ";
            } else if (value == "13") {
                return "社会团体 ";
            } else {
                return "--";
            }
        };
    });
    app.filter("convertCompanySize", function () {
        //转换企业规模数字
        return function (value) {
            if (value == "1") {
                return "50人以内";
            } else if (value == "2") {
                return "50~100人";
            } else if (value == "3") {
                return "100-300人";
            } else if (value == "4") {
                return "300-500人";
            } else if (value == "5") {
                return "500-1000人";
            } else if (value == "6") {
                return "1000~5000人";
            } else if (value == "7") {
                return "5000~10000人";
            } else if (value == "8") {
                return "10000人及以上";
            } else {
                return "--";
            }
        };
    });
    app.filter("convertJob", function () {
        //转换职务
        return function (value) {
            if (value == "1") {
                return "总经理";
            } else if (value == "2") {
                return "董事长";
            } else if (value == "3") {
                return "经理";
            } else if (value == "4") {
                return "职员";
            } else {
                return "--";
            }
        };
    });
    //多选框由key转为对应名称 如 1,2 => 名称1,名称2
    app.filter("checkboxKeyToValue", function () {
        return function (input, checkList) {
            if (!input) return "";
            if (!checkList) return "";
            var inputArr = input.split(",");
            var returnArr = [];
            inputArr.forEach(function (i) {
                checkList.forEach(function (e) {
                    if (parseInt(i) === e.id) {
                        returnArr.push(e.text);
                    }
                });
            });
            return returnArr.join();
        };
    });
    app.filter("timePart", function () {
        return function (input) {
            if (!input || input == "null" || input.length < 11) return "";
            return input.substr(11);
        };
    });

    app.filter("jobCheckStatus", function () {
        return function (inputData) {
            var status = "";
            switch (inputData) {
                case "0":
                    status = "待审核";
                    break;
                case "1":
                    status = "审核通过";
                    break;
                case "2":
                    status = "审核不通过";
                    break;
                default:
                    status = "待审核";
            }
            return status;
        };
    });

    app.filter("spaceStatus", function () {
        return function (inputData) {
            var status = "";
            switch (inputData) {
                case 1:
                    status = "自持";
                    break;
                case 2:
                    status = "已租";
                    break;
                case 3:
                    status = "已售";
                    break;
                default:
                    status = "自持";
            }
            return status;
        };
    });
    app.filter("businessStatus", function () {
        return function (inputData) {
            var status = "";
            switch (inputData) {
                case 1:
                    status = "空置";
                    break;
                case 2:
                    status = "已租";
                    break;
            }
            return status;
        };
    });
    app.filter("theme", function () {
        return function (inputData) {
            var theme = "";
            switch (inputData) {
                case 1:
                    theme = "互联网软件";
                    break;
                case 2:
                    theme = "金融";
                    break;
                case 3:
                    theme = "动漫";
                    break;
            }
            return theme;
        };
    });
    app.filter("houseType", function () {
        return function (inputData) {
            var type = "";
            switch (inputData) {
                case "FW10":
                    type = "设备房";
                    break;
                case "FW11":
                    type = "办公用房";
                    break;
                case "FW12":
                    type = "住宅用房";
                    break;
                case "FW13":
                    type = "公共用房";
                    break;
                case "FW14":
                    type = "厨房酒店用房";
                    break;
                case "FW15":
                    type = "艺术类用房";
                    break;
                case "FW16":
                    type = "商业用房";
                    break;
                case "FW17":
                    type = "工厂用房";
                    break;
                case "FW18":
                    type = "公共区域";
                    break;
            }
            return type;
        };
    });
    app.filter("toSaleStatus", function () {
        return function (value) {
            if (value == 0) {
                return "销控";
            } else if (value == 1) {
                return "待售";
            } else if (value == 2) {
                return "认购";
            } else {
                return "签约";
            }
        };
    });
    app.filter("approveStatus", function () {
        //转换状态
        return function (value) {
            if (value == 0) {
                return "已保存";
            } else if (value == 1) {
                return "待审批";
            } else if (value == 2) {
                return "审批通过";
            } else {
                return "审批不通过";
            }
        };
    });
    //面积状态
    app.filter("toAreaStatus", function () {
        return function (value) {
            if (value == 0) {
                return "待售";
            } else {
                return "已售";
            }
        };
    });
    //租售类型
    app.filter("toRentSaleType", function () {
        return function (value) {
            if (value == 1) {
                return "租赁";
            } else if (value == 2) {
                return "招商";
            } else {
                return "租售";
            }
        };
    });
    app.filter("filterEllips", function () {
        return function (text, isEdit) {
            var len = isEdit ? 12 : 16;
            if (text.length <= len) {
                return text;
            }
            return text.substring(0, len - 3) + "...";
        };
    });
    app.filter("fileTypeFilter", function () {
        return function (text, type) {
            var file = text.toLowerCase();
            var fileType = "";
            if (file.indexOf("doc") != -1 || file.indexOf("docx") != -1) {
                fileType = "word";
            } else if (
                file.indexOf("xls") != -1 ||
                file.indexOf("xlsx") != -1
            ) {
                fileType = "excel";
            } else if (file.indexOf("ppt") != -1) {
                fileType = "ppt";
            } else if (file.indexOf("zip") != -1 || file.indexOf("rar") != -1) {
                fileType = "zip";
            } else if (
                file.indexOf("jpg") != -1 ||
                file.indexOf("png") != -1 ||
                file.indexOf("gif") != -1
            ) {
                fileType = "photo";
            } else if (
                file.indexOf("mp4") != -1 ||
                file.indexOf("rmvb") != -1
            ) {
                fileType = "video";
            } else if (file.indexOf("pdf") != -1) {
                fileType = "pdf";
            } else if (file.indexOf("mp3") != -1) {
                fileType = "sound";
            } else if (
                file.indexOf("html") != -1 ||
                file.indexOf("css") != -1 ||
                file.indexOf("js") != -1
            ) {
                fileType = "code";
            }
            return fileType == type;
        };
    });
    //将金额转化为大写金额
    app.filter("toTransUpper", function () {
        return function toTransUpper(n) {
            if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) return "数据非法";
            var unit = "千百拾亿千百拾万千百拾元角分",
                str = "";
            n += "00";
            var p = n.indexOf(".");
            if (p >= 0) n = n.substring(0, p) + n.substr(p + 1, 2);
            unit = unit.substr(unit.length - n.length);
            for (var i = 0; i < n.length; i++)
                str +=
                    "零壹贰叁肆伍陆柒捌玖".charAt(n.charAt(i)) + unit.charAt(i);
            return str
                .replace(/零(千|百|拾|角)/g, "零")
                .replace(/(零)+/g, "零")
                .replace(/零(万|亿|元)/g, "$1")
                .replace(/(亿)万|壹(拾)/g, "$1$2")
                .replace(/^元零?|零分/g, "")
                .replace(/元$/g, "元整");
        };
    });
    app.directive("page", function () {
        return {
            restrict: "E",
            scope: {
                pageModel: "<?",
                find: "<?",
            },
            templateUrl: "/common/pager.html",
            controller: function ($scope, fac) {
                //勾选
                $scope.find = $scope.find || $scope.$parent.find;
            },
        };
    });
    app.directive("pagePro", function () {
        return {
            restrict: "E",
            scope: {
                pageModel: "<?",
                find: "<?",
            },
            templateUrl: "/common/pagerPro.html",
            controller: function ($scope, fac) {
                //勾选

                $scope.getValue = function (value, total) {
                    if (value.length == 1) {
                        value = value.replace(/[^1-9]/g, "");
                    } else {
                        value = value.replace(/\D/g, "");
                    }
                    if (value - 0 > total) {
                        value = "1";
                    }
                    $scope.inputPage = value;
                    $scope.find($scope.inputPage);
                };
                $scope.$watch("pageModel.currentPage", function (currentPage) {
                    if (currentPage && currentPage == 1) {
                        $scope.inputPage = "1";
                    } else {
                        $scope.inputPage = currentPage;
                    }
                });
                $scope.find = $scope.find || $scope.$parent.find;
                $scope.getValue = $scope.getValue || $scope.$parent.getValue;
            },
        };
    });
    app.directive("selectPerson", function () {
        return {
            restrict: "E",
            replace: true,
            scope: {
                need: "=",
                isinvalid: "=",
                host: "=",
                personId: "<?",
                userId: "<?",
                deptId: "<?",
                personType: "<?",
                postId: "<?",
                callback: "<?",
                deptIds: "<?",
                notInIds: "<?",
            },
            templateUrl: "/common/selectPersonTemplate.html",
            controller: function ($scope, fac, $q) {
                var vm = this;
                // find(1,$viewValue)
                var $input;
                $scope.user = undefined;
                $(document).on(
                    "click",
                    ".custom-popup-wrapper .page ul",
                    function (event) {
                        event.stopPropagation();
                        $input = $(event.target)
                            .parents(".custom-popup-wrapper")
                            .prev("input");
                        //$input.blur();
                        // $input.focus();
                        $input.trigger("focus");
                    }
                );

                var param = {};
                $scope.pageModel = {};
                $scope.$watch("deptId", function (deptId) {
                    if ($scope.personType == "auth") {
                        param.authDeptId = deptId;
                    } else {
                        param.deptId = deptId;
                    }
                });

                $scope.$watch("postId", function (postId) {
                    if ($scope.personType == "auth") {
                        param.authPostId = postId;
                    } else {
                        param.postId = postId;
                    }
                });
                $scope.$watch("deptIds", function (depts) {
                    param.deptIds = depts;
                });

                $scope.$watch("host", function (host) {
                    if (host == null) {
                        $scope.user = null;
                    } else {
                        $scope.user = host;
                    }
                });

                function trimText(val) {
                    if (val && val.indexOf(" (") > 0) {
                        val = val.substring(0, val.indexOf(" ("));
                    }
                    return val;
                }

                $scope.$watch("deptId", function (deptId) {
                    if ($scope.personType == "auth") {
                        param.authDeptId = deptId;
                    } else {
                        param.deptId = deptId;
                    }
                });
                $scope.$watch("postId", function (postId) {
                    if ($scope.personType == "auth") {
                        param.authPostId = postId;
                    } else {
                        param.postId = postId;
                    }
                });

                function different(a, b) {
                    if (!a && !b) {
                        return false;
                    } else if (a == b) {
                        return false;
                    } else {
                        return true;
                    }
                }

                $scope.find = function (pageNo, val) {
                    var deferred = $q.defer();
                    if (!param.deptId && !param.authDeptId && !param.deptIds) {
                        alert("请选择部门！");
                        return;
                    }
                    if (
                        $input &&
                        different(param.name, trimText($input.val()))
                    ) {
                        pageNo = 1;
                    }
                    if ($input) {
                        param.name = trimText($input.val());
                    } else {
                        param.name = trimText(val);
                    }
                    if ($scope.notInIds) {
                        param.notInIds = $scope.notInIds;
                    }
                    $.extend(param, {
                        currentPage:
                            pageNo || $scope.pageModel.currentPage || 1,
                        pageSize: $scope.pageModel.pageSize || 10,
                        jobStatus: 1
                    });
                    fac.getPageResult(
                        "/ovu-base/pcos/person/findPerson_mute.do",
                        param,
                        function (data) {
                            $scope.pageModel = data;
                            //$("select-person input").off("blur");
                            deferred.resolve(data.data);
                        }
                    );
                    return deferred.promise;
                };

                $scope.selectPage = function (pageNo) {
                    $scope.pageModel.currentPage = pageNo;
                };
                $scope.finishPick = function (user) {
                    if ($scope.userId) {
                        $scope.host[$scope.userId] = user.userId;
                    } else if ($scope.personId) {
                        $scope.host[$scope.personId] = user.id;
                    } else {
                        $scope.host = user;
                    }
                    $scope.callback && $scope.callback($scope.host, user);
                };
                $scope.clear = function ($event) {
                    
                    $input = $($event.target).prevAll("input");
                    $input.val("");
                    $scope.pageModel.currentPage = 1;
                    // $scope.finishPick({});
                    $input.trigger("focus");
                    // $input.focus();
                    $scope.user = $scope.host = null;
                };
            },
        };
    });

    //关于带复选框的下拉菜单
    app.directive("selectView", function () {
        return {
            restrict: "E",
            scope: {
                nodeList: "=",
                checkCallback: "<?",
                host: "<?",
                config: "<?",
                selectNode: "<?",
            },
            templateUrl: "/common/selectView.html",
            controller: function ($scope, fac) {
                console.log("相当于第二层的功能!");
            },
        };
    });

    //隐藏和像是功能
    app.directive("selectCheckbox", function () {
        return {
            restrict: "E",
            scope: {
                nodeList: "=",
                tipText: "=",
                checkCallback: "<?",
                host: "<?",
                config: "<?",
                state: "<?",
                need: "=",
            },
            templateUrl: "/common/selectCheckbox.html",
            controller: function ($scope, fac) {
                console.log("相当于第一层的功能!");
            },
        };
    });

    app.directive("treeView", function () {
        return {
            restrict: "E",
            scope: {
                nodeList: "=",
                checkCallback: "<?",
                host: "<?",
                config: "<?",
                selectNode: "<?",
            },
            templateUrl: "/common/tree.html",
            controller: function ($scope, fac) {
                //勾选
                function defaultCheck(node) {
                    node.state = node.state || {};
                    node.state.checked = !node.state.checked;

                    function checkSons(node, status) {
                        node.state = node.state || {};
                        node.state.checked = status;
                        if (node.nodes && node.nodes.length) {
                            node.nodes.forEach(function (n) {
                                checkSons(n, status);
                            });
                        }
                    }

                    function uncheckFather(node) {
                        var father = $scope.flatTree.find(function (n) {
                            return n.id == node.pid;
                        });
                        if (father) {
                            father.state = father.state || {};
                            father.state.checked = false;
                            uncheckFather(father);
                        }
                    }
                    if (node.state.checked) {
                        checkSons(node, true);
                    } else {
                        checkSons(node, false);
                        uncheckFather(node);
                    }
                    $scope.checkCallback && $scope.checkCallback(node);
                }
                if (!$scope.config || !$scope.config.hasOwnProperty("edit")) {
                    $scope.config = {
                        edit: true,
                        sort: false,
                    };
                }
                $scope.flatTree = !$scope.$parent.nodeList
                    ? fac.treeToFlat($scope.nodeList)
                    : $scope.$parent.flatTree;
                $scope.selectNode =
                    $scope.selectNode || $scope.$parent.selectNode;
                $scope.sort = $scope.$parent.sort;
                $scope.undo = $scope.$parent.undo;
                $scope.save = $scope.$parent.save;
                $scope.delNode = $scope.$parent.delNode;
                $scope.moveNode = $scope.$parent.moveNode;
                $scope.addSon = $scope.$parent.addSon;
                $scope.check = $scope.$parent.check
                    ? $scope.$parent.check
                    : defaultCheck;
                $scope.editNode = $scope.$parent.editNode;
            },
        };
    });
    //招商系统项目树--start creator by zp
    app.directive("treeSelProject", function () {
        return {
            restrict: "E",
            scope: {
                need: "=",
                host: "=",
                tipText: "=",
                hostKey: "=",
                hostText: "=",
                nodeList: "=",
                leafOnly: "=",
                callback: "=",
            },
            templateUrl: "/common/selProjectTree.html",
            controller: function ($scope, $rootScope, fac) {
                $scope.state = {};
                $scope.host = $scope.host || {};
                var key = $scope.hostKey;
                var leafOnly = $scope.leafOnly;
                if ($scope.host[key] && !$scope.host[$scope.hostText]) {
                    var flatList = fac.treeToFlat($scope.nodeList);
                    var node = flatList.find(function (n) {
                        return $scope.host[key] == n.id;
                    });
                    if (node) {
                        $scope.host[$scope.hostText] = node.text;
                    }
                }

                $scope.expendNode = function (node) {
                    $scope.state.hover = $scope.state.focus = true;
                    node.state = node.state || {};
                    if (!node.state.expanded) {
                        $scope.callback && $scope.callback(node);
                    }
                    node.state.expanded = !node.state.expanded;
                };

                $scope.selectNode = function (node, host) {
                    if (leafOnly && node.nodes && node.nodes.length) {
                        alert("请选择叶子节点！");
                        return;
                    }
                    var oldNode = fac.getSelectedNode($scope.nodeList);
                    if (oldNode && oldNode != node) {
                        oldNode.state.selected = false;
                    }
                    node.state = node.state || {};
                    node.state.selected = true;

                    if (angular.isDefined(node.id) && node.id != host[key]) {
                        host.stageId = "";
                        host.stageName = "";
                        host.buildId = "";
                        host.buildName = "";
                        $.extend(host, node);
                        // host[key] = node.id;
                        // host.pid = node.pid;
                        // //host[$scope.hostText] = (node.ptexts ? node.ptexts + " > " : "") + node.text;
                        // host[$scope.hostText] = node.text;
                        $scope.state.hover = $scope.state.focus = false;
                        $scope.callback && $scope.callback(node);
                        //$scope.$apply();
                    }
                };
                $scope.clear = function () {
                    $scope.host[$scope.hostText] = "";
                    delete $scope.host[key];
                    $scope.callback && $scope.callback($scope.host);
                };
                $scope.$watch("host." + $scope.hostText, function (
                    text,
                    oldText
                ) {
                    if (!$scope.nodeList) return;
                    if ($scope.host) {
                        var node = $scope.host[key]
                            ? fac.getNodeById($scope.nodeList, $scope.host[key])
                            : null;
                        var str = text && text.replace(/ /g, "");
                        if (
                            node &&
                            (node.text == text ||
                                (node.fullPath &&
                                    node.fullPath.split(">")[
                                        node.fullPath.split(">").length - 1
                                    ] ==
                                        str.split(">")[
                                            str.split(">").length - 1
                                        ]))
                        ) {
                            fac.filterTree(
                                $scope.nodeList,
                                "id",
                                $scope.host[key],
                                false
                            );
                            if ($scope.host.pid && $scope.host.pid != "0") {
                                var parentNode = fac.getNodeById(
                                    $scope.nodeList,
                                    $scope.host.pid
                                );
                                if (parentNode) {
                                    parentNode.nodes &&
                                        parentNode.nodes.forEach(function (n) {
                                            fac.setTreeState(n, "hide", false);
                                        });
                                } else {
                                    $scope.nodeList.forEach(function (n) {
                                        fac.setTreeState(n, "hide", false);
                                    });
                                }
                            } else {
                                $scope.nodeList.forEach(function (n) {
                                    fac.setTreeState(n, "hide", false);
                                });
                            }
                        } else if (text) {
                            fac.filterTree(
                                $scope.nodeList,
                                "text",
                                text,
                                false
                            );
                            delete $scope.host[key];
                        } else {
                            $scope.nodeList &&
                                $scope.nodeList.forEach(function (n) {
                                    fac.setTreeState(n, "hide", false);
                                });
                            delete $scope.host[key];
                        }
                    }
                });
            },
            link: function (scope, $element, $attrs) {
                //  $element[0].style.marginBottom = "450px";
                // $element[0].style.marginRight = "25px";
            },
        };
    });
    app.directive("treeProject", function () {
        return {
            restrict: "E",
            scope: {
                nodeList: "=",
                host: "<?",
                config: "<?",
                selectNode: "<?",
            },
            templateUrl: "/common/projectTree.html",
            controller: function ($scope, fac) {
                $scope.flatTree = !$scope.$parent.nodeList
                    ? fac.treeToFlat($scope.nodeList)
                    : $scope.$parent.flatTree;
                $scope.selectNode =
                    $scope.selectNode || $scope.$parent.selectNode;
                $scope.expendNode =
                    $scope.expendNode || $scope.$parent.expendNode;
            },
        };
    });
    //招商系统项目树--end

    app.directive("treeViewPro", function () {
        return {
            restrict: "E",
            scope: {
                host: "<?",
                tipText: "=",
                config: "<?",
                hostKey: "<?",
                hostText: "<?",
                nodeList: "=",
                callback: "<?",
                clean: "<?",
                checkCallback: "<?",
            },
            templateUrl: "/common/treePro.html",
            controller: function ($scope, $rootScope, fac) {
                $scope.state = {};
                $scope.host = $scope.host || {};
                $scope.hostKey = $scope.hostKey || "key";
                $scope.hostText = $scope.hostText || "text";
                var key = $scope.hostKey;
                //勾选
                function defaultCheck(node) {
                    node.state = node.state || {};
                    node.state.checked = !node.state.checked;

                    function checkSons(node, status) {
                        node.state = node.state || {};
                        node.state.checked = status;
                        if (node.nodes && node.nodes.length) {
                            node.nodes.forEach(function (n) {
                                checkSons(n, status);
                            });
                        }
                    }

                    function uncheckFather(node) {
                        var father = $scope.flatTree.find(function (n) {
                            return n.id == node.pid;
                        });
                        if (father) {
                            father.state = father.state || {};
                            father.state.checked = false;
                            uncheckFather(father);
                        }
                    }
                    if (node.state.checked) {
                        checkSons(node, true);
                    } else {
                        checkSons(node, false);
                        uncheckFather(node);
                    }
                    $scope.checkCallback && $scope.checkCallback(node);
                }
                if (!$scope.config || !$scope.config.hasOwnProperty("edit")) {
                    $scope.config = {
                        edit: true,
                        sort: false,
                    };
                }
                $scope.flatTree = !$scope.$parent.nodeList
                    ? fac.treeToFlat($scope.nodeList)
                    : $scope.$parent.flatTree;
                $scope.selectNode =
                    $scope.selectNode || $scope.$parent.selectNode;
                $scope.sort = $scope.$parent.sort;
                $scope.undo = $scope.$parent.undo;
                $scope.save = $scope.$parent.save;
                $scope.delNode = $scope.$parent.delNode;
                $scope.moveNode = $scope.$parent.moveNode;
                $scope.addSon = $scope.$parent.addSon;
                $scope.mykeyUp = $scope.$parent.mykeyUp;
                $scope.check = $scope.$parent.check
                    ? $scope.$parent.check
                    : defaultCheck;
                $scope.editNode = $scope.$parent.editNode;
                $scope.$watch("host." + $scope.hostKey, function (id, oldId) {
                    if ($scope.host[key] && !$scope.host[$scope.hostText]) {
                        var flatList = fac.treeToFlat($scope.nodeList);
                        var node = flatList.find(function (n) {
                            return (
                                $scope.host[key] == n.id ||
                                $scope.host[key] == n.ID
                            );
                        });
                        if (node) {
                            node.state = node.state || {};
                            node.state.selected = true;
                            $scope.host[$scope.hostText] = node.text;
                            $scope.callback &&
                                $scope.callback($scope.host, node);
                        }
                    }
                });

                $scope.selectNode = function (node, host) {
                     
                     fac.showTreeNode(
                                $scope.nodeList,
                                'text',
                                $scope.host[$scope.hostText],
                                false
                            );
                    var list = fac.treeToFlat($scope.nodeList);
                    list.forEach(function (n) {
                        if (n.state && n.state.selected && n != node) {
                            n.state.selected = false;
                        }
                    });

                    node.state = node.state || {};
                    node.state.selected = true;

                    if (
                        (angular.isDefined(node.id) && node.id != host[key]) ||
                        (angular.isDefined(node.ID) && node.ID != host[key])
                    ) {
                        host[key] = node.id || node.ID;
                        host.pid = node.pid;
                        //host[$scope.hostText] = (node.ptexts ? node.ptexts + " > " : "") + node.text;
                        host[$scope.hostText] = node.text;
                        $scope.state.hover = $scope.state.focus = false;
                        $scope.callback && $scope.callback($scope.host, node);
                        //$scope.$apply();
                    }
                };
                $scope.clear = function () {
                    $scope.host[$scope.hostText] = "";
                    delete $scope.host[key];
                    $scope.clean && $scope.clean($scope.host);
                };

                $scope.$watch("host." + $scope.hostText, function (
                    text,
                    oldText
                ) {
                    if (!$scope.nodeList) return;
                    if ($scope.host) {
                        var node = $scope.host[key]
                            ? fac.getNodeById($scope.nodeList, $scope.host[key])
                            : null;
                        if (node && node.text == text) {
                            fac.filterTree(
                                $scope.nodeList,
                                "id",
                                $scope.host[key],
                                false
                            );
                            $scope.dept = node;
                            app.park = $rootScope.park = node;
                            if ($scope.host.pid && $scope.host.pid != "0") {
                                var parentNode = fac.getNodeById(
                                    $scope.nodeList,
                                    $scope.host.pid
                                );
                                if (parentNode) {
                                    parentNode.nodes &&
                                        parentNode.nodes.forEach(function (n) {
                                            fac.setTreeState(n, "hide", false);
                                        });
                                } else {
                                    $scope.nodeList.forEach(function (n) {
                                        fac.setTreeState(n, "hide", false);
                                    });
                                }
                            } else {
                                $scope.nodeList.forEach(function (n) {
                                    fac.setTreeState(n, "hide", false);
                                });
                            }
                        } else if (text) {
                            // fac.filterTree(
                            //     $scope.nodeList,
                            //     "text",
                            //     text,
                            //     false
                            // );
                              fac.hideTreeNode(
                                $scope.nodeList,
                                "text",
                                text,
                                true
                            );
                            delete $scope.host[key];
                        } else {
                            $scope.nodeList &&
                                $scope.nodeList.forEach(function (n) {
                                    fac.setTreeState(n, "hide", false);
                                    fac.setTreeState(n, "highLight", false);
                                });
                            delete $scope.host[key];
                        }
                    }
                });
            },
            link: function (scope, $element, $attrs) {
                //  $element[0].style.marginBottom = "450px";
                // $element[0].style.marginRight = "25px";
            },
        };
    });
    app.directive("insitemTree", function () {
        return {
            restrict: "E",
            scope: {
                nodeList: "=",
                checkCallback: "<?",
                host: "<?",
                config: "<?",
                selectNode: "<?",
            },
            templateUrl: "/common/insitemTree.html",
            controller: function ($scope, fac) {
                //勾选
                function defaultCheck(node) {
                    node.state = node.state || {};
                    node.state.checked = !node.state.checked;

                    function checkSons(node, status) {
                        node.state = node.state || {};
                        node.state.checked = status;
                        if (node.nodes && node.nodes.length) {
                            node.nodes.forEach(function (n) {
                                checkSons(n, status);
                            });
                        }
                    }

                    function uncheckFather(node) {
                        var father = $scope.flatTree.find(function (n) {
                            return n.id == node.pid;
                        });
                        if (father) {
                            father.state = father.state || {};
                            father.state.checked = false;
                            uncheckFather(father);
                        }
                    }
                    if (node.state.checked) {
                        checkSons(node, true);
                    } else {
                        checkSons(node, false);
                        uncheckFather(node);
                    }
                    $scope.checkCallback && $scope.checkCallback();
                }
                if (!$scope.config || !$scope.config.hasOwnProperty("edit")) {
                    $scope.config = {
                        // edit: true,
                        sort: false,
                    };
                }
                $scope.flatTree = !$scope.$parent.nodeList
                    ? fac.treeToFlat($scope.nodeList)
                    : $scope.$parent.flatTree;
                $scope.selectNode =
                    $scope.selectNode || $scope.$parent.selectNode;
                $scope.sort = $scope.$parent.sort;
                $scope.undo = $scope.$parent.undo;
                $scope.save = $scope.$parent.save;
                $scope.delNode = $scope.$parent.delNode;
                $scope.moveNode = $scope.$parent.moveNode;
                $scope.addSon = $scope.$parent.addSon;
                $scope.check = $scope.$parent.check
                    ? $scope.$parent.check
                    : defaultCheck;
                $scope.editNode = $scope.$parent.editNode;
            },
        };
    });

    app.directive("itreeViewPro", function () {
        return {
            restrict: "E",
            scope: {
                host: "<?",
                tipText: "=",
                config: "<?",
                hostKey: "<?",
                hostText: "<?",
                nodeList: "=",
                callback: "<?",
                clean: "<?",
            },
            templateUrl: "/common/itreePro.html",
            controller: function ($scope, $rootScope, fac) {
                $scope.state = {};
                $scope.host = $scope.host || {};
                $scope.hostKey = $scope.hostKey || "key";
                $scope.hostText = $scope.hostText || "text";
                var key = $scope.hostKey;
                //勾选
                function defaultCheck(node) {
                    node.state = node.state || {};
                    node.state.checked = !node.state.checked;

                    function checkSons(node, status) {
                        node.state = node.state || {};
                        node.state.checked = status;
                        if (node.nodes && node.nodes.length) {
                            node.nodes.forEach(function (n) {
                                checkSons(n, status);
                            });
                        }
                    }

                    function uncheckFather(node) {
                        var father = $scope.flatTree.find(function (n) {
                            return n.id == node.pid;
                        });
                        if (father) {
                            father.state = father.state || {};
                            father.state.checked = false;
                            uncheckFather(father);
                        }
                    }
                    if (node.state.checked) {
                        checkSons(node, true);
                    } else {
                        checkSons(node, false);
                        uncheckFather(node);
                    }
                    $scope.checkCallback && $scope.checkCallback();
                }
                if (!$scope.config || !$scope.config.hasOwnProperty("edit")) {
                    $scope.config = {
                        // edit: true,
                        sort: false,
                    };
                }
                $scope.flatTree = !$scope.$parent.nodeList
                    ? fac.treeToFlat($scope.nodeList)
                    : $scope.$parent.flatTree;
                $scope.selectNode =
                    $scope.selectNode || $scope.$parent.selectNode;
                $scope.sort = $scope.$parent.sort;
                $scope.undo = $scope.$parent.undo;
                $scope.save = $scope.$parent.save;
                $scope.delNode = $scope.$parent.delNode;
                $scope.moveNode = $scope.$parent.moveNode;
                $scope.addSon = $scope.$parent.addSon;
                $scope.check = $scope.$parent.check
                    ? $scope.$parent.check
                    : defaultCheck;
                $scope.editNode = $scope.$parent.editNode;
                $scope.$watch("host." + $scope.hostKey, function (id, oldId) {
                    if ($scope.host[key] && !$scope.host[$scope.hostText]) {
                        var flatList = fac.treeToFlat($scope.nodeList);
                        var node = flatList.find(function (n) {
                            return (
                                $scope.host[key] == n.id ||
                                $scope.host[key] == n.ID
                            );
                        });
                        if (node) {
                            node.state = node.state || {};
                            node.state.selected = true;
                            $scope.host[$scope.hostText] = node.text;
                            $scope.callback &&
                                $scope.callback($scope.host, node);
                        }
                    }
                });

                $scope.selectNode = function (node, host) {
                    fac.showTreeNode(
                        $scope.nodeList,
                        'text',
                        $scope.host[$scope.hostText],
                        false
                    );
                    var list = fac.treeToFlat($scope.nodeList);
                    list.forEach(function (n) {
                        if (n.state && n.state.selected && n != node) {
                            n.state.selected = false;
                        }
                    });

                    node.state = node.state || {};
                    node.state.selected = true;

                    if (
                        (angular.isDefined(node.id) && node.id != host[key]) ||
                        (angular.isDefined(node.ID) && node.ID != host[key])
                    ) {
                        host[key] = node.id || node.ID;
                        host.pid = node.pid;
                        //host[$scope.hostText] = (node.ptexts ? node.ptexts + " > " : "") + node.text;
                        host[$scope.hostText] = node.text;
                        $scope.state.hover = $scope.state.focus = false;
                        $scope.callback && $scope.callback($scope.host, node);
                        //$scope.$apply();
                    }
                };
                $scope.clear = function () {
                    $scope.host[$scope.hostText] = "";
                    delete $scope.host[key];
                    $scope.clean && $scope.clean($scope.host);
                };
                $scope.$watch("host." + $scope.hostText, function (
                    text,
                    oldText
                ) {
                    if (!$scope.nodeList) return;
                    if ($scope.host) {
                        var node = $scope.host[key]
                            ? fac.getNodeById($scope.nodeList, $scope.host[key])
                            : null;
                        if (node && node.text == text) {
                            fac.filterTree(
                                $scope.nodeList,
                                "id",
                                $scope.host[key],
                                false
                            );
                            $scope.dept = node;
                            app.park = $rootScope.park = node;
                            if ($scope.host.pid && $scope.host.pid != "0") {
                                var parentNode = fac.getNodeById(
                                    $scope.nodeList,
                                    $scope.host.pid
                                );
                                if (parentNode) {
                                    parentNode.nodes.forEach(function (n) {
                                        fac.setTreeState(n, "hide", false);
                                    });
                                } else {
                                    $scope.nodeList.forEach(function (n) {
                                        fac.setTreeState(n, "hide", false);
                                    });
                                }
                            } else {
                                $scope.nodeList.forEach(function (n) {
                                    fac.setTreeState(n, "hide", false);
                                });
                            }
                        } else if (text) {
                            // fac.filterTree(
                            //     $scope.nodeList,
                            //     "text",
                            //     text,
                            //     false
                            // );
                            fac.hideTreeNode(
                                $scope.nodeList,
                                "text",
                                text,
                                true
                            );
                            delete $scope.host[key];
                        } else {
                            $scope.nodeList &&
                                $scope.nodeList.forEach(function (n) {
                                    fac.setTreeState(n, "hide", false);
                                    fac.setTreeState(n, "highLight", false);
                                });
                            delete $scope.host[key];
                        }
                    }
                });
            },
            link: function (scope, $element, $attrs) {
                //  $element[0].style.marginBottom = "450px";
                // $element[0].style.marginRight = "25px";
            },
        };
    });

    app.directive("menuListSearch", function () {
        return {
            restrict: "E",
            scope: {
                menuList: "<",
                oftenUsedList: "=",
                showMenuList: "=",
            },
            templateUrl: "/view/sys/menuListSearch.html",
            controller: function ($scope, fac, $rootScope) {
                $scope.menuName = "";
                $scope.showSerachTitle = false;
                $scope.$watch("showMenuList", function (curSta) {
                    if (curSta && $scope.menuName) {
                        $scope.menuName = "";
                        $scope.findSearchMenu();
                    }
                });

                $scope.findSearchMenu = function () {
                    $scope.showSerachTitle = $scope.menuName ? true : false;
                    fac.searchTree($scope.menuList, "text", $scope.menuName);
                };
                $scope.selectMenu = function (node,$event) {
                    var id = $rootScope.user.id;
                    for (var i = 0; i < $scope.oftenUsedList.length; i++) {
                        if ($scope.oftenUsedList[i].text == node.text) {
                            $scope.oftenUsedList.splice(i, 1);
                        }
                    }
                    if ($scope.oftenUsedList.length >= 9) {
                        $scope.oftenUsedList.pop();
                    }
                    $scope.oftenUsedList.unshift(node);
                    localStorage.setItem(
                        id,
                        JSON.stringify($scope.oftenUsedList)
                    );
                    var testt = localStorage.getItem($rootScope.user.id);
                  
                    $scope.$parent.selectMenu(node,$event);
                };
            },
        };
    });
    app.directive("treeMenuList", function () {
        return {
            restrict: "E",
            scope: {
                nodeList: "=",
            },
            templateUrl: "treeMenuList.html",
            controller: function ($scope) {
                $scope.selectMenu = $scope.$parent.selectMenu;
            },
        };
    });

    //能源空间树
    app.directive("engergytreeView", function () {
        return {
            restrict: "E",
            scope: {
                nodeList: "=",
                host: "<?",
                config: "<?",
                selectNode: "<?",
            },
            templateUrl: "/common/energyTree.html",
            controller: function ($scope, fac) {
                //勾选
                function defaultCheck(node) {
                    node.state = node.state || {};
                    node.state.checked = !node.state.checked;

                    function checkSons(node, status) {
                        node.state = node.state || {};
                        node.state.checked = status;
                        if (node.nodes && node.nodes.length) {
                            node.nodes.forEach(function (n) {
                                checkSons(n, status);
                            });
                        }
                    }

                    function uncheckFather(node) {
                        var father = $scope.flatTree.find(function (n) {
                            return n.id == node.pid;
                        });
                        if (father) {
                            father.state = father.state || {};
                            father.state.checked = false;
                            uncheckFather(father);
                        }
                    }
                    if (node.state.checked) {
                        checkSons(node, true);
                    } else {
                        checkSons(node, false);
                        uncheckFather(node);
                    }
                }
                if (!$scope.config || !$scope.config.hasOwnProperty("edit")) {
                    $scope.config = {
                        edit: true,
                        sort: false,
                    };
                }
                $scope.flatTree = !$scope.$parent.nodeList
                    ? fac.treeToFlat($scope.nodeList)
                    : $scope.$parent.flatTree;
                $scope.selectNode =
                    $scope.selectNode || $scope.$parent.selectNode;
                $scope.sort = $scope.$parent.sort;
                $scope.undo = $scope.$parent.undo;
                $scope.save = $scope.$parent.save;
                $scope.delNode = $scope.$parent.delNode;
                $scope.addSon = $scope.$parent.addSon;
                $scope.check = $scope.$parent.check
                    ? $scope.$parent.check
                    : defaultCheck;
                $scope.editNode = $scope.$parent.editNode;
            },
        };
    });
    //变配电树
    app.directive("tranformertreeView", function () {
        return {
            restrict: "E",
            scope: {
                host: "<?",
                tipText: "=",
                config: "<?",
                hostKey: "<?",
                hostText: "<?",
                nodeList: "=",
                callback: "<?",
                clean: "<?",
            },
            templateUrl: "/common/transformerTree.html",
            controller: function ($scope, $rootScope, fac) {
                $scope.state = {};
                $scope.host = $scope.host || {};
                $scope.hostKey = $scope.hostKey || "key";
                $scope.hostText = $scope.hostText || "text";

                var key = $scope.hostKey;
                //勾选
                function defaultCheck(node) {
                    node.state = node.state || {};
                    node.state.checked = !node.state.checked;

                    function checkSons(node, status) {
                        node.state = node.state || {};
                        node.state.checked = status;
                        if (node.nodes && node.nodes.length) {
                            node.nodes.forEach(function (n) {
                                checkSons(n, status);
                            });
                        }
                    }

                    function uncheckFather(node) {
                        var father = $scope.flatTree.find(function (n) {
                            return n.id == node.pid;
                        });
                        if (father) {
                            father.state = father.state || {};
                            father.state.checked = false;
                            uncheckFather(father);
                        }
                    }
                    if (node.state.checked) {
                        checkSons(node, true);
                    } else {
                        checkSons(node, false);
                        uncheckFather(node);
                    }
                    $scope.checkCallback && $scope.checkCallback();
                }
                if (!$scope.config || !$scope.config.hasOwnProperty("edit")) {
                    $scope.config = {
                        edit: true,
                        sort: false,
                    };
                }
                $scope.flatTree = !$scope.$parent.nodeList
                    ? fac.treeToFlat($scope.nodeList)
                    : $scope.$parent.flatTree;
                $scope.selectNode =
                    $scope.selectNode || $scope.$parent.selectNode;
                $scope.sort = $scope.$parent.sort;
                $scope.undo = $scope.$parent.undo;
                $scope.save = $scope.$parent.save;
                $scope.delNode = $scope.$parent.delNode;
                $scope.moveNode = $scope.$parent.moveNode;
                $scope.addSon = $scope.$parent.addSon;
                $scope.check = $scope.$parent.check
                    ? $scope.$parent.check
                    : defaultCheck;
                $scope.editNode = $scope.$parent.editNode;
                $scope.$watch("host." + $scope.hostKey, function (id, oldId) {
                    if ($scope.host[key] && !$scope.host[$scope.hostText]) {
                        var flatList = fac.treeToFlat($scope.nodeList);
                        var node = flatList.find(function (n) {
                            return (
                                $scope.host[key] == n.id ||
                                $scope.host[key] == n.ID
                            );
                        });
                        if (node) {
                            node.state = node.state || {};
                            node.state.selected = true;
                            $scope.host[$scope.hostText] = node.text;
                            $scope.callback &&
                                $scope.callback($scope.host, node);
                        }
                    }
                });

                $scope.selectNode = function (node, host) {
                    var list = fac.treeToFlat($scope.nodeList);
                    list.forEach(function (n) {
                        if (n.state && n.state.selected && n != node) {
                            n.state.selected = false;
                        }
                    });

                    node.state = node.state || {};
                    node.state.selected = true;

                    if (
                        (angular.isDefined(node.id) && node.id != host[key]) ||
                        (angular.isDefined(node.ID) && node.ID != host[key])
                    ) {
                        host[key] = node.id || node.ID;
                        host.pid = node.pid;
                        //host[$scope.hostText] = (node.ptexts ? node.ptexts + " > " : "") + node.text;
                        host[$scope.hostText] = node.text;
                        $scope.state.hover = $scope.state.focus = false;
                        $scope.callback && $scope.callback($scope.host, node);
                        //$scope.$apply();
                    }
                };
                $scope.clear = function () {
                    $scope.host[$scope.hostText] = "";
                    delete $scope.host[key];
                    $scope.clean && $scope.clean($scope.host);
                };
                $scope.$watch("host." + $scope.hostText, function (
                    text,
                    oldText
                ) {
                    if (!$scope.nodeList) return;
                    if ($scope.host) {
                        var node = $scope.host[key]
                            ? fac.getNodeById($scope.nodeList, $scope.host[key])
                            : null;
                        if (node && node.text == text) {
                            fac.filterTree(
                                $scope.nodeList,
                                "id",
                                $scope.host[key],
                                false
                            );
                            $scope.dept = node;
                            app.park = $rootScope.park = node;
                            if ($scope.host.pid && $scope.host.pid != "0") {
                                var parentNode = fac.getNodeById(
                                    $scope.nodeList,
                                    $scope.host.pid
                                );
                                if (parentNode) {
                                    parentNode.nodes.forEach(function (n) {
                                        fac.setTreeState(n, "hide", false);
                                    });
                                } else {
                                    $scope.nodeList.forEach(function (n) {
                                        fac.setTreeState(n, "hide", false);
                                    });
                                }
                            } else {
                                $scope.nodeList.forEach(function (n) {
                                    fac.setTreeState(n, "hide", false);
                                });
                            }
                        } else if (text) {
                            fac.filterTree(
                                $scope.nodeList,
                                "text",
                                text,
                                false
                            );
                            delete $scope.host[key];
                        } else {
                            $scope.nodeList &&
                                $scope.nodeList.forEach(function (n) {
                                    fac.setTreeState(n, "hide", false);
                                    fac.setTreeState(n, "highLight", false);
                                });
                            delete $scope.host[key];
                        }
                    }
                });
            },
            link: function (scope, $element, $attrs) {
                //  $element[0].style.marginBottom = "450px";
                // $element[0].style.marginRight = "25px";
            },
        };
    });
    app.directive("houseSelector", function () {
        return {
            restrict: "E",
            scope: {
                formBean: "=",
                parkIdKey: "<?",
                isRequired: "@",
                isBuildUnrequired: "@",
                isUnitUnrequired: "@",
                isFloorUnrequired: "@",
                isHouseUnrequired: "@",
                needPark: "@",
                hasPark: "@",
                isDisabled: "@",
                readonlyPark:'@'
            },
            templateUrl: "/common/houseSelector.html",
            controller: function ($scope, $http) {
               
                 if($scope.isRequired){
                    if($scope.isBuildUnrequired){
                        $scope.isBuildUnrequired=true
                     }else{
                        $scope.isBuildUnrequired=false
                     }
                 } else{
                    $scope.isBuildUnrequired=true
                 }
                 if($scope.isRequired){
                    if($scope.isUnitUnrequired){
                        $scope.isUnitUnrequired=true
                     }else{
                        $scope.isUnitUnrequired=false
                     }
                 } else{
                    $scope.isUnitUnrequired=true
                 }
                 if($scope.isRequired){
                    if($scope.isFloorUnrequired){
                        $scope.isFloorUnrequired=true
                     }else{
                        $scope.isFloorUnrequired=false
                     }
                 } else{
                    $scope.isFloorUnrequired=true
                 }
                 if($scope.isRequired){
                    if($scope.isHouseUnrequired){
                        $scope.isHouseUnrequired=true
                     }else{
                        $scope.isHouseUnrequired=false
                     }
                 } else{
                    $scope.isHouseUnrequired=true
                 }
               
                
                $scope.parkIdKey = $scope.parkIdKey || "parkId";
                var formBean = $scope.formBean;
                var host = ($scope.host = {});
                host.stageId = formBean.stageId || formBean.stage_id;
                host.buildId =
                    formBean.buildId || formBean.floorId || formBean.floor_id;
                host.unitNo = formBean.unitNo || formBean.unit_no;
                host.groundNo = formBean.groundNo || formBean.ground_no;
                host.houseId = formBean.houseId || formBean.house_id;

                $scope.$watch("formBean.parkId", function (parkId, oldParkId) {
                    changePark(parkId, oldParkId);
                });
                $scope.$watch("formBean.park_id", function (parkId, oldParkId) {
                    changePark(parkId, oldParkId);
                });
                // begin cx  监听选项变换，清空位置惯用名
                $scope.$watch("host.stage", function (stage, oldStage) {
                  
                   if(oldStage && (stage!==oldStage)){
                        formBean.loc_simple_name=''
                        formBean.hasSimpleName = false;
                     }
                   
                });
                $scope.$watch("host.build", function (build, oldBuild) {
                   
                    if(oldBuild && (build !== oldBuild)){
                        formBean.loc_simple_name=''
                        formBean.hasSimpleName = false;
                    }
                   
                });
                $scope.$watch("host.unitNo", function (unitNo, oldUnitNo) {
                   
                    if(oldUnitNo && (unitNo !== oldUnitNo)){
                        formBean.loc_simple_name=''
                        formBean.hasSimpleName = false;
                    }
                   
                });
                $scope.$watch("host.groundNo", function (groundNo, oldGroundNo) {
                   
                    if(oldGroundNo && (groundNo !== oldGroundNo)){
                        formBean.loc_simple_name=''
                        formBean.hasSimpleName = false;
                    }
                   
                });
                $scope.$watch("host.houseId", function (houseId, oldhouseId) {
                   
                    if(oldhouseId && (houseId !== oldhouseId)){
                        var item =
                                            host.build.houseList &&
                                            host.build.houseList.filter(
                                                (item) => {
                                                    if (
                                                        item.id ==
                                                        houseId
                                                    ) {
                                                       
                                                        return item;
                                                    }
                                                }
                                            );
                                        if (item && item.length > 0) {
                                            formBean.loc_simple_name =
                                                item[0].rmShortName;
                                            if (formBean.loc_simple_name)
                                                formBean.hasSimpleName = true;
                                        }else{
                                            formBean.loc_simple_name=''
                                            formBean.hasSimpleName = false;
                    
                                        }
                    
                    }
                   
                });
  // end cx  监听选项变换，清空位置惯用名
                function changePark(parkId, oldParkId) {
                    if (parkId) {
                        if (parkId != oldParkId || !$scope.stageList) {
                            host.parkId = parkId;

                            /* $http.get("/ovu-base/system/park/stageList.do?parkId="+formBean.parkId).success(function (data) {
                                 $scope.stageList = data;
                             });*/
                            $http
                                .get("/ovu-base/system/park/stageList.do", {
                                    params: {
                                        parkId: parkId,
                                    },
                                })
                                .success(function (resp) {
                                    $scope.stageList = resp.data;
                                    if (host.stageId) {
                                        host.stage = $scope.stageList.find(
                                            function (n) {
                                                return n.id == host.stageId;
                                            }
                                        );
                                        if (
                                            host.stage &&
                                            host.stage.nodes &&
                                            host.buildId
                                        ) {
                                            host.build = host.stage.nodes.find(
                                                function (n) {
                                                    return n.id == host.buildId;
                                                }
                                            );
                                            if (host.build) {
                                                $scope.geneUnit(host.build);
                                                $scope.geneGround(host.build);
                                                $scope.getHouseList(host.build);
                                            }
                                        }
                                    }
                                });
                        }
                    } else {
                        delete host.parkId;
                        delete $scope.stageList;
                    }
                }

                //选择单元、楼层
                $scope.geneUnit = function (build) {
                    $scope.saveToForm();
                    if (!build) {
                        return;
                    }
                    build && (build.groundList = []);
                    var param = {
                        buildId: build.id || "",
                    };
                    $http
                        .get("/ovu-base/system/parkHouse/listUnitNo_mute.do", {
                            params: param,
                        })
                        .success(function (resp) {
                            build.unitList = resp.data;
                        });
                };

                $scope.geneGround = function (build) {
                    $scope.saveToForm();
                    if (!host.unitNo) {
                        build && (build.groundList = []);

                        return;
                    }
                    var param = {
                        buildId: build.id || "",
                        unitNo: host.unitNo,
                    };
                    $http
                        .get(
                            "/ovu-base/system/parkHouse/listGroundNo_mute.do",
                            {
                                params: param,
                            }
                        )
                        .success(function (resp) {
                            build.groundList = resp.data;
                        });
                };

                //选择房号
                $scope.getHouseList = function (build) {
                    $scope.saveToForm();
                    build &&
                        (build.houseList = []) &&
                        (formBean.hasSimpleName = false) &&
                        formBean.loc_simple_name &&
                        (formBean.loc_simple_name = "");
                    if (host.groundNo) {
                        $http
                            .get("/ovu-base/system/parkHouse/getHouses.do", {
                                params: {
                                    buildId: build.id,
                                    unitNo: host.unitNo,
                                    groundNo: host.groundNo,
                                },
                            })
                            .success(function (resp) {
                                build.houseList = resp.data;
                            });
                    }
                };
                $scope.saveToForm = function () {
                    if (host.stage) {
                        formBean.stage_id = formBean.stageId = host.stage.id;
                        if (host.build) {
                            formBean.floor_id = formBean.floorId = formBean.buildId =
                                host.build.id;
                            if (host.unitNo) {
                                formBean.unit_no = formBean.unitNo =
                                    host.unitNo;
                                if (host.groundNo) {
                                    formBean.ground_no = formBean.groundNo =
                                        host.groundNo;
                                    if (host.houseId) {
                                        formBean.houseId = formBean.house_id =
                                            host.houseId;
                                        var item =
                                            host.build.houseList &&
                                            host.build.houseList.filter(
                                                (item) => {
                                                    if (
                                                        item.id ==
                                                        formBean.houseId
                                                    ) {
                                                        // return n.rmShortName || ''
                                                        return item;
                                                    }
                                                }
                                            );
                                        if (item && item.length > 0) {
                                            formBean.loc_simple_name =
                                                item[0].rmShortName;
                                            if (formBean.loc_simple_name)
                                                formBean.hasSimpleName = true;
                                        }
                                    } else {
                                        formBean.houseId = formBean.house_id = undefined;
                                    }
                                } else {
                                    formBean.ground_no = formBean.groundNo = undefined;
                                    formBean.houseId = formBean.house_id = undefined;
                                }
                            } else {
                                formBean.unit_no = formBean.unitNo = undefined;
                                formBean.ground_no = formBean.groundNo = undefined;
                                formBean.houseId = formBean.house_id = undefined;
                            }
                        } else {
                            formBean.floor_id = formBean.floorId = formBean.buildId = undefined;
                            formBean.unit_no = formBean.unitNo = undefined;
                            formBean.ground_no = formBean.groundNo = undefined;
                            formBean.houseId = formBean.house_id = undefined;
                        }
                    } else {
                        formBean.stage_id = formBean.stageId = undefined;
                        formBean.floor_id = formBean.floorId = formBean.buildId = undefined;
                        formBean.unit_no = formBean.unitNo = undefined;
                        formBean.ground_no = formBean.groundNo = undefined;
                        formBean.houseId = formBean.house_id = undefined;
                    }
                };
            },
        };
    });

    app.directive("treeWorktype", function () {
        return {
            restrict: "E",
            scope: {
                nodeList: "=",
                pnode: "=",
                config: "<?",
            },
            templateUrl: "/view/workunit/treeWorktype.html",
            controller: function ($scope) {
                if (!$scope.config || !$scope.config.hasOwnProperty("edit")) {
                    $scope.config = {
                        edit: true,
                        sort: false,
                    };
                }
                $scope.selectNode = $scope.$parent.selectNode;
                $scope.sort = $scope.$parent.sort;
                $scope.undo = $scope.$parent.undo;
                $scope.save = $scope.$parent.save;
                $scope.delNode = $scope.$parent.delNode;
                $scope.addSubType = $scope.$parent.addSubType;
                $scope.editNode = $scope.$parent.editNode;
                $scope.setNode = $scope.$parent.setNode;
            },
        };
    });

    app.directive("treeEquip", function () {
        return {
            restrict: "E",
            scope: {
                nodeList: "=",
                pnode: "=",
                config: "=",
            },
            templateUrl: "/view/equipment/treeEquip.html",
            controller: function ($scope) {
                //$scope.config = $scope.$parent.config || { edit: true, sort: false };
                $scope.selectNode = $scope.$parent.selectNode;
                $scope.sort = $scope.$parent.sort;
                $scope.undo = $scope.$parent.undo;
                $scope.save = $scope.$parent.save;
                $scope.delNode = $scope.$parent.delNode;
                $scope.addSubType = $scope.$parent.addSubType;
                $scope.addBrandModel = $scope.$parent.addBrandModel;
                $scope.check = $scope.$parent.check;
                $scope.editNode = $scope.$parent.editNode;
            },
        };
    });

    app.directive("layerSelect", function () {
        return {
            restrict: "E",
            scope: {
                host: "=",
                nodeList: "=",
                selectMethod: "=",
                pnode: "=",
            },
            templateUrl: "/common/layerSelect.html",
            controller: function ($scope) {
                $scope.selectNode = $scope.$parent.selectNode;
                if ($scope.selectMethod) {
                    $scope.selectNode = $scope.selectMethod;
                }
            },
            link: function (scope, $element, $attrs) {
                $element[0].style.marginBottom = "10px";
                // $element[0].style.marginRight = "25px";
            },
        };
    });

    app.directive("layerSelector", function () {
        return {
            restrict: "E",
            scope: {
                need: "=",
                host: "=",
                hostKey: "=",
                hostText: "=",
                nodeList: "<?",
                leafOnly: "=",
                callback: "=",
                 tipText: "=",
            },
            templateUrl: "/common/layerSelector.html",
            controller: function ($scope, fac) {
                $scope.state = {};
                var key = $scope.hostKey;
                var leafOnly = $scope.leafOnly;
                if ($scope.host[key] && !$scope.host[$scope.hostText]) {
                    var flatList = fac.treeToFlat($scope.nodeList);
                    var node = flatList.find(function (n) {
                        return $scope.host[key] == n.id;
                    });
                    if (node) {
                        $scope.host[$scope.hostText] =
                            (node.ptexts ? node.ptexts + " > " : "") +
                            node.text;
                    }
                }
                $scope.selectNode = function (node, host) {
                    if (leafOnly && node.nodes && node.nodes.length) {
                        alert("请选择叶子节点！");
                        return;
                    }
                    if (angular.isDefined(node.id) && node.id != host[key]) {
                        host[key] = node.id;
                        host[$scope.hostText] =
                            (node.ptexts ? node.ptexts + " > " : "") +
                            node.text;
                        $scope.state.hover = $scope.state.focus = false;
                        $scope.callback && $scope.callback($scope.host, node);
                        //$scope.$apply();
                    }
                };
                $scope.clear = function () {
                    $scope.host[$scope.hostText] = "";
                    delete $scope.host[key];
                    $scope.callback && $scope.callback($scope.host);
                };
            },
            link: function (scope, $element, $attrs) {
                //  $element[0].style.marginBottom = "450px";
                // $element[0].style.marginRight = "25px";
            },
        };
    });

    app.directive("treeFilter", function () {
        return {
            restrict: "E",
            scope: {
                nodeList: "=",
            },
            templateUrl: "/common/treeFilter.html",
            controller: function ($scope, $rootScope, fac) {
                $scope.$watch("text", function (text, oldText) {
                    if (!$scope.nodeList) return;
                    fac.filterTree($scope.nodeList, "text", text, false);
                });
            },
        };
    });

    app.directive("treeSelector", function () {
        return {
            restrict: "E",
            scope: {
                need: "=",
                host: "=",
                tipText: "=",
                hostKey: "=",
                hostText: "=",
                nodeList: "=",
                leafOnly: "=",
                callback: "=",
				isHide :"="
            },
            templateUrl: "/common/selectorTree.html",
            controller: function ($scope, $rootScope, fac) {
                $scope.state = {};
                $scope.host = $scope.host || {};
                var key = $scope.hostKey;
                var leafOnly = $scope.leafOnly;
                if ($scope.host[key] && !$scope.host[$scope.hostText]) {
                    var flatList = fac.treeToFlat($scope.nodeList);
                    var node = flatList.find(function (n) {
                        return $scope.host[key] == n.id;
                    });
                    if (node) {
                        $scope.host[$scope.hostText] = node.text;
                    }
                }
                $scope.selectNode = function (node, host) {
                    fac.showTreeNode(
                        $scope.nodeList,
                        'text',
                        $scope.host[$scope.hostText],
                        false
                    );
                    if (leafOnly && node.nodes && node.nodes.length) {
                        alert("请选择叶子节点！");
                        return;
                    }
                    var oldNode = fac.getSelectedNode($scope.nodeList);
                    if (oldNode && oldNode != node) {
                        oldNode.state.selected = false;
                    }
                    node.state = node.state || {};
                    node.state.selected = true;

                    if (angular.isDefined(node.id) && node.id != host[key]) {
                        host[key] = node.id;
                        host.pid = node.pid;
                        //host[$scope.hostText] = (node.ptexts ? node.ptexts + " > " : "") + node.text;
                        host[$scope.hostText] = node.text;
                        $scope.state.hover = $scope.state.focus = false;
                        $scope.callback && $scope.callback($scope.host, node);
                        //$scope.$apply();
                    }
                };
                $scope.clear = function () {
                    $scope.host[$scope.hostText] = "";
                    delete $scope.host[key];
                    $scope.callback && $scope.callback($scope.host);
                };
                $scope.$watch("host." + $scope.hostText, function (
                    text,
                    oldText
                ) {
                    if (!$scope.nodeList) return;
                    if ($scope.host) {
                        var node = $scope.host[key]
                            ? fac.getNodeById($scope.nodeList, $scope.host[key])
                            : null;
                        var str = text && text.replace(/ /g, "");
                        if (
                            node &&
                            (node.text == text ||
                                (node.fullPath && str &&
                                    node.fullPath.split(">")[
                                        node.fullPath.split(">").length - 1
                                    ] ==
                                        str.split(">")[
                                            str.split(">").length - 1
                                        ]))
                        ) {
                            
                            fac.filterTree(
                                $scope.nodeList,
                                "id",
                                $scope.host[key],
                                false
                            );
                            if ($scope.host.pid && $scope.host.pid != "0") {
                                var parentNode = fac.getNodeById(
                                    $scope.nodeList,
                                    $scope.host.pid
                                );
                                if (parentNode) {
                                    parentNode.nodes.forEach(function (n) {
                                        fac.setTreeState(n, "hide", false);
                                    });
                                } else {
                                    $scope.nodeList.forEach(function (n) {
                                        fac.setTreeState(n, "hide", false);
                                    });
                                }
                            } else {
                                $scope.nodeList.forEach(function (n) {
                                    fac.setTreeState(n, "hide", false);
                                });
                            }
                        } else if (text) {
                      
                            // fac.filterTree(
                            //     $scope.nodeList,
                            //     "text",
                            //     text,
                            //     false
                            // );
                            fac.hideTreeNode(
                                $scope.nodeList,
                                "text",
                                text,
                                true
                            );
                            
                            delete $scope.host[key];
                        } else {
                            $scope.nodeList &&
                                $scope.nodeList.forEach(function (n) {
                                    fac.setTreeState(n, "hide", false);
                                });
                            delete $scope.host[key];
                        }
                    }
                });
            },
            link: function (scope, $element, $attrs) {
                //  $element[0].style.marginBottom = "450px";
                // $element[0].style.marginRight = "25px";
            },
        };
    });

    //树型的房屋选择器
    app.directive("buildSelector", function () {
        return {
            restrict: "E",
            scope: {
                host: "=",
                callback: "=",
            },
            templateUrl: "/common/buildSelector.html",
            controller: function ($scope, fac) {
                $scope.config = {
                    edit: false,
                };
                $scope.$watch("host.parkId", function (current, prev) {
                    if (
                        angular.isDefined(current) &&
                        (!angular.equals(current, prev) || !$scope.houseTree)
                    ) {
                        fac.getStageTree($scope, current);
                    }
                });
                $scope.selectNode = function (search, node) {
                    if (node.state.selected) {
                        $scope.curNode = node;
                        $scope.host.stageId = node.stageNo
                            ? node.id
                            : undefined;
                        $scope.host.buildId = $scope.host.floorId = node.buildNo
                            ? node.id
                            : undefined;
                        $scope.callback && $scope.callback();
                    } else {
                        delete $scope.curNode;
                        delete $scope.host.stageId;
                        delete $scope.host.floorId;
                        delete $scope.host.buildId;
                    }
                };
                $scope.clear = function () {
                    $scope.nodeText = "";
                    delete $scope.host[key];
                };
            },
            link: function (scope, $element, $attrs) {},
        };
    });

    app.directive("imageLoad", function () {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                element.bind("load", function () {
                    //call the function that was passed
                    scope.$apply(attrs.imageLoad);
                });
            },
        };
    });
    //区块空间树
    app.directive("blockTree", function () {
        return {
            restrict: "E",
            scope: {
                nodeList: "=",
                checkCallback: "<?",
                host: "<?",
                config: "<?",
                selectNode: "<?",
            },
            templateUrl: "/common/blockTree.html",
            controller: function ($scope, $rootScope, fac) {
                //勾选
                function defaultCheck(node) {
                    node.state = node.state || {};
                    node.state.checked = !node.state.checked;

                    function checkSons(node, status) {
                        node.state = node.state || {};
                        node.state.checked = status;
                        if (node.nodes && node.nodes.length) {
                            node.nodes.forEach(function (n) {
                                checkSons(n, status);
                            });
                        }
                    }

                    function uncheckFather(node) {
                        var father = $scope.flatTree.find(function (n) {
                            return n.id == node.pid;
                        });
                        if (father) {
                            father.state = father.state || {};
                            father.state.checked = false;
                            uncheckFather(father);
                        }
                    }
                    if (node.state.checked) {
                        checkSons(node, true);
                    } else {
                        checkSons(node, false);
                        uncheckFather(node);
                    }
                    $scope.checkCallback && $scope.checkCallback();
                }
                if (!$scope.config || !$scope.config.hasOwnProperty("edit")) {
                    $scope.config = {
                        edit: true,
                        sort: false,
                    };
                }

                $scope.flatTree = !$scope.$parent.nodeList
                    ? fac.treeToFlat($scope.nodeList)
                    : $scope.$parent.flatTree;
                $scope.selectNode =
                    $scope.selectNode || $scope.$parent.selectNode;
                $scope.sort = $scope.$parent.sort;
                $scope.undo = $scope.$parent.undo;
                $scope.save = $scope.$parent.save;
                $scope.delNode = $scope.$parent.delNode;
                $scope.moveNode = $scope.$parent.moveNode;
                $scope.addSon = $scope.$parent.addSon;
                $scope.check = $scope.$parent.check
                    ? $scope.$parent.check
                    : defaultCheck;
                $scope.editNode = $scope.$parent.editNode;
                var param = {};
                $.extend(param, {
                    currentPage: 1,
                    pageSize: 10000000,
                    deptId: $rootScope.dept.id,
                });
                fac.getPageResult(
                    "/ovu-base/pcos/person/findPerson_mute.do",
                    param,
                    function (data) {
                        $scope.personListBlock = data.data;
                    }
                );
            },
        };
    });
    //区块空间树-pro
    app.directive("blockTreePro", function () {
        return {
            restrict: "E",
            scope: {
                host: "<?",
                tipText: "=",
                config: "<?",
                hostKey: "<?",
                hostText: "<?",
                nodeList: "=",
                callback: "<?",
                clean: "<?",
            },
            templateUrl: "/common/blockTreePro.html",
            controller: function ($scope, $rootScope, fac) {
                $scope.state = {};
                $scope.host = $scope.host || {};
                $scope.hostKey = $scope.hostKey || "key";
                $scope.hostText = $scope.hostText || "text";
                var key = $scope.hostKey;

                //勾选
                function defaultCheck(node) {
                    node.state = node.state || {};
                    node.state.checked = !node.state.checked;

                    function checkSons(node, status) {
                        node.state = node.state || {};
                        node.state.checked = status;
                        if (node.nodes && node.nodes.length) {
                            node.nodes.forEach(function (n) {
                                checkSons(n, status);
                            });
                        }
                    }

                    function uncheckFather(node) {
                        var father = $scope.flatTree.find(function (n) {
                            return n.id == node.pid;
                        });
                        if (father) {
                            father.state = father.state || {};
                            father.state.checked = false;
                            uncheckFather(father);
                        }
                    }
                    if (node.state.checked) {
                        checkSons(node, true);
                    } else {
                        checkSons(node, false);
                        uncheckFather(node);
                    }
                    $scope.checkCallback && $scope.checkCallback();
                }
                if (!$scope.config || !$scope.config.hasOwnProperty("edit")) {
                    $scope.config = {
                        edit: true,
                        sort: false,
                    };
                }
                $scope.flatTree = !$scope.$parent.nodeList
                    ? fac.treeToFlat($scope.nodeList)
                    : $scope.$parent.flatTree;
                $scope.selectNode =
                    $scope.selectNode || $scope.$parent.selectNode;
                $scope.sort = $scope.$parent.sort;
                $scope.undo = $scope.$parent.undo;
                $scope.save = $scope.$parent.save;
                $scope.delNode = $scope.$parent.delNode;
                $scope.moveNode = $scope.$parent.moveNode;
                $scope.addSon = $scope.$parent.addSon;
                $scope.check = $scope.$parent.check
                    ? $scope.$parent.check
                    : defaultCheck;
                $scope.editNode = $scope.$parent.editNode;
                $scope.$watch("host." + $scope.hostKey, function (id, oldId) {
                    if ($scope.host[key] && !$scope.host[$scope.hostText]) {
                        var flatList = fac.treeToFlat($scope.nodeList);
                        var node = flatList.find(function (n) {
                            return (
                                $scope.host[key] == n.id ||
                                $scope.host[key] == n.ID
                            );
                        });
                        if (node) {
                            node.state = node.state || {};
                            node.state.selected = true;
                            $scope.host[$scope.hostText] = node.text;
                            $scope.callback &&
                                $scope.callback($scope.host, node);
                        }
                    }
                });

                $scope.selectNode = function (node, host) {
                    var list = fac.treeToFlat($scope.nodeList);
                    list.forEach(function (n) {
                        if (n.state && n.state.selected && n != node) {
                            n.state.selected = false;
                        }
                    });

                    node.state = node.state || {};
                    node.state.selected = true;

                    if (
                        (angular.isDefined(node.id) && node.id != host[key]) ||
                        (angular.isDefined(node.ID) && node.ID != host[key])
                    ) {
                        host[key] = node.id || node.ID;
                        host.pid = node.pid;
                        //host[$scope.hostText] = (node.ptexts ? node.ptexts + " > " : "") + node.text;
                        host[$scope.hostText] = node.text;
                        $scope.state.hover = $scope.state.focus = false;
                        $scope.callback && $scope.callback($scope.host, node);
                        //$scope.$apply();
                    }
                };
                $scope.clear = function () {
                    $scope.host[$scope.hostText] = "";
                    delete $scope.host[key];
                    $scope.clean && $scope.clean($scope.host);
                };
                $scope.$watch("host." + $scope.hostText, function (
                    text,
                    oldText
                ) {
                    if (!$scope.nodeList) return;
                    if ($scope.host) {
                        var node = $scope.host[key]
                            ? fac.getNodeById($scope.nodeList, $scope.host[key])
                            : null;
                        if (node && node.text == text) {
                            fac.filterTree(
                                $scope.nodeList,
                                "id",
                                $scope.host[key],
                                false
                            );
                            $scope.dept = node;
                            app.park = $rootScope.park = node;
                            if ($scope.host.pid && $scope.host.pid != "0") {
                                var parentNode = fac.getNodeById(
                                    $scope.nodeList,
                                    $scope.host.pid
                                );
                                if (parentNode) {
                                    parentNode.nodes.forEach(function (n) {
                                        fac.setTreeState(n, "hide", false);
                                    });
                                } else {
                                    $scope.nodeList.forEach(function (n) {
                                        fac.setTreeState(n, "hide", false);
                                    });
                                }
                            } else {
                                $scope.nodeList.forEach(function (n) {
                                    fac.setTreeState(n, "hide", false);
                                });
                            }
                        } else if (text) {
                            fac.filterTree(
                                $scope.nodeList,
                                "text",
                                text,
                                false
                            );
                            delete $scope.host[key];
                        } else {
                            $scope.nodeList &&
                                $scope.nodeList.forEach(function (n) {
                                    fac.setTreeState(n, "hide", false);
                                    fac.setTreeState(n, "highLight", false);
                                });
                            delete $scope.host[key];
                        }
                    }
                });
            },
            link: function (scope, $element, $attrs) {
                //  $element[0].style.marginBottom = "450px";
                // $element[0].style.marginRight = "25px";
            },
        };
    });

    //楼层图纸
    app.directive("indoorMap", function () {
        return {
            restrict: "E",
            scope: {
                file: "=",
            },
            templateUrl: "/common/indoorMap.html",
            controller: function ($scope) {
                var file = $scope.file;
                if (file && file.indexOf("http") == -1) {
                    file = "/ovu-base" + file;
                }
                //              file = "/res/xwMap/2f.geojson";
                var map; //地图
                // 地图配置
                /*var mapList = [
                        {
                            "name": "楼层图纸",
                            "mapUrl": file
                        }
                   ]*/
                var dom = document.getElementById("canvas");
                dom.style.maxHeight = "380px";

                AirocovMap.Config.set({
                    showViewMode: "MODE_3D",
                    zoom: 3,
                });
                var map = new AirocovMap.Map({
                    container: document.getElementById("canvas"),
                    themeUrl: "/res/xwMap/fillcolor.json",
                    logoSrc: "",
                    mapList: [
                        {
                            name: "楼层图纸",
                            mapUrl: file,
                        },
                    ],
                });
                //window.map = map;
            },
        };
    });

    app.directive("ensureUnique", [
        "$http",
        function ($http) {
            return {
                require: "ngModel",
                link: function (scope, ele, attrs, c) {
                    scope.$watch(attrs.ngModel, function (v) {
                        if (!v) {
                            return;
                        }
                        if (attrs.ensureUnique == "idno") {
                            if (!IdCardValidate(v)) {
                                c.$setValidity("pattern", false);
                                return;
                            } else {
                                c.$setValidity("pattern", true);
                            }
                        }
                        var pack = {
                            id: attrs.id,
                            deptId: attrs.deptId,
                        };
                        pack[attrs.ensureUnique] = v;
                        $http({
                            method: "POST",
                            url: attrs.api,
                            params: pack,
                        })
                            .success(function (data, status, headers, cfg) {
                                c.$setValidity("unique", data.isUnique);
                            })
                            .error(function (data, status, headers, cfg) {
                                c.$setValidity("unique", false);
                            });
                    });
                },
            };
        },
    ]);

    
    // table-select
    app.directive("tableSelector", function () {
        return {
            restrict: "E",
            scope: {
                need: "=",
                host: "=",
                hostUrl: "=",
                hostText: "=",
                hostStyle: "=",
                nodeList: "<?",
                leafOnly: "=",
                callback: "=",
            },
            templateUrl: "/common/tableSelector.html",
            controller: function ($scope, fac) {
                $scope.state = {};
                var url = $scope.hostUrl || "";
                $scope.pageModel = {};
                $scope.find = function (pageNo) {
                    $.extend($scope.host, {
                        currentPage: pageNo || $scope.pageModel.currentPage || 1,
                        pageSize: $scope.pageModel.pageSize || 10
                    });
                    fac.getPageResult(url, $scope.host, function (data) {
                        $scope.pageModel = data;
                    });
                };
                $scope.query = function (params) {
                    $scope.find(1);
                }
                // 输入
                $scope.change = function (params) {
                    $scope.callback && $scope.callback({name: params,type:"input"});
                    if(!params) {
                        $scope.find(1);
                    }
                }
                // 选择
                $scope.check = function (params) {
                    if(params) {
                        $scope.host[$scope.hostText] = params[$scope.hostText]
                        $.extend(params,{type:"check"})
                        $scope.callback && $scope.callback(params);
                        $scope.state.focus = false;
                    }
                }
                $scope.clear = function () {
                    $scope.host[$scope.hostText] = ""; 
                    if($scope.state.focus) {
                        $scope.find(1);
                    }
                    $scope.callback && $scope.callback({});
                };
            },
            link: function (scope, $element, $attrs) {
                //  $element[0].style.marginBottom = "450px";
                // $element[0].style.marginRight = "25px";
            },
        };
    });

    app.factory("httpInterceptor", [
        "$log",
        "$q",
        "$location",
        "$rootScope",
        function ($log, $q, $location,$rootScope) {
            var layerIndex;
    
            var arr=[]
            var httpInterceptor = {
                responseError: function (response) {
                    layer.close(layerIndex);

                    if (response.status == 401) {
                        top.location.href = "/";
                        return $q.reject(response);
                    } else if (response.status == 403) {
                        confirm("会话已失效，请重新登录！", function (index) {
                            window.location.href = "/";
                        });
                        return $q.reject(response);
                    } else if (response.status == 901) {
                        window.location.href = "http://www.cttic.cc";
                        return $q.reject(response);
                    } else if (response.status === 404) {
                        alert("404!");
                        return $q.reject(response);
                    } else if (response.status === 500) {
                        alert("500!");
                        /*  $("#ajaxBody").removeClass("hide");
                      //异步加载模式
                      $("#ajaxBody").load("/view/error/500.html", function (response, status, xhr) {
                          if (status == "error") {
                              $(this).html(response);
                          }
                      });*/
                        return $q.reject(response);
                    }
                },
                response: function (response) {
                    var url = response.config && response.config.url;
                    if (
                        /_mute/.test(url) ||
                        /.html/.test(url) ||
                        /.svg/.test(url) ||
                        /getNewWorkunit.do/.test(url)
                    ) {
                        return response;
                    }
                    if (
                        response.config.data &&
                        response.config.data.hasOwnProperty("config")
                    ) {
                        return response;
                    }
                    // 以下代码为了解决当列表数据还未返回时，load 动画已经关闭了 by Cx
                    arr.splice(arr.indexOf(url),1)
             
                
                    if(arr.length==0  ){
                        layer.close(layerIndex);
                    }
                   
                    return response;
                },
                request: function (config) {
                    var url = config.url;
              
                    var contentType = config.headers["Content-Type"];
                    //form data parse data to string
                    if (contentType == "form") {
                        config.headers["Content-Type"] =
                            "application/x-www-form-urlencoded; charset=UTF-8";
                        if (angular.isDefined(config.data)) {
                            config.data = angular.element.param(config.data);
                        }
                      
                    }
                    if (/.html/.test(url)) {
                        if (
                            url.indexOf("/") > -1 &&
                            url.indexOf("uib/") == -1
                        ) {
                            config.url +=
                                (url.indexOf("?") > -1 ? "&" : "?") +
                                "t=" +
                                Date.now();
                        }
                        return config;
                    } else if (
                        /_mute/.test(url) ||
                        /.svg/.test(url) ||
                        /getNewWorkunit.do/.test(url) ||
                        /getSwitchStatus/.test(url)
                    ) {
                        return config;
                    }
                     // 以下代码为了解决当按住esc 退出键时，当前页面的load关闭，其他页面的请求load 也关闭 by Cx
                    if(layerIndex==$rootScope.$escLayIndex){
                        arr=[]
                      }
                      //cx end
                    arr.push(url)
                    layerIndex = layer.load(1, {
                        shade: [0.2, "#000"], //0.1透明度的白色背景
                    });
                    return config;
                },
                //  'requestError' : function(config){         ......         return $q.reject(config);       }
            };
            return httpInterceptor;
        },
    ]);

    app.config([
        "$httpProvider",
        function ($httpProvider) {
            var explorer = window.navigator.userAgent;
            //ie,如果为ie，则强制清除缓存。规避ie的get方法强行缓存的坑
            if (
                (explorer.toLowerCase().indexOf("trident") > -1 &&
                    explorer.indexOf("rv") > -1) ||
                explorer.indexOf("MSIE") >= 1
            ) {
                if (!$httpProvider.defaults.headers.get) {
                    $httpProvider.defaults.headers.get = {};
                }

                // Answer edited to include suggestions from comments
                // because previous version of code introduced browser-related errors

                //disable IE ajax request caching
                $httpProvider.defaults.headers.get["If-Modified-Since"] =
                    "Mon, 26 Jul 1997 05:00:00 GMT";
                // extra
                $httpProvider.defaults.headers.get["Cache-Control"] =
                    "no-cache";
                $httpProvider.defaults.headers.get["Pragma"] = "no-cache";
            }

            $httpProvider.interceptors.push("httpInterceptor");
        },
    ]);

    app.factory("fac", function (
        $http,
        $q,
        $rootScope,
        $uibModal,
        $compile,
        $ocLazyLoad
    ) {
        var dicts = {
            statusList: [
                ["", "在职"],
                [1, "在职"],
                [2, "停薪留职"],
                [3, "离职"],
            ],
            job_statusDict: [
                [1, "在职"],
                [2, "停薪留职"],
                [3, "离职"],
            ],
            personChangeDict: [
                [0, "入职"],
                [1, "调岗"],
                [2, "停薪留职"],
                [3, "离职"],
            ],
            sourceDict: [
                [1, "系统后台"],
                [2, "员工APP"],
                [3, "业主APP"],
                [4, "传感器异常"],
                [5, "园区通"],
                [7, "巡查报事"],
                [8, "高校"],
            ],
            sourceLog: [
                [1, "员工"],
                [2, "主任"],
            ],
            groupDict: [
                [2, "集团"],
                [3, "项目"],
            ],
            yesNoDict: [
                [1, "是"],
                [2, "否"],
            ],
          
            valTypeDict: [
                [1, "文本"],
                [2, "数值"],
                [3, "选择"],
            ],
            sensorDataDict: [
                [1, "数值"],
                [2, "离散状态"],
            ],
            operTypeDict: [
                ["1", "照片"],
                ["2", "文本"],
                ["3", "选择"],
                ["x", "扫描"],
            ],
            eventTypeDict: [
                // [0, "自检"],
                // [1, "代客"],
                // [2, "热线电话报事"],
                // [3, "维保报事"],
                // [4, "其他报事"],
                // [8, "传感器异常报事"],
                // [9, "自发派单"],
                [0, "公共报事"],
                [1, "代业主报事"],
                [3, "设备设施报事"],
                [4, "其他报事"],
                [8, "传感器异常报事"],
               
            ],
            emerUnitDict: [
                [0, "公共报事"],
                [1, "代业主报事"],
                [3, "设备设施报事"],
            ],
            superviseStatusDict: [
                [0, "待督办"],
                [1, "已督办"],
            ],
            workunitTypeDict: [
                [1, "计划"],
                [2, "应急"],
            ],
            importantLevelDict: [
                [0, "低"],
                [1, "中"],
                [2, "高"],
            ],
            periodDict: ["年", "季", "月", "周", "日", "时"],
            frequencyDict: [
                [1, "每周"],
                [2, "每月"],
                [3, "每年"]
            ],
            frequencyDictDetail: [
                [1, ""],
                [2, "日"],
                [3, "月"]
            ],
            

         approvalStatusDict:[
            // [0, "未审批"],
            // [1, "审批中"],
            // [2, "审批已通过"],
            // [3, "审批已拒绝"],
            [0, "审批已通过"],
            [1, "审批中"],
            [2, "未审批"],
            [3, "审批已拒绝"],
         ],
            
           
            
        
            isClosedDict: [
                [0, "待处理"],
                [1, "已关闭"],
            ],
            unitStatusDict: [
                [0, "待派单"],
                [1, "待接单"],
                [4, "已退回"],
                [5, "待执行"],
                [7, "待评价"],
                [8, "已关闭"],
                [9, "全部"],
            ],
            workStatusDict: [
                [0, "待派发"],
                [1, "已派发"],
                [4, "已退回"],
                [5, "已接单"],
                [7, "已执行"],
                [8, "已评价"],
            ],
            workStatusArr: [
                [0, "已报工单"],
                [1, "已派发"],
                [4, "已报工单"],
                [5, "已接单"],
                [7, "已执行"],
                [8, "已评价"],
            ],
            newWorkStatus: [
                ["11", "待派单"],
                ["21", "待接单"],
                ["22", "待执行"],
                ["31", "待评价"],
                ["41", "待督办"],
                ["51", "已关闭"],
            ],
            unitStatisticsStatus: [
                [1, "未接单"],
                [5, "已接单"],
                [7, "已执行"],
                [8, "已评价"],
            ],
            equipStatusDict: [
                [1, "运行"],
                [2, "停用"],
                [3, "故障"],
                [4, "报废"],
            ],
            equipTypeDict: [
                ["elevator", "电梯"],
                ["camera", "摄像头"],
                ["equipmentRoom", "设备房"],
                ["sensor", "传感器"],
                ["energy", "仪表"],
                ["lora", "基站"],
                ["distribution", "配电柜"],
            ],
            dapingTypeDict: [
                ["elevator", "电梯"],
                //['camera', "摄像头"],使用ems的分类
                ["camera_pole", "摄像机杆"],
                ["rfid", "RFID"],
                ["parkingLot", "停车场"],
                ["waterMeter", "水表"],
                ["ammeter", "电表"],
                ["energy", "能源表"],
                ["space", "空间"],
                ["assets", "资产"],
                ["company", "企业"],
                ["ad", "广告位"],
                ["temperature", "   温湿度传感器"],
                ["infrared", "  红外传感器"],
                ["gate", "  门禁传感器"],
                ["smoke", " 烟感传感器"],
                ["waterLevel", "    液位传感器"],
                ["pressure", "  压力传感器"],
                ["current", "   电流阈值传感器"],
                ["electric", "  电参数综合传感器"],
                ["greening", "绿化"],
                ["patrol", "巡更"],
            ],
            profileTypeDict: [
                [1, "枪机"],
                [2, "球机"],
                [3, "半球机"],
            ],
            signalTypeDict: [
                [1, "模拟信号"],
                [2, "数字信号"],
            ],

            relStatusDict: [
                [0, "未发布"],
                [1, "已发布"],
            ],
            buildTypeDict: [
                ["1", "工业"],
                ["2", "公共"],
                ["3", "民用"],
                ["4", "住宅"],
                ["5", "办公"],
                ["6", "办公及商业"],
                ["7", "商业"],
            ],
            directionDict: [
                [1, "东"],
                [2, "南"],
                [3, "西"],
                [4, "北"],
                [5, "东南"],
                [6, "东北"],
                [7, "西南"],
                [8, "西北"],
            ],
            yetaiDict: [
                ["SY", "商业"],
                ["SX", "商业写字楼"],
                ["SZ", "商业住宅"],
                ["XZ", "写字楼"],
                ["PZ", "普通住宅"],
                ["BZ", "别墅住宅"],
                ["YQ", "产业园区"],
                ["ZL", "展览馆"],
            ],
            supplierDict: [
                [1, "国有企业"],
                [2, "集体企业"],
                [3, "私营企业"],
                [4, "其他"],
            ],
            checkTypeDict: [
                [1, "是否达标"],
                [2, "评分"],
            ],
            pointTypeDict: [
                [1, "室内"],
                [2, "室外"],
                [3, "地库"],
            ],
            insTypeDict: [
                [1, "视频巡查"],
                [2, "人工巡查"],
            ],
            messageTypeDict: [
                [1, "通知 "],
                [2, "报表"],
            ],
            messageStateDict: [
                [0, "未发送 "],
                [1, "已发送"],
            ],
            messageViewDict: [
                ['0', "未查看 "],
                ['1', "已查看"],
            ],
            auditingStatusDict: [
                [0, "未审核 "],
                [1, "审核不通过"],
                [2, "审核通过"],
            ],
            contractStatusDict: [
                [0, "未提交 "],
                [1, "已提交"],
            ],
            execStatusDict: [
                [1, "未执行"],
                [2, "已执行"],
            ],
            fireWorkTypeDict: [
                [1, "火警"],
                [2, "误报"],
            ],
            fireWorkStatusDict: [
                [1, "待推送"],
                [2, "已推送"],
                [3, "执行中"],
                [4, "已解决"],
            ],
            evaluateScoreDict: [
                [1, "★"],
                [2, "★★"],
                [3, "★★★"],
                [4, "★★★★"],
                [5, "★★★★★"],
            ],
            exp_projectTypeDict: [
                [1, "前期物业"],
                [0, "成熟楼盘"],
            ],
            exp_positionGradeDict: [
                [2, "高"],
                [1, "中"],
                [0, "低"],
            ],
            checkwaysDict: [
                [1, "盘点"],
                [2, "观感查验"],
                [3, "检测"],
            ],
            takingStateDict: [
                [0, "未立项"],
                [1, "承接中断"],
                [2, "承接成功"],
                [3, "承接失败"],
                [4, "承接进行中"],
            ],
            measureUnit: [
                [1, "m³"],
                [2, "kW·h"],
            ],
            inputType: [
                [1, "计量点抄表数据导入"],
                [2, "分户数据导入"],
            ],
            chargeInputType: [
                [1, "计量点计费数据导入"],
                [2, "分户计费数据导入"],
            ],
            isArrearage: [
                //是否欠费
                [1, "是"],
                [0, "否"],
            ],
            isMeterBuild: [
                // 仪表是否已建档
                [0, "否"],
                [1, "是"],
            ],
            tabAttributes: [
                //表属性
                [1, "进线表"],
                [2, "母联表"],
                [3, "配电柜回路表"],
                [4, "变压器检测终端"],
            ],
            currentYear: [
                [
                    new Date().getFullYear() - 2,
                    "" + new Date().getFullYear() - 2,
                ],
                [
                    new Date().getFullYear() - 1,
                    "" + new Date().getFullYear() - 1,
                ],
                [new Date().getFullYear(), "" + new Date().getFullYear()],
            ],
            insRateDict: [
                [1, "年"],
                // [2,"季"],
                [3, "月"],
                [4, "周"],
                [5, "日"],
                [6, "时"],
                [7, "分"],
                [8, "秒"],
            ],
            sourceType: [
                [1, "数据库"],
                [2, "http"],
            ],
            dbType: [
                ["mysql", "mysql"],
                ["oracle", "oracle"],
                ["sqlserver", "sqlserver"],
            ],
            isFictitious: [
                [1, "是"],
                [2, "否"],
            ],
            imosTypeDict: [
                [1, "宇视监控"],
                [2, "海康卫视"],
            ],
            videoTypeDict: [
                [0, "不可用"],
                [1, "可用"],
            ],
            maintenanceDict: [
                ["1,2", "全部"],
                ["1", "周期性保养"],
                ["2", "临时性维修"],
            ],
            playsourceTypeDict: [
                [0, "未打开"],
                [2, "已打开"],
                [3, "故障"],
                [4, "故障"],
            ],
            playTypeDict: [
                [0, "关闭"],
                [1, "打开失败"],
                [2, "打开"],
            ],
            transformStatusDict: [
                [0, "正常"],
                [1, "cpu满载"],
                [2, "带宽满载"],
                [3, "cpu和带宽满载"],
                [4, "cpu和带宽满载"],
                [5, "cpu和内存满载"],
                [6, "带宽和内存满载"],
                [7, "带宽和内存满载"],
                [8, "异常"],
            ],
            // imosStatusDict:[
            //     [0, "正常"],
            //     [4, "摄像机不在线"],
            //     [7,"摄像机不在线"],
            //     [3, "摄像机不在线"],
            //     [5, "摄像机不在线"],
            //     [1,"摄像机不存在"],
            //     [2,"摄像机不存在"],
            //     [6,"摄像机不存在"],
            //     [8,"摄像机不存在"],
            //     [9,"摄像机不存在"]
            // ]
            parklotPasswayDict: [
                [1, "优惠放行"],
                [2, "异常放行"],
                [3, "免费放行"],
                [4, "现金放行"],
                [5, "储值卡放行"],
                [6, "月卡放行"],
                [7, "POS支付"],
                [8, "线上支付"],
            ],
            parklotCarTypeDict: [
                [1, "VIP车"],
                [2, "月卡车"],
                [3, "临时车"],
                [4, "其它"],
            ],
            parklotCarCardTypeDict: [
                [1, "VIP"],
                [2, "月租"],
                [3, "充值"],
                [4, "时租（上班族）"],
                [5, "产权车"],
                [6, "计次车"],
            ],
            parklotMonthCardTypeDict: [
                [1, "80月卡"],
                [2, "120月卡"],
                [3, "150月卡"],
            ],
            screenconfType: [
                [1, "时间间隔"],
                [2, "固定时间"],
            ],
            screenConfStatusType: [
                [0, "暂停"],
                [1, "启动"],
            ],
            opType: [
                [0, "自动"],
                [1, "实时"],
            ],
            relationStatusList: [
                [0, "上游"],
                [1, "中游"],
                [2, "下游"],
                [-1, "无"],
            ],
            chainDomainCodeList: [
                ["A", "A"],
                ["B", "B"],
                ["C", "C"],
                ["D", "D"],
                ["E", "E"],
                ["F", "F"],
                ["G", "G"],
                ["H", "H"],
                ["I", "I"],
                ["J", "J"],
                ["K", "K"],
                ["L", "L"],
                ["M", "M"],
                ["N", "N"],
                ["O", "O"],
                ["P", "P"],
                ["Q", "Q"],
                ["R", "R"],
                ["S", "S"],
                ["T", "T"],
                ["U", "U"],
                ["V", "V"],
                ["W", "W"],
                ["X", "X"],
                ["Y", "Y"],
                ["Z", "Z"],
            ],
            renterTypeList: [
                [0, "运营方"],
                [1, "个人"],
                [2, "企业"],
                [3, "员工"],
            ],
            parkareaStatusList: [
                [1, "中电产业园内"],
                [2, "中电产业园外"],
            ],
            companyOfficeList: [
                [0, "董事长"],
                [1, "总经理"],
                [2, "经理"],
                [3, "职员"],
            ],
            accountTypeList: [
                [2, "企业"],
                [1, "个人"],
                [3, "员工"],
            ],
            enterpriseList: [
                [1, "国企"],
                [2, "民企"],
                [3, "上市公司"],
                [4, "事业单位"],
                [5, "股份制公司"],
            ],
            confirmStatusList: [
                [0, "待认证"],
                [1, "通过"],
                [2, "未通过"],
            ],
            personPermissionList: [[1, "个人"]],
            staffPermissionList: [
                [1, "个人"],
                [3, "员工"],
            ],
            enterprisePermissionList: [
                [1, "个人"],
                [2, "企业"],
            ],
            isScreenSonfDict: [
                [0, "未设置"],
                [1, "已设置"],
            ],
            photoType: [
                [0, "策略抓拍"],
                [1, "门禁抓拍"],
                [2, "视频巡查"],
                ["0,1,2", "全部类型"],
            ],
            photoTypeDic: [
                [0, "策略抓拍"],
                [1, "门禁抓拍"],
                [2, "视频巡查"],
            ],
            RoleTypeDict: [
                [1, "业主"],
                [2, "亲属"],
                [3, "租户"],
                // [4, "未分配角色"],
            ],
            RoleTypeDict2: [
                [0, "未分配角色"],
                [1, "业主"],
                [2, "亲属"],
                [3, "租户"],
            ],
            relationRoleDict: [
                [0, "父母"],
                [1, "子女"],
                [2, "其他"],
            ],
            dateList: [
                [0, "年"],
                [1, "月"],
                [2, "日"],
            ],
            subjectTypeDict: [
                [1, "单选题"],
                [2, "多选题"],
                [3, "判断题"],
                [4, "填空题"],
                [5, "问答题"],
            ],
            numToWord: [
                [1, "一"],
                [2, "二"],
                [3, "三"],
                [4, "四"],
                [5, "五"],
            ],
            snapStatusDict: [
                [1, "成功"],
                [2, "失败"],
                [3, "未开始重试"],
            ],
            planStatusDict: [
                [1, "未开始"],
                [2, "已开始"],
                [3, "已结束但未完成"],
                [4, "已完成"],
            ],
            facePurposeDict: [
                [0, "其他"],
                [1, "面试"],
                [2, "商务"],
                [3, "亲友"],
                [4, "快递送货"],
            ],
            devSpeedDict: [
                [0, "自动"],
                [1, "高风速"],
                [2, "中风速"],
                [3, "低风速"],
            ],
            devModeDict: [
                [0, "制冷"],
                [1, "制暖"],
                [2, "吹风"],
            ],
            operationStatusDic: [
                // 1:在业 2:存续 3:吊销 4:注销 5:迁出 6.迁入 7.停业 8.清算
                [1, "在业"],
                [2, "存续"],
                [3, "吊销"],
                [4, "注销"],
                [5, "迁出"],
                [6, "迁入"],
                [7, "停业"],
                [8, "清算"],
            ],
            enterStatusDic: [
                [1, "已入驻"],
                [2, "未入驻"],
                [3, "迁出"],
            ],
            jobDic: [
                [1, "总经理"],
                [2, "董事长"],
                [3, "经理"],
                [4, "职员"],
            ],
            boundStatusDic: [
                ["", "全部"],
                [0, "出库"],
                [1, "入库"],
            ],
            collectionStatus: ["完好", "残缺"],
            unit: [
                "光谷联合集团",
                "紫缘艺术品公司",
                "合美术馆",
                "丽岛科技",
                "其他",
            ],
            jurisdiction: [
                [0, "未授权"],
                [1, "已授权"],
            ],
            reservationChannel: [
                {
                    key: 0,
                    value: "全部",
                },
                {
                    key: 1,
                    value: "微信",
                },
                {
                    key: 2,
                    value: "WEB",
                },
                {
                    key: 3,
                    value: "二维码",
                },
            ],
            callBackTypes: [
                [1, "电话回访"],
                [2, "上门回访"],
                [3, "短信回访"],
                [4, "微信回访"],
                [9, "其他回访"],
            ],
            ybType: [
                [1, "预付费"],
                [2, "后付费"],
            ],
            weekType: [
                [0, "日"],
                [1, "一"],
                [2, "二"],
                [3, "三"],
                [4, "四"],
                [5, "五"],
                [6, "六"],
            ],
            signStatus: [
                ["-1", "未排班"],
                ["0", "未开始"],
                ["1", "正常"],
                ["2", "迟到"],
                ["3", "早退"],
                ["4", "迟到且早退"],
                ["5", "缺勤"],
                ["6", "休息"],
                ["7", "拟加班"],
                ["8", "加班"],
            ],
            toInvoiceStr: [
                [0, "增值税（普）"],
                [1, "增值税（专）"],
                [2, "发票"],
                [3, "收据"],
                [4, "无票据"],
            ],
            approveStatus: [
                [0, "已保存"],
                [1, "待审批"],
                [2, "审批通过"],
                [3, "审批不通过"],
            ],
            toInvoiceStatusStr: [
                [0, "已驳回"],
                [1, "待审批"],
                [2, "已审批"],
                [3, "退款中"],
                [4, "已退款"],
            ],
            toInvoiceTypeStr: [
                [0, "收款"],
                [1, "退款"],
            ],
            maritalDict: [
                [0, "未婚"],
                [1, "已婚"],
            ],
            fsDict:[
              {id:1,name:'基础空间'},
              {id:2,name:'拆分空间'},
              {id:3,name:'合并空间'}
                
            ],
            personRoleType:[
             
                [1, "学生"],
                [2, "教职工"]
                
            ],
            isAnwserTyle:[
                [0,'未回复'],
                [1,'已回复']
               
            ],
            goodsStatusType_xw:[
                [0,'未寻回'],
                [1,'已寻回']
            ],
            goodsStatusType_sw:[
                [0,'未认领'],
                [1,'已认领']
            ],
            infoStatusType:[
                [0,'显示中'],
                [1,'已屏蔽']
            ]

        };
        angular.extend($rootScope, dicts);

        //有关park的缓存，减少io请求,统一获取项目树的方法
        var parkCache = {
            parkTree: undefined, //集团版项目树，包含实体项目
            parkTreePersonal: undefined, //项目版项目树，仅包含实与用户相关联的项目，包含实体项目
            parkTypeTree: undefined, ////集团版项目树，不包含实体项目
            parkTypeTreePersonal: undefined, //项目版项目树，仅包含实与用户相关联的项目，不包含实体项目
            parkTreeFlat: undefined, //平铺parkTree,作为字典使用
            parkTreePersonalFlat: undefined, ////平铺parkTreePersonal,作为字典使用
        };

        function getParkTree(parkType, groupType) {
            var isGroup = groupType || app.curModule.isGroup;
            //集团版
            if (isGroup == 2) {
                if (parkType == 0) {
                    return $.extend(true, [], parkCache.parkTypeTree);
                } else {
                    return $.extend(true, [], parkCache.parkTree);
                }
            } else {
                //项目版
                if (parkType == 0) {
                    return $.extend(true, [], parkCache.parkTypeTreePersonal);
                } else {
                    return $.extend(true, [], parkCache.parkTreePersonal);
                }
            }
        }

        function isHasImg(pathImg) {
            var ImgObj = new Image();
            ImgObj.src = pathImg;
            if (
                ImgObj.fileSize > 0 ||
                (ImgObj.width > 0 && ImgObj.height > 0)
            ) {
                return true;
            } else {
                return false;
            }
        }

        function upload(options, fn) {
            if (typeof options.params != "object") {
                options.params = {};
            }
            if (!options.url) {
                options.url = "/ovu-base/uploadImg.do";
            }
            var index;
            if (options.nowait) {
                options.onSubmit = function () {};
            } else {
                options.onSubmit = function () {
                    index = layer.load(1, {
                        shade: [0.2, "#000"], //0.1透明度的白色背景
                    });
                };
            }
            options.onComplate = function (data) {
                layer.close(index);
                if (Array.isArray(data)) {
                    fn && fn(data);
                } else if ("object" == typeof data) {
                    if (data.success || data.status == 1 || data.code == 0) {
                        fn && fn(data);
                    } else {
                        layer.alert(data.error || data.msg || "上传发生错误!", {
                            btn: ["ok"],
                            title: false,
                        });
                    }
                } else if (
                    "string" == typeof data &&
                    data.indexOf("url") != -1
                ) {
                    data = JSON.parse(data);
                    if (data.success || data.status == 1 || data.code == 0) {
                        fn && fn(data);
                    } else {
                        layer.alert(data.error || data.msg || "上传发生错误!", {
                            btn: ["ok"],
                            title: false,
                        });
                    }
                } else {
                    layer.alert("发生错误:" + data, {
                        btn: ["ok"],
                        title: false,
                    });
                }
            };
            // 上传方法
            $.upload(options);
        }

        function isPhoneNumber(phone) {
            // "[1]"代表第1位为数字1，"[358]"代表第二位可以为3、5、8中的一个，"\\d{9}"代表后面是可以是0～9的数字，有9位。
            var regex = /^1[34578]\d{9}$/;
            if (phone && regex.test(phone)) {
                return true;
            }
            return false;
        }

        function isEmpty(value) {
            return (
                angular.isUndefined(value) ||
                value == null ||
                (angular.isString(value) && value == "") ||
                value.length == 0
            );
        }

        function isNotEmpty(value) {
            return !this.isEmpty(value);
        }

        function hasActivePark(search) {
            if (!search.isGroup && (!search.parkId || search.parkId == "0")) {
                alert("请选择项目！");
                return false;
            } else {
                return true;
            }
        }

        function initDeptId(search) {
            if (!$rootScope.dept || !$rootScope.dept.id) {
                alert("请选择部门！");
                return false;
            }
            search.deptId = $rootScope.dept.id;
            return true;
        }

        function getAuthParkIds(dept) {
            if (dept) {
                var flatDeptTree = treeToFlat([dept]);
                var parkIdList = flatDeptTree.reduce(function (ret, n) {
                    n.parkId && ret.push(n.parkId);
                    return ret;
                }, []);
                if (parkIdList.length) {
                    return parkIdList.join();
                }
            }
            return -1;
        }

        function hasOnlyPark(search) {
            if (!search.parkId || search.parkId == "0") {
                alert("请选择项目！");
                return false;
            } else {
                return true;
            }
        }

        function hasSpecialPark(search) {
            if (search.parkName && search.parkName.indexOf("创意天地") != -1) {
                return true;
            }
            return false;
        }

        //人员模糊搜索
        $rootScope.searchPerson = function (val, parkId, deptId) {
            if (val && val.indexOf(" (") > 0) {
                val = val.substring(0, val.indexOf(" ("));
            }
            parkId = parkId ? parkId : null;
            deptId = deptId && deptId != 0 ? deptId : null;
            var param = {
                pageIndex: 0,
                pageSize: 10,
                name: val,
                parkId: parkId,
                deptId: deptId,
            };
            return $http
                .post("/ovu-base/pcos/person/search.do", param, postConfig)
                .then(function (resp) {
                    return resp.data;
                });
        };

        $rootScope.ConversionUrl = function (imgUrl) {
            if (imgUrl == undefined) {
                return "";
            } else {
                if (imgUrl.indexOf("192.168.0.28:8080") > -1) {
                    return imgUrl.replace(
                        "192.168.0.28:8080",
                        "beta.ovuems.com"
                    );
                } else {
                    return imgUrl;
                }
            }
        };

        //组织模糊搜索
        $rootScope.searchOrg = function (val, orgType) {
            if (val && val.indexOf(" (") > 0) {
                val = val.substring(0, val.indexOf(" ("));
            }
            var param = {
                pageIndex: 0,
                pageSize: 10,
                domainName: val,
                orgType: orgType,
            };
            return $http
                .post("/ovu-base/sys/domain/list.do", param, postConfig)
                .then(function (resp) {
                    return resp.data.data;
                });
        };
        //公司组织架构树
        $rootScope.searchOrgDeptTree = function (domainId) {
            var param = {
                domainId: domainId,
            };
            return $http
                .post("/ovu-base/system/dept/orgTree.do", param, postConfig)
                .then(function (resp) {
                    return resp.data;
                });
        };

        //人员及业主搜索
        $rootScope.searchPersonAndOwner = function (val, parkId, deptId) {
            parkId = parkId ? parkId : null;
            deptId = deptId && deptId != 0 ? deptId : null;
            var param = {
                pageIndex: 0,
                pageSize: 10,
                name: val,
                parkId: parkId,
                deptId: deptId,
                showOwner: true,
            };
            return $http
                .post("/ovu-base/pcos/person/search.do", param, postConfig)
                .then(function (resp) {
                    return resp.data;
                });
        };

        // 页面跳转
        $rootScope.target = function (path, text, global, powers, param, urls) {
            //param跳转携带的参数
         
            $ocLazyLoad.load("/view/" + path + "Ctrl.js?t=" + Date.now()).then(() => {
                let pageUrl = "/view/" + path + ".html";
              
                let page = $rootScope.pages.find((n) => n.oriUrl == urls);
                let openedPages = $rootScope.pages.filter((n) => !n.hide);
              
             
                if (!page) {
                    $rootScope.pages.push({
                        text: text,
                        oriUrl: urls,
                        url: pageUrl,
                        global: global,
                        powers: powers,
                    });
                } else {
                    let index = openedPages.findIndex((n) => {
                        return n.oriUrl == urls;
                    });
                    page.hide = true;
                    $rootScope.pages.splice(index, 1);
                    $rootScope.pages.push({
                        text: text,
                        oriUrl: urls,
                        url: pageUrl,
                        global: global,
                        powers: powers,
                    });
                }

                // 传递的参数需要时时的更新
                $rootScope.pages.params = param;
                setTimeout(() => {
                    $rootScope.pages.active = pageUrl;
                 
                    $rootScope.$applyAsync();
                });
            });
        };

        // 获取当前页面的tab信息
        $rootScope.getCurTabPage = function (active, page) {
            let curPage;
            page.forEach((value, index) => {
                if (value.url === active) {
                    curPage = value;
                }
            });
            return curPage;
        };
        //显示图片
        ($rootScope.showPhoto = function (src) {
            var src = event.srcElement.getAttribute("src") || src;
            if (src && src.indexOf("?imageView2") > -1) {
                src = src.substr(0, src.indexOf("?imageView2"));
            }
            $rootScope.curPic = {
                url: src,
                on: true,
            };
            //if(isHasImg(src)){
            //
            //}
        }),
            ($rootScope.playVideo = function (
                equipmentId,
                cameraCode,
                action,
                startTime,
                endTime
            ) {
                window.viewFrameList = window.viewFrameList || [];
                var dom = {};
                window.viewFrameList.push(dom);
                var domIndex = window.viewFrameList.indexOf(dom);
                var offset = "auto";
                if (domIndex <= 8) {
                    offset = [domIndex * 20 + "px", domIndex * 20 + "px"];
                }
                var paramObj = {
                    equipmentId: equipmentId,
                    cameraCode: cameraCode,
                    action: action,
                    startTime: startTime,
                    endTime: endTime,
                };
                var params = [];
                for (var p in paramObj) {
                    if (!isEmpty(paramObj[p])) {
                        params.push(
                            encodeURIComponent(p) +
                                "=" +
                                encodeURIComponent(paramObj[p])
                        );
                    }
                }
                layer.open({
                    type: 2,
                    title: ["视频直播", "font-size:16px;"],
                    area: ["500px", "330px"],
                    offset: offset,
                    shade: 0,
                    closeBtn: 1,
                    maxmin: true,
                    // scrollbar: false,
                    content: "/view/video.html?" + params.join("&"), //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no'],
                    // content: '//player.youku.com/embed/XMjY3MzgzODg0',
                    success: function (layero, index) {
                        layer.iframeAuto(index);
                    },
                    cancel: function (index, layero) {
                        var iframeWin =
                            window[layero.find("iframe")[0]["name"]];
                        iframeWin.closePlayer();
                        layer.close(index);
                    },
                });
            });
        $rootScope.addFile = function (item, urlField, nameField) {
            upload(
                {
                    url: "/ovu-base/uploadFile.do",
                    accept: "*",
                },
                function (resp) {
                    if (resp.success && resp.data) {
                        item[urlField] = resp.data.url;
                        item[nameField] = resp.data.name;
                        $rootScope.$apply();
                    } else {
                        alert(resp.error);
                    }
                }
            );
        };

        $rootScope.addLimitFile = function (
            item,
            urlField,
            nameField,
            accepts
        ) {
            upload(
                {
                    url: "/ovu-base/uploadFile.do",
                    accept: accepts.length == 0 ? "*" : accepts.toString(),
                },
                function (resp) {
                    if (resp.success && resp.data) {
                        var fileUrl = resp.data.url;
                        var express = fileUrl.substring(
                            fileUrl.lastIndexOf(".")
                        );
                        if (
                            accepts.length > 0 &&
                            accepts.indexOf(express) == -1
                        ) {
                            alert(
                                "只允许上传格式为:[" +
                                    accepts.join("、") +
                                    "]的文件"
                            );
                            return;
                        }
                        item[urlField] = fileUrl;
                        item[nameField] = resp.data.name;
                        $rootScope.$apply();
                        
                    } else {
                        alert(resp.error);
                    }
                }
            );
        };
        //去掉对象中值为空的属性
        $rootScope.removeEmptyField=function(obj) {
            var newObj = {};
            if(typeof obj == "string"){
                obj = JSON.parse(obj);
            }
            if(obj instanceof Array){
                newObj = [];
            }
            if(obj instanceof Object){
                for(var attr in obj){
                    if(obj.hasOwnProperty(attr) && obj[attr] !== "" && obj[attr] !== null && obj[attr] !== undefined){
                        if(obj[attr] instanceof Object){
                            newObj[attr] = $rootScope.removeEmptyField(obj[attr]);
                        }else if(typeof obj[attr] == "string" && ((obj[attr].indexOf("{") > -1 && obj[attr].indexOf("}") > -1) || (obj[attr].indexOf("[") > -1 && obj[attr].indexOf("]") > -1))){
                            try{
                                var attrObj = JSON.parse(obj[attr]);
                                if(attrObj instanceof Object){
                                    newObj[attr] = $rootScope.removeEmptyField(attrObj);
                                }
                            }catch (e){
                                newObj[attr] = obj[attr];
                            }
                        }else{
                            newObj[attr] = obj[attr];
                        }
                    }
                }
            }
            return newObj;
        },
        //获取相差天数
        $rootScope.datedifference=function(sDate1, sDate2) {    //sDate1和sDate2是2006-12-18格式  
            var dateSpan,
              
                iDays;
            sDate1 = Date.parse(sDate1);
            sDate2 = Date.parse(sDate2);
            dateSpan = sDate2 - sDate1;
            dateSpan = Math.abs(dateSpan);
            iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
            return iDays
        }
        //带回调上传
        $rootScope.addLimitFileCallBack = function (
            item,
            urlField,
            nameField,
            accepts,
            callBack,
            param
        ) {
            upload(
                {
                    url: "/ovu-base/uploadFile.do",
                    accept: accepts.length == 0 ? "*" : accepts.toString(),
                },
                function (resp) {
                    if (resp.success && resp.data) {
                        var fileUrl = resp.data.url;
                        var express = fileUrl.substring(
                            fileUrl.lastIndexOf(".")
                        );
                        if (
                            accepts.length > 0 &&
                            accepts.indexOf(express) == -1
                        ) {
                            alert(
                                "只允许上传格式为:[" +
                                    accepts.join("、") +
                                    "]的文件"
                            );
                            return;
                        }
                        item[urlField] = fileUrl;
                        item[nameField] = resp.data.name;
                        if (callBack) {
                            callBack(param);
                        }
                        $rootScope.$apply();
                        
                    } else {
                        alert(resp.error);
                    }
                }
            );
        };

        $rootScope.addLimitFile20 = function (
            item,
            urlField,
            nameField,
            accepts
        ) {
            upload(
                {
                    url: "/ovu-park/backstage/propagandaFiles/uploadFile.do",
                    accept: "*",
                },
                function (resp) {
                    if (resp.success && resp.data) {
                        var fileUrl = resp.data.url;
                        var express = fileUrl.substring(
                            fileUrl.lastIndexOf(".")
                        );
                        if (
                            accepts.length > 0 &&
                            accepts.indexOf(express) == -1
                        ) {
                            alert(
                                "只允许上传格式为:[" +
                                    accepts.join("、") +
                                    "]的文件"
                            );
                            return;
                        }
                        item[urlField] = fileUrl;
                        item[nameField] = resp.data.name;
                        $rootScope.$apply();
                        
                    } else {
                        alert(resp.error);
                    }
                }
            );
        };

        // 合同管理 - 上传多份文件
        $rootScope.addLimitFiles2 = function (
            list,
            urlField,
            nameField,
            accepts,
            num
        ) {
            if (num && list.length >= num) {
                alert("最多只能上传" + num + "个文件");
                return;
            }

            upload(
                {
                    url: "/ovu-base/uploadFileToYun",
                    accept: !isEmpty(accepts) ? accepts.toString() : "*",
                },
                function (resp) {
                    if (resp.success && resp.data) {
                        var fileUrl = resp.data.url;
                        var express = fileUrl.substring(
                            fileUrl.lastIndexOf(".")
                        );
                        if (
                            accepts &&
                            accepts.length > 0 &&
                            accepts.indexOf(express) == -1
                        ) {
                            alert(
                                "只允许上传格式为:[" +
                                    accepts.join("、") +
                                    "]的文件"
                            );
                            return;
                        }
                        var item = {};
                        item[urlField] = fileUrl;
                        item[nameField] = resp.data.name;
                        list.push(item);
                        $rootScope.$apply();
                        
                    } else {
                        alert(resp.error);
                    }
                }
            );
        };

        // 流程管理(工作流)上传多份文件
        $rootScope.addLimitFilesWorkPortal = function (
            list,
            urlField,
            nameField,
            accepts,
            num
        ) {
            if (num && list.length >= num) {
                alert("最多只能上传" + num + "个文件");
                return;
            }

            upload(
                {
                    url: "/ovu-base/uploadFile",
                    accept: !isEmpty(accepts) ? accepts.toString() : "*",
                },
                function (resp) {
                    if (resp.success && resp.data) {
                        var fileUrl = resp.data.url;
                        var express = fileUrl.substring(
                            fileUrl.lastIndexOf(".")
                        );
                        if (
                            accepts &&
                            accepts.length > 0 &&
                            accepts.indexOf(express) == -1
                        ) {
                            alert(
                                "只允许上传格式为:[" +
                                    accepts.join("、") +
                                    "]的文件"
                            );
                            return;
                        }
                        var item = {};
                        item[urlField] = fileUrl;
                        item[nameField] = resp.data.name;
                        list.push(item);
                        $rootScope.$apply();
                        
                    } else {
                        alert(resp.error);
                    }
                }
            );
        };

        // 招商策略 - 导入excel
        $rootScope.importInvestExcel = function (
            $scope,
            urlField,
            nameField,
            accepts
        ) {
            upload(
                {
                    params: {
                        domainId: "74ce42fe00724129aff5a63a2be6741f",
                    },
                    url: "/ovu-park/backstage/invest/saleRelease/importExcel",
                    accept: "*",
                },
                function (resp) {
                    if (resp.code == 0) {
                        $scope.find();
                        window.msg(resp.msg);
                    } else {
                        window.alert(resp.msg);
                    }
                }
            );
        };

        $rootScope.addLimitFiles = function (
            item,
            urlField,
            nameField,
            accepts,
            fileList
        ) {
            if (fileList.length > 1) {
                alert("最多只允许上传2个文件");
                return;
            }

            upload(
                {
                    url: "/ovu-base/uploadFile.do",
                    accept: "*",
                },
                function (resp) {
                    if (resp.success && resp.data) {
                        var fileUrl = resp.data.url;
                        var express = fileUrl.substring(
                            fileUrl.lastIndexOf(".")
                        );
                        if (
                            accepts.length > 0 &&
                            accepts.indexOf(express) == -1
                        ) {
                            alert(
                                "只允许上传格式为:[" +
                                    accepts.join("、") +
                                    "]的文件"
                            );
                            return;
                        }

                        if (fileList.length > 0) {
                            if (fileList[0].name == resp.data.name) {
                                alert("不允许上传重复文件");
                                return;
                            }
                            fileList.push({
                                path: fileUrl,
                                name: resp.data.name,
                            });

                            $rootScope.$apply();
                        } else {
                            item[urlField] = fileUrl;
                            item[nameField] = resp.data.name;
                            fileList.push(item);
                            $rootScope.$apply();
                        }
                    } else {
                        alert(resp.error);
                    }
                }
            );
        };

        $rootScope.addPhoto = function (item, field, original) {
            upload(
                {
                    url: "/ovu-base/uploadImg.do",
                    params: {
                        original: original || false,
                    },
                },
                function (resp) {
                    if (resp.success && resp.list.length) {
                        item[field] = resp.list[0].url;
                        $rootScope.$apply();
                    } else {
                        alert(resp.error);
                    }
                }
            );
        };
          //上传文件或图片到七牛云，使用input 的上传方法
          $rootScope.uploadToQNY = function (ele,item, urlField,size,callback) {
           
            $(`input[type=file][name= ${ele}]`).click();
            $(`input[type=file][name=${ele}]`).unbind("change");
            $(`input[type=file][name=${ele}]`).on("change", function (e) {
                
                let curFile = $(`#${ele}`)[0].files[0];
                if(!curFile){
                    return
                  }
                  if(curFile.size / 1024/1024 > size){
                       alert('不得大于'+size+'m')
                       return
                  }
                    //curFile.size / 1024/1024  字节转换为kb 再转化为mb
                
                let fileObj = curFile;
                $rootScope.$apply();
                $http.post("/ovu-base/getQiNiuToken").success(function (resp) {
                    if (resp.code == 0) {
                        const formdata = new FormData();
                        formdata.append("file", fileObj);
                        formdata.append("token", resp.data.token);
                 
                      
                        $.ajax({
                            //几个参数需要注意一下
                            type: "POST",//方法类型
                            dataType: "json",//预期服务器返回的数据类型
                            url: "http://upload.qiniup.com",//url
                            data: formdata,
                            processData: false,
                            contentType: false,
                            async: false,
                            success: function (result) {
                             

                                item[urlField] = resp.data.qiniuDomain + result.key
                                callback && callback(resp.data.qiniuDomain + result.key)
                                
                            },
                            error: function () {
                                alert("异常！");
                            }
                        });
                    }
                })

            })
        };
        //上传文件或图片到七牛云，使用input 的上传方法
        $rootScope.uploadToQNYs = function (ele,picList, limit,fileType,size,callback) {
            var mgs='上传图片限制为'+ limit + "张"
            if(fileType || fileType=='file'){
                mgs='上传文件限制为'+ limit + "个"
            }
           
            if (picList.length>= limit) {
                alert(mgs);
                return;
            }
            $(`input[type=file][name= ${ele}]`).click();
            $(`input[type=file][name=${ele}]`).unbind("change");
            $(`input[type=file][name=${ele}]`).on("change", function (e) {
               
                let curFile = $(`#${ele}`)[0].files[0];
                if(!curFile){
                  return
                }
                if(curFile.size / 1024/1024 > size){
                    alert('不得大于'+size+'m')
                    return
               }
                
                let fileName = curFile.name;
               
                let fileObj = curFile;
                $rootScope.$apply();
                $http.post("/ovu-base/getQiNiuToken").success(function (resp) {
                    if (resp.code == 0) {
                        const formdata = new FormData();
                        formdata.append("file", fileObj);
                        formdata.append("token", resp.data.token);
                      
                      
                        $.ajax({
                            //几个参数需要注意一下
                            type: "POST",//方法类型
                            dataType: "json",//预期服务器返回的数据类型
                            url: "http://upload.qiniup.com",//url
                            data: formdata,
                            processData: false,
                            contentType: false,
                            async: false,
                            success: function (result) {
                              

                                picList.push(resp.data.qiniuDomain + result.key) 
                                callback && callback(picList)
                                
                            },
                            error: function () {
                                alert("异常！");
                            }
                        });
                    }
                })

            })
        };
           //删除上传的七牛云图片
        $rootScope.delPhotoQNY=function(ele,item, field,fileType){
            var mgs='确定删除图片吗？'
            if(fileType || fileType=='file'){
                mgs='确定删除文件吗？'
            }
           
         
            confirm(mgs, function () {
         
                item[field] = "";
                $(`#${ele}`).val('')
                $rootScope.$apply();
            });
        }
        //删除上传的七牛云文件/图片
        $rootScope.delPhotoQNYs=function(ele,picList, pic,fileType){
            var mgs='确定删除图片吗？'
            if(fileType || fileType=='file'){
                mgs='确定删除文件吗？'
            }
            confirm(mgs, function () {
                picList.splice(picList.indexOf(pic), 1);
                $(`#${ele}`).val('')
                $rootScope.$apply();
            });
        }
        $rootScope.addPhotos = function (picList, limit, accepts) {
            
            if (limit && picList.length >= limit) {
                alert("上传图片限制为" + limit + "张!");
                return;
            }
            upload(
                {
                    url: "/ovu-base/uploadImg.do",
                    accept: "*",
                },
                function (resp) {
                    if (resp.success && resp.list.length) {
                    
                        resp.list.forEach(function (n) {
                            if (accepts) {
                                var fileUrl = n.url;
                                var express = fileUrl.substring(
                                    fileUrl.lastIndexOf(".")
                                );
                                if (
                                    accepts &&
                                    accepts.length > 0 &&
                                    accepts.indexOf(express) == -1
                                ) {
                                    alert(
                                        "只允许上传格式为:[" +
                                            accepts.join("、") +
                                            "]的图片"
                                    );
                                    return;
                                }
                            }
                            
                            picList.push(n.url);
                            if (resp.list.length > limit) {
                                alert("上传图片限制为" + limit + "张");
                                return;
                            }
                        });

                        $rootScope.$apply();
                    } else {
                        alert(resp.error);
                    }
                }
            );
        };
        $rootScope.clearPhoto = function (item, field) {
            confirm("确定清除照片吗？", function () {
                item[field] = "";
                $rootScope.$apply();
            });
        };
        $rootScope.delPhoto = function (picList, pic) {
            confirm("确定删除照片吗？", function () {
                picList.splice(picList.indexOf(pic), 1);
                $rootScope.$apply();
            });
        };

        //可指定宽度 缩略图 图片url
        $rootScope.processImgUrl = function (imgUrl, width) {
            if (!imgUrl) {
                return "/res/img/detail.png";
            } else if (imgUrl && imgUrl.indexOf("http") == 0) {
                if ("origin" == width) {
                    return imgUrl;
                } else if (width && !isNaN(width)) {
                    if (imgUrl.indexOf("?") > -1) {
                        return imgUrl.replace(
                            "?",
                            "?imageView2/2/w/" + width + "&"
                        );
                    } else {
                        //指定了宽度
                        return imgUrl + "?imageView2/2/w/" + width;
                    }
                }
                return imgUrl;
                //return imgUrl + "?imageView2/2/w/100";
            } else {
                return "/ovu-base/" + imgUrl;
            }
        };
        //新版:是否有某项操作权限
        $rootScope.hasPower = function (power) {
            if (app.powers && app.powers.indexOf(power) > -1) {
                return true;
            }
            return false;
        };

        //集团版, 用于选择项目
        $rootScope.findPark = function (search, fn) {
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "/common/modal.select.parks.html",
                controller: "parksSelectorCtrl",
                resolve: {
                    data: function () {
                        return {
                            isOnly: true,
                        };
                    },
                },
            });
            modal.result.then(
                function (data) {
                    
                    search = search || {};
                    search.parkName = data.fullPath;
                    search.parkId = data.id;
                    search.stageId = null;
                    search.floorId = null;
                    search.unitNum = null;
                    app.park = $rootScope.park = {
                        id: data.id,
                        parkName: data.fullPath,
                        position: [data.mapLng, data.mapLat],
                        blPosition: data.blPosition,
                        trPosition: data.trPosition,
                    };
                    fn && fn();
                },
                function () {}
            );
        };
        //加第二个参数，true或者false，true表示故障详情，false或者不传表示工单详情
        $rootScope.showWorkUnitDetail = function (workunitId, isFault) {
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "/view/workunit/modal.workunitDetail.html",
                controller: "workUnitDetailModalCtrl",
                resolve: {
                    workunitId: function () {
                        return workunitId;
                    },
                    isFault: function () {
                        return isFault;
                    },
                },
            });
        };
        //显示设备详情
        $rootScope.showEquipDetail = function (equipmentId) {
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "/view/equipment/modal.equipDetail.html",
                controller: "equipDetailModalCtrl",
                resolve: {
                    equipmentId: function () {
                        return equipmentId;
                    },
                },
            });
        };
        //显示传感器详情
        $rootScope.showSensorDetail = function (sensorId) {
            var modal = $uibModal.open({
                animation: false,
                size: "lg",
                templateUrl: "/view/equipment/modal.sensorDetail.html",
                controller: "sensorDetailModalCtrl",
                resolve: {
                    sensorId: function () {
                        return sensorId;
                    },
                },
            });
        };
        $rootScope.wheel = function () {
            wheelzoom(event.target);
        };

        $rootScope.checkAll = function (data) {
            data.checked = !data.checked;
            data.list.length && data.list.forEach(function (n) {
                n.checked = data.checked;
            });
        };
        $rootScope.getCheckData=function(data){
            var arr=[]
            data.forEach(ele => {
                    if(ele.checked==true){
                        arr.push(ele)
                    }
                });
                return arr
        }
        $rootScope.showXSDetail = function (content, title) {
            layer.alert(content, {
                skin: "layui-layer-lan",
                closeBtn: 0,
                title: title,
            });
        };

        $rootScope.execTreeNode = function (tree, fn) {
            tree.forEach((node) => {
                fn && fn(node);
                if (node.nodes && node.nodes.length) {
                    $rootScope.execTreeNode(node.nodes, fn);
                }
            });
        };
        $rootScope.getParks=function(){
            var parkIds=[]
            if($rootScope.node.nodes && $rootScope.node.nodes.length){
                var nodes=$rootScope.node.nodes
                
                $rootScope.execTreeNode(nodes,function(v){
                  if(v.parkId){
                    parkIds.push(v.parkId)
                  }
                })
               
            }else{
               
            }
            return  parkIds.join(',')
        }
        $rootScope.setTimeRange = function (obj, attr, date) {
            obj.config[attr] = {
              year: date.year,
              month: date.month - 1,
              date: date.date,
              hours: date.hours,
              minutes: date.minutes,
              seconds: date.seconds
            };
      
          };
          $rootScope.today_global = moment().format('YYYY-MM-DD')
          $rootScope.today_time_global = moment().format('YYYY-MM-DD HH:mm:ss')
         
        $rootScope.expandAll = function (tree) {
            var list = treeToFlat(tree);
            tree.expanded = !tree.expanded;
            list.forEach(function (n) {
                n.state = n.state || {};
                n.state.expanded = tree.expanded;
            });
        };
        $rootScope.checkOne = function (item, data) {
            item.checked = !item.checked;
            if (data && data.list) {
                data.checked = data.list.every(function (v) {
                    return v.checked;
                });
            }
        };
        $rootScope.hasChecked = function (data) {
           
            if (data && data.list && data.list.length) {
             
                return data.list.filter(function (n) {
                    return n.checked;
                }).length;
            }
            return false;
        };
        var postConfig = {
            transformRequest: function (obj) {
                var str = [];
                if (typeof obj === "object" && !obj.length) {
                    for (var p in obj) {
                        //obj[p] === null || obj[p] === undefined || obj[p] === ""
                        if (
                            obj[p] === null ||
                            obj[p] === undefined ||
                            obj[p] === "undefined"
                        ) {
                            continue;
                        } else if (obj[p] === "") {
                            str.push(encodeURIComponent(p) + "=");
                        } else if (
                            typeof obj[p] === "object" &&
                            obj[p].length === undefined
                        ) {
                            continue;
                        } else if (angular.isArray(obj[p])) {
                            continue;
                        } else {
                            str.push(
                                encodeURIComponent(p) +
                                    "=" +
                                    encodeURIComponent(obj[p])
                            );
                        }
                    }
                } else if (typeof obj === "object" && obj.length > 0) {
                    for (var p in obj) {
                        str.push(
                            encodeURIComponent(obj[p].name) +
                                "=" +
                                encodeURIComponent(obj[p].value)
                        );
                    }
                }
                return str.join("&");
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        };

        //获取楼栋
        $rootScope.getBuildList = function (model, stageId) {
            model.stageOptions = [];
            if (!stageId) {
                return;
            }
            var param = {
                pageSize: 100,
                pageIndex: 0,
            };
            param.stageId = stageId || "";

            return $http
                .post(
                    "/ovu-base/system/parkBuild/getBuilds.do",
                    param,
                    postConfig
                )
                .success(function (resp) {
                    model.stageOptions = resp;
                    return resp;
                });
        };
        //获取单元码
        $rootScope.getUnitNoList = function (model, floorId) {
            model.unitNoOptions = [];
            if (!floorId) {
                return;
            }
            var param = {
                pageSize: 10,
                pageIndex: 0,
            };
            param.buildId = floorId || "";

            return $http
                .post(
                    "/ovu-base/system/parkHouse/listUnitNo_mute.do",
                    param,
                    postConfig
                )
                .success(function (resp) {
                    model.unitNoOptions = resp.data;
                    return resp.data;
                });
        };

        //获取楼层码
        $rootScope.getGroundNoList = function (model, floorId, unit_no) {
            model.groundNoOptions = [];
            if (!floorId || !unit_no) {
                return;
            }
            var param = {
                pageSize: 100,
                pageIndex: 0,
            };
            param.buildId = floorId || "";
            param.unitNo = unit_no || "";
            return $http
                .post(
                    "/ovu-base/system/parkHouse/listGroundNo_mute.do",
                    param,
                    postConfig
                )
                .success(function (resp) {
                    model.groundNoOptions = resp.data;
                    return resp.data;
                });
        };

        //获取房间号
        $rootScope.getHousesList = function (
            model,
            floorId,
            unit_no,
            ground_no
        ) {
            model.houseOptions = [];
            if (!floorId || !unit_no || !ground_no) {
                return;
            }
            var param = {
                pageSize: 100,
                pageIndex: 0,
            };
            param.buildId = floorId || "";
            param.unitNo = unit_no || "";
            param.groundNo = ground_no || "";
            return $http
                .post(
                    "/ovu-base/system/parkHouse/getHouses.do",
                    param,
                    postConfig
                )
                .success(function (resp) {
                    model.houseOptions = resp.data;
                    return resp.data;
                });
        };

        //获取域完整项目分类树
        $rootScope.getDomainParkTree = function (onlyType) {
            return $http
                .get("/ovu-base/system/park/parkTypeTree")
                .then(function (resp) {
                    var data = resp.data.data;
                    if (onlyType) {
                        data.forEach(function (n) {
                            _removeRealPark(n);
                        });

                        data = data.filter(function (p) {
                            return p.parkType == "0";
                        });
                    }
                    return data;
                });
        };

        //小数保留num小数
        $rootScope.toTransFloat = function (value, num) {
            if (value) {
                if (num == 6) {
                    value = value / 10000;
                }
                if (value.toString().indexOf(".") !== -1) {
                    return value.toFixed(num);
                } else {
                    return value;
                }
            } else {
                return "--";
            }
        };

        function _removeRealPark(park) {
            if (park.nodes && park.nodes.length) {
                if (
                    park.nodes.find(function (n) {
                        return n.parkType === "1";
                    })
                ) {
                    delete park.nodes;
                } else {
                    park.nodes.forEach(function (n) {
                        _removeRealPark(n);
                    });
                }
            }
        }

        function treeToFlat(treeData) {
            var list = [];

            function pushNode(nodes) {
                nodes && nodes.length &&
                    nodes.forEach(function (n) {
                        list.push(n);
                        if (n.nodes && n.nodes.length) {
                            pushNode(n.nodes);
                        }
                    });
            }

            pushNode(treeData);
            return list;
        }

        function getSelectedNode(treeData) {
            var list = treeToFlat(treeData);
            return list.find(function (n) {
                return n.state && n.state.selected;
            });
        }

        function getGlobalDept(treeData) {
            var dept = getSelectedNode(treeData);
            if (!dept) {
                var deptId = $rootScope.dept.id;
                if (deptId) {
                    var list = treeToFlat(treeData);
                    dept = list.find(function (n) {
                        return n.id == deptId;
                    });
                }
            }
            return dept;
        }

        function reloadGlobalDept(scope) {
            scope.$emit("refreshDeptCache");
        }

        function getGlobalTree() {
            return $.extend(true, [], app.deptTree);
        }

        function getParkDept(treeData, deptId) {
            treeData = treeData ? treeData : getGlobalTree();
            var nodeList = treeToFlat(treeData);
            var node = nodeList.find(function (n) {
                return n.id == deptId;
            });

            //查子部门级联树（暂时不用）
            // var ps = findP(nodeList, node) || [];
            // ps.push(node);
            // var parkNode = ps.find(function (node) {
            //     return node && node.parkId;
            // });

            var parkNode = node && node.parkId ? node : null;

            return parkNode;
        }

        //找父节点
        function findP(zNodes, node) {
            var ans = [];
            for (var i = 0; i < zNodes.length; i++) {
                if (node.pid == zNodes[i].id) {
                    if (zNodes[i].pid == 0) {
                        return [zNodes[i]];
                    }
                    ans.push(zNodes[i]);
                    return ans.concat(findP(zNodes, zNodes[i]));
                }
            }
        }

        /**
         * 获得选中的ids
         */
        function getCheckedIds(idList, treeData) {
            treeData.forEach(function (n) {
                if (n.state && n.state.checked) {
                    idList.push(n.id);
                }
                if (n.nodes) {
                    getCheckedIds(idList, n.nodes);
                }
            });
        }

        function match(node, key, val, hide) {
            var ret = false;
            if (
                key == "id" &&
                angular.isArray(val) &&
                val.indexOf(node[key]) > -1
            ) {
                ret = true;
            } else if (
                key == "id" &&
                !angular.isArray(val) &&
                node[key] == val
            ) {
                node.state = {
                    selected: true,
                };
                ret = true;
            } else if (key != "id" && node[key].indexOf(val) > -1) {
                ret = true;
            } else if (node.nodes) {
                var list = node.nodes.filter(function (n) {
                    return match(n, key, val, hide);
                });
                if (list.length > 0) {
                    ret = true;
                }
            }
            node.state = node.state || {};
            if (hide) {
                node.state.hide = !ret;
            }
            /*  if(!node.nodes||node.nodes.length ==0){

              }*/
            node.state.expanded = ret;
            return ret;
        }

        function matchVal(node, key, val) {
            var ret = false;
            if (node[key].indexOf(val) > -1) {
                ret = true;
            }
            if (node.nodes) {
                var list = node.nodes.filter(function (n) {
                    return matchVal(n, key, val);
                });
                if (list.length > 0) {
                    ret = true;
                }
            }
            node.state = {
                hide: !ret,
            };
            return ret;
        }

        function searchTree(tree, key, val) {
            if (!val) {
                tree.forEach(function (n) {
                    setTreeState(n, "hide", false);
                });
                return;
            }
            return tree.filter(function (n) {
                return matchVal(n, key, val);
            });
        }

        function filterTree(tree, key, val, hide) {
            var flatTree = treeToFlat(tree);
            flatTree.forEach(function (n) {
                n.state = n.state || {};
                if (val != "" && key != "id" && n[key].indexOf(val) > -1) {
                    n.state.highLight = true;
                } else {
                    n.state.highLight = false;
                }
            });
            if (val === "") return tree;
            return tree.filter(function (n) {
                return match(n, key, val, hide);
            });
        }
        function hideTreeNode(tree, key, val, hide) {
            var flatTree = treeToFlat(tree);
            flatTree.forEach(function (n) {
                n.state = n.state || {};
                if (val != "" && key != "id" && n[key].indexOf(val) > -1) {
                    n.state.highLight = true;
                    n.state.hide = false;
                } else {
                    n.state.hide = true;
                    n.state.highLight = false;
                }
            });
            if (val === "") return tree;
            return tree.filter(function (n) {
                return match(n, key, val, hide);
            });
        }
        function showTreeNode(tree, key, val, hide) {
            var flatTree = treeToFlat(tree);
            flatTree.forEach(function (n) {
                n.state = n.state || {};
                if (val != "" && key != "id" && n[key].indexOf(val) > -1) {
                 
                    n.state.highLight = true;
                } else {
                    n.state.highLight = false;
                }
                n.state.hide = false;
            });
            if (val === "") return tree;
            return tree.filter(function (n) {
                return match(n, key, val, hide);
            });
        }

        function setTreeState(node, stateKey, val) {
            node.state = node.state || {};
            node.state[stateKey] = val;
            if (node.nodes) {
                node.nodes.forEach(function (n) {
                    setTreeState(n, stateKey, val);
                });
            }
        }

        function copyTreeState(oriTree, newTree) {
            var newTreeFlat = treeToFlat(newTree);
            var oriTreeFlat = treeToFlat(oriTree);
            newTreeFlat.forEach(function (node) {
                var oriNode = oriTreeFlat.find(function (n) {
                    return n.id == node.id;
                });
                if (oriNode && oriNode.state) {
                    node.state = oriNode.state;
                }
            });
        }

        return {
            postConfig: postConfig,
            dicts: dicts,
            parkCache: parkCache,
            getGlobalTree: getGlobalTree,
            getGlobalDept: getGlobalDept,
            reloadGlobalDept: reloadGlobalDept,
            getParkDept: getParkDept,
            hasActivePark: hasActivePark,
            initDeptId: initDeptId,
            getAuthParkIds: getAuthParkIds,
            hasOnlyPark: hasOnlyPark,
            hasSpecialPark: hasSpecialPark,
            getParkTree: getParkTree,
            //部门树不刷新
            setDeptTree: function (scope) {
                var deferred = $q.defer();
                $http
                    .get("/ovu-base/system/dept/rightTree.do")
                    .success(function (resp) {
                        if (resp.code == 0) {
                            deferred.resolve(resp.data);
                        }
                    });
                return deferred.promise;
            },
            setDeptDict: function (scope) {
                var deferred = $q.defer();
                $http
                    .get("/ovu-base/system/dept/tree.do")
                    .success(function (data, status, headers, config) {
                        deferred.resolve(data);
                        scope.treeData = data;
                        scope.oriList = treeToFlat(data);
                    });
                return deferred.promise;
            },
            setParkDeptDict: function (scope, parkId) {
                var deferred = $q.defer();
                $http
                    .get(
                        "/ovu-base/system/park/listDepts_mute.do?parkId=" +
                            parkId
                    )
                    .success(function (data, status, headers, config) {
                        deferred.resolve(data);
                        scope.deptList = data;
                    });
                return deferred.promise;
            },
            setParkTree: function (scope) {
                scope.parkTree = getParkTree();
            },
            getStageTree: function (scope, parkId) {
                var deferred = $q.defer();
                if (parkId) {
                    $http
                        .get(
                            "/ovu-base/system/park/stageList.do?parkId=" +
                                parkId
                        )
                        .success(function (resp) {
                            deferred.resolve(resp.data);
                            scope.houseTree = resp.data;
                        });
                }
                return deferred.promise;
            },
            getHouseTree: function (scope, parkId) {
                var deferred = $q.defer();
                if (parkId) {
                    $http
                        .post(
                            "/ovu-base/system/parkStage/tree.do",
                            {
                                parkId: parkId,
                                level: 1,
                            },
                            postConfig
                        )
                        .success(function (data) {
                            deferred.resolve(data);
                            scope.houseTree = data;
                        });
                }

                return deferred.promise;
            },
            getHouseTree2: function (scope, parkId) {
                var deferred = $q.defer();
                if (parkId) {
                    $http
                        .post(
                            "/ovu-base/system/parkStage/tree.do",
                            {
                                parkId: parkId,
                                level: 2,
                            },
                            postConfig
                        )
                        .success(function (data) {
                            deferred.resolve(data);
                            scope.houseTree = data;
                        });
                }

                return deferred.promise;
            },
            setPostDict: function (scope) {
                $http
                    .get("/ovu-base/system/post/postDict.do")
                    .success(function (resp) {
                        scope.postDict = resp;
                    });
            },
            //新的worktypeTree,分为应急和
            workTypeTree: function (scope, type) {
                var types = [];
                if (type) {
                    types.push(type);
                } else {
                    types.splice(0, 0, 1, 2);
                }
                types.includes(1) &&
                    $http
                        .get("/ovu-pcos/pcos/workunit/worktypeTree", {
                            params: {
                                type: 1,
                            },
                        })
                        .success(function (resp) {
                            if (resp.code == 0) {
                                scope.planWorkTypeTree = resp.data || [];
                                scope.planWorkTypeTreeFlat = treeToFlat(
                                    scope.planWorkTypeTree
                                );
                            }
                        });
                types.includes(2) &&
                    $http
                        .get("/ovu-pcos/pcos/workunit/worktypeTree", {
                            params: {
                                type: 2,
                            },
                        })
                        .success(function (resp) {
                            if (resp.code == 0) {
                                scope.emerWorkTypeTree = resp.data || [];
                                scope.emerWorkTypeTreeFlat = treeToFlat(
                                    scope.emerWorkTypeTree
                                );
                            }
                        });
            },
            setWorktypeTree: function (scope, params) {
                $http.post("/ovu-pcos/pcos/workunit/worktypeTree.do", params, postConfig).success(function (resp) {
                    if (resp.code == 0) {
                        scope.planWorkTypeTree = resp.data || [];
                        scope.planWorkTypeTreeFlat = treeToFlat(scope.planWorkTypeTree);
                    }
                })
            },
            setEquipTypeTree: function (params, scope) {
                var deferred = $q.defer();
                $http
                    .get("/ovu-pcos/pcos/equipment/getEmtTree", {
                        params: params,
                    })
                    .success(function (resp) {
                        if (resp.success) {
                            scope.equipTypeTree = scope.equipTypeTree || [];
                            $.extend(true, scope.equipTypeTree, resp.data);
                            scope.equipTypeTreeFlat = treeToFlat(
                                scope.equipTypeTree
                            );
                            /*    $rootScope.equipTypeTreeFlat.forEach(function (n) {
                                delete n.sensorTypeId
                            })*/
                            deferred.resolve(scope.equipTypeTree);
                        }
                    });
                return deferred.promise;
            },
            setParkBlueprint: function (params, scope) {
                var deferred = $q.defer();
                $http
                    .post("/ovu-base/system/parkBlueprint/tree", params)
                    .success(function (resp) {
                        scope.BlueprintTree = [];
                        if (resp) {
                            $.extend(true, scope.BlueprintTree, resp);

                            /*    $rootScope.equipTypeTreeFlat.forEach(function (n) {
                                delete n.sensorTypeId
                            })*/
                            $rootScope.BlueprintTree = scope.BlueprintTree;
                            deferred.resolve(scope.BlueprintTree);
                        }
                    });
                return deferred.promise;
            },
            getParkStageTree: function (params, scope) {
                var deferred = $q.defer();
                $http
                    .post(
                        "/ovu-base/system/parkStage/treeNew",
                        params,
                        postConfig
                    )
                    .success(function (resp) {
                        if (resp) {
                            scope.parkStagetreeData = [];
                            $.extend(true, scope.parkStagetreeData, resp);

                            scope.parkStagetreeData =
                                scope.parkStagetreeData || [];
                            if (scope.parkStagetreeData.length) {
                                $rootScope.execTreeNode(
                                    scope.parkStagetreeData,
                                    function (v) {
                                        if (v.level == 4) {
                                            v.isLeaf = true;
                                        }
                                    }
                                );
                            }
                            $.extend(true, scope.parkStagetreeData, resp);
                            $rootScope.parkStagetreeData =
                                scope.parkStagetreeData;
                            deferred.resolve(scope.parkStagetreeData);
                        } else {
                            scope.parkStagetreeData = [];
                        }
                    });
                return deferred.promise;
            },
            //资产分类树
            setAssetsClassTree: function (params) {
                var deferred = $q.defer();
                $http
                    .get("/ovu-gallery/asset/category/getTree", {
                        params: params,
                    })
                    .success(function (resp) {
                        if (resp.code == 0) {
                            deferred.resolve(resp.data);
                            $rootScope.AssetClyTree = resp.data || [];
                        }
                    });
                return deferred.promise;
            },
            //设置巡查项树
            setInsitemtypeTree: function (params) {
                var deferred = $q.defer();
                $http
                    .get("/ovu-pcos/pcos/inspection/insitemtype/tree.do", {
                        params: params,
                    })
                    .success(function (resp) {
                        if (resp.code == 0) {
                            deferred.resolve(resp.data);
                            $rootScope.insTreeData = resp.data || [];
                        }
                    });
                return deferred.promise;
            },

            //设置变配电树
            setInsitemtypeTree2: function (params) {
                var deferred = $q.defer();
                $http
                    .get("/ovu-energy/energy/transformer/tree.do", {
                        params: params,
                    })
                    .success(function (resp) {
                        if (resp.code == 0) {
                            $rootScope.trmTreeData =
                                $rootScope.trmTreeData || [];

                            $.extend(true, $rootScope.trmTreeData, resp.data);
                            $rootScope.trmTreeFlat = treeToFlat(
                                $rootScope.trmTreeData
                            );
                            deferred.resolve($rootScope.trmTreeData);
                        }
                    });
            },
            setSensorTypeTree: function () {
                var deferred = $q.defer();
                $http
                    .get("/ovu-pcos/pcos/sensor/getSensorTree.do")
                    .success(function (resp) {
                        if (resp.success) {
                            deferred.resolve(resp.data);
                            $rootScope.sensorTypeTree = resp.data;
                        }
                    });
                return deferred.promise;
            },
            getSessionInfo: function (scope) {
                var deferred = $q.defer();
                debugger;
                $http
                    .get("/ovu-pcos/getSessionInfo.do")
                    .success(function (data, status, headers, config) {
                        deferred.resolve(data);
                        if (data.user) {
                            scope.user = data.user;
                            scope.user.personId = data.personId;
                            scope.park = data.park;
                        } else {
                            confirm("会话已失效，请重新登录！", function (
                                index
                            ) {
                                window.location.href = "/";
                            });
                        }
                    });
                return deferred.promise;
            },
            getPostTree: function (params) {
                var deferred = $q.defer();
                $http
                    .get("/ovu-base/system/dept/list.do", {
                        params: params,
                    })
                    .success(function (resp) {
                        if (resp.code == 0) {
                            deferred.resolve(resp.data);
                            $rootScope.postTree = resp.data || [];
                        }
                    });
                return deferred.promise;
            },
            getPostbyWayTree: function (params) {
                var deferred = $q.defer();
                $http
                    .get("/ovu-pcos/pcos/inspection/insway/insWayList", {
                        params: params,
                    })
                    .success(function (resp) {
                        if (resp.code == 0) {
                            deferred.resolve(resp.data);
                            $rootScope.postbyWayTree = resp.data || [];
                        }
                    });
                return deferred.promise;
            },
            //判断当前否为集团版页面
            isGroupVersion: function (params) {
                return app.curModule.isGroup == 2;
            },

            //常规请求
            getResult: function (url, param, fn) {
                $http
                    .post(url, param, postConfig)
                    .success(function (data, status, headers, config) {
                        console.log(
                            "\n 请求:" + url + "\n",
                            param,
                            "\n\n",
                            "响应:\n",
                            data,
                            "\n\n"
                        );
                        if (!isNaN(data.code)) {
                            if (data.code == 0) {
                                data = data.data;
                            } else {
                                alert(data.message);
                                return;
                            }
                        }
                        fn && fn(data);
                    })
                    .error(function (data, status, headers, config) {
                        console.log("请求异常");
                    });
            },
            
            //获取分页查询结果
           
            getPageResult: function (url, param, fn) {
                param.pageIndex = param.currentPage && param.currentPage - 1;
                param=$rootScope.removeEmptyField(param) //清除对象中值为空的属性
                $http
                    .post(url, param, postConfig)
                    .success(function (data, status, headers, config) {
                        // debugger;
                        if (angular.isString(data)) {
                            //返回的是页面，直接显示登录页面
                            location.href = "/";
                            return;
                        }
                        if (!isNaN(data.code) || !isNaN(data.CODE)) {
                            //zg 后台返回值，code为0表示成功，-1失败
                            //if (data.code == 1) {
                            if (data.code == 0 || data.CODE) {
                                data = data.data;
                            } else {
                                data.msg = data.msg || data.message;
                                alert(data.msg);
                                // alert(url + "获取列表异常");
                                return;
                            }
                        }
                        if(!data){
                          return
                        }
                        data.currentPage = data.pageIndex + 1;
                        data.totalPage = data.pageTotal;
                     data.totalRecord = data.totalCount;
                        if (data.data && data.data.length >= 0) {
                            data.list = data.data;
                        }

                        /**
                         * 始终得有第一页和最后一页.当前页 ,前一页,后一页.
                         */
                        var list = [
                            1,
                            data.currentPage - 1,
                            data.currentPage,
                            data.currentPage + 1,
                            data.totalPage,
                        ];
                        var pages = [];
                        var hash = {};
                        list.forEach(function (v) {
                            if (!hash[v] && v <= data.totalPage && v > 0) {
                                hash[v] = true;
                                pages.push(v);
                            }
                        });
                        if (pages.length > 2 && pages.indexOf(2) == -1) {
                            pages.splice(1, 0, "······");
                        }
                        if (
                            pages.length > 2 &&
                            pages.indexOf(data.totalPage - 1) == -1
                        ) {
                            pages.splice(pages.length - 1, 0, "······");
                        }
                        data.pages = pages;
                        fn && fn(data);
                    })
                    .error(function (data, status, headers, config) {
                        console.log("获取列表异常");
                    });
            },
            initPage: function (scope, fn, groupFn) {
                $rootScope.park = $rootScope.park || {};
                scope.search = scope.search || {};
                scope.$watch("dept.id", function (newValue, oldValue) {
                    if (newValue) {
                        if (scope.dept.parkId) {
                            scope.search.parkId = scope.dept.parkId;
                            scope.search.parkName = scope.dept.parkName;
                            app.park.parkId = scope.dept.parkId;
                            fn && fn();
                        } else {
                            alert("请选择跟项目关联的部门");
                            scope.search.parkId = "";
                            scope.search.parkName=""
                            app.park.parkId = "";

                            return;
                        }
                    }
                });
            },
            checkPark: function (scope) {
                var flag = true;
                if (scope.dept.parkId) {
                    flag = true;
                } else {
                    alert("请选择跟项目关联的部门");
                    flag = false;
                }
                return flag;
            },
            loadSelect: function (scope, property,fn) {
                var jsonObject;
                //$http.post("/ovu-base/system/dictionary/get.do", { "item": property }, postConfig).success(function (data) {
                $http
                    .post(
                        "/ovu-base/system/dictionary/get",
                        {
                            item: property,
                        },
                        postConfig
                    )
                    .success(function (data) {
                        //jsonObject = angular.fromJson(data.dic_VAL);
                        jsonObject = angular.fromJson(data);
                     
                        if (property === "HOUSE_THEME") {
                            scope.houseTheme = jsonObject.data;
                        } else if (property === "HOUSE_LAYOUT_TYPE") {
                            scope.houseLayoutType = jsonObject;
                        } else if (property === "HOUSE_TYPE") {
                            scope.houseType = jsonObject.data;
                        } else if (property === "HOUSE_IS_DECORATION") {
                            scope.isDecoration = jsonObject.data;
                        } else if (property === "IS_EMT_HOUSE") {
                            scope.isEmtHouse = jsonObject;
                        } else if (property === "HOUSE_DIRECTION") {
                            scope.direction = jsonObject;
                        } else if (property === "HOUSE_STATUS") {
                            scope.houseStatus = jsonObject.data;
                        } else if (property === "INDUSTRY") {
                            scope.industryList = jsonObject.data;
                        } else if (property === "ENTERPRISE_SIZE") {
                            scope.companySizeList = jsonObject.data;
                        } else if (property === "ENTERPRISE_NATURE") {
                            scope.companyTypeList = jsonObject.data;
                        } else if (property === "SERVICE_SCOPE") {
                            scope.serviceScopeList = jsonObject.data;
                        } else if (property === "AMOUNT_TYPE") {
                            scope.saleFinanceAmountTypeList = jsonObject.data;
                        } else if (property === "AMOUNT_NAME") {
                            scope.saleFinanceAmountNameList = jsonObject.data;
                        } else if (property === "CURRENCY") {
                            scope.saleFinanceCurrencyList = jsonObject.data;
                        } else if (property === "PAY_TYPE") {
                            scope.saleFinancePayTypeList = jsonObject.data;
                        } else if (property === "ENTRY_BANK") {
                            scope.saleFinanceEntryBankList = jsonObject.data;
                        } else if (property === "BANK_PAY_TYPE") {
                            scope.saleFinanceBankPayTypeList = jsonObject.data;
                        } else if (property === "SWIPED_TERMINA") {
                            scope.saleFinanceSwipedTerminaList =
                                jsonObject.data;
                        } else if (property === "BANK_CARD") {
                            scope.saleFinanceBankCardList = jsonObject.data;
                        } else if (property === "CLEARING_FORM") {
                            scope.saleFinanceClearingFormList = jsonObject.data;
                        } else if (property === "TALENS_TYPE") {
                            scope.saleFinanceTalensTypeList = jsonObject.data;
                        } else if (property === "OFFICE_TYPE") {
                            scope.saleFinanceOfficeTypeList = jsonObject.data;
                        } else if (property === "OFFICE_USE") {
                            scope.saleFinanceOfficeUseList = jsonObject.data;
                        } else if (property === "LISTED_BOARD") {
                            scope.saleFinanceListBoardList = jsonObject.data;
                        } else if (property === "CONTACT_TYPE") {
                            scope.saleFinanceContactTypeList = jsonObject.data;
                        } else if (property === "EDUCATIONAL_BG") {
                            scope.saleFinanceEducationalBgList =
                                jsonObject.data;
                        } else if (property === "DECORATION_STANDARD") {
                            scope.decorationList = jsonObject.data;
                        } else if (property === "FUND_BANK") {
                            scope.fundBankList = jsonObject.data;
                        } else if (property === "MORTGAGE_BANK") {
                            scope.mortgageList = jsonObject.data;
                        } else if (property === "BANLANCE_PLAN") {
                            scope.banlanceplanList = jsonObject.data;
                        } else if (property === "CERTIFICATE_TYPE") {
                            scope.saleCertificateTypeList = jsonObject.data;
                        } else if (property === "PROPERTY_CATEGORY") {
                            scope.workTypeList = jsonObject.data;
                        } else if (property === "INDUSTRY_THEME") {
                            scope.themeList = jsonObject.data;
                        } else if (property === "REAL_ESTATE_TYPE") {
                            scope.realEstateList = jsonObject.data;
                        } else if (property === "PROJECT_LABEL") {
                            scope.projectTagList = jsonObject.data;
                        } else if (property === "PROJECT_FORM") {
                            scope.projectFormList = jsonObject.data;
                        } else if (property === "DOOR_MODEL_TYPE") {
                            scope.doorModelList = jsonObject.data;
                        }else if(property === "VIDEO_INSPECTION_WAY_CLASSIFY"){
                            scope.videoClassList = jsonObject.data;

                        }else if(!property){
                          
                            $rootScope.dicData = jsonObject.data;
                        }
                        fn && fn()
                    });
            },
            isHasImg: isHasImg,
            /* //显示大图
             showPhoto:function(){

             var src = event.srcElement.getAttribute("src");
             if(isHasImg(src)){
             $rootScope.curPic = {url:src,on:true};
             }
             //var width = window.innerWidth*0.9;
             //var height = window.innerHeight*0.9;
             },*/
            // 本地导入
            upload: upload,
            transform: function (wgLat, wgLon) {
                var latlng = [];
                if (outOfChina(wgLat, wgLon)) {
                    latlng[0] = wgLat;
                    latlng[1] = wgLon;
                    return latlng;
                }
                var dLat = transformLat(wgLon - 105.0, wgLat - 35.0);
                var dLon = transformLon(wgLon - 105.0, wgLat - 35.0);
                var radLat = (wgLat / 180.0) * pi;
                var magic = Math.sin(radLat);
                magic = 1 - ee * magic * magic;
                var sqrtMagic = Math.sqrt(magic);
                dLat =
                    (dLat * 180.0) /
                    (((a * (1 - ee)) / (magic * sqrtMagic)) * pi);
                dLon =
                    (dLon * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * pi);
                latlng[0] = wgLat + dLat + "";
                latlng[1] = wgLon + dLon + "";
                return latlng;
            },
            isPhoneNumber: isPhoneNumber,
            isEmpty: isEmpty,
            isNotEmpty: isNotEmpty,
            treeToFlat: treeToFlat,
            getSelectedNode: getSelectedNode,
            filterTree: filterTree,
            hideTreeNode:hideTreeNode,
            showTreeNode:showTreeNode,
            searchTree: searchTree,
            getCheckedIds: getCheckedIds,
            setTreeState: setTreeState,
            copyTreeState: copyTreeState,
            //reveal:是否显示此节点及其父节点
            getNodeById: function (treeData, id, reveal) {
                var list = treeToFlat(treeData);
                var target = list.find(function (n) {
                    return n.id == id;
                });
                if (reveal) {
                    var pid = target.pid;
                    while (!!pid) {
                        var pnode = list.find(function (n) {
                            return n.id == pid;
                        });
                        if (pnode) {
                            pnode.state = pnode.state || {};
                            pnode.state.expanded = true;

                            pid = pnode.pid;
                        } else {
                            pid = null;
                        }
                    }
                }
                return target;
            },

            showVideo: function (deviceId) {
                $rootScope.videos = $rootScope.videos || [];
                $rootScope.videos.indexOf(deviceId) == -1 &&
                    $rootScope.videos.push(deviceId);
                // $rootScope.video = { id: deviceId, on: true };
                /*var html="<div class='photoDiv' ng-if='video.on' id='videomove'>"
                 +"<img src='/ovu-pcos/res/img/refuse.png' class='hand' style='top:0;right:0;position:absolute' ng-click='video.on = false'>"
                 +"</img><play-video id='video' device-id='"+deviceId+ "'></play-video></div>"
                 var template = angular.element(html);
                 var linkFn = $compile(template);
                 var element = linkFn($rootScope);
                 angular.element("#ajaxBody").append(element);
                 $rootScope.video = {deviceId:deviceId,on:true};
                 setTimeout(() => {
                 $('#videomove').dragmove();
                 }, 1000);*/
            },
        };
    });

    app.factory("locals", [
        "$window",
        function ($window) {
            return {
                //存储单个属性
                set: function (key, value) {
                    $window.localStorage[key] = value;
                }, //读取单个属性
                get: function (key, defaultValue) {
                    return $window.localStorage[key] || defaultValue;
                }, //存储对象，以JSON格式存储
                clear: function (key) {
                    $window.localStorage[key] = null;
                },
                setObject: function (key, value) {
                    $window.localStorage[key] = JSON.stringify(value); //将对象以字符串保存
                }, //读取对象
                getObject: function (key) {
                    return JSON.parse($window.localStorage[key] || "{}"); //获取字符串并解析成对象
                },
            };
        },
    ]);

    app.service("mapService", function () {
        // 设置地图范显示围  根据所有的点 求出需要显示的范围  如果list为空 显示武汉市
        this.setMapBounds = function (map, list) {
            if (!list || !list.length) {
                map.setCity("武汉市");
            } else {
                var bounds = getBoundsByListData(list);
                map.setBounds(bounds);
            }
        };
        // 根据list [{longitude:00.000000,latitude:00.000000,...},...] 数据获取地图显示范围
        function getBoundsByListData(list) {
            var lngArr = [],
                latArr = [];

            list.forEach(function (v, i) {
                if (v.longitude && v.latitude) {
                    lngArr.push(parseFloat(v.longitude));
                    latArr.push(parseFloat(v.latitude));
                }
            });

            var minLng = Math.min.apply(null, lngArr),
                maxLng = Math.max.apply(null, lngArr);

            var minLat = Math.min.apply(null, latArr),
                maxLat = Math.max.apply(null, latArr);

            var deltaLng = maxLng - minLng,
                deltaLat = maxLat - minLat;

            minLng -= 0.05 * deltaLng;
            minLat -= 0.05 * deltaLat;
            maxLng += 0.05 * deltaLng;
            maxLat += 0.05 * deltaLat;

            var southWest = new AMap.LngLat(
                    minLng.toFixed(6),
                    minLat.toFixed(6)
                ),
                northEast = new AMap.LngLat(
                    maxLng.toFixed(6),
                    maxLat.toFixed(6)
                );
            return new AMap.Bounds(southWest, northEast);
        }
    });

    //pi: 圆周率。//a: 卫星椭球坐标投影到平面地图坐标系的投影因子。//ee: 椭球的偏心率。
    var pi = 3.14159265358979324,
        a = 6378245.0,
        ee = 0.00669342162296594323;

    function outOfChina(lat, lon) {
        if (lon < 72.004 || lon > 137.8347) return true;
        if (lat < 0.8293 || lat > 55.8271) return true;
        return false;
    }

    function transformLat(x, y) {
        var ret =
            -100.0 +
            2.0 * x +
            3.0 * y +
            0.2 * y * y +
            0.1 * x * y +
            0.2 * Math.sqrt(Math.abs(x));
        ret +=
            ((20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) *
                2.0) /
            3.0;
        ret +=
            ((20.0 * Math.sin(y * pi) + 40.0 * Math.sin((y / 3.0) * pi)) *
                2.0) /
            3.0;
        ret +=
            ((160.0 * Math.sin((y / 12.0) * pi) +
                320 * Math.sin((y * pi) / 30.0)) *
                2.0) /
            3.0;
        return ret;
    }

    function transformLon(x, y) {
        var ret =
            300.0 +
            x +
            2.0 * y +
            0.1 * x * x +
            0.1 * x * y +
            0.1 * Math.sqrt(Math.abs(x));
        ret +=
            ((20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) *
                2.0) /
            3.0;
        ret +=
            ((20.0 * Math.sin(x * pi) + 40.0 * Math.sin((x / 3.0) * pi)) *
                2.0) /
            3.0;
        ret +=
            ((150.0 * Math.sin((x / 12.0) * pi) +
                300.0 * Math.sin((x / 30.0) * pi)) *
                2.0) /
            3.0;
        return ret;
    }

    // 租赁 - 租金模式
    app.filter("rentalModal", function () {
        return function (status) {
            if (!status) {
                return "--";
            }
            status += "";
            switch (status) {
                case "1":
                    return "固定租金";
                    break;
                case "2":
                    return "抽成租金";
                    break;
                case "3":
                    return "固定租金,抽成租金";
                    break;
                default:
                    return "--";
                    break;
            }
        };
    });
    // 生成账单约定
    app.filter("createBillModel", function () {
        return function (status) {
            if (status == 1) {
                return "按合同生成账单";
            } else if (status == 2) {
                return "按租赁资源生成账单";
            } else {
                return "--";
            }
        };
    });
    //  租赁 - 支付方式
    app.filter("payType", function () {
        return function (status) {
            if (!status) {
                return "--";
            }
            status += "";
            switch (status) {
                case "1":
                    return "月付";
                    break;
                case "2":
                    return "季付";
                    break;
                case "3":
                    return "年付";
                    break;
                default:
                    return "--";
                    break;
            }
        };
    });
    // 租赁-费项类别
    app.filter("category", function () {
        return function (status) {
            switch (status) {
                case "02":
                    return "租金类";
                    break;
                case "03":
                    return "管理费类";
                    break;
                case "04":
                    return "其他类";
                    break;
                case "05":
                    return "押金类";
                    break;
            }
        };
    });
    // 计费方式
    app.filter("billMode", function () {
        return function (status) {
            if (!status) {
                return "--";
            }
            status = status + "";
            switch (
                status //抄表计费、建面计费、套内计费、定额计费、手动输入
            ) {
                case "1":
                    return "抄表计费";
                    break;
                case "2":
                    return "建面计费";
                    break;
                case "3":
                    return "套内计费";
                    break;
                case "4":
                    return "定额计费";
                    break;
                case "5":
                    return "手动输入";
                    break;
                default:
                    return "--";
                    break;
            }
        };
    });
    // 计费单位
    app.filter("billUnit", function () {
        return function (status) {
            if (!status) {
                return "--";
            }
            status = status + "";
            switch (
                status //kw/h、M2、M3、户、吨
            ) {
                case "1":
                    return "kw/h";
                    break;
                case "2":
                    return "M2";
                    break;
                case "3":
                    return "M3";
                    break;
                case "4":
                    return "户";
                    break;
                case "5":
                    return "吨";
                    break;
                default:
                    return "--";
                    break;
            }
        };
    });
    // 计费标准
    app.filter("billRate", function () {
        return function (status) {
            if (!status) {
                return "--";
            }
            status = status.toString();
            switch (status) {
                case "1":
                    return "一次性收费";
                    break;
                case "2":
                    return "周期性收费";
                    break;
                case "3":
                    return "计量表收费";
                    break;
                case "4":
                    return "单位：日/㎡";
                    break;
                case "5":
                    return "单位：月/㎡";
                    break;
                case "6":
                    return "单位：季度/㎡";
                    break;
                case "7":
                    return "单位：年/㎡";
                    break;
                default:
                    return "--";
                    break;
            }
        };
    });
    // 收费方式
    app.filter("chargeMethod", function () {
        return function (status) {
            if (!status) {
                return "--";
            }
            status = status + "";
            switch (status) {
                case "2":
                    return "一次性收费";
                    break;
                case "1":
                    return "周期性收费";
                    break;
                default:
                    return "--";
                    break;
            }
        };
    });
    // 收费方式
    app.filter("chargeMethod", function () {
        return function (status) {
            if (!status) {
                return "--";
            }
            status = status + "";
            switch (status) {
                case "2":
                    return "一次性收费";
                    break;
                case "1":
                    return "周期性收费";
                    break;
                default:
                    return "--";
                    break;
            }
        };
    });
    // 账号类型
    app.filter("userTypeStatus", function () {
        return function (status) {
            if (!status) {
                return "--";
            }
            status = status + "";
            switch (status) {
                case "1":
                    return "个人";
                    break;
                case "2":
                    return "企业";
                    break;
                case "3":
                    return "员工";
                    break;
                default:
                    return "--";
                    break;
            }
        };
    });
    // 押金类型
    app.filter("depositsTypeStatus", function () {
        return function (status) {
            if (!status) {
                return "--";
            }
            status = status + "";
            switch (status) {
                case "1":
                    return "租赁押金";
                    break;
                case "2":
                    return "装修押金";
                    break;
                case "3":
                    return "水电押金";
                    break;
                case "4":
                    return "公寓房卡押金";
                    break;
                case "5":
                    return "其他";
                    break;
                default:
                    return "--";
                    break;
            }
        };
    });

    app.filter("contractStatus", function () {
        return function (status) {
            status += "";
            switch (status) {
                case "-1":
                    return "草稿";
                    break;
                case "0":
                    return "待提交";
                    break;
                case "1":
                    return "待审批";
                    break;
                case "2":
                    return "执行中";
                    break;
                case "3":
                    return "已驳回";
                    break;
                case "4":
                    return "已终止";
                    break;
                case "5":
                    return "已结束";
                    break;
                default:
                    return "--";
                    break;
            }
        };
    });

    // 减免明细/退款明细/冲抵明细状态
    app.filter("financeStatus", function () {
        return function (status) {
            switch (status) {
                case 0:
                    return "待审批";
                    break;
                case 1:
                    return "已审批";
                    break;
                case 2:
                    return "已驳回";
                    break;
                case 3:
                    return "已复核";
                    break;
            }
        };
    });

    // 押金管理状态
    app.filter("depositeStatus", function () {
        return function (status) {
            if (status == 1) {
                return "未退还";
            } else if (status == 2) {
                return "部分退还";
            } else if (status == 3) {
                return "已退还";
            } else {
                return "";
            }
        };
    });
    //招商系统-合同管理-合同状态
    app.filter("getContractType", function () {
        return function (status) {
            if (status == 2) {
                return "待提交";
            } else if (status == 3) {
                return "审批中";
            } else if (status == 4) {
                return "已签约";
            } else if (status == 5) {
                return "已驳回";
            } else {
                return "";
            }
        };
    });
    //数据字典key转value
    app.filter("toDictionaryText", function () {
        return function (value, dicList) {
            var textVal = "";
            if (!value) return "";
            if (!dicList || !dicList.length) return "";
            dicList.forEach(function (item) {
                if (item.dicVal == value) {
                    textVal = item.dicItem;
                }
            });
            return textVal;
        };
    });
})();
