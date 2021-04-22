(function () {
    //ueditor和umeditor样式存在冲突，页面移除umeditor.css
    function removeStyles(){
        var filename = 'umeditor.css';  //移除引入的文件名
        var targetelement = "link";
        var targetattr = "href";
        var allsuspects = document.getElementsByTagName(targetelement)
        for (var i = allsuspects.length; i>=0 ; i--){
            if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1) {
                allsuspects[i].parentNode.removeChild(allsuspects[i])
            }
        }
    }
    removeStyles();
    
    var app = angular.module("angularApp");
    app.controller('projectDetailndexCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-项目详情";
        fac.loadSelect($scope, "PROPERTY_CATEGORY")  //物业类别workTypeList
        fac.loadSelect($scope, "INDUSTRY_THEME") //产业主题themeList
        //$scope.themeList=[{dicItem:'文化创意',dicVal:1},{dicItem:'智能制造',dicVal:2}]
        // $scope.workTypeList=[{text:'独栋办公',value:1},{text:'高层',value:2},
        // {text:'厂房',value:3},{text:'商业',value:4},{text:'公寓',value:5},{text:'酒店',value:6},]
        // E = window.wangEditor;
        // var introEditor = new E('#introEditor');
        // introEditor.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片
        // introEditor.create();
        // var locationEditor = new E('#locationEditor');
        // locationEditor.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片
        // locationEditor.create();
        // var trafficEditor = new E('#trafficEditor');
        // trafficEditor.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片
        // trafficEditor.create();
        // var investmentEditor = new E('#investmentEditor');
        // investmentEditor.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片
        // investmentEditor.create();
        $scope.proDetail={
            theme:"1",
            propertyType:"1"
        }
        $scope.search ={};
        // 查询详情
        $scope.getProjectInfo = function () {
            $http.get("/ovu-park/backstage/projectInfo/queryInfo?parkId="+$scope.search.parkId).success(function (res) {
                if(res.data){
                    $scope.proDetail=res.data
                    // if(res.data.introduction){
                    //     introEditor.txt.html(res.data.introduction);
                    // }
                    // if(res.data.locationAdvantage){
                    //     locationEditor.txt.html(res.data.locationAdvantage);
                    // }
                    // if(res.data.trafficAdvantage){
                    //     trafficEditor.txt.html(res.data.trafficAdvantage);
                    // }
                    // if(res.data.investmentPolicy){
                    //     investmentEditor.txt.html(res.data.investmentPolicy);
                    // }
                }else{
                    $scope.proDetail={
                        theme:"1",
                        propertyType:"1"
                    }
                }
            })
           
        };

        // 保存
        $scope.save = function (form, item) {
            // if($scope.proDetail.id){
            //     $scope.proDetail.type=0
            //     title='修改成功！'
            // }else{
            //     $scope.proDetail.type=1
            //     title='新增成功！'
            // }
            if(item.vrhttp){
                if(item.vrhttp.substring(0, 8)!='https://' && item.outAddress.substring(0, 7)!='http://'){
                    alert('请输入正确地址')
                    return false
               }else{

               }
            }
            confirm("确定保存吗？",function(){
                $scope.proDetail.parkId=$scope.search.parkId
                // if(!$("#introEditor .w-e-text").text()&&($("#introEditor .w-e-text").text().length >1000)){
                //     window.alert("项目简介长度不能超过1000！");
                //     return false;
                // }
                // $scope.proDetail.introduction=$("#introEditor .w-e-text").html()+""
                // if(!$("#locationEditor .w-e-text").text()&&($("#locationEditor .w-e-text").text().length >1000)){
                //     window.alert("区位优势长度不能超过1000！");
                //     return false;
                // }
                // $scope.proDetail.locationAdvantage=$("#locationEditor .w-e-text").html()+""
                // if(!$("#trafficEditor .w-e-text").text()&&($("#trafficEditor .w-e-text").text().length >1000)){
                //     window.alert("交通优势长度不能超过1000！");
                //     return false;
                // }
                // $scope.proDetail.trafficAdvantage=$("#trafficEditor .w-e-text").html()+""
                // if(!$("#investmentEditor .w-e-text").text()&&($("#investmentEditor .w-e-text").text().length >1000)){
                //     window.alert("招商政策长度不能超过1000！");
                //     return false;
                // }
                // $scope.proDetail.investmentPolicy=$("#investmentEditor .w-e-text").html()+""
                $http.post("/ovu-park/backstage/projectInfo/saveOrUpdateInfo", $scope.proDetail, fac.postConfig).success(function (resp) {
                    if (resp.code === 0) {
                        window.msg(resp.msg);
                        $scope.getProjectInfo()
                    } else {
                        window.alert(resp.msg);
                    }
                })
            })
        }

        app.modulePromiss.then(function () {

            $scope.$watch('dept.id', function (deptId, oldValue) {
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId;
                        $scope.search.parkName = app.park.parkName;
                        $scope.getProjectInfo();
                        
                    } else {
                        $scope.proDetail={
                            theme:"1",
                            propertyType:"1"
                        }
                        $scope.search = {};
                    }
                } else {
                    $scope.search = {};
                }
                //$scope.find();
            })
        });
    });
})()
