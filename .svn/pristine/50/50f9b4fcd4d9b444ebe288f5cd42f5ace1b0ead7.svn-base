/**
 * Created by Administrator on 2017/7/26.
 */

(function() {
    document.title = "OVU-设备台帐";
    var app = angular.module("angularApp");

    app.controller('websocketCtrl', function ($scope, $rootScope,$http,$interval,fac) {
        $scope.alerts = [];
        var echo_websocket;
        function send_echo() {
            echo_websocket = new SockJS("/ovu-pcos/pcos/sayhello");   //初始化 websocket
            echo_websocket.onopen = function () {
                console.log('Info: connection opened.');
            };
            echo_websocket.onmessage = function (event) {
                console.log('Received: ' + event.data); //处理服务端返回消息
                $scope.$apply(
                    function () {
                        var data = JSON.parse(event.data);
                        //新的应急工单
                        if(data.type == 1){
                            $scope.alerts.push(JSON.parse(event.data));
                            if ($scope.alerts.length > 3) {
                                $scope.alerts.shift();
                            }
                        }else if(data.type == 2){

                        }
                    }
                )
            };
            echo_websocket.onclose = function (event) {
                console.log('Info: connection closed.');
                console.log(event);
            };
        }
        send_echo();


        
        $http.get("/ovu-pcos/pcos/workunit/getStaticWorkunitDB.do").success(function(resp){
            if(resp.success && (resp.data.DBSX+resp.data.DDB>0)){
                $scope.alerts.push({msg:"您有待处理工单: "+resp.data.DBSX+" 个, 待督办工单: "+resp.data.DDB+" 个, 请及时处理！"})
            }
        })

        var i =0;
        var getNewWorkunit = function(){
            $http.get("/ovu-pcos/pcos/workunit/getNewWorkunit.do").success(function(resp){
                if(resp.success && resp.data){
                    if(resp.data.WORKUNIT_TYPE==2){
                    	fac.showVedio();
                        $scope.alerts.push({msg:"应急工单: "+resp.data.WORKUNIT_NAME+",请及时处理！",type:"danger"})
                    }else{
                        $scope.alerts.push({msg:"计划工单: "+resp.data.WORKUNIT_NAME+",请及时处理！"})
                    }
                }
                console.error(++i);
            });
        }
        // var timer = $interval(getNewWorkunit,5000);
        // $interval.cancel(timer);

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

    });

    angular.bootstrap(document.getElementById("pushMessageDiv"), ['angularApp']);
})();