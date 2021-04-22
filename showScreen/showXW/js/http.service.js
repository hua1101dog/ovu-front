'use strict';
angular.module('app').service('httpService', function($http) {
    // 大屏右侧数据接口

    // 运营指标体系 -- 招商指标
     this.getOpeBusiness = function (param) {
        return  $http.get("/ovu-screen-fake/pcos/showbigmap/merchants/list", { params: param });
     }
     // 运营指标体系 -- 产业指标
     this.getOpeIndustry = function (param) {
         return  $http.get("/ovu-screen-fake/pcos/showbigmap/industry/list", { params: param });
      }
     // 运营指标体系 -- 双创指标
     this.getOpeTwoAbilities = function (param) {
         return  $http.get("/ovu-screen-fake/pcos/showbigmap/twoquota/list", { params: param });
      }
     // 运营指标体系 -- 能耗指标
     this.getOpeEnergy = function (param) {
         return  $http.get("/ovu-screen-fake/pcos/showbigmap/energy/list", { params: param });
      }
     // 运营指标体系 -- 设施设备指标
     this.getOpeEquipment = function (param) {
         return  $http.get("/ovu-screen-fake/pcos/showbigmap/equipments/list", { params: param });
     }


    // 企业服务中心 -- 空间
    this.getComSpace = function (param) {
        return  $http.get("/ovu-screen-fake/pcos/showbigmap/companyspace/list", { params: param });
    }
     // 企业服务中心 -- 企业
    this.getComfirm = function (param) {
        return  $http.get("/ovu-screen-fake/pcos/showbigmap/enterprise/list", { params: param });
    }
     // 企业服务中心 -- 配套  ( 已有接口 )
    this.getComMain = function (param) {
        return  $http.get("/ovu-screen-fake/showXW/res/staticJson/com.main.json", { params: param });
    }
     // 企业服务中心 -- 活动 ( 已有接口 )
     this.getComActivity = function (param) {
        return  $http.get("/ovu-screen-fake/showXW/res/staticJson/com.activity.json", { params: param });
    }
     // 企业服务中心 -- 服务
     this.getComService = function (param) {
        return  $http.get("/ovu-screen-fake/pcos/showbigmap/service/list", { params: param });
    }
     // 企业服务中心 -- 资产 ( 已有接口 )
     this.getComAssert = function (param) {
        return  $http.get("/ovu-screen-fake/showXW/res/staticJson/com.assert.json", { params: param });
    }


})
