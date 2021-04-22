(function(angular, doc) {
    // 避免重复加载 尤其是使用component一定不能重复加载
    var invokes = angular.module('angularApp')
        ._invokeQueue
        .map(function(v) {
            return v[2][0];
        });

    var loaded = invokes.some(function(v) {
        return v === 'energySaveBim';
    });

    if (loaded) {
        return;
    }

    var app = angular.module('angularApp');

    app.component('energySaveBim', {
        templateUrl: '../view/equipment/monitoring/detail/BIM/energySave.html',
        bindings: {},
        controller: 'energySaveBimCtrl',
        controllerAs: 'vm'
    });

    // BIM 控制器
    app.controller('energySaveBimCtrl', ['$scope', '$http', '$rootScope', '$window', '$interval', 'fac',
        function($scope, $http, $rootScope, $window, $interval, fac) {
            
    	    //projId 为什么写成固定的。
    	    var projId = "d0827042-d246-4940-97aa-4e067a6275b7";

            var parkId = $scope.$parent.projectId;
            if (parkId === undefined) {parkId = '';}
            console.log('parkId.................');
            console.log(parkId);    	    
    	    
            var bimEngine = new BIMVIZ.RenderEngine({
                projectId: projId,
                renderDomId: 'viewport',
                ip: "116.211.5.54",
                port: 7005,
                key: 'bc29bc21-4544-41d2-b22e-4992e3725180',
                resizeMode: 'fullpage',
                resourcePath: '../sdk/viz/data/'
            });

            // var msgControl = new BIMVIZ.UI.DefaultMessageControl(bimEngine, 'messages');

            bimEngine.start();

           var _elementRGBA = [0.8, 0.6, 0.0, 1.0]; 
           var _eventRGBA = [1.0, 0.0, 0.0, 1.0]; //事件设备定位选中的颜色      

            bimEngine.addListener(BIMVIZ.EVENT.OnPickElement, function(evt) {
                //debugger;
                //console.log(evt);
                //bimEngine.flyToElement(evt.args.GlobalId)
            });
            
            
            $scope.$on('equmentClick', function(e, data) {
            	console.log('getdong');
            	debugger;
            	showAlarm(data.bim_id,_elementRGBA);
            });


           $scope.$on('equmentThingClick', function(e, data) {
            	console.log('getdong');
            	debugger;
            	showAlarm(data.bim_id,_eventRGBA);
            });
            
            function flyFromTo(position, target) {
            	bimEngine.flyFromTo(position, target);
            }
            


            var _eventEqBimId = '';
            
            function showAlarm(new_eventEqBimId,elementColor){
                 
            	bimEngine.resetElementRGBA(_eventEqBimId);

            	_eventEqBimId = new_eventEqBimId;

            	//设备定位选中的颜色
            	bimEngine.changeElementRGBA(_eventEqBimId, elementColor);
            	if(_eventEqBimId=="7ee2d2b1-3e05-43ef-bb1c-4da641ce5139-000d8bca"){
            	   flyFromTo(new THREE.Vector3 (-13973.13799946072, -3658.7224225439195, 3593.850470001382),new THREE.Vector3 (-17019.205479700002, 1151.2782752874991, -478.44880705387004));
            	}

            	if(_eventEqBimId=="7ee2d2b1-3e05-43ef-bb1c-4da641ce5139-000d8bc9"){
            	   flyFromTo(new THREE.Vector3 (-13638.438790888518,-3896.1599064723077, 4769.996208347769),new THREE.Vector3 (-16684.506260950002, 913.8407752874991,  697.696944899255));
            	}

            	if(_eventEqBimId=="7ee2d2b1-3e05-43ef-bb1c-4da641ce5139-000d8bf1"){
            	   flyFromTo(new THREE.Vector3 (-10273.470051066317, -3658.722390400695, 3632.926614662907),new THREE.Vector3 ( -13319.537510950002, 1151.2782752874991, -439.37263517887004));
            	}

            	if(_eventEqBimId=="7ee2d2b1-3e05-43ef-bb1c-4da641ce5139-000d8bf0"){
            	   flyFromTo(new THREE.Vector3 (-9847.024748744116, -3925.3776477665815, 4803.46517527492),new THREE.Vector3 (-12893.092198450002, 884.6230018499991, 731.16593903988));
            	}

            	if(_eventEqBimId=="7ee2d2b1-3e05-43ef-bb1c-4da641ce5139-000d8c65"){
            	   flyFromTo(new THREE.Vector3 (-12690.899758921914, -3794.306342632469, 3812.8660405744317),new THREE.Vector3 (-15736.967198450002, 1015.6942909124991, -259.43318205387004));
            	}

            	if(_eventEqBimId=="7ee2d2b1-3e05-43ef-bb1c-4da641ce5139-000d8bef"){
            	   flyFromTo(new THREE.Vector3 (-9800.380237849713, -3761.241873435856, 4235.335265248944),new THREE.Vector3 (-12846.447667200002, 1048.7587440374991, 163.03605622737996));
            	}
            }
            
            
        }
    
    ]);


})(angular, document);