/**
 * Created by Cx on 2019/4/9.
 */
(function () {
    "use strict";
    var app = angular.module("angularApp");

    app.controller('holidaySettingCtrl', function ($scope, $rootScope, $uibModal, $state, $http, $filter, fac) {
        document.title='OVU-节假日设置';
        $scope.search={};
        $scope.canEdit=false;
        $scope.selectList=[];
        $scope.thisYear=moment().format('YYYY')
        $scope.monthList=[
        {monthName:'一',month:'01'},
        {monthName:'二',month:'02'},
        {monthName:'三',month:'03'},
        {monthName:'四',month:'04'},
        {monthName:'五',month:'05'},
        {monthName:'六',month:'06'},
        {monthName:'七',month:'07'},
        {monthName:'八',month:'08'},
       {monthName:'九',month:'09'},
        {monthName:'十',month:'10'},
        {monthName:'十一',month:'11'},
        {monthName:'十二',month:'12'},
        ];
        
        
        if(new Date().getMonth()==11){
            //如果当前月是12月 那么展示明年的数据
            $scope.yearList=[moment().subtract(1, 'year').format('YYYY'),moment().format('YYYY'),new Date().getFullYear()+1+''];

        }else{
            $scope.yearList=[moment().subtract(2, 'year').format('YYYY'),moment().subtract(1, 'year').format('YYYY'),moment().format('YYYY')];

        }
        //每个月第一天是星期几
        function getFirstDayAtWeek (date) {
            var date = new Date(date)
          
            return date.getDay()
        }
        var   curDate=new   Date();
        //是否是过去日期
        function isPassDay(d){
            var flag;
          
          var dt=  new   Date(Date.parse(d.replace(/-/g,"/")))
      
          if(dt <=curDate){
            flag=true
            
            }else{
                flag=false  
            }
            return flag
        }
       
        $scope.find=(year)=>{
            $scope.selectList=[]
            $http.get('/ovu-base/sys/holiday/getHolidays?year='+year).success(function(res){
              res.data.forEach((v)=>{
                $scope.monthList.forEach((date)=>{
                    date.dateList.forEach((d)=>{
                        if(v.day==d.date){
                            //已选中
                            d.isSelect=true;
                            $scope.selectList.push(d)
                         }
                    })
                     
                })
      
              })
            })
        }
       
      
       $scope.select=function(year){
        $scope.curYear=year;
        $scope.canEdit=false;
        $scope.monthOffdays=[];
        $scope.monthList.forEach((v)=>{
            if(v.month=='01' || v.month=='03' || v.month=='05' || v.month=='07' || v.month=='08' || v.month=='10' || v.month=='12'){
                v.dayArry= [...Array(32).keys()];
                var value= v.dayArry.shift()

            }else if(v.month=='02'){
                if(year%400 === 0 || (year%4 === 0 && year%100 !== 0)){
                    //闰年
                    v.dayArry= [...Array(30).keys()];
                    var value= v.dayArry.shift()
                }else{
                    v.dayArry= [...Array(29).keys()];
                    var value= v.dayArry.shift()
                    
                }
            }else{
                v.dayArry= [...Array(31).keys()];
                var value= v.dayArry.shift()
            }
            v.dateList=[];
            
            v.dayArry.forEach((d,index)=>{
               if( d<10){
                  d='0'+d;
                 }
                        v.dateList.push(
                            {
                                date:$scope.curYear+'-'+v.month +'-'+d,  //日期格式
                                weekNum:getFirstDayAtWeek($scope.curYear+'-'+v.month +'-'+d), //星期
                                day:d+'' , //day,
                                isPassDay:isPassDay($scope.curYear+'-'+v.month +'-'+d), //是否是过去日
                                isSelect:false
                            })
                    })

           
            var str=$scope.curYear+','+v.month+','+'01'
          v.week= getFirstDayAtWeek(str);
          v.emptyList=new Array(v.week-0)
            
        })
        $scope.find($scope.curYear);
        
       }
       $scope.monthOffdays=[];
      
       $scope.select($scope.yearList[2]);
  

       $scope.edit=function(flag){
        $scope.canEdit=flag;
        if(!flag){
            //取消
            $scope.monthOffdays=[];
            $scope.select($scope.curYear)
        }
       
       }
         //切换休息日
    
      $scope.toggle=function(num,item){
          //判断是input 选择还是日历选择
          if(item){
               //点击日历
               if(item.isPassDay){
                 return
               }
               item.isSelect=!item.isSelect
               if(item.isSelect && (!item.isPassDay)){
                   //如果选中，则push
                 $scope.selectList.push(item)
               }else{
               var index = $scope.selectList.findIndex((v,i)=>{
                    return item==v
                 })
                $scope.selectList.splice(index,1)
               }
               
          }else{
               //如果是日历选择
            //   先判断是选中还是取消选中
            if($scope.monthOffdays.indexOf(num)>-1){
                //如果已经选中 再次点击 则取消
                $scope.monthOffdays.splice($scope.monthOffdays.indexOf(num),1);
                $scope.monthList.forEach((v)=>{
                      v.dateList.forEach((date)=>{
                         if((date.weekNum==num) && (!date.isPassDay)){
                            date.isSelect=false //样式取消
                         
                         }
                        
                      })
                     
                      var i=0;
                	$scope.selectList && $scope.selectList.forEach(function (dt) {
                		if(dt.weekNum==num){
                			 $scope.selectList.splice(i, 1);
                			 return;

                		}
                    i++;
                    })  
                })
               
               
            }else{
                  //如果未选中 ,则样式变为选中
                  $scope.monthOffdays.push(num);
                  $scope.monthList.forEach((v)=>{
                      v.dateList.forEach((date)=>{
                         if(date.weekNum==num){
                          //如果不是过去时间 并且不在已选的List里
                            if(!date.isPassDay &&  ($scope.selectList.indexOf(date)<0)){
                                date.isSelect=true //样式选中
                              $scope.selectList.push(date)  //从已选的记录中添加
                            }
                              
                         }
                      })                   
                })
            }
          }
        
   
      
      }
    

       $scope.save=function(){
        confirm("确定保存当前休息日设置吗？", function () {
            var year=$scope.curYear;
            var days=[];
            $scope.selectList.forEach((v)=>{
                days.push(v.date)
            })
            var params={
                year:year,
                days:days.join(',')
                // days:'2019-05-02'
           
            }
            
            $http.post('/ovu-base/sys/holiday/save', params, fac.postConfig).success(function (data) {
                if (data.code==0) {
                    msg(data.msg);
                    $scope.select($scope.curYear);
                    $scope.canEdit=false;
                    $scope.monthOffdays=[];
                } else {
                    alert(data.msg);
                }
            });
        })
       }
    
       
    });

})();
