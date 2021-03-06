(function () {
    "use strict";
    var app = angular.module("angularApp");
    app.directive("treeMenu", function () {
        return {
            restrict: "E",
            scope: {
                nodeList: "=",
                pnode: "=",
                config: "<?",
            },
            templateUrl: "/common/treeMenu.html",
            controller: function ($scope) {
                $scope.selectMenu = $scope.$parent.selectMenu;
                $scope.$watch("$parent.engageCount", function (
                    newValue,
                    oldValue
                ) {
                    $scope.count = $scope.$parent.engageCount;
                });
            },
        };
    });

    app.directive("treeMenuEdit", function () {
        return {
            restrict: "E",
            scope: {
                nodeList: "=",
                pnode: "=",
                config: "<?",
            },
            templateUrl: "/view/sys/menuTreeEdit.html",
            controller: function ($scope) {
                $scope.selectMenuEdit = $scope.$parent.selectMenuEdit;
                $scope.sort = $scope.$parent.sort;
                $scope.undo = $scope.$parent.undo;
                $scope.save = $scope.$parent.save;
                $scope.delNode = $scope.$parent.delNode;
                $scope.addSon = $scope.$parent.addSon;
                $scope.check = $scope.$parent.check;
                $scope.editNode = $scope.$parent.editNode;
                $scope.moveNode = $scope.$parent.moveNode;
                $scope.showResource = $scope.$parent.showResource;
                $scope.setCurCopy = $scope.$parent.setCurCopy;
                $scope.checkOperation = function (config, node, ac) {
                    node.state = node.state || {};
                    if (config.checkOperate && node.state.checked) {
                        ac.on = !ac.on;
                    }
                };
            },
        };
    });

    app.config([
        "$uibModalProvider",
        function ($uibModalProvider) {
            $uibModalProvider.options = {
                backdrop: "static",
                keyboard: true
            };
        },
    ]);

    app.run([
        "$rootScope",
        "$location",
        "$http",
        function ($rootScope, $location, $http) {
            $rootScope.UrlKey = "aWdub3JlTW"; //???????????????????????????
            // ??????url??????
            $rootScope.parseQueryString = function (url) {
                var str = url.split("?")[1];
                var iterms = str.split("&");
                var arr, Json = {};
                for (var i = 0; i < iterms.length; i++) {
                    arr = iterms[i].split("=");
                    Json[arr[0]] = arr[1];
                }
                return Json;
            }
            if (window.location.search.indexOf("token=") !== -1) {
                let params = $rootScope.parseQueryString(window.location.search);
               
                let token = params['token'];
                document.cookie = `token=${token}; path=/`;
                Object.keys(params).forEach(key => {
                    sessionStorage.removeItem(key);
                    sessionStorage.setItem(key, params[key])
                  })
                  let replace = `${window.location.origin}${window.location.pathname}?module=${params['module']}${window.location.hash}`
                  window.location.replace(replace);
            }
        },
    ]);

    // ?????????
    app.controller("mainController", function (
        $scope,
        $rootScope,
        $location,
        $q,
        $http,
        $uibModal,
        fac,
        $ocLazyLoad
    ) {
        //$scope.menus = appData.menus;
        app.envName = "portal";

        $rootScope.dept = {};
        $scope.showMenuList;
        $scope.menuConfig = $scope.menuConfig || {
            collapse: localStorage.getItem("menuCollapse") == "true" || false,
        };
        $scope.toggleCollapse = function () {
            $scope.menuConfig.collapse = !$scope.menuConfig.collapse;
            localStorage.setItem("menuCollapse", $scope.menuConfig.collapse);
        };

        function getLoginUser() {
            var deferred = $q.defer(); // ??????????????????????????????????????????????????????
            $http
                .get("/ovu-base/getSessionInfo")
                .success(function (data) {
                    if (data.user && data.user.id) {
                        app.user = $rootScope.user = data.user;
                        app.domain = $rootScope.domain = data.domain;
                        app.CAMERA_SERVICE_URL = data.CAMERA_SERVICE_URL;
                        if (data.domain) {
                            $http
                                .get(
                                    "/ovu-base/system/dept/rightTree.do?domainCode=" +
                                    app.domain.domainCode
                                )
                                .success(function (resp) {
                                    if (resp.code == 0) {
                                        $rootScope.fullDeptTree = resp.data;
                                        $rootScope.fullflatDeptTree = fac.treeToFlat(
                                            resp.data
                                        );
                                        deferred.resolve(data.user);
                                    }
                                });
                        } else {
                            deferred.resolve(data.user);
                        }
                    } else {
                        location.href = "/";
                    }
                })
                .error(function (data, status, headers, config) {
                    deferred.reject(data); // ?????????????????????????????????????????????
                });
            return deferred.promise; // ????????????????????????????????????????????????????????????????????????API
        }

        $scope.setDept = function (dept, node) {
            //  fac.setTreeState(node,'hide',false);
            if (node) {
                // app.park = $rootScope.park = node;
                app.park = $rootScope.park = dept;
                $rootScope.node = node;
                dept.parkId = node.parkId;
                dept.parkName = node.parkName;
                localStorage.setItem("lastDeptId", node.id);

                //    $rootScope.deptTree = $.extend(true,[],[fac.getNodeById(app.deptTree,node.id)]);
            } else {
                app.park = $rootScope.park = {};
                //   $rootScope.deptTree = $.extend(true,[],app.deptTree);
            }
        };
        //?????????creator  zp
        $scope.setProject = function (node) {
            if (node) {
                // $rootScope.project={}
                // $.extend($rootScope.project,node);
                if (!node.nodes && !node.buildId) {
                    if (node.pid == "") {
                        //????????????
                        $http
                            .post(
                                "/ovu-park/backstage/sale/saleparkhouse/getStageIdByParkId", {
                                parkId: node.id
                            },
                                fac.postConfig
                            )
                            .success(function (resp) {
                                if (resp.code == 0) {
                                    node.nodes = [];
                                    resp.data.forEach(function (n) {
                                        node.nodes.push({
                                            id: n.stageId,
                                            text: n.stageName,
                                            stageId: n.stageId,
                                            stageName: n.stageName,
                                            parkName: n.parkName,
                                            parkId: n.parkId,
                                            pid: n.parkId,
                                            showAdd: true,
                                        });
                                    });
                                }
                            });
                    } else if (!node.buildId) {
                        //????????????
                        $.post(
                            "/ovu-park/backstage/sale/saleparkhouse/getBuildIdByStageId", {
                            stageId: node.id
                        },
                            function (resp) {
                                if (resp.code == 0) {
                                    node.nodes = [];
                                    resp.data.forEach(function (n) {
                                        node.nodes.push({
                                            id: n.buildId,
                                            buildId: n.buildId,
                                            text: n.buildName,
                                            buildName: n.buildName,
                                            parkName: n.parkName,
                                            parkId: n.parkId,
                                            pid: n.stageId,
                                            stageId: n.stageId,
                                            stageName: n.stageName,
                                        });
                                    });
                                }
                            }
                        );
                    }
                }
            }
        };

        //???????????????????????????
        $scope.$on("refreshDeptCache", function (data) {
            loadGlobalDept();
        });

        var deferModule = $q.defer();
        var deferDeptTree = $q.defer();

        function loadGlobalDept(moduleName) {
            $http
                .get("/ovu-base/system/dept/rightTree.do")
                .success(function (resp) {
                    if (resp.code == 0) {
                        if (resp.data == []) {
                            $root.global = true;
                        }
                        $rootScope.deptTree = app.deptTree = resp.data;
                        // $rootScope.expandAll($rootScope.deptTree );
                        deferDeptTree.resolve(resp.data);
                        app.filteredDeptTree = $.extend(true, [], app.deptTree);
                        $rootScope.flatDetpTree = fac.treeToFlat(
                            app.filteredDeptTree
                        );
                        //?????????creator  zp--start----
                        var projectList = [];
                        $rootScope.flatDetpTree.forEach(function (n) {
                            n.authParkIds && projectList.push(n.authParkIds);
                        });
                        if (projectList.length) {
                            $rootScope.projectTree = [];
                            $rootScope.project = {};
                            $http
                                .post(
                                    "/ovu-base/system/park/getWithPath", {
                                    ids: projectList.join(",")
                                },
                                    fac.postConfig
                                )
                                .success(function (resp) {
                                    if (resp.code == 0) {
                                        resp.data.forEach(function (n) {
                                            $rootScope.projectTree.push({
                                                domainId: n.domainId,
                                                parkNo: n.parkNo,
                                                parkName: n.parkName,
                                                text: n.parkName,
                                                id: n.id,
                                                parkId: n.id,
                                                pid: "",
                                                showAdd: true,
                                            });
                                        });
                                        //???????????????????????????
                                        var name =
                                            moduleName || app.curModule.name;
                                        if ($rootScope.projectTree.length > 0) {
                                            var proNode =
                                                $rootScope.projectTree[0];
                                            angular.extend(
                                                $rootScope.project,
                                                proNode
                                            );
                                            proNode.state = {
                                                selected: true
                                            };
                                            if (name == "????????????") {
                                                $scope.setProject(proNode);
                                            }
                                            if (name == "????????????V2") {
                                                $scope.setProject(proNode);
                                            }
                                        }
                                    }
                                });
                        }
                        //?????????--end----
                        if (app.domain.orgType == "propertyManagement") {
                            var parkList = [];
                            $rootScope.flatDetpTree.map(function (n) {
                                if (n.parkId) {
                                    delete n.nodes;
                                    n.fdeptId = n.id;
                                    parkList.push(n);
                                }
                            });
                            $rootScope.firstPark = parkList[0];
                        }
                        var parkListCopy = [];
                        $rootScope.flatDetpTree.map(function (n) {
                            if (n.parkId) {
                                delete n.nodes;
                                n.fdeptId = n.id;
                                parkListCopy.push(n);
                            }
                        });
                        $rootScope.firstParkCopy = parkListCopy[0];
                        $rootScope.filteredDeptTree = $.extend(
                            true,
                            [],
                            app.filteredDeptTree
                        );
                        //??????url????????????parkId ???????????????url?????????park ,?????????????????????????????????
                        var lastDeptId
                        var dept
                        var arr = $rootScope.parseQueryString(window.location.search)
                        if (arr) {
                            var parkId = arr['parkId'];
                            if(parkId){
                                dept = 
                                    $rootScope.flatDetpTree.find(function (n) {
                                        return n.parkId == parkId;
                                    }) 
                                
                            }else{
                                lastDeptId = localStorage.getItem("lastDeptId");
                                dept = 
                                    $rootScope.flatDetpTree.find(function (n) {
                                        return n.id == lastDeptId;
                                    })
                            }


                        } else {
                            lastDeptId = localStorage.getItem("lastDeptId");
                            dept = 
                                $rootScope.flatDetpTree.find(function (n) {
                                    return n.id == lastDeptId;
                                })

                        }
                 
                       
                        //????????????????????????????????????????????????????????????
                        if (!dept && $rootScope.filteredDeptTree.length > 0) {
                            dept = $rootScope.filteredDeptTree[0];
                        }
                        if (undefined != dept) {
                            dept.state = {
                                selected: true
                            };
                            angular.extend($rootScope.dept, {
                                id: dept.id,
                                pid: dept.pid,
                                deptName: dept.text,
                                parkId: dept.parkId,
                                pids: dept.pids,
                                parkName: dept.parkName,
                            });
                            $scope.setDept($rootScope.dept, dept);
                        }
                    }
                });
        }

        function setModule(module) {
            if (module.name == "????????????") {
                //??????????????????????????????
                $scope.$on("to-main", function (event, data) {
                    $scope.engageCount = data;
                });
                //????????????????????????
                var watch = $scope.$watch(
                    "park",
                    function (newValue, oldValue) {
                        if (newValue === oldValue) {
                            return;
                        }
                        if ($scope.park.parkId) {
                            $http
                                .post(
                                    "/ovu-park/backstage/rental/contractApply/engageCount", {
                                    parkId: $scope.park.parkId
                                },
                                    fac.postConfig
                                )
                                .success(function (resp) {
                                    $scope.engageCount = resp.data;
                                });
                        }
                    },
                    true
                );
            }

            !app.deptTree && loadGlobalDept(module.name);

            /*if("/welcome" == $location.$$url){
                // ??????????????????
                if(module.id==1){
                    $location.url("/stat/multipleProjectStat");
                }else if(module.id==2){
                    //??????????????????
                    $location.url("/stat/singleProjectStat");
                }
            }*/
            //  ????????????????????????
            if ("/welcome" == $location.$$url) {
                if (module.id == 1) {
                    $location.url("/stat/singleProjectStat");
                }
            }
            deferModule.resolve(module);
            if ($rootScope.curModule != module) {
                app.curModule = $rootScope.curModule = module;
                /*    if(fac.isNotEmpty(module.mainUrl)){
                    $location.url(module.mainUrl);
                }*/
                $rootScope.menus = $rootScope.curModule.moduleMenu;
                menuData = fac.treeToFlat($rootScope.menus);
                openLastUrl();
                //$state.go("welcome");
                //$location.url("/welcome");

                $("#ajaxBody").addClass("hide").html("");
                //???????????????
                /*if ($.fn.mCustomScrollbar) {
                    $('#menuDiv').mCustomScrollbar({
                        autoHideScrollbar: true,
                        theme: 'minimal',
                        mouseWheelPixels: 160,
                        mouseWheel: { preventDefault: true }
                    });
                }*/
            }
        }
        //??????
        $scope.logout = function () {
            $http.get("/ovu-base/logout").success(function (resp) {
                location.href = "/";
            });
        };
        var menuData;

        //??????????????????
        app.loginPromise = getLoginUser();

        app.loginPromise.then(function (user) {
            //???????????????????????????
            fac.workTypeTree($rootScope);
            $scope.oftenUsedList = localStorage[$rootScope.user.id] ?
                JSON.parse(localStorage.getItem($rootScope.user.id)) :
                [];
            if (user.adminType == "super_admin") {
                $rootScope.global = true;
                $rootScope.menus = [{
                    icon: "",
                    text: "????????????",
                    url: "sys/domain"
                },
                {
                    icon: "",
                    text: "????????????",
                    url: "sys/resource"
                },
                {
                    icon: "",
                    text: "??????????????????",
                    url: "sys/menu"
                },
                {
                    icon: "",
                    text: "APP??????",
                    url: "sys/app"
                },
                {
                    icon: "",
                    text: "????????????",
                    url: "sys/role"
                },
                {
                    icon: "",
                    text: "????????????",
                    url: "sys/version"
                },
                {
                    icon: "fa-cog",
                    text: "????????????",
                    id: "dictManage",
                    nodes: [{
                        text: "???????????????",
                        url: "sys/dictManage/equipmentTypeTree",
                        pids: "dictManage",
                        pid: "dictManage",
                    },
                    {
                        text: "???????????????",
                        url: "sys/dictManage/workTypeTree",
                        pids: "dictManage",
                        pid: "dictManage",
                    },
                    {
                        text: "????????????",
                        url: "workunit/worktype",
                        pids: "dictManage",
                        pid: "dictManage",
                    },
                    {
                        text: "????????????",
                        url: "dictionary/dictionary",
                        pids: "dictManage",
                        pid: "dictManage",
                    },
                    ],
                },
                {
                    icon: "",
                    text: "??????????????????",
                    id: "33333333333",
                    nodes: [{
                        text: "??????????????????",
                        url: "sys/operationlog",
                        pids: "33333333333",
                        pid: 33333333333,
                    },
                    {
                        text: "??????????????????(???)",
                        url: "sys/sysLog",
                        pids: "33333333333",
                        pid: 33333333333,
                    },
                    {
                        text: "??????????????????",
                        url: "sys/monitoringLog",
                        pids: "33333333333",
                        pid: 33333333333,
                    },
                    ],
                },
                {
                    icon: "fa-rss",
                    text: "??????????????????",
                    id: "dataCollect",
                    nodes: [{
                        text: "?????????????????????",
                        url: "videomanagement/camera",
                        pids: "dataCollect",
                        pid: "dataCollect",
                    },
                    {
                        text: "?????????????????????",
                        url: "videomanagement/hardware",
                        pids: "dataCollect",
                        pid: "dataCollect",
                    },
                    {
                        text: "??????????????????",
                        url: "middleware/pushUrl",
                        pids: "dataCollect",
                        pid: "dataCollect",
                    },
                    {
                        text: "?????????????????????",
                        url: "middleware/dataPoint",
                        pids: "dataCollect",
                        pid: "dataCollect",
                    },
                    {
                        text: "??????????????????",
                        id: "megvii",
                        pids: "dataCollect",
                        pid: "dataCollect",
                        nodes: [{
                            text: "????????????",
                            url: "middleware/megvii/attendance",
                            pids: "dataCollect,megvii",
                            pid: "megvii",
                        },],
                    },
                    {
                        text: "?????????????????????",
                        url: "middleware/easylinkin",
                        pids: "dataCollect",
                        pid: "dataCollect",
                    },
                    {
                        text: "????????????????????????",
                        url: "middleware/nisen",
                        pids: "dataCollect",
                        pid: "dataCollect",
                    },
                    {
                        text: "????????????",
                        url: "middleware/airPanel",
                        pids: "dataCollect",
                        pid: "dataCollect",
                    },
                    {
                        text: "????????????",
                        url: "middleware/reformerDoor",
                        pids: "dataCollect",
                        pid: "dataCollect",
                    },
                    {
                        text: "????????????",
                        url: "middleware/suntrans",
                        pids: "dataCollect",
                        pid: "dataCollect",
                    },
                    {
                        text: "RFID",
                        url: "middleware/rfid",
                        pids: "dataCollect",
                        pid: "dataCollect",
                    },
                    {
                        text: "????????????",
                        url: "middleware/linp",
                        pids: "dataCollect",
                        pid: "dataCollect",
                    },
                    {
                        text: "??????????????????",
                        url: "middleware/fireinfo",
                        pids: "dataCollect",
                        pid: "dataCollect",
                    },
                    ],
                },
                {
                    icon: "",
                    text: "????????????",
                    url: "sys/generator"
                },
                ];
                menuData = fac.treeToFlat($rootScope.menus);
                openLastUrl();
            } else {
                var matches = location.search.match(/module=(\d+)/);
                if (matches && matches.length >= 2) {
                    var moduleId = matches[1];
                    $http
                        .get("/ovu-base/getMenu?moduleId=" + moduleId)
                        .success(function (resp) {
                            if (resp.code === 0) {
                                setModule(resp.data);
                            } else {
                                alert(resp.error);
                            }
                        });
                }
            }
        });

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

        var groupParkTreeDefer = $q.defer();
        var singleParkTreeDefer = $q.defer();
        deferModule.promise.then(function (module) {
            var isGroup = module.isGroup;
            $http.get("/ovu-base/system/park/tree").success(function (res) {
                var data = res.data;

                setParkTree(data);
            });

            function setParkTree(data) {
                //????????????tree
                fac.parkCache.parkTree = data;
                $rootScope.parkTree = fac.parkCache.parkTree = data;
                fac.parkCache.parkTreeFlat = fac.treeToFlat(data);
                var tempTree = $.extend(true, [], data);
                tempTree.forEach(function (n) {
                    _removeRealPark(n);
                });
                //????????????????????????????????????????????????????????????????????????????????????
                tempTree = tempTree.filter((item) => !(item.parkType === "1"));

                fac.parkCache.parkTypeTree = tempTree;
                groupParkTreeDefer.resolve(data);

                //??????tree
                fac.parkCache.parkTreePersonal = data;
                fac.parkCache.parkTreePersonalFlat = fac.treeToFlat(data);
                var tempTree = $.extend(true, [], data);
                tempTree.forEach(function (n) {
                    _removeRealPark(n);
                });
                //????????????????????????????????????????????????????????????????????????????????????
                tempTree = tempTree.filter((item) => !(item.parkType === "1"));

                fac.parkCache.parkTypeTreePersonal = tempTree;

                //????????????????????????,????????????
                var finalParks = fac.treeToFlat(data).filter(function (n) {
                    return n.parkType == 1;
                });
                if (finalParks && finalParks.length == 1) {
                    var lastParkId = sessionStorage.getItem("lastParkId");
                    var defaultPark = {};
                    if (lastParkId) {
                        defaultPark = fac.parkCache.parkTreePersonalFlat.find(
                            function (n) {
                                return n.id == lastParkId;
                            }
                        );
                    }
                    if (!defaultPark || !defaultPark.id) {
                        defaultPark =
                            fac.parkCache.parkTreePersonalFlat.find(function (
                                n
                            ) {
                                return n.parkType == 1;
                            }) || {};
                    }
                    app.park = $rootScope.park = defaultPark;
                }

                singleParkTreeDefer.resolve(data);
            }
        });
        app.modulePromiss = $q.all([
            deferDeptTree.promise,
            groupParkTreeDefer.promise,
            singleParkTreeDefer.promise,
        ]);
        //  app.modulePromiss =
        //app.modulePromiss = $q.all([deferModule, deferParkTree.promise]);

        $rootScope.$on("$stateChangeSuccess", function (
            evt,
            toState,
            toParams,
            fromState,
            fromParams
        ) {
            function toMenu() {
                var item;
                var url =
                    toParams.folder +
                    "/" +
                    (toParams.catalogue ? toParams.catalogue + "/" : "") +
                    toParams.page;
                item = menuData.find(function (n) {
                    return n.url && n.url.indexOf(url) > -1;
                });
                if (item) {
                    $scope.selectMenu(item);
                }
            }

            if (toParams.folder && toParams.page) {
                // zg ?????????????????? begin
                $rootScope.config = {
                    edit: true
                };
                // end
                app.loginPromise.then(function (user) {
                    if (user.adminType == "super_admin") {
                        toMenu();
                    } else {
                        app.modulePromiss.then(function () {
                            toMenu();
                        });
                    }
                });
            }
            $rootScope.$broadcast("destory"); // ??????video??????
        });

        $rootScope.pages = [];

        function openPage(node, flag) {


            node.selected = true;
            $scope.curMenu = node;
            var pathinfo = node.url.split("?");
            let global = false;
            if ($rootScope.user.adminType == "super_admin") {
                global = true;
            } else {
                if (pathinfo.length == 2 && pathinfo[1] == "global=true") {
                    global = true;
                }
            }
            var path = pathinfo[0];
            //??????????????????????????????

            if (
                node.url == "inspection/insitem" ||
                node.url == "inspection/insitem?global=true"
            ) {
                if (app.user.adminType == "domain_admin") {
                    global = true;
                    // node.url='inspection/insitem?global=true'
                } else {
                    global = false;
                }
            }

            //???????????????????????????
            if (
                node.url.indexOf("energy") == 0 &&
                node.url !== "energy/alarm/alarms"
            ) {
                $scope.isEnergy = true;
                $http
                    .post("/ovu-energy/energy/monitor/alarm/total", {
                        isHandled: 0,
                    })
                    .success(function (data) {
                        if (data.code == 0) {
                            $scope.alarmCnt = data.data.alarmTotal;
                        } else {
                            $scope.alarmCnt = 0;
                        }
                    });
            } else {
                $scope.isEnergy = false;
            }
            if (flag) {
                setTimeout(() => {
                    $rootScope.pages.active = "/view/" + path + ".html";
                    $scope.$applyAsync();
                }, 1);
                return
            }
            $ocLazyLoad.load("/view/" + path + "Ctrl.js?t=" + Date.now()).then(() => {
                let pageUrl = "/view/" + path + ".html";
                let page = $rootScope.pages.find((n) => n.url == pageUrl);
                if (!page) {
                    $rootScope.pages.push({
                        text: node.text,
                        oriUrl: node.url,
                        url: pageUrl,
                        global: global,
                        powers: node.powers,
                    });
                } else {
                    page.hide = false;
                }
                setTimeout(() => {
                    $rootScope.pages.active = pageUrl;
                    $scope.$applyAsync();
                }, 1);
            });
        }
        window.onhashchange = function (opt) {
            var hash = location.hash;
            var url = hash.slice(2);

            function toMenu() {
                var item;
                item = menuData.find(function (n) {
                    return n.url && n.url.indexOf(url) > -1;
                });
                if (item) {
                    $scope.selectMenu(item);
                }
            }
            $rootScope.config = {
                edit: true
            };
            toMenu();

            $rootScope.$broadcast("destory"); //??????video??????
            console.log("hash has been changed to:", location.hash);

        };

        function openLastUrl() {
            let hash = location.hash;
            if (hash && hash.indexOf("#/") == 0) {
                let url = hash.substr(2);
                let menu = menuData.find((n) => n.url == url);
                if (menu) {
                    openPage(menu);
                }
            }
        }

        $scope.selectPage = function (page) {
            location.hash = page.oriUrl;
            app.powers = page.powers;
            $rootScope.global = page.global;
        };

        $scope.closePage = function (page, $event) {
            let openedPages = $rootScope.pages.filter((n) => !n.hide);
            let index = openedPages.indexOf(page);
            if ($rootScope.pages.active == page.url) {
                let iframes = $(".tab-pane.active iframe");
                if (iframes.length) {
                    for (var i = 0; i < iframes.length; i++) {
                        if (iframes[i].contentWindow.closePlayer) {
                            iframes[i].contentWindow.closePlayer();
                        }
                    }
                }
                if (openedPages.length > 1) {
                    let toBeActivePage =
                        index == 0 ? openedPages[1] : openedPages[index - 1];
                    $rootScope.pages.active = toBeActivePage.url;
                    toBeActivePage.hide = false;
                } else {
                    $rootScope.pages.active = null;
                }
            }
            page.hide = true;
            $event.preventDefault();
            $rootScope.pages.splice(index, 1);
            //$scope.$applyAsync();
            $scope.$broadcast("cloneSocket");
        };
        //????????????Tab
        $scope.closeOtherTab = function () {
            var currTab = $scope.menuTabs[$scope.tabActiveIndex];
            $scope.tabActiveIndex = 0;
            $scope.menuTabs = [];
            $scope.menuTabs.push(currTab);
        };
        //????????????Tab
        $scope.closeAllTab = function (index) {
            $scope.menuTabs = [];
            $("#routeBody").addClass("hide");
        };

        // ??????????????????tab
        $scope.$on("needToClose", function (event, page) {
            $scope.closePage(page, event);
            $scope.$broadcast("needToReload");
        });
        var count = 0;
        $scope.selectMenu = function (node, $event) {


            count++;

            $scope.showMenuList = false;

            function _isAncestorNode(parent, son) {
                if (!parent.nodes) {
                    return false;
                } else if (parent.nodes.indexOf(son) > -1) {
                    return true;
                } else {
                    return parent.nodes.find(function (n) {
                        return _isAncestorNode(n, son);
                    });
                }
            }

            var otherExpandMenu = menuData.find(function (n) {
                return (
                    n.expanded == true && n != node && !_isAncestorNode(n, node)
                );
            });
            otherExpandMenu && (otherExpandMenu.expanded = false);

            if (node.nodes && node.nodes.length) {
                node.expanded = !node.expanded;
            } else {
                //???????????????
                menuData.forEach(function (n) {
                    if (_isAncestorNode(n, node)) {
                        n.expanded = true;
                    }
                });
                //????????????
                if ($scope.curMenu && $scope.curMenu != node) {
                    $scope.curMenu.selected = false;
                }
                //$location.url(node.url);

                if ($event) {
                    //????????????????????????
                    openPage(node);
                } else {
                    openPage(node, true);
                }

                document.body.scrollTop = document.documentElement.scrollTop = 0;
            }

        };
        //??????????????????
        $scope.goCall = function () {
            var node = {
                url: "energy/alarm/alarms",
                text: "?????????????????????",
            };
            openPage(node);
            // $location.url('/energy/alarm/alarms')
        };
        //?????????????????????????????????
        $scope.goToWorkUnit = function () {
            let hash = location.hash;
            if (hash !== "" && hash.indexOf("#/") == 0) {
                let url = hash.substr(2);
                let menu = menuData.find((n) => n.url == url);
                if (menu.url !== "workunit/myworkunit?global=true") {
                    var obj = {
                        text: "????????????",
                        url: "workunit/myworkunit?global=true",
                        powers: "",
                    };
                    openPage(obj);
                }
            } else {
                var obj = {
                    text: "????????????",
                    url: "workunit/myworkunit?global=true",
                    powers: "",
                };
                openPage(obj);
            }
        };

        $scope.alerts = [];
        var echo_websocket;
        $rootScope.taskEq = [];
        $scope.todoCount = 0;

        function send_echo() {
            echo_websocket = new SockJS("/ovu-pcos/pcos/sayhello", null, {
                transports: "websocket",
                timeout: 20000,
            }); //????????? websocket
            echo_websocket.onopen = function () {
                console.log("Info: connection opened.");
            };
            echo_websocket.onmessage = function (event) {
                console.log("Received: " + event.data); //???????????????????????????
                $scope.$apply(function () {
                    var jsonObj = JSON.parse(event.data);
                    //??????????????????
                    if (jsonObj.msg || jsonObj.dataType == "workunit") {
                        if (jsonObj.dataType !== "todoCount") {
                            //??????????????????
                            $scope.alerts.push(jsonObj);
                            jsonObj.equipment_id &&
                                fac.showVideo(jsonObj.equipment_id);
                            if ($scope.alerts.length > 3) {
                                $scope.alerts.shift();
                            }
                        }
                    } else if (jsonObj.dataType == "fire") {
                        //??????????????????
                        if (jsonObj.data.fireList) {
                            $scope.$broadcast(
                                "fireBroadcast",
                                jsonObj.data.fireList
                            );
                        }
                    } else if (jsonObj.dataType == "triggerWarning") {
                        $rootScope.taskEq.unshift(jsonObj.data);
                    }
                    if (jsonObj.dataType == "todoCount") {
                        $scope.todoCount = jsonObj.todoCount;
                    }
                });
            };
            echo_websocket.onclose = function (event) {
                console.log("Info: connection closed.");
                console.log(event);
            };
        }

        send_echo();

        /*  $http.get("/ovu-pcos/pcos/workunit/getStaticWorkunitDB.do").success(function(resp) {
         if (resp.success && (resp.data.DBSX + resp.data.DDB > 0)) {
         $scope.alerts.push({ msg: "?????????????????????: " + resp.data.DBSX + " ???, ???????????????: " + resp.data.DDB + " ???, ??????????????????" })
         }
         })*/

        /* $http.get("http://172.16.11.78:5566/21").success(function(resp) {
                    if (resp.success && (resp.data.DBSX + resp.data.DDB > 0)) {
                        $scope.alerts.push({ msg: "?????????????????????: " + resp.data.DBSX + " ???, ???????????????: " + resp.data.DDB + " ???, ??????????????????" })
                    }
                })
                    $scope.playVideo(1);*/
        var i = 0;
        var getNewWorkunit = function () {
            $http
                .get("/ovu-pcos/pcos/workunit/getNewWorkunit.do")
                .success(function (resp) {
                    if (resp.success && resp.data) {
                        if (resp.data.WORKUNIT_TYPE == 2) {
                            fac.showVedio();
                            $scope.alerts.push({
                                msg: "????????????: " +
                                    resp.data.WORKUNIT_NAME +
                                    ",??????????????????",
                                type: "danger",
                            });
                        } else {
                            $scope.alerts.push({
                                msg: "????????????: " +
                                    resp.data.WORKUNIT_NAME +
                                    ",??????????????????",
                            });
                        }
                    }
                    console.error(++i);
                });
        };
        // var timer = $interval(getNewWorkunit,5000);
        // $interval.cancel(timer);

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };
        //??????????????????
        $scope.showinfo = function (user) {
            var modal = $uibModal.open({
                component: "userInfoModelComponent",
                resolve: {
                    param: user,
                },
            });
            modal.result.then(
                function (node) {
                    user.nickname = node.nickname;
                    user.userIcon = node.userIcon;
                },
                function () { }
            );
        };
        //????????????
        $scope.changePwd = function () {
            var modal = $uibModal.open({
                component: "changePasswordModelComponent",
            });
            modal.result.then(
                function (node) { },
                function () { }
            );
        };
        //????????????????????????
        $scope.showModuleVersionInfo = function (moduleId) {
            var modal = $uibModal.open({
                component: "moduleVersionInfoModelComponent",
                resolve: {
                    param: moduleId,
                },
            });
            modal.result.then(
                function (node) { },
                function () { }
            );
        };

        //?????????????????????
        $scope.$on("refreshParkCache", function (data) {
            var isGroup = app.curModule.isGroup;
            $http
                .get("/ovu-base/system/park/tree.do?isGroup=2")
                .success(function (data) {
                    var data = data.data;
                    setParkTree(data);
                });

            function setParkTree(data) {
                fac.parkCache.parkTree = data;
                fac.parkCache.parkTreeFlat = fac.treeToFlat(data);

                fac.parkCache.parkTreePersonal = data;
                fac.parkCache.parkTreePersonalFlat = fac.treeToFlat(data);

                var tempTree = $.extend(true, [], data);
                tempTree.forEach(function (n) {
                    _removeRealPark(n);
                });
                //????????????????????????????????????????????????????????????????????????????????????
                tempTree = tempTree.filter((item) => !(item.parkType === "1"));

                fac.parkCache.parkTypeTree = tempTree;
                fac.parkCache.parkTypeTreePersonal = tempTree;
            }
        });

        $(document).bind("keydown keypress", function (event) {
            if (event.which === 13) {
                if (
                    $("#editor").length <= 0 &&
                    $("#content").length <= 0 &&
                    $("textarea:focus,:button:focus,.btn:focus,.edui-container")
                        .length <= 0
                ) {
                    var buttons = $(".btn:contains('??????')");
                    for (var i = 0; i < buttons.length; i++) {
                        var button = buttons[i];
                        if ($(button).closest("*:hidden").length) {
                            continue;
                        }
                        $(button).trigger("click");
                        break;
                    }
                    event.preventDefault();
                }
            } else if (event.which === 27) {
                     // ?????????????????????????????????esc ??????????????????????????????load??????????????????????????????load ????????? by Cx
                     $rootScope.$escLayIndex=layer.index
                 
                  
                   
                layer.closeAll("loading");
            }
        });
      
    });
})();
