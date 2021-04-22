(function() {
	document.title ="OVU-空间拆分";
	var app = angular.module("angularApp");
	app.controller('spaceSeparate_houseCtrl', function ($stateParams, $scope, $rootScope, $http, $filter, $uibModal, fac, $state, $timeout, $location) {
		var curPage;
        setTimeout(function () {
            curPage = $rootScope.getCurTabPage($rootScope.pages.active, $rootScope.pages);
        })
       
	  
		$scope.resolutionData=[{},{}]
	
		//获取最大房号
		function code() {
           
			$http.get('/ovu-base/house/space/max?id='+ localStorage.getItem("houseRecord_id")).success(function (resp) {
			if (resp.code==0) {
			   $scope.maxHouseCode=resp.data
			   if($scope.maxHouseCode>998){
				aler('房屋已达上限，不可拆分')
				$scope.$emit('needToClose', curPage);
				$rootScope.$emit("findPage");
			   
		  }
			  
			
			} else {
				alert(resp.msg);
			}
		});
	}
	//前面补0
	$scope.PrefixInteger=function(num, length) {
		  if(num>999){
			 alert('最大房屋编码为999,不可再进行拆分')
			 return
		  }
		return (Array(length).join('0') + num).slice(-length);
	  }
	 
		function getData(){
			$http.get('/ovu-base/house/space/houseDetail?id='+ localStorage.getItem("houseRecord_id")).success(function (resp) {
				if (resp.code == 0){
					//原始信息
					$scope.originalData = resp.data;
					
					$scope.houseNo=$scope.originalData.houseNo
					$scope.houseNoCopy=$scope.houseNo.substring(0,$scope.houseNo.length-3)
				
				
					$scope.houseType = $rootScope.dicData['HOUSE_TYPE'];
					$scope.isDecoration = $rootScope.dicData['HOUSE_IS_DECORATION'];
					$scope.houseStatus= $rootScope.dicData['HOUSE_STATUS']
					 if(resp.data.rmCat){
						$scope.treeTypeList = $rootScope.dicData[resp.data.rmCat];
					
					 }
				  
	
				}else{
					alert(resp.msg)
				
				}
			});
			
		}
		code();
		fac.loadSelect($scope,null,function(){
		
			getData()
			//房屋子空间
		$http.get('/ovu-base/house/space/childrenList?id='+ localStorage.getItem("houseRecord_id")).success(function (resp) {
		    if (resp.code == 0){
		        //原始信息
				$scope.resolutionData = resp.data
				if(!$scope.resolutionData || $scope.resolutionData.length==0){
					$scope.resolutionData=[{
						houseCode:$scope.PrefixInteger($scope.maxHouseCode-0+1,3)
					},{
						houseCode:$scope.PrefixInteger($scope.maxHouseCode-0+2,3)
					}]
				
					}else{
						$scope.resolutionData.forEach(v=>{
							if(v.rmCat){
								v.treeTypeList = $rootScope.dicData[v.rmCat];
								v.houseCode=v.houseNo.substring(v.houseNo.length-3)
							
							 }
						})	
					}
		    }else{
				
				alert(resp.msg)
			
			}
		});
		});
       
		//房屋信息
		

		$scope.selectHouseType = function (item) {
           
            item.treeTypeList = $rootScope.dicData[item.rmCat];

        }
        //获取已有的空间的数组长度
		
		$scope.getHasIdData=function(data){
            var arr=[]
            data.forEach(ele => {
                    if(ele.id){
                        arr.push(ele)
                    }
                });
                return arr
        }
        
	     $scope.setData=function(){
			var arr=$scope.getHasIdData($scope.resolutionData)
			// 新增的空间的房屋编码=最大值+当前房屋的index+1 - 已有的房屋的数组的长度
			$scope.resolutionData.forEach((v,i)=>{
				if(!v.id){
				  v.houseCode=$scope.PrefixInteger($scope.maxHouseCode+(i+1-arr.length),3)
				}
			})
		 }

		$scope.del = function (event, index,item) {
			
			$scope.resolutionData.splice(index, 1);
			
			$scope.setData()

			$scope.resolutionData[$scope.resolutionData.length-1]['area']=(($scope.resolutionData[$scope.resolutionData.length-1]['area']*1000)+(item.area*1000))/1000
			$scope.resolutionData[$scope.resolutionData.length-1]['areaProperty']=(($scope.resolutionData[$scope.resolutionData.length-1]['areaProperty'])*1000+(item.areaProperty)*1000)/1000
		
		}
		$scope.clearVal=function(k){
			$scope.resolutionData[$scope.resolutionData.length-1][k]=0
		}
		//拆分
		$scope.resolution=function(){
			 if($scope.maxHouseCode+1==999){
				aler('房屋已达上限，不可拆分')
			 }else{
				if($scope.resolutionData[$scope.resolutionData.length-1].houseCode==999){
					aler('房屋已达上限，不可拆分')
					return
				}
			
				$scope.resolutionData.push({
					houseCode:''
				})
				$scope.setData()
				
			 }
		}
		function Subtr(arg1,arg2){ 
			  var r1,r2,m,n; 
			  try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0} 
			  try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0} 
			  m=Math.pow(10,Math.max(r1,r2)); 
			  n=(r1>=r2)?r1:r2; 
			  return ((arg1*m-arg2*m)/m).toFixed(n); 
			}
		$scope.getPPValue=function(item,pval,k,flag){
			var str=''
			var total=0
		
		 if(flag){
			 //使用面积
			 str='使用'
		 }else{
			str='建筑' 
		 }
		 
		   
		  if( item[k]>pval){
			alert(str+'面积不能大于总的'+str+'面积,请重新输入！')
			item[k]=0
		
			
		  }else{
			for(var i=$scope.resolutionData.length-1;i>=0;i--){
				$scope.resolutionData[i][k]=$scope.resolutionData[i][k] || 0
				total += ($scope.resolutionData[i][k]-0);
			   }
			 if(item[k]>pval-total+item[k]){
				alert(str+'面积不能大于总的'+str+'面积,请重新输入！')
				item[k]=0
				
			 }else{
				
				$scope.resolutionData[$scope.resolutionData.length-1][k]=Subtr(pval,total)-0
			 }
		  }
		 
		  
		}
        //保存
		$scope.saveInfo = function (chai) {
		    
		   
		 
			var arr=[]
			if($scope.resolutionData.length<2){
			  alert('至少拆成2个房屋')
			  return
			}
			$scope.resolutionData.forEach((v,i)=>{
				arr.push({
					area:v.area,
					areaProperty:v.areaProperty,
					houseName:v.houseName,
					rmShortName:v.rmShortName,
					rmType:v.rmType,
					rmCat:v.rmCat,
					isDecoration:v.isDecoration,
					rmStatus:v.rmStatus,
					houseNo:v.houseNo || $scope.houseNoCopy+''+v.houseCode,
					isEmtHouse:v.isEmtHouse,
					id:v.id

				})
			})
			
		    chai.$setSubmitted(true);
		    if (!chai.$valid) {
		        return;
		    }
            
		 
		    $scope.saveData = {
				
				
				parentHouseId:  localStorage.getItem("houseRecord_id"),
		        parkHouseList: arr,
		       
		       
			
		};
                      
		    $http.post('/ovu-base/house/space/save', $scope.saveData).success(function (resp) {
		        if (resp.code==0) {
					msg(resp.msg);
					$scope.$emit('needToClose', curPage);
					$rootScope.$emit("findPage");
					// $rootScope.target('houseRecord/houseRecord',"房屋档案管理",false,'',{ },'houseRecord/houseRecord');
		        } else {
		            alert(resp.msg);
		        }
		    });
		};
		$scope.cancle = function(){
           
		}
		
		
	
	
		
	});
})()
