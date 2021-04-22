var makeCircular = function (option){

    this.line   =  [];
    this.center =  [];  
    this.grith  =  "";

    this.CircularX = option.CircularX;
    this.CircularY = option.CircularY;
    this.CircularR = option.CircularR;


    this.CircularPointArray  =  [];

    this.PI = Math.PI;

}

makeCircular.prototype={
     
     init:function () {
            
            //创建点
            this.makePointArray();

            //创建中心点
            this.makeCenter();
            
            this.grith =  this.computeGrith(this.line);
     },
     
     //创建第一的点
     makePoint:function(i,r){
            
        var arrayXY = [];
        var x, y;
                
        x = Math.cos(this.PI / 180 * i) * r + this.CircularX;
        y = Math.sin(this.PI / 180 * i) * r + this.CircularY;

        arrayXY.push(x);
        arrayXY.push(y);
                   
        return arrayXY;

     },

     //创建所有的圆点
     makePointArray:function(){
            for(var i = 0; i < 360; i += 6) {
                var arrayXY = this.makePoint(i,this.CircularR);
                this.line.push(arrayXY);
            }
     },

     //创建中心点
     makeCenter:function(){
           this.center.push(this.CircularX);
           this.center.push(this.CircularY);
     },
     
     //计算边缘周长
     computeGrith:function (array) { 
        var total=0;
        for(var i=0;i<array.length-1;i++){
            var a=Math.sqrt(Math.pow((array[i][0]-array[i+1][0]),2)+Math.pow((array[i][1]-array[i+1][1]),2));
            total=total+a;
        }
        return total;
     },

     //公共数据区      
     name: "日间手术病房区",
     self_id: "1801",
     relative_id: "1901",
     specialSite: "18",

     //基本属性
     y: 0,
     h: 2,
     gap:1,

     //核心数据
     center:this.center,
     line:this.line,
     grith:this.grith

}


