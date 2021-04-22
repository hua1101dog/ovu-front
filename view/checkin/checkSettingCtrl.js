/**
 * Created by Zn on 2017/12/14.
 */
(function () {
  "use strict";
  var app = angular.module("angularApp");
  var map;
  app.controller('checkSettingCtrl', function ($scope, $rootScope, $uibModal, $state, $timeout, $http, $filter, fac) {
    document.title = '签到设置';
    $scope.search = {};
    $scope.pageModel = {};

    app.modulePromiss.then(function () {
      // $scope.$watch('dept.id', function (deptId, oldValue) {
      //     if(deptId){

      //           $scope.search.deptId=deptId;
      //         //   $scope.search.pid= $scope.dept.pid         
      //           $scope.find(); 
      //     }

      // })
      $scope.find();

    })

    $scope.find = function (pageNo) {
      $.extend($scope.search, {
        currentPage: pageNo || $scope.pageModel.currentPage || 1,
        pageSize: $scope.pageModel.pageSize || 10
      });
      fac.getPageResult("/ovu-pcos/pcos/checkIn/point/list", $scope.search, function (data) {
        $scope.pageModel = data;
      });
    }
    $scope.del = function (item) {
      confirm("是否删除？", function () {
        $http.post('/ovu-pcos/pcos/checkIn/point/delete', { checkPointId: item.checkPointId }, fac.postConfig).success(function (data) {
          if (data.success) {
            msg("删除成功");
            $scope.find();
          } else {
            alert("失败");
          }
        });
      })
    }
    $scope.showModal = function (item, flag) {
      var copy = angular.extend({ PARK_TYPE: 1 }, item);
      var isAdd = "新增";
      item == undefined ? item = { isAdd: isAdd, flag: flag } : item;
      item.isAdd = isAdd;
      item.flag = flag;
      var modal = $uibModal.open({
        animation: false,
        size: 'lg',
        templateUrl: '/view/checkin/modal.showModal.html',
        controller: 'showModalCtrl',
        resolve: {
          param: item
        }
      });
      modal.result.then(function () {
        $scope.find();
      }, function () {
        console.info('Modal dismissed at: ' + new Date());
      });
      // modal.rendered.then(function () {
      //     /* $('input').keydown(function (e) {
      //      if(e.keyCode==13){
      //      $(this).blur();
      //      }
      //      })*/
      //     var circle;
      //     var marker;
      //     map = new AMap.Map('container', {
      //         resizeEnable: true,
      //         zoom: 13
      //     });
      //     AMap.plugin(['AMap.Autocomplete'], function () {
      //         // 如果是编辑界面 获取已选城市 搜索范围锁定在该城市  选中了武汉市 搜索建设银行 优先显示武汉的建设银行
      //         var city = '';
      //         /* var arr = copy.CITY.split(',');
      //          if (arr && arr[1]) {
      //          city = arr[1];
      //          }*/
      //         var autoOptions = {
      //             city: city, //城市，默认全国
      //             input: "map-keyword", //使用联想输入的input的id
      //         };
      //         var autocomplete = new AMap.Autocomplete(autoOptions);
      //         // 搜索点 每次打点之前 先把以前搜索出来的点清除了

      //         function addSearchMarker(map, position, title) {
      //             map.clearMap();
      //             new AMap.Marker({
      //                 position: position,
      //                 title: title,
      //                 map: map,
      //             });
      //             $timeout(function () {
      //                 item.mapLng = position[0];
      //                 item.mapLat = position[1];
      //                 item.checkInAddress = title;
      //             })
      //             getCircle(position[0], position[1], item.checkInRange);
      //             circle.setMap(map);
      //         }


      //         function autoSelectHandler(e){
      //             var location = e.poi.location;
      //             var adcode = e.poi.adcode;
      //             // setCity 有一些点不能正常设置  搜索王元(公交站) adcode 320812 不能正常设置
      //             // copy.map.setCity(e.poi.adcode);
      //             // console.log(e.poi);
      //             if (location) {
      //                 map.setCenter(location);
      //                 var position = [location.lng, location.lat];
      //                 var title = e.poi.name;
      //                 addSearchMarker(map, position, title);
      //             } else if (e.poi.adcode) {
      //                 map.setCity(adcode);
      //                 $timeout(function () {
      //                     item.checkInAddress = e.poi.name;
      //                 })
      //                 console.log('该poi点没有具体的经纬度坐标,不能添加marker点,搜索的极有可能是一个市或者更大的范围');
      //             }
      //         }

      //         AMap.event.addListener(autocomplete, "select", autoSelectHandler);

      //         AMap.event.addListener(autocomplete, "choose", function (e) {
      //             $('#map-keyword').one('keydown',function (event) {
      //                 if(event.keyCode==13){
      //                     console.log(e);
      //                     $('.amap-sug-result').css({
      //                         visibility:'hidden',
      //                         display:'none'
      //                     });
      //                     autoSelectHandler(e);
      //                 }
      //             })
      //             /*$('#map-keyword').keydown(function (event) {
      //                 if(event.keyCode==13){
      //                     console.log(e);
      //                 }
      //             })*/
      //         });

      //         // 如果选择了行政区，就设置所在城市
      //         $rootScope.$on('选择了行政区', function (e, data) {
      //             var arr = data.split(',');
      //             if (arr[1]) {
      //                 autocomplete.setCity(arr[1]);
      //             }
      //         });
      //     });

      //     console.log(item);
      //     //为地图注册click事件获取鼠标点击出的经纬度坐标
      //     $timeout(function () {
      //         if (item.mapLng && item.mapLat) {
      //             map.clearMap();
      //             map.setCenter([item.mapLng, item.mapLat])
      //             new AMap.Marker({
      //                 map: map,
      //                 position: [item.mapLng, item.mapLat]
      //             });
      //             getCircle(item.mapLng, item.mapLat, item.checkInRange);
      //             //将圆形扩状物加载到地图上
      //             circle.setMap(map);
      //         }
      //     },500)
      //     function getCircle(mapLng, mapLat, radius) {
      //         return circle = new AMap.Circle({
      //             //设置圆心位置
      //             center: [mapLng, mapLat],
      //             //设置圆的半径m
      //             radius: radius || 100,
      //             //设置圆形填充透明度
      //             fillOpacity: 0.3,
      //             //圆形填充颜色
      //             fillColor: '#ffc68d',
      //             //设置线条颜色
      //             strokeColor: '#09f',
      //             //轮廓线宽度
      //             strokeWeight: 1,
      //             bubble: true
      //         })
      //     }

      //     map.on('click', function (e) {
      //         map.clearMap();
      //         $timeout(function () {
      //             item.mapLng = e.lnglat.lng;
      //             item.mapLat = e.lnglat.lat;
      //             map.setCenter([item.mapLng, item.mapLat])
      //         })
      //         marker = new AMap.Marker({
      //             map: map,
      //             position: e.lnglat
      //         });

      //         getCircle(e.lnglat.lng, e.lnglat.lat, item.checkInRange);
      //         //将圆形扩状物加载到地图上
      //         circle.setMap(map);
      //         // console.log(e.lnglat);
      //         // copy.POSITION = e.lnglat.lng + "," + e.lnglat.lat;
      //         // console.log(copy);
      //         // addMarker(copy);
      //         // $scope.$apply();
      //         //document.getElementById("lnglat").value = e.lnglat.getLng() + ',' + e.lnglat.getLat()
      //     });
      //     $timeout(function () {
      //         //刷新地图中园的半径
      //         $rootScope.$on("refreshCircle", function (event, data) {
      //             map.clearMap();
      //             new AMap.Marker({
      //                 map: map,
      //                 position: [item.mapLng, item.mapLat]
      //             });
      //             getCircle(item.mapLng, item.mapLat, item.checkInRange);
      //             //将圆形扩状物加载到地图上
      //             circle.setMap(map);
      //         })
      //     })
      // })
    };
  });

  app.controller('showModalCtrl', function ($scope, $rootScope, $http, $uibModal, $uibModalInstance, $timeout, $filter, fac, param) {
    $scope.search = param;
    $scope.search.isNeedProve = 2;
    console.log($scope.search)
    console.log($scope.search.flag)
    console.log($scope.search.isNeedProve)
    var imap;
    var circle;
    $scope.findPark = function (search, fn) {
      var modal = $uibModal.open({
        animation: false,
        size: "lg",
        templateUrl: '/common/modal.select.parks.html',
        controller: 'parksSelectorCtrl',
        resolve: {
          data: function () {
            return { isOnly: true }
          }
        }
      });
      modal.result.then(function (data) {
        search = search || {};
        search.parkName = data.parkName;
        search.parkId = data.id;
        app.park = $scope.park = { id: data.id, parkName: data.parkName, position: [data.mapLng, data.mapLat] };
        $scope.myMap.setCenter($scope.park.position);
      }, function () {
      });
    }

    if (!param.flag && param.checkPointId) {
      //查看详情
      showInfo();


    }
    else {
      //新增或编辑
      showInfo();

    }

    function showInfo () {
      $http.post('/ovu-pcos/pcos/checkIn/point/get', { checkPointId: param.checkPointId }, fac.postConfig).success(function (data) {
        angular.merge($scope.search, data);
        if (!param.flag && param.checkPointId) {
          //查看
          $scope.search.isAdd = '查看';
          $timeout(function () {

            addMarker(param.mapLng, param.mapLat)
            getCircle(param.mapLng, param.mapLat, param.checkInRange);
            circle.setMap($scope.myMap);

          }, 100)
        }
        else if (!param.flag && !param.checkPointId) {
          //新增
        }
        else {
          //编辑
          $scope.search.isAdd = '编辑';
          $timeout(function () {
            addMarker(param.mapLng, param.mapLat)
            getCircle(param.mapLng, param.mapLat, param.checkInRange);
            circle.setMap($scope.myMap);
          }, 100)
        }
      })


    }


    //点击地图
    $scope.clickMap = function ($event, $params) {
      console.log($params)
      $scope.search.mapLng = $params[0].lnglat.lng;
      $scope.search.mapLat = $params[0].lnglat.lat;
      addMarker($params[0].lnglat.lng, $params[0].lnglat.lat, param.checkInRange);
      getCircle($params[0].lnglat.lng, $params[0].lnglat.lat, param.checkInRange);
      circle.setMap($scope.myMap);
    }
    //初始化地图
    $scope.mapOptions = {
      toolbar: true,
      // map-self config
      resizeEnable: true,
      // ui map config
      uiMapCache: false,
      zoom: 16,
      //精简模式
      liteStyle: true,
      expandZoomRange: true
    };
    function addMarker (lng, lat) {
      $scope.markers = [];
      var lnglat = new AMap.LngLat(lng, lat);
      $scope.myMap.setCenter(lnglat);
      $scope.myMap.clearMap();
      $scope.markers.push(new AMap.Marker({
        map: $scope.myMap,
        position: lnglat
      }));
    }
    function getCircle (mapLng, mapLat, radius) {
      return circle = new AMap.Circle({
        //设置圆心位置
        center: [mapLng, mapLat],
        //设置圆的半径m
        radius: radius || 0,
        //设置圆形填充透明度
        fillOpacity: 0.3,
        //圆形填充颜色
        fillColor: '#ffc68d',
        //设置线条颜色
        strokeColor: '#09f',
        //轮廓线宽度
        strokeWeight: 1,
        bubble: true
      })
    }



    $timeout(function () {
      imap = $scope.myMap;
      AMap.plugin(['AMap.Autocomplete'], function () {
        // 如果是编辑界面 获取已选城市 搜索范围锁定在该城市  选中了武汉市 搜索建设银行 优先显示武汉的建设银行
        var city = '';
        // // var arr = copy.CITY.split(',');
        // if (arr && arr[1]) {
        //     // var arr = [];
        //     city = arr[1];
        // }
        var autoOptions = {
          city: city, //城市，默认全国
          input: "map-keyword" //使用联想输入的input的id
        };
        var autocomplete = new AMap.Autocomplete(autoOptions);

        // 搜索点 每次打点之前 先把以前搜索出来的点清除了
        var searchMarkers = [];

        function addSearchMarker (map, position, title) {
          map.remove(searchMarkers);
          var marker = new AMap.Marker({
            position: position,
            title: title,
            map: map,
            icon: '/res/img/mark_bs/mark_bs5.png'
          });
          searchMarkers.push(marker);
          getCircle(position[0], position[1], param.checkInRange);
          circle.setMap($scope.myMap);
        }
        function autoSelect (e) {
          var location = e.poi.location;
          var adcode = e.poi.adcode;
          if (location) {
            // copy.map.setCenter(location);
            imap.setCenter(location);
            var position = [location.lng, location.lat];
            var title = e.poi.name;
            addSearchMarker(imap, position, title);
          } else if (e.poi.adcode) {
            imap.setCity(adcode);
            console.log('该poi点没有具体的经纬度坐标,不能添加marker点,搜索的极有可能是一个市或者更大的范围');
          }

        }
        AMap.event.addListener(autocomplete, "select", autoSelect);
        AMap.event.addListener(autocomplete, "choose", function (e) {
          $('#map-keyword').one('keydown', function (event) {
            if (event.keyCode == 13) {
              console.log(e);
              $('.amap-sug-result').css({
                visibility: 'hidden',
                display: 'none'
              });
              autoSelect(e);
            }
          })
        });
      });
    });
    $timeout(function () {
      //刷新地图中园的半径
      $rootScope.$on("refreshCircle", function (event, data) {
        map.clearMap();
        new AMap.Marker({
          map: map,
          position: [item.mapLng, item.mapLat]
        });
        getCircle(item.mapLng, item.mapLat, param.checkInRange);
        //将圆形扩状物加载到地图上
        circle.setMap(map);
      })
    })
    //输入范围时动态展示圆环半径
    $scope.$watch('search.checkInRange', function (newValue, oldValue) {
      if (newValue !== '') {
        if (circle && $scope.search.mapLng && $scope.search.mapLat) {
          $scope.myMap.remove(circle);
          getCircle($scope.search.mapLng, $scope.search.mapLat, newValue);
          circle.setMap($scope.myMap)
        }

      }

    })
    $scope.save = function (form) {
      form.$setSubmitted(true);
      if (!form.$valid) {
        return;
      }

      if ($scope.search.checkInRange <= 100) {
        alert('请输入大于100的数字');
        return;
      }
      if (isNaN($scope.search.checkInRange)) {
        alert('您输入的不是数字');
        return;
      }
      if (isNaN($scope.search.mapLat)) {
        alert('请设置经纬度');
        return;
      }
      if (isNaN($scope.search.mapLng)) {
        alert('请设置经纬度');
        return;
      }
      var params = {
        parkName: $scope.search.parkName,
        checkInAddress: $scope.search.checkInAddress,
        parkId: $scope.search.parkId,
        checkInName: $scope.search.checkInName,
        checkInRange: $scope.search.checkInRange,
        mapLat: $scope.search.mapLat,
        mapLng: $scope.search.mapLng,
        checkPointId: param.checkPointId,
        isNeedProve: $scope.search.isNeedProve,
      }
      $http.post('/ovu-pcos/pcos/checkIn/point/edit', params, fac.postConfig).success(function (data) {
        /* $http.post('/ovu-pcos/pcos/checkIn/point/edit',$scope.search,{headers: {"Content-Type": "form"}}).success(function (data) {*/
        if (data.success) {
          msg();
          $uibModalInstance.close();
        }
        else {
          alert();
        }
      })
    }
    $scope.cancel = function () {
      /* $uibModalInstance.dismiss('cancel');*/
      $uibModalInstance.close();
    };

  });
})();
