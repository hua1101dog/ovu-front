(function () {
    "use strict";

  var app = angular.module("app");

    app.controller('patrollingMainCtrl', patrollingMainCtrl);

    function patrollingMainCtrl($scope, $http, AppService) {
        // var vm = this;
        // vm.parkNo = AppService.parkNo;
        // var type = 'watch';
        // vm.type = type;

      var date = new Date();
      var seperator1 = "-";
      var seperator2 = ":";
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentDate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();

      var zeroDate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + "00" + seperator2 + "00" + seperator2 + "00";

      $scope.startTime = zeroDate;
      $scope.endTime = currentDate;

      getCommonRight();

        //联动
      $scope.showDate = function (flag) {
        // debugger;
        if(flag==="start"){
          $scope.startTime = this.startTime;
        }else{
          $scope.endTime = this.endTime;
        }
      };

        //右侧方法
        function getCommonRight() {

           //获取部门id数组
           $http.get('/ovu-screen/pcos/show/dept/list2DeptByParkNo.do',{params:{parkNo:AppService.parkNo}}).success(function (res) {
             $scope.deptList=res.data;

           });
          var personIds = [];
          var perList;
            $scope.onchecked = function (item) {
              personIds.splice(0,personIds.length);
              item.checked = !item.checked;
                // if(item.checked){
                    $scope.deptList.forEach(function(v) {
                      v.personList && v.personList.forEach(function(s){
                        s.checked && personIds.push(s.id);
                      })
                    });
                  console.log(personIds);
                  //获取选中的人员
                  // perList = [];
                    $http.get("/ovu-screen/pcos/show/person/searchPersonPosition.do",{params:{personIds:personIds,startTime:$scope.startTime,endTime:$scope.endTime}}).success(function(res){
                      // perList.push(res.data);
                      perList = angular.copy(res.data) || [];
                      $scope.$broadcast("showPerson",perList);
                      console.log(perList);
                    });
                  console.log('false');
                // }
                // else{
                //     var cancelVal = item.id;
                //     cancelVal = cancelVal.toString();
                //   personIds.forEach(function (v, index) {
                //     if(v === cancelVal){
                //       console.log(index);
                //       personIds.splice(index);
                //     }
                //   });
                //   console.log(personIds);
                //   // perList = [];
                //     $http.get("/ovu-screen/pcos/show/person/searchPersonPosition.do",{params:{personIds:personIds,startTime:$scope.startTime,endTime:$scope.endTime}}).success(function(res){
                //       perList = angular.copy(res.data);
                //       $scope.$broadcast("showPerson",perList);
                //       // console.log(perList);
                //     });
                //   console.log('ture');
                // }

              };
            //点击小图标获取部门人员
          $scope.getPerson = function (id,index) {
            var url = "/ovu-screen/pcos/show/person/listByDept.do";
            var param = { deptId: id };

            if(!$scope.deptList[index].personList){
                $http.get(url, { params: param }).success(function (res) {
                    $scope.deptList[index].personList=res.data;

                })
            }
          }
        }










    }


})();
