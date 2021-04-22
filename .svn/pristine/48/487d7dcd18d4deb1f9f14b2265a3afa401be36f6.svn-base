(function() {
    "use strict";
    window.confirm = function(message,fn){
        layer.confirm(message, {btn: ['确定','取消'],title:false },function(index){ fn && fn();  layer.close(index);},function(){});
    }
    window.msg = function(tip){layer.msg(tip||"操作成功！", {time: 2000, icon:1});}
    window.alert = function(tip){layer.msg(tip||'操作失败！', {time: 2000, icon:5});}


    var app = angular.module("app");
    app.filter("time",function () {
        return function (string) {
            if(string.indexOf(' ') != -1){
                return string.split(' ')[0].replace(/-/g,'/');
            }
        }

    });
    //用于状态由key 转为对应名称: 如1 指 草稿.
    app.filter("keyToValue",function(){
        return function(input,dictList,key,text){
            if(!input&& input!='0') return "";
            if(!dictList) return "";
            if(angular.isArray(dictList[0])){
                var pair = dictList && dictList.find(function(n) {return n[0] == input});
                if(pair){
                    return pair[1];
                }else{
                    dictList[0][1];
                }
            }else{
                key = key ||"ID";
                text = text||"TEXT";
                var obj = dictList.find(function(n) {return n[key] == input});
                return obj && obj[text];
            }
        }
    });
    app.directive("treeView", function() {
        return {
            restrict: "E",
            scope: {
                nodeList: '='
            },
            templateUrl: '/common/tree.html',
            controller: function ($scope) {
                $scope.config = $scope.$parent.config||{edit:true,sort:false};
                $scope.selectNode = $scope.$parent.selectNode;
                $scope.sort = $scope.$parent.sort;
                $scope.undo = $scope.$parent.undo;
                $scope.save = $scope.$parent.save;
                $scope.delNode = $scope.$parent.delNode;
                $scope.addSon = $scope.$parent.addSon;
                $scope.check = $scope.$parent.check;
                $scope.editNode = $scope.$parent.editNode;
            }
        };
    });

    app.directive("treeEquip", function() {
        return {
            restrict: "E",
            scope: {
                nodeList: '=',
                pnode:"=",
                config:"="
            },
            templateUrl: '/view/equipment/treeEquip.html',
            controller: function($scope){
                $scope.config = $scope.$parent.config||{edit:true,sort:false};
                $scope.selectNode = $scope.$parent.selectNode;
                $scope.sort = $scope.$parent.sort;
                $scope.undo = $scope.$parent.undo;
                $scope.save = $scope.$parent.save;
                $scope.delNode = $scope.$parent.delNode;
                $scope.addSubType = $scope.$parent.addSubType;
                $scope.addBrandModel = $scope.$parent.addBrandModel;
                $scope.check = $scope.$parent.check;
                $scope.editNode = $scope.$parent.editNode;
            }
        };
    });

    app.directive("layerSelect", function() {
        return {
            restrict: "E",
            scope: {
                host:'=',
                nodeList: '=',
                selectMethod: '=',
                pnode:"="
            },
            templateUrl: '/common/layerSelect.html',
            controller: function($scope){
                $scope.selectNode = $scope.$parent.selectNode;
                if($scope.selectMethod){
                    $scope.selectNode = $scope.selectMethod;
                }
            }
        };
    });

    app.directive('imageLoad', function () {
        return {
            restrict: 'A', link: function (scope, element, attrs) {
                element.bind('load', function () {
                    //call the function that was passed
                    scope.$apply(attrs.imageLoad);
                });
            }
        };
    })

    app.factory("fac", function($http,$q,$rootScope,$uibModal,$compile) {
        var dicts = {
                 statusList:[["","在职"],[1,"在职"],[2,"停薪留职"],[3,"离职"]]
                ,job_statusDict:[[1,"在职"],[2,"停薪留职"],[3,"离职"]]
                ,personChangeDict:[[0,"入职"],[1,"调岗"],[2,"停薪留职"],[3,"离职"]]
                ,sourceDict:[[1,"系统后台"],[2,"员工APP"],[3,"业主APP"]]
                ,sourceLog:[[1,"员工"],[2,"主任"]]
                ,groupDict:[[2,"集团"],[3,"项目"]]
                ,yesNoDict:[[1,"是"],[2,"否"]]
                ,valTypeDict:[[1,"文本"],[2,"数值"],[3,"选择"]]
                ,sensorDataDict:[[1,"数值"],[2,"离散状态"]]
                ,operTypeDict:[['1',"照片"],['2',"文本"],['3',"选择"]]
                ,eventTypeDict:[[0,"自检"],[1,"代客"]]
                //,[2,"热线电话报事"],[3,"维保报事"],[4,"其他报事"],[9,"自发派单"]
                ,superviseStatusDict:[[0,"待督办"],[1,"已督办"]]
                ,workunitTypeDict:[[1,"计划"],[2,"应急"]]
                ,importantLevelDict:[[0,"低"],[1,"中"],[2,"高"]]
                ,periodDict : ["年","季","月","周","日","时"]
                ,unitStatusDict:[[0,"待派发"],[1,"已派发"],[4,"已退回"],[5,"已接单"],[7,"已执行"],[8,"已评价"]]
                ,equipStatusDict:[[1,"运行"],[2,"停用"],[3,"故障"],[4,"报废"]]
                ,equipTypeDict:[['elevator',"电梯"],['camera',"摄像头"],['parkingLot',"停车场"],['waterMeter',"水表"],['ammeter',"电表"],['energy',"能源表"],['space',"空间"],['assets',"资产"],['company',"企业"],['ad',"广告位"],
                ['temperature',"温湿度传感器"],['infrared',"红外传感器"],['gate',"门禁传感器"],['smoke',"烟感传感器"],['waterLevel',"液位传感器"],['pressure',"压力传感器"],['current',"电流阈值传感器"],['electric',"电参数综合传感器"]]
                ,yetaiDict:[['SY',"商业"],['SX',"商业写字楼"],['SZ',"商业住宅"],['XZ',"写字楼"],['PZ',"普通住宅"],['BZ',"别墅住宅"],['YQ',"产业园区"],['ZL',"展览馆"]]
                ,evaluateScoreDict:[[1,"★"],[2,"★★"],[3,"★★★"],[4,"★★★★"],[5,"★★★★★"]]
                ,dataTypeDict:[[1,"培训考试结果"],[2,"设备注册登记结果"]]
                ,newsTypeDict:[[1,"图片新闻"],[2,"文字新闻"]]
                ,auditingStatusDict:[[0,"未审核 "],[1,"审核不通过"]]
            };
        $rootScope.showPhoto = function() {
            var src = event.srcElement.getAttribute("src");
            if (src.indexOf("?imageView2") > -1) {
                src = src.substr(0, src.indexOf("?imageView2"));
            }
            $rootScope.curPic = { url: src, on: true };
            //if(isHasImg(src)){
            //
            //}
        }
        //新版:是否有某项操作权限
        $rootScope.hasPower= function(power){
            if(app.powers && app.powers.indexOf(power)>-1){
                return true;
            }
            return false;
        }

        $rootScope.showWorkUnitDetail = function(workunitId){
            var modal = $uibModal.open({
                animation: false,
                size:"lg",
                templateUrl: '/view/workunit/modal.workunitDetail.html',
                controller: 'workUnitDetailModalCtrl'
                ,resolve: {workunitId: function(){return workunitId}}
            });
        }
        $rootScope.showEquipDetail = function(equipmentId){
            var modal = $uibModal.open({
                animation: false,
                size:"lg",
                templateUrl: '/view/equipment/modal.equipDetail.html',
                controller: 'equipDetailModalCtrl'
                ,resolve: {equipmentId: function(){return equipmentId}}
            });
        }
        $rootScope.showSensorDetail = function(sensorId){
            var modal = $uibModal.open({
                animation: false,
                size:"lg",
                templateUrl: '/view/equipment/modal.sensorDetail.html',
                controller: 'sensorDetailModalCtrl'
                ,resolve: {sensorId: function(){return sensorId}}
            });
        }
        $rootScope.wheel = function () {
            wheelzoom(event.target);
        }
        $rootScope.checkAll = function(data){
            data.checked = !data.checked;
            data.list.forEach(function(n){n.checked = data.checked});
        }
        $rootScope.expandAll = function(tree){
           var list =  treeToFlat(tree);
            tree.expanded=!tree.expanded;
            list.forEach(function(n){
                n.state = n.state||{};
                n.state.expanded =tree.expanded ;
            })
        }
        $rootScope.checkOne = function(item){item.checked = !item.checked;}
        $rootScope.hasChecked = function(data){
            if(data && data.list && data.list.length){
                return data.list.filter(function(n){return n.checked}).length;
            }
            return false;
        }
        $rootScope.showPhoto = function() {
            var src = event.srcElement.getAttribute("src");
            if (src.indexOf("?imageView2") > -1) {
                src = src.substr(0, src.indexOf("?imageView2"));
            }
            $rootScope.curPic = { url: src, on: true };
            //if(isHasImg(src)){
            //
            //}
        }
            $rootScope.addPhotos = function(item, field) {
                upload({ url: "/ovu-base/uploadImg.do" }, function(resp) {
                    if (resp.success && resp.list.length) {
                        item[field] = resp.list[0].url;
                        $rootScope.$apply();
                    } else {
                        alert(resp.error);
                    }
                })
            }
        $rootScope.addPhotos = function(picList,limit) {
            if(limit && picList.length >= limit ){
                alert('上传图片限制为'+limit+'张!');
                return;
            }
            upload({ url: "/ovu-base/uploadImg.do" }, function(resp) {
                console.log(resp.length);
                if (resp.success && resp.list.length) {
                    resp.list.forEach(function(n) {
                        picList.push(n.url);
                        if(resp.list.length >limit){
                            alert('上传图片限制为' + limit + '张');
                            return;
                        }
                    })

                    $rootScope.$apply();
                } else {
                    alert(resp.error);
                }
            })
        }
        $rootScope.clearPhoto = function(item, field) {
            confirm("确定清除照片吗？", function() {
                item[field] = '';
                $rootScope.$apply();
            })
        }
        $rootScope.delPhoto = function(picList, pic) {
            confirm("确定删除照片吗？", function() {
                picList.splice(picList.indexOf(pic), 1);
                $rootScope.$apply();
            })
        }

        $rootScope.processImgUrl = function(imgUrl,width) {
            if (imgUrl && imgUrl.indexOf("http") == 0) {
              if ('origin' == width) {
                return imgUrl;
              } else if (width && !isNaN(width)) {
                //指定了宽度
                return imgUrl + "?imageView2/2/w/" + width;
              }
              return imgUrl;
              //return imgUrl + "?imageView2/2/w/100";
            } else {
              return '/ovu-base/' + imgUrl;
            }
        }
        var postConfig = {
            transformRequest:function(obj){
                var str=[];
                if(typeof obj === 'object'&&!obj.length){
                    for(var p in obj){
                        if(obj[p] === null ||obj[p] === undefined ||obj[p]===""){
                            //str.push(encodeURIComponent(p) +"=");
                        }else if(typeof obj[p] ==='object' && obj[p].length === undefined){
                            continue;
                        }else if(angular.isArray(obj[p])){
                            continue;
                        }else{
                            str.push(encodeURIComponent(p) +"="+encodeURIComponent(obj[p]));
                        }
                    }
                }else if(typeof obj === 'object'&&obj.length>0){
                    for(var p in obj){
                        str.push(encodeURIComponent(obj[p].name) +"="+encodeURIComponent(obj[p].value));
                    }
                }
                return str.join("&");
            },
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        };
        function treeToFlat(treeData){
            var list = [];
            function pushNode(nodes){
                nodes.forEach(function(n){
                    list.push(n);
                    if(n.nodes && n.nodes.length){
                        pushNode(n.nodes);
                    }
                })
            }
            pushNode(treeData);
            return list;
        }
        function isHasImg(pathImg){
            var ImgObj=new Image();
            ImgObj.src= pathImg;
            if(ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0))
            {
                return true;
            } else {
                return false;
            }
        };
        function upload(options, fn) {
            if (typeof(options.params) != "object") {
                options.params = {};
            }
            if (!options.url) {
                options.url = '/ovu-base/uploadImg.do';
            }
            var index;
            if (options.nowait) {
                options.onSubmit = function() {};
            } else {
                options.onSubmit = function() {
                    index = layer.load(1, {
                        shade: [0.2, '#000'] //0.1透明度的白色背景
                    });
                };
            }
            options.onComplate = function(data) {
                layer.close(index);
                if (Array.isArray(data)) {
                    fn && fn(data);
                } else if ("object" == typeof data) {
                    if (data.success || data.status == 1) {
                        fn && fn(data);
                    } else {
                        layer.alert(data.error || "上传发生错误!", { btn: ['ok'], title: false });
                    }
                } else if ("string" == typeof data && data.indexOf('url') != -1) {
                    data = JSON.parse(data);
                    if (data.success || data.status == 1) {
                        fn && fn(data);
                    } else {
                        layer.alert(data.error || "上传发生错误!", { btn: ['ok'], title: false });
                    }
                } else {
                    layer.alert("发生错误:" + data, { btn: ['ok'], title: false });
                }
            };
            // 上传方法
            $.upload(options);
        }
        function isEmpty(value){
        	return angular.isUndefined(value) || value == null || (angular.isString(value) && value == "") || value.length == 0;
        }
        function isNotEmpty(value){
        	return !this.isEmpty(value);
        }
        function hasActivePark(search) {
            if (!search.isGroup && (!search.parkId || search.parkId=='0')) {
                alert("请选择项目！");
                return false;
            } else {
                return true;
            }
        }
        return {
            postConfig:postConfig,
            dicts:dicts,
            getSessionInfo:function(scope){
                var deferred = $q.defer();
                $http.get("/getSessionInfo.do").success(function(data, status, headers, config) {
                    deferred.resolve(data);
                    if(data.user){
                        scope.user = data.user;
                        scope.user.personId = data.personId;
                        scope.park = data.park;
                    }else{
                        confirm("会话已失效，请重新登录！",function(index){
                            window.location.href="/login.html";
                        });
                    }
                })
                return deferred.promise;
            },
            //获取分页查询结果
            getPageResult:function(url,param,fn){
                param.pageIndex = param.currentPage && param.currentPage-1;
                $http.post(url,param,postConfig).success(function(data, status, headers, config){
                    data.currentPage = data.pageIndex+1;
                    data.totalPage = data.pageTotal;
                    param.totalCount = data.totalRecord =data.totalCount;
                    if(data.data && data.data.length>=0){
                        data.list = data.data;
                    }

                    /**
                     * 始终得有第一页和最后一页.当前页 ,前一页,后一页.
                     */
                    var list =[1,data.currentPage-1,data.currentPage,data.currentPage+1,data.totalPage];
                    var pages = [];
                    var hash ={};
                    list.forEach(function(v){
                        if(!hash[v]&& v<=data.totalPage && v>0){
                            hash[v] =true;
                            pages.push(v);
                        }
                    })
                    if(pages.length>2&&pages.indexOf(2)==-1){
                        pages.splice(1,0,'······');
                    }
                    if(pages.length>2&&pages.indexOf(data.totalPage-1)==-1){
                        pages.splice(pages.length-1,0,'······');
                    }
                    data.pages = pages;
                    fn&&fn(data);
                }).error(function(data, status, headers, config) {
                    console.log("获取列表异常");
                });
            },

            /**
             * 获得项目根路径
             * */
            getRootPath:function() {
                var pathName = window.location.pathname.substring(1);
                var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
                if (webName == "") {
                    return window.location.protocol + '//' + window.location.host;
                }
                else {
                    return window.location.protocol + '//' + window.location.host + '/' + webName;
                }
            },

            isHasImg:isHasImg,
            // 本地导入
            upload: upload,
            isEmpty:isEmpty,
            isNotEmpty:isNotEmpty,
            treeToFlat:treeToFlat,
            //reveal:是否显示此节点及其父节点
            getNodeById:function(treeData,id,reveal){
                var list = treeToFlat(treeData);
                var target = list.find(function(n){return n.id == id });
                if(reveal){
                    var pid = target.pid;
                    while(!!pid){
                        var pnode = list.find(function(n){return n.id == pid });
                        pnode.state = pnode.state||{};
                        pnode.state.expanded = true;
                        pid = pnode.pid;
                    }
                }
                return target;
            },

        }});
})();
