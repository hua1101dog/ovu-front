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
    app.controller('projectInfoIndexCtrl', function ($scope, $rootScope, $http, $filter, $uibModal, fac) {
        document.title = "OVU-项目信息";
        $scope.parkInfo = {}
        $scope.search = {};
        $scope.item = {fileName:"",filePath:""}
        $scope.projectTagList=[]
        $scope.projectFormList=[]
        fac.loadSelect($scope, "REAL_ESTATE_TYPE")  //地产类别realEstateList
        //fac.loadSelect($scope, "PROJECT_LABEL") //项目标签projectTagList
        //fac.loadSelect($scope, "PROJECT_FORM") //项目业态projectFormList
        $scope.photoArr=[]
        $scope.projectInfo = {realEstateType:1};
        //var editor;
        //E = window.wangEditor;
        // editor = new E('#highEditor');
        // editor.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片
        // editor.create();
        let getProjectLabel = new Promise(function (resolve, reject) {
            $http.get("/ovu-base/system/dictionary/get?item=PROJECT_LABEL").success(function(resp){
                if(resp.code == 0){
                    $scope.projectTagList=resp.data;
                    resolve(resp.data)
                }else{
                    reject([])
                }
            });
        })
        
        let getProjectForm = new Promise(function (resolve, reject) {
            $http.get("/ovu-base/system/dictionary/get?item=PROJECT_FORM").success(function(resp){
                if(resp.code == 0){
                    $scope.projectFormList=resp.data;
                    resolve(resp.data)
                }else{
                    reject([])
                }
            });
        })
        //
        $scope.getProjectInfo = function () {
            $scope.projectInfo={}
            $http.get("/ovu-park/backstage/projectInfo/queryInfo?parkId="+$scope.search.parkId).success(function (res) {
                if(res.data){
                    $scope.projectInfo=res.data
                    //项目标签
                    // if(res.data.tag){
                    //     let tagArr=res.data.tag.split(",")
                    //     tagArr&&tagArr.forEach(e=>{
                    //         $scope.projectTagList.find(p=>{
                    //             if(p.dicSort==e){
                    //                 p.selTag=true
                    //                 return
                    //             }
                    //         })
                    //     })
                    //     delete $scope.projectInfo.tag
                    // }
                    //项目业态
                    if(res.data.industryCondition){
                        let selConditions=JSON.parse(res.data.industryCondition)
                        selConditions&&selConditions.forEach(e=>{
                            $scope.projectFormList.find(p=>{
                                if(p.dicSort==e.type){
                                    p.picArr=[e.pics]
                                    p.checked=true
                                    return
                                }
                            })
                        })
                        delete $scope.projectInfo.industryCondition
                    }
                    //项目图片
                    res.data.photos&&($scope.photoArr=res.data.photos.split(","))
                    //项目亮点
                    // if(res.data.highlights){
                    //     editor.txt.html(res.data.highlights);
                    //     delete $scope.projectInfo.highlights
                    // }
                }
                // if(!res.data||!res.data.id){
                    //$scope.projectInfo={realEstateType:1}
                    if(!res.data||!res.data.realEstateType){
                        $scope.projectInfo.realEstateType=1
                    }
                    $http.post("/ovu-base/system/park/getWithPath", {
                        ids: $scope.search.parkId
                    }, fac.postConfig).success(function (resp) {
                        if (resp.data && resp.data.length > 0) {
                            $scope.projectInfo.parkId = resp.data[0].id;
                            $scope.projectInfo.parkName = resp.data[0].parkName;
                            $scope.projectInfo.parkAddress = resp.data[0].address;
                            $scope.projectInfo.city=resp.data[0].city;
                            $scope.projectInfo.cityCode=resp.data[0].cityCode;
                        }
                    })
               // }
            })
           
        };
        $scope.uploadImg = function (item){
            if(!item.picArr){
                item.picArr=[]
            }
            $rootScope.addPhotos(item.picArr);
        }
        //上文件
        $scope.uploadFile = function () {
            $("input[type=file][name='upfile']").click();
            $("input[type=file][name='upfile']").unbind("change");
            $("input[type=file][name='upfile']").on("change", function (e) {
                let curFile = $("#upfile")[0].files[0];
                let fileName = curFile.name;
                let express = fileName.substring(
                    fileName.lastIndexOf(".")
                );
                $scope.fileObj = curFile;                
                $rootScope.$apply();
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
                        "Content-Type": "multipart/form-data"
                    },
                };
                        
                  $http.post("/ovu-base/getQiNiuToken").success(function (resp) {
                    if (resp.code == 0) {
                        console.log(resp)
                        // const formdata={}
                        const formdata = new FormData();
                        console.log($scope.fileObj)
                        // formdata.file=$scope.fileObj
                        // formdata.token=resp.data.token
                        // const formdata = new FormData();
                        formdata.append("file", $scope.fileObj);                      
                        formdata.append("token", resp.data.token);
                        console.log(formdata)
                        this.erroMessage = false;
                        // $http.post("https://upload.qiniup.com",
                        // formdata ,postConfig).success(function (resp) {
                        //     if (resp.code == 0) {
                        //         console.log(resp)
                        //       }
                        // })
                        var aa="";
                        $.ajax({
                            //几个参数需要注意一下
                                type: "POST",//方法类型
                                dataType: "json",//预期服务器返回的数据类型
                                url: "https://upload.qiniup.com" ,//url
                                data: formdata,
                                processData:false,
                                contentType:false,
                                async: false,
                                success: function (result) {
                                    console.log(result);//打印服务端返回的数据(调试用)
                                    $scope.projectInfo.videohttp=resp.data.qiniuDomain+result.key
                                    console.log( $scope.projectInfo.videohttp)
                                    aa=resp.data.qiniuDomain+result.key
                                    if (result.resultCode == 200) {
                                        alert("SUCCESS");
                                    }
                                    ;
                                },
                                error : function() {
                                    alert("异常！");
                                }
                            });
                      
                      }
                })
               
            })
           
        };
        
        console.log($scope.projectInfo)
        
        $scope.delFile = function(file){
        	$scope.items.splice($scope.items.indexOf(file), 1);
        }
        $scope.resetData=function(){
            $scope.photoArr=[];
            //editor.txt.html('');
            // $scope.projectTagList.forEach(v=>{
            //     v.selTag=false
            // })
            // $scope.projectTagList.forEach(v=>{
            //     v.selTag=false
            // })
            $scope.projectFormList.forEach(p=>{
                p.picArr=[]
                p.checked=false
            })
        }
        // 保存
        $scope.save = function (form, item) {
            confirm("确定保存吗？",function(){
                form.$setSubmitted(true);
                if (!form.$valid) {
                    alert("请完成必填选项！");
                    return;
                }
                let tempTag=[]
                let industryCondiArr=[]
                let title=''
                // if($scope.projectInfo.id){
                //     $scope.projectInfo.type=0
                //     title='修改成功！'
                // }else{
                //     $scope.projectInfo.type=1
                //     title='新增成功！'
                // }
            
                // $scope.projectTagList&&$scope.projectTagList.forEach(tag => {
                //     if(tag.selTag){
                //         tempTag.push(tag.dicSort)
                //     }
                // });
                // if(tempTag.length==0){
                //     window.alert("请勾选项目标签！");
                //     return
                // }
                // $scope.projectInfo.tag=tempTag.join(",")
                for(var i=0;i<$scope.projectFormList.length;i++) {
                    let element=$scope.projectFormList[i]
                    if(element.checked){
                        if(!element.picArr||element.picArr.length==0){
                            window.alert("请上传勾选的项目业态图片！");
                            return
                        }
                        industryCondiArr.push({type:element.dicSort,text:element.dicItem,pics:element.picArr[element.picArr.length-1]})
                    }
                };
                if(industryCondiArr.length==0){
                    window.alert("请勾选项目业态！");
                    return
                }
                $scope.projectInfo.industryCondition=JSON.stringify(industryCondiArr);
                if($scope.photoArr.length==0){
                    window.alert("请上传项目图片！")
                    return
                }
                $scope.projectInfo.photos=$scope.photoArr.join(",")
                // if(!$("#highEditor .w-e-text").text()){
                //     window.alert("项目亮点不能为空！");
                //     return false;
                // }else if($("#highEditor .w-e-text").text().length >1000){
                //     window.alert("项目亮点长度不能超过1000！");
                //     return false;
                // }
                // var content = $("#highEditor .w-e-text").html()+"";
                //$scope.projectInfo.highlights = content;
                $http.post("/ovu-park/backstage/projectInfo/saveOrUpdateInfo", $scope.projectInfo, fac.postConfig).success(function (resp) {
                    if (resp.code === 0) {
                        window.msg(resp.msg);
                        $scope.getProjectInfo()
                    } else {
                        window.alert(resp.msg);
                    }
                })
            });
        }

        app.modulePromiss.then(function () {

            $scope.$watch('dept.id', function (deptId, oldValue) {
                $scope.resetData()
                if (deptId) {
                    if ($scope.dept.parkId) {
                        $scope.search.parkId = $scope.dept.parkId;
                        if($scope.projectFormList.length>0){
                            $scope.getProjectInfo()
                        }else{
                            Promise.all([ getProjectForm]).then(function (results) {
                                console.log("kkkk",results[0])
                                if(results[0].length>0){
                                    
                                    $scope.getProjectInfo()
                                }
                            })
                        }
                    } else {
                        $scope.projectInfo = {realEstateType:1};
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
