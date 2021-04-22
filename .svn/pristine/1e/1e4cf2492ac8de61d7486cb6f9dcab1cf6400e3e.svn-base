<%@ page language="java" contentType="text/html; charset=utf-8"  pageEncoding="utf-8" %>
<style>
.unit {
	padding-top: 8px;
}
</style>
<div id="angularId" ng-controller="assetDataCtrl" >
	<div class="page-title">
		<div class="title_left">
			<h3>资产数据录入</h3>
		</div>
	</div>
	<div class="row">
		<div class="panel panel-default">
			<div class="panel-heading">资产执行率、收支、经营性资产明细、催缴欠费数据列表
			<button class="btn btn-success pull-right" ng-click="showEditModal()">新增</button>
			</div>
			<div class="panel-body">
				<table class="table table-striped table-hover" style="margin-top: 10px;">
					<thead class="title">
					<tr>
						<th class="text-center">NO</th>
						<th>项目</th>
						<th>月份</th>
						<th>资产执行率、收支、经营性资产明细、催缴欠费</th>
						<th>录入人</th>
						<th>录入时间</th>
						<th>操作</th>
					</tr>
					</thead>
					<tbody>
					<!--  <tr ng-if="pageModel.list.length == 0"><td colspan="100" class="text-center">暂无记录</td></tr>
					<tr ng-repeat="item in pageModel.list" >
						<td class="text-center">{{$index + 1+pageModel.pageSize*pageModel.pageIndex}}</td>
						<td>{{item.ID}}</td>
						<td><a  href='javascript:void(0)' class="btn-link" ng-style="{'text-decoration':item.DATA_STATUS=='0'?'line-through':''}" ng-click='showWorkUnitDetail(item.ID)'>{{item.WORKUNIT_NAME}}</a></td>
						<td>{{item.WORKUNIT_TYPE|keyToValue:workunitTypeDict}}</td>
						<td>{{item.WORKTYPE_NAME}}</td>
						<td>{{item.EXEC_PERSON_NAME}}</td>
						<td>{{item.MANAGE_PERSON_NAME}}</td>
						<td>{{item.EXEC_DATE}}</td>
						<td>{{item.UNIT_STATUS|keyToValue:unitStatusDict}}</td>
						<td>{{item.SUPERVISE_PERSON_NAMES}}</td>
					</tr>-->
					<tr>
					  <td>1</td>
					  <td>丽岛2046</td>
					  <td>2017-02-05</td>
					  <td><a  href='javascript:void(0)' class="btn-link"  ng-click='showDetailModal()'>查看详情</a></td>
					  <td>张三</td>
					  <td>2017-03-06 10:35:36</td>
					  <td><a class='btn btn-xs sys-permission sys-permission-edit' ng-click="showEditModal()"><i class='fa fa-edit'></i>编辑</a></td>
					</tr>
					<tr>
					  <td>1</td>
					  <td>丽岛2046</td>
					  <td>2017-02-05</td>
					  <td><a  href='javascript:void(0)' class="btn-link"  ng-click='showDetailModal()'>查看详情</a></td>
					  <td>张三</td>
					  <td>2017-03-06 10:35:36</td>
					  <td><a class='btn btn-xs sys-permission sys-permission-edit' ng-click="showEditModal()"><i class='fa fa-edit'></i>编辑</a></td>
					</tr>
					<tr>
					  <td>1</td>
					  <td>丽岛2046</td>
					  <td>2017-02-05</td>
					  <td><a  href='javascript:void(0)' class="btn-link"  ng-click='showDetailModal()'>查看详情</a></td>
					  <td>张三</td>
					  <td>2017-03-06 10:35:36</td>
					  <td><a class='btn btn-xs sys-permission sys-permission-edit' ng-click="showEditModal()"><i class='fa fa-edit'></i>编辑</a></td>
					</tr>
					<tr>
					  <td>1</td>
					  <td>丽岛2046</td>
					  <td>2017-02-05</td>
					  <td><a  href='javascript:void(0)' class="btn-link"  ng-click='showDetailModal()'>查看详情</a></td>
					  <td>张三</td>
					  <td>2017-03-06 10:35:36</td>
					  <td><a class='btn btn-xs sys-permission sys-permission-edit' ng-click="showEditModal()"><i class='fa fa-edit'></i>编辑</a></td>
					</tr>
					<tr>
					  <td>1</td>
					  <td>丽岛2046</td>
					  <td>2017-02-05</td>
					  <td><a  href='javascript:void(0)' class="btn-link"  ng-click='showDetailModal()'>查看详情</a></td>
					  <td>张三</td>
					  <td>2017-03-06 10:35:36</td>
					  <td><a class='btn btn-xs sys-permission sys-permission-edit' ng-click="showEditModal()"><i class='fa fa-edit'></i>编辑</a></td>
					</tr>
					</tbody>
				</table>
				<div class="page-footer clearfix">
					<ng-include src="'/ovu-pcos/common/pager.html'"></ng-include>
				</div>
			</div>
		</div>


	</div>
</div>
<%@ include file="/common/modal.worktype.tree.jsp" %>
<script >
	(function() {
		document.title ="OVU-资产数据录入";
		var app = angular.module("angularApp");
		//人员异动ctl
		app.controller('assetDataCtrl', function ($scope,$rootScope, $http,$filter,$uibModal,fac) {
			$scope.search = {parkId:'${act_park.ID}',DATA_STATUS:'1'};
			function hasActivePark() {
				if (!$scope.search.parkId) {
					alert("请选择项目！");
					return false;
				} else {
					return true;
				}
			}

			$scope.find = function(pageNo){
				if(!hasActivePark()){
					return;
				}
				$.extend($scope.search,{currentPage:pageNo||$scope.pageModel.currentPage||1,pageSize:$scope.pageModel.pageSize||10});
				$scope.search.pageIndex = $scope.search.currentPage-1;
				$scope.search.totalCount = $scope.pageModel.totalCount||0;
				fac.getPageResult("/ovu-pcos/pcos/workunit/parkWorkunitlist.do",$scope.search,function(data){
					$scope.pageModel = data;
				});
			};
			//编辑
			$scope.showEditModal = function () {
				var modal = $uibModal.open({
					animation: false,
					size: 'lg',
					templateUrl: '/ovu-pcos/common/modal.assetData.html',
					controller: 'assetDataModalCtrl'
				});
				modal.result.then(function () {
					
				}, function () {
					console.info('Modal dismissed at: ' + new Date());
				});
			}
			$scope.showDetailModal = function () {
				var modal = $uibModal.open({
					animation: false,
					size: 'lg',
					templateUrl: '/ovu-pcos/common/modal.assetDataDetail.html',
					controller: 'assetDataDetailModalCtrl'
				});
				modal.result.then(function () {
					
				}, function () {
					console.info('Modal dismissed at: ' + new Date());
				});
			}

		});
		
		app.controller('assetDataModalCtrl', function ($scope, $http, $uibModalInstance, $filter, fac) {
			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};

			// 提交
			$scope.getPlainTxt = function () {
			
					$scope.cancel();
			};
			

		});
		
		app.controller('assetDataDetailModalCtrl', function ($scope, $http, $uibModalInstance, $filter, fac) {
			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};
		});

		angular.bootstrap(document.getElementById("angularId"), ['angularApp']);
	})()
</script>